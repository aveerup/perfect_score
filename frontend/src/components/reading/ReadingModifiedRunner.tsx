"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock3, Send } from "lucide-react";
import { api, invalidateApiCache } from "@/lib/api";
import {
  GAP_MARKER,
  groupReadingParts,
  letterLabel,
  ReadingQuestionComponent,
  ReadingSet,
} from "@/lib/reading-modified";
import { ReadingMarkdown } from "./ReadingMarkdown";

type ReadingSession = { id: string; status: "active" | "submitted"; createdAt: string };
const READING_TIME_LIMIT_SECONDS = 60 * 60;

function formatReadingTime(seconds: number) {
  const absoluteSeconds = Math.abs(seconds);
  const minutes = Math.floor(absoluteSeconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (absoluteSeconds % 60).toString().padStart(2, "0");
  return (seconds < 0 ? "−" : "") + minutes + ":" + remainingSeconds;
}

function ReadingTimer({ startedAt }: { startedAt: string }) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const updateTime = () => setNowMs(Date.now());
    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    document.addEventListener("visibilitychange", updateTime);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", updateTime);
    };
  }, [startedAt]);

  const startedAtMs = Date.parse(startedAt);
  const elapsedSeconds = Number.isNaN(startedAtMs) ? 0 : Math.floor(Math.max(0, nowMs - startedAtMs) / 1000);
  const remainingSeconds = READING_TIME_LIMIT_SECONDS - elapsedSeconds;

  return (
    <div role="timer" aria-label={remainingSeconds <= 0 ? "Reading time over" : "Reading time remaining"}
      className={"mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-lg font-bold tabular-nums " + (remainingSeconds <= 0 ? "border-red-200 bg-red-50 text-red-600" : "border-slate-200 bg-slate-50 text-slate-700")}>
      <Clock3 aria-hidden="true" className="h-5 w-5" /> {formatReadingTime(remainingSeconds)}
    </div>
  );
}

function scrollToQuestion(pane: HTMLElement | null, questionId: string) {
  if (!pane) return;
  const target = document.getElementById("reading-question-" + questionId);
  if (!target || !pane.contains(target)) return;
  const top = target.getBoundingClientRect().top - pane.getBoundingClientRect().top + pane.scrollTop - 16;
  pane.scrollTo({ top, behavior: "smooth" });
}

