create table if not exists public.vocabulary_comfort (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null references auth.users(id) on delete cascade,
  vocabulary_id text not null references public.vocabulary_words(id) on delete cascade,
  group_name text not null,
  comfort_level text not null default 'uncomfortable'
    check (comfort_level in ('uncomfortable', 'almost', 'comfortable')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (uid, vocabulary_id)
);

create index if not exists vocabulary_comfort_uid_group_idx
  on public.vocabulary_comfort (uid, group_name);

alter table public.vocabulary_comfort enable row level security;

drop policy if exists "vocabulary_comfort_own" on public.vocabulary_comfort;
create policy "vocabulary_comfort_own" on public.vocabulary_comfort
for all to authenticated using ((select auth.uid()) = uid)
with check ((select auth.uid()) = uid);

-- FastAPI owns writes so users cannot bypass validation through Supabase table APIs.
revoke insert, update, delete on table public.vocabulary_comfort
from authenticated, anon;
