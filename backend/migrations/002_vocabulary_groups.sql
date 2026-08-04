alter table public.vocabulary_words
  add column if not exists group_name text,
  add column if not exists word_type text,
  add column if not exists english_meaning text,
  add column if not exists bangla_meaning text,
  add column if not exists sentence text,
  add column if not exists sentence_bangla_meaning text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'vocabulary_words'
      and column_name = 'category'
  ) then
    execute 'update public.vocabulary_words set group_name = coalesce(group_name, category)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'vocabulary_words'
      and column_name = 'definition'
  ) then
    execute 'update public.vocabulary_words set english_meaning = coalesce(english_meaning, definition)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'vocabulary_words'
      and column_name = 'example'
  ) then
    execute 'update public.vocabulary_words set sentence = coalesce(sentence, example)';
  end if;
end $$;

update public.vocabulary_words
set
  group_name = coalesce(group_name, 'Group 1'),
  word_type = coalesce(word_type, 'Word'),
  english_meaning = coalesce(english_meaning, ''),
  bangla_meaning = coalesce(bangla_meaning, ''),
  sentence = coalesce(sentence, ''),
  sentence_bangla_meaning = coalesce(sentence_bangla_meaning, '');

alter table public.vocabulary_words
  alter column group_name set not null,
  alter column word_type set not null,
  alter column english_meaning set not null,
  alter column bangla_meaning set not null,
  alter column sentence set not null,
  alter column sentence_bangla_meaning set not null;

alter table public.vocabulary_words
  drop column if exists category,
  drop column if exists definition,
  drop column if exists collocations,
  drop column if exists example;
