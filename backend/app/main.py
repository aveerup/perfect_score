from __future__ import annotations

from copy import deepcopy
import os
from pathlib import Path
from statistics import mean
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, Cookie, Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import httpx2
from dotenv import load_dotenv

from .data import (
    ACHIEVEMENTS,
    today_iso,
)
from .schemas import (
    LectureProgressRequest,
    LoginRequest,
    OnboardingRequest,
    PasswordResetRequest,
    PasswordUpdateRequest,
    ProfileUpdate,
    SearchResponse,
    SessionCreateRequest,
    SessionPatchRequest,
    SessionSubmitRequest,
    SignupRequest,
    TypingAttemptRequest,
    VocabularyReviewRequest,
)
from . import repository


load_dotenv(Path(__file__).resolve().parents[1] / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_PUBLISHABLE_KEY") or os.getenv("SUPABASE_ANON_KEY", "")
AUTH_COOKIE_SECURE = os.getenv("AUTH_COOKIE_SECURE", "false").lower() == "true"
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001",
    ).split(",")
    if origin.strip()
]

app = FastAPI(
    title="Perfect Score API",
    version="0.1.0",
    description="FastAPI backend for the Perfect Score IELTS learning frontend.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)
router = APIRouter(prefix="/api")

def supabase_headers(access_token: str | None = None) -> dict[str, str]:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase authentication is not configured",
        )

    headers = {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
    }
    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"
    return headers


def supabase_error_message(response: httpx2.Response) -> str:
    try:
        payload = response.json()
    except ValueError:
        return "Supabase authentication request failed"

    return (
        payload.get("msg")
        or payload.get("message")
        or payload.get("error_description")
        or payload.get("error")
        or "Supabase authentication request failed"
    )


def auth_user_to_app_user(auth_user: dict[str, Any]) -> dict[str, Any]:
    metadata = auth_user.get("user_metadata") or {}
    email = auth_user.get("email") or ""
    default_name = email.split("@", 1)[0] if email else "Learner"

    return {
        "id": auth_user["id"],
        "email": email,
        "name": metadata.get("full_name") or metadata.get("name") or default_name,
        "rowCreated": auth_user.get("created_at"),
        "lastLogin": auth_user.get("last_sign_in_at"),
    }


def set_auth_cookies(response: Response, auth_session: dict[str, Any]) -> None:
    response.set_cookie(
        key="ps_access_token",
        value=auth_session["access_token"],
        max_age=auth_session["expires_in"],
        httponly=True,
        secure=AUTH_COOKIE_SECURE,
        samesite="none",
        path="/",
    )
    response.set_cookie(
        key="ps_refresh_token",
        value=auth_session["refresh_token"],
        max_age=60 * 60 * 24 * 30,
        httponly=True,
        secure=AUTH_COOKIE_SECURE,
        samesite="none",
        path="/",
    )


def require_access_token(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    ps_access_token: str | None = Cookie(default=None),
) -> str:
    access_token = credentials.credentials if credentials else ps_access_token
    if access_token:
        return access_token

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required",
        headers={"WWW-Authenticate": "Bearer"},
    )


def require_supabase_user(
    access_token: str = Depends(require_access_token),
) -> dict[str, Any]:
    try:
        response = httpx2.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers=supabase_headers(access_token),
            timeout=10.0,
        )
    except httpx2.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service is unavailable",
        ) from exc

    if response.status_code != status.HTTP_200_OK:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = auth_user_to_app_user(response.json())
    profile = repository.ensure_user_profile(user)
    profile["lastLogin"] = user.get("lastLogin")
    return profile


def find_by_id(items: list[dict[str, Any]], item_id: str, label: str) -> dict[str, Any]:
    item = next((entry for entry in items if entry["id"] == item_id), None)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{label} not found")
    return item


