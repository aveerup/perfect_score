"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, CheckCircle2, ChevronDown } from "lucide-react";
import { useApiData } from "@/lib/api";
import { PlanSummary } from "@/lib/types";

export default function StudyPlanCatalogPage() {
  const [open, setOpen] = useState(false);
  const { data: plans, loading, error } = useApiData<PlanSummary[]>("/plans", []);

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading study plans...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl space-y-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">IELTS timelines</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 lg:text-5xl">Study Plans</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Choose the timeline that matches your exam date, then tick each day, week, or month as you finish it.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-12 w-full items-center justify-between border border-slate-200 bg-white px-4 text-left text-sm font-black text-slate-900 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Select Plan
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute right-0 top-14 z-20 w-full border border-slate-200 bg-white shadow-xl">
              {plans.map((plan) => (
                <Link
                  key={plan.slug}
                  href={`/plan/${plan.slug}`}
                  className="block border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition-colors last:border-b-0 hover:bg-slate-50 hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  {plan.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <Link
            key={plan.slug}
            href={`/plan/${plan.slug}`}
            className="group border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center bg-primary text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                {plan.partCount} {plan.unit}{plan.partCount === 1 ? "" : "s"}
              </span>
            </div>
            <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-950 group-hover:text-primary">
              {plan.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Open the timeline, review each structured plan table, and save completion progress to your account.
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
