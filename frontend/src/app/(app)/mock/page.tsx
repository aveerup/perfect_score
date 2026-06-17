"use client";

import React from "react";
import { useApiData } from "@/lib/api";
import { MockTest } from "@/lib/types";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight, BarChart3, Clock } from "lucide-react";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

export default function MockExamPage() {
  const { data: mockTests, loading, error } = useApiData<MockTest[]>("/mock", []);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading mock tests...</div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Simulation Center</p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
             Realistic <span className="text-primary italic">Mocks.</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium">Full-length exams to gauge your true Band score.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
          {["All Mocks", "Academic", "General"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                tab === "All Mocks"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* MOCK GRID */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {mockTests.map((test) => {
          const isAttempted = test.status === "attempted";
          return (
            <motion.div
              key={test.id}
              variants={cardVariants}
              className={`group rounded-[2.5rem] border p-10 space-y-8 transition-all duration-300 card-hover-lift ${
                isAttempted 
                  ? "bg-white border-slate-100 shadow-sm shadow-slate-200/40" 
                  : "bg-slate-50/50 border-slate-100 overflow-hidden"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      isAttempted ? "bg-primary/5 text-primary" : "bg-slate-100 text-slate-400"
                    }`}>
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Simulation #{test.number}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                        {test.dateTaken ?? "Simulation Ready"}
                      </p>
                    </div>
                  </div>
                </div>
                {isAttempted && (
                   <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Completed</div>
                )}
              </div>

              {test.scores ? (
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(test.scores).map(([key, val]) => (
                    <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-1 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{key}</span>
                      <span className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors">{(val as number).toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[104px] bg-white border border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-2">
                   <Clock className="w-5 h-5 text-slate-200" />
                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-black">2h 45m Duration</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                 <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-[9px] font-black text-slate-500 rounded-full uppercase tracking-widest">Academic</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">v2.4.0</span>
                 </div>
                 {isAttempted ? (
                    <Link
                      href={`/mock/${test.id}`}
                      className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-xl hover:shadow-slate-900/40 transition-all flex items-center gap-2"
                    >
                      Analysis <ArrowUpRight className="w-4 h-4" />
                    </Link>
                 ) : (
                    <Link href={`/mock/${test.id}`} className="px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-xl hover:shadow-primary/40 transition-all">
                       Start Exam
                    </Link>
                 )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
