from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


Skill = Literal["L", "R", "W", "S"]


class LoginRequest(BaseModel):
    email: str
    password: str


class SignupRequest(BaseModel):
    email: str
    password: str = Field(min_length=8)
    fullName: str = Field(min_length=2, max_length=100)


class PasswordResetRequest(BaseModel):
    email: str


class PasswordUpdateRequest(BaseModel):
    accessToken: str = Field(min_length=20)
    password: str = Field(min_length=8)


class ProfileUpdate(BaseModel):
    name: str | None = None
    location: str | None = None
    timezone: str | None = None
    targetBand: float | None = Field(default=None, ge=5.0, le=9.0)
    targetScore: float | None = Field(default=None, ge=5.0, le=9.0)
    examDate: str | None = None


class OnboardingRequest(BaseModel):
    targetBand: float = Field(ge=5.0, le=9.0)
    examDate: str
    diagnosticAnswers: dict[str, Any] = Field(default_factory=dict)


class LectureProgressRequest(BaseModel):
    progress: int = Field(ge=0, le=100)
    lastPositionSeconds: int = Field(default=0, ge=0)
    watched: bool | None = None


class SessionCreateRequest(BaseModel):
    mode: Literal["practice", "mock"] = "practice"
    testId: str | None = None


class SessionPatchRequest(BaseModel):
    currentQuestion: int | None = Field(default=None, ge=1)
    timeLeft: int | None = Field(default=None, ge=0)
    answers: dict[str, Any] | None = None
    activeSection: str | None = None


class SessionSubmitRequest(BaseModel):
    answers: dict[str, Any] = Field(default_factory=dict)
    durationSeconds: int | None = Field(default=None, ge=0)
    essayText: str | None = None
    speakingTranscript: str | None = None


class VocabularyReviewRequest(BaseModel):
    wordId: str
    result: Literal["again", "hard", "good", "easy", "known"]


class TypingAttemptRequest(BaseModel):
    essayId: str
    wpm: float = Field(ge=0)
    accuracy: float = Field(ge=0, le=100)
    durationSeconds: int = Field(ge=0)


class SearchResponse(BaseModel):
    practice: list[dict[str, Any]]
    lectures: list[dict[str, Any]]
    vocabulary: list[dict[str, Any]]
