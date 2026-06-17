"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { TestAttempt, TestDetail, TestQuestion } from "@/lib/types";
import { ListeningPlayer } from "./ListeningPlayer";
import { ReadingPlayer } from "./ReadingPlayer";
import { SpeakingPlayer } from "./SpeakingPlayer";
import { TestLayout } from "./TestLayout";
import { WritingPlayer } from "./WritingPlayer";

type TestKind = "practice" | "mock";

interface TestRunnerProps {
  kind: TestKind;
  testId: string;
}

interface SessionResponse {
  session: TestAttempt;
  practice?: TestDetail;
  mock?: TestDetail;
}

export function TestRunner({ kind, testId }: TestRunnerProps) {
  const router = useRouter();
  const startedAt = useRef(0);
  const [test, setTest] = useState<TestDetail | null>(null);
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [essayText, setEssayText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const start = async () => {
      try {
        startedAt.current = Date.now();
        const response = await api.post<SessionResponse>(
          `/${kind}/${testId}/sessions`,
          { mode: kind, testId },
        );
        if (!active) return;
        setAttempt(response.session);
        setTest(response.practice ?? response.mock ?? null);
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to start test");
      } finally {
        if (active) setLoading(false);
      }
    };
    void start();
    return () => {
      active = false;
    };
  }, [kind, testId]);

  const section = test?.sections[sectionIndex];
  const question = section?.questions[questionIndex];
  const sectionNames = useMemo(() => test?.sections.map((item) => item.name) ?? [], [test]);

  const saveAnswer = (questionId: string, value: string) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const submit = async () => {
    if (!attempt || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post(`/${kind}/sessions/${attempt.id}/submit`, {
        answers,
        essayText: essayText || undefined,
        durationSeconds: Math.round((Date.now() - startedAt.current) / 1000),
      });
      router.push(`/${kind}/${testId}/results`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to submit test");
      setSubmitting(false);
    }
  };

  const next = () => {
    if (!test || !section) return;
    if (questionIndex < section.questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }
    if (sectionIndex < test.sections.length - 1) {
      setSectionIndex((current) => current + 1);
      setQuestionIndex(0);
      return;
    }
    void submit();
  };

  const previous = () => {
    if (!test) return;
    if (questionIndex > 0) {
      setQuestionIndex((current) => current - 1);
      return;
    }
    if (sectionIndex > 0) {
      const previousSection = test.sections[sectionIndex - 1];
      setSectionIndex((current) => current - 1);
      setQuestionIndex(Math.max(0, previousSection.questions.length - 1));
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Preparing your test...</div>;
  if (error && !test) return <div className="py-20 text-center text-red-500">{error}</div>;
  if (!test || !section || !question) return <div className="py-20 text-center">Test content is unavailable.</div>;

  const questionControl = <QuestionControl question={question} value={answers[question.id] ?? ""} onChange={saveAnswer} />;

  let content: React.ReactNode = questionControl;
  if (section.skill === "L") {
    content = (
      <ListeningPlayer
        audioUrl={section.audioUrl ?? ""}
        segments={section.segments ?? [{ id: section.id, label: section.name, timestamp: 0 }]}
        questions={questionControl}
      />
    );
  } else if (section.skill === "R") {
    content = <ReadingPlayer passage={section.passage ?? ""} questions={questionControl} />;
  } else if (section.skill === "W") {
    content = (
      <WritingPlayer
        prompt={question.prompt}
        targetWords={question.targetWords ?? 250}
        onChange={setEssayText}
      />
    );
  } else if (section.skill === "S") {
    content = <SpeakingPlayer part={2} question={question.prompt} />;
  }

  return (
    <>
      {error && <div className="fixed top-3 left-1/2 z-[300] -translate-x-1/2 bg-red-50 text-red-600 px-5 py-3 rounded-xl">{error}</div>}
      {submitting && <div className="fixed inset-0 z-[300] bg-white/80 flex items-center justify-center font-bold">Saving your result...</div>}
      <TestLayout
        activeSection={section.name}
        sections={sectionNames}
        timeLeft={attempt?.timeLeft ?? test.timeLimitSeconds}
        onTimeUp={() => void submit()}
        onExit={() => router.push(`/${kind}`)}
        onNext={next}
        onPrev={previous}
        totalQuestions={section.questions.length}
        currentQuestion={questionIndex + 1}
        onQuestionSelect={(number) => setQuestionIndex(number - 1)}
      >
        {content}
      </TestLayout>
    </>
  );
}

function QuestionControl({
  question,
  value,
  onChange,
}: {
  question: TestQuestion;
  value: string;
  onChange: (questionId: string, value: string) => void;
}) {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase">Question {question.number}</p>
        <h2 className="text-xl font-bold text-slate-900 mt-2">{question.prompt}</h2>
      </div>
      {question.options?.length ? (
        <div className="grid gap-3">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(question.id, option)}
              className={`p-4 border-2 rounded-xl text-left font-bold ${
                value === option ? "border-primary bg-primary/5 text-primary" : "border-slate-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(question.id, event.target.value)}
          className="w-full border-b-2 border-slate-300 bg-transparent py-3 outline-none focus:border-primary"
          placeholder="Type your answer"
        />
      )}
    </div>
  );
}
