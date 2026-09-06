"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenCheck, CheckCircle2, Keyboard, Sparkles, Target, X, Zap } from "lucide-react";
import { api, useApiData } from "@/lib/api";
import type { TypingCourse, TypingPassage } from "@/lib/types";
import { TypingTest } from "@/components/typing/TypingTest";

const EMPTY_COURSE: TypingCourse = {
  lessons: [],
  summary: { completedLessons: 0, totalLessons: 15, progressPercent: 0, nextLessonId: null, weakKeys: [], baselineWpm: null, graduationWpm: null },
};

export default function TypingPage() {
  const { data: passages, setData: setPassages, loading: passagesLoading, error: passagesError } = useApiData<TypingPassage[]>("/typing/essays", []);
  const { data: course, loading: courseLoading, error: courseError } = useApiData<TypingCourse>("/typing/course", EMPTY_COURSE);
  const [active, setActive] = useState<TypingPassage | null>(null);

  const currentLesson = course.lessons.find((lesson) => lesson.id === course.summary.nextLessonId);
  const courseComplete = course.summary.completedLessons === course.summary.totalLessons;

  return (
    <div className="space-y-12">
      <header className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">Typing Academy</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Learn the keyboard. Then build exam speed.</h1>
        <p className="mt-4 text-base font-medium leading-7 text-slate-500">Start with guided US-QWERTY lessons, then use IELTS passages to develop speed and endurance.</p>
      </header>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 text-white sm:p-10">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950"><BookOpenCheck className="h-7 w-7" /></div>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/60">15 days · 15–25 min/day</span>
            </div>

            <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-emerald-400">Beginner course</p>
            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">Touch typing from your first home-row key to full paragraphs.</h2>
            <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/55">Follow color-coded finger guidance, build accuracy through three short drills each day, and unlock lessons as your technique improves.</p>

            {courseError ? (
              <p className="mt-7 rounded-2xl bg-rose-400/10 p-4 text-sm font-bold text-rose-200">{courseError}</p>
            ) : courseLoading ? (
              <div className="mt-8 h-14 w-52 animate-pulse rounded-2xl bg-white/10" />
            ) : (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={currentLesson ? `/typing/learn/${currentLesson.id}` : "/typing/learn"}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                >
                  {courseComplete ? "Review the course" : course.summary.completedLessons ? `Continue day ${currentLesson?.day}` : "Start day 1"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/typing/learn" className="px-3 py-3 text-sm font-black text-white/60 transition hover:text-white">View all lessons</Link>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Your progress</p>
          <div className="mt-5 flex items-end justify-between gap-4">
            <p className="text-5xl font-black tracking-tighter text-slate-950">{course.summary.progressPercent}%</p>
            <p className="pb-1 text-sm font-bold text-slate-400">{course.summary.completedLessons}/{course.summary.totalLessons} days</p>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${course.summary.progressPercent}%` }} />
          </div>
          <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
            <FeatureRow icon={<Target />} title="Accuracy gated" detail="90–92% to advance" />
            <FeatureRow icon={<Keyboard />} title="Finger guided" detail="US-QWERTY layout" />
            <FeatureRow icon={<Sparkles />} title="Personal focus" detail="Tracks difficult keys" />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">Independent practice</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">IELTS passage drills</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">Use these longer texts after your daily lesson to build exam endurance.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><BarChart3 className="h-4 w-4" /> Best scores are saved automatically</div>
        </div>

        {passagesLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-72 animate-pulse rounded-[2rem] bg-slate-100" />)}
          </div>
        ) : passagesError ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center font-bold text-rose-700">{passagesError}</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {passages.map((passage) => (
              <article key={passage.id} className="group rounded-[2rem] border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><Keyboard className="h-6 w-6" /></div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">{passage.type}</span>
                </div>
                <h3 className="mt-6 text-xl font-black leading-tight text-slate-950">{passage.title}</h3>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <ScoreBox icon={<Zap />} label="Best speed" value={passage.bestWpm == null ? "—" : `${Math.round(passage.bestWpm)} WPM`} />
                  <ScoreBox icon={<Target />} label="Accuracy" value={passage.bestAccuracy == null ? "—" : `${Math.round(passage.bestAccuracy)}%`} />
                </div>
                <button onClick={() => setActive(passage)} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition group-hover:bg-violet-600">
                  Start passage <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {active && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-white p-5 sm:p-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">IELTS passage drill</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">{active.title}</h2>
              </div>
              <button onClick={() => setActive(null)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200" aria-label="Close passage"><X className="h-5 w-5" /></button>
            </div>
            <TypingTest
              text={active.content}
              onFinish={async (result) => {
                await api.post("/typing/attempts", { essayId: active.id, ...result });
                setPassages((current) => current.map((item) => item.id === active.id ? {
                  ...item,
                  bestWpm: Math.max(item.bestWpm ?? 0, result.wpm),
                  bestAccuracy: Math.max(item.bestAccuracy ?? 0, result.accuracy),
                } : item));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureRow({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 text-emerald-600">{icon}</div>
      <div className="min-w-0 flex-1"><p className="text-sm font-black text-slate-800">{title}</p><p className="text-xs font-medium text-slate-400">{detail}</p></div>
      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    </div>
  );
}

function ScoreBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="h-4 w-4 text-slate-400">{icon}</div>
      <p className="mt-3 text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}
