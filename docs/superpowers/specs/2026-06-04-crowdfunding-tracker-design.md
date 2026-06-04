# Crowdfunding Tracker Design

Date: 2026-06-04
Target repo: `pa023315/vision-builders-kit-70`

## Goal

Add a daily-updated video game crowdfunding tracker to the existing GameCF site. The tracker should collect candidate projects from Kickstarter and CAMPFIRE, classify whether each project is a digital video game, let admins review uncertain results inside the existing admin area, and publish only approved projects to the public site.

The first version prioritizes correctness, low request volume, and admin control over full automation.

## Current Site Context

The repo is a Vite + React + Supabase app.

Relevant existing files:

- `src/pages/GlobalData.tsx` displays Kickstarter and CAMPFIRE international data.
- `src/pages/Admin.tsx` defines the protected admin tabs.
- `src/components/admin/KickstarterProjectsAdmin.tsx` manages manual Kickstarter project data.
- `src/components/admin/CampfireProjectsAdmin.tsx` manages manual CAMPFIRE project data.
- `src/hooks/useProjects.ts` reads and writes the existing `projects` table.
- `src/lib/supabase.ts` defines the current frontend `Project` type.
- `supabase/migrations/20250815140851_6f4aba31-b7e9-4915-9d88-4bcaba6d134b.sql` creates the existing `projects` table.

The current `projects` table is suitable for public display and historical statistics, but it does not track crawl status, source metadata, classification confidence, manual review state, or fetch logs. The tracker should therefore use dedicated tables and only surface approved results into the public experience.

## Architecture

The feature has four parts:

1. Daily fetch job
   - Runs once per day.
   - Fetches candidate project listings from Kickstarter Advanced Search and CAMPFIRE game search.
   - Uses low-frequency requests, limited page depth, retries, and graceful failure handling.

2. Classification pipeline
   - Scores each candidate using positive video game signals and negative non-video-game signals.
   - Classifies candidates as `approved`, `review`, or `rejected`.
   - Preserves manual admin decisions across future daily updates.

3. Admin review UI
   - Integrated into the existing `/admin` area.
   - Adds a tracker/review area for `待審`, `已公開`, `已排除`, and `抓取紀錄`.
   - Lets admins approve, reject, permanently ignore, annotate, and optionally trigger a single-project refresh.

4. Public display
   - Shows only approved digital video game projects.
   - Can be integrated into `/global-data` or added as a dedicated page linked from the header.
   - Shows platform, title, cover image, funding progress, backers, status, source link, and last update time.

## Data Model

Add a new tracker table instead of overloading `projects`.

### `crowdfunding_tracked_projects`

Suggested columns:

- `id uuid primary key default gen_random_uuid()`
- `platform text not null check (platform in ('kickstarter', 'campfire'))`
- `source_id text`
- `source_url text not null`
- `title text not null`
- `creator text`
- `description text`
- `image_url text`
- `country text`
- `currency text`
- `pledged_amount bigint default 0`
- `goal_amount bigint default 0`
- `percent_funded numeric default 0`
- `backer_count integer default 0`
- `start_at timestamptz`
- `end_at timestamptz`
- `project_status text not null default 'unknown'`
- `auto_classification text not null default 'review'`
- `manual_classification text`
- `effective_classification text not null default 'review'`
- `confidence numeric not null default 0`
- `classification_reasons text[] not null default '{}'`
- `ignore_forever boolean not null default false`
- `admin_note text`
- `raw_payload jsonb`
- `first_seen_at timestamptz not null default now()`
- `last_seen_at timestamptz not null default now()`
- `last_fetched_at timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Unique key for the first version:

- `(platform, source_url)`

`source_id` is stored when available, but it is not used as the first-version unique key because source-specific IDs may not be present in every listing response.

Effective classification rules:

- If `ignore_forever = true`, never publish.
- If `manual_classification` is set, use it.
- Otherwise use `auto_classification`.
- The fetch/classification job updates `effective_classification` whenever it changes `ignore_forever`, `manual_classification`, or `auto_classification`.

### `crowdfunding_fetch_runs`

Suggested columns:

- `id uuid primary key default gen_random_uuid()`
- `source text not null`
- `started_at timestamptz not null default now()`
- `finished_at timestamptz`
- `status text not null default 'running'`
- `pages_requested integer default 0`
- `candidates_found integer default 0`
- `created_count integer default 0`
- `updated_count integer default 0`
- `approved_count integer default 0`
- `review_count integer default 0`
- `rejected_count integer default 0`
- `error_message text`
- `metadata jsonb`

### Relationship To Existing `projects`

First-version behavior:

- Keep `projects` as the historical/manual display table.
- Add tracker tables for automated discovery and review.
- Update `/global-data` to show approved tracker records in a "live tracker" section.
- Do not automatically create or update `projects` rows when tracker records are approved.

This avoids changing existing statistics behavior before the tracker has proven reliable.

## Source Fetching

### Kickstarter

Source URL:

`https://www.kickstarter.com/discover/advanced?category_id=35&sort=magic&seed=2967584&page=1`

Kickstarter Advanced Search can filter by category and other discovery dimensions, so it is useful as a candidate source. It must not be trusted as the final video-game classifier because category results may include non-digital-game projects.

Fetch behavior:

- Start with 3 pages per daily run.
- Cap at 5 pages unless the admin explicitly increases it.
- Add delay between requests.
- If blocked or empty, record a failed fetch run and keep previous approved data.
- Do not make the public page depend on real-time Kickstarter access.

### CAMPFIRE

Source URL:

`https://camp-fire.jp/projects/search?category=game`

Fetch behavior:

- Start with the first 3 pages or the first visible result batches.
- CAMPFIRE game category is treated as candidate input only.
- Japanese keyword classification is required because game category pages can include board games, goods, events, and mixed-media projects.

## Video Game Classification

The classifier uses a confidence score plus hard review/reject rules.

Positive signals:

- Platform and store terms: `Steam`, `Nintendo Switch`, `PlayStation`, `PS5`, `Xbox`, `PC`, `Windows`, `Mac`, `itch.io`
- Game proof terms: `gameplay`, `demo`, `playable demo`, `trailer`, `early access`, `alpha`, `beta`
- Engine and development terms: `Unity`, `Unreal`, `Godot`, `game engine`
- Genre terms: `RPG`, `JRPG`, `action game`, `adventure game`, `visual novel`, `metroidvania`, `roguelike`, `simulation`, `pixel art`, `indie game`
- Japanese terms: `ゲーム`, `ビデオゲーム`, `デジタルゲーム`, `Steam`, `体験版`, `デモ版`, `ゲームプレイ`, `Nintendo Switch`

Negative or rejection signals:

- Tabletop terms: `board game`, `tabletop`, `card game`, `TRPG`, `dice`, `miniature`, `TCG`, `playing cards`
- Non-game media terms: `book`, `comic`, `manga`, `artbook`, `novel`, `soundtrack only`
- Goods/event terms: `merch`, `figure`, `plush`, `event`, `exhibition`, `VTuber event`, `goods`
- Japanese terms: `ボードゲーム`, `カードゲーム`, `TRPG`, `グッズ`, `書籍`, `漫画`, `展示`, `イベント`

Classification output:

- `approved`: strong positive score and no hard negative signal.
- `review`: mixed signals, weak positive score, or insufficient metadata.
- `rejected`: strong non-video-game signal with no meaningful digital-game evidence.

Every classification stores `confidence` and `classification_reasons` so admins can understand why a project was sorted.

## Admin UI

Add a tracker management component under `src/components/admin/`, for example:

- `CrowdfundingTrackerAdmin.tsx`

Add a tab in `src/pages/Admin.tsx`, for example:

- Label: `追蹤審核`
- Icon: `Search`, `Radar`, or `ListChecks`

Admin sections:

- `待審`: effective classification is `review`.
- `已公開`: effective classification is `approved`.
- `已排除`: effective classification is `rejected` or `ignore_forever`.
- `抓取紀錄`: rows from `crowdfunding_fetch_runs`.

Per-project display:

- Cover image
- Title
- Platform badge
- Source link
- Description excerpt
- Funding amount, goal, percent, backers
- Project status and end date if available
- Auto classification, manual classification, confidence
- Classification reasons
- Admin note

Actions:

- Approve and publish
- Reject
- Ignore forever
- Clear manual override
- Edit admin note
- Refresh one project when source access allows it

Manual decisions must always override automatic decisions in later daily runs.

## Public UI

First-version placement:

- Add a new live tracker section to `/global-data`.
- Do not add a new public route in the first version.

Public controls:

- Search title and description.
- Filter platform: all, Kickstarter, CAMPFIRE.
- Filter status: active, upcoming, ended, unknown.
- Sort by latest seen, ending soon, percent funded, pledged amount, backers.

Public cards:

- Cover image
- Platform
- Title
- Short description
- Funding progress
- Backers
- Days remaining if known
- Source link
- Last updated timestamp

The public UI should not expose rejected or review items.

## Scheduling

Preferred scheduling:

- GitHub Actions scheduled workflow runs once per day.
- It invokes a Supabase Edge Function or a script that can safely write to Supabase with service role credentials stored in GitHub Secrets.

Alternative scheduling:

- Supabase scheduled Edge Function if enabled.
- Vercel or Netlify cron if the deployment platform supports it.

The fetcher must:

- Record a fetch run for each source.
- Never erase approved data because of one failed source run.
- Keep prior data visible when Kickstarter or CAMPFIRE blocks or changes markup.

## Error Handling

- Source fetch fails: mark fetch run `failed`, keep previous data.
- Source markup changes: store raw error and affected source in `metadata`.
- Project disappears from listing: mark as not seen in the latest run but do not delete immediately.
- Classification cannot decide: set `review`.
- Admin override exists: preserve it.

## Security And Permissions

- Public users can read approved tracker records only.
- Admin users can read all tracker records and update manual review fields.
- Fetch jobs require service role credentials and must not run in the browser.
- Any manual action in admin should rely on existing protected route behavior plus Supabase RLS policies.

The current `projects` policy appears very permissive. Tracker tables should use stricter policies than the existing table.

## Testing

Unit-level tests or script-level checks:

- Classifier approves clear video game examples.
- Classifier rejects board games, card games, books, goods, and events.
- Mixed signals produce `review`.
- Manual classification overrides auto classification.
- Merge logic updates existing rows instead of duplicating them.

UI checks:

- Admin tabs show `待審`, `已公開`, `已排除`, and `抓取紀錄`.
- Admin actions update manual classifications.
- Public page shows approved records only.
- Filters and sorting work on approved records.

Integration checks:

- A successful daily run creates a fetch log and inserts or updates candidates.
- A failed Kickstarter run leaves the previous approved public data visible.
- CAMPFIRE Japanese negative keywords do not get auto-published.

## Acceptance Criteria

- The site has a daily update path for Kickstarter and CAMPFIRE candidates.
- The tracker prevents obvious non-video-game projects from being published automatically.
- Ambiguous projects appear in the existing admin area for review.
- Admin manual decisions survive future daily runs.
- Public users see only approved digital video game crowdfunding projects.
- Fetch failures are visible in admin logs and do not break the public page.
