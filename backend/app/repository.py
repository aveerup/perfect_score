from __future__ import annotations

from datetime import date
import json
import os
import re
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen
from uuid import UUID

from .db import db_connection, fetch_all, fetch_one, jsonb


LISTENING_ID_PREFIX = "listening-"
READING_ID_PREFIX = "reading-"
WRITING_ID_PREFIX = "writing-"


def slugify(value: str) -> str:
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", value.lower()))


def _iso(value: Any) -> Any:
    return value.isoformat() if hasattr(value, "isoformat") else value


def round_to_half_band(value: float) -> float:
    return min(9.0, max(0.0, round(value * 2) / 2))


def _profile_row(row: dict[str, Any]) -> dict[str, Any]:
    created_at = row["created_at"]
    return {
        "id": str(row["id"]),
        "email": row["email"],
        "name": row["full_name"],
        "role": row["role"],
        "location": row["location"] or "",
        "timezone": row["timezone"] or "",
        "targetBand": float(row["target_band"] or 7.5),
        "targetScore": float(row["target_score"] or row["target_band"] or 7.5),
        "currentAverage": float(row["current_band"]),
        "currentBand": float(row["current_band"]),
        "streak": row["streak"],
        "joinDate": created_at.strftime("%B %Y"),
        "rowCreated": _iso(created_at),
        "lastLogin": None,
        "subscription": {"plan": "Free", "status": "active", "renewsOn": None},
    }


def ensure_user_profile(auth_user: dict[str, Any]) -> dict[str, Any]:
    user_id = auth_user["id"]
    email = auth_user.get("email") or ""
    name = auth_user.get("name") or email.split("@", 1)[0] or "Learner"

    with db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                insert into public.profiles (id, email, full_name)
                values (%s, %s, %s)
                on conflict (id) do update set email = excluded.email
                returning *
                """,
                (user_id, email, name),
            )
            profile = cursor.fetchone()
            cursor.execute(
                """
                insert into public.study_plans (user_id)
                values (%s)
                on conflict (user_id) do nothing
                returning id
                """,
                (user_id,),
            )
            created_plan = cursor.fetchone()
            cursor.execute(
                "select id from public.study_plans where user_id = %s",
                (user_id,),
            )
            plan = cursor.fetchone()
            cursor.execute(
                "select count(*) as count from public.study_tasks where plan_id = %s",
                (plan["id"],),
            )
            task_count = cursor.fetchone()["count"]
            if created_plan or task_count == 0:
                cursor.executemany(
                    """
                    insert into public.study_tasks (
                      plan_id, title, feature, estimated_minutes, scheduled_date,
                      is_primary
                    )
                    values (%s, %s, %s, %s, current_date, %s)
                    """,
                    [
                        (plan["id"], "Complete Reading Passage 3", "PRACTICE", 20, True),
                        (plan["id"], "Mastering Multiple Choice", "VIDEO", 15, False),
                        (plan["id"], "Technology Vocabulary Review", "VOCAB", 10, True),
                        (plan["id"], "Mock Test Review", "MOCK", 45, False),
                    ],
                )
            cursor.execute(
                """
                insert into public.user_plans (user_id)
                values (%s)
                on conflict (user_id) do nothing
                """,
                (user_id,),
            )
        connection.commit()

    return _profile_row(profile)


def get_profile(user_id: str) -> dict[str, Any]:
    row = fetch_one("select * from public.profiles where id = %s", (user_id,))
    if not row:
        raise LookupError("Profile not found")
    return _profile_row(row)


def update_profile(user_id: str, values: dict[str, Any]) -> dict[str, Any]:
    column_map = {
        "name": "full_name",
        "location": "location",
        "timezone": "timezone",
        "targetBand": "target_band",
        "targetScore": "target_score",
        "examDate": "exam_date",
    }
    assignments: list[str] = []
    params: list[Any] = []
    for key, value in values.items():
        column = column_map.get(key)
        if column:
            assignments.append(f"{column} = %s")
            params.append(value)
    if not assignments:
        return get_profile(user_id)
    params.append(user_id)
    row = fetch_one(
        f"""
        update public.profiles
        set {", ".join(assignments)}, updated_at = now()
        where id = %s
        returning *
        """,
        tuple(params),
    )
    if not row:
        raise LookupError("Profile not found")
    if "examDate" in values:
        fetch_one(
            """
            update public.study_plans
            set exam_date = %s, updated_at = now()
            where user_id = %s
            returning id
            """,
            (values["examDate"] or None, user_id),
        )
    return _profile_row(row)


def list_lectures(user_id: str, skill: str | None = None) -> list[dict[str, Any]]:
    params: list[Any] = [user_id]
    skill_filter = ""
    if skill and skill != "All":
        skill_filter = "and l.skill = %s"
        params.append(skill)
    rows = fetch_all(
        f"""
        select l.*, coalesce(lp.progress, 0) as progress,
               coalesce(lp.watched, false) as watched
        from public.lectures l
        left join public.lecture_progress lp
          on lp.lecture_id = l.id and lp.user_id = %s
        where l.is_published {skill_filter}
        order by l.published_at desc, l.created_at desc
        """,
        tuple(params),
    )
    return [
        {
            "id": str(row["id"]),
            "title": row["title"],
            "description": row["description"],
            "vimeoId": row["vimeo_id"],
            "embedUrl": f"https://player.vimeo.com/video/{row['vimeo_id']}",
            "skill": row["skill"],
            "duration": row["duration"] or "",
            "bandRange": row["band_range"] or "6.0-9.0",
            "publishedAt": _iso(row["published_at"]),
            "progress": row["progress"],
            "watched": row["watched"],
        }
        for row in rows
    ]


def get_lecture(user_id: str, lecture_id: str) -> dict[str, Any] | None:
    lectures = list_lectures(user_id)
    lecture = next((item for item in lectures if item["id"] == lecture_id), None)
    if not lecture:
        return None
    lecture["upNext"] = [item for item in lectures if item["id"] != lecture_id][:3]
    lecture["transcriptUrl"] = None
    return lecture


def save_lecture_progress(
    user_id: str,
    lecture_id: str,
    progress: int,
    last_position_seconds: int,
    watched: bool,
) -> dict[str, Any]:
    row = fetch_one(
        """
        insert into public.lecture_progress (
          user_id, lecture_id, progress, last_position_seconds, watched
        )
        values (%s, %s, %s, %s, %s)
        on conflict (user_id, lecture_id) do update set
          progress = excluded.progress,
          last_position_seconds = excluded.last_position_seconds,
          watched = excluded.watched,
          updated_at = now()
        returning *
        """,
        (user_id, lecture_id, progress, last_position_seconds, watched),
    )
    return {
        "lectureId": str(row["lecture_id"]),
        "progress": row["progress"],
        "lastPositionSeconds": row["last_position_seconds"],
        "watched": row["watched"],
    }


def _attempt_summary(row: dict[str, Any] | None) -> dict[str, Any]:
    if not row:
        return {
            "attempted": False,
            "score": None,
            "dateTaken": None,
            "sectionScores": None,
        }
    return {
        "attempted": row["status"] == "submitted",
        "score": float(row["overall_score"]) if row["overall_score"] is not None else None,
        "dateTaken": _iso(row["submitted_at"]),
        "sectionScores": row["section_scores"],
    }


def listening_practice_id(test_no: int) -> str:
    return f"{LISTENING_ID_PREFIX}{test_no}"


def listening_test_no(practice_id: str) -> int | None:
    if not practice_id.startswith(LISTENING_ID_PREFIX):
        return None
    try:
        return int(practice_id.removeprefix(LISTENING_ID_PREFIX))
    except ValueError:
        return None


def reading_practice_id(test_no: int) -> str:
    return f"{READING_ID_PREFIX}{test_no}"


def reading_test_no(practice_id: str) -> int | None:
    if not practice_id.startswith(READING_ID_PREFIX):
        return None
    try:
        return int(practice_id.removeprefix(READING_ID_PREFIX))
    except ValueError:
        return None


def writing_practice_id(task_type: str, set_no: int) -> str:
    return f"{WRITING_ID_PREFIX}{task_type}-{set_no}"


def writing_test_key(practice_id: str) -> tuple[str, int] | None:
    if not practice_id.startswith(WRITING_ID_PREFIX):
        return None
    raw = practice_id.removeprefix(WRITING_ID_PREFIX)
    parts = raw.rsplit("-", 1)
    if len(parts) != 2 or parts[0] not in {"task1", "task2"}:
        return None
    try:
        return parts[0], int(parts[1])
    except ValueError:
        return None


def _listening_audio_url(audio_path: str | None) -> str | None:
    if not audio_path:
        return None
    if audio_path.startswith(("http://", "https://")):
        return audio_path
    base_url = (os.getenv("SUPABASE_URL") or "").rstrip("/")
    bucket = os.getenv("LISTENING_AUDIO_BUCKET", "listening_test_audio").strip("/")
    object_path = audio_path.lstrip("/")
    if object_path.startswith(f"{bucket}/"):
        object_path = object_path[len(bucket) + 1 :]
    signing_key = (
        os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        or os.getenv("SUPABASE_SECRET_KEY")
        or os.getenv("SUPABASE_PUBLISHABLE_KEY")
        or os.getenv("SUPABASE_ANON_KEY")
    )
    if not base_url or not signing_key:
        return None

    expires_in = int(os.getenv("LISTENING_AUDIO_SIGNED_URL_SECONDS", "3600"))
    endpoint = (
        f"{base_url}/storage/v1/object/sign/"
        f"{quote(bucket, safe='')}/{quote(object_path, safe='/')}"
    )
    request = Request(
        endpoint,
        data=json.dumps({"expiresIn": expires_in}).encode("utf-8"),
        headers={
            "apikey": signing_key,
            "Authorization": f"Bearer {signing_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=10) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, ValueError):
        return None

    signed_url = payload.get("signedURL") or payload.get("signedUrl")
    if not signed_url:
        return None
    if signed_url.startswith(("http://", "https://")):
        return signed_url
    return f"{base_url}/storage/v1{signed_url}"


def _answer_for_question(answer_key: Any, question_id: str, number: int) -> Any:
    if isinstance(answer_key, dict):
        return (
            answer_key.get(question_id)
            or answer_key.get(str(number))
            or answer_key.get(f"q{number}")
        )
    if isinstance(answer_key, list):
        for item in answer_key:
            if not isinstance(item, dict):
                continue
            if item.get("id") == question_id or item.get("number") == number:
                return item.get("answer")
        if 0 <= number - 1 < len(answer_key):
            return answer_key[number - 1]
    return None


def _normalize_listening_questions(
    raw_questions: Any,
    answer_key: Any | None = None,
    include_answers: bool = False,
) -> list[dict[str, Any]]:
    questions = raw_questions if isinstance(raw_questions, list) else []
    normalized: list[dict[str, Any]] = []
    for index, raw_question in enumerate(questions, start=1):
        if isinstance(raw_question, str):
            question = {"prompt": raw_question}
        elif isinstance(raw_question, dict):
            question = raw_question
        else:
            continue

        number = int(question.get("number") or index)
        question_id = str(question.get("id") or f"q{number}")
        output = {
            "id": question_id,
            "number": number,
            "prompt": question.get("prompt") or question.get("text") or question.get("question") or "",
            "type": question.get("type") or question.get("question_type") or "Short Answer",
            "options": question.get("options"),
        }
        metadata = {
            key: value
            for key, value in question.items()
            if key
            not in {
                "id",
                "number",
                "prompt",
                "text",
                "question",
                "type",
                "question_type",
                "options",
                "answer",
            }
        }
        output.update(metadata)
        if include_answers:
            answer = question.get("answer")
            if answer is None:
                answer = _answer_for_question(answer_key, question_id, number)
            if answer is not None:
                output["answer"] = answer
        normalized.append(output)
    return normalized


def _listening_row_to_test(row: dict[str, Any], include_answers: bool = False) -> dict[str, Any]:
    questions = _normalize_listening_questions(
        row["question"], row.get("answer"), include_answers=include_answers
    )
    test_id = listening_practice_id(row["test_no"])
    title = row["title"] or f"Listening Practice Test {row['test_no']}"
    return {
        "id": test_id,
        "title": title,
        "testType": "practice",
        "skill": "L",
        "subType": row["subtype"] or "IELTS Listening",
        "difficulty": row["category"],
        "bandRange": row["band_range"] or "6.0-9.0",
        "timeLimitSeconds": row["time_limit_seconds"],
        "sections": [
            {
                "id": test_id,
                "name": "Listening",
                "skill": "L",
                "position": 1,
                "timeLimitSeconds": row["time_limit_seconds"],
                "audioUrl": _listening_audio_url(row["audio_path"]),
                "audioPath": row["audio_path"],
                "segments": [{"id": "s1", "label": "Section 1", "timestamp": 0}],
                "questions": questions,
            }
        ],
        "metadata": {"testNo": row["test_no"], "source": "listening_tests"},
    }


def _normalize_reading_payload(
    raw_questions: Any,
    answer_key: Any | None = None,
    include_answers: bool = False,
) -> tuple[str, list[dict[str, Any]], str | None]:
    if isinstance(raw_questions, dict):
        payload = raw_questions
        questions = payload.get("questions") or payload.get("items") or []
        passage = payload.get("passage") or payload.get("text") or payload.get("content") or ""
        title = payload.get("title")
    else:
        payload = {}
        questions = raw_questions if isinstance(raw_questions, list) else []
        passage = ""
        title = None

    normalized: list[dict[str, Any]] = []
    for index, raw_question in enumerate(questions if isinstance(questions, list) else [], start=1):
        if isinstance(raw_question, str):
            question = {"prompt": raw_question}
        elif isinstance(raw_question, dict):
            question = raw_question
        else:
            continue

        number = int(question.get("number") or index)
        question_id = str(question.get("id") or f"q{number}")
        output = {
            "id": question_id,
            "number": number,
            "prompt": question.get("prompt") or question.get("text") or question.get("question") or "",
            "type": question.get("type") or question.get("question_type") or "Short Answer",
            "options": question.get("options"),
        }
        metadata = {
            key: value
            for key, value in question.items()
            if key
            not in {
                "id",
                "number",
                "prompt",
                "text",
                "question",
                "type",
                "question_type",
                "options",
                "answer",
            }
        }
        output.update(metadata)
        if include_answers:
            answer = question.get("answer")
            if answer is None:
                answer = _answer_for_question(answer_key, question_id, number)
            if answer is not None:
                output["answer"] = answer
        normalized.append(output)

    return str(passage), normalized, str(title) if title else None


def _reading_row_to_test(row: dict[str, Any], include_answers: bool = False) -> dict[str, Any]:
    passage, questions, payload_title = _normalize_reading_payload(
        row["questions"], row.get("answers"), include_answers=include_answers
    )
    test_id = reading_practice_id(row["test_no"])
    title = payload_title or f"Reading Practice Test {row['test_no']}"
    return {
        "id": test_id,
        "title": title,
        "testType": "practice",
        "skill": "R",
        "subType": "IELTS Reading",
        "difficulty": row.get("category") or "Medium",
        "bandRange": "6.0-9.0",
        "timeLimitSeconds": 3600,
        "sections": [
            {
                "id": test_id,
                "name": "Reading",
                "skill": "R",
                "position": 1,
                "timeLimitSeconds": 3600,
                "passage": passage,
                "questions": questions,
            }
        ],
        "metadata": {"testNo": row["test_no"], "source": "reading_tests"},
    }


def _normalize_writing_payload(
    raw_questions: Any,
    answer_key: Any | None = None,
    include_answers: bool = False,
) -> tuple[str | None, list[dict[str, Any]]]:
    payload = raw_questions if isinstance(raw_questions, dict) else {}
    raw_items = payload.get("questions") if isinstance(payload.get("questions"), list) else None
    if raw_items is None:
        raw_items = raw_questions if isinstance(raw_questions, list) else [payload]

    questions: list[dict[str, Any]] = []
    for index, raw_question in enumerate(raw_items, start=1):
        if isinstance(raw_question, str):
            question = {"prompt": raw_question}
        elif isinstance(raw_question, dict):
            question = raw_question
        else:
            continue

        number = int(question.get("number") or index)
        question_id = str(question.get("id") or f"q{number}")
        output = {
            "id": question_id,
            "number": number,
            "prompt": question.get("prompt") or question.get("text") or question.get("question") or "",
            "type": question.get("type") or question.get("question_type") or "Long Writing",
            "targetWords": question.get("targetWords") or payload.get("targetWords"),
        }
        metadata = {
            key: value
            for key, value in question.items()
            if key
            not in {
                "id",
                "number",
                "prompt",
                "text",
                "question",
                "type",
                "question_type",
                "targetWords",
                "answer",
            }
        }
        output.update(metadata)
        if include_answers:
            answer = question.get("answer")
            if answer is None:
                answer = _answer_for_question(answer_key, question_id, number)
            if answer is not None:
                output["answer"] = answer
        questions.append(output)

    title = payload.get("title")
    return str(title) if title else None, questions


def _writing_row_to_test(row: dict[str, Any], include_answers: bool = False) -> dict[str, Any]:
    task_type = row["task_type"]
    title, questions = _normalize_writing_payload(
        row["questions"], row.get("answers"), include_answers=include_answers
    )
    test_id = writing_practice_id(task_type, row["set_no"])
    display_task = "Task 1" if task_type == "task1" else "Task 2"
    time_limit = 1200 if task_type == "task1" else 2400
    return {
        "id": test_id,
        "title": title or f"Writing {display_task} Practice Set {row['set_no']}",
        "testType": "practice",
        "skill": "W",
        "subType": f"Writing {display_task}",
        "difficulty": row.get("category") or "Medium",
        "bandRange": "6.0-9.0",
        "timeLimitSeconds": time_limit,
        "sections": [
            {
                "id": test_id,
                "name": "Writing",
                "skill": "W",
                "position": 1,
                "timeLimitSeconds": time_limit,
                "taskType": task_type,
                "questions": questions,
            }
        ],
        "metadata": {"setNo": row["set_no"], "taskType": task_type, "source": "writing_tests"},
    }


def list_listening_tests(user_id: str) -> list[dict[str, Any]]:
    rows = fetch_all(
        """
        select lt.*,
          a.status as attempt_status,
          a.overall_score,
          a.submitted_at
        from public.listening_tests lt
        left join lateral (
          select status, overall_score, submitted_at
          from public.listening_test_attempts
          where user_id = %s and test_no = lt.test_no
          order by started_at desc
          limit 1
        ) a on true
        where lt.is_published
        order by lt.test_no
        """,
        (user_id,),
    )
    output: list[dict[str, Any]] = []
    for row in rows:
        summary = _attempt_summary(
            {
                "status": row["attempt_status"],
                "overall_score": row["overall_score"],
                "section_scores": None,
                "submitted_at": row["submitted_at"],
            }
            if row["attempt_status"]
            else None
        )
        output.append(
            {
                "id": listening_practice_id(row["test_no"]),
                "title": row["title"] or f"Listening Practice Test {row['test_no']}",
                "skill": "L",
                "subType": row["subtype"] or "IELTS Listening",
                "difficulty": row["category"],
                "bandRange": row["band_range"] or "6.0-9.0",
                "attempted": summary["attempted"],
                "score": str(summary["score"]) if summary["score"] is not None else None,
            }
        )
    return output


def list_reading_tests(user_id: str) -> list[dict[str, Any]]:
    rows = fetch_all(
        """
        select rt.*,
          a.status as attempt_status,
          a.overall_score,
          a.submitted_at
        from public.reading_tests rt
        left join lateral (
          select status, overall_score, submitted_at
          from public.reading_test_attempts
          where user_id = %s and test_no = rt.test_no
          order by started_at desc
          limit 1
        ) a on true
        order by rt.test_no
        """,
        (user_id,),
    )
    output: list[dict[str, Any]] = []
    for row in rows:
        passage, questions, title = _normalize_reading_payload(row["questions"])
        summary = _attempt_summary(
            {
                "status": row["attempt_status"],
                "overall_score": row["overall_score"],
                "section_scores": None,
                "submitted_at": row["submitted_at"],
            }
            if row["attempt_status"]
            else None
        )
        output.append(
            {
                "id": reading_practice_id(row["test_no"]),
                "title": title or f"Reading Practice Test {row['test_no']}",
                "skill": "R",
                "subType": "IELTS Reading",
                "difficulty": row.get("category") or "Medium",
                "bandRange": "6.0-9.0",
                "attempted": summary["attempted"],
                "score": str(summary["score"]) if summary["score"] is not None else None,
                "questionCount": len(questions),
                "hasPassage": bool(passage),
            }
        )
    return output


def list_writing_tests(user_id: str) -> list[dict[str, Any]]:
    rows = fetch_all(
        """
        select wt.*,
          a.status as attempt_status,
          a.overall_score,
          a.submitted_at
        from public.writing_tests wt
        left join lateral (
          select status, overall_score, submitted_at
          from public.writing_test_attempts
          where user_id = %s and set_no = wt.set_no and task_type = wt.task_type
          order by started_at desc
          limit 1
        ) a on true
        order by wt.task_type, wt.set_no
        """,
        (user_id,),
    )
    output: list[dict[str, Any]] = []
    for row in rows:
        title, questions = _normalize_writing_payload(row["questions"])
        summary = _attempt_summary(
            {
                "status": row["attempt_status"],
                "overall_score": row["overall_score"],
                "section_scores": None,
                "submitted_at": row["submitted_at"],
            }
            if row["attempt_status"]
            else None
        )
        task_label = "Task 1" if row["task_type"] == "task1" else "Task 2"
        output.append(
            {
                "id": writing_practice_id(row["task_type"], row["set_no"]),
                "title": title or f"Writing {task_label} Practice Set {row['set_no']}",
                "skill": "W",
                "subType": f"Writing {task_label}",
                "difficulty": row.get("category") or "Medium",
                "bandRange": "6.0-9.0",
                "attempted": summary["attempted"],
                "score": str(summary["score"]) if summary["score"] is not None else None,
                "questionCount": len(questions),
            }
        )
    return output


def list_tests(user_id: str, test_type: str) -> list[dict[str, Any]]:
    rows = fetch_all(
        """
        select t.*,
          a.status as attempt_status,
          a.overall_score,
          a.section_scores,
          a.submitted_at
        from public.tests t
        left join lateral (
          select status, overall_score, section_scores, submitted_at
          from public.test_attempts
          where user_id = %s and test_id = t.id
          order by started_at desc
          limit 1
        ) a on true
        where t.test_type = %s and t.is_published
        order by t.created_at, t.id
        """,
        (user_id, test_type),
    )
    output: list[dict[str, Any]] = []
    for row in rows:
        summary = _attempt_summary(
            {
                "status": row["attempt_status"],
                "overall_score": row["overall_score"],
                "section_scores": row["section_scores"],
                "submitted_at": row["submitted_at"],
            }
            if row["attempt_status"]
            else None
        )
        if test_type == "practice":
            output.append(
                {
                    "id": row["id"],
                    "title": row["title"],
                    "skill": row["skill"],
                    "subType": row["subtype"] or "",
                    "difficulty": row["difficulty"] or "Medium",
                    "bandRange": row["band_range"] or "6.0-7.0",
                    "attempted": summary["attempted"],
                    "score": str(summary["score"]) if summary["score"] is not None else None,
                }
            )
        else:
            scores = summary["sectionScores"]
            output.append(
                {
                    "id": row["id"],
                    "number": (row["metadata"] or {}).get("number"),
                    "dateTaken": summary["dateTaken"],
                    "overallBand": summary["score"],
                    "scores": scores,
                    "status": "attempted" if summary["attempted"] else "not-attempted",
                }
            )
    return output


def get_listening_test(practice_id: str, include_answers: bool = False) -> dict[str, Any] | None:
    test_no = listening_test_no(practice_id)
    if test_no is None:
        return None
    row = fetch_one(
        "select * from public.listening_tests where test_no = %s and is_published",
        (test_no,),
    )
    if not row:
        return None
    return _listening_row_to_test(row, include_answers=include_answers)


def get_reading_test(practice_id: str, include_answers: bool = False) -> dict[str, Any] | None:
    test_no = reading_test_no(practice_id)
    if test_no is None:
        return None
    row = fetch_one(
        "select * from public.reading_tests where test_no = %s",
        (test_no,),
    )
    if not row:
        return None
    return _reading_row_to_test(row, include_answers=include_answers)


def get_writing_test(practice_id: str, include_answers: bool = False) -> dict[str, Any] | None:
    key = writing_test_key(practice_id)
    if key is None:
        return None
    task_type, set_no = key
    row = fetch_one(
        "select * from public.writing_tests where task_type = %s and set_no = %s",
        (task_type, set_no),
    )
    if not row:
        return None
    return _writing_row_to_test(row, include_answers=include_answers)


def get_test(test_id: str, include_answers: bool = False) -> dict[str, Any] | None:
    test = fetch_one(
        "select * from public.tests where id = %s and is_published",
        (test_id,),
    )
    if not test:
        return None
    sections = fetch_all(
        "select * from public.test_sections where test_id = %s order by position",
        (test_id,),
    )
    for section in sections:
        answer_column = ", correct_answer" if include_answers else ""
        questions = fetch_all(
            f"""
            select id, number, prompt, question_type, options, metadata
            {answer_column}
            from public.questions
            where section_id = %s
            order by number
            """,
            (section["id"],),
        )
        section["questions"] = [
            {
                "id": question["id"],
                "number": question["number"],
                "prompt": question["prompt"],
                "type": question["question_type"],
                "options": question["options"],
                **(question["metadata"] or {}),
                **(
                    {"answer": question["correct_answer"]}
                    if include_answers and question.get("correct_answer") is not None
                    else {}
                ),
            }
            for question in questions
        ]
        section["content"] = section["content"] or {}
    return {
        "id": test["id"],
        "title": test["title"],
        "testType": test["test_type"],
        "skill": test["skill"],
        "subType": test["subtype"],
        "difficulty": test["difficulty"],
        "bandRange": test["band_range"],
        "timeLimitSeconds": test["time_limit_seconds"],
        "sections": [
            {
                "id": str(section["id"]),
                "name": section["name"],
                "skill": section["skill"],
                "position": section["position"],
                "timeLimitSeconds": section["time_limit_seconds"],
                **section["content"],
                "questions": section["questions"],
            }
            for section in sections
        ],
        "metadata": test["metadata"] or {},
    }


def create_attempt(user_id: str, test_id: str) -> dict[str, Any]:
    test = get_test(test_id)
    if not test:
        raise LookupError("Test not found")
    first_section = test["sections"][0] if test["sections"] else None
    row = fetch_one(
        """
        insert into public.test_attempts (
          user_id, test_id, time_left, active_section
        )
        values (%s, %s, %s, %s)
        returning *
        """,
        (
            user_id,
            test_id,
            test["timeLimitSeconds"],
            first_section["name"] if first_section else None,
        ),
    )
    return attempt_row(row)


def create_listening_attempt(user_id: str, practice_id: str) -> dict[str, Any]:
    test_no = listening_test_no(practice_id)
    if test_no is None:
        raise LookupError("Listening test not found")
    test = get_listening_test(practice_id)
    if not test:
        raise LookupError("Listening test not found")
    row = fetch_one(
        """
        insert into public.listening_test_attempts (
          user_id, test_no, time_left
        )
        values (%s, %s, %s)
        returning *
        """,
        (user_id, test_no, test["timeLimitSeconds"]),
    )
    return listening_attempt_row(row)


def create_reading_attempt(user_id: str, practice_id: str) -> dict[str, Any]:
    test_no = reading_test_no(practice_id)
    if test_no is None:
        raise LookupError("Reading test not found")
    test = get_reading_test(practice_id)
    if not test:
        raise LookupError("Reading test not found")
    row = fetch_one(
        """
        insert into public.reading_test_attempts (
          user_id, test_no, time_left
        )
        values (%s, %s, %s)
        returning *
        """,
        (user_id, test_no, test["timeLimitSeconds"]),
    )
    return reading_attempt_row(row)


def create_writing_attempt(user_id: str, practice_id: str) -> dict[str, Any]:
    key = writing_test_key(practice_id)
    if key is None:
        raise LookupError("Writing test not found")
    task_type, set_no = key
    test = get_writing_test(practice_id)
    if not test:
        raise LookupError("Writing test not found")
    row = fetch_one(
        """
        insert into public.writing_test_attempts (
          user_id, set_no, task_type, time_left
        )
        values (%s, %s, %s, %s)
        returning *
        """,
        (user_id, set_no, task_type, test["timeLimitSeconds"]),
    )
    return writing_attempt_row(row)


def attempt_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(row["id"]),
        "testId": row["test_id"],
        "status": row["status"],
        "currentQuestion": row["current_question"],
        "timeLeft": row["time_left"],
        "activeSection": row["active_section"],
        "answers": row["answers"] or {},
        "createdAt": _iso(row["started_at"]),
    }


def listening_attempt_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(row["id"]),
        "testId": listening_practice_id(row["test_no"]),
        "status": row["status"],
        "currentQuestion": row["current_question"],
        "timeLeft": row["time_left"],
        "activeSection": "Listening",
        "answers": row["answers"] or {},
        "createdAt": _iso(row["started_at"]),
    }


def reading_attempt_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(row["id"]),
        "testId": reading_practice_id(row["test_no"]),
        "status": row["status"],
        "currentQuestion": row["current_question"],
        "timeLeft": row["time_left"],
        "activeSection": "Reading",
        "answers": row["answers"] or {},
        "createdAt": _iso(row["started_at"]),
    }


def draft_reading_attempt(practice_id: str) -> dict[str, Any]:
    test = get_reading_test(practice_id)
    if not test:
        raise LookupError("Reading test not found")
    return {
        "id": practice_id,
        "testId": practice_id,
        "status": "draft",
        "currentQuestion": 1,
        "timeLeft": test["timeLimitSeconds"],
        "activeSection": "Reading",
        "answers": {},
        "createdAt": None,
    }


def writing_attempt_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(row["id"]),
        "testId": writing_practice_id(row["task_type"], row["set_no"]),
        "status": row["status"],
        "currentQuestion": row["current_question"],
        "timeLeft": row["time_left"],
        "activeSection": "Writing",
        "answers": row["answers"] or {},
        "createdAt": _iso(row["started_at"]),
    }


def draft_writing_attempt(practice_id: str) -> dict[str, Any]:
    test = get_writing_test(practice_id)
    if not test:
        raise LookupError("Writing test not found")
    return {
        "id": practice_id,
        "testId": practice_id,
        "status": "draft",
        "currentQuestion": 1,
        "timeLeft": test["timeLimitSeconds"],
        "activeSection": "Writing",
        "answers": {},
        "createdAt": None,
    }


def get_attempt(user_id: str, attempt_id: str) -> dict[str, Any] | None:
    return fetch_one(
        "select * from public.test_attempts where id = %s and user_id = %s",
        (attempt_id, user_id),
    )


def get_listening_attempt(user_id: str, attempt_id: str) -> dict[str, Any] | None:
    return fetch_one(
        "select * from public.listening_test_attempts where id = %s and user_id = %s",
        (attempt_id, user_id),
    )


def get_reading_attempt(user_id: str, attempt_id: str) -> dict[str, Any] | None:
    return fetch_one(
        "select * from public.reading_test_attempts where id = %s and user_id = %s",
        (attempt_id, user_id),
    )


def get_writing_attempt(user_id: str, attempt_id: str) -> dict[str, Any] | None:
    return fetch_one(
        "select * from public.writing_test_attempts where id = %s and user_id = %s",
        (attempt_id, user_id),
    )


def update_attempt(user_id: str, attempt_id: str, values: dict[str, Any]) -> dict[str, Any] | None:
    current = get_attempt(user_id, attempt_id)
    if not current:
        return None
    answers = {**(current["answers"] or {}), **(values.get("answers") or {})}
    row = fetch_one(
        """
        update public.test_attempts
        set current_question = %s,
            time_left = %s,
            active_section = %s,
            answers = %s
        where id = %s and user_id = %s
        returning *
        """,
        (
            values.get("currentQuestion", current["current_question"]),
            values.get("timeLeft", current["time_left"]),
            values.get("activeSection", current["active_section"]),
            jsonb(answers),
            attempt_id,
            user_id,
        ),
    )
    return attempt_row(row)


def update_listening_attempt(
    user_id: str, attempt_id: str, values: dict[str, Any]
) -> dict[str, Any] | None:
    current = get_listening_attempt(user_id, attempt_id)
    if not current:
        return None
    answers = {**(current["answers"] or {}), **(values.get("answers") or {})}
    row = fetch_one(
        """
        update public.listening_test_attempts
        set current_question = %s,
            time_left = %s,
            answers = %s
        where id = %s and user_id = %s
        returning *
        """,
        (
            values.get("currentQuestion", current["current_question"]),
            values.get("timeLeft", current["time_left"]),
            jsonb(answers),
            attempt_id,
            user_id,
        ),
    )
    return listening_attempt_row(row)


def update_reading_attempt(
    user_id: str, attempt_id: str, values: dict[str, Any]
) -> dict[str, Any] | None:
    current = get_reading_attempt(user_id, attempt_id)
    if not current:
        return None
    answers = {**(current["answers"] or {}), **(values.get("answers") or {})}
    row = fetch_one(
        """
        update public.reading_test_attempts
        set current_question = %s,
            time_left = %s,
            answers = %s
        where id = %s and user_id = %s
        returning *
        """,
        (
            values.get("currentQuestion", current["current_question"]),
            values.get("timeLeft", current["time_left"]),
            jsonb(answers),
            attempt_id,
            user_id,
        ),
    )
    return reading_attempt_row(row)


def update_writing_attempt(
    user_id: str, attempt_id: str, values: dict[str, Any]
) -> dict[str, Any] | None:
    current = get_writing_attempt(user_id, attempt_id)
    if not current:
        return None
    answers = {**(current["answers"] or {}), **(values.get("answers") or {})}
    row = fetch_one(
        """
        update public.writing_test_attempts
        set current_question = %s,
            time_left = %s,
            answers = %s
        where id = %s and user_id = %s
        returning *
        """,
        (
            values.get("currentQuestion", current["current_question"]),
            values.get("timeLeft", current["time_left"]),
            jsonb(answers),
            attempt_id,
            user_id,
        ),
    )
    return writing_attempt_row(row)


def _normalize_answer(value: Any) -> str:
    return str(value or "").strip().lower()


def _answer_matches(submitted: Any, answer_key: Any) -> bool:
    if isinstance(answer_key, list):
        return any(_answer_matches(submitted, option) for option in answer_key)
    return _normalize_answer(submitted) == _normalize_answer(answer_key)


def writing_band(text: str | None) -> float:
    word_count = len((text or "").split())
    if word_count >= 250:
        return 7.5
    if word_count >= 150:
        return 6.5
    if word_count >= 80:
        return 6.0
    return 5.5


def score_listening_test(
    test: dict[str, Any],
    answers: dict[str, Any],
) -> tuple[float, dict[str, Any], list[dict[str, Any]]]:
    questions = test["sections"][0]["questions"] if test["sections"] else []
    objective_questions = [question for question in questions if "answer" in question]
    correct = 0
    graded_answers: list[dict[str, Any]] = []
    for question in objective_questions:
        submitted = answers.get(question["id"], "")
        is_correct = _answer_matches(submitted, question["answer"])
        correct += int(is_correct)
        graded_answers.append(
            {
                "questionId": question["id"],
                "answer": submitted,
                "isCorrect": is_correct,
                "score": 1 if is_correct else 0,
            }
        )

    total = len(objective_questions)
    score = round_to_half_band(5 + (correct / total) * 4) if total else 0
    result = {
        "practiceId": test["id"],
        "title": test["title"],
        "skill": "L",
        "score": score,
        "rawScore": {"correct": correct, "total": total},
        "scoringMode": "basic",
        "criteria": [
            {"name": "Listening Accuracy", "score": score},
            {"name": "Detail Recognition", "score": score},
            {"name": "Spelling & Numbers", "score": score},
            {"name": "Question Handling", "score": score},
        ],
        "heatmap": [100 if item["isCorrect"] else 35 for item in graded_answers],
        "feedback": [
            "Objective listening answers are checked against the stored answer key.",
            "Review missed items and replay the audio before attempting another set.",
        ],
        "errorLogAdded": any(not item["isCorrect"] for item in graded_answers),
    }
    return score, result, graded_answers


def score_reading_test(
    test: dict[str, Any],
    answers: dict[str, Any],
) -> tuple[float, dict[str, Any], list[dict[str, Any]]]:
    questions = test["sections"][0]["questions"] if test["sections"] else []
    objective_questions = [question for question in questions if "answer" in question]
    correct = 0
    graded_answers: list[dict[str, Any]] = []
    for question in objective_questions:
        submitted = answers.get(question["id"], "")
        is_correct = _answer_matches(submitted, question["answer"])
        correct += int(is_correct)
        graded_answers.append(
            {
                "questionId": question["id"],
                "answer": submitted,
                "isCorrect": is_correct,
                "score": 1 if is_correct else 0,
            }
        )

    total = len(objective_questions)
    score = round_to_half_band(5 + (correct / total) * 4) if total else 0
    result = {
        "practiceId": test["id"],
        "title": test["title"],
        "skill": "R",
        "score": score,
        "rawScore": {"correct": correct, "total": total},
        "scoringMode": "basic",
        "criteria": [
            {"name": "Reading Accuracy", "score": score},
            {"name": "Information Location", "score": score},
            {"name": "Vocabulary In Context", "score": score},
            {"name": "Question Handling", "score": score},
        ],
        "heatmap": [100 if item["isCorrect"] else 35 for item in graded_answers],
        "feedback": [
            "Objective reading answers are checked against the stored answer key.",
            "Review missed items and re-read the passage before attempting another set.",
        ],
        "errorLogAdded": any(not item["isCorrect"] for item in graded_answers),
    }
    return score, result, graded_answers


def score_writing_test(
    test: dict[str, Any],
    essay_text: str | None,
) -> tuple[float, dict[str, Any]]:
    score = writing_band(essay_text)
    word_count = len((essay_text or "").split())
    task_type = (test.get("metadata") or {}).get("taskType")
    target_words = 150 if task_type == "task1" else 250
    result = {
        "practiceId": test["id"],
        "title": test["title"],
        "skill": "W",
        "score": score,
        "rawScore": {"wordCount": word_count, "targetWords": target_words},
        "scoringMode": "basic",
        "criteria": [
            {"name": "Task Response", "score": score},
            {"name": "Coherence & Cohesion", "score": score},
            {"name": "Lexical Resource", "score": round_to_half_band(score + 0.25)},
            {"name": "Grammar Range & Accuracy", "score": score},
        ],
        "heatmap": [100 if word_count >= target_words else 45],
        "feedback": [
            "This is a basic automated writing estimate based on completion length.",
            "A detailed IELTS writing evaluator can be added later for criterion-level feedback.",
        ],
        "errorLogAdded": word_count < target_words,
    }
    return score, result


def submit_listening_attempt(
    user_id: str,
    attempt_id: str,
    answers: dict[str, Any],
    duration_seconds: int | None,
    score: float,
    result: dict[str, Any],
) -> dict[str, Any] | None:
    current = get_listening_attempt(user_id, attempt_id)
    if not current:
        return None
    merged_answers = {**(current["answers"] or {}), **answers}
    row = fetch_one(
        """
        update public.listening_test_attempts
        set status = 'submitted',
            answers = %s,
            duration_seconds = %s,
            overall_score = %s,
            result = %s,
            submitted_at = now()
        where id = %s and user_id = %s
        returning *
        """,
        (
            jsonb(merged_answers),
            duration_seconds,
            score,
            jsonb(result),
            attempt_id,
            user_id,
        ),
    )
    return listening_attempt_row(row)


def submit_reading_attempt(
    user_id: str,
    attempt_id: str,
    answers: dict[str, Any],
    duration_seconds: int | None,
    score: float,
    result: dict[str, Any],
) -> dict[str, Any] | None:
    current = get_reading_attempt(user_id, attempt_id)
    if not current:
        return None
    merged_answers = {**(current["answers"] or {}), **answers}
    row = fetch_one(
        """
        update public.reading_test_attempts
        set status = 'submitted',
            answers = %s,
            duration_seconds = %s,
            overall_score = %s,
            result = %s,
            submitted_at = now()
        where id = %s and user_id = %s
        returning *
        """,
        (
            jsonb(merged_answers),
            duration_seconds,
            score,
            jsonb(result),
            attempt_id,
            user_id,
        ),
    )
    return reading_attempt_row(row)


def submit_writing_attempt(
    user_id: str,
    attempt_id: str,
    answers: dict[str, Any],
    essay_text: str | None,
    duration_seconds: int | None,
    score: float,
    result: dict[str, Any],
) -> dict[str, Any] | None:
    current = get_writing_attempt(user_id, attempt_id)
    if not current:
        return None
    merged_answers = {**(current["answers"] or {}), **answers}
    row = fetch_one(
        """
        update public.writing_test_attempts
        set status = 'submitted',
            answers = %s,
            essay_text = %s,
            duration_seconds = %s,
            overall_score = %s,
            result = %s,
            submitted_at = now()
        where id = %s and user_id = %s
        returning *
        """,
        (
            jsonb(merged_answers),
            essay_text,
            duration_seconds,
            score,
            jsonb(result),
            attempt_id,
            user_id,
        ),
    )
    return writing_attempt_row(row)


def submit_attempt(
    user_id: str,
    attempt_id: str,
    answers: dict[str, Any],
    essay_text: str | None,
    speaking_transcript: str | None,
    duration_seconds: int | None,
    score: float,
    section_scores: dict[str, float] | None,
    result: dict[str, Any],
    graded_answers: list[dict[str, Any]],
) -> dict[str, Any] | None:
    current = get_attempt(user_id, attempt_id)
    if not current:
        return None
    merged_answers = {**(current["answers"] or {}), **answers}
    with db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                update public.test_attempts
                set status = 'submitted',
                    answers = %s,
                    essay_text = %s,
                    speaking_transcript = %s,
                    duration_seconds = %s,
                    overall_score = %s,
                    section_scores = %s,
                    result = %s,
                    submitted_at = now()
                where id = %s and user_id = %s
                returning *
                """,
                (
                    jsonb(merged_answers),
                    essay_text,
                    speaking_transcript,
                    duration_seconds,
                    score,
                    jsonb(section_scores) if section_scores is not None else None,
                    jsonb(result),
                    attempt_id,
                    user_id,
                ),
            )
            row = cursor.fetchone()
            for graded in graded_answers:
                cursor.execute(
                    """
                    insert into public.test_answers (
                      attempt_id, question_id, answer, is_correct, score
                    )
                    values (%s, %s, %s, %s, %s)
                    on conflict (attempt_id, question_id) do update set
                      answer = excluded.answer,
                      is_correct = excluded.is_correct,
                      score = excluded.score
                    """,
                    (
                        attempt_id,
                        graded["questionId"],
                        jsonb(graded["answer"]),
                        graded["isCorrect"],
                        graded.get("score"),
                    ),
                )
        connection.commit()
    return attempt_row(row)


def latest_listening_result(user_id: str, practice_id: str) -> dict[str, Any] | None:
    test_no = listening_test_no(practice_id)
    if test_no is None:
        return None
    row = fetch_one(
        """
        select result, overall_score, submitted_at
        from public.listening_test_attempts
        where user_id = %s and test_no = %s and status = 'submitted'
        order by submitted_at desc
        limit 1
        """,
        (user_id, test_no),
    )
    if not row:
        return None
    return row["result"] or {
        "practiceId": practice_id,
        "score": float(row["overall_score"]),
        "dateTaken": _iso(row["submitted_at"]),
    }


def latest_reading_result(user_id: str, practice_id: str) -> dict[str, Any] | None:
    test_no = reading_test_no(practice_id)
    if test_no is None:
        return None
    row = fetch_one(
        """
        select result, overall_score, submitted_at
        from public.reading_test_attempts
        where user_id = %s and test_no = %s and status = 'submitted'
        order by submitted_at desc
        limit 1
        """,
        (user_id, test_no),
    )
    if not row:
        return None
    return row["result"] or {
        "practiceId": practice_id,
        "score": float(row["overall_score"]),
        "dateTaken": _iso(row["submitted_at"]),
    }


def latest_writing_result(user_id: str, practice_id: str) -> dict[str, Any] | None:
    key = writing_test_key(practice_id)
    if key is None:
        return None
    task_type, set_no = key
    row = fetch_one(
        """
        select result, overall_score, submitted_at
        from public.writing_test_attempts
        where user_id = %s and task_type = %s and set_no = %s and status = 'submitted'
        order by submitted_at desc
        limit 1
        """,
        (user_id, task_type, set_no),
    )
    if not row:
        return None
    return row["result"] or {
        "practiceId": practice_id,
        "score": float(row["overall_score"]),
        "dateTaken": _iso(row["submitted_at"]),
    }


def latest_result(user_id: str, test_id: str) -> dict[str, Any] | None:
    row = fetch_one(
        """
        select result, overall_score, section_scores, submitted_at
        from public.test_attempts
        where user_id = %s and test_id = %s and status = 'submitted'
        order by submitted_at desc
        limit 1
        """,
        (user_id, test_id),
    )
    if not row:
        return None
    return row["result"] or {
        "testId": test_id,
        "overallBand": float(row["overall_score"]),
        "scores": row["section_scores"],
        "dateTaken": _iso(row["submitted_at"]),
    }


def list_typing_passages(user_id: str) -> list[dict[str, Any]]:
    rows = fetch_all(
        """
        select p.*,
          max(a.wpm) as best_wpm,
          max(a.accuracy) as best_accuracy
        from public.typing_passages p
        left join public.typing_attempts a
          on a.passage_id = p.id and a.user_id = %s
        where p.is_published
        group by p.id
        order by p.created_at, p.id
        """,
        (user_id,),
    )
    return [
        {
            "id": row["id"],
            "title": row["title"],
            "type": row["task_type"],
            "content": row["content"],
            "bestWpm": float(row["best_wpm"]) if row["best_wpm"] is not None else None,
            "bestAccuracy": float(row["best_accuracy"]) if row["best_accuracy"] is not None else None,
        }
        for row in rows
    ]


def save_typing_attempt(
    user_id: str,
    passage_id: str,
    wpm: float,
    accuracy: float,
    duration_seconds: int,
) -> dict[str, Any]:
    with db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                insert into public.typing_attempts (
                  user_id, passage_id, wpm, accuracy, duration_seconds
                )
                values (%s, %s, %s, %s, %s)
                returning *
                """,
                (user_id, passage_id, wpm, accuracy, duration_seconds),
            )
            attempt = cursor.fetchone()
            cursor.execute(
                """
                select *
                from public.typing_attempts
                where user_id = %s and passage_id = %s
                order by wpm desc, accuracy desc
                limit 1
                """,
                (user_id, passage_id),
            )
            best = cursor.fetchone()
        connection.commit()
    return {
        "attempt": typing_attempt_row(attempt),
        "best": typing_attempt_row(best),
    }


def typing_attempt_row(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(row["id"]),
        "essayId": row["passage_id"],
        "wpm": float(row["wpm"]),
        "accuracy": float(row["accuracy"]),
        "durationSeconds": row["duration_seconds"],
        "date": _iso(row["created_at"]),
    }


def list_vocabulary(user_id: str, group: str | None = None) -> list[dict[str, Any]]:
    params: list[Any] = [user_id]
    group_filter = ""
    if group:
        group_filter = "where w.group_name = %s"
        params.append(group)
    rows = fetch_all(
        f"""
        select w.*, coalesce(vp.mastery_level, 0) as mastery_level
        from public.vocabulary_words w
        left join public.vocabulary_progress vp
          on vp.word_id = w.id and vp.user_id = %s
        {group_filter}
        order by w.group_name, w.word
        """,
        tuple(params),
    )
    return [
        {
            "id": row["id"],
            "word": row["word"],
            "group": row["group_name"],
            "type": row["word_type"],
            "englishMeaning": row["english_meaning"],
            "banglaMeaning": row["bangla_meaning"],
            "sentence": row["sentence"],
            "sentenceBanglaMeaning": row["sentence_bangla_meaning"],
            "masteryLevel": row["mastery_level"],
        }
        for row in rows
    ]


def vocabulary_groups(user_id: str) -> list[dict[str, Any]]:
    rows = fetch_all(
        """
        select w.group_name, count(*) as word_count,
          round(coalesce(avg(coalesce(vp.mastery_level, 0)), 0) / 4 * 100) as mastery
        from public.vocabulary_words w
        left join public.vocabulary_progress vp
          on vp.word_id = w.id and vp.user_id = %s
        group by w.group_name
        order by w.group_name
        """,
        (user_id,),
    )
    return [
        {
            "group": row["group_name"],
            "wordCount": row["word_count"],
            "mastery": int(row["mastery"]),
        }
        for row in rows
    ]


def vocabulary_categories(user_id: str) -> list[dict[str, Any]]:
    return vocabulary_groups(user_id)


def save_vocabulary_review(user_id: str, word_id: str, result: str) -> dict[str, Any]:
    delta = {"again": -1, "hard": 0, "good": 1, "easy": 1, "known": 1}[result]
    row = fetch_one(
        """
        insert into public.vocabulary_progress (
          user_id, word_id, mastery_level, last_result
        )
        values (%s, %s, greatest(0, %s), %s)
        on conflict (user_id, word_id) do update set
          mastery_level = least(4, greatest(0, vocabulary_progress.mastery_level + %s)),
          last_result = excluded.last_result,
          updated_at = now()
        returning *
        """,
        (user_id, word_id, delta, result, delta),
    )
    word = next(item for item in list_vocabulary(user_id) if item["id"] == word_id)
    return {
        "review": {
            "wordId": word_id,
            "result": result,
            "date": _iso(row["updated_at"]),
        },
        "word": word,
    }


def _plan_part_sort_key(key: str) -> tuple[int, int, str]:
    prefix_order = {"day": 0, "week": 1, "month": 2}
    match = re.match(r"^(day|week|month)-(\d+)$", key)
    if not match:
        return (99, 0, key)
    return (prefix_order[match.group(1)], int(match.group(2)), key)


def _plan_parts(details: dict[str, Any]) -> list[dict[str, Any]]:
    return [
        {"key": key, **value}
        for key, value in sorted(details.items(), key=lambda item: _plan_part_sort_key(item[0]))
        if isinstance(value, dict)
    ]


def _plan_summary(row: dict[str, Any]) -> dict[str, Any]:
    details = row["details"] or {}
    parts = _plan_parts(details)
    unit = "Part"
    if parts:
        unit = parts[0]["key"].split("-", 1)[0].title()
    return {
        "title": row["title"],
        "slug": slugify(row["title"]),
        "partCount": len(parts),
        "unit": unit,
    }


def list_plans() -> list[dict[str, Any]]:
    rows = fetch_all("select title, details from public.plans order by title")
    summaries = [_plan_summary(row) for row in rows]
    order = {
        "1-week-crash-plan": 0,
        "2-week-ielts-study-plan": 1,
        "1-month-ielts-study-plan": 2,
        "2-month-ielts-study-plan": 3,
        "6-month-ielts-study-plan": 4,
    }
    return sorted(summaries, key=lambda item: order.get(item["slug"], 99))


def get_plan(slug: str) -> dict[str, Any] | None:
    rows = fetch_all("select title, details from public.plans order by title")
    row = next((item for item in rows if slugify(item["title"]) == slug), None)
    if not row:
        return None
    summary = _plan_summary(row)
    return {
        **summary,
        "parts": _plan_parts(row["details"] or {}),
    }


def get_user_plan_progress(user_id: str) -> dict[str, Any]:
    row = fetch_one(
        """
        insert into public.user_plans (user_id)
        values (%s)
        on conflict (user_id) do update set user_id = excluded.user_id
        returning following_plans, completed
        """,
        (user_id,),
    )
    return {
        "followingPlans": row["following_plans"] or [],
        "completed": row["completed"] or {},
    }


def set_user_plan_part(
    user_id: str,
    plan_slug: str,
    part_key: str,
    completed: bool,
) -> dict[str, Any] | None:
    plan = get_plan(plan_slug)
    if not plan:
        return None
    if part_key not in {part["key"] for part in plan["parts"]}:
        raise LookupError("Plan part not found")

    progress = get_user_plan_progress(user_id)
    plan_title = plan["title"]
    following = set(progress["followingPlans"])
    completed_map = {
        title: set(parts)
        for title, parts in (progress["completed"] or {}).items()
        if isinstance(parts, list)
    }
    completed_parts = completed_map.get(plan_title, set())

    if completed:
        following.add(plan_title)
        completed_parts.add(part_key)
        completed_map[plan_title] = completed_parts
    else:
        completed_parts.discard(part_key)
        if completed_parts:
            completed_map[plan_title] = completed_parts
        else:
            completed_map.pop(plan_title, None)
            following.discard(plan_title)

    row = fetch_one(
        """
        insert into public.user_plans (user_id, following_plans, completed)
        values (%s, %s, %s)
        on conflict (user_id) do update set
          following_plans = excluded.following_plans,
          completed = excluded.completed
        returning following_plans, completed
        """,
        (
            user_id,
            jsonb(sorted(following)),
            jsonb({title: sorted(parts, key=_plan_part_sort_key) for title, parts in completed_map.items()}),
        ),
    )
    return {
        "followingPlans": row["following_plans"] or [],
        "completed": row["completed"] or {},
    }


def get_study_plan(user_id: str) -> dict[str, Any]:
    plan = fetch_one("select * from public.study_plans where user_id = %s", (user_id,))
    if not plan:
        raise LookupError("Study plan not found")
    tasks = fetch_all(
        """
        select * from public.study_tasks
        where plan_id = %s
        order by scheduled_date, created_at
        """,
        (plan["id"],),
    )
    return {
        "tier": plan["tier"],
        "startDate": _iso(plan["start_date"]),
        "examDate": _iso(plan["exam_date"]),
        "todayTasks": [
            {
                "id": str(task["id"]),
                "title": task["title"],
                "feature": task["feature"],
                "estimatedTime": f"{task['estimated_minutes']}m",
                "isPrimary": task["is_primary"],
                "completed": task["completed"],
            }
            for task in tasks
            if task["scheduled_date"] == date.today()
        ],
        "days": [],
    }


def update_study_task(user_id: str, task_id: str, completed: bool) -> dict[str, Any] | None:
    row = fetch_one(
        """
        update public.study_tasks st
        set completed = %s
        from public.study_plans sp
        where st.id = %s and st.plan_id = sp.id and sp.user_id = %s
        returning st.*
        """,
        (completed, task_id, user_id),
    )
    if not row:
        return None
    return {
        "id": str(row["id"]),
        "title": row["title"],
        "completed": row["completed"],
    }


def dashboard(user_id: str) -> dict[str, Any]:
    profile = get_profile(user_id)
    categories = vocabulary_categories(user_id)
    recent = fetch_all(
        """
        select t.title, a.duration_seconds, a.submitted_at
        from public.test_attempts a
        join public.tests t on t.id = a.test_id
        where a.user_id = %s and a.status = 'submitted'
        order by a.submitted_at desc
        limit 5
        """,
        (user_id,),
    )
    practice_seconds = fetch_one(
        """
        select coalesce(sum(duration_seconds), 0) as total
        from (
          select duration_seconds from public.test_attempts
          where user_id = %s and status = 'submitted'
          union all
          select duration_seconds from public.typing_attempts where user_id = %s
        ) activity
        """,
        (user_id, user_id),
    )["total"]
    return {
        "user": profile,
        "currentBand": profile["currentBand"],
        "targetBand": profile["targetBand"],
        "streak": profile["streak"],
        "practiceTimeHours": round(practice_seconds / 3600, 1),
        "skillProficiency": [
            {"skill": "Listening", "current": profile["currentBand"], "sub": "Keep practicing"},
            {"skill": "Reading", "current": profile["currentBand"], "sub": "Keep practicing"},
            {"skill": "Writing", "current": profile["currentBand"], "sub": "Keep practicing"},
            {"skill": "Speaking", "current": profile["currentBand"], "sub": "Keep practicing"},
        ],
        "errorLog": [],
        "recentSessions": [
            {
                "id": str(index),
                "type": row["title"],
                "duration": f"{round((row['duration_seconds'] or 0) / 60)}m",
                "date": _iso(row["submitted_at"]),
            }
            for index, row in enumerate(recent, start=1)
        ],
        "practiceSchedule": [],
        "vocabularyMastery": categories,
        "mockTests": list_tests(user_id, "mock"),
        "practiceQuestions": list_tests(user_id, "practice"),
    }


def search_content(user_id: str, term: str) -> dict[str, Any]:
    lowered = term.lower()
    return {
        "practice": [
            item
            for item in list_tests(user_id, "practice")
            if lowered in item["title"].lower() or lowered in item["subType"].lower()
        ][:6],
        "lectures": [
            item for item in list_lectures(user_id) if lowered in item["title"].lower()
        ][:6],
        "vocabulary": [
            item
            for item in list_vocabulary(user_id)
            if lowered in item["word"].lower()
            or lowered in item["englishMeaning"].lower()
            or lowered in item["banglaMeaning"].lower()
            or lowered in item["sentence"].lower()
            or lowered in item["sentenceBanglaMeaning"].lower()
            or lowered in item["group"].lower()
        ][:8],
    }
