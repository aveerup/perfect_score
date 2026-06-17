from __future__ import annotations

from datetime import date
from typing import Any
from uuid import UUID

from .db import db_connection, fetch_all, fetch_one, jsonb


def _iso(value: Any) -> Any:
    return value.isoformat() if hasattr(value, "isoformat") else value


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


def get_attempt(user_id: str, attempt_id: str) -> dict[str, Any] | None:
    return fetch_one(
        "select * from public.test_attempts where id = %s and user_id = %s",
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


def list_vocabulary(user_id: str, category: str | None = None) -> list[dict[str, Any]]:
    params: list[Any] = [user_id]
    category_filter = ""
    if category:
        category_filter = "where w.category = %s"
        params.append(category)
    rows = fetch_all(
        f"""
        select w.*, coalesce(vp.mastery_level, 0) as mastery_level
        from public.vocabulary_words w
        left join public.vocabulary_progress vp
          on vp.word_id = w.id and vp.user_id = %s
        {category_filter}
        order by w.category, w.word
        """,
        tuple(params),
    )
    return [
        {
            "id": row["id"],
            "word": row["word"],
            "category": row["category"],
            "definition": row["definition"],
            "collocations": row["collocations"],
            "example": row["example"],
            "masteryLevel": row["mastery_level"],
        }
        for row in rows
    ]


def vocabulary_categories(user_id: str) -> list[dict[str, Any]]:
    rows = fetch_all(
        """
        select w.category, count(*) as word_count,
          round(coalesce(avg(coalesce(vp.mastery_level, 0)), 0) / 4 * 100) as mastery
        from public.vocabulary_words w
        left join public.vocabulary_progress vp
          on vp.word_id = w.id and vp.user_id = %s
        group by w.category
        order by w.category
        """,
        (user_id,),
    )
    return [
        {
            "category": row["category"],
            "wordCount": row["word_count"],
            "mastery": int(row["mastery"]),
        }
        for row in rows
    ]


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
            or lowered in item["definition"].lower()
            or lowered in item["category"].lower()
        ][:8],
    }
