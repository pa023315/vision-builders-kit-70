# Crowdfunding Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在既有 GameCF 網站加入每日更新的 Kickstarter / CAMPFIRE 電子遊戲群眾募資追蹤器，並整合到 `/admin` 與 `/global-data`。

**Architecture:** 第一版新增 tracker 專用 Supabase 資料表，不改變既有 `projects` 統計資料。每日腳本抓取候選專案、用規則分類、寫入 Supabase；後台負責人工審核，前台只讀取已核准的 tracker 專案。

**Tech Stack:** Vite、React、TypeScript、Supabase、TanStack Query、shadcn/ui、Node ESM scripts、GitHub Actions。

---

## Lovable 與 GitHub 同步要求

網站本體由 Lovable 開發與維護，因此這次實作完成後必須把 commit push 到 GitHub remote：

- Remote: `origin`
- URL: `https://github.com/pa023315/vision-builders-kit-70.git`

實作時要避免引入 Lovable 難以維護的特殊架構。前端仍使用既有 Vite + React + shadcn/ui + Supabase pattern，檔案放在目前 repo 內，讓 Lovable 後續可以從 GitHub 讀到並繼續更新。

## 檔案結構

- Create: `supabase/migrations/20260604000000_create_crowdfunding_tracker.sql`
  - 建立 `crowdfunding_tracked_projects`、`crowdfunding_fetch_runs`、索引、RLS policy、updated_at trigger。
- Modify: `src/integrations/supabase/types.ts`
  - 新增 tracker 相關 table type，讓 typed Supabase client 能讀寫新表。
- Modify: `src/lib/supabase.ts`
  - 新增 `CrowdfundingTrackedProject` 與 `CrowdfundingFetchRun` 前端型別。
- Create: `scripts/crowdfunding/classifier.mjs`
  - 分類核心，輸出 `classifyProject()` 與 `resolveEffectiveClassification()`。
- Create: `scripts/crowdfunding/test-classifier.mjs`
  - 不依賴測試 runner 的分類器檢查腳本。
- Create: `scripts/crowdfunding/fetch-sources.mjs`
  - Kicktraq Video Games / CAMPFIRE 候選來源抓取器；Kicktraq 作為 Kickstarter 專案的主要候選來源。
- Create: `scripts/crowdfunding/test-fetch-kickstarter.mjs`
  - Kicktraq/Kickstarter 抓取 smoke test，提前判斷是否拿到專案資料或 Cloudflare challenge。
- Create: `scripts/crowdfunding/sync-supabase.mjs`
  - 將候選資料 merge 到 Supabase，保留人工覆寫。
- Create: `scripts/crowdfunding/run-daily.mjs`
  - 每日執行入口，建立 fetch run、抓取、分類、同步、錯誤降級。
- Modify: `package.json`
  - 新增 `tracker:test` 與 `tracker:run` script。
- Create: `.github/workflows/crowdfunding-tracker.yml`
  - 每日排程，使用 GitHub Secrets 呼叫 `npm run tracker:run`。
- Create: `src/hooks/useCrowdfundingTracker.ts`
  - 前台與後台查詢、更新人工分類、抓取紀錄 query hooks。
- Create: `src/components/admin/CrowdfundingTrackerAdmin.tsx`
  - 後台審核 UI。
- Modify: `src/pages/Admin.tsx`
  - 新增 `追蹤審核` 分頁。
- Create: `src/components/CrowdfundingTrackerSection.tsx`
  - `/global-data` 使用的已核准專案列表與篩選排序。
- Modify: `src/pages/GlobalData.tsx`
  - 加入即時追蹤區塊。
- Push: `origin`
  - 完成並驗證後推送到 GitHub，讓 Lovable 可以同步最新版本。

## Task 1: Supabase Tracker Schema

**Files:**
- Create: `supabase/migrations/20260604000000_create_crowdfunding_tracker.sql`
- Modify: `src/integrations/supabase/types.ts`
- Modify: `src/lib/supabase.ts`

- [ ] **Step 1: 新增 migration**

Create `supabase/migrations/20260604000000_create_crowdfunding_tracker.sql`:

