-- Add new qualification fields to waitlist table
alter table public.waitlist
  add column if not exists company_name text,
  add column if not exists role text,
  add column if not exists website text,
  add column if not exists platform_type text check (platform_type in ('ecommerce', 'gaming', 'fintech', 'sports_betting', 'telecoms', 'loyalty', 'other')),
  add column if not exists monthly_active_users text check (monthly_active_users in ('under_10k', '10k_50k', '50k_250k', '250k_1m', 'over_1m')),
  add column if not exists interested_tier text check (interested_tier in ('starter', 'business', 'enterprise')),
  add column if not exists message text,
  add column if not exists how_did_you_hear text check (how_did_you_hear in ('search', 'social_media', 'referral', 'conference', 'other'));