def skill_name(skill: str) -> str:
    return {
        "L": "Listening",
        "R": "Reading",
        "W": "Writing",
        "S": "Speaking",
    }.get(skill, skill)


def round_to_half_band(value: float) -> float:
    return min(9.0, max(0.0, round(value * 2) / 2))


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
        return [
            {
                "id": f"{item['id']}-q{i}",
                "number": i,
                "prompt": "Complete the note with the correct word or number.",
                "type": item["subType"],
                "answer": ["gallery", "Tuesday", "student", "45", "north"][i - 1],
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


def practice_detail(item: dict[str, Any]) -> dict[str, Any]:
    detail = deepcopy(item)
    detail["activeSection"] = skill_name(item["skill"])
    detail["timeLimitSeconds"] = 1200 if item["skill"] in {"W", "S"} else 900
    detail["questionCount"] = 1 if item["skill"] in {"W", "S"} else 5
    detail["questions"] = generated_questions(item, detail["questionCount"])

    if item["skill"] == "L":
        detail["audioUrl"] = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        detail["segments"] = [{"id": "s1", "label": "Section 1", "timestamp": 0}]
    elif item["skill"] == "R":
        detail["passage"] = (
            "The Academic Reading test includes three long texts which range from the "
            "descriptive and factual to the discursive and analytical. These are taken "
            "from books, journals, magazines and newspapers and are suitable for people "
            "entering university courses or professional registration."
        )
    elif item["skill"] == "W":
        detail["prompt"] = item["title"]
    else:
        detail["question"] = item["title"]

    return detail


def mock_detail(item: dict[str, Any]) -> dict[str, Any]:
    detail = deepcopy(item)
    detail["timeLimitSeconds"] = 3600
    detail["sections"] = [
        {
            "name": "Listening",
            "skill": "L",
            "timeLimitSeconds": 1800,
            "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            "questions": generated_questions({"id": f"{item['id']}-l", "skill": "L", "subType": "Note Completion", "title": "Listening"}, 10),
        },
        {
            "name": "Reading",
            "skill": "R",
            "timeLimitSeconds": 3600,
            "passage": "The history of artificial intelligence is marked by cycles of optimism, investment, and technical constraint.",
            "questions": generated_questions({"id": f"{item['id']}-r", "skill": "R", "subType": "TRUE/FALSE/NOT GIVEN", "title": "Reading"}, 10),
        },
        {
            "name": "Writing",
            "skill": "W",
            "timeLimitSeconds": 3600,
            "questions": [
                {
                    "id": f"{item['id']}-w1",
                    "number": 1,
                    "prompt": "Summarize the information by selecting and reporting the main features.",
                    "targetWords": 150,
                }
            ],
        },
        {
            "name": "Speaking",
            "skill": "S",
            "timeLimitSeconds": 840,
            "questions": [
                {
                    "id": f"{item['id']}-s1",
                    "number": 1,
                    "prompt": "Describe a historical building you have visited and liked.",
                    "prepSeconds": 60,
                    "speakSeconds": 120,
                }
            ],
        },
    ]
    return detail


def score_objective_answers(questions: list[dict[str, Any]], answers: dict[str, Any]) -> tuple[int, int]:
    total = len([q for q in questions if "answer" in q])
    if total == 0:
        return (0, 0)
    correct = 0
    for question in questions:
        answer_key = question.get("answer")
        if answer_key is None:
            continue
        submitted = str(answers.get(question["id"], "")).strip().lower()
        if submitted == str(answer_key).strip().lower():
            correct += 1
    return correct, total


def writing_band(text: str | None) -> float:
    word_count = len((text or "").split())
    if word_count >= 250:
        return 7.5
    if word_count >= 150:
        return 6.5
    if word_count >= 80:
        return 6.0
    return 5.5


def speaking_band(transcript: str | None) -> float:
    word_count = len((transcript or "").split())
    if word_count >= 160:
        return 7.5
    if word_count >= 90:
        return 6.5
    return 6.0


def score_database_test(
    test: dict[str, Any],
    answers: dict[str, Any],
    essay_text: str | None,
    speaking_transcript: str | None,
) -> tuple[float, dict[str, float] | None, dict[str, Any], list[dict[str, Any]]]:
    graded_answers: list[dict[str, Any]] = []
    section_scores: dict[str, float] = {}

    for section in test["sections"]:
        objective_questions = [
            question for question in section["questions"] if "answer" in question
        ]
        correct = 0
        for question in objective_questions:
            submitted = answers.get(question["id"], "")
            is_correct = str(submitted).strip().lower() == str(question["answer"]).strip().lower()
            correct += int(is_correct)
            graded_answers.append(
                {
                    "questionId": question["id"],
                    "answer": submitted,
                    "isCorrect": is_correct,
                    "score": 1 if is_correct else 0,
                }
            )

        if objective_questions:
            section_scores[section["skill"]] = round_to_half_band(
                5 + (correct / len(objective_questions)) * 4
            )
        elif section["skill"] == "W":
            section_scores["W"] = writing_band(essay_text)
        elif section["skill"] == "S":
            section_scores["S"] = speaking_band(speaking_transcript)

    if test["testType"] == "mock":
        for skill in ("L", "R", "W", "S"):
            section_scores.setdefault(skill, 6.0)
        overall = round_to_half_band(mean(section_scores.values()))
        result = {
            "mockId": test["id"],
            "overallBand": overall,
            "scores": section_scores,
            "dateTaken": today_iso(),
            "scoringMode": "basic",
            "feedback": (
                "Basic scoring is enabled. Objective answers are checked exactly; "
                "writing and speaking use completion estimates until human or AI review is added."
            ),
        }
        return overall, section_scores, result, graded_answers

    skill = test["skill"]
    score = section_scores.get(skill)
    if score is None:
        score = writing_band(essay_text) if skill == "W" else speaking_band(speaking_transcript)
    questions = [question for section in test["sections"] for question in section["questions"]]
    heatmap = [
        100
        if any(
            graded["questionId"] == question["id"] and graded["isCorrect"]
            for graded in graded_answers
        )
        else 35
        for question in questions
    ]
    result = {
        "practiceId": test["id"],
        "title": test["title"],
        "skill": skill,
        "score": score,
        "scoringMode": "basic",
        "criteria": [
            {"name": "Task Achievement", "score": round_to_half_band(score + 0.5)},
            {"name": "Coherence & Cohesion", "score": score},
            {"name": "Lexical Resource", "score": round_to_half_band(score + 0.25)},
            {"name": "Grammatical Range", "score": score},
        ],
        "heatmap": heatmap,
        "feedback": [
            "This is a basic automated estimate, not an examiner or AI evaluation.",
            "Objective answers are checked exactly. Writing and speaking are estimated from completion only.",
        ],
        "errorLogAdded": any(not item["isCorrect"] for item in graded_answers),
    }
    return score, None, result, graded_answers


def build_practice_result(
    item: dict[str, Any],
    answers: dict[str, Any],
    essay_text: str | None = None,
    speaking_transcript: str | None = None,
) -> dict[str, Any]:
    detail = practice_detail(item)
    correct, total = score_objective_answers(detail["questions"], answers)

    if item["skill"] in {"R", "L"} and total:
        score = round_to_half_band(5 + (correct / total) * 4)
    elif item["skill"] == "W":
        score = writing_band(essay_text)
    else:
        score = speaking_band(speaking_transcript)

    criteria = [
        {"name": "Task Achievement", "score": round_to_half_band(score + 0.5)},
        {"name": "Coherence & Cohesion", "score": score},
        {"name": "Lexical Resource", "score": round_to_half_band(score + 0.25)},
        {"name": "Grammatical Range", "score": score},
    ]

    heatmap = [80, 75, 40, 90, 60, 30, 85, 95, 55, 70, 45, 65]
    if total:
        heatmap = [100 if str(answers.get(q["id"], "")).lower() == str(q.get("answer", "")).lower() else 35 for q in detail["questions"]]

    return {
        "practiceId": item["id"],
        "title": item["title"],
        "skill": item["skill"],
        "score": score,
        "rawScore": {"correct": correct, "total": total} if total else None,
        "criteria": criteria,
        "heatmap": heatmap,
        "feedback": [
            f"Your response displays solid control for {item['subType']}.",
            "Key improvement area: review the missed items and repeat this task after one focused lesson.",
        ],
        "errorLogAdded": True,
    }


@app.get("/")
def root() -> dict[str, str]:
    return {"name": "Perfect Score API", "docs": "/docs", "health": "/api/health"}


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/auth/login")
def login(payload: LoginRequest, response: Response) -> dict[str, Any]:
    try:
        supabase_response = httpx2.post(
            f"{SUPABASE_URL}/auth/v1/token",
            params={"grant_type": "password"},
            headers=supabase_headers(),
            json={"email": payload.email, "password": payload.password},
            timeout=10.0,
        )
    except httpx2.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service is unavailable",
        ) from exc

    if supabase_response.status_code != status.HTTP_200_OK:
        detail = supabase_error_message(supabase_response)
        if supabase_response.status_code in {
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED,
        }:
            detail = "Invalid email or password"
        raise HTTPException(status_code=supabase_response.status_code, detail=detail)

    auth_session = supabase_response.json()
    set_auth_cookies(response, auth_session)

    return {
        "user": auth_user_to_app_user(auth_session["user"]),
    }


@router.post("/auth/signup", status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, response: Response) -> dict[str, Any]:
    try:
        supabase_response = httpx2.post(
            f"{SUPABASE_URL}/auth/v1/signup",
            headers=supabase_headers(),
            json={
                "email": payload.email,
                "password": payload.password,
                "data": {"full_name": payload.fullName},
            },
            timeout=10.0,
        )
    except httpx2.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service is unavailable",
        ) from exc

    if supabase_response.status_code not in {
        status.HTTP_200_OK,
        status.HTTP_201_CREATED,
    }:
        raise HTTPException(
            status_code=supabase_response.status_code,
            detail=supabase_error_message(supabase_response),
        )

    auth_session = supabase_response.json()
    if auth_session.get("access_token"):
        set_auth_cookies(response, auth_session)

    return {
        "user": auth_user_to_app_user(auth_session["user"]),
        "requiresEmailConfirmation": not bool(auth_session.get("access_token")),
    }


