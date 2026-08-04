"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Check, CheckSquare2, ChevronDown, Square } from "lucide-react";
import { MarkdownText } from "@/components/plans/MarkdownText";
import { api, useApiData } from "@/lib/api";
import { PlanPart, PlanSummary, TimelinePlan, UserPlanProgress } from "@/lib/types";

const ROWS: { key: keyof PlanPart; label: string }[] = [
  { key: "video_lectures", label: "Video Lectures" },
  { key: "practise_questions", label: "Practice Questions" },
  { key: "vocab_practise", label: "Vocab Practice" },
  { key: "mock", label: "Mock" },
];

function partLabel(key: string) {
  return key
    .split("-")
    .map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1))
    .join(" ");
}

export default function StudyPlanDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("home");
  const { data: plans } = useApiData<PlanSummary[]>("/plans", []);
  const { data: plan, loading, error } = useApiData<TimelinePlan | null>(`/plans/${slug}`, null);
  const { data: progress, setData: setProgress } = useApiData<UserPlanProgress>(
    "/plans/progress",
    { followingPlans: [], completed: {} },
  );

  const completedParts = useMemo(() => {
    if (!plan) return new Set<string>();
    return new Set(progress.completed[plan.title] ?? []);
  }, [plan, progress.completed]);

  const activePart = plan?.parts.find((part) => part.key === activeKey) ?? null;
  const completionCount = plan ? completedParts.size : 0;

  const togglePart = async (part: PlanPart) => {
    if (!plan) return;
    const nextCompleted = !completedParts.has(part.key);
    const updated = await api.patch<UserPlanProgress>(
      `/plans/${plan.slug}/parts/${part.key}`,
      { completed: nextCompleted },
    );
    setProgress(updated);
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading plan...</div>;
  }

  if (error || !plan) {
    return <div className="py-20 text-center text-red-500">{error || "Plan unavailable"}</div>;
  }

  return (
    <div className="max-w-6xl space-y-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
            {completionCount}/{plan.partCount} complete
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 lg:text-5xl">{plan.title}</h1>
        </div>

        <div className="relative w-full sm:w-80">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-12 w-full items-center justify-between border border-slate-200 bg-white px-4 text-left text-sm font-black text-slate-900 shadow-sm"
          >
            <span>Switch Plan</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-14 z-20 w-full border border-slate-200 bg-white shadow-xl">
              {plans.map((item) => (
                <Link
                  key={item.slug}
                  href={`/plan/${item.slug}`}
                  className="block border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition-colors last:border-b-0 hover:bg-slate-50 hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <nav className="flex gap-2 overflow-x-auto border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveKey("home")}
          className={`shrink-0 border-b-2 px-4 py-3 text-sm font-black transition-colors ${
            activeKey === "home"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Home
        </button>
        {plan.parts.map((part) => (
          <button
            key={part.key}
            type="button"
            onClick={() => setActiveKey(part.key)}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-black transition-colors ${
              activeKey === part.key
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {partLabel(part.key)}
          </button>
        ))}
      </nav>

      {activeKey === "home" ? (
        <section className="border border-slate-200 bg-white p-4 sm:p-6">
          <div className="space-y-3 text-sm leading-7 text-slate-600">
            <p>
              This IELTS study plan is organized into focused {plan.unit.toLowerCase()} blocks. Open a block to see
              the video lectures, practice questions, vocabulary practice, and mock schedule where applicable.
            </p>
            <p>
              Your Done ticks are stored against this plan in your account, so you can follow more than one timeline
              without mixing up progress.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {plan.parts.map((part) => {
              const isDone = completedParts.has(part.key);
              return (
                <button
                  key={part.key}
                  type="button"
                  onClick={() => setActiveKey(part.key)}
                  className="group flex min-h-28 w-full items-center justify-between gap-4 bg-slate-900 px-5 py-5 text-left text-white transition-colors hover:bg-primary"
                >
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-white/60">
                      {partLabel(part.key)}
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">{part.title}</h2>
                  </div>
                  <span className="flex items-center gap-2 text-sm font-black">
                    {isDone ? <CheckSquare2 className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                    Done
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : activePart ? (
        <section className="border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-sky-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{partLabel(activePart.key)}</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{activePart.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => void togglePart(activePart)}
              className="flex h-11 items-center justify-center gap-2 border border-slate-900 bg-white px-4 text-sm font-black text-slate-950 transition-colors hover:bg-slate-950 hover:text-white"
            >
              {completedParts.has(activePart.key) ? <CheckSquare2 className="h-5 w-5" /> : <Square className="h-5 w-5" />}
              Done
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <tbody>
                {ROWS.filter((row) => Boolean(activePart[row.key])).map((row) => (
                  <tr key={row.key} className="border-b border-slate-200 last:border-b-0">
                    <th className="w-56 bg-slate-50 px-5 py-5 align-top text-sm font-black uppercase tracking-[0.14em] text-slate-500">
                      {row.label}
                    </th>
                    <td className="px-5 py-5">
                      <MarkdownText value={String(activePart[row.key])} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {completedParts.has(activePart.key) && (
            <div className="flex items-center gap-2 border-t border-slate-200 px-5 py-4 text-sm font-bold text-green-700">
              <Check className="h-4 w-4" />
              Saved in your completed plan progress.
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
