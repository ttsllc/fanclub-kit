/**
 * Supabase schema in plain SQL — apply via Supabase dashboard SQL editor
 * or `supabase db push` after copy. Designed to be tenant-aware (one
 * Supabase project can host multiple fanclubs by tenantId).
 */
export const SQL_SCHEMA = `
-- =========================================================
-- @triceratops/fanclub-kit schema v0.1
-- =========================================================

-- Members table — extends Supabase Auth users.
create table if not exists public.fanclub_members (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id text not null,
  member_no text unique not null,
  display_name text,
  tier_id text not null default 'free',
  tier_expires_at timestamptz,
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists fanclub_members_tenant_idx on public.fanclub_members(tenant_id);
create index if not exists fanclub_members_tier_idx on public.fanclub_members(tier_id);

-- Auto-incrementing display IDs per tenant. Use a sequence and prefix.
create sequence if not exists fanclub_member_seq start with 100000;

-- Subscription tracking — one row per Stripe subscription.
create table if not exists public.fanclub_subscriptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.fanclub_members(id) on delete cascade,
  tier_id text not null,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  status text not null check (status in ('active','past_due','canceled','expired','incomplete')),
  period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists fanclub_subs_member_idx on public.fanclub_subscriptions(member_id);

-- Auto-update updated_at
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists fanclub_members_touch on public.fanclub_members;
create trigger fanclub_members_touch
  before update on public.fanclub_members
  for each row execute function public.touch_updated_at();

drop trigger if exists fanclub_subs_touch on public.fanclub_subscriptions;
create trigger fanclub_subs_touch
  before update on public.fanclub_subscriptions
  for each row execute function public.touch_updated_at();

-- Row Level Security: members can read own row, admins (service role) read all
alter table public.fanclub_members enable row level security;
create policy "members read own"
  on public.fanclub_members for select
  using (auth.uid() = id);
create policy "members update own profile (limited)"
  on public.fanclub_members for update
  using (auth.uid() = id)
  with check (auth.uid() = id and tier_id = (select tier_id from public.fanclub_members where id = auth.uid()));

alter table public.fanclub_subscriptions enable row level security;
create policy "subs read own"
  on public.fanclub_subscriptions for select
  using (member_id = auth.uid());
`;
//# sourceMappingURL=schema.js.map