```sql
CREATE TABLE public.crowdfunding_tracked_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('kickstarter', 'campfire')),
  source_id TEXT,
  source_url TEXT NOT NULL,
  title TEXT NOT NULL,
  creator TEXT,
  description TEXT,
  image_url TEXT,
  country TEXT,
  currency TEXT,
  pledged_amount BIGINT NOT NULL DEFAULT 0,
  goal_amount BIGINT NOT NULL DEFAULT 0,
  percent_funded NUMERIC NOT NULL DEFAULT 0,
  backer_count INTEGER NOT NULL DEFAULT 0,
  start_at TIMESTAMP WITH TIME ZONE,
  end_at TIMESTAMP WITH TIME ZONE,
  project_status TEXT NOT NULL DEFAULT 'unknown' CHECK (project_status IN ('active', 'upcoming', 'ended', 'unknown')),
  auto_classification TEXT NOT NULL DEFAULT 'review' CHECK (auto_classification IN ('approved', 'review', 'rejected')),
  manual_classification TEXT CHECK (manual_classification IN ('approved', 'review', 'rejected')),
  effective_classification TEXT NOT NULL DEFAULT 'review' CHECK (effective_classification IN ('approved', 'review', 'rejected')),
  confidence NUMERIC NOT NULL DEFAULT 0,
  classification_reasons TEXT[] NOT NULL DEFAULT '{}',
  ignore_forever BOOLEAN NOT NULL DEFAULT false,
  admin_note TEXT,
  raw_payload JSONB,
  first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_fetched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (platform, source_url)
);

CREATE TABLE public.crowdfunding_fetch_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('kickstarter', 'campfire', 'all')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  finished_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'failed')),
  pages_requested INTEGER NOT NULL DEFAULT 0,
  candidates_found INTEGER NOT NULL DEFAULT 0,
  created_count INTEGER NOT NULL DEFAULT 0,
  updated_count INTEGER NOT NULL DEFAULT 0,
  approved_count INTEGER NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  rejected_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_crowdfunding_tracked_projects_effective_classification
ON public.crowdfunding_tracked_projects (effective_classification);

CREATE INDEX idx_crowdfunding_tracked_projects_platform
ON public.crowdfunding_tracked_projects (platform);

CREATE INDEX idx_crowdfunding_tracked_projects_last_seen
ON public.crowdfunding_tracked_projects (last_seen_at DESC);

CREATE INDEX idx_crowdfunding_fetch_runs_started
ON public.crowdfunding_fetch_runs (started_at DESC);

ALTER TABLE public.crowdfunding_tracked_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowdfunding_fetch_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved tracker projects are publicly viewable"
ON public.crowdfunding_tracked_projects
FOR SELECT
USING (effective_classification = 'approved' AND ignore_forever = false);

CREATE POLICY "Authenticated users can manage tracker projects"
ON public.crowdfunding_tracked_projects
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view fetch runs"
ON public.crowdfunding_fetch_runs
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can manage fetch runs"
ON public.crowdfunding_fetch_runs
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER update_crowdfunding_tracked_projects_updated_at
BEFORE UPDATE ON public.crowdfunding_tracked_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

- [ ] **Step 2: 更新 Supabase generated types**

Modify `src/integrations/supabase/types.ts` inside `public.Tables`:

```ts
      crowdfunding_tracked_projects: {
        Row: {
          admin_note: string | null
          auto_classification: string
          backer_count: number
          classification_reasons: string[]
          confidence: number
          country: string | null
          created_at: string
          creator: string | null
          currency: string | null
          description: string | null
          effective_classification: string
          end_at: string | null
          first_seen_at: string
          goal_amount: number
          id: string
          ignore_forever: boolean
          image_url: string | null
          last_fetched_at: string | null
          last_seen_at: string
          manual_classification: string | null
          percent_funded: number
          platform: string
          pledged_amount: number
          project_status: string
          raw_payload: Json | null
          source_id: string | null
          source_url: string
          start_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          auto_classification?: string
          backer_count?: number
          classification_reasons?: string[]
          confidence?: number
          country?: string | null
          created_at?: string
          creator?: string | null
          currency?: string | null
          description?: string | null
          effective_classification?: string
          end_at?: string | null
          first_seen_at?: string
          goal_amount?: number
          id?: string
          ignore_forever?: boolean
          image_url?: string | null
          last_fetched_at?: string | null
          last_seen_at?: string
          manual_classification?: string | null
          percent_funded?: number
          platform: string
          pledged_amount?: number
          project_status?: string
          raw_payload?: Json | null
          source_id?: string | null
          source_url: string
          start_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          auto_classification?: string
          backer_count?: number
          classification_reasons?: string[]
          confidence?: number
          country?: string | null
          created_at?: string
          creator?: string | null
          currency?: string | null
          description?: string | null
          effective_classification?: string
          end_at?: string | null
          first_seen_at?: string
          goal_amount?: number
          id?: string
          ignore_forever?: boolean
          image_url?: string | null
          last_fetched_at?: string | null
          last_seen_at?: string
          manual_classification?: string | null
          percent_funded?: number
          platform?: string
          pledged_amount?: number
          project_status?: string
          raw_payload?: Json | null
          source_id?: string | null
          source_url?: string
          start_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      crowdfunding_fetch_runs: {
        Row: {
          approved_count: number
          candidates_found: number
          created_at: string
          created_count: number
          error_message: string | null
          finished_at: string | null
          id: string
          metadata: Json | null
          pages_requested: number
          rejected_count: number
          review_count: number
          source: string
          started_at: string
          status: string
          updated_count: number
        }
        Insert: {
          approved_count?: number
          candidates_found?: number
          created_at?: string
          created_count?: number
          error_message?: string | null
          finished_at?: string | null
          id?: string
          metadata?: Json | null
          pages_requested?: number
          rejected_count?: number
          review_count?: number
          source: string
          started_at?: string
          status?: string
          updated_count?: number
        }
        Update: {
          approved_count?: number
          candidates_found?: number
          created_at?: string
          created_count?: number
          error_message?: string | null
          finished_at?: string | null
          id?: string
          metadata?: Json | null
          pages_requested?: number
          rejected_count?: number
          review_count?: number
          source?: string
          started_at?: string
          status?: string
          updated_count?: number
        }
        Relationships: []
      }
```

- [ ] **Step 3: 新增前端型別**

Modify `src/lib/supabase.ts` after `Project`:

```ts
export type CrowdfundingPlatform = 'kickstarter' | 'campfire'
export type CrowdfundingClassification = 'approved' | 'review' | 'rejected'
export type CrowdfundingProjectStatus = 'active' | 'upcoming' | 'ended' | 'unknown'

export interface CrowdfundingTrackedProject {
  id: string
  platform: CrowdfundingPlatform
  source_id?: string | null
  source_url: string
  title: string
  creator?: string | null
  description?: string | null
  image_url?: string | null
  country?: string | null
  currency?: string | null
  pledged_amount: number
  goal_amount: number
  percent_funded: number
  backer_count: number
  start_at?: string | null
  end_at?: string | null
  project_status: CrowdfundingProjectStatus
  auto_classification: CrowdfundingClassification
  manual_classification?: CrowdfundingClassification | null
  effective_classification: CrowdfundingClassification
  confidence: number
  classification_reasons: string[]
  ignore_forever: boolean
  admin_note?: string | null
  raw_payload?: unknown
  first_seen_at: string
  last_seen_at: string
  last_fetched_at?: string | null
  created_at: string
  updated_at: string
}

export interface CrowdfundingFetchRun {
  id: string
  source: 'kickstarter' | 'campfire' | 'all'
  started_at: string
  finished_at?: string | null
  status: 'running' | 'success' | 'failed'
  pages_requested: number
  candidates_found: number
  created_count: number
  updated_count: number
  approved_count: number
  review_count: number
  rejected_count: number
  error_message?: string | null
  metadata?: unknown
  created_at: string
}
```

- [ ] **Step 4: 驗證 TypeScript build**

Run:

```bash
npm run build
```

Expected: build succeeds with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260604000000_create_crowdfunding_tracker.sql src/integrations/supabase/types.ts src/lib/supabase.ts
git commit -m "feat: add crowdfunding tracker schema"
```

## Task 2: Classifier Module And Script Test

**Files:**
- Create: `scripts/crowdfunding/classifier.mjs`
- Create: `scripts/crowdfunding/test-classifier.mjs`
- Modify: `package.json`

- [ ] **Step 1: 新增分類器**

Create `scripts/crowdfunding/classifier.mjs`:

```js
const positiveSignals = [
  'steam', 'nintendo switch', 'playstation', 'ps5', 'xbox', 'pc', 'windows', 'mac', 'itch.io',
  'gameplay', 'demo', 'playable demo', 'trailer', 'early access', 'alpha', 'beta',
  'unity', 'unreal', 'godot', 'game engine',
  'rpg', 'jrpg', 'action game', 'adventure game', 'visual novel', 'metroidvania',
  'roguelike', 'simulation', 'pixel art', 'indie game',
  'ゲーム', 'ビデオゲーム', 'デジタルゲーム', '体験版', 'デモ版', 'ゲームプレイ'
]

const negativeSignals = [
  'board game', 'tabletop', 'card game', 'trpg', 'dice', 'miniature', 'tcg', 'playing cards',
  'book', 'comic', 'manga', 'artbook', 'novel', 'soundtrack only',
  'merch', 'figure', 'plush', 'event', 'exhibition', 'vtuber event', 'goods',
  'ボードゲーム', 'カードゲーム', 'グッズ', '書籍', '漫画', '展示', 'イベント'
]

function normalizeText(value) {
  return String(value ?? '').toLowerCase()
}

function collectMatches(text, signals) {
  return signals.filter((signal) => text.includes(signal.toLowerCase()))
}

export function resolveEffectiveClassification(project) {
  if (project.ignore_forever) return 'rejected'
  if (project.manual_classification) return project.manual_classification
  return project.auto_classification ?? 'review'
}

export function classifyProject(project) {
  const haystack = normalizeText([
    project.title,
    project.creator,
    project.description,
    project.source_url,
    project.raw_text
  ].join(' '))

  const positiveMatches = collectMatches(haystack, positiveSignals)
  const negativeMatches = collectMatches(haystack, negativeSignals)
  const positiveScore = positiveMatches.length * 20
  const negativeScore = negativeMatches.length * 25
  const rawConfidence = Math.max(0, Math.min(100, positiveScore - negativeScore + 35))
  const reasons = [
    ...positiveMatches.map((signal) => `正向訊號：${signal}`),
    ...negativeMatches.map((signal) => `負向訊號：${signal}`)
  ]

  let autoClassification = 'review'
  if (positiveMatches.length >= 2 && negativeMatches.length === 0 && rawConfidence >= 65) {
    autoClassification = 'approved'
  }
  if (negativeMatches.length >= 1 && positiveMatches.length === 0) {
    autoClassification = 'rejected'
  }
  if (negativeMatches.length >= 2 && positiveMatches.length <= 1) {
    autoClassification = 'rejected'
  }

  if (reasons.length === 0) {
    reasons.push('缺少足夠訊號，需人工審核')
  }

  return {
    auto_classification: autoClassification,
    confidence: rawConfidence,
    classification_reasons: reasons
  }
}
```

- [ ] **Step 2: 新增分類器測試腳本**

Create `scripts/crowdfunding/test-classifier.mjs`:

```js
import assert from 'node:assert/strict'
import { classifyProject, resolveEffectiveClassification } from './classifier.mjs'

const clearVideoGame = classifyProject({
  title: 'A pixel art roguelike RPG for Steam and Nintendo Switch',
  description: 'Playable demo with gameplay trailer built in Unity.'
})
assert.equal(clearVideoGame.auto_classification, 'approved')
assert.ok(clearVideoGame.confidence >= 65)

const clearBoardGame = classifyProject({
  title: 'Fantasy tabletop board game with dice and miniatures',
  description: 'A card game campaign with printed components.'
})
assert.equal(clearBoardGame.auto_classification, 'rejected')

const mixedSignals = classifyProject({
  title: 'Adventure game artbook and soundtrack',
  description: 'Includes Steam key, artbook, and merch rewards.'
})
assert.equal(mixedSignals.auto_classification, 'review')

assert.equal(resolveEffectiveClassification({
  ignore_forever: true,
  manual_classification: 'approved',
  auto_classification: 'approved'
}), 'rejected')

assert.equal(resolveEffectiveClassification({
  ignore_forever: false,
  manual_classification: 'rejected',
  auto_classification: 'approved'
}), 'rejected')

console.log('classifier checks passed')
```

- [ ] **Step 3: 新增 package scripts**

Modify `package.json` scripts:

```json
"tracker:test": "node scripts/crowdfunding/test-classifier.mjs",
"tracker:run": "node scripts/crowdfunding/run-daily.mjs"
```

- [ ] **Step 4: 執行分類器測試**

Run:

```bash
npm run tracker:test
```

Expected output includes:

```text
classifier checks passed
```

- [ ] **Step 5: 驗證 build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add package.json scripts/crowdfunding/classifier.mjs scripts/crowdfunding/test-classifier.mjs
git commit -m "feat: add crowdfunding classifier"
```

## Task 3: Fetch And Supabase Sync Scripts

**Files:**
- Create: `scripts/crowdfunding/fetch-sources.mjs`
- Create: `scripts/crowdfunding/test-fetch-kickstarter.mjs`
- Create: `scripts/crowdfunding/sync-supabase.mjs`
- Create: `scripts/crowdfunding/run-daily.mjs`

- [ ] **Step 1: 新增來源抓取器**

Create `scripts/crowdfunding/fetch-sources.mjs`:

```js
const KICKTRAQ_VIDEO_GAMES_URL = 'https://www.kicktraq.com/categories/games/video%20games/'
const CAMPFIRE_URL = 'https://camp-fire.jp/projects/search?category=game&page='

function absoluteUrl(base, href) {
  try {
    return new URL(href, base).toString()
  } catch {
    return null
  }
}

function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function parseMoney(value) {
  const match = String(value ?? '').match(/^([^0-9.-]*)([0-9,.-]+)/)
  if (!match) return { currency: null, amount: 0 }
  return {
    currency: match[1].trim() || null,
    amount: Number.parseInt(match[2].replace(/[^0-9-]/g, ''), 10) || 0
  }
}

function parseKicktraqProject(block) {
  const linkMatch = block.match(/<h2>\s*<a href=["']([^"']+)["']>([\s\S]*?)<\/a>\s*<\/h2>/i)
  if (!linkMatch) return null

  const imageMatch = block.match(/<img src=["']([^"']+)["']/i)
  const descriptionMatch = block.match(/<\/h2>\s*<div>([\s\S]*?)<\/div>\s*<div class="project-cat">/i)
  const backersMatch = block.match(/Backers:\s*([0-9,]+)/i)
  const fundingMatch = block.match(/Funding:\s*([^<]+?)\s+of\s+([^<]+?)\s+\(<span[^>]*>([0-9,]+)% funded<\/span>\)/i)
  const datesMatch = block.match(/Campaign Dates:\s*([^<]+?)\s*-&gt;\s*([^<]+?)\s*\((\d{4})\)/i)
  const timeLeftMatch = block.match(/Time left:\s*([^<]+?)<br/i)

  const pledged = parseMoney(fundingMatch?.[1])
  const goal = parseMoney(fundingMatch?.[2])
  const title = stripTags(linkMatch[2])

  return {
    platform: 'kickstarter',
    source_url: absoluteUrl('https://www.kicktraq.com', linkMatch[1]),
    title,
    description: stripTags(descriptionMatch?.[1] ?? title),
    image_url: imageMatch?.[1] ?? null,
    currency: pledged.currency ?? goal.currency,
    pledged_amount: pledged.amount,
    goal_amount: goal.amount,
    percent_funded: Number.parseInt((fundingMatch?.[3] ?? '0').replace(/,/g, ''), 10) || 0,
    backer_count: Number.parseInt((backersMatch?.[1] ?? '0').replace(/,/g, ''), 10) || 0,
    project_status: 'active',
    raw_text: stripTags(block),
    raw_payload: {
      source: 'kicktraq',
      campaign_dates: datesMatch ? `${datesMatch[1]} -> ${datesMatch[2]} (${datesMatch[3]})` : null,
      time_left: timeLeftMatch ? stripTags(timeLeftMatch[1]) : null
    }
  }
}

function parseLinks(html, baseUrl, platform) {
  const linkPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  const candidates = []
  const seen = new Set()
  let match

  while ((match = linkPattern.exec(html))) {
    const href = match[1]
    const sourceUrl = absoluteUrl(baseUrl, href)
    if (!sourceUrl || seen.has(sourceUrl)) continue

    const isProjectUrl = platform === 'kickstarter'
      ? sourceUrl.includes('/projects/')
      : sourceUrl.includes('/projects/')

    if (!isProjectUrl) continue

    const title = extractTitleFromAnchor(match[2])
    if (!title || title.length < 3) continue

    seen.add(sourceUrl)
    candidates.push({
      platform,
      source_url: sourceUrl,
      title,
      description: title,
      project_status: 'unknown',
      raw_payload: { title, sourceUrl }
    })
  }

  return candidates
}

function parseKicktraqProjects(html) {
  const blocks = html.match(/<div class="project(?: odd)?">[\s\S]*?<div style="clear: both"><\/div>\s*<\/div>/g) ?? []
  return blocks.map(parseKicktraqProject).filter(Boolean)
}

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'GameCF crowdfunding tracker/1.0 (+https://gamecf.example)',
      Accept: 'text/html,application/xhtml+xml'
    }
  })
  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status} ${response.statusText} for ${url}`)
  }
  const html = await response.text()
  if (html.includes('Just a moment...') && html.includes('challenges.cloudflare.com')) {
    throw new Error(`Cloudflare challenge detected for ${url}`)
  }
  return html
}

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchKickstarterCandidates({ pages = 3 } = {}) {
  const candidates = []
  for (let page = 1; page <= pages; page += 1) {
    const url = page === 1 ? KICKTRAQ_VIDEO_GAMES_URL : `${KICKTRAQ_VIDEO_GAMES_URL}?page=${page}`
    const html = await fetchPage(url)
    candidates.push(...parseKicktraqProjects(html))
    await delay(1200)
  }
  return candidates
}

export async function fetchCampfireCandidates({ pages = 3 } = {}) {
  const candidates = []
  for (let page = 1; page <= pages; page += 1) {
    const url = `${CAMPFIRE_URL}${page}`
    const html = await fetchPage(url)
    candidates.push(...parseLinks(html, url, 'campfire'))
    await delay(1200)
  }
  return candidates
}
```

