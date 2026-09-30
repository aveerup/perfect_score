"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, ClipboardCheck, Info, RotateCw } from "lucide-react";
import { api, useApiData } from "@/lib/api";
import { VocabularyComfortLevel, VocabularyWord } from "@/lib/types";

type VocabularyComfortResponse = {
  word: VocabularyWord;
};

const comfortOptions: {
  value: VocabularyComfortLevel;
  label: string;
  className: string;
  selectedClassName: string;
}[] = [
  {
    value: "comfortable",
    label: "Easy",
    className: "border-emerald-200 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50",
    selectedClassName: "border-emerald-600 bg-emerald-500 text-white shadow-sm",
  },
  {
    value: "almost",
    label: "Medium",
    className: "border-yellow-200 bg-yellow-50/40 text-yellow-700 hover:bg-yellow-50",
    selectedClassName: "border-yellow-500 bg-yellow-300 text-yellow-950 shadow-sm",
  },
  {
    value: "uncomfortable",
    label: "Hard",
    className: "border-red-200 bg-red-50/40 text-red-700 hover:bg-red-50",
    selectedClassName: "border-red-600 bg-red-500 text-white shadow-sm",
  },
];

export default function VocabularyCategoryPage() {
  const params = useParams<{ category: string }>();
  const router = useRouter();
  const group = decodeURIComponent(params.category);
  const { data: words, setData: setWords, loading, error } = useApiData<VocabularyWord[]>(
    `/vocabulary?group=${encodeURIComponent(group)}`,
    [],
  );
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [savingComfort, setSavingComfort] = useState<VocabularyComfortLevel | null>(null);
  const [comfortError, setComfortError] = useState("");
  const current = words[index];

  const goToWord = (direction: 1 | -1) => {
    setIndex((value) => (value + direction + words.length) % words.length);
    setFlipped(false);
    setComfortError("");
  };

  const setComfortLevel = async (comfortLevel: VocabularyComfortLevel) => {
    if (!current || current.comfortLevel === comfortLevel || savingComfort) return;

    const previousWords = words;
    setComfortError("");
    setSavingComfort(comfortLevel);
    setWords((items) =>
      items.map((word) =>
        word.id === current.id ? { ...word, comfortLevel } : word,
      ),
    );

    try {
      const response = await api.post<VocabularyComfortResponse>("/vocabulary/comfort", {
        wordId: current.id,
        comfortLevel,
      });
      setWords((items) =>
        items.map((word) =>
          word.id === response.word.id ? response.word : word,
        ),
      );
    } catch (requestError) {
      setWords(previousWords);
      setComfortError(requestError instanceof Error ? requestError.message : "Could not save hardness level");
    } finally {
      setSavingComfort(null);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading words...</div>;
  if (error || !current) return <div className="py-20 text-center text-red-500">{error || "No words found"}</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <button onClick={() => router.push("/vocab")} className="flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft className="w-4 h-4" /> All groups</button>
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">{group}</h1>
          <p className="mt-1 text-slate-400">{index + 1} of {words.length}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <Link
            href={`/vocab/${encodeURIComponent(group)}/quiz`}
            className="inline-flex h-11 items-center gap-2 bg-slate-950 px-4 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-primary"
          >
            <ClipboardCheck className="h-4 w-4" />
            Start Quiz
          </Link>
          <p className="font-bold">Level {current.masteryLevel}/4</p>
          <div className="flex w-full items-center gap-2 sm:w-[26rem]">
            <div className="grid min-w-0 flex-1 grid-cols-3 gap-2">
              {comfortOptions.map((option) => {
                const selected = current.comfortLevel === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => void setComfortLevel(option.value)}
                    disabled={Boolean(savingComfort)}
                    aria-pressed={selected}
                    className={`min-h-10 border px-2 text-center text-[0.68rem] font-black uppercase tracking-wide transition ${
                      selected ? option.selectedClassName : option.className
                    } ${savingComfort ? "cursor-wait" : ""}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <div className="group relative shrink-0">
              <button
                type="button"
                aria-label="Hardness level info"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-primary hover:text-primary focus:border-primary focus:text-primary focus:outline-none"
              >
                <Info className="h-4 w-4" />
              </button>
              <div className="pointer-events-none absolute right-0 top-11 z-10 w-64 border border-slate-200 bg-white p-3 text-left text-xs font-bold leading-relaxed text-slate-600 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
                Choose how hard the current flashcard&apos;s word is for you. The quiz questions are made based on your hardness level.
              </div>
            </div>
          </div>
          {comfortError && <p className="max-w-sm text-right text-xs font-bold text-red-500">{comfortError}</p>}
        </div>
      </header>

      <div className="grid grid-cols-[3rem_1fr_3rem] items-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={() => goToWord(-1)}
          className="h-12 w-12 rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-primary hover:text-primary"
          aria-label="Previous word"
        >
          <ChevronLeft className="mx-auto h-5 w-5" />
        </button>

        <div className="relative h-[28rem] w-full">
          <button
            type="button"
            onClick={() => setFlipped((value) => !value)}
            className="group relative h-full w-full text-center outline-none"
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
        </div>

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
