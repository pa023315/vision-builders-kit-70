-- Add display_order column to crowdfunding_cases table
ALTER TABLE public.crowdfunding_cases 
ADD COLUMN display_order INTEGER DEFAULT 0;

-- Set initial display_order values based on creation date
UPDATE public.crowdfunding_cases 
SET display_order = subquery.row_number 
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_number 
  FROM public.crowdfunding_cases
) subquery 
WHERE public.crowdfunding_cases.id = subquery.id;