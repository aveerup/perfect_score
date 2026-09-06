"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, RefreshCcw, RotateCcw, Target, Timer, Trophy, Zap } from "lucide-react";
import { api, invalidateApiCache } from "@/lib/api";
import type { TypingLesson, TypingLessonAttemptResult } from "@/lib/types";
import { KeyboardGuide } from "@/components/typing/KeyboardGuide";

type AttemptMetrics = {
  wpm: number;
  accuracy: number;
  durationSeconds: number;
  keyErrors: Record<string, number>;
};

function displayKey(key: string) {
  return key === " " ? "Space" : key;
}

export function TypingLessonPlayer({ lesson, nextLessonId, baselineWpm }: { lesson: TypingLesson; nextLessonId: string | null; baselineWpm: number | null }) {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [roundDone, setRoundDone] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [lastError, setLastError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [result, setResult] = useState<TypingLessonAttemptResult | null>(null);
  const [pendingMetrics, setPendingMetrics] = useState<AttemptMetrics | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const exerciseStartedAt = useRef<number | null>(null);
  const completedDuration = useRef(0);
  const correctRef = useRef(0);
  const errorsRef = useRef(0);
  const keyErrorsRef = useRef<Record<string, number>>({});
  const finishingRef = useRef(false);

  const exercise = lesson.exercises[exerciseIndex];
  const rounds = exercise.rounds?.length ? exercise.rounds : [exercise.text];
  const roundText = rounds[roundIndex] ?? exercise.text;
  const isFinalRound = roundIndex === rounds.length - 1;
  const isFinalExercise = exerciseIndex === lesson.exercises.length - 1;
  const hasNextStep = !isFinalRound || !isFinalExercise;
  const expectedKey = roundText[typed.length] ?? "";
  const currentAccuracy = Math.round((correctCount / Math.max(1, correctCount + errorCount)) * 100);
  const progress = Math.round((typed.length / roundText.length) * 100);
  const totalRounds = lesson.exercises.reduce((total, item) => total + Math.max(1, item.rounds?.length ?? 1), 0);
  const completedRoundsBefore = lesson.exercises
    .slice(0, exerciseIndex)
    .reduce((total, item) => total + Math.max(1, item.rounds?.length ?? 1), 0);
  const lessonProgress = Math.round(
    ((completedRoundsBefore + roundIndex + (roundDone ? 1 : progress / 100)) / totalRounds) * 100,
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, [exerciseIndex, roundDone, roundIndex]);

  useEffect(() => {
    if (!exerciseStartedAt.current || roundDone || result) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.max(1, Math.round((Date.now() - (exerciseStartedAt.current ?? Date.now())) / 1000)));
    }, 500);
    return () => window.clearInterval(timer);
  }, [hasStarted, result, roundDone]);

  const saveAttempt = async (metrics: AttemptMetrics) => {
    setSaving(true);
    setSaveError("");
    try {
      const saved = await api.post<TypingLessonAttemptResult>("/typing/course/attempts", {
        lessonId: lesson.id,
        ...metrics,
      });
      invalidateApiCache("/typing/course");
      setResult(saved);
    } catch (requestError) {
      setSaveError(requestError instanceof Error ? requestError.message : "Could not save your result");
      setPendingMetrics(metrics);
    } finally {
      setSaving(false);
    }
  };

  const completeRound = (nextCorrectCount: number) => {
    const activeDuration = exerciseStartedAt.current ? Math.max(1, Math.round((Date.now() - exerciseStartedAt.current) / 1000)) : 1;
    completedDuration.current += activeDuration;
    setElapsedSeconds(activeDuration);
    setRoundDone(true);

    if (!isFinalRound || !isFinalExercise || finishingRef.current) return;

    finishingRef.current = true;
    const attempts = nextCorrectCount + errorsRef.current;
    const metrics: AttemptMetrics = {
      wpm: Math.round((nextCorrectCount / 5) / (Math.max(1, completedDuration.current) / 60)),
      accuracy: Math.round((nextCorrectCount / Math.max(1, attempts)) * 100),
      durationSeconds: completedDuration.current,
      keyErrors: keyErrorsRef.current,
    };
    setPendingMetrics(metrics);
    void saveAttempt(metrics);
  };

  const nextStep = () => {
    if (isFinalRound) {
      setExerciseIndex((current) => current + 1);
      setRoundIndex(0);
    } else {
      setRoundIndex((current) => current + 1);
    }
    setTyped("");
    setRoundDone(false);
    setHasStarted(false);
    setElapsedSeconds(0);
    setLastError("");
    exerciseStartedAt.current = null;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (roundDone) {
      if (event.key === "Enter" && hasNextStep) {
        event.preventDefault();
        nextStep();
      }
      return;
    }
    if (result || saving || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === "Tab") return;
    event.preventDefault();
    if (event.key.length !== 1 || !expectedKey) return;

    if (!exerciseStartedAt.current) {
      exerciseStartedAt.current = Date.now();
      setHasStarted(true);
      setElapsedSeconds(1);
    }

    if (event.key === expectedKey) {
      const nextTyped = typed + event.key;
      const nextCorrectCount = correctRef.current + 1;
      correctRef.current = nextCorrectCount;
      setCorrectCount(nextCorrectCount);
      setTyped(nextTyped);
      setLastError("");
      if (nextTyped.length === roundText.length) completeRound(nextCorrectCount);
      return;
    }

    const errorKey = displayKey(expectedKey);
    errorsRef.current += 1;
    keyErrorsRef.current[errorKey] = (keyErrorsRef.current[errorKey] ?? 0) + 1;
    setErrorCount(errorsRef.current);
    setLastError(errorKey);
  };

  const restartLesson = () => {
    setExerciseIndex(0);
    setRoundIndex(0);
    setTyped("");
    setRoundDone(false);
    setHasStarted(false);
    setElapsedSeconds(0);
    setCorrectCount(0);
    setErrorCount(0);
    setLastError("");
    setSaving(false);
    setSaveError("");
    setResult(null);
    setPendingMetrics(null);
    exerciseStartedAt.current = null;
    completedDuration.current = 0;
    correctRef.current = 0;
    errorsRef.current = 0;
    keyErrorsRef.current = {};
    finishingRef.current = false;
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  if (result) {
    return (
      <div className="mx-auto max-w-4xl py-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className={result.passed ? "bg-emerald-500 p-10 text-white" : "bg-amber-400 p-10 text-slate-950"}>
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              {result.passed ? <Trophy className="h-8 w-8" /> : <RotateCcw className="h-8 w-8" />}
            </div>
            <p className="text-xs font-black uppercase tracking-[0.25em]">Day {lesson.day} result</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {result.passed ? "Lesson complete" : "One more careful round"}
            </h1>
            <p className="mt-3 max-w-xl font-medium opacity-80">
              {result.passed
                ? `You reached the ${lesson.targetAccuracy}% accuracy goal and unlocked the next lesson.`
                : `You scored ${result.accuracy}%. Reach ${lesson.targetAccuracy}% accuracy to unlock the next lesson.`}
            </p>
          </div>

          <div className="p-8 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultStat icon={<Zap />} label="Speed" value={`${Math.round(result.wpm)} WPM`} />
              <ResultStat icon={<Target />} label="Accuracy" value={`${Math.round(result.accuracy)}%`} />
              <ResultStat icon={<Timer />} label="Typing time" value={`${result.durationSeconds}s`} />
            </div>

            {Object.keys(result.keyErrors).length > 0 && (
              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Keys to revisit</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(result.keyErrors)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(([key, count]) => (
                      <span key={key} className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-sm font-black text-slate-700">
                        {key} <span className="text-slate-400">×{count}</span>
                      </span>
                    ))}
                </div>
              </div>
            )}

            {lesson.day === 15 && baselineWpm !== null && (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">From baseline to graduation</p>
                <p className="mt-2 text-sm font-medium text-emerald-800">
                  Day 1: <strong>{Math.round(baselineWpm)} WPM</strong> · Day 15: <strong>{Math.round(result.wpm)} WPM</strong>
                  {result.wpm > baselineWpm ? ` · ${Math.round(result.wpm - baselineWpm)} WPM faster` : ""}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {result.passed && nextLessonId ? (
                <Link href={`/typing/learn/${nextLessonId}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-slate-800">
                  Continue to day {lesson.day + 1} <ArrowRight className="h-4 w-4" />
                </Link>
              ) : result.passed ? (
                <Link href="/typing" className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-slate-800">
                  Practice IELTS passages <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button onClick={restartLesson} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-slate-800">
                  Try the lesson again <RefreshCcw className="h-4 w-4" />
                </button>
              )}
              <Link href="/typing/learn" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-50">
                Course overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" onClick={() => inputRef.current?.focus()}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/typing/learn" className="inline-flex items-center gap-2 text-sm font-black text-slate-500 transition hover:text-slate-950">
          <ArrowLeft className="h-4 w-4" /> Course overview
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Lesson {lessonProgress}%</span>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200 sm:w-48">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${lessonProgress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="rounded-[2rem] bg-slate-950 p-7 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50">Day {lesson.day} · {lesson.durationMinutes} min</p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight">{lesson.title}</h1>
            <p className="mt-3 text-sm font-medium text-white/60">Focus: {lesson.focus}</p>
            <div className="mt-6 flex gap-3 border-t border-white/10 pt-5">
              <div><p className="text-[9px] font-black uppercase tracking-widest text-white/40">Accuracy goal</p><p className="mt-1 text-lg font-black">{lesson.targetAccuracy}%</p></div>
              <div className="border-l border-white/10 pl-3"><p className="text-[9px] font-black uppercase tracking-widest text-white/40">Speed guide</p><p className="mt-1 text-lg font-black">{lesson.targetWpm} WPM</p></div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Technique</p>
            <ul className="mt-4 space-y-4">
              {lesson.instructions.map((instruction) => (
                <li key={instruction} className="flex gap-3 text-sm font-medium leading-5 text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {instruction}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Today’s drills</p>
            <div className="mt-4 space-y-3">
              {lesson.exercises.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${index < exerciseIndex || (index === exerciseIndex && roundDone && isFinalRound) ? "bg-emerald-500 text-white" : index === exerciseIndex ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-400"}`}>
                    {index < exerciseIndex || (index === exerciseIndex && roundDone && isFinalRound) ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <span className={`min-w-0 text-sm font-bold ${index === exerciseIndex ? "text-slate-950" : "text-slate-400"}`}>
                    {item.title}
                    {index === exerciseIndex && <span className="mt-0.5 block text-[9px] uppercase tracking-widest text-emerald-600">Round {roundIndex + 1}/{rounds.length}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">{exercise.kind} · Drill {exerciseIndex + 1}/{lesson.exercises.length} · Round {roundIndex + 1}/{rounds.length}</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{exercise.title}</h2>
                <p className="mt-2 text-sm font-medium text-slate-500">{exercise.guidance}</p>
              </div>
              <div className="flex gap-5">
                <LiveStat label="Time" value={`${elapsedSeconds}s`} />
                <LiveStat label="Accuracy" value={`${correctCount + errorCount === 0 ? 100 : currentAccuracy}%`} />
              </div>
            </div>

            <div className="relative py-10 sm:py-14">
              <input
                ref={inputRef}
                aria-label="Typing input"
                className="absolute h-px w-px opacity-0"
                onKeyDown={handleKeyDown}
                onPaste={(event) => event.preventDefault()}
                autoFocus
              />
              <div className="font-mono text-2xl font-medium leading-[1.8] tracking-wide sm:text-3xl" aria-live="polite">
                {roundText.split("").map((char, index) => {
                  const isTyped = index < typed.length;
                  const isCurrent = index === typed.length && !roundDone;
                  return (
                    <span
                      key={`${char}-${index}`}
                      className={isTyped ? "text-emerald-600" : isCurrent ? "relative rounded bg-slate-950 px-0.5 text-white" : "text-slate-300"}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>

              {lastError && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600" role="status">
                  Try <span className="font-mono text-base font-black">{lastError}</span> again — accuracy first.
                </div>
              )}

              {!hasStarted && !roundDone && (
                <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Place your fingers on F and J, then start typing</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="font-mono text-xs font-black text-slate-400">{typed.length}/{roundText.length}</span>
            </div>

            {roundDone && hasNextStep && (
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-emerald-50 p-4">
                <div className="flex items-center gap-3 text-sm font-black text-emerald-800"><CheckCircle2 className="h-5 w-5" /> {isFinalRound ? "Drill complete" : "Round complete"}</div>
                <button onClick={nextStep} className="inline-flex items-center gap-3 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700">
                  {isFinalRound ? "Next drill" : "Next round"}
                  <kbd className="rounded-md border border-white/25 bg-white/10 px-2 py-0.5 font-mono text-[10px]">Enter ↵</kbd>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {saving && <p className="mt-6 text-center text-sm font-bold text-slate-500">Saving your lesson result…</p>}
            {saveError && pendingMetrics && (
              <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl bg-rose-50 p-4 sm:flex-row">
                <p className="text-sm font-bold text-rose-700">{saveError}</p>
                <button onClick={() => void saveAttempt(pendingMetrics)} className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-black text-white">Retry saving</button>
              </div>
            )}
          </section>

          <KeyboardGuide nextKey={expectedKey || " "} lessonKeys={lesson.keys} />
        </main>
      </div>
    </div>
  );
}

function LiveStat({ label, value }: { label: string; value: string }) {
  return <div className="text-right"><p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p><p className="mt-1 font-mono text-lg font-black text-slate-950">{value}</p></div>;
}

function ResultStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 h-5 w-5 text-slate-400">{icon}</div>
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}
