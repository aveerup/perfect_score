"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ReadingResult } from "@/lib/reading-modified";

export function ReadingModifiedResults({ practiceId }: { practiceId: string }) {
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get<ReadingResult>(`/reading-modified/${practiceId}/results`).then((value) => {
      if (active) setResult(value);
    }).catch((requestError) => {
      if (active) setError(requestError instanceof Error ? requestError.message : "Could not load result.");
    });
    return () => { active = false; };
  }, [practiceId]);

  if (error) return <div className="py-20 text-center text-red-600">{error}</div>;
  if (!result) return <div className="py-20 text-center text-slate-400">Loading result...</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-10">
      <header>
        <p className="text-xs font-black uppercase tracking-widest text-primary">Reading practice submitted</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">{result.title}</h1>
      </header>
      <section className="rounded-2xl border border-slate-100 bg-white p-8">
        {result.rawScore ? (
          <>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Correct answers</p>
            <p className="mt-3 text-6xl font-black text-slate-950">{result.rawScore.correct}/{result.rawScore.total}</p>
            <p className="mt-4 text-sm text-slate-500">Your responses were checked against the answer key.</p>
          </>
        ) : (
          <>
            <p className="text-2xl font-black text-slate-950">Submission saved</p>
            <p className="mt-3 text-sm text-slate-500">This set has no complete answer key, so it was not graded automatically.</p>
          </>
        )}
        <p className="mt-5 text-sm font-bold text-slate-600">{result.answered} of {result.questionCount} questions answered</p>
      </section>
      {result.gradedAnswers.length > 0 && (
        <section className="rounded-2xl border border-slate-100 bg-white p-6">
          <h2 className="text-lg font-black text-slate-900">Question results</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {result.gradedAnswers.map((answer) => (
              <div key={answer.questionId} className={`rounded-xl px-4 py-3 text-sm font-bold ${answer.isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                Question {answer.number}: {answer.isCorrect ? "Correct" : "Incorrect"}
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="flex flex-wrap gap-3">
        <Link href={`/practice/${practiceId}`} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700">Try again</Link>
        <Link href="/practice" className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white">All practice sets</Link>
      </div>
    </div>
  );
}
