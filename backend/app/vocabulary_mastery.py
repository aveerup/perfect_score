from __future__ import annotations

from typing import Any


def mastery_from_attempts(attempts: list[dict[str, Any]]) -> dict[str, dict[str, int]]:
    """Score words from the recent submitted attempts supplied by the caller."""
    counts: dict[str, dict[str, Any]] = {}

    for attempt in attempts:
        questions = attempt.get("selected_questions") or []
        result = attempt.get("result") or {}
        if not isinstance(questions, list) or not isinstance(result, dict):
            continue

        word_by_question = {
            question["id"]: question["wordId"]
            for question in questions
            if isinstance(question, dict) and question.get("id") and question.get("wordId")
        }
        for answer in result.get("gradedAnswers") or []:
            if not isinstance(answer, dict) or not isinstance(answer.get("isCorrect"), bool):
                continue
            word_id = word_by_question.get(answer.get("questionId"))
            if not word_id:
                continue
            word_counts = counts.setdefault(word_id, {"correct": 0, "total": 0, "tests": set()})
            word_counts["total"] += 1
            word_counts["correct"] += int(answer["isCorrect"])
            word_counts["tests"].add(attempt["id"])

    mastery: dict[str, dict[str, int]] = {}
    for word_id, word_counts in counts.items():
        correct = word_counts["correct"]
        total = word_counts["total"]
        tests = len(word_counts["tests"])
        accuracy = correct / total
        if accuracy < 0.25:
            level = 0
        elif accuracy < 0.50:
            level = 1
        elif accuracy < 0.75:
            level = 2
        elif accuracy < 1:
            level = 3
        else:
            level = 4 if total >= 5 and tests >= 2 else 3
        mastery[word_id] = {"level": level, "correct": correct, "total": total, "tests": tests}

    return mastery
