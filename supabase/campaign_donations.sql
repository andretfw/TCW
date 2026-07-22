create extension if not exists pgcrypto;

create table if not exists public.campaign_donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id text not null,
  provider text not null check (provider in ('paypal', 'btc', 'eth', 'usdc')),
  transaction_id text not null unique,
  amount_original numeric not null check (amount_original > 0),
  currency text not null,
  amount_eur numeric not null check (amount_eur > 0),
  status text not null default 'verified' check (status in ('verified', 'pending', 'rejected')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists campaign_donations_campaign_status_idx
  on public.campaign_donations (campaign_id, status);

alter table public.campaign_donations enable row level security;

-- No public policies are created. The website reads and writes through
-- server-side API routes using SUPABASE_SERVICE_ROLE_KEY only.
