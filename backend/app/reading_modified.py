from __future__ import annotations

from typing import Any
from uuid import UUID

from .db import fetch_all, fetch_one, jsonb


PRACTICE_ID_PREFIX = "reading-modified-"
GAP_MARKER = "{<gap>}"


def test_id_from_practice_id(practice_id: str) -> UUID | None:
    if not practice_id.startswith(PRACTICE_ID_PREFIX):
        return None
    try:
        return UUID(practice_id.removeprefix(PRACTICE_ID_PREFIX))
    except ValueError:
        return None


def practice_id(test_id: Any) -> str:
    return f"{PRACTICE_ID_PREFIX}{test_id}"


def _iso(value: Any) -> str | None:
    return value.isoformat() if value is not None else None


def _test_payload(row: dict[str, Any], *, admin: bool = False) -> dict[str, Any]:
    components = []
    answer_key = row["answers"] or {}
    for component in row["components"] or []:
        item = dict(component)
        if item.get("type") == "fillGaps":
            item["questions"] = [
                {**question, **({"answer": answer_key.get(question["id"], "")} if admin else {})}
                for question in item.get("questions", [])
            ]
        elif item.get("type") == "mcq":
            item["questions"] = [
                {**question, **({"correctOptionId": answer_key.get(question["id"], "")} if admin else {})}
                for question in item.get("questions", [])
            ]
        elif item.get("type") == "completeSentence":
            item["questions"] = [
                {**question, **({"correctEndingId": answer_key.get(question["id"], "")} if admin else {})}
                for question in item.get("questions", [])
            ]
        components.append(item)
    result = {
        "id": practice_id(row["id"]),
        "title": row["title"],
        "components": components,
        "isPublished": row["is_published"],
        "createdAt": _iso(row["created_at"]),
        "updatedAt": _iso(row["updated_at"]),
    }
    return result


def normalize_components(components: list[dict[str, Any]], *, require_complete: bool) -> tuple[list[dict[str, Any]], dict[str, str]]:
    stored: list[dict[str, Any]] = []
    answer_key: dict[str, str] = {}
    seen_ids: set[str] = set()
    for component in components:
        component_id = component["id"]
        if component_id in seen_ids:
            raise ValueError("Component IDs must be unique")
        seen_ids.add(component_id)
        if component["type"] == "passage":
            stored.append({"id": component_id, "type": "passage", "markdown": component["markdown"]})
            continue
        questions = []
        if component["type"] == "fillGaps":
            for question in component["questions"]:
                question_id = question["id"]
                if question_id in seen_ids:
                    raise ValueError("Question IDs must be unique")
                seen_ids.add(question_id)
                if require_complete and question["text"].count(GAP_MARKER) != 1:
                    raise ValueError("Each fill gaps question must contain exactly one {<gap>} marker")
                questions.append({"id": question_id, "text": question["text"]})
                if component["answerEnabled"]:
                    answer = question.get("answer") or ""
                    if require_complete and not answer.strip():
                        raise ValueError("Every question needs an answer when its answer section is enabled")
                    if answer.strip():
                        answer_key[question_id] = answer
        elif component["type"] == "mcq":
            for question in component["questions"]:
                question_id = question["id"]
                if question_id in seen_ids:
                    raise ValueError("Question IDs must be unique")
                seen_ids.add(question_id)
                if require_complete and not question["text"].strip():
                    raise ValueError("Every MCQ needs question text")
                options = []
                option_ids: set[str] = set()
                for option in question["options"]:
                    option_id = option["id"]
                    if option_id in seen_ids:
                        raise ValueError("Option IDs must be unique")
                    seen_ids.add(option_id)
                    option_ids.add(option_id)
                    if require_complete and not option["text"].strip():
                        raise ValueError("Every MCQ option needs text")
                    options.append({"id": option_id, "text": option["text"]})
                if require_complete and len(options) < 2:
                    raise ValueError("Every MCQ needs at least two options")
                questions.append({"id": question_id, "text": question["text"], "options": options})
                if component["answerEnabled"]:
                    correct_option_id = question.get("correctOptionId") or ""
                    if require_complete and not correct_option_id:
                        raise ValueError("Every MCQ needs a correct option when its answer section is enabled")
                    if correct_option_id and correct_option_id not in option_ids:
                        raise ValueError("An MCQ answer must reference one of its options")
                    if correct_option_id:
                        answer_key[question_id] = correct_option_id
        else:
            for question in component["questions"]:
                question_id = question["id"]
                if question_id in seen_ids:
                    raise ValueError("Question IDs must be unique")
                seen_ids.add(question_id)
                if require_complete and not question["text"].strip():
                    raise ValueError("Every complete sentence question needs text")
                questions.append({"id": question_id, "text": question["text"]})
            endings = []
            ending_ids: set[str] = set()
            for ending in component["endings"]:
                ending_id = ending["id"]
                if ending_id in seen_ids:
                    raise ValueError("Remaining sentence IDs must be unique")
                seen_ids.add(ending_id)
                ending_ids.add(ending_id)
                if require_complete and not ending["text"].strip():
                    raise ValueError("Every remaining sentence needs text")
                endings.append({"id": ending_id, "text": ending["text"]})
            if require_complete and questions and not endings:
                raise ValueError("Add at least one remaining sentence")
            if component["answerEnabled"]:
                for question in component["questions"]:
                    correct_ending_id = question.get("correctEndingId") or ""
                    if require_complete and not correct_ending_id:
                        raise ValueError("Every complete sentence question needs an answer when its answer section is enabled")
                    if correct_ending_id and correct_ending_id not in ending_ids:
                        raise ValueError("A complete sentence answer must reference one of its remaining sentences")
                    if correct_ending_id:
                        answer_key[question["id"]] = correct_ending_id
        stored_component = {
            "id": component_id,
            "type": component["type"],
            "heading": component["heading"],
            "answerEnabled": component["answerEnabled"],
            "questions": questions,
        }
        if component["type"] == "completeSentence":
            stored_component["endings"] = endings
        stored.append(stored_component)
    return stored, answer_key


