import unittest

from datetime import datetime, timezone
from uuid import uuid4

from app.reading_modified import _letter_label, _test_payload, grade, normalize_components


class ReadingModifiedTests(unittest.TestCase):
    def test_case_sensitive_scoring_and_one_gap_per_question(self):
        components, answers = normalize_components(
            [
                {"id": "passage", "type": "passage", "markdown": "# A passage"},
                {
                    "id": "gaps",
                    "type": "fillGaps",
                    "heading": "Complete the sentence.",
                    "answerEnabled": True,
                    "questions": [
                        {"id": "q1", "text": "My name is {<gap>}.", "answer": "Amina"},
                        {"id": "q2", "text": "I live in {<gap>}.", "answer": "Dhaka"},
                    ],
                },
            ],
            require_complete=True,
        )
        self.assertNotIn("answer", components[1]["questions"][0])
        result = grade(components, answers, {"q1": "amina", "q2": " Dhaka "})
        self.assertEqual(result["rawScore"], {"correct": 1, "total": 2})
        self.assertEqual([item["isCorrect"] for item in result["gradedAnswers"]], [False, True])

    def test_missing_answer_disables_automatic_grading(self):
        components, answers = normalize_components(
            [
                {
                    "id": "gaps",
                    "type": "fillGaps",
                    "heading": "",
                    "answerEnabled": False,
                    "questions": [{"id": "q1", "text": "Capital: {<gap>}", "answer": ""}],
                }
            ],
            require_complete=True,
        )
        result = grade(components, answers, {"q1": "Dhaka"})
        self.assertEqual(result["scoringMode"], "saved")
        self.assertIsNone(result["rawScore"])
        self.assertEqual(result["answered"], 1)

    def test_published_question_requires_exactly_one_gap(self):
        with self.assertRaisesRegex(ValueError, "exactly one"):
            normalize_components(
                [{"id": "gaps", "type": "fillGaps", "heading": "", "answerEnabled": False,
                  "questions": [{"id": "q1", "text": "No blank here", "answer": ""}]}],
                require_complete=True,
            )

    def test_student_payload_never_contains_answer_key(self):
        row = {
            "id": uuid4(), "title": "Example", "is_published": True,
            "created_at": datetime.now(timezone.utc), "updated_at": datetime.now(timezone.utc),
            "components": [{"id": "gaps", "type": "fillGaps", "heading": "", "answerEnabled": True,
                            "questions": [{"id": "q1", "text": "Name: {<gap>}"}]}],
            "answers": {"q1": "Secret"},
        }
        student = _test_payload(row)
        admin = _test_payload(row, admin=True)
        self.assertNotIn("Secret", str(student))
        self.assertEqual(admin["components"][0]["questions"][0]["answer"], "Secret")

    def test_mcq_answer_is_stored_separately_and_graded(self):
        components, answers = normalize_components(
            [
                {
                    "id": "mcq",
                    "type": "mcq",
                    "heading": "Choose one.",
                    "answerEnabled": True,
                    "questions": [
                        {
                            "id": "q1",
                            "text": "What is the capital of Bangladesh?",
                            "options": [
                                {"id": "o1", "text": "Chattogram"},
                                {"id": "o2", "text": "Dhaka"},
                            ],
                            "correctOptionId": "o2",
                        }
                    ],
                }
            ],
            require_complete=True,
        )
        self.assertNotIn("correctOptionId", components[0]["questions"][0])
        self.assertEqual(answers, {"q1": "o2"})
        self.assertEqual(grade(components, answers, {"q1": "o2"})["rawScore"], {"correct": 1, "total": 1})

    def test_published_mcq_requires_two_filled_options(self):
        with self.assertRaisesRegex(ValueError, "at least two options"):
            normalize_components(
                [{
                    "id": "mcq", "type": "mcq", "heading": "", "answerEnabled": False,
                    "questions": [{
                        "id": "q1", "text": "Choose.", "correctOptionId": "",
                        "options": [{"id": "o1", "text": "Only option"}],
                    }],
                }],
                require_complete=True,
            )

    def test_mcq_answer_must_reference_an_option(self):
        with self.assertRaisesRegex(ValueError, "reference one of its options"):
            normalize_components(
                [{
                    "id": "mcq", "type": "mcq", "heading": "", "answerEnabled": True,
                    "questions": [{
                        "id": "q1", "text": "Choose.", "correctOptionId": "missing",
                        "options": [
                            {"id": "o1", "text": "One"},
                            {"id": "o2", "text": "Two"},
                        ],
                    }],
                }],
                require_complete=True,
            )

    def test_student_mcq_payload_never_contains_correct_option(self):
        row = {
            "id": uuid4(), "title": "MCQ", "is_published": True,
            "created_at": datetime.now(timezone.utc), "updated_at": datetime.now(timezone.utc),
            "components": [{
                "id": "mcq", "type": "mcq", "heading": "", "answerEnabled": True,
                "questions": [{
                    "id": "q1", "text": "Choose.",
                    "options": [{"id": "o1", "text": "One"}, {"id": "o2", "text": "Two"}],
                }],
            }],
            "answers": {"q1": "o2"},
        }
        student = _test_payload(row)
        admin = _test_payload(row, admin=True)
        self.assertNotIn("correctOptionId", student["components"][0]["questions"][0])
        self.assertEqual(admin["components"][0]["questions"][0]["correctOptionId"], "o2")

    def test_complete_sentence_answer_uses_displayed_letter(self):
        components, answers = normalize_components(
            [{
                "id": "complete", "type": "completeSentence", "heading": "Match the endings.",
                "answerEnabled": True,
                "questions": [{"id": "q1", "text": "The city is", "correctEndingId": "e2"}],
                "endings": [
                    {"id": "e1", "text": "near the coast."},
                    {"id": "e2", "text": "home to two million people."},
                ],
            }],
            require_complete=True,
        )
        self.assertNotIn("correctEndingId", components[0]["questions"][0])
        self.assertEqual(answers, {"q1": "e2"})
        result = grade(components, answers, {"q1": " b "})
        self.assertEqual(result["rawScore"], {"correct": 1, "total": 1})

    def test_published_complete_sentence_requires_an_ending(self):
        with self.assertRaisesRegex(ValueError, "at least one remaining sentence"):
            normalize_components(
                [{
                    "id": "complete", "type": "completeSentence", "heading": "", "answerEnabled": False,
                    "questions": [{"id": "q1", "text": "A sentence", "correctEndingId": ""}],
                    "endings": [],
                }],
                require_complete=True,
            )

    def test_student_complete_sentence_payload_hides_answer(self):
        row = {
            "id": uuid4(), "title": "Sentence endings", "is_published": True,
            "created_at": datetime.now(timezone.utc), "updated_at": datetime.now(timezone.utc),
            "components": [{
                "id": "complete", "type": "completeSentence", "heading": "", "answerEnabled": True,
                "questions": [{"id": "q1", "text": "The city is"}],
                "endings": [{"id": "e1", "text": "near the coast."}],
            }],
            "answers": {"q1": "e1"},
        }
        student = _test_payload(row)
        admin = _test_payload(row, admin=True)
        self.assertNotIn("correctEndingId", student["components"][0]["questions"][0])
        self.assertEqual(admin["components"][0]["questions"][0]["correctEndingId"], "e1")

    def test_letter_labels_continue_after_z(self):
        self.assertEqual(_letter_label(0), "A")
        self.assertEqual(_letter_label(25), "Z")
        self.assertEqual(_letter_label(26), "AA")


if __name__ == "__main__":
    unittest.main()
