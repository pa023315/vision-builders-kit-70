# 群眾募資專案追蹤器設計規格

日期：2026-06-04
目標 repo：`pa023315/vision-builders-kit-70`

## 目標

在現有 GameCF 網站加入一個每日更新的電子遊戲群眾募資追蹤器。追蹤器會從 Kickstarter 與 CAMPFIRE 收集候選專案，判斷每個專案是否屬於數位電子遊戲，讓管理者在既有後台審核不確定的結果，並且只把核准後的專案發布到前台。

第一版優先重視正確性、低請求量，以及後台人工控管；不追求完全自動化。

## 目前網站脈絡

這個 repo 是 Vite + React + Supabase 應用。

相關既有檔案：

- `src/pages/GlobalData.tsx` 顯示 Kickstarter 與 CAMPFIRE 的國際資料。
- `src/pages/Admin.tsx` 定義受保護的後台分頁。
- `src/components/admin/KickstarterProjectsAdmin.tsx` 管理手動建立的 Kickstarter 專案資料。
- `src/components/admin/CampfireProjectsAdmin.tsx` 管理手動建立的 CAMPFIRE 專案資料。
- `src/hooks/useProjects.ts` 讀寫既有 `projects` 資料表。
- `src/lib/supabase.ts` 定義目前前端使用的 `Project` 型別。
- `supabase/migrations/20250815140851_6f4aba31-b7e9-4915-9d88-4bcaba6d134b.sql` 建立既有 `projects` 資料表。

目前的 `projects` 資料表適合做前台展示與歷史統計，但沒有記錄抓取狀態、來源 metadata、分類信心分數、人工審核狀態或抓取紀錄。因此追蹤器應該使用新的專用資料表，並且只把核准結果呈現在前台。

## 架構

功能分成四個部分：

1. 每日抓取工作
   - 每天執行一次。
   - 從 Kickstarter Advanced Search 與 CAMPFIRE game search 抓取候選專案清單。
   - 使用低頻請求、限制頁數、重試與錯誤降級。

2. 分類流程
   - 使用電子遊戲正向訊號與非電子遊戲負向訊號替候選專案打分數。
   - 將候選專案分類為 `approved`、`review` 或 `rejected`。
   - 保留後台人工決策，未來每日更新不得覆蓋人工決策。

3. 後台審核介面
   - 整合到既有 `/admin`。
   - 新增追蹤與審核區域，包含 `待審`、`已公開`、`已排除`、`抓取紀錄`。
   - 讓管理者可以通過、排除、永久忽略、加註備註，並在來源允許時重新抓取單一專案。

4. 前台展示
   - 只顯示已核准的數位電子遊戲專案。
   - 第一版整合到 `/global-data` 的新區塊。
   - 顯示平台、標題、封面圖、募資進度、支持人數、狀態、來源連結與最後更新時間。

## 資料模型

新增追蹤器資料表，不直接把抓取與審核狀態塞進 `projects`。

### `crowdfunding_tracked_projects`

建議欄位：

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

第一版唯一鍵：

- `(platform, source_url)`

`source_id` 有取得時就保存，但第一版不把它當唯一鍵，因為不同來源與清單頁未必都會提供穩定 ID。

有效分類規則：

- 如果 `ignore_forever = true`，永遠不公開。
- 如果 `manual_classification` 有值，使用人工分類。
- 否則使用 `auto_classification`。
- 抓取與分類工作在更新 `ignore_forever`、`manual_classification` 或 `auto_classification` 時，同步更新 `effective_classification`。

### `crowdfunding_fetch_runs`

建議欄位：

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

### 與既有 `projects` 的關係

第一版行為：

- 保留 `projects` 作為歷史資料與手動資料展示表。
- 新增 tracker 資料表處理自動探索與審核。
- 在 `/global-data` 新增區塊，顯示已核准的 tracker 資料。
- tracker 專案被核准後，不自動建立或更新 `projects` 資料列。

這樣可以避免追蹤器尚未穩定前影響既有統計邏輯。

## 來源抓取

### Kickstarter

來源 URL：

`https://www.kickstarter.com/discover/advanced?category_id=35&sort=magic&seed=2967584&page=1`

Kickstarter Advanced Search 可以用分類與其他 discovery 條件篩選，因此適合作為候選來源。不過它不能當作最終電子遊戲判斷依據，因為分類結果可能混入非數位遊戲專案。

抓取行為：

- 每日執行時先抓 3 頁。
- 除非後台明確調高設定，否則最多抓 5 頁。
- 請求之間加入延遲。
- 如果被擋或結果為空，寫入失敗抓取紀錄，並保留前一次已核准資料。
- 前台頁面不得依賴即時存取 Kickstarter。

### CAMPFIRE

來源 URL：

`https://camp-fire.jp/projects/search?category=game`

抓取行為：

- 第一版先抓前 3 頁或第一批可見結果。
- CAMPFIRE 的 game category 只視為候選來源。
- 需要日文關鍵字分類，因為 game 類別可能混入桌遊、周邊、活動與混合媒體專案。

## 電子遊戲分類

分類器使用信心分數，加上強制待審與排除規則。

正向訊號：

- 平台與商店詞：`Steam`、`Nintendo Switch`、`PlayStation`、`PS5`、`Xbox`、`PC`、`Windows`、`Mac`、`itch.io`
- 遊戲證據詞：`gameplay`、`demo`、`playable demo`、`trailer`、`early access`、`alpha`、`beta`
- 引擎與開發詞：`Unity`、`Unreal`、`Godot`、`game engine`
- 類型詞：`RPG`、`JRPG`、`action game`、`adventure game`、`visual novel`、`metroidvania`、`roguelike`、`simulation`、`pixel art`、`indie game`
- 日文詞：`ゲーム`、`ビデオゲーム`、`デジタルゲーム`、`Steam`、`体験版`、`デモ版`、`ゲームプレイ`、`Nintendo Switch`

