# Perfect Score Platform

IELTS learning MVP with a Next.js frontend, FastAPI backend, Supabase Auth/Postgres, and manually uploaded Vimeo lectures.

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and add the Supabase URL, publishable key, secret key, and Postgres connection string.
2. Copy `frontend/.env.example` to `frontend/.env.local`.
3. Install dependencies:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cd ../frontend
npm install
```

4. Apply the database schema and seed the current CSV/demo content:

```bash
backend/.venv/bin/python backend/scripts/migrate.py
backend/.venv/bin/python backend/scripts/seed.py
```

5. Start both services in separate terminals:

```bash
cd backend
.venv/bin/uvicorn app.main:app --reload --port 8000
```

```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:3000`  
API docs: `http://localhost:8000/docs`

Lecture videos are uploaded to Vimeo manually. Store each Vimeo video ID in `backend/videos.csv`, then rerun the seed command. Listening audio and images should be uploaded to Supabase Storage and referenced from test-section content.

Payments and AI evaluation are intentionally deferred. Current writing/speaking results are clearly marked basic completion estimates.
