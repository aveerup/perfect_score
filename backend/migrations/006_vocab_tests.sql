create table if not exists public.vocab_tests (
  test_no integer primary key,
  group_name text not null unique,
  questions jsonb not null default '[]'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vocab_test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_no integer not null references public.vocab_tests(test_no) on delete cascade,
  status text not null default 'active' check (status in ('active', 'submitted')),
  selected_questions jsonb not null default '[]'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  duration_seconds integer,
  score integer,
  result jsonb,
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create index if not exists vocab_test_attempts_user_idx
  on public.vocab_test_attempts (user_id, started_at desc);

alter table public.vocab_tests enable row level security;
alter table public.vocab_test_attempts enable row level security;

drop policy if exists "vocab_tests_read" on public.vocab_tests;
create policy "vocab_tests_read" on public.vocab_tests
for select to authenticated using (true);

drop policy if exists "vocab_test_attempts_own" on public.vocab_test_attempts;
create policy "vocab_test_attempts_own" on public.vocab_test_attempts
for all to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke insert, update, delete on table public.vocab_test_attempts
from authenticated, anon;

revoke select on public.vocab_tests from authenticated, anon;
grant select (
  test_no,
  group_name,
  questions,
  created_at,
  updated_at
) on public.vocab_tests to authenticated;
