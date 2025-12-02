-- Add responsible_email column to students table for notifications
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS responsible_email TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_responsible_email ON public.students(responsible_email);
