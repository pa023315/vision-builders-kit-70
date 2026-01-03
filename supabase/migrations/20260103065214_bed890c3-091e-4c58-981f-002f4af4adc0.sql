-- Create changelog table
CREATE TABLE public.changelog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.changelog ENABLE ROW LEVEL SECURITY;

-- Public can view changelog entries
CREATE POLICY "Changelog entries are publicly viewable"
ON public.changelog
FOR SELECT
USING (true);

-- Admin can manage changelog entries (using same pattern as other tables)
CREATE POLICY "Admin can manage changelog"
ON public.changelog
FOR ALL
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_changelog_updated_at
BEFORE UPDATE ON public.changelog
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
INSERT INTO public.changelog (date, content) VALUES
  ('2026.01.03', '更新台灣數據'),
  ('2025.09.18', '網站上線');