- [ ] **Step 2: 新增 Kicktraq/Kickstarter smoke test**

Create `scripts/crowdfunding/test-fetch-kickstarter.mjs`:

```js
import { fetchKickstarterCandidates } from './fetch-sources.mjs'

try {
  const candidates = await fetchKickstarterCandidates({ pages: 1 })
  if (candidates.length === 0) {
    throw new Error('Kicktraq smoke test found 0 Kickstarter project candidates')
  }
  console.log(JSON.stringify({
    status: 'ok',
    candidates: candidates.length,
    sample: candidates.slice(0, 3).map((candidate) => ({
      title: candidate.title,
      source_url: candidate.source_url
    }))
  }, null, 2))
} catch (error) {
  console.error(JSON.stringify({
    status: 'failed',
    reason: error instanceof Error ? error.message : String(error)
  }, null, 2))
  process.exit(1)
}
```

- [ ] **Step 3: 先執行 Kicktraq/Kickstarter smoke test**

Run:

```bash
node scripts/crowdfunding/test-fetch-kickstarter.mjs
```

Expected on the first-version fetch path: output JSON with `status: "ok"` and at least one Kicktraq Video Games candidate.

Known current local result from 2026-06-04 test: direct `curl -L` to Kickstarter Advanced Search returned a Cloudflare `Just a moment...` challenge page, while `curl -L https://www.kicktraq.com/categories/games/video%20games/` returned a normal 40KB HTML page containing project title, description, image, Backers, Funding, Campaign Dates, and Time left fields. Use Kicktraq as the primary Kickstarter candidate source.

