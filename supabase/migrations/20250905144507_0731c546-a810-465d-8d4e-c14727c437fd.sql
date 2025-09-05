-- Add new fields to crowdfunding_cases table
ALTER TABLE public.crowdfunding_cases 
ADD COLUMN currency TEXT DEFAULT 'USD',
ADD COLUMN game_type TEXT,
ADD COLUMN project_year INTEGER;