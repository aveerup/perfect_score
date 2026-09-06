"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useApiData } from "@/lib/api";
import type { TypingCourse } from "@/lib/types";
import { TypingLessonPlayer } from "@/components/typing/TypingLessonPlayer";

export default function TypingLessonPage() {
  const params = useParams<{ lessonId: string }>();
  const { data: course, loading, error } = useApiData<TypingCourse>("/typing/course", {
    lessons: [],
    summary: { completedLessons: 0, totalLessons: 15, progressPercent: 0, nextLessonId: null, weakKeys: [], baselineWpm: null, graduationWpm: null },
  });

  if (loading) return <div className="py-24 text-center text-sm font-black uppercase tracking-[0.2em] text-slate-400">Preparing your lesson…</div>;
  if (error) return <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-10 text-center font-bold text-rose-700">{error}</div>;

  const lessonIndex = course.lessons.findIndex((lesson) => lesson.id === params.lessonId);
  const lesson = course.lessons[lessonIndex];

  if (!lesson) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-black text-slate-950">Lesson not found</h1>
        <Link href="/typing/learn" className="mt-5 inline-flex items-center gap-2 font-black text-emerald-600"><ArrowLeft className="h-4 w-4" /> Back to the course</Link>
      </div>
    );
  }

  if (lesson.locked) {
    return (
      <div className="mx-auto max-w-xl rounded-[2.5rem] border border-slate-200 bg-white p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><LockKeyhole className="h-7 w-7" /></div>
        <h1 className="mt-6 text-3xl font-black text-slate-950">This lesson is still locked</h1>
        <p className="mt-3 font-medium text-slate-500">Complete the previous day’s accuracy goal first.</p>
        <Link href="/typing/learn" className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white"><ArrowLeft className="h-4 w-4" /> Course overview</Link>
      </div>
    );
  }

  const personalKeys = course.summary.weakKeys
    .map(({ key }) => key)
    .filter((key) => key !== "Space" && key.length === 1)
    .slice(0, 5);
  const repairText = personalKeys.map((key) => `${key}${key}${key} ${key} ${key}`).join(" ");
  const reversedRepairText = [...personalKeys].reverse().map((key) => `${key} ${key}${key} ${key}`).join(" ");
  const pairedRepairText = personalKeys.map((key, index) => {
    const partner = personalKeys[(index + 1) % personalKeys.length];
    return `${key}${partner} ${partner}${key} ${key}${partner}`;
  }).join(" ");
  const lessonForPlayer = lesson.day === 12 && personalKeys.length > 0
    ? {
        ...lesson,
        keys: Array.from(new Set([...lesson.keys, ...personalKeys.map((key) => key.toLowerCase())])),
        exercises: lesson.exercises.map((exercise, index) => index === 0 ? {
          ...exercise,
          title: "Your personal focus keys",
          text: repairText,
          rounds: [repairText, reversedRepairText, `${pairedRepairText} ${repairText}`],
          guidance: `These are the keys you have missed most often: ${personalKeys.join(", ")}. Move slowly and deliberately.`,
        } : exercise),
      }
    : lesson;

  return <TypingLessonPlayer lesson={lessonForPlayer} nextLessonId={course.lessons[lessonIndex + 1]?.id ?? null} baselineWpm={course.summary.baselineWpm} />;
}