- [ ] **Step 4: 新增 Supabase sync**

Create `scripts/crowdfunding/sync-supabase.mjs`:

```js
import { createClient } from '@supabase/supabase-js'
import { classifyProject, resolveEffectiveClassification } from './classifier.mjs'

function requireEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env: ${name}`)
  return value
}

export function createServiceClient() {
  return createClient(
    requireEnv('SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false } }
  )
}

export async function createFetchRun(supabase, source, pagesRequested) {
  const { data, error } = await supabase
    .from('crowdfunding_fetch_runs')
    .insert({ source, pages_requested: pagesRequested })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function finishFetchRun(supabase, id, updates) {
  const { error } = await supabase
    .from('crowdfunding_fetch_runs')
    .update({ ...updates, finished_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function syncCandidates(supabase, candidates) {
  const now = new Date().toISOString()
  let createdCount = 0
  let updatedCount = 0
  const counts = { approved: 0, review: 0, rejected: 0 }

  for (const candidate of candidates) {
    const classified = classifyProject(candidate)
    const { data: existing, error: selectError } = await supabase
      .from('crowdfunding_tracked_projects')
      .select('*')
      .eq('platform', candidate.platform)
      .eq('source_url', candidate.source_url)
      .maybeSingle()

    if (selectError) throw selectError

    const merged = {
      ...candidate,
      ...classified,
      effective_classification: resolveEffectiveClassification({
        ...existing,
        auto_classification: classified.auto_classification
      }),
      last_seen_at: now,
      last_fetched_at: now,
      raw_payload: {
        ...(existing?.raw_payload ?? {}),
        ...(candidate.raw_payload ?? {}),
        lastCandidate: candidate
      }
    }

    const { error: upsertError } = await supabase
      .from('crowdfunding_tracked_projects')
      .upsert(merged, { onConflict: 'platform,source_url' })

    if (upsertError) throw upsertError
    if (existing) updatedCount += 1
    else createdCount += 1
    counts[merged.effective_classification] += 1
  }

  return {
    created_count: createdCount,
    updated_count: updatedCount,
    approved_count: counts.approved,
    review_count: counts.review,
    rejected_count: counts.rejected
  }
}
```

- [ ] **Step 5: 新增每日入口**

Create `scripts/crowdfunding/run-daily.mjs`:

```js
import { fetchCampfireCandidates, fetchKickstarterCandidates } from './fetch-sources.mjs'
import { createFetchRun, createServiceClient, finishFetchRun, syncCandidates } from './sync-supabase.mjs'

const pages = Number.parseInt(process.env.CROWDFUNDING_TRACKER_PAGES ?? '3', 10)

async function runSource(supabase, source, fetcher) {
  const run = await createFetchRun(supabase, source, pages)
  try {
    const candidates = await fetcher({ pages })
    const syncResult = await syncCandidates(supabase, candidates)
    await finishFetchRun(supabase, run.id, {
      status: 'success',
      candidates_found: candidates.length,
      ...syncResult
    })
    return { source, status: 'success', candidates: candidates.length }
  } catch (error) {
    await finishFetchRun(supabase, run.id, {
      status: 'failed',
      error_message: error instanceof Error ? error.message : String(error)
    })
    return { source, status: 'failed', error: error instanceof Error ? error.message : String(error) }
  }
}

const supabase = createServiceClient()
const results = []

results.push(await runSource(supabase, 'kickstarter', fetchKickstarterCandidates))
results.push(await runSource(supabase, 'campfire', fetchCampfireCandidates))

console.log(JSON.stringify({ pages, results }, null, 2))

if (results.every((result) => result.status === 'failed')) {
  process.exitCode = 1
}
```

- [ ] **Step 6: 驗證缺少 env 時會明確失敗**

Run:

```bash
npm run tracker:run
```

Expected: command fails with:

```text
Missing required env: SUPABASE_URL
```

- [ ] **Step 7: 執行 build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add scripts/crowdfunding/fetch-sources.mjs scripts/crowdfunding/test-fetch-kickstarter.mjs scripts/crowdfunding/sync-supabase.mjs scripts/crowdfunding/run-daily.mjs
git commit -m "feat: add crowdfunding tracker sync scripts"
```

## Task 4: Tracker Query Hooks

**Files:**
- Create: `src/hooks/useCrowdfundingTracker.ts`

- [ ] **Step 1: 新增 hooks**

Create `src/hooks/useCrowdfundingTracker.ts`:

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import {
  CrowdfundingClassification,
  CrowdfundingFetchRun,
  CrowdfundingTrackedProject,
} from '@/lib/supabase'

const trackerQueryKey = ['crowdfunding-tracker']
const fetchRunsQueryKey = ['crowdfunding-fetch-runs']

export const useApprovedCrowdfundingProjects = () => {
  return useQuery({
    queryKey: [...trackerQueryKey, 'approved'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crowdfunding_tracked_projects')
        .select('*')
        .eq('effective_classification', 'approved')
        .eq('ignore_forever', false)
        .order('last_seen_at', { ascending: false })

      if (error) throw error
      return data as CrowdfundingTrackedProject[]
    },
  })
}

export const useAdminCrowdfundingProjects = () => {
  return useQuery({
    queryKey: [...trackerQueryKey, 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crowdfunding_tracked_projects')
        .select('*')
        .order('last_seen_at', { ascending: false })

      if (error) throw error
      return data as CrowdfundingTrackedProject[]
    },
  })
}

export const useCrowdfundingFetchRuns = () => {
  return useQuery({
    queryKey: fetchRunsQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crowdfunding_fetch_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(30)

      if (error) throw error
      return data as CrowdfundingFetchRun[]
    },
  })
}

function resolveEffectiveClassification(input: {
  ignore_forever?: boolean
  manual_classification?: CrowdfundingClassification | null
  auto_classification?: CrowdfundingClassification
}): CrowdfundingClassification {
  if (input.ignore_forever) return 'rejected'
  if (input.manual_classification) return input.manual_classification
  return input.auto_classification ?? 'review'
}

export const useUpdateCrowdfundingReview = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      manualClassification,
      ignoreForever = false,
      adminNote,
      autoClassification,
    }: {
      id: string
      manualClassification: CrowdfundingClassification | null
      ignoreForever?: boolean
      adminNote?: string | null
      autoClassification: CrowdfundingClassification
    }) => {
      const effectiveClassification = resolveEffectiveClassification({
        ignore_forever: ignoreForever,
        manual_classification: manualClassification,
        auto_classification: autoClassification,
      })

      const { data, error } = await supabase
        .from('crowdfunding_tracked_projects')
        .update({
          manual_classification: manualClassification,
          effective_classification: effectiveClassification,
          ignore_forever: ignoreForever,
          admin_note: adminNote,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackerQueryKey })
      toast({ title: '審核結果已更新' })
    },
    onError: () => {
      toast({
        title: '更新失敗',
        description: '無法更新審核結果，請稍後再試',
        variant: 'destructive',
      })
    },
  })
}
```

- [ ] **Step 2: 執行 build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCrowdfundingTracker.ts
git commit -m "feat: add crowdfunding tracker hooks"
```

