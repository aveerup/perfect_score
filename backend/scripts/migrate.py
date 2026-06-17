from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv
from psycopg import connect


BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")


def main() -> None:
    from os import environ

    database_url = environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured in backend/.env")

    migration_dir = BACKEND_DIR / "migrations"
    with connect(database_url) as connection:
        with connection.cursor() as cursor:
            for migration in sorted(migration_dir.glob("*.sql")):
                cursor.execute(migration.read_text(encoding="utf-8"))
                print(f"Applied {migration.name}")
        connection.commit()


if __name__ == "__main__":
    main()
