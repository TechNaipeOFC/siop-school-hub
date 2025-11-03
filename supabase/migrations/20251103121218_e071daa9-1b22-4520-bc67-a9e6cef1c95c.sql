-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'staff');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table (MUST be separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  registration TEXT NOT NULL UNIQUE,
  class TEXT NOT NULL,
  responsible_name TEXT NOT NULL,
  responsible_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create occurrences table
CREATE TABLE public.occurrences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('comportamento', 'pedagogico', 'indisciplina', 'elogio')),
  severity TEXT NOT NULL CHECK (severity IN ('baixa', 'media', 'alta', 'critica')),
  description TEXT NOT NULL,
  corrective_action TEXT,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notified BOOLEAN DEFAULT FALSE,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on occurrences
ALTER TABLE public.occurrences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for students
CREATE POLICY "Students can view their own data"
  ON public.students FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all students"
  ON public.students FOR SELECT
  USING (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can insert students"
  ON public.students FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can update students"
  ON public.students FOR UPDATE
  USING (public.has_role(auth.uid(), 'staff'));

-- RLS Policies for occurrences
CREATE POLICY "Students can view their own occurrences"
  ON public.occurrences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE students.id = occurrences.student_id
      AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all occurrences"
  ON public.occurrences FOR SELECT
  USING (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can insert occurrences"
  ON public.occurrences FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can update occurrences"
  ON public.occurrences FOR UPDATE
  USING (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can delete occurrences"
  ON public.occurrences FOR DELETE
  USING (public.has_role(auth.uid(), 'staff'));

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();