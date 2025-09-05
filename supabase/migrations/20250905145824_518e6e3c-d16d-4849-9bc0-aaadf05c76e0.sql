-- Update success_rate column to allow larger values
ALTER TABLE public.crowdfunding_cases 
ALTER COLUMN success_rate TYPE numeric(10,2);