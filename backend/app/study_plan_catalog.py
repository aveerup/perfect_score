from __future__ import annotations

from typing import Any


def md_list(text: str) -> str:
    return "\n".join(f"- {item.strip()}" for item in text.split(";") if item.strip())


STUDY_PLAN_CATALOG: list[dict[str, Any]] = [
    {
        "title": "1-Week Crash Plan",
        "details": {
            "day-1": {
                "title": "Orientation + Listening",
                "video_lectures": md_list(
                    "Diagnostic Test; IELTS Test Fundamentals; Download Required Materials; "
                    "Listening Structure & Scoring; Listening Question Types"
                ),
                "practise_questions": md_list("Diagnostic Test; Listening Question Type Exercises"),
                "vocab_practise": md_list("Groups 1-3"),
            },
            "day-2": {
                "title": "Listening + Reading Basics",
                "video_lectures": md_list(
                    "Listening: Gap Fill, MCQ, Diagram, Matching, Short Answer, Parts 1-4 Strategy; "
                    "Reading Structure & Scoring; Reading Question Types & Categories"
                ),
                "practise_questions": md_list("One Complete Listening Test; Reading Question Type Practice"),
                "vocab_practise": md_list("Groups 4-6"),
            },
            "day-3": {
                "title": "Reading Mastery",
                "video_lectures": md_list(
                    "Correct Approach; Accelerator; Vocabulary Builder; Keywords; Gap Filling; "
                    "Reading Practice - All Question Types"
                ),
                "practise_questions": md_list("One Complete Reading Test"),
                "vocab_practise": md_list("Groups 7-10"),
            },
            "day-4": {
                "title": "Writing Task 1",
                "video_lectures": md_list(
                    "Task 1 Question Types; Essay Structure; Writing Approach; Band Descriptors; "
                    "Numerical Overview; Image Overview"
                ),
                "practise_questions": md_list("2 Task 1 Reports"),
                "vocab_practise": md_list("Groups 11-14"),
            },
            "day-5": {
                "title": "Writing Task 2",
                "video_lectures": md_list(
                    "Task 2 Question Types; Essay Structure; Number of Paragraphs; Band Descriptors; "
                    "Introduction; Opinion; Discussion; Cause; Main Idea Generation"
                ),
                "practise_questions": md_list("2 Task 2 Essays"),
                "vocab_practise": md_list("Groups 15-18"),
            },
            "day-6": {
                "title": "Speaking",
                "video_lectures": md_list(
                    "Speaking Structure & Scoring; Band Descriptors; Part 1; Part 2; Part 3; "
                    "Hooks & Answer Structure"
                ),
                "practise_questions": md_list("Complete Speaking Mock; Review Weak Areas"),
                "vocab_practise": md_list("Groups 19-21"),
            },
            "day-7": {
                "title": "Final Assessment",
                "video_lectures": "No new lectures",
                "practise_questions": md_list(
                    "Full-Length IELTS Mock Test; Performance Analysis; Weakness Identification; "
                    "Last-Minute Review"
                ),
                "vocab_practise": md_list("Groups 22-25 + Final Revision"),
            },
        },
    },
    {
        "title": "2-Week IELTS Study Plan",
        "details": {
            "day-1": {
                "title": "Day 1",
                "video_lectures": md_list(
                    "Diagnostic Test; IELTS Test Fundamentals; Download Required Materials; "
                    "Listening Structure & Scoring; Listening Question Types"
                ),
                "practise_questions": md_list("Diagnostic Test; Listening Question Type Practice"),
                "vocab_practise": md_list("Groups 1-2"),
            },
            "day-2": {
                "title": "Day 2",
                "video_lectures": md_list("Listening Gap Fill; MCQ; Diagram; Matching; Short Answer"),
                "practise_questions": md_list("Mixed Listening Practice"),
                "vocab_practise": md_list("Groups 3-4"),
            },
            "day-3": {
                "title": "Day 3",
                "video_lectures": md_list(
                    "Listening Parts 1-4 Strategy; Reading Structure & Scoring; "
                    "Reading Question Types & Categories"
                ),
                "practise_questions": md_list("One Complete Listening Test; Basic Reading Practice"),
                "vocab_practise": md_list("Groups 5-6"),
            },
            "day-4": {
                "title": "Day 4",
                "video_lectures": md_list("Correct Approach; Accelerator; Vocabulary Builder; Keywords; Gap Filling"),
                "practise_questions": md_list("Reading Strategy Practice"),
                "vocab_practise": md_list("Groups 7-8"),
            },
            "day-5": {
                "title": "Day 5",
                "video_lectures": md_list("Reading Practice Types 1-8"),
                "practise_questions": md_list("Timed Reading Practice"),
                "vocab_practise": md_list("Groups 9-10"),
            },
            "day-6": {
                "title": "Day 6",
                "video_lectures": md_list("Reading Practice Types 9-16"),
                "practise_questions": md_list("One Complete Reading Test; Review Listening + Reading Mistakes"),
                "vocab_practise": md_list("Groups 11-12"),
            },
            "day-7": {
                "title": "Day 7",
                "video_lectures": "No new lectures",
                "practise_questions": md_list("Full-Length Mock Test #1; Error Analysis"),
                "vocab_practise": md_list("Review Groups 1-12"),
            },
            "day-8": {
                "title": "Day 8",
                "video_lectures": md_list(
                    "Task 1 Question Types; Essay Structure; Writing Approach; Band Descriptors"
                ),
                "practise_questions": md_list("Write 1 Task 1 Report"),
                "vocab_practise": md_list("Groups 13-14"),
            },
            "day-9": {
                "title": "Day 9",
                "video_lectures": md_list("Task 1 Practice Types 1-4; Numerical Overview"),
                "practise_questions": md_list("Write 1-2 Task 1 Reports"),
                "vocab_practise": md_list("Groups 15-16"),
            },
            "day-10": {
                "title": "Day 10",
                "video_lectures": md_list(
                    "Task 1 Practice Types 5-8; Image Overview; Task 2 Question Types; Task 2 Essay Structure"
                ),
                "practise_questions": md_list("One Task 1 Report; Task 2 Essay Planning"),
                "vocab_practise": md_list("Groups 17-18"),
            },
            "day-11": {
                "title": "Day 11",
                "video_lectures": md_list(
                    "Number of Paragraphs; Band Descriptors; Introduction; Opinion Essays; Discussion Essays"
                ),
                "practise_questions": md_list("Write 1 Task 2 Essay"),
                "vocab_practise": md_list("Groups 19-20"),
            },
            "day-12": {
                "title": "Day 12",
                "video_lectures": md_list(
                    "Cause Essays; Main Idea Generation; Speaking Structure & Scoring; Speaking Band Descriptors"
                ),
                "practise_questions": md_list("Write 1 Task 2 Essay; Speaking Part 1 Practice"),
                "vocab_practise": md_list("Groups 21-22"),
            },
            "day-13": {
                "title": "Day 13",
                "video_lectures": md_list("Speaking Part 1; Speaking Part 2; Speaking Part 3; Hooks & Answer Structure"),
                "practise_questions": md_list("Complete Speaking Mock Test; Review Weak Areas"),
                "vocab_practise": md_list("Groups 23-25"),
            },
            "day-14": {
                "title": "Day 14",
                "video_lectures": "No new lectures",
                "practise_questions": md_list("Full-Length Mock Test #2; Final Performance Analysis"),
                "vocab_practise": md_list("Final Revision Groups 1-25"),
            },
        },
    },
    {
        "title": "1-Month IELTS Study Plan",
        "details": {
            "day-1": {
                "title": "Day 1",
                "video_lectures": md_list("Diagnostic Test; IELTS Test Fundamentals; Download Required Materials"),
                "practise_questions": md_list("Complete Diagnostic Test"),
                "vocab_practise": md_list("Group 1"),
            },
            "day-2": {
                "title": "Day 2",
                "video_lectures": md_list("Listening Structure & Scoring; Listening Question Types"),
                "practise_questions": md_list("Listening Question Type Exercises"),
                "vocab_practise": md_list("Group 2"),
            },
            "day-3": {
                "title": "Day 3",
                "video_lectures": md_list("Listening Gap Fill; Listening MCQ"),
                "practise_questions": md_list("Gap Fill + MCQ Practice"),
                "vocab_practise": md_list("Group 3"),
            },
            "day-4": {
                "title": "Day 4",
                "video_lectures": md_list("Listening Diagram; Listening Matching; Short Answer"),
                "practise_questions": md_list("Mixed Listening Practice"),
                "vocab_practise": md_list("Group 4"),
            },
            "day-5": {
                "title": "Day 5",
                "video_lectures": md_list("Listening Parts 1-4 Strategy"),
                "practise_questions": md_list("One Complete Listening Test"),
                "vocab_practise": md_list("Group 5"),
            },
            "day-6": {
                "title": "Day 6",
                "video_lectures": md_list("Reading Structure & Scoring; Reading Question Types"),
                "practise_questions": md_list("Reading Question Type Practice"),
                "vocab_practise": md_list("Group 6"),
            },
            "day-7": {
                "title": "Day 7",
                "video_lectures": "No new lectures",
                "practise_questions": md_list("Full-Length Mock Test #1; Performance Review"),
                "vocab_practise": "No new vocabulary",
            },
            "day-8": {
                "title": "Day 8",
                "video_lectures": md_list("Reading Categories; Correct Approach"),
                "practise_questions": md_list("Reading Exercises"),
                "vocab_practise": md_list("Group 7"),
            },
            "day-9": {
                "title": "Day 9",
                "video_lectures": md_list("Reading Accelerator; Vocabulary Builder"),
                "practise_questions": md_list("Reading Drill"),
                "vocab_practise": md_list("Group 8"),
            },
            "day-10": {
                "title": "Day 10",
                "video_lectures": md_list("Keywords; Gap Filling"),
                "practise_questions": md_list("Keyword Practice"),
                "vocab_practise": md_list("Group 9"),
            },
            "day-11": {
                "title": "Day 11",
                "video_lectures": md_list("Reading Practice Types 1-3"),
                "practise_questions": md_list("Timed Practice"),
                "vocab_practise": md_list("Group 10"),
            },
            "day-12": {
                "title": "Day 12",
                "video_lectures": md_list("Reading Practice Types 4-6"),
                "practise_questions": md_list("Timed Practice"),
                "vocab_practise": md_list("Group 11"),
            },
            "day-13": {
                "title": "Day 13",
                "video_lectures": md_list("Reading Practice Types 7-10"),
                "practise_questions": md_list("Mixed Reading Practice"),
                "vocab_practise": md_list("Group 12"),
            },
            "day-14": {
                "title": "Day 14",
                "video_lectures": "No new lectures",
                "practise_questions": md_list("Full-Length Mock Test #2; Review"),
                "vocab_practise": "No new vocabulary",
            },
            "day-15": {
                "title": "Day 15",
                "video_lectures": md_list("Task 1 Question Types; Essay Structure"),
                "practise_questions": md_list("Identify Question Types"),
                "vocab_practise": md_list("Group 13"),
            },
            "day-16": {
                "title": "Day 16",
                "video_lectures": md_list("Writing Approach; Band Descriptors"),
                "practise_questions": md_list("Write One Task 1"),
                "vocab_practise": md_list("Group 14"),
            },
            "day-17": {
                "title": "Day 17",
                "video_lectures": md_list("Task 1 Practice Types 1-2"),
                "practise_questions": md_list("Practice"),
                "vocab_practise": md_list("Group 15"),
            },
            "day-18": {
                "title": "Day 18",
                "video_lectures": md_list("Task 1 Practice Types 3-5"),
                "practise_questions": md_list("Practice"),
                "vocab_practise": md_list("Group 16"),
            },
            "day-19": {
                "title": "Day 19",
                "video_lectures": md_list("Task 1 Practice Types 6-8"),
                "practise_questions": md_list("Practice"),
                "vocab_practise": md_list("Group 17"),
            },
            "day-20": {
                "title": "Day 20",
                "video_lectures": md_list("Numerical Overview; Image Overview"),
                "practise_questions": md_list("Overview Practice"),
                "vocab_practise": md_list("Group 18"),
            },
            "day-21": {
                "title": "Day 21",
                "video_lectures": "No new lectures",
                "practise_questions": md_list("Full-Length Mock Test #3; Review"),
                "vocab_practise": "No new vocabulary",
            },
            "day-22": {
                "title": "Day 22",
                "video_lectures": md_list("Task 2 Question Types; Essay Structure"),
                "practise_questions": md_list("Essay Planning"),
                "vocab_practise": md_list("Group 19"),
            },
            "day-23": {
                "title": "Day 23",
                "video_lectures": md_list("Number of Paragraphs; Band Descriptors"),
                "practise_questions": md_list("Introduction Practice"),
                "vocab_practise": md_list("Group 20"),
            },
            "day-24": {
                "title": "Day 24",
                "video_lectures": md_list("Opinion Essays; Discussion Essays"),
                "practise_questions": md_list("Write One Essay"),
                "vocab_practise": md_list("Group 21"),
            },
            "day-25": {
                "title": "Day 25",
                "video_lectures": md_list("Cause Essays; Main Idea Generation"),
                "practise_questions": md_list("Brainstorming Practice"),
                "vocab_practise": md_list("Group 22"),
            },
            "day-26": {
                "title": "Day 26",
                "video_lectures": md_list("Speaking Structure & Scoring; Band Descriptors"),
                "practise_questions": md_list("Speaking Part 1"),
                "vocab_practise": md_list("Group 23"),
            },
            "day-27": {
                "title": "Day 27",
                "video_lectures": md_list("Speaking Part 2; Speaking Part 3; Hooks & Answer Structure"),
                "practise_questions": md_list("Complete Speaking Test"),
                "vocab_practise": md_list("Groups 24-25"),
            },
            "day-28": {
                "title": "Day 28",
                "video_lectures": "No new lectures",
                "practise_questions": md_list(
                    "Full-Length Mock Test #4; Complete IELTS Test; Final Performance Analysis"
                ),
                "vocab_practise": "No new vocabulary",
            },
        },
    },
    {
        "title": "2-Month IELTS Study Plan",
        "details": {
            "week-1": {
                "title": "Week 1",
                "video_lectures": md_list(
                    "IELTS fundamentals; diagnostic test; materials; listening structure; listening question types"
                ),
                "practise_questions": md_list("Diagnostic test; basic listening exercises"),
                "vocab_practise": md_list("Groups 1-3"),
                "mock": md_list("Day 7 full-length mock"),
            },
            "week-2": {
                "title": "Week 2",
                "video_lectures": md_list("Gap fill; MCQ; diagram; matching; short answer; Parts 1-4 strategy"),
                "practise_questions": md_list("Listening question-type drills; complete listening tests"),
                "vocab_practise": md_list("Groups 4-6"),
                "mock": md_list("Day 14 full-length mock"),
            },
            "week-3": {
                "title": "Week 3",
                "video_lectures": md_list("Reading structure; scoring; question types; categories; correct approach"),
                "practise_questions": md_list("Reading question-type practice"),
                "vocab_practise": md_list("Groups 7-9"),
                "mock": md_list("Day 21 full-length mock"),
            },
            "week-4": {
                "title": "Week 4",
                "video_lectures": md_list(
                    "Accelerator; vocabulary builder; keywords; gap filling; reading practice types"
                ),
                "practise_questions": md_list("Timed reading passages; complete reading tests"),
                "vocab_practise": md_list("Groups 10-12"),
                "mock": md_list("Day 28 full-length mock"),
            },
            "week-5": {
                "title": "Week 5",
                "video_lectures": md_list(
                    "Task 1 question types; essay structure; writing approach; band descriptors"
                ),
                "practise_questions": md_list("Task 1 identification; overview writing; 2 reports"),
                "vocab_practise": md_list("Groups 13-15"),
                "mock": md_list("Day 35 full-length mock"),
            },
            "week-6": {
                "title": "Week 6",
                "video_lectures": md_list(
                    "Task 1 practice types 1-8; numerical overview; image overview; Task 2 question types"
                ),
                "practise_questions": md_list("Task 1 reports; Task 2 essay planning"),
                "vocab_practise": md_list("Groups 16-18"),
                "mock": md_list("Day 42 full-length mock"),
            },
            "week-7": {
                "title": "Week 7",
                "video_lectures": md_list(
                    "Task 2 essay structure; paragraphs; band descriptors; introduction; opinion; "
                    "discussion; cause; main idea generation"
                ),
                "practise_questions": md_list("Essay plans; introductions; full Task 2 essays"),
                "vocab_practise": md_list("Groups 19-21"),
                "mock": md_list("Day 49 full-length mock"),
            },
            "week-8": {
                "title": "Week 8",
                "video_lectures": md_list(
                    "Speaking structure; scoring; band descriptors; Part 1; Part 2; Part 3; "
                    "hooks; answer structure"
                ),
                "practise_questions": md_list("Speaking drills; complete speaking mock; weak-area revision"),
                "vocab_practise": md_list("Groups 22-25 + revision"),
                "mock": md_list("Day 56 final full-length mock"),
            },
        },
    },
    {
        "title": "6-Month IELTS Study Plan",
        "details": {
            "month-1": {
                "title": "Foundations + Listening Basics",
                "video_lectures": md_list(
                    "IELTS fundamentals; diagnostic test; download materials; listening structure & scoring; "
                    "listening question types"
                ),
                "practise_questions": md_list(
                    "Diagnostic test; basic listening drills; 1 full listening test per week"
                ),
                "vocab_practise": md_list("Groups 1-4"),
                "mock": md_list("End-of-month full-length mock"),
            },
            "month-2": {
                "title": "Listening Mastery",
                "video_lectures": md_list("Gap Fill; MCQ; Diagram; Matching; Short Answer; Parts 1-4 Strategy"),
                "practise_questions": md_list(
                    "Question-type listening drills; section-wise listening practice; "
                    "2 complete listening tests per week"
                ),
                "vocab_practise": md_list("Groups 5-8"),
                "mock": md_list("End-of-month full-length mock"),
            },
            "month-3": {
                "title": "Reading",
                "video_lectures": md_list(
                    "Reading structure & scoring; question types & categories; correct approach; accelerator; "
                    "vocabulary builder; keywords; gap filling; reading practice types"
                ),
                "practise_questions": md_list(
                    "Passage-wise practice; timed reading drills; 1 complete reading test per week"
                ),
                "vocab_practise": md_list("Groups 9-13"),
                "mock": md_list("End-of-month full-length mock"),
            },
            "month-4": {
                "title": "Writing Task 1",
                "video_lectures": md_list(
                    "Task 1 question types; essay/report structure; writing approach; band descriptors; "
                    "practice types 1-8; numerical overview; image overview"
                ),
                "practise_questions": md_list("Overview writing; body paragraph writing; 2 Task 1 reports per week"),
                "vocab_practise": md_list("Groups 14-17"),
                "mock": md_list("End-of-month full-length mock"),
            },
            "month-5": {
                "title": "Writing Task 2",
                "video_lectures": md_list(
                    "Task 2 question types; essay structure; number of paragraphs; band descriptors; "
                    "introduction; opinion; discussion; cause; main idea generation"
                ),
                "practise_questions": md_list(
                    "Essay planning; introduction practice; body paragraph practice; 1-2 full essays per week"
                ),
                "vocab_practise": md_list("Groups 18-21"),
                "mock": md_list("End-of-month full-length mock"),
            },
            "month-6": {
                "title": "Speaking + Final Revision",
                "video_lectures": md_list(
                    "Speaking structure & scoring; speaking band descriptors; Part 1; Part 2; Part 3; "
                    "hooks; answer structure"
                ),
                "practise_questions": md_list(
                    "Part 1 daily practice; cue cards; Part 3 discussion; weekly speaking mock; "
                    "weak-area revision"
                ),
                "vocab_practise": md_list("Groups 22-25 + full revision"),
                "mock": md_list("2 full-length mocks in final month"),
            },
        },
    },
]
