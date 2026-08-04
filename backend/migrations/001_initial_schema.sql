create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default 'Learner',
  role text not null default 'student' check (role in ('student', 'admin')),
  location text,
  timezone text,
  target_band numeric(2,1) check (target_band between 5 and 9),
  target_score numeric(2,1) check (target_score between 5 and 9),
  current_band numeric(2,1) not null default 6.0 check (current_band between 0 and 9),
  exam_date date,
  streak integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lectures (
  id uuid primary key default gen_random_uuid(),
  source_key text unique,
  title text not null,
  description text,
  vimeo_id text not null,
  skill text not null check (skill in ('L', 'R', 'W', 'S')),
  duration text,
  band_range text,
  published_at date not null default current_date,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.lecture_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lecture_id uuid not null references public.lectures(id) on delete cascade,
  progress integer not null default 0 check (progress between 0 and 100),
  last_position_seconds integer not null default 0,
  watched boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, lecture_id)
);

create table if not exists public.tests (
  id text primary key,
  test_type text not null check (test_type in ('practice', 'mock')),
  title text not null,
  skill text check (skill in ('L', 'R', 'W', 'S')),
  subtype text,
  difficulty text,
  band_range text,
  time_limit_seconds integer not null default 900,
  metadata jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.test_sections (
  id uuid primary key default gen_random_uuid(),
  test_id text not null references public.tests(id) on delete cascade,
  name text not null,
  skill text not null check (skill in ('L', 'R', 'W', 'S')),
  position integer not null,
  time_limit_seconds integer,
  content jsonb not null default '{}'::jsonb,
  unique (test_id, position)
);

create table if not exists public.questions (
  id text primary key,
  section_id uuid not null references public.test_sections(id) on delete cascade,
  number integer not null,
  prompt text not null,
  question_type text not null,
  options jsonb,
  correct_answer jsonb,
  metadata jsonb not null default '{}'::jsonb,
  unique (section_id, number)
);

create table if not exists public.listening_tests (
  test_no integer primary key,
  question jsonb not null default '[]'::jsonb,
  category text not null default 'Medium' check (category in ('Easy', 'Medium', 'Hard')),
  answer jsonb not null default '{}'::jsonb,
  audio_path text,
  title text,
  subtype text,
  band_range text,
  time_limit_seconds integer not null default 1800,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.reading_tests (
  test_no integer primary key,
  category text not null default 'Medium' check (category in ('Easy', 'Medium', 'Hard')),
  questions jsonb not null default '{}'::jsonb,
  answers jsonb not null default '{}'::jsonb
);

create table if not exists public.writing_tests (
  set_no integer not null,
  task_type text not null check (task_type in ('task1', 'task2')),
  questions jsonb not null default '{}'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  category text not null default 'Medium' check (category in ('Easy', 'Medium', 'Hard')),
  created_at timestamptz not null default now(),
  primary key (set_no, task_type)
);

alter table public.reading_tests
add column if not exists category text not null default 'Medium';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'reading_tests_category_check'
      and conrelid = 'public.reading_tests'::regclass
  ) then
    alter table public.reading_tests
    add constraint reading_tests_category_check
    check (category in ('Easy', 'Medium', 'Hard'));
  end if;
end
$$;

create table if not exists public.listening_test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_no integer not null references public.listening_tests(test_no),
  status text not null default 'active' check (status in ('active', 'submitted')),
  current_question integer not null default 1,
  time_left integer,
  answers jsonb not null default '{}'::jsonb,
  duration_seconds integer,
  overall_score numeric(3,1),
  result jsonb,
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create table if not exists public.reading_test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_no integer not null references public.reading_tests(test_no),
  status text not null default 'active' check (status in ('active', 'submitted')),
  current_question integer not null default 1,
  time_left integer,
  answers jsonb not null default '{}'::jsonb,
  duration_seconds integer,
  overall_score numeric(3,1),
  result jsonb,
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create table if not exists public.writing_test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  set_no integer not null,
  task_type text not null,
  status text not null default 'active' check (status in ('active', 'submitted')),
  current_question integer not null default 1,
  time_left integer,
  answers jsonb not null default '{}'::jsonb,
  essay_text text,
  duration_seconds integer,
  overall_score numeric(3,1),
  result jsonb,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  foreign key (set_no, task_type) references public.writing_tests(set_no, task_type)
);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_id text not null references public.tests(id),
  status text not null default 'active' check (status in ('active', 'submitted')),
  current_question integer not null default 1,
  time_left integer,
  active_section text,
  answers jsonb not null default '{}'::jsonb,
  essay_text text,
  speaking_transcript text,
  duration_seconds integer,
  overall_score numeric(3,1),
  section_scores jsonb,
  result jsonb,
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create table if not exists public.test_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  answer jsonb,
  is_correct boolean,
  score numeric,
  unique (attempt_id, question_id)
);

