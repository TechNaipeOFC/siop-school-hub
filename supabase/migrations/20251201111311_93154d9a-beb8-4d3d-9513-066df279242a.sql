-- Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Policies for classes
CREATE POLICY "Staff can view all classes"
  ON public.classes
  FOR SELECT
  USING (has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can insert classes"
  ON public.classes
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can update classes"
  ON public.classes
  FOR UPDATE
  USING (has_role(auth.uid(), 'staff'));

-- Add name column to students table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS name TEXT;

-- Update students table to reference classes
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES public.classes(id);

-- Insert default class "3 E"
INSERT INTO public.classes (name) VALUES ('3 E') ON CONFLICT (name) DO NOTHING;

-- Insert student "Kaique silstre"
INSERT INTO public.students (name, registration, class, responsible_name, responsible_phone, class_id)
VALUES (
  'Kaique silstre',
  'AUTO001',
  '3 E',
  'Responsável Kaique',
  '(00) 00000-0000',
  (SELECT id FROM public.classes WHERE name = '3 E')
) ON CONFLICT DO NOTHING;