@router.post("/auth/password-reset")
def request_password_reset(payload: PasswordResetRequest) -> dict[str, bool]:
    try:
        supabase_response = httpx2.post(
            f"{SUPABASE_URL}/auth/v1/recover",
            params={"redirect_to": f"{FRONTEND_URL}/reset-password"},
            headers=supabase_headers(),
            json={"email": payload.email},
            timeout=10.0,
        )
    except httpx2.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service is unavailable",
        ) from exc

    if supabase_response.status_code not in {
        status.HTTP_200_OK,
        status.HTTP_204_NO_CONTENT,
    }:
        raise HTTPException(
            status_code=supabase_response.status_code,
            detail=supabase_error_message(supabase_response),
        )
    return {"ok": True}


@router.post("/auth/password-update")
def update_password(payload: PasswordUpdateRequest) -> dict[str, bool]:
    try:
        supabase_response = httpx2.put(
            f"{SUPABASE_URL}/auth/v1/user",
            headers=supabase_headers(payload.accessToken),
            json={"password": payload.password},
            timeout=10.0,
        )
    except httpx2.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service is unavailable",
        ) from exc

    if supabase_response.status_code != status.HTTP_200_OK:
        raise HTTPException(
            status_code=supabase_response.status_code,
            detail=supabase_error_message(supabase_response),
        )
    return {"ok": True}


