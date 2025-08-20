-- Fix function security by setting search_path
CREATE OR REPLACE FUNCTION public.get_email_by_username(username_input text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.users.email
  FROM public.profiles
  JOIN auth.users ON profiles.id = auth.users.id
  WHERE profiles.username = username_input
  LIMIT 1;
$$;