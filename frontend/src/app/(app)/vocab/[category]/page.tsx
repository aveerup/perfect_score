"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { useApiData } from "@/lib/api";
import { VocabularyWord } from "@/lib/types";

export default function VocabularyCategoryPage() {
  const params = useParams<{ category: string }>();
  const router = useRouter();
  const group = decodeURIComponent(params.category);
  const { data: words, loading, error } = useApiData<VocabularyWord[]>(
    `/vocabulary?group=${encodeURIComponent(group)}`,
    [],
  );
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const current = words[index];

  const goToWord = (direction: 1 | -1) => {
    setIndex((value) => (value + direction + words.length) % words.length);
    setFlipped(false);
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading words...</div>;
  if (error || !current) return <div className="py-20 text-center text-red-500">{error || "No words found"}</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft className="w-4 h-4" /> All groups</button>
      <header className="flex justify-between items-end"><div><h1 className="text-4xl font-black">{group}</h1><p className="text-slate-400 mt-1">{index + 1} of {words.length}</p></div><p className="font-bold">Level {current.masteryLevel}/4</p></header>

      <div className="grid grid-cols-[3rem_1fr_3rem] items-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={() => goToWord(-1)}
          className="h-12 w-12 rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-primary hover:text-primary"
          aria-label="Previous word"
        >
          <ChevronLeft className="mx-auto h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => setFlipped((value) => !value)}
          className="group relative h-[28rem] w-full text-center outline-none"
          style={{ perspective: "1400px" }}
        >
          <div
            className="absolute inset-0 transition-transform duration-500"
            style={{
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm transition-shadow duration-300 group-hover:shadow-2xl"
              style={{ backfaceVisibility: "hidden" }}
            >
              <RotateCw className="mb-6 h-5 w-5 text-slate-300" />
              <p className="text-sm font-black uppercase text-primary">{current.type}</p>
              <h2 className="mt-4 break-words text-5xl font-black">{current.word}</h2>
            </div>

            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-sm transition-shadow duration-300 group-hover:shadow-2xl"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">English Meaning</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">{current.englishMeaning}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">Bangla Meaning</p>
                  <p className="mt-1 text-lg font-semibold text-slate-700">{current.banglaMeaning}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">Sentence</p>
                  <p className="mt-1 italic text-slate-700">&quot;{current.sentence}&quot;</p>
                  <p className="mt-2 text-slate-600">{current.sentenceBanglaMeaning}</p>
                </div>
              </div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => goToWord(1)}
          className="h-12 w-12 rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-primary hover:text-primary"
          aria-label="Next word"
        >
          <ChevronRight className="mx-auto h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
