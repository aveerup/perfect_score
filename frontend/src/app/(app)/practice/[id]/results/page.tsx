"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useApiData } from "@/lib/api";
import { PracticeResult } from "@/lib/types";

export default function PracticeResultsPage() {
  const params = useParams<{ id: string }>();
  const { data, loading, error } = useApiData<PracticeResult | null>(
    `/practice/${params.id}/results`,
    null,
  );

  if (loading) return <div className="py-20 text-center text-slate-400">Loading result...</div>;
  if (error || !data) return <div className="py-20 text-center text-red-500">{error || "Result not found"}</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-10">
      <header className="border-b border-slate-200 pb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Basic scoring result</p>
        <h1 className="text-3xl font-black mt-2">{data.title}</h1>
      </header>

      <section className="bg-white border border-slate-100 rounded-[2rem] p-10 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Estimated band</p>
        <p className="text-8xl font-black mt-3">{data.score.toFixed(1)}</p>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        {data.criteria.map((criterion) => (
          <div key={criterion.name} className="bg-white border border-slate-100 rounded-2xl p-6">
            <div className="flex justify-between font-bold">
              <span>{criterion.name}</span>
              <span>{criterion.score.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-2">
        {data.feedback.map((item) => <p key={item} className="text-sm text-amber-900">{item}</p>)}
      </section>

      <div className="flex gap-4">
        <Link href={`/practice/${params.id}`} className="px-6 py-3 rounded-xl border border-slate-200 font-bold">Retry</Link>
        <Link href="/practice" className="px-6 py-3 rounded-xl bg-primary text-white font-bold">All practice sets</Link>
      </div>
    </div>
  );
}
