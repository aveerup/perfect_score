"use client";

import { useState } from "react";
import { Keyboard, X } from "lucide-react";
import { api, useApiData } from "@/lib/api";
import { TypingPassage } from "@/lib/types";
import { TypingTest } from "@/components/typing/TypingTest";

export default function TypingPage() {
  const { data: passages, setData, loading, error } = useApiData<TypingPassage[]>("/typing/essays", []);
  const [active, setActive] = useState<TypingPassage | null>(null);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading typing passages...</div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-10">
      <header><h1 className="text-5xl font-black">Typing Academy</h1><p className="text-slate-500 mt-2">Build speed and accuracy for computer-delivered IELTS.</p></header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {passages.map((passage) => (
          <article key={passage.id} className="bg-white border border-slate-100 rounded-[2rem] p-7">
            <Keyboard className="w-7 h-7 text-primary" />
            <p className="text-xs uppercase font-bold text-slate-400 mt-5">{passage.type}</p>
            <h2 className="text-xl font-black mt-2">{passage.title}</h2>
            <div className="grid grid-cols-2 gap-3 my-6">
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400">Best speed</p><p className="font-black">{passage.bestWpm ?? "--"} WPM</p></div>
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400">Accuracy</p><p className="font-black">{passage.bestAccuracy ?? "--"}%</p></div>
            </div>
            <button onClick={() => setActive(passage)} className="w-full bg-slate-900 text-white rounded-xl py-3 font-bold">Start drill</button>
          </article>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-8">
          <button onClick={() => setActive(null)} className="fixed top-6 right-6 p-3 bg-slate-100 rounded-xl"><X /></button>
          <TypingTest
            text={active.content}
            onFinish={async (result) => {
              await api.post("/typing/attempts", { essayId: active.id, ...result });
              setData((current) => current.map((item) => item.id === active.id ? {
                ...item,
                bestWpm: Math.max(item.bestWpm ?? 0, result.wpm),
                bestAccuracy: Math.max(item.bestAccuracy ?? 0, result.accuracy),
              } : item));
            }}
          />
        </div>
      )}
    </div>
  );
}
