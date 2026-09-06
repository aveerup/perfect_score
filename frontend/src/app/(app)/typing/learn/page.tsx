"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock3, Keyboard, LockKeyhole, RotateCcw, Target } from "lucide-react";
import { useApiData } from "@/lib/api";
import type { TypingCourse } from "@/lib/types";

export default function TypingCoursePage() {
  const { data: course, loading, error } = useApiData<TypingCourse>("/typing/course", {
    lessons: [],
    summary: { completedLessons: 0, totalLessons: 15, progressPercent: 0, nextLessonId: null, weakKeys: [], baselineWpm: null, graduationWpm: null },
  });

  if (loading) return <CourseLoading />;
  if (error) return <CourseError message={error} />;

  const currentLesson = course.lessons.find((lesson) => lesson.id === course.summary.nextLessonId);
  const graduated = course.summary.completedLessons === course.summary.totalLessons;

  return (
    <div className="space-y-8">
      <Link href="/typing" className="inline-flex items-center gap-2 text-sm font-black text-slate-500 transition hover:text-slate-950">
        <ArrowLeft className="h-4 w-4" /> Typing Academy
      </Link>

      <section className="overflow-hidden rounded-[2.5rem] bg-slate-950 text-white">
        <div className="grid lg:grid-cols-[1fr_340px]">
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Keyboard className="h-7 w-7" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">15-day guided course</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              {graduated ? "You’ve learned the keyboard." : "Build touch-typing habits, one day at a time."}
            </h1>
            <p className="mt-4 max-w-xl font-medium leading-7 text-white/60">
              Short US-QWERTY lessons teach finger placement, accuracy, rhythm, and the confidence to type without looking down.
            </p>
            {currentLesson && (
              <Link href={`/typing/learn/${currentLesson.id}`} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300">
                {currentLesson.progress.attemptCount > 0 ? "Continue" : "Start"} day {currentLesson.day} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {graduated && (
              <Link href="/typing" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300">
                Practice IELTS passages <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="border-t border-white/10 bg-white/5 p-8 lg:border-l lg:border-t-0 lg:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40">Course progress</p>
            <p className="mt-4 text-6xl font-black tracking-tighter">{course.summary.progressPercent}%</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${course.summary.progressPercent}%` }} />
            </div>
            <p className="mt-3 text-sm font-bold text-white/50">{course.summary.completedLessons} of {course.summary.totalLessons} lessons complete</p>
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Practice rule</p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/70">Reach the lesson’s accuracy goal to unlock the next day. Speed is guidance, not a gate.</p>
            </div>
          </div>
        </div>
      </section>

      {course.summary.weakKeys.length > 0 && (
        <section className="flex flex-col gap-4 rounded-[2rem] border border-amber-200 bg-amber-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Your focus keys</p>
            <p className="mt-1 text-sm font-medium text-amber-800/70">Slow down when these appear and make a deliberate finger movement.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {course.summary.weakKeys.map(({ key, errors }) => (
              <span key={key} className="rounded-xl border border-amber-200 bg-white px-4 py-2 font-mono text-sm font-black text-amber-900">
                {key} <span className="text-amber-500">×{errors}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {course.summary.baselineWpm !== null && course.summary.graduationWpm !== null && (
        <section className="grid gap-4 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 sm:grid-cols-[1fr_auto_auto] sm:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Course improvement</p>
            <p className="mt-1 text-sm font-medium text-emerald-800/70">Your first-day baseline compared with your best graduation result.</p>
          </div>
          <div><p className="text-[9px] font-black uppercase tracking-widest text-emerald-600/60">Day 1</p><p className="text-2xl font-black text-emerald-950">{Math.round(course.summary.baselineWpm)} WPM</p></div>
          <div><p className="text-[9px] font-black uppercase tracking-widest text-emerald-600/60">Day 15</p><p className="text-2xl font-black text-emerald-950">{Math.round(course.summary.graduationWpm)} WPM</p></div>
        </section>
      )}

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Your path</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">All 15 lessons</h2>
          </div>
          <p className="hidden text-sm font-medium text-slate-400 sm:block">15–25 minutes per day</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {course.lessons.map((lesson) => (
            <article key={lesson.id} className={`relative overflow-hidden rounded-[2rem] border p-6 transition ${lesson.locked ? "border-slate-100 bg-slate-50" : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"}`}>
              <div className="flex items-start justify-between gap-4">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black ${lesson.progress.completed ? "bg-emerald-500 text-white" : lesson.locked ? "bg-slate-200 text-slate-400" : "bg-slate-950 text-white"}`}>
                  {lesson.progress.completed ? <Check className="h-5 w-5" /> : lesson.locked ? <LockKeyhole className="h-4 w-4" /> : lesson.day}
                </span>
                <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] ${lesson.progress.completed ? "bg-emerald-50 text-emerald-600" : lesson.locked ? "bg-slate-200 text-slate-400" : "bg-amber-50 text-amber-600"}`}>
                  {lesson.progress.completed ? "Completed" : lesson.locked ? "Locked" : "Available"}
                </span>
              </div>

              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Day {lesson.day}</p>
              <h3 className={`mt-2 text-xl font-black tracking-tight ${lesson.locked ? "text-slate-400" : "text-slate-950"}`}>{lesson.title}</h3>
              <p className="mt-2 text-sm font-medium text-slate-400">{lesson.focus}</p>

              <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-5 text-xs font-bold text-slate-400">
                <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {lesson.durationMinutes} min</span>
                <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> {lesson.targetAccuracy}%</span>
                {lesson.progress.attemptCount > 0 && <span className="inline-flex items-center gap-1.5"><RotateCcw className="h-3.5 w-3.5" /> {lesson.progress.attemptCount}</span>}
              </div>

              {!lesson.locked && (
                <Link href={`/typing/learn/${lesson.id}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-emerald-600">
                  {lesson.progress.completed ? "Practice again" : lesson.progress.attemptCount > 0 ? "Try again" : "Start lesson"} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function CourseLoading() {
  return <div className="py-24 text-center text-sm font-black uppercase tracking-[0.2em] text-slate-400">Loading your course…</div>;
}

function CourseError({ message }: { message: string }) {
  return (
    <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-10 text-center">
      <p className="font-black text-rose-700">Could not load the typing course</p>
      <p className="mt-2 text-sm font-medium text-rose-600/70">{message}</p>
    </div>
  );
}