create table if not exists public.typing_passages (
  id text primary key,
  title text not null,
  task_type text,
  content text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.typing_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  passage_id text not null references public.typing_passages(id),
  wpm numeric not null check (wpm >= 0),
  accuracy numeric not null check (accuracy between 0 and 100),
  duration_seconds integer not null check (duration_seconds >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.vocabulary_words (
  id text primary key,
  word text not null,
  group_name text not null,
  word_type text not null,
  english_meaning text not null,
  bangla_meaning text not null,
  sentence text not null,
  sentence_bangla_meaning text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.vocabulary_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null references public.vocabulary_words(id) on delete cascade,
  mastery_level integer not null default 0 check (mastery_level between 0 and 4),
  last_result text check (last_result in ('again', 'hard', 'good', 'easy', 'known')),
  updated_at timestamptz not null default now(),
  primary key (user_id, word_id)
);

create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  tier text not null default '1-Month Balanced',
  start_date date not null default current_date,
  exam_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.study_tasks (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.study_plans(id) on delete cascade,
  title text not null,
  feature text not null check (feature in ('VIDEO', 'PRACTICE', 'VOCAB', 'MOCK', 'GENERAL')),
  estimated_minutes integer not null default 15,
  scheduled_date date not null default current_date,
  is_primary boolean not null default false,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.plans (
  title text primary key,
  details jsonb not null default '{}'::jsonb
);

create table if not exists public.user_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  following_plans jsonb not null default '[]'::jsonb,
  completed jsonb not null default '{}'::jsonb
);

create index if not exists lectures_published_at_idx on public.lectures (published_at desc);
create index if not exists listening_test_attempts_user_idx on public.listening_test_attempts (user_id, started_at desc);
create index if not exists test_attempts_user_idx on public.test_attempts (user_id, started_at desc);
create index if not exists typing_attempts_user_idx on public.typing_attempts (user_id, created_at desc);
create index if not exists study_tasks_plan_date_idx on public.study_tasks (plan_id, scheduled_date);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, 'Learner'), '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.study_plans (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_plans (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, email, full_name)
select
  id,
  coalesce(email, ''),
  coalesce(raw_user_meta_data ->> 'full_name', split_part(coalesce(email, 'Learner'), '@', 1))
from auth.users
on conflict (id) do nothing;

insert into public.study_plans (user_id)
select id from auth.users
on conflict (user_id) do nothing;

insert into public.user_plans (user_id)
select id from auth.users
on conflict (user_id) do nothing;

alter table public.profiles enable row level security;
alter table public.lectures enable row level security;
alter table public.lecture_progress enable row level security;
alter table public.tests enable row level security;
alter table public.test_sections enable row level security;
alter table public.questions enable row level security;
alter table public.listening_tests enable row level security;
alter table public.listening_test_attempts enable row level security;
alter table public.reading_tests enable row level security;
alter table public.reading_test_attempts enable row level security;
alter table public.writing_tests enable row level security;
alter table public.writing_test_attempts enable row level security;
alter table public.test_attempts enable row level security;
alter table public.test_answers enable row level security;
alter table public.typing_passages enable row level security;
alter table public.typing_attempts enable row level security;
alter table public.vocabulary_words enable row level security;
alter table public.vocabulary_progress enable row level security;
alter table public.study_plans enable row level security;
alter table public.study_tasks enable row level security;
alter table public.plans enable row level security;
alter table public.user_plans enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update to authenticated using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "lectures_read_published" on public.lectures;
create policy "lectures_read_published" on public.lectures
for select to authenticated using (is_published);
drop policy if exists "lecture_progress_own" on public.lecture_progress;
create policy "lecture_progress_own" on public.lecture_progress
for all to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "tests_read_published" on public.tests;
create policy "tests_read_published" on public.tests
for select to authenticated using (is_published);
drop policy if exists "sections_read_published" on public.test_sections;
create policy "sections_read_published" on public.test_sections
for select to authenticated using (
  exists (select 1 from public.tests where tests.id = test_sections.test_id and tests.is_published)
);
drop policy if exists "questions_read_published" on public.questions;
create policy "questions_read_published" on public.questions
for select to authenticated using (
  exists (
    select 1 from public.test_sections
    join public.tests on tests.id = test_sections.test_id
    where test_sections.id = questions.section_id and tests.is_published
  )
);
drop policy if exists "listening_tests_read_published" on public.listening_tests;
create policy "listening_tests_read_published" on public.listening_tests
for select to authenticated using (is_published);
drop policy if exists "listening_test_attempts_own" on public.listening_test_attempts;
create policy "listening_test_attempts_own" on public.listening_test_attempts
for all to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
drop policy if exists "reading_tests_read" on public.reading_tests;
create policy "reading_tests_read" on public.reading_tests
for select to authenticated using (true);
drop policy if exists "reading_test_attempts_own" on public.reading_test_attempts;
create policy "reading_test_attempts_own" on public.reading_test_attempts
for all to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
drop policy if exists "writing_tests_read" on public.writing_tests;
create policy "writing_tests_read" on public.writing_tests
for select to authenticated using (true);
drop policy if exists "writing_test_attempts_own" on public.writing_test_attempts;
create policy "writing_test_attempts_own" on public.writing_test_attempts
for all to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
drop policy if exists "test_attempts_own" on public.test_attempts;
create policy "test_attempts_own" on public.test_attempts
for all to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
drop policy if exists "test_answers_own" on public.test_answers;
create policy "test_answers_own" on public.test_answers
for all to authenticated using (
  exists (
    select 1 from public.test_attempts
    where test_attempts.id = test_answers.attempt_id
      and test_attempts.user_id = (select auth.uid())
  )
) with check (
  exists (
    select 1 from public.test_attempts
    where test_attempts.id = test_answers.attempt_id
      and test_attempts.user_id = (select auth.uid())
  )
);

drop policy if exists "typing_passages_read_published" on public.typing_passages;
create policy "typing_passages_read_published" on public.typing_passages
for select to authenticated using (is_published);
drop policy if exists "typing_attempts_own" on public.typing_attempts;
create policy "typing_attempts_own" on public.typing_attempts
for all to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "vocabulary_read" on public.vocabulary_words;
create policy "vocabulary_read" on public.vocabulary_words
for select to authenticated using (true);
drop policy if exists "vocabulary_progress_own" on public.vocabulary_progress;
create policy "vocabulary_progress_own" on public.vocabulary_progress
for all to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "study_plans_own" on public.study_plans;
create policy "study_plans_own" on public.study_plans
for all to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
drop policy if exists "study_tasks_own" on public.study_tasks;
create policy "study_tasks_own" on public.study_tasks
for all to authenticated using (
  exists (
    select 1 from public.study_plans
    where study_plans.id = study_tasks.plan_id
      and study_plans.user_id = (select auth.uid())
  )
) with check (
  exists (
    select 1 from public.study_plans
    where study_plans.id = study_tasks.plan_id
      and study_plans.user_id = (select auth.uid())
  )
);

drop policy if exists "plans_read_authenticated" on public.plans;
create policy "plans_read_authenticated" on public.plans
for select to authenticated using (true);
drop policy if exists "user_plans_own" on public.user_plans;
create policy "user_plans_own" on public.user_plans
for all to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- The browser uses FastAPI for all mutations. Keep scores, roles, and progress
-- backend-authoritative even if a user calls Supabase's table API directly.
revoke insert, update, delete on table
  public.profiles,
  public.lecture_progress,
  public.listening_test_attempts,
  public.reading_test_attempts,
  public.writing_test_attempts,
  public.test_attempts,
  public.test_answers,
  public.typing_attempts,
  public.vocabulary_progress,
  public.study_plans,
  public.study_tasks,
  public.user_plans
from authenticated, anon;

-- Published questions are readable, but answer keys are only used by FastAPI.
revoke select on public.questions from authenticated, anon;
grant select (
  id,
  section_id,
  number,
  prompt,
  question_type,
  options,
  metadata
) on public.questions to authenticated;

-- Listening answers are stored beside question JSON, so expose only non-answer
-- columns to browsers. FastAPI reads the answer key from the backend connection.
revoke select on public.listening_tests from authenticated, anon;
grant select (
  test_no,
  question,
  category,
  audio_path,
  title,
  subtype,
  band_range,
  time_limit_seconds,
  is_published,
  created_at
) on public.listening_tests to authenticated;

-- Reading answers are stored beside question JSON, so expose only the prompt
-- payload to browsers. FastAPI reads the answer key from the backend connection.
revoke select on public.reading_tests from authenticated, anon;
grant select (
  test_no,
  category,
  questions
) on public.reading_tests to authenticated;

-- Writing model answers and scoring guidance stay backend-authoritative.
revoke select on public.writing_tests from authenticated, anon;
grant select (
  set_no,
  task_type,
  questions,
  category,
  created_at
) on public.writing_tests to authenticated;
