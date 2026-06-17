"use client";

import Link from "next/link";
import { Clock, Flame, Target, TrendingUp } from "lucide-react";
import { useApiData } from "@/lib/api";
import { AuthProfile, SessionEntry, VocabularyCategorySummary } from "@/lib/types";

interface DashboardResponse {
  user: AuthProfile;
  currentBand: number;
  targetBand: number;
  streak: number;
  practiceTimeHours: number;
  skillProficiency: { skill: string; current: number; sub: string }[];
  recentSessions: SessionEntry[];
  vocabularyMastery: VocabularyCategorySummary[];
}

export default function DashboardPage() {
  const { data, loading, error } = useApiData<DashboardResponse | null>("/dashboard", null);
  if (loading) return <div className="py-20 text-center text-slate-400">Loading dashboard...</div>;
  if (error || !data) return <div className="py-20 text-center text-red-500">{error || "Dashboard unavailable"}</div>;

  const stats = [
    { label: "Current Band", value: data.currentBand.toFixed(1), icon: Target },
    { label: "Target Band", value: data.targetBand.toFixed(1), icon: TrendingUp },
    { label: "Study Streak", value: `${data.streak} days`, icon: Flame },
    { label: "Practice Time", value: `${data.practiceTimeHours}h`, icon: Clock },
  ];

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Your learning dashboard</p>
        <h1 className="text-5xl font-black mt-3">Welcome back, {data.user.name}.</h1>
        <p className="text-lg text-slate-500 mt-3">Your target is Band {data.targetBand.toFixed(1)}.</p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-slate-100 rounded-[2rem] p-7">
            <Icon className="w-6 h-6 text-primary" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-5">{label}</p>
            <p className="text-3xl font-black mt-1">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8">
          <h2 className="text-2xl font-black">Skill progress</h2>
          <div className="space-y-5 mt-6">
            {data.skillProficiency.map((item) => (
              <div key={item.skill}>
                <div className="flex justify-between font-bold"><span>{item.skill}</span><span>{item.current.toFixed(1)}</span></div>
                <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(item.current / 9) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black">Recent sessions</h2>
            <Link href="/practice" className="text-sm font-bold text-primary">Practice now</Link>
          </div>
          <div className="space-y-3 mt-6">
            {data.recentSessions.length ? data.recentSessions.map((session) => (
              <div key={session.id} className="flex justify-between bg-slate-50 rounded-xl p-4">
                <div><p className="font-bold">{session.type}</p><p className="text-xs text-slate-400">{new Date(session.date).toLocaleDateString()}</p></div>
                <span className="font-bold text-slate-500">{session.duration}</span>
              </div>
            )) : <p className="text-slate-400">Complete a practice set to start your history.</p>}
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-100 rounded-[2rem] p-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black">Vocabulary mastery</h2>
          <Link href="/vocab" className="text-sm font-bold text-primary">Review words</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          {data.vocabularyMastery.slice(0, 5).map((item) => (
            <div key={item.category} className="bg-slate-50 rounded-xl p-4">
              <p className="font-bold text-sm">{item.category}</p>
              <p className="text-2xl font-black text-primary mt-2">{item.mastery}%</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
