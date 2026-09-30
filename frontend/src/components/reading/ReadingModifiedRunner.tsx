"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { api, invalidateApiCache } from "@/lib/api";
import { GAP_MARKER, letterLabel, ReadingSet, totalQuestions } from "@/lib/reading-modified";
import { ReadingMarkdown } from "./ReadingMarkdown";

type ReadingSession = { id: string; status: "active" | "submitted" };

export function ReadingModifiedRunner({ practiceId }: { practiceId: string }) {
  const router = useRouter();
  const startPromise = useRef<Promise<[ReadingSet, { session: ReadingSession }]> | null>(null);
  const [set, setSet] = useState<ReadingSet | null>(null);
  const [session, setSession] = useState<ReadingSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!startPromise.current) {
      startPromise.current = Promise.all([
        api.get<ReadingSet>(`/reading-modified/${practiceId}`),
        api.post<{ session: ReadingSession }>(`/reading-modified/${practiceId}/start`),
      ]);
    }
    startPromise.current.then(([readingSet, started]) => {
      if (!active) return;
      setSet(readingSet);
      setSession(started.session);
      setLoading(false);
    }).catch((requestError) => {
      if (!active) return;
      setError(requestError instanceof Error ? requestError.message : "Could not start reading set.");
      setLoading(false);
    });
    return () => { active = false; };
  }, [practiceId]);

  const submit = async () => {
    if (!session || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post(`/reading-modified/sessions/${session.id}/submit`, { answers });
      invalidateApiCache("/practice");
      router.push(`/practice/${practiceId}/results`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not submit reading set.");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Preparing your reading set...</div>;
  if (!set || !session) return <div className="py-20 text-center text-red-600">{error || "Reading set unavailable."}</div>;

  let number = 0;
  const answered = Object.values(answers).filter((answer) => answer.trim()).length;

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-16">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-primary">Reading practice</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">{set.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{answered} of {totalQuestions(set.components)} questions answered</p>
        </div>
        <button type="button" onClick={() => router.push("/practice")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:border-primary hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Exit
        </button>
      </header>

      {set.components.map((component, index) => (
        <section key={component.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-9">
          <p className="mb-5 text-xs font-black uppercase tracking-widest text-slate-400">Part {index + 1}</p>
          {component.type === "passage" ? (
            <ReadingMarkdown content={component.markdown} />
          ) : component.type === "fillGaps" ? (
            <div className="space-y-7">
              {component.heading && <ReadingMarkdown content={component.heading} />}
              <div className="space-y-6">
                {component.questions.map((question) => {
                  const questionNumber = ++number;
                  const [before, after] = question.text.split(GAP_MARKER);
                  return (
                    <label key={question.id} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:p-5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">{questionNumber}</span>
                      <span className="min-w-0 flex-1 whitespace-pre-wrap text-base leading-10 text-slate-800">
                        {before}
                        <input value={answers[question.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                          aria-label={`Answer for question ${questionNumber}`} autoComplete="off"
                          className="mx-1 inline-block h-9 w-40 max-w-full rounded-md border-b-2 border-slate-500 bg-white px-2 text-center font-bold text-slate-900 outline-none focus:border-primary" />
                        {after}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : component.type === "mcq" ? (
            <div className="space-y-7">
              {component.heading && <ReadingMarkdown content={component.heading} />}
              <div className="space-y-6">
                {component.questions.map((question) => {
                  const questionNumber = ++number;
                  return (
                    <fieldset key={question.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:p-5">
                      <legend className="sr-only">Question {questionNumber}</legend>
                      <div className="flex items-start gap-4">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">{questionNumber}</span>
                        <div className="min-w-0 flex-1">
                          <p className="whitespace-pre-wrap text-base font-bold leading-7 text-slate-800">{question.text}</p>
                          <div className="mt-4 space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <label key={option.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${answers[question.id] === option.id ? "border-primary bg-white text-slate-950" : "border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300"}`}>
                                <input type="radio" name={`question-${question.id}`} value={option.id}
                                  checked={answers[question.id] === option.id}
                                  onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                                  className="h-4 w-4 shrink-0 accent-primary" />
                                <span className="font-black">{letterLabel(optionIndex)}.</span>
                                <span>{option.text}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-7">
              {component.heading && <ReadingMarkdown content={component.heading} />}
              <div className="space-y-4">
                {component.questions.map((question) => {
                  const questionNumber = ++number;
                  return (
                    <label key={question.id} className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:p-5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-black text-white">{questionNumber}</span>
                      <span className="min-w-0 flex-1 whitespace-pre-wrap text-base leading-9 text-slate-800">
                        {question.text}
                        <input value={answers[question.id] ?? ""}
                          onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value.toUpperCase() }))}
                          aria-label={`Remaining sentence letter for question ${questionNumber}`} autoComplete="off"
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
            </div>
          )}
        </section>
      ))}

      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <p className="text-sm text-slate-500">Only submitting counts as an attempt. Exiting now will not count.</p>
        <button type="button" disabled={submitting} onClick={() => void submit()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-white disabled:opacity-50">
          <Send className="h-4 w-4" /> {submitting ? "Submitting..." : "Submit answers"}
        </button>
      </div>
    </div>
  );
}
