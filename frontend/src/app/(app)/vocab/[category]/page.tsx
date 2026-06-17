"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import { api, useApiData } from "@/lib/api";
import { VocabularyWord } from "@/lib/types";

type ReviewResult = "again" | "hard" | "good" | "easy";

export default function VocabularyCategoryPage() {
  const params = useParams<{ category: string }>();
  const router = useRouter();
  const category = decodeURIComponent(params.category);
  const { data: words, setData, loading, error } = useApiData<VocabularyWord[]>(
    `/vocabulary?category=${encodeURIComponent(category)}`,
    [],
  );
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const current = words[index];

  const review = async (result: ReviewResult) => {
    if (!current) return;
    const response = await api.post<{ word: VocabularyWord }>("/vocabulary/reviews", {
      wordId: current.id,
      result,
    });
    setData((items) => items.map((word) => word.id === current.id ? response.word : word));
    setIndex((value) => (value + 1) % words.length);
    setFlipped(false);
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading words...</div>;
  if (error || !current) return <div className="py-20 text-center text-red-500">{error || "No words found"}</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft className="w-4 h-4" /> All categories</button>
      <header className="flex justify-between items-end"><div><h1 className="text-4xl font-black">{category}</h1><p className="text-slate-400 mt-1">{index + 1} of {words.length}</p></div><p className="font-bold">Level {current.masteryLevel}/4</p></header>

      <button onClick={() => setFlipped((value) => !value)} className="w-full min-h-80 bg-white border border-slate-100 rounded-[2rem] p-10 text-center flex flex-col items-center justify-center">
        <RotateCw className="w-5 h-5 text-slate-300 mb-6" />
        {!flipped ? <h2 className="text-5xl font-black">{current.word}</h2> : (
          <div className="space-y-5">
            <p className="text-2xl font-bold">{current.definition}</p>
            <p className="text-slate-500">{current.collocations.join(", ")}</p>
            <p className="italic text-slate-600">&quot;{current.example}&quot;</p>
          </div>
        )}
      </button>

      <div className="grid grid-cols-4 gap-3">
        {(["again", "hard", "good", "easy"] as ReviewResult[]).map((result) => (
          <button key={result} onClick={() => void review(result)} className="border border-slate-200 rounded-xl py-3 font-bold capitalize hover:border-primary hover:text-primary">{result}</button>
        ))}
      </div>
    </div>
  );
}
