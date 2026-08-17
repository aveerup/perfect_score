# Perfect Score Backend

FastAPI API backed by Supabase Auth and Postgres.

## Commands

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

From the project root:

```bash
backend/.venv/bin/python backend/scripts/migrate.py
backend/.venv/bin/python backend/scripts/seed.py
```

Start the API:

```bash
cd backend
.venv/bin/uvicorn app.main:app --reload --port 8000
```

Authentication uses Supabase sessions stored in `HttpOnly` cookies. All learning, profile, content, progress, and search routes require authentication. The schema enables row-level security for user-owned data.

Use `CORS_ORIGINS` for production frontend domains and set `AUTH_COOKIE_SECURE=true` when serving over HTTPS.

## Redis response cache

Redis is optional. When `REDIS_URL` is configured, the API caches common read responses once and user-specific read responses per user.

```env
REDIS_URL=redis://localhost:6379/0
CACHE_TTL_SECONDS=1800
```

`CACHE_TTL_SECONDS` defaults to 1800 seconds, or 30 minutes. User-specific cache entries are indexed by user id and cleared after profile updates, onboarding, practice/mock activity, lecture progress, vocabulary reviews, study-plan changes, typing attempts, and logout.