## Task 5: Admin Review UI

**Files:**
- Create: `src/components/admin/CrowdfundingTrackerAdmin.tsx`
- Modify: `src/pages/Admin.tsx`

- [ ] **Step 1: 新增後台審核元件**

Create `src/components/admin/CrowdfundingTrackerAdmin.tsx`:

```tsx
import { useMemo, useState } from 'react'
import { ExternalLink, ShieldCheck, ShieldX, Ban, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { CrowdfundingTrackedProject } from '@/lib/supabase'
import {
  useAdminCrowdfundingProjects,
  useCrowdfundingFetchRuns,
  useUpdateCrowdfundingReview,
} from '@/hooks/useCrowdfundingTracker'

function platformLabel(platform: string) {
  return platform === 'kickstarter' ? 'Kickstarter' : 'CAMPFIRE'
}

function ProjectRow({ project }: { project: CrowdfundingTrackedProject }) {
  const [note, setNote] = useState(project.admin_note ?? '')
  const updateReview = useUpdateCrowdfundingReview()

  const update = (manualClassification: 'approved' | 'review' | 'rejected' | null, ignoreForever = false) => {
    updateReview.mutate({
      id: project.id,
      manualClassification,
      ignoreForever,
      adminNote: note,
      autoClassification: project.auto_classification,
    })
  }

  return (
    <div className="grid gap-4 border-b py-4 lg:grid-cols-[120px_1fr_260px]">
      <div className="aspect-video overflow-hidden rounded bg-muted">
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{project.title}</h3>
          <Badge variant="outline">{platformLabel(project.platform)}</Badge>
          <Badge>{project.effective_classification}</Badge>
          <Badge variant="secondary">{Math.round(project.confidence)} 分</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.description || '沒有描述'}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{project.currency ?? ''} {project.pledged_amount.toLocaleString()} / {project.goal_amount.toLocaleString()}</span>
          <span>{project.percent_funded}%</span>
          <span>{project.backer_count.toLocaleString()} 人支持</span>
          <span>最後看見：{new Date(project.last_seen_at).toLocaleString('zh-TW')}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {project.classification_reasons.map((reason) => (
            <Badge key={reason} variant="secondary">{reason}</Badge>
          ))}
        </div>
        <a href={project.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary">
          查看來源 <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="space-y-2">
        <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="管理者備註" />
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => update('approved')}>
            <ShieldCheck className="mr-2 h-4 w-4" /> 通過
          </Button>
          <Button size="sm" variant="outline" onClick={() => update('rejected')}>
            <ShieldX className="mr-2 h-4 w-4" /> 排除
          </Button>
          <Button size="sm" variant="destructive" onClick={() => update('rejected', true)}>
            <Ban className="mr-2 h-4 w-4" /> 永久忽略
          </Button>
          <Button size="sm" variant="ghost" onClick={() => update(null)}>
            <RotateCcw className="mr-2 h-4 w-4" /> 清除
          </Button>
        </div>
      </div>
    </div>
  )
}

export function CrowdfundingTrackerAdmin() {
  const { data: projects = [], isLoading } = useAdminCrowdfundingProjects()
  const { data: runs = [] } = useCrowdfundingFetchRuns()

  const groups = useMemo(() => ({
    review: projects.filter((project) => project.effective_classification === 'review' && !project.ignore_forever),
    approved: projects.filter((project) => project.effective_classification === 'approved' && !project.ignore_forever),
    rejected: projects.filter((project) => project.effective_classification === 'rejected' || project.ignore_forever),
  }), [projects])

  if (isLoading) return <div>載入中...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>群眾募資追蹤審核</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="review">
          <TabsList>
            <TabsTrigger value="review">待審 ({groups.review.length})</TabsTrigger>
            <TabsTrigger value="approved">已公開 ({groups.approved.length})</TabsTrigger>
            <TabsTrigger value="rejected">已排除 ({groups.rejected.length})</TabsTrigger>
            <TabsTrigger value="runs">抓取紀錄 ({runs.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="review">{groups.review.map((project) => <ProjectRow key={project.id} project={project} />)}</TabsContent>
          <TabsContent value="approved">{groups.approved.map((project) => <ProjectRow key={project.id} project={project} />)}</TabsContent>
          <TabsContent value="rejected">{groups.rejected.map((project) => <ProjectRow key={project.id} project={project} />)}</TabsContent>
          <TabsContent value="runs">
            <div className="divide-y">
              {runs.map((run) => (
                <div key={run.id} className="flex items-center justify-between py-3 text-sm">
                  <span>{run.source} / {run.status}</span>
                  <span>{run.candidates_found} 筆候選，{run.review_count} 待審</span>
                  <span>{new Date(run.started_at).toLocaleString('zh-TW')}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: 整合到 Admin**

Modify `src/pages/Admin.tsx`:

```tsx
import { ListChecks } from "lucide-react";
import { CrowdfundingTrackerAdmin } from "@/components/admin/CrowdfundingTrackerAdmin";
```

Add one tab trigger to the existing `TabsList`, and change grid count from `grid-cols-8` to `grid-cols-9`:

```tsx
<TabsTrigger value="tracker" className="flex items-center gap-2">
  <ListChecks className="h-4 w-4" />
  追蹤審核
