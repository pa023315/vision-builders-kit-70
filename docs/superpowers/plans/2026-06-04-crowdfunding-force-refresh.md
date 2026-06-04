# Crowdfunding Force Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin button that manually triggers the existing crowdfunding tracker GitHub Actions workflow.

**Architecture:** The admin UI invokes a Supabase Edge Function. The function validates the current Supabase user, then calls GitHub's `workflow_dispatch` API for `.github/workflows/crowdfunding-tracker.yml` on `main`.

**Tech Stack:** React, TanStack Query, Supabase Edge Functions, GitHub Actions REST API.

---

### Task 1: Edge Function Trigger

**Files:**
- Create: `supabase/functions/trigger-crowdfunding-tracker/index.ts`

- [x] Create an Edge Function that accepts authenticated POST/OPTIONS requests.
- [x] Validate the caller through the incoming Supabase auth header.
- [x] Read `GITHUB_ACTIONS_TOKEN`, `GITHUB_REPOSITORY`, `GITHUB_WORKFLOW_FILE`, and `GITHUB_REF`.
- [x] Dispatch the crowdfunding tracker workflow.

### Task 2: Admin Hook And Button

**Files:**
- Modify: `src/hooks/useCrowdfundingTracker.ts`
- Modify: `src/components/admin/CrowdfundingTrackerAdmin.tsx`

- [x] Add `useTriggerCrowdfundingTracker` mutation.
- [x] Add a loading-aware `強制更新` button in the tracker admin header.
- [x] Show success and failure toasts.

### Task 3: Verification

- [x] Run `npm run tracker:test`.
- [x] Run `npm run build`.
- [x] Commit and push to `main`.
