"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useApiData } from "@/lib/api";
import { MockResult, Skill } from "@/lib/types";

const skillNames: Record<Skill, string> = {
  L: "Listening",
  R: "Reading",
  W: "Writing",
  S: "Speaking",
};

export default function MockResultsPage() {
  const params = useParams<{ id: string }>();
  const { data, loading, error } = useApiData<MockResult | null>(`/mock/${params.id}/results`, null);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading result...</div>;
  if (error || !data) return <div className="py-20 text-center text-red-500">{error || "Result not found"}</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-10">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Mock simulation result</p>
        <p className="text-8xl font-black mt-4">{data.overallBand.toFixed(1)}</p>
        <p className="text-sm text-slate-500 mt-2">Basic estimated overall band</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(skillNames) as Skill[]).map((skill) => (
          <div key={skill} className="bg-white border border-slate-100 rounded-2xl p-6 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">{skillNames[skill]}</p>
            <p className="text-3xl font-black mt-2">{data.scores[skill].toFixed(1)}</p>
          </div>
        ))}
      </section>

      <p className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-sm text-amber-900">
        {data.feedback}
      </p>

      <div className="flex justify-center gap-4">
        <Link href={`/mock/${params.id}`} className="px-6 py-3 rounded-xl border border-slate-200 font-bold">Retry mock</Link>
        <Link href="/mock" className="px-6 py-3 rounded-xl bg-primary text-white font-bold">All mocks</Link>
      </div>
    </div>
  );
}