def list_admin_sets() -> list[dict[str, Any]]:
    rows = fetch_all(
        "select * from public.reading_tests_modified where deleted_at is null order by created_at desc"
    )
    return [_test_payload(row, admin=True) for row in rows]


def get_set(test_id: UUID, *, admin: bool = False) -> dict[str, Any] | None:
    row = fetch_one(
        "select * from public.reading_tests_modified where id = %s and deleted_at is null and (%s or is_published)",
        (test_id, admin),
    )
    return _test_payload(row, admin=admin) if row else None


def create_set(title: str, components: list[dict[str, Any]], is_published: bool) -> dict[str, Any]:
    stored, answers = normalize_components(components, require_complete=is_published)
    row = fetch_one(
        """
        insert into public.reading_tests_modified (title, components, answers, is_published)
        values (%s, %s, %s, %s) returning *
        """,
        (title, jsonb(stored), jsonb(answers), is_published),
    )
    return _test_payload(row, admin=True)


def update_set(test_id: UUID, title: str, components: list[dict[str, Any]], is_published: bool) -> dict[str, Any] | None:
    stored, answers = normalize_components(components, require_complete=is_published)
    row = fetch_one(
        """
        update public.reading_tests_modified
        set title = %s, components = %s, answers = %s, is_published = %s, updated_at = now()
        where id = %s and deleted_at is null returning *
        """,
        (title, jsonb(stored), jsonb(answers), is_published, test_id),
    )
    return _test_payload(row, admin=True) if row else None


def delete_set(test_id: UUID) -> bool:
    row = fetch_one(
        """
        update public.reading_tests_modified
        set deleted_at = now(), is_published = false, updated_at = now()
        where id = %s and deleted_at is null returning id
        """,
        (test_id,),
    )
    return row is not None


def list_student_sets(user_id: str) -> list[dict[str, Any]]:
    rows = fetch_all(
        """
        select t.*, a.result as latest_result
        from public.reading_tests_modified t
        left join lateral (
          select result from public.reading_test_attempts_modified
          where user_id = %s and test_id = t.id and status = 'submitted'
          order by submitted_at desc limit 1
        ) a on true
        where t.is_published and t.deleted_at is null
        order by t.created_at desc
        """,
        (user_id,),
    )
    result = []
    for row in rows:
        questions = sum(
            len(item.get("questions", []))
            for item in row["components"]
            if item.get("type") in {"fillGaps", "mcq", "completeSentence"}
        )
        latest = row["latest_result"]
        result.append({
            "id": practice_id(row["id"]),
            "title": row["title"],
            "skill": "R",
            "subType": "IELTS Reading",
            "difficulty": "Medium",
            "bandRange": "6.0-9.0",
            "attempted": latest is not None,
            "score": f"{latest['rawScore']['correct']}/{latest['rawScore']['total']}" if latest and latest.get("rawScore") else None,
            "questionCount": questions,
        })
    return result


