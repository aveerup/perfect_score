create table if not exists public.reading_tests_modified (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  components jsonb not null default '[]'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reading_test_attempts_modified (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_id uuid not null references public.reading_tests_modified(id),
  status text not null default 'active' check (status in ('active', 'submitted')),
  snapshot jsonb not null,
  answers jsonb not null default '{}'::jsonb,
  result jsonb,
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create index if not exists reading_test_attempts_modified_user_test_idx
  on public.reading_test_attempts_modified (user_id, test_id, submitted_at desc);

create table if not exists public.reading_test_passage_images (
  id uuid primary key default gen_random_uuid(),
  object_path text not null unique,
  filename text not null,
  content_type text not null,
  created_at timestamptz not null default now()
);

alter table public.reading_tests_modified enable row level security;
alter table public.reading_test_attempts_modified enable row level security;
alter table public.reading_test_passage_images enable row level security;

-- The FastAPI connection owns all reads and writes. Do not expose answer keys
-- or image metadata through the Supabase table API.
revoke all on public.reading_tests_modified from anon, authenticated;
revoke all on public.reading_test_attempts_modified from anon, authenticated;
revoke all on public.reading_test_passage_images from anon, authenticated;