@router.post("/auth/refresh")
def refresh_session(
    response: Response,
    ps_refresh_token: str | None = Cookie(default=None),
) -> dict[str, Any]:
    if not ps_refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is missing",
        )

    try:
        supabase_response = httpx2.post(
            f"{SUPABASE_URL}/auth/v1/token",
            params={"grant_type": "refresh_token"},
            headers=supabase_headers(),
            json={"refresh_token": ps_refresh_token},
            timeout=10.0,
        )
    except httpx2.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service is unavailable",
        ) from exc

    if supabase_response.status_code != status.HTTP_200_OK:
        response.delete_cookie("ps_access_token", path="/")
        response.delete_cookie("ps_refresh_token", path="/")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired",
        )

    auth_session = supabase_response.json()
    set_auth_cookies(response, auth_session)
    return {"user": auth_user_to_app_user(auth_session["user"])}


@router.post("/auth/logout")
def logout(
    response: Response,
    access_token: str = Depends(require_access_token),
) -> dict[str, bool]:
    response.delete_cookie("ps_access_token", path="/")
    response.delete_cookie("ps_refresh_token", path="/")

    try:
        supabase_response = httpx2.post(
            f"{SUPABASE_URL}/auth/v1/logout",
            headers=supabase_headers(access_token),
            timeout=10.0,
        )
    except httpx2.RequestError:
        return {"ok": True}

    if supabase_response.status_code not in {
        status.HTTP_200_OK,
        status.HTTP_204_NO_CONTENT,
        status.HTTP_401_UNAUTHORIZED,
    }:
        raise HTTPException(
            status_code=supabase_response.status_code,
            detail=supabase_error_message(supabase_response),
        )

    return {"ok": True}


