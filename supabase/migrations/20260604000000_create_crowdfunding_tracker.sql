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
