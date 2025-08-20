-- Add username field to profiles table
ALTER TABLE public.profiles ADD COLUMN username text UNIQUE;

-- Create index for faster username lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Add constraint to ensure username is required for new profiles
-- We'll make it nullable initially to handle existing profiles
ALTER TABLE public.profiles ALTER COLUMN username DROP NOT NULL;

-- Create function to get email by username for login
CREATE OR REPLACE FUNCTION public.get_email_by_username(username_input text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT auth.users.email
  FROM public.profiles
  JOIN auth.users ON profiles.id = auth.users.id
  WHERE profiles.username = username_input
  LIMIT 1;
$$;