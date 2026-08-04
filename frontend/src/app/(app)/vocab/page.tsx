"use client";

import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { useApiData } from "@/lib/api";
import { VocabularyGroupSummary } from "@/lib/types";

export default function VocabularyPage() {
  const { data: groups, loading, error } = useApiData<VocabularyGroupSummary[]>("/vocabulary/groups", []);
  if (loading) return <div className="py-20 text-center text-slate-400">Loading vocabulary...</div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-10">
      <header><h1 className="text-5xl font-black">Academic Lexicon</h1><p className="text-slate-500 mt-2">Review vocabulary by word group.</p></header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((item) => (
          <article key={item.group} className="bg-white border border-slate-100 rounded-[2rem] p-7">
            <BookOpen className="w-7 h-7 text-primary" />
            <h2 className="text-xl font-black mt-5">{item.group}</h2>
            <p className="text-sm text-slate-400 mt-1">{item.wordCount} words</p>
            <div className="flex justify-between mt-6 text-sm font-bold"><span>Mastery</span><span>{item.mastery}%</span></div>
            <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden"><div className="h-full bg-primary" style={{ width: `${item.mastery}%` }} /></div>
            <Link href={`/vocab/${encodeURIComponent(item.group)}`} className="mt-6 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl py-3 font-bold">Study words <ChevronRight className="w-4 h-4" /></Link>
          </article>
        ))}
      </div>
    </div>
  );
}
