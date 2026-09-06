create table if not exists public.typing_lesson_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  wpm numeric not null check (wpm >= 0),
  accuracy numeric not null check (accuracy between 0 and 100),
  duration_seconds integer not null check (duration_seconds >= 0),
  passed boolean not null default false,
  key_errors jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists typing_lesson_attempts_user_idx
  on public.typing_lesson_attempts (user_id, created_at desc);

create index if not exists typing_lesson_attempts_progress_idx
  on public.typing_lesson_attempts (user_id, lesson_id, passed);

alter table public.typing_lesson_attempts enable row level security;

drop policy if exists "typing_lesson_attempts_own" on public.typing_lesson_attempts;
create policy "typing_lesson_attempts_own" on public.typing_lesson_attempts
for all to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Lesson results are written through FastAPI so progress rules remain authoritative.
revoke insert, update, delete on table public.typing_lesson_attempts
from authenticated, anon;
