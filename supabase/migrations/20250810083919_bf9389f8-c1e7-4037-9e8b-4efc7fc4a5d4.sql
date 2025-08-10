-- Create case studies table for crowdfunding projects
CREATE TABLE public.crowdfunding_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  amount BIGINT NOT NULL,
  target BIGINT NOT NULL,
  backers INTEGER NOT NULL,
  success_rate DECIMAL(5,2) NOT NULL,
  image_url TEXT,
  project_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game showcase table
CREATE TABLE public.game_showcases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  game_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.crowdfunding_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_showcases ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is admin managed content)
CREATE POLICY "Crowdfunding cases are publicly viewable"
ON public.crowdfunding_cases
FOR SELECT
USING (true);

CREATE POLICY "Admin can manage crowdfunding cases"
ON public.crowdfunding_cases
FOR ALL
USING (true);

CREATE POLICY "Game showcases are publicly viewable"
ON public.game_showcases
FOR SELECT
USING (true);

CREATE POLICY "Admin can manage game showcases"
ON public.game_showcases
FOR ALL
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_crowdfunding_cases_updated_at
  BEFORE UPDATE ON public.crowdfunding_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_game_showcases_updated_at
  BEFORE UPDATE ON public.game_showcases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();