-- =========================================================
-- @triceratops/fanclub-kit schema v0.2 — initial install
-- =========================================================
-- 適用方法: Supabase Dashboard → SQL Editor → 全文ペースト → Run
-- 対象 project: npwnwdcgdddnxgquoieu (Explosion-Candy)
-- =========================================================

-- 1) Members table — extends Supabase Auth users
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

-- 2) Auto-incrementing member numbers (per tenant prefix)
create sequence if not exists fanclub_member_seq start with 100000;

-- 3) Subscription tracking — one row per Stripe subscription
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

-- 4) Auto-touch updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists fanclub_members_touch on public.fanclub_members;
create trigger fanclub_members_touch
  before update on public.fanclub_members
  for each row execute function public.touch_updated_at();

drop trigger if exists fanclub_subs_touch on public.fanclub_subscriptions;
create trigger fanclub_subs_touch
  before update on public.fanclub_subscriptions
  for each row execute function public.touch_updated_at();

-- 5) Row Level Security
alter table public.fanclub_members enable row level security;

drop policy if exists "members read own" on public.fanclub_members;
create policy "members read own"
  on public.fanclub_members for select
  using (auth.uid() = id);

drop policy if exists "members update own (display_name)" on public.fanclub_members;
create policy "members update own (display_name)"
  on public.fanclub_members for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

alter table public.fanclub_subscriptions enable row level security;

drop policy if exists "subs read own" on public.fanclub_subscriptions;
create policy "subs read own"
  on public.fanclub_subscriptions for select
  using (member_id = auth.uid());

-- 6) Helper: insert member row + auto-generate member_no
create or replace function public.fanclub_insert_member(
  p_user_id uuid,
  p_tenant_id text,
  p_prefix text,
  p_display_name text default null
)
returns public.fanclub_members
language plpgsql
security definer
as $$
declare
  v_seq bigint;
  v_no text;
  v_row public.fanclub_members;
begin
  v_seq := nextval('fanclub_member_seq');
  v_no := p_prefix || '-' || v_seq::text;
  insert into public.fanclub_members (id, tenant_id, member_no, display_name)
    values (p_user_id, p_tenant_id, v_no, p_display_name)
  returning * into v_row;
  return v_row;
end;
$$;

-- Allow authenticated users to call the helper (SECURITY DEFINER bypasses RLS)
grant execute on function public.fanclub_insert_member(uuid, text, text, text) to authenticated;

-- 7) Sanity check
select 'fanclub-kit schema v0.2 applied' as status;
