-- Fix linter: set search_path on security definer function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    'default'
  );
  RETURN NEW;
END;
$$;

-- Add profile_id to user-scoped tables for multi-profile support
ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS profile_id TEXT NOT NULL DEFAULT 'default';
ALTER TABLE public.workout_templates ADD COLUMN IF NOT EXISTS profile_id TEXT NOT NULL DEFAULT 'default';

-- Generic measurement entries table to support all types used in UI
CREATE TABLE IF NOT EXISTS public.measurement_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_id TEXT NOT NULL DEFAULT 'default',
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.measurement_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can manage own measurement entries" ON public.measurement_entries
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_measurement_entries_user_profile_date ON public.measurement_entries(user_id, profile_id, date DESC);