</TabsTrigger>
```

Add tab content:

```tsx
<TabsContent value="tracker">
  <CrowdfundingTrackerAdmin />
</TabsContent>
```

- [ ] **Step 3: 執行 lint 與 build**

Run:

```bash
npm run lint
npm run build
```

Expected: both commands succeed.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/CrowdfundingTrackerAdmin.tsx src/pages/Admin.tsx
git commit -m "feat: add crowdfunding tracker admin"
```

## Task 6: Public `/global-data` Tracker Section

**Files:**
- Create: `src/components/CrowdfundingTrackerSection.tsx`
- Modify: `src/pages/GlobalData.tsx`

- [ ] **Step 1: 新增前台區塊**

Create `src/components/CrowdfundingTrackerSection.tsx`:

```tsx
import { useMemo, useState } from 'react'
import { ExternalLink, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { useApprovedCrowdfundingProjects } from '@/hooks/useCrowdfundingTracker'

function platformLabel(platform: string) {
  return platform === 'kickstarter' ? 'Kickstarter' : 'CAMPFIRE'
}

export function CrowdfundingTrackerSection() {
  const { data: projects = [], isLoading } = useApprovedCrowdfundingProjects()
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState('all')
  const [sort, setSort] = useState('last_seen')

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return projects
      .filter((project) => platform === 'all' || project.platform === platform)
      .filter((project) => {
        if (!normalizedQuery) return true
        return `${project.title} ${project.description ?? ''}`.toLowerCase().includes(normalizedQuery)
      })
      .sort((a, b) => {
        if (sort === 'ending') return new Date(a.end_at ?? '2999-12-31').getTime() - new Date(b.end_at ?? '2999-12-31').getTime()
        if (sort === 'funded') return b.percent_funded - a.percent_funded
        if (sort === 'pledged') return b.pledged_amount - a.pledged_amount
        if (sort === 'backers') return b.backer_count - a.backer_count
        return new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime()
      })
  }, [platform, projects, query, sort])

  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle>即時電子遊戲群眾募資追蹤</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="搜尋專案" />
          </div>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部平台</SelectItem>
              <SelectItem value="kickstarter">Kickstarter</SelectItem>
              <SelectItem value="campfire">CAMPFIRE</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="last_seen">最新發現</SelectItem>
              <SelectItem value="ending">即將結束</SelectItem>
              <SelectItem value="funded">達成率</SelectItem>
              <SelectItem value="pledged">募資金額</SelectItem>
              <SelectItem value="backers">支持人數</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <div>載入中...</div> : null}
        {!isLoading && visibleProjects.length === 0 ? <div className="text-muted-foreground">目前沒有已公開的追蹤專案。</div> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="aspect-video bg-muted">
                {project.image_url ? <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" /> : null}
              </div>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline">{platformLabel(project.platform)}</Badge>
                  <Badge variant="secondary">{project.project_status}</Badge>
                </div>
                <h3 className="line-clamp-2 font-semibold">{project.title}</h3>
                <p className="line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
                <div className="space-y-2">
                  <Progress value={Math.min(project.percent_funded, 100)} />
                  <div className="flex justify-between text-sm">
                    <span>{project.currency ?? ''} {project.pledged_amount.toLocaleString()}</span>
                    <span>{project.percent_funded}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{project.backer_count.toLocaleString()} 人支持</span>
                  <span>{new Date(project.last_seen_at).toLocaleDateString('zh-TW')}</span>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <a href={project.source_url} target="_blank" rel="noreferrer">
                    查看來源 <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: 加到 GlobalData**

Modify `src/pages/GlobalData.tsx` imports:

```tsx
import { CrowdfundingTrackerSection } from "@/components/CrowdfundingTrackerSection";
```

Render after intro/toggle block and before platform-specific content:

```tsx
<CrowdfundingTrackerSection />
```

- [ ] **Step 3: 執行 lint 與 build**

Run:

```bash
npm run lint
npm run build
```

Expected: both commands succeed.

- [ ] **Step 4: Commit**

```bash
git add src/components/CrowdfundingTrackerSection.tsx src/pages/GlobalData.tsx
git commit -m "feat: show approved crowdfunding tracker projects"
```

## Task 7: GitHub Actions Schedule

**Files:**
- Create: `.github/workflows/crowdfunding-tracker.yml`

- [ ] **Step 1: 新增 workflow**

Create `.github/workflows/crowdfunding-tracker.yml`:

```yaml
name: Crowdfunding Tracker

on:
  schedule:
    - cron: "17 19 * * *"
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run classifier checks
        run: npm run tracker:test

      - name: Run daily tracker
        run: npm run tracker:run
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          CROWDFUNDING_TRACKER_PAGES: "3"
```

The cron time `17 19 * * *` runs daily at 03:17 Asia/Taipei.

- [ ] **Step 2: 驗證 workflow YAML 存在**

Run:

```bash
test -f .github/workflows/crowdfunding-tracker.yml
```

Expected: command exits with status 0.

- [ ] **Step 3: 執行本機檢查**

Run:

```bash
npm run tracker:test
npm run build
```

Expected: both commands succeed.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/crowdfunding-tracker.yml
git commit -m "ci: schedule crowdfunding tracker"
```

## Task 8: Final Verification

**Files:**
- No new files unless earlier tasks reveal a focused fix.

- [ ] **Step 1: 檢查工作區**

Run:

```bash
git status --short
```

Expected: no unrelated uncommitted changes.

- [ ] **Step 2: 跑分類器測試**

Run:

```bash
npm run tracker:test
```

Expected output:

```text
classifier checks passed
```

- [ ] **Step 3: 跑 lint**

Run:

```bash
npm run lint
```

Expected: command succeeds. If existing unrelated lint errors appear, record exact files and do not hide them.

