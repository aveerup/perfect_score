from __future__ import annotations

import os
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator

from dotenv import load_dotenv
from psycopg import Connection, connect
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb


load_dotenv(Path(__file__).resolve().parents[1] / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", "")


def jsonb(value: Any) -> Jsonb:
    return Jsonb(value)


@contextmanager
def db_connection() -> Iterator[Connection[dict[str, Any]]]:
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not configured")

    with connect(DATABASE_URL, row_factory=dict_row) as connection:
        yield connection


def fetch_one(query: str, params: tuple[Any, ...] = ()) -> dict[str, Any] | None:
    with db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchone()


def fetch_all(query: str, params: tuple[Any, ...] = ()) -> list[dict[str, Any]]:
    with db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            return list(cursor.fetchall())


def execute(query: str, params: tuple[Any, ...] = ()) -> dict[str, Any] | None:
    with db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            row = cursor.fetchone() if cursor.description else None
        connection.commit()
        return row
