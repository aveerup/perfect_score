create table if not exists public.lectures_yt (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  description text,
  youtube_link text,
  youtube_id text,
  skill text not null check (skill in ('L', 'R', 'W', 'S')),
  duration text,
  band_range text,
  published_at date not null default current_date,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lectures_yt enable row level security;

drop policy if exists "lectures_yt_read_published" on public.lectures_yt;
create policy "lectures_yt_read_published" on public.lectures_yt
for select to authenticated using (is_published);

revoke all on table public.lectures_yt from authenticated, anon;
grant select (
  id,
  source_path,
  description,
  youtube_link,
  youtube_id,
  skill,
  duration,
  band_range,
  published_at,
  is_published,
  created_at
) on public.lectures_yt to authenticated;

delete from public.lecture_progress lp
where not exists (
  select 1
  from public.lectures_yt l
  where l.id = lp.lecture_id
);

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.lecture_progress'::regclass
      and contype = 'f'
      and confrelid = 'public.lectures'::regclass
  loop
    execute format('alter table public.lecture_progress drop constraint %I', constraint_name);
  end loop;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.lecture_progress'::regclass
      and conname = 'lecture_progress_lecture_yt_id_fkey'
  ) then
    alter table public.lecture_progress
    add constraint lecture_progress_lecture_yt_id_fkey
    foreign key (lecture_id) references public.lectures_yt(id) on delete cascade;
  end if;
end
$$;
