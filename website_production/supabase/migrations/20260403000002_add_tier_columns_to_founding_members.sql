ALTER TABLE public.founding_members
  ADD COLUMN IF NOT EXISTS tier text,
  ADD COLUMN IF NOT EXISTS billing_period text,
  ADD COLUMN IF NOT EXISTS access_window text;