def create_attempt(user_id: str, test_id: UUID) -> dict[str, Any] | None:
    row = fetch_one(
        """
        insert into public.reading_test_attempts_modified (user_id, test_id, snapshot)
        select %s, id,
          jsonb_build_object('title', title, 'components', components, 'answers', answers)
        from public.reading_tests_modified
        where id = %s and is_published and deleted_at is null
        returning *
        """,
        (user_id, test_id),
    )
    return _attempt_payload(row) if row else None


def _attempt_payload(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(row["id"]),
        "testId": practice_id(row["test_id"]),
        "status": row["status"],
        "answers": row["answers"] or {},
        "createdAt": _iso(row["started_at"]),
        "submittedAt": _iso(row["submitted_at"]),
    }


def get_attempt(user_id: str, attempt_id: UUID) -> dict[str, Any] | None:
    return fetch_one(
        "select * from public.reading_test_attempts_modified where id = %s and user_id = %s",
        (attempt_id, user_id),
    )


def _letter_label(index: int) -> str:
    value = index + 1
    label = ""
    while value > 0:
        value -= 1
        label = chr(65 + value % 26) + label
        value //= 26
    return label


def grade(components: list[dict[str, Any]], answer_key: dict[str, str], answers: dict[str, str]) -> dict[str, Any]:
    questions = [
        (item, question)
        for item in components
        if item.get("type") in {"fillGaps", "mcq", "completeSentence"}
        for question in item.get("questions", [])
    ]
    fully_gradable = bool(questions) and all(question["id"] in answer_key for _, question in questions)

    def is_correct(component: dict[str, Any], question: dict[str, Any]) -> bool:
        submitted = answers.get(question["id"], "").strip()
        expected = answer_key[question["id"]]
        if component.get("type") == "completeSentence":
            submitted_label = submitted.upper()
            selected_ending_id = next(
                (
                    ending["id"]
                    for index, ending in enumerate(component.get("endings", []))
                    if _letter_label(index) == submitted_label
                ),
                None,
            )
            return selected_ending_id == expected
        return submitted == expected.strip()

    graded = [
        {"questionId": question["id"], "number": index, "isCorrect": is_correct(component, question)}
        for index, (component, question) in enumerate(questions, start=1)
    ] if fully_gradable else []
    return {
        "scoringMode": "basic" if fully_gradable else "saved",
        "score": None,
        "rawScore": {"correct": sum(item["isCorrect"] for item in graded), "total": len(graded)} if fully_gradable else None,
        "gradedAnswers": graded,
        "answered": sum(bool(answers.get(question["id"], "").strip()) for _, question in questions),
        "questionCount": len(questions),
    }


def submit_attempt(user_id: str, attempt_id: UUID, submitted_answers: dict[str, str]) -> dict[str, Any] | None:
    attempt = get_attempt(user_id, attempt_id)
    if not attempt:
        return None
    if attempt["status"] != "active":
        raise ValueError("This attempt has already been submitted")
    snapshot = attempt["snapshot"]
    question_ids = {
        question["id"]
        for item in snapshot["components"]
        if item.get("type") in {"fillGaps", "mcq", "completeSentence"}
        for question in item.get("questions", [])
    }
    answers = {key: value for key, value in submitted_answers.items() if key in question_ids}
    result = {
        "practiceId": practice_id(attempt["test_id"]),
        "title": snapshot["title"],
        "skill": "R",
        **grade(snapshot["components"], snapshot["answers"] or {}, answers),
    }
    saved = fetch_one(
        """
        update public.reading_test_attempts_modified
        set status = 'submitted', answers = %s, result = %s, submitted_at = now()
        where id = %s and user_id = %s and status = 'active' returning *
        """,
        (jsonb(answers), jsonb(result), attempt_id, user_id),
    )
    return {"session": _attempt_payload(saved), "result": result} if saved else None


def latest_result(user_id: str, test_id: UUID) -> dict[str, Any] | None:
    row = fetch_one(
        """
        select result from public.reading_test_attempts_modified
        where user_id = %s and test_id = %s and status = 'submitted'
        order by submitted_at desc limit 1
        """,
        (user_id, test_id),
    )
    return row["result"] if row else None


def list_images() -> list[dict[str, Any]]:
    return fetch_all("select * from public.reading_test_passage_images order by created_at desc")


def save_image(object_path: str, filename: str, content_type: str) -> dict[str, Any]:
    return fetch_one(
        """
        insert into public.reading_test_passage_images (object_path, filename, content_type)
        values (%s, %s, %s) returning *
        """,
        (object_path, filename, content_type),
    )


def get_image(image_id: UUID) -> dict[str, Any] | None:
    return fetch_one("select * from public.reading_test_passage_images where id = %s", (image_id,))