- [ ] **Step 4: 跑 build**

Run:

```bash
npm run build
```

Expected: command succeeds and outputs Vite build artifacts.

- [ ] **Step 5: 人工檢查 UI**

Run:

```bash
npm run dev
```

Expected: Vite dev server starts. Open the shown local URL and check:

- `/global-data` includes `即時電子遊戲群眾募資追蹤`.
- `/admin` includes `追蹤審核`.
- Empty tracker data shows a clean empty state instead of crashing.

- [ ] **Step 6: Commit final fixes if needed**

Only if Step 2-5 required fixes:

```bash
git add <changed-files>
git commit -m "fix: polish crowdfunding tracker integration"
```

## Task 9: Push To GitHub For Lovable

**Files:**
- No file changes expected.

- [ ] **Step 1: 確認 remote**

Run:

```bash
git remote -v
```

Expected output includes:

```text
origin	https://github.com/pa023315/vision-builders-kit-70.git (fetch)
origin	https://github.com/pa023315/vision-builders-kit-70.git (push)
```

- [ ] **Step 2: 確認沒有未提交修改**

Run:

```bash
git status --short
```

Expected: no output.

- [ ] **Step 3: Push 到 GitHub**

Run:

```bash
git push origin main
```

Expected: push succeeds. This makes the implementation visible to Lovable through the GitHub repo.

## 自我檢查

- 規格中的資料表、分類欄位、人工覆寫、抓取紀錄、前台公開限制、每日排程都有對應 task。
- 第一版不會自動寫回既有 `projects`，因此不影響目前統計頁的歷史資料。
- 核心分類器有腳本層測試；UI 以 `npm run lint`、`npm run build` 與本機人工檢查驗證。
- Kickstarter 抓取有 smoke test，會提早揭露 Cloudflare challenge，而不是等後台完成後才發現抓不到資料。
- `SUPABASE_SERVICE_ROLE_KEY` 只出現在 GitHub Actions env，不會放進前端程式。
- 完成後會 push 到 GitHub `origin/main`，讓 Lovable 可以同步並繼續更新網站。
