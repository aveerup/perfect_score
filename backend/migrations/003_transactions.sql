create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  transaction_id text not null unique,
  plan_name text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transactions_email_idx on public.transactions (email);
create index if not exists transactions_created_at_idx on public.transactions (created_at desc);

alter table public.transactions enable row level security;

revoke all on table public.transactions from authenticated, anon;
