from __future__ import annotations

import csv
from pathlib import Path
import sys
from typing import Any
from uuid import NAMESPACE_URL, uuid5

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from app.data import IELTS_ESSAYS, MOCK_TESTS, PRACTICE_QUESTIONS, VOCABULARY_WORDS
from app.db import db_connection, jsonb


def skill_name(skill: str) -> str:
    return {
        "L": "Listening",
        "R": "Reading",
        "W": "Writing",
        "S": "Speaking",
    }[skill]


def generated_questions(item: dict[str, Any], count: int = 5) -> list[dict[str, Any]]:
    if item["skill"] == "R":
        return [
            {
                "id": f"{item['id']}-q{i}",
                "number": i,
                "prompt": "Does the statement agree with the passage?",
                "type": item["subType"],
                "options": ["TRUE", "FALSE", "NOT GIVEN"],
                "answer": "FALSE" if i % 3 == 0 else "TRUE",
            }
            for i in range(1, count + 1)
        ]
    if item["skill"] == "L":
        answers = [
            "gallery",
            "Tuesday",
            "student",
            "45",
            "north",
            "library",
            "morning",
            "ticket",
            "station",
            "online",
        ]
        return [
            {
                "id": f"{item['id']}-q{i}",
                "number": i,
                "prompt": "Complete the note with the correct word or number.",
                "type": item["subType"],
                "answer": answers[i - 1],
            }
            for i in range(1, count + 1)
        ]
    if item["skill"] == "W":
        return [
            {
                "id": f"{item['id']}-q1",
                "number": 1,
                "prompt": item["title"],
                "type": item["subType"],
                "targetWords": 150 if "Task 1" in item["title"] else 250,
            }
        ]
    return [
        {
            "id": f"{item['id']}-q1",
            "number": 1,
            "prompt": item["title"],
            "type": item["subType"],
            "prepSeconds": 60,
            "speakSeconds": 120,
        }
    ]


def section_content(skill: str) -> dict[str, Any]:
    if skill == "L":
        return {
            "audioUrl": None,
            "segments": [{"id": "s1", "label": "Section 1", "timestamp": 0}],
        }
    if skill == "R":
        return {
            "passage": (
                "The Academic Reading test includes three long texts which range from "
                "descriptive and factual to discursive and analytical. They are written "
                "for a non-specialist audience and are suitable for university study."
            )
        }
    return {}


def seed_lectures(cursor: Any) -> int:
    count = 0
    with (BACKEND_DIR / "videos.csv").open(newline="", encoding="utf-8") as handle:
        for row_number, row in enumerate(csv.DictReader(handle), start=2):
            source_key = f"videos.csv:{row_number}"
            cursor.execute(
                """
                insert into public.lectures (
                  source_key, title, vimeo_id, skill, duration, published_at,
                  description, band_range, is_published
                )
                values (%s, %s, %s, %s, %s, %s, %s, %s, true)
                on conflict (source_key) do update set
                  title = excluded.title,
                  vimeo_id = excluded.vimeo_id,
                  skill = excluded.skill,
                  duration = excluded.duration,
                  published_at = excluded.published_at
                """,
                (
                    source_key,
                    row["title"].strip(),
                    row["vimeo_id"].strip(),
                    row["skill"].strip().upper(),
                    row.get("duration", "").strip() or None,
                    row["published_at"].strip(),
                    f"{skill_name(row['skill'].strip().upper())} IELTS masterclass.",
                    "6.0-9.0",
                ),
            )
            count += 1
    return count


def upsert_test(cursor: Any, item: dict[str, Any], test_type: str) -> None:
    time_limit = 3600 if test_type == "mock" else (1200 if item.get("skill") in {"W", "S"} else 900)
    cursor.execute(
        """
        insert into public.tests (
          id, test_type, title, skill, subtype, difficulty, band_range,
          time_limit_seconds, metadata, is_published
        )
        values (%s, %s, %s, %s, %s, %s, %s, %s, %s, true)
        on conflict (id) do update set
          title = excluded.title,
          skill = excluded.skill,
          subtype = excluded.subtype,
          difficulty = excluded.difficulty,
          band_range = excluded.band_range,
          time_limit_seconds = excluded.time_limit_seconds,
          metadata = excluded.metadata,
          is_published = true
        """,
        (
            item["id"],
            test_type,
            item.get("title") or f"Mock Test {item['number']}",
            item.get("skill"),
            item.get("subType"),
            item.get("difficulty"),
            item.get("bandRange"),
            time_limit,
            jsonb({"number": item.get("number")}),
        ),
    )