@router.get("/me")
def me(user: dict[str, Any] = Depends(require_supabase_user)) -> dict[str, Any]:
    return user


@router.patch("/me")
def update_me(
    payload: ProfileUpdate,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    return repository.update_profile(user["id"], payload.model_dump(exclude_none=True))


@router.post("/onboarding/diagnostic")
def finish_onboarding(
    payload: OnboardingRequest,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    score = 6.0
    if payload.diagnosticAnswers:
        score += min(1.0, len(payload.diagnosticAnswers) * 0.25)
    score = round_to_half_band(score)
    record = {
        "id": f"diag-{uuid4().hex[:8]}",
        "targetBand": payload.targetBand,
        "examDate": payload.examDate,
        "estimatedBand": score,
        "recommendedPlan": "1-Month Balanced Plan",
        "createdAt": today_iso(),
    }
    repository.update_profile(
        user["id"],
        {"targetBand": payload.targetBand, "targetScore": payload.targetBand, "examDate": payload.examDate},
    )
    return {"diagnostic": record, "studyPlan": repository.get_study_plan(user["id"])}


@router.get("/dashboard")
def dashboard(user: dict[str, Any] = Depends(require_supabase_user)) -> dict[str, Any]:
    return repository.dashboard(user["id"])


@router.get("/profile")
def profile(user: dict[str, Any] = Depends(require_supabase_user)) -> dict[str, Any]:
    return {
        "user": repository.get_profile(user["id"]),
        "achievements": ACHIEVEMENTS,
        "accountManagement": [
            {"label": "Personal Information", "desc": "Names, contact details, and locations"},
            {"label": "Security & Privacy", "desc": "Password, 2FA, and linked accounts"},
            {"label": "Notifications", "desc": "Study reminders and system alerts"},
        ],
    }


@router.get("/lectures")
def lectures(
    skill: str | None = Query(default=None),
    user: dict[str, Any] = Depends(require_supabase_user),
) -> list[dict[str, Any]]:
    return repository.list_lectures(user["id"], skill)


@router.get("/lectures/{lecture_id}")
def lecture_detail(
    lecture_id: str,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    lecture = repository.get_lecture(user["id"], lecture_id)
    if not lecture:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lecture not found")
    return lecture


@router.post("/lectures/{lecture_id}/progress")
def update_lecture_progress(
    lecture_id: str,
    payload: LectureProgressRequest,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    return repository.save_lecture_progress(
        user["id"],
        lecture_id,
        payload.progress,
        payload.lastPositionSeconds,
        payload.watched if payload.watched is not None else payload.progress >= 95,
    )


@router.get("/practice")
def practice(
    skill: str | None = Query(default=None),
    difficulty: str | None = Query(default=None),
    user: dict[str, Any] = Depends(require_supabase_user),
) -> list[dict[str, Any]]:
    items = repository.list_tests(user["id"], "practice")
    if skill and skill != "All":
        items = [item for item in items if item["skill"] == skill]
    if difficulty and difficulty != "All":
        items = [item for item in items if item["difficulty"] == difficulty]
    return items


@router.get("/practice/{practice_id}")
def get_practice(
    practice_id: str,
    _: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    test = repository.get_test(practice_id)
    if not test or test["testType"] != "practice":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Practice set not found")
    section = test["sections"][0]
    return {
        **test,
        **{key: value for key, value in section.items() if key not in {"id", "position"}},
        "activeSection": section["name"],
        "questionCount": len(section["questions"]),
    }


@router.post("/practice/{practice_id}/sessions")
def create_practice_session(
    practice_id: str,
    payload: SessionCreateRequest,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    detail = get_practice(practice_id, user)
    session = repository.create_attempt(user["id"], practice_id)
    session["mode"] = payload.mode
    session["practiceId"] = practice_id
    return {"session": session, "practice": detail}


@router.patch("/practice/sessions/{session_id}")
def update_practice_session(
    session_id: str,
    payload: SessionPatchRequest,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    session = repository.update_attempt(
        user["id"], session_id, payload.model_dump(exclude_none=True)
    )
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return session


@router.post("/practice/sessions/{session_id}/submit")
def submit_practice_session(
    session_id: str,
    payload: SessionSubmitRequest,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    attempt = repository.get_attempt(user["id"], session_id)
    if not attempt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    test = repository.get_test(attempt["test_id"], include_answers=True)
    if not test:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Practice set not found")
    answers = {**(attempt["answers"] or {}), **payload.answers}
    score, section_scores, result, graded = score_database_test(
        test, answers, payload.essayText, payload.speakingTranscript
    )
    result["sessionId"] = session_id
    result["durationSeconds"] = payload.durationSeconds
    session = repository.submit_attempt(
        user["id"],
        session_id,
        payload.answers,
        payload.essayText,
        payload.speakingTranscript,
        payload.durationSeconds,
        score,
        section_scores,
        result,
        graded,
    )
    return {"session": session, "result": result}


@router.get("/practice/{practice_id}/results")
def get_practice_result(
    practice_id: str,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    result = repository.latest_result(user["id"], practice_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")
    return result


@router.get("/mock")
def mock_tests(
    user: dict[str, Any] = Depends(require_supabase_user),
) -> list[dict[str, Any]]:
    return repository.list_tests(user["id"], "mock")


@router.get("/mock/{mock_id}")
def get_mock(
    mock_id: str,
    _: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    test = repository.get_test(mock_id)
    if not test or test["testType"] != "mock":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mock test not found")
    return test


@router.post("/mock/{mock_id}/sessions")
def create_mock_session(
    mock_id: str,
    payload: SessionCreateRequest,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    detail = get_mock(mock_id, user)
    session = repository.create_attempt(user["id"], mock_id)
    session["mode"] = payload.mode
    session["mockId"] = mock_id
    return {"session": session, "mock": detail}


@router.patch("/mock/sessions/{session_id}")
def update_mock_session(
    session_id: str,
    payload: SessionPatchRequest,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    return update_practice_session(session_id, payload, user)


@router.post("/mock/sessions/{session_id}/submit")
def submit_mock_session(
    session_id: str,
    payload: SessionSubmitRequest,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    attempt = repository.get_attempt(user["id"], session_id)
    if not attempt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    test = repository.get_test(attempt["test_id"], include_answers=True)
    if not test:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mock test not found")
    answers = {**(attempt["answers"] or {}), **payload.answers}
    overall, scores, result, graded = score_database_test(
        test, answers, payload.essayText, payload.speakingTranscript
    )
    result["sessionId"] = session_id
    session = repository.submit_attempt(
        user["id"],
        session_id,
        payload.answers,
        payload.essayText,
        payload.speakingTranscript,
        payload.durationSeconds,
        overall,
        scores,
        result,
        graded,
    )
    return {"session": session, "result": result}


@router.get("/mock/{mock_id}/results")
def mock_result(
    mock_id: str,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    result = repository.latest_result(user["id"], mock_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")
    return result


@router.get("/vocabulary")
def vocabulary(
    category: str | None = Query(default=None),
    user: dict[str, Any] = Depends(require_supabase_user),
) -> list[dict[str, Any]]:
    return repository.list_vocabulary(user["id"], category)


@router.get("/vocabulary/categories")
def vocabulary_categories(
    user: dict[str, Any] = Depends(require_supabase_user),
) -> list[dict[str, Any]]:
    return repository.vocabulary_categories(user["id"])


@router.get("/vocabulary/{word_id}")
def vocabulary_word(
    word_id: str,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    word = next(
        (item for item in repository.list_vocabulary(user["id"]) if item["id"] == word_id),
        None,
    )
    if not word:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vocabulary word not found")
    return word


@router.post("/vocabulary/reviews")
def review_vocabulary(
    payload: VocabularyReviewRequest,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    return repository.save_vocabulary_review(
        user["id"], payload.wordId, payload.result
    )


@router.get("/study-plan")
def study_plan(user: dict[str, Any] = Depends(require_supabase_user)) -> dict[str, Any]:
    return repository.get_study_plan(user["id"])


@router.patch("/study-plan/tasks/{task_id}")
def update_study_task(
    task_id: str,
    completed: bool = Query(),
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    task = repository.update_study_task(user["id"], task_id, completed)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.get("/typing/essays")
def typing_essays(
    user: dict[str, Any] = Depends(require_supabase_user),
) -> list[dict[str, Any]]:
    return repository.list_typing_passages(user["id"])


@router.post("/typing/attempts")
def save_typing_attempt(
    payload: TypingAttemptRequest,
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    return repository.save_typing_attempt(
        user["id"],
        payload.essayId,
        payload.wpm,
        payload.accuracy,
        payload.durationSeconds,
    )


@router.get("/search", response_model=SearchResponse)
def search(
    q: str = Query(min_length=1),
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    return repository.search_content(user["id"], q)


@router.get("/content/bootstrap")
def bootstrap(
    user: dict[str, Any] = Depends(require_supabase_user),
) -> dict[str, Any]:
    return {
        "user": repository.get_profile(user["id"]),
        "dashboard": repository.dashboard(user["id"]),
        "videos": repository.list_lectures(user["id"]),
        "practiceQuestions": repository.list_tests(user["id"], "practice"),
        "vocabularyWords": repository.list_vocabulary(user["id"]),
        "mockTests": repository.list_tests(user["id"], "mock"),
        "studyPlan": repository.get_study_plan(user["id"]),
        "ieltsEssays": repository.list_typing_passages(user["id"]),
    }


@router.get("/subscription")
def subscription(_: dict[str, Any] = Depends(require_supabase_user)) -> dict[str, Any]:
    return {"plan": "Free", "status": "active", "renewsOn": None}


app.include_router(router)