function QuestionSection({
  component,
  startNumber,
  answers,
  onAnswerChange,
}: {
  component: ReadingQuestionComponent;
  startNumber: number;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
}) {
  if (component.type === "fillGaps") {
    return (
      <section className="space-y-6">
        {component.heading && <ReadingMarkdown content={component.heading} />}
        <div className="space-y-5">
          {component.questions.map((question, index) => {
            const questionNumber = startNumber + index + 1;
            const [before, after] = question.text.split(GAP_MARKER);
            return (
              <label id={"reading-question-" + question.id} key={question.id} className="flex scroll-mt-4 items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:p-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">{questionNumber}</span>
                <span className="min-w-0 flex-1 whitespace-pre-wrap text-base leading-10 text-slate-800">
                  {before}
                  <input value={answers[question.id] ?? ""} onChange={(event) => onAnswerChange(question.id, event.target.value)}
                    aria-label={"Answer for question " + questionNumber} autoComplete="off"
                    className="mx-1 inline-block h-9 w-40 max-w-full rounded-md border-b-2 border-slate-500 bg-white px-2 text-center font-bold text-slate-900 outline-none focus:border-primary" />
                  {after}
                </span>
              </label>
            );
          })}
        </div>
      </section>
    );
  }

  if (component.type === "mcq") {
    return (
      <section className="space-y-6">
        {component.heading && <ReadingMarkdown content={component.heading} />}
        <div className="space-y-5">
          {component.questions.map((question, index) => {
            const questionNumber = startNumber + index + 1;
            return (
              <fieldset id={"reading-question-" + question.id} key={question.id} className="w-full min-w-0 scroll-mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:p-5">
                <legend className="sr-only">Question {questionNumber}</legend>
                <div className="flex items-start gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">{questionNumber}</span>
                  <div className="min-w-0 flex-1">
                    <p className="whitespace-pre-wrap text-base font-bold leading-7 text-slate-800">{question.text}</p>
                    <div className="mt-4 space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label key={option.id} className={"flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors " + (answers[question.id] === option.id ? "border-primary bg-white text-slate-950" : "border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300")}>
                          <input type="radio" name={"question-" + question.id} value={option.id}
                            checked={answers[question.id] === option.id}
                            onChange={() => onAnswerChange(question.id, option.id)}
                            className="h-4 w-4 shrink-0 accent-primary" />
                          <span className="font-black">{letterLabel(optionIndex)}.</span>
                          <span className="min-w-0">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </fieldset>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {component.heading && <ReadingMarkdown content={component.heading} />}
      <div className="space-y-4">
        {component.questions.map((question, index) => {
          const questionNumber = startNumber + index + 1;
          return (
            <label id={"reading-question-" + question.id} key={question.id} className="flex scroll-mt-4 items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">{questionNumber}</span>
              <span className="min-w-0 flex-1 whitespace-pre-wrap text-base leading-9 text-slate-800">
                {question.text}
                <input value={answers[question.id] ?? ""}
                  onChange={(event) => onAnswerChange(question.id, event.target.value.toUpperCase())}
                  aria-label={"Remaining sentence letter for question " + questionNumber} autoComplete="off"
                  className="mx-2 inline-block h-9 w-20 rounded-md border-b-2 border-slate-500 bg-white px-2 text-center font-black uppercase text-slate-900 outline-none focus:border-primary" />
              </span>
            </label>
          );
        })}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Remaining sentences</h2>
        <div className="mt-4 space-y-3">
          {component.endings.map((ending, endingIndex) => (
            <div key={ending.id} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-white">{letterLabel(endingIndex)}</span>
              <div className="min-w-0 flex-1"><ReadingMarkdown content={ending.text} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReadingModifiedRunner({ practiceId }: { practiceId: string }) {
  const router = useRouter();
  const startPromise = useRef<Promise<[ReadingSet, { session: ReadingSession }]> | null>(null);
  const passagePaneRef = useRef<HTMLElement>(null);
  const questionPaneRef = useRef<HTMLElement>(null);
  const pendingQuestionRef = useRef<string | null>(null);
  const [set, setSet] = useState<ReadingSet | null>(null);
  const [session, setSession] = useState<ReadingSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const parts = useMemo(() => groupReadingParts(set?.components ?? []), [set]);
  const allQuestions = useMemo(
    () => parts.flatMap((part, partIndex) => part.questions.map((question) => ({ ...question, partIndex }))),
    [parts],
  );

  useEffect(() => {
    let active = true;
    if (!startPromise.current) {
      startPromise.current = Promise.all([
        api.get<ReadingSet>("/reading-modified/" + practiceId),
        api.post<{ session: ReadingSession }>("/reading-modified/" + practiceId + "/start"),
      ]);
    }
    startPromise.current.then(([readingSet, started]) => {
      if (!active) return;
      setSet(readingSet);
      setSession(started.session);
      setSelectedQuestionId(groupReadingParts(readingSet.components)[0]?.questions[0]?.id ?? null);
      setLoading(false);
    }).catch((requestError) => {
      if (!active) return;
      setError(requestError instanceof Error ? requestError.message : "Could not start reading set.");
      setLoading(false);
    });
    return () => { active = false; };
  }, [practiceId]);

  useEffect(() => {
    passagePaneRef.current?.scrollTo({ top: 0 });
    questionPaneRef.current?.scrollTo({ top: 0 });
  }, [activePartIndex]);

  useEffect(() => {
    if (!selectedQuestionId || pendingQuestionRef.current !== selectedQuestionId) return;
    scrollToQuestion(questionPaneRef.current, selectedQuestionId);
    pendingQuestionRef.current = null;
  }, [activePartIndex, selectedQuestionId]);

  const onAnswerChange = (questionId: string, value: string) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const selectPart = (partIndex: number) => {
    pendingQuestionRef.current = null;
    setActivePartIndex(partIndex);
    setSelectedQuestionId(parts[partIndex]?.questions[0]?.id ?? null);
    passagePaneRef.current?.scrollTo({ top: 0 });
    questionPaneRef.current?.scrollTo({ top: 0 });
  };

  const selectQuestion = (partIndex: number, questionId: string) => {
    if (partIndex === activePartIndex && questionId === selectedQuestionId) {
      scrollToQuestion(questionPaneRef.current, questionId);
      return;
    }
    pendingQuestionRef.current = questionId;
    setActivePartIndex(partIndex);
    setSelectedQuestionId(questionId);
  };

  const selectedQuestionIndex = allQuestions.findIndex((question) => question.id === selectedQuestionId);
  const moveQuestion = (direction: -1 | 1) => {
    const nextIndex = selectedQuestionIndex < 0
      ? (direction === 1 ? 0 : allQuestions.length - 1)
      : selectedQuestionIndex + direction;
    const next = allQuestions[nextIndex];
    if (next) selectQuestion(next.partIndex, next.id);
  };

  const submit = async () => {
    if (!session || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post("/reading-modified/sessions/" + session.id + "/submit", { answers });
      invalidateApiCache("/practice");
      router.push("/practice/" + practiceId + "/results");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not submit reading set.");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Preparing your reading set...</div>;
  if (!set || !session) return <div className="py-20 text-center text-red-600">{error || "Reading set unavailable."}</div>;

  const currentPart = parts[activePartIndex];
  const answered = allQuestions.filter((question) => answers[question.id]?.trim()).length;
  const firstQuestion = currentPart?.questions[0]?.number;
  const lastQuestion = currentPart?.questions[currentPart.questions.length - 1]?.number;

  return (
    <div className="flex w-full min-w-0 min-h-[calc(100dvh-9rem)] flex-col overflow-hidden bg-white md:h-full md:min-h-0">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 md:px-8">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-widest text-primary">Reading practice</p>
          <h1 className="truncate text-xl font-black text-slate-950 md:text-2xl">{set.title}</h1>
          <p className="text-xs text-slate-500">{answered} of {allQuestions.length} questions answered</p>
        </div>
        <ReadingTimer startedAt={session.createdAt} />
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.push("/practice")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:border-primary hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Exit
          </button>
          <button type="button" disabled={submitting} onClick={() => void submit()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-black text-white disabled:opacity-50">
            <Send className="h-4 w-4" /> {submitting ? "Submitting..." : "Submit answers"}
          </button>
        </div>
      </header>

      {error && <p role="alert" className="shrink-0 border-b border-red-100 bg-red-50 px-5 py-3 text-sm font-bold text-red-600 md:px-8">{error}</p>}

      {currentPart ? (
        <>
          <div className="shrink-0 border-b border-slate-200 bg-slate-50 px-5 py-3 md:px-8">
            <h2 className="font-black text-slate-900">{currentPart.number === null ? "Questions before the first passage" : "Part " + currentPart.number}</h2>
            <p className="text-sm text-slate-500">
              {firstQuestion && lastQuestion ? "Questions " + firstQuestion + "–" + lastQuestion : "Reading passage"}
            </p>
          </div>

          <div className="grid w-full min-w-0 min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
            <section ref={passagePaneRef} aria-label="Reading passage" className="w-full min-w-0 max-h-[42dvh] min-h-64 overflow-y-auto border-b border-slate-200 px-5 py-6 md:max-h-none md:min-h-0 md:border-b-0 md:border-r md:px-8 md:py-8">
              {currentPart.passage ? (
                <div className="mx-auto max-w-2xl"><ReadingMarkdown content={currentPart.passage.markdown} /></div>
              ) : (
                <p className="text-sm text-slate-500">This set has questions before its first passage.</p>
              )}
            </section>
            <section ref={questionPaneRef} aria-label="Reading questions" className="w-full min-w-0 max-h-[60dvh] min-h-96 overflow-y-auto bg-slate-50/40 px-5 py-6 md:max-h-none md:min-h-0 md:px-8 md:py-8">
              <div className="mx-auto w-full min-w-0 max-w-2xl space-y-8 [overflow-wrap:anywhere]">
                {firstQuestion && lastQuestion && (
                  <p className="text-sm font-semibold text-slate-600">
                    Answer questions {firstQuestion}–{lastQuestion}{currentPart.number === null ? "." : " based on Reading Passage " + currentPart.number + "."}
                  </p>
                )}
                {currentPart.sections.map(({ component, startNumber }) => (
                  <QuestionSection key={component.id} component={component} startNumber={startNumber} answers={answers} onAnswerChange={onAnswerChange} />
                ))}
                {currentPart.sections.length === 0 && <p className="text-sm text-slate-500">No questions in this part.</p>}
              </div>
            </section>
          </div>

          <footer className="flex shrink-0 items-center gap-3 border-t border-slate-200 bg-white px-3 py-3 md:px-6">
            <nav aria-label="Reading parts and questions" className="flex min-w-0 flex-1 gap-3 overflow-x-auto overscroll-contain pb-1">
              {parts.map((part, partIndex) => (
                <div key={part.id} className="flex shrink-0 items-center gap-2 border-r border-slate-200 pr-3 last:border-r-0">
                  <button type="button" onClick={() => selectPart(partIndex)}
                    aria-current={activePartIndex === partIndex ? "step" : undefined}
                    className={"whitespace-nowrap rounded-lg px-2 py-2 text-sm font-bold " + (activePartIndex === partIndex ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-100")}>
                    {part.number === null ? "Before passage" : "Part " + part.number}
                    <span className="ml-2 text-xs font-medium text-slate-500">
                      {part.questions.filter((question) => answers[question.id]?.trim()).length}/{part.questions.length}
                    </span>
                  </button>
                  {activePartIndex === partIndex && part.questions.map((question) => (
                    <button key={question.id} type="button" onClick={() => selectQuestion(partIndex, question.id)}
                      aria-label={"Go to question " + question.number}
                      aria-current={selectedQuestionId === question.id && activePartIndex === partIndex ? "step" : undefined}
                      className={"grid h-9 min-w-9 place-items-center rounded-lg border px-2 text-sm font-bold " + (
                        selectedQuestionId === question.id && activePartIndex === partIndex
                          ? "border-primary bg-primary text-white"
                          : answers[question.id]?.trim()
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 text-slate-600 hover:border-primary"
                      )}>
                      {question.number}
                    </button>
                  ))}
                </div>
              ))}
            </nav>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => moveQuestion(-1)} disabled={selectedQuestionIndex <= 0}
                aria-label="Previous question" className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => moveQuestion(1)} disabled={selectedQuestionIndex >= allQuestions.length - 1}
                aria-label="Next question" className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </footer>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500">This set has no reading parts.</div>
      )}
    </div>
  );
}
