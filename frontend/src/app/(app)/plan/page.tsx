"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { api, useApiData } from "@/lib/api";
import { StudyPlan } from "@/lib/types";

export default function StudyPlanPage() {
  const { data, setData, loading, error } = useApiData<StudyPlan | null>("/study-plan", null);

  const toggle = async (taskId: string, completed: boolean) => {
    await api.patch(`/study-plan/tasks/${taskId}?completed=${!completed}`);
    if (!data) return;
    setData({ ...data, todayTasks: data.todayTasks.map((task) => task.id === taskId ? { ...task, completed: !completed } : task) });
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading study plan...</div>;
  if (error || !data) return <div className="py-20 text-center text-red-500">{error || "Study plan unavailable"}</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{data.tier}</p>
        <h1 className="text-5xl font-black mt-2">Today&apos;s plan</h1>
        <p className="text-slate-500 mt-2">Started {data.startDate}{data.examDate ? ` · Exam ${data.examDate}` : ""}</p>
      </header>
      <div className="space-y-4">
        {data.todayTasks.map((task) => (
          <button key={task.id} onClick={() => void toggle(task.id, Boolean(task.completed))} className="w-full text-left bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-5">
            {task.completed ? <CheckCircle2 className="w-7 h-7 text-green-600" /> : <Circle className="w-7 h-7 text-slate-300" />}
            <div className="flex-1"><p className={`font-black ${task.completed ? "line-through text-slate-400" : ""}`}>{task.title}</p><p className="text-xs text-slate-400 mt-1">{task.feature}</p></div>
            <span className="flex items-center gap-1 text-sm text-slate-500"><Clock className="w-4 h-4" />{task.estimatedTime}</span>
          </button>
        ))}
        {!data.todayTasks.length && <p className="bg-white rounded-2xl p-8 text-slate-400">No tasks scheduled for today.</p>}
      </div>
    </div>
  );
}
