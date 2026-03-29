create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'converted')),
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- Only service role can read/write (no public access)
create policy "Service role only" on public.waitlist
  using (false)
  with check (false);
