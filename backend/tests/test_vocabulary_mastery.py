import unittest

from app.vocabulary_mastery import mastery_from_attempts


def attempt(attempt_id, answers_by_word):
    questions = []
    graded = []
    for word_id, outcomes in answers_by_word.items():
        for index, correct in enumerate(outcomes):
            question_id = f"{attempt_id}-{word_id}-{index}"
            questions.append({"id": question_id, "wordId": word_id})
            graded.append({"questionId": question_id, "isCorrect": correct})
    return {
        "id": attempt_id,
        "selected_questions": questions,
        "result": {"gradedAnswers": graded},
    }


class VocabularyMasteryTests(unittest.TestCase):
    def test_accuracy_boundaries_and_unassessed_words(self):
        scores = mastery_from_attempts([
            attempt("first", {
                "zero": [False, False, False, False],
                "one": [True, False, False, False],
                "two": [True, True, False, False],
                "three": [True, True, True, False],
            }),
        ])

        self.assertEqual({word: score["level"] for word, score in scores.items()}, {
            "zero": 0, "one": 1, "two": 2, "three": 3,
        })
        self.assertNotIn("unseen", scores)
        self.assertEqual(scores["two"], {"level": 2, "correct": 2, "total": 4, "tests": 1})

    def test_perfect_score_needs_five_questions_across_two_tests(self):
        scores = mastery_from_attempts([attempt("first", {"word": [True] * 5})])
        self.assertEqual(scores["word"]["level"], 3)

        scores = mastery_from_attempts([
            attempt("first", {"word": [True, True]}),
            attempt("second", {"word": [True, True]}),
        ])
        self.assertEqual(scores["word"]["level"], 3)

        scores = mastery_from_attempts([
            attempt("first", {"word": [True, True, True]}),
            attempt("second", {"word": [True, True]}),
        ])
        self.assertEqual(scores["word"], {"level": 4, "correct": 5, "total": 5, "tests": 2})

    def test_missing_grade_does_not_count_as_incorrect(self):
        row = attempt("first", {"word": [True]})
        row["selected_questions"].append({"id": "missing", "wordId": "word"})
        self.assertEqual(mastery_from_attempts([row])["word"]["total"], 1)


if __name__ == "__main__":
    unittest.main()
