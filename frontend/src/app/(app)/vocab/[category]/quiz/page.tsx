"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { TestLayout } from "@/components/test/TestLayout";
import type { VocabQuizAttempt, VocabQuizResult, VocabQuizStartResponse } from "@/lib/types";

type SubmitResponse = {
  attempt: VocabQuizAttempt;
  result: VocabQuizResult;
};

export default function VocabularyQuizPage() {
  const params = useParams<{ category: string }>();
  const router = useRouter();
  const group = decodeURIComponent(params.category);
  const startedAtRef = useRef<number>(0);
  const didLoadRef = useRef(false);
  const [attempt, setAttempt] = useState<VocabQuizAttempt | null>(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [signature, setSignature] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<VocabQuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;

    async function loadQuiz() {
      setLoading(true);
      setError("");
      try {
        const response = await api.post<VocabQuizStartResponse>(
          `/vocabulary/groups/${encodeURIComponent(group)}/quiz/start`,
        );
        setAttempt(response.attempt);
        setSelectedQuestionIds(response.selectedQuestionIds);
        setSignature(response.signature);
        startedAtRef.current = Date.now();
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Could not start quiz");
      } finally {
        setLoading(false);
      }
    }

    void loadQuiz();
  }, [group]);

  const questions = useMemo(() => attempt?.selectedQuestions ?? [], [attempt]);
  const currentQuestion = questions[currentIndex];
  const answeredQuestions = useMemo(
    () => questions.map((question) => Boolean((answers[question.id] ?? "").trim())),
    [answers, questions],
  );
  const unansweredCount = answeredQuestions.filter((answered) => !answered).length;

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setError("");
  };

  const submitQuiz = useCallback(async () => {
    if (!attempt || submitting) return;
    const hasUnanswered = attempt.selectedQuestions.some(
      (question) => !(answers[question.id] ?? "").trim(),
    );
    if (hasUnanswered) {
      setError("Answer every question before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const durationSeconds = Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000));
      const response = await api.post<SubmitResponse>("/vocabulary/quiz-attempts/submit", {
        testNo: attempt.testNo,
        selectedQuestionIds,
        signature,
        answers,
        durationSeconds,
      });
      setResult(response.result);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not submit quiz");
    } finally {
      setSubmitting(false);
    }
  }, [answers, attempt, selectedQuestionIds, signature, submitting]);

  const handleNext = () => {
    if (!attempt) return;
    if (currentIndex === attempt.selectedQuestions.length - 1) {
      void submitQuiz();
      return;
    }
    setCurrentIndex((value) => Math.min(value + 1, attempt.selectedQuestions.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((value) => Math.max(0, value - 1));
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
        Preparing quiz...
      </div>
    );
  }

  if (error && !attempt) {
    return (
      <div className="mx-auto max-w-2xl py-20">
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="border border-red-100 bg-red-50 p-6 text-sm font-bold text-red-600">{error}</div>
      </div>
    );
  }

  if (result) {
    const percent = Math.round((result.rawScore.correct / Math.max(1, result.rawScore.total)) * 100);

    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{group}</p>
            <h1 className="mt-2 text-4xl font-black">Vocabulary Quiz Result</h1>
          </div>
          <Link href={`/vocab/${encodeURIComponent(group)}`} className="inline-flex h-11 items-center justify-center bg-slate-950 px-5 text-sm font-black text-white transition-colors hover:bg-primary">
            Back to Words
          </Link>
        </header>

        <section className="grid gap-4 border border-slate-100 bg-white p-7 shadow-sm sm:grid-cols-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Score</p>
            <p className="mt-2 text-4xl font-black">{result.score}/{result.rawScore.total}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Accuracy</p>
            <p className="mt-2 text-4xl font-black">{percent}%</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Time</p>
            <p className="mt-2 text-4xl font-black">{Math.round((result.durationSeconds ?? 0) / 60)}m</p>
          </div>
        </section>

        <div className="space-y-3">
          {result.gradedAnswers.map((item, index) => (
            <article key={item.questionId} className="border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Question {index + 1}</p>
                  <p className="mt-2 font-bold text-slate-950">{item.prompt}</p>
                </div>
                {item.isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
                ) : (
                  <XCircle className="h-6 w-6 shrink-0 text-red-500" />
                )}
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <p className="bg-slate-50 p-3 font-semibold text-slate-600">Your answer: {item.answer || "Blank"}</p>
                <p className="bg-emerald-50 p-3 font-semibold text-emerald-700">Correct: {item.correctAnswer}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (!attempt || !currentQuestion) return null;

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <TestLayout
      activeSection="Vocabulary"
      sections={["Vocabulary"]}
      timeLeft={attempt.timeLimitSeconds}
      onTimeUp={() => void submitQuiz()}
      onExit={() => router.push(`/vocab/${encodeURIComponent(group)}`)}
      onNext={handleNext}
      onPrev={handlePrev}
      nextLabel={isLastQuestion ? (submitting ? "Submitting" : "Submit") : "Next"}
      isLastQuestion={isLastQuestion}
      totalQuestions={questions.length}
      currentQuestion={currentIndex + 1}
      onQuestionSelect={(questionNumber) => setCurrentIndex(questionNumber - 1)}
      questionLabels={questions.map((_, index) => String(index + 1))}
      answeredQuestions={answeredQuestions}
      largeQuestionNav
    >
      <div className="flex h-full items-center justify-center overflow-y-auto px-6 py-10">
        <section className="w-full max-w-4xl border border-slate-100 bg-white p-8 shadow-sm lg:p-10">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <h1 className="mt-3 text-3xl font-black text-slate-950">{currentQuestion.typeLabel}</h1>
            </div>
            <p className="bg-slate-50 px-4 py-2 text-sm font-black text-slate-500">
              {unansweredCount} left
            </p>
          </div>

          <p className="mt-8 text-2xl font-black leading-snug text-slate-950">{currentQuestion.prompt}</p>

          {currentQuestion.answerType === "mcq" ? (
            <div className="mt-8 grid gap-4">
              {(currentQuestion.options ?? []).map((option) => {
                const selected = answers[currentQuestion.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswer(currentQuestion.id, option)}
                    className={`min-h-16 border px-5 py-4 text-left text-base font-bold transition-colors ${
                      selected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              value={answers[currentQuestion.id] ?? ""}
              onChange={(event) => setAnswer(currentQuestion.id, event.target.value)}
              className="mt-8 h-16 w-full border-b-2 border-slate-300 bg-transparent text-2xl font-black outline-none transition-colors placeholder:text-slate-300 focus:border-primary"
              placeholder="Type the missing word"
            />
          )}

          {error && <p className="mt-6 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}
        </section>
      </div>
    </TestLayout>
  );
}
