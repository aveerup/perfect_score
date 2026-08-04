from __future__ import annotations

from pathlib import Path
import sys

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from app.db import db_connection
from seed import seed_vocabulary


def main() -> None:
    replace_existing = "--replace" in sys.argv
    with db_connection() as connection:
        with connection.cursor() as cursor:
            vocabulary_count = seed_vocabulary(cursor, replace_existing=replace_existing)
        connection.commit()

    print(f"Seeded {vocabulary_count} vocabulary words.")


if __name__ == "__main__":
    main()
