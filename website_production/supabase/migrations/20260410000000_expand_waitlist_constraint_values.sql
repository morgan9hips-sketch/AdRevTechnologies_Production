-- Broaden waitlist check constraints to include both legacy and current form values

alter table public.waitlist
  drop constraint if exists waitlist_platform_type_check;

alter table public.waitlist
  drop constraint if exists waitlist_monthly_active_users_check;

alter table public.waitlist
  drop constraint if exists waitlist_interested_tier_check;

alter table public.waitlist
  add constraint waitlist_platform_type_check
  check (platform_type in ('platform_operator', 'digital_agency', 'ecommerce', 'gaming', 'fintech', 'sports_betting', 'telecoms', 'loyalty', 'other'));

alter table public.waitlist
  add constraint waitlist_monthly_active_users_check
  check (monthly_active_users in ('under_10k', '10k_50k', '50k_250k', '250k_1m', 'over_1m', '0_500k', '500k_1_5m', '1_5m_3m', '3m_plus'));

alter table public.waitlist
  add constraint waitlist_interested_tier_check
  check (interested_tier in ('starter', 'business', 'enterprise', 'founding_partner_0_500k', 'growth_500k_1_5m', 'scale_1_5m_3m', 'custom_3m_plus'));
