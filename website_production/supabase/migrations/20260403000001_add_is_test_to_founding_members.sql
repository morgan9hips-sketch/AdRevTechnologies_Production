-- Add is_test column to founding_members to flag R20 test payment records.
-- Safe to run against existing table — uses ADD COLUMN IF NOT EXISTS.
ALTER TABLE public.founding_members
  ADD COLUMN IF NOT EXISTS is_test boolean NOT NULL DEFAULT false;
