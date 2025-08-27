-- Create table for beginner guides
CREATE TABLE public.beginner_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.beginner_guides ENABLE ROW LEVEL SECURITY;

-- Policies (following existing pattern: public readable, open manage)
CREATE POLICY "Beginner guides are publicly viewable"
ON public.beginner_guides
FOR SELECT
USING (true);

CREATE POLICY "Admin can manage beginner guides"
ON public.beginner_guides
FOR ALL
USING (true)
WITH CHECK (true);

-- Trigger to keep updated_at fresh
CREATE TRIGGER update_beginner_guides_updated_at
BEFORE UPDATE ON public.beginner_guides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();