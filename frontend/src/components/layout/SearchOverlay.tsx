"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search, X } from "lucide-react";
import { api } from "@/lib/api";
import { PracticeQuestionSet, VideoLecture, VocabularyWord } from "@/lib/types";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResponse {
  practice: PracticeQuestionSet[];
  lectures: VideoLecture[];
  vocabulary: VocabularyWord[];
}

interface SearchResult {
  type: string;
  title: string;
  href: string;
  category?: string;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const term = query.trim();
    if (!isOpen || !term) return;
    const timer = window.setTimeout(async () => {
      try {
        const response = await api.get<SearchResponse>(`/search?q=${encodeURIComponent(term)}`);
        setResults([
          ...response.practice.map((item) => ({ type: "Practice", title: item.title, href: `/practice/${item.id}`, category: item.skill })),
          ...response.lectures.map((item) => ({ type: "Lecture", title: item.title, href: `/lectures/${item.id}`, category: item.skill })),
          ...response.vocabulary.map((item) => ({ type: "Vocabulary", title: item.word, href: `/vocab/${encodeURIComponent(item.group)}`, category: item.group })),
        ].slice(0, 8));
      } catch {
        setResults([]);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [isOpen, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950/95">
      <div className="max-w-3xl mx-auto pt-24 px-6 relative">
        <button onClick={onClose} className="absolute top-8 right-6 text-white"><X className="w-8 h-8" /></button>
        <div className="relative">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
          <input autoFocus value={query} onChange={(event) => { setQuery(event.target.value); if (!event.target.value.trim()) setResults([]); }} className="w-full bg-transparent border-b border-white/30 text-4xl text-white outline-none py-6 pl-14" placeholder="Search content" />
        </div>
        <div className="space-y-3 mt-10">
          {results.map((result) => (
            <Link key={`${result.type}-${result.href}`} href={result.href} onClick={onClose} className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 text-white rounded-xl">
              <div><p className="text-xs uppercase font-bold text-primary">{result.type} · {result.category}</p><p className="text-lg font-bold mt-1">{result.title}</p></div>
              <ChevronRight />
            </Link>
          ))}
          {query.trim() && !results.length && <p className="text-white/50 text-center py-12">No matching content.</p>}
        </div>
      </div>
    </div>
  );
}
