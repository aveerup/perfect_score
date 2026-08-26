create table if not exists public.speaking_tests (
  practise_set integer primary key,
  title text,
  category text not null default 'Medium' check (category in ('Easy', 'Medium', 'Hard')),
  questions jsonb not null default '{}'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  time_limit_seconds integer not null default 900,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.speaking_test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  practise_set integer not null references public.speaking_tests(practise_set),
  status text not null default 'active' check (status in ('active', 'submitted')),
  current_question integer not null default 1,
  time_left integer,
  answers jsonb not null default '{}'::jsonb,
  audio_paths jsonb not null default '{}'::jsonb,
  duration_seconds integer,
  overall_score numeric(3,1),
  result jsonb,
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create index if not exists speaking_test_attempts_user_idx
  on public.speaking_test_attempts (user_id, started_at desc);

alter table public.speaking_tests enable row level security;
alter table public.speaking_test_attempts enable row level security;

drop policy if exists "speaking_tests_read_published" on public.speaking_tests;
create policy "speaking_tests_read_published" on public.speaking_tests
for select to authenticated using (is_published);

drop policy if exists "speaking_test_attempts_own" on public.speaking_test_attempts;
create policy "speaking_test_attempts_own" on public.speaking_test_attempts
for all to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke insert, update, delete on table public.speaking_test_attempts
from authenticated, anon;

revoke select on public.speaking_tests from authenticated, anon;
grant select (
  practise_set,
  title,
  category,
  questions,
  time_limit_seconds,
  is_published,
  created_at
) on public.speaking_tests to authenticated;

insert into public.speaking_tests (
  practise_set,
  title,
  category,
  questions,
  answers,
  time_limit_seconds,
  is_published
) values (
  1,
  'IELTS Band 4 Principles - Interactive Quiz',
  'Easy',
  '{
    "title": "IELTS Band 4 Principles - Interactive Quiz",
    "instructions": "Answer Q1-Q3 by choosing A or B. For Q4-Q7, speak your answer aloud, then check the model answer below each question.",
    "questions": [
      {
        "id": "q1",
        "number": 1,
        "label": "1",
        "type": "MCQ",
        "superCategory": "Q1-Q3: Principles",
        "title": "Principle 1",
        "prompt": "Which of these is a Band 4 rule?",
        "options": ["A. Restate the question in your answer.", "B. Change the topic to something you know better."]
      },
      {
        "id": "q2",
        "number": 2,
        "label": "2",
        "type": "MCQ",
        "superCategory": "Q1-Q3: Principles",
        "title": "Principle 2",
        "prompt": "Which of these is a Band 4 rule?",
        "options": ["A. Use only simple, short sentences.", "B. Use long, complex sentences to impress the examiner."]
      },
      {
        "id": "q3",
        "number": 3,
        "label": "3",
        "type": "MCQ",
        "superCategory": "Q1-Q3: Principles",
        "title": "Principle 3",
        "prompt": "Which of these is a Band 4 rule?",
        "options": ["A. Pause after every complete sentence.", "B. Pause inside long sentences to think."]
      },
      {
        "id": "q4",
        "number": 4,
        "title": "Practice Principle 1: Restate the Question",
        "theme": "Music",
        "type": "SpeakingGroup",
        "subquestions": [
          {"id": "q4a", "label": "4a", "prompt": "Do you like listening to music?", "type": "Speaking"},
          {"id": "q4b", "label": "4b", "prompt": "Have you ever learned to play an instrument?", "type": "Speaking"},
          {"id": "q4c", "label": "4c", "prompt": "Would you like to go to a concert?", "type": "Speaking"}
        ]
      },
      {
        "id": "q5",
        "number": 5,
        "title": "Practice Principle 2: Only Use Simple Sentences",
        "theme": "Your Home",
        "type": "SpeakingGroup",
        "subquestions": [
          {"id": "q5a", "label": "5a", "prompt": "Where do you live now?", "type": "Speaking"},
          {"id": "q5b", "label": "5b", "prompt": "Do you like your home?", "type": "Speaking"},
          {"id": "q5c", "label": "5c", "prompt": "Is it a quiet place?", "type": "Speaking"}
        ]
      },
      {
        "id": "q6",
        "number": 6,
        "title": "Practice Principle 3: Know When to Pause",
        "theme": "Food",
        "rules": ["Pause for 1-2 seconds after each full stop."],
        "type": "SpeakingGroup",
        "subquestions": [
          {"id": "q6a", "label": "6a", "prompt": "Do you enjoy cooking?", "type": "Speaking"},
          {"id": "q6b", "label": "6b", "prompt": "Do you prefer homemade food or restaurant food?", "type": "Speaking"},
          {"id": "q6c", "label": "6c", "prompt": "What is your favourite snack?", "type": "Speaking"}
        ]
      },
      {
        "id": "q7",
        "number": 7,
        "title": "Final Challenge: Apply All 3 Principles Together",
        "theme": "Studies",
        "rules": ["Restate every question.", "Use only short, simple sentences.", "Pause for 1-2 seconds after every sentence."],
        "type": "SpeakingGroup",
        "subquestions": [
          {"id": "q7a", "label": "7a", "prompt": "What are you studying now?", "type": "Speaking"},
          {"id": "q7b", "label": "7b", "prompt": "Do you enjoy your studies?", "type": "Speaking"},
          {"id": "q7c", "label": "7c", "prompt": "Where do you usually study?", "type": "Speaking"},
          {"id": "q7d", "label": "7d", "prompt": "Is it difficult to study in your country?", "type": "Speaking"},
          {"id": "q7e", "label": "7e", "prompt": "Would you like to study abroad in the future?", "type": "Speaking"}
        ]
      }
    ]
  }'::jsonb,
  '{
    "q1": "A. Restate the question in your answer.",
    "q2": "A. Use only simple, short sentences.",
    "q3": "A. Pause after every complete sentence.",
    "q4a": "Yes, I like listening to music. I listen every day. It makes me happy.",
    "q4b": "No, I have never learned an instrument. It looks difficult. But I admire musicians.",
    "q4c": "Yes, I would like to go to a concert. I love live music. It would be exciting.",
    "q5a": "I live in an apartment. It is in the city centre. My building is tall.",
    "q5b": "Yes, I like my home. It is comfortable. The view is nice.",
    "q5c": "No, it is not quiet. There is traffic outside. But I am used to it.",
    "q6a": "No, I do not enjoy cooking. (pause) It takes too long. (pause) I eat simple meals.",
    "q6b": "I prefer homemade food. (pause) It is healthier. (pause) And it tastes fresh.",
    "q6c": "My favourite snack is fruit. (pause) I eat apples. (pause) They are sweet and crisp.",
    "q7a": "I am studying English now. (pause) I also study math. (pause) Both are useful.",
    "q7b": "Yes, I enjoy my studies. (pause) They are interesting. (pause) I learn new words daily.",
    "q7c": "I usually study at home. (pause) My room is quiet. (pause) I sit at my desk.",
    "q7d": "Yes, it is quite difficult. (pause) There is too much homework. (pause) But I manage.",
    "q7e": "Yes, I would like to study abroad. (pause) I want to go to the UK. (pause) It has good schools."
  }'::jsonb,
  900,
  true
) on conflict (practise_set) do update set
  title = excluded.title,
  category = excluded.category,
  questions = excluded.questions,
  answers = excluded.answers,
  time_limit_seconds = excluded.time_limit_seconds,
  is_published = excluded.is_published;