負向或排除訊號：

- 桌上遊戲詞：`board game`、`tabletop`、`card game`、`TRPG`、`dice`、`miniature`、`TCG`、`playing cards`
- 非遊戲媒體詞：`book`、`comic`、`manga`、`artbook`、`novel`、`soundtrack only`
- 周邊與活動詞：`merch`、`figure`、`plush`、`event`、`exhibition`、`VTuber event`、`goods`
- 日文詞：`ボードゲーム`、`カードゲーム`、`TRPG`、`グッズ`、`書籍`、`漫画`、`展示`、`イベント`

分類輸出：

- `approved`：正向分數強，且沒有強烈負向訊號。
- `review`：訊號混雜、正向分數較弱，或 metadata 不足。
- `rejected`：有強烈非電子遊戲訊號，且沒有足夠數位遊戲證據。

每次分類都要保存 `confidence` 與 `classification_reasons`，讓管理者能理解系統為什麼這樣分類。

## 後台介面

在 `src/components/admin/` 底下新增追蹤器管理元件，例如：

- `CrowdfundingTrackerAdmin.tsx`

在 `src/pages/Admin.tsx` 新增分頁，例如：

- 標籤：`追蹤審核`
- 圖示：`Search`、`Radar` 或 `ListChecks`

後台區塊：

- `待審`：`effective_classification` 為 `review`。
- `已公開`：`effective_classification` 為 `approved`。
- `已排除`：`effective_classification` 為 `rejected` 或 `ignore_forever = true`。
- `抓取紀錄`：顯示 `crowdfunding_fetch_runs` 資料列。

每筆專案顯示：

- 封面圖
- 標題
- 平台 badge
- 來源連結
- 簡介摘要
- 募資金額、目標、達成率、支持人數
- 專案狀態與結束日期
- 自動分類、人工分類、信心分數
- 分類原因
- 管理者備註

操作：

- 通過並公開
- 排除
- 永久忽略
- 清除人工覆寫
- 編輯管理者備註
- 在來源允許時重新抓取單一專案

人工決策永遠優先於後續每日自動分類。

## 前台介面

第一版放置位置：

- 在 `/global-data` 新增一個即時追蹤區塊。
- 第一版不新增新的公開路由。

前台控制項：

- 搜尋標題與描述。
- 篩選平台：全部、Kickstarter、CAMPFIRE。
- 篩選狀態：active、upcoming、ended、unknown。
- 排序：最新發現、即將結束、達成率、募資金額、支持人數。

前台卡片：

- 封面圖
- 平台
- 標題
- 簡短描述
- 募資進度
- 支持人數
- 已知時顯示剩餘天數
- 來源連結
- 最後更新時間

前台不得顯示 `rejected` 或 `review` 專案。

## 排程

優先排程方式：

- 使用 GitHub Actions scheduled workflow 每天執行一次。
- workflow 呼叫 Supabase Edge Function 或可安全寫入 Supabase 的腳本。
- Supabase service role credentials 存在 GitHub Secrets，不放在前端。

替代排程方式：

- 如果有啟用，可以使用 Supabase scheduled Edge Function。
- 如果部署平台支援，也可以使用 Vercel 或 Netlify cron。

抓取器必須做到：

- 每個來源都建立抓取紀錄。
- 不因單次來源失敗刪除已核准資料。
- Kickstarter 或 CAMPFIRE 被擋或 markup 改變時，前台仍顯示既有資料。

## 錯誤處理

- 來源抓取失敗：將抓取紀錄標記為 `failed`，保留舊資料。
- 來源 markup 改變：將原始錯誤與受影響來源寫進 `metadata`。
- 專案從清單消失：標記為最近一次未看見，但不立即刪除。
- 分類器無法判斷：設為 `review`。
- 已有人工覆寫：保留人工結果。

## 安全性與權限

- 公開使用者只能讀取已核准的 tracker 資料。
- 管理者可以讀取全部 tracker 資料，並更新人工審核欄位。
- 抓取工作需要 service role credentials，不能在瀏覽器端執行。
- 後台人工操作應沿用既有 protected route，並搭配 Supabase RLS policies。

目前 `projects` policy 看起來非常寬鬆。新的 tracker 資料表應使用比既有 `projects` 更嚴格的 policy。

## 測試

單元測試或腳本層檢查：

- 分類器會通過明確的電子遊戲案例。
- 分類器會排除桌遊、卡牌、書籍、周邊與活動。
- 混合訊號會產生 `review`。
- 人工分類會覆蓋自動分類。
- merge 邏輯會更新既有資料列，不會建立重複資料。

UI 檢查：

- 後台分頁顯示 `待審`、`已公開`、`已排除` 與 `抓取紀錄`。
- 後台操作會更新人工分類。
- 前台頁面只顯示已核准資料。
- 已核准資料可被篩選與排序。

整合檢查：

- 成功的每日執行會建立抓取紀錄，並新增或更新候選專案。
- Kickstarter 抓取失敗時，前台仍保留前一次已核准資料。
- CAMPFIRE 含有日文負向關鍵字的專案不會自動公開。

## 驗收標準

- 網站具備 Kickstarter 與 CAMPFIRE 候選專案的每日更新路徑。
- 追蹤器會避免明顯非電子遊戲專案被自動公開。
- 曖昧專案會進入既有後台供管理者審核。
- 後台人工決策會保留到未來每日更新。
- 公開使用者只會看到已核准的數位電子遊戲群眾募資專案。
- 抓取失敗會顯示在後台紀錄中，且不會破壞前台頁面。