def upsert_section(
    cursor: Any,
    test_id: str,
    name: str,
    skill: str,
    position: int,
    time_limit: int,
    content: dict[str, Any],
) -> str:
    section_id = str(uuid5(NAMESPACE_URL, f"perfect-score:{test_id}:{position}"))
    cursor.execute(
        """
        insert into public.test_sections (
          id, test_id, name, skill, position, time_limit_seconds, content
        )
        values (%s, %s, %s, %s, %s, %s, %s)
        on conflict (test_id, position) do update set
          name = excluded.name,
          skill = excluded.skill,
          time_limit_seconds = excluded.time_limit_seconds,
          content = excluded.content
        returning id
        """,
        (section_id, test_id, name, skill, position, time_limit, jsonb(content)),
    )
    return str(cursor.fetchone()["id"])


def upsert_questions(cursor: Any, section_id: str, questions: list[dict[str, Any]]) -> None:
    for question in questions:
        metadata = {
            key: value
            for key, value in question.items()
            if key not in {"id", "number", "prompt", "type", "options", "answer"}
        }
        cursor.execute(
            """
            insert into public.questions (
              id, section_id, number, prompt, question_type, options,
              correct_answer, metadata
            )
            values (%s, %s, %s, %s, %s, %s, %s, %s)
            on conflict (id) do update set
              section_id = excluded.section_id,
              number = excluded.number,
              prompt = excluded.prompt,
              question_type = excluded.question_type,
              options = excluded.options,
              correct_answer = excluded.correct_answer,
              metadata = excluded.metadata
            """,
            (
                question["id"],
                section_id,
                question["number"],
                question["prompt"],
                question["type"],
                jsonb(question.get("options")) if question.get("options") is not None else None,
                jsonb(question.get("answer")) if question.get("answer") is not None else None,
                jsonb(metadata),
            ),
        )


def seed_tests(cursor: Any) -> tuple[int, int]:
    question_count = 0
    for item in PRACTICE_QUESTIONS:
        upsert_test(cursor, item, "practice")
        section_id = upsert_section(
            cursor,
            item["id"],
            skill_name(item["skill"]),
            item["skill"],
            1,
            1200 if item["skill"] in {"W", "S"} else 900,
            section_content(item["skill"]),
        )
        questions = generated_questions(item, 1 if item["skill"] in {"W", "S"} else 5)
        upsert_questions(cursor, section_id, questions)
        question_count += len(questions)

    for mock in MOCK_TESTS:
        upsert_test(cursor, mock, "mock")
        mock_sections = [
            ("Listening", "L", 1800),
            ("Reading", "R", 3600),
            ("Writing", "W", 3600),
            ("Speaking", "S", 840),
        ]
        for position, (name, skill, time_limit) in enumerate(mock_sections, start=1):
            content = section_content(skill)
            if skill == "W":
                content["prompt"] = "Summarize the information by selecting and reporting the main features."
            if skill == "S":
                content["question"] = "Describe a historical building you have visited and liked."
            section_id = upsert_section(
                cursor, mock["id"], name, skill, position, time_limit, content
            )
            item = {
                "id": f"{mock['id']}-{skill.lower()}",
                "skill": skill,
                "subType": "Mock Section",
                "title": content.get("prompt") or content.get("question") or name,
            }
            questions = generated_questions(item, 10 if skill in {"L", "R"} else 1)
            upsert_questions(cursor, section_id, questions)
            question_count += len(questions)

    return len(PRACTICE_QUESTIONS) + len(MOCK_TESTS), question_count


def seed_typing(cursor: Any) -> int:
    for passage in IELTS_ESSAYS:
        cursor.execute(
            """
            insert into public.typing_passages (id, title, task_type, content, is_published)
            values (%s, %s, %s, %s, true)
            on conflict (id) do update set
              title = excluded.title,
              task_type = excluded.task_type,
              content = excluded.content,
              is_published = true
            """,
            (passage["id"], passage["title"], passage["type"], passage["content"]),
        )
    return len(IELTS_ESSAYS)


def seed_vocabulary(cursor: Any) -> int:
    for word in VOCABULARY_WORDS:
        cursor.execute(
            """
            insert into public.vocabulary_words (
              id, word, category, definition, collocations, example
            )
            values (%s, %s, %s, %s, %s, %s)
            on conflict (id) do update set
              word = excluded.word,
              category = excluded.category,
              definition = excluded.definition,
              collocations = excluded.collocations,
              example = excluded.example
            """,
            (
                word["id"],
                word["word"],
                word["category"],
                word["definition"],
                jsonb(word["collocations"]),
                word["example"],
            ),
        )
    return len(VOCABULARY_WORDS)


def main() -> None:
    with db_connection() as connection:
        with connection.cursor() as cursor:
            lecture_count = seed_lectures(cursor)
            test_count, question_count = seed_tests(cursor)
            typing_count = seed_typing(cursor)
            vocabulary_count = seed_vocabulary(cursor)
        connection.commit()

    print(
        "Seeded "
        f"{lecture_count} lectures, {test_count} tests, {question_count} questions, "
        f"{typing_count} typing passages, and {vocabulary_count} vocabulary words."
    )


if __name__ == "__main__":
    main()
