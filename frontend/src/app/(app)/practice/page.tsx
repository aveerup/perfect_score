"use client";

import React, { useState } from "react";
import { Skill, Difficulty, PracticeQuestionSet } from "@/lib/types";
import { useApiData } from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CheckCircle2, ArrowUpRight, Search } from "lucide-react";

const skills: Skill[] = ["L", "R", "W", "S"];
const skillNames: Record<Skill, string> = {
  L: "Listening", R: "Reading", W: "Writing", S: "Speaking",
};
const skillBengali: Record<Skill, string> = {
  L: "শ্রবণ", R: "পাঠন", W: "লিখন", S: "কথন",
};
const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

export default function PracticeHomePage() {
  const [activeSkill, setActiveSkill] = useState<Skill>("R");
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | "All">("All");
  const { data: practiceQuestions, loading, error } = useApiData<PracticeQuestionSet[]>("/practice", []);

  const filteredQuestions = practiceQuestions.filter(q => {
    const skillMatch = q.skill === activeSkill;
    const diffMatch = activeDifficulty === "All" || q.difficulty === activeDifficulty;
    return skillMatch && diffMatch;
  });

  if (loading) return <div className="py-20 text-center text-slate-400">Loading practice sets...</div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question Bank</p>
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
           Practice <span className="text-primary italic">Sessions.</span>
        </h2>
        <p className="text-slate-500 text-lg font-medium">Sharpen each skill with targeted, academic-grade drill sets.</p>
      </motion.div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 w-fit">
          {skills.map((skill) => (
            <button
              key={skill}
              onClick={() => setActiveSkill(skill)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeSkill === skill
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {skillNames[skill]} <span className="ml-1 text-[8px] opacity-40">{skillBengali[skill]}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Difficulty</span>
          <div className="flex gap-2">
            {(["All", ...difficulties] as (Difficulty | "All")[]).map((d) => (
              <button
                key={d}
                onClick={() => setActiveDifficulty(d)}
                className={`px-4 py-1.5 text-[10px] font-black border rounded-full uppercase tracking-widest transition-all ${
                  activeDifficulty === d
                    ? "bg-primary text-white border-primary"
                    : "border-slate-200 text-slate-400 hover:border-primary hover:text-primary bg-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Question Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeSkill}-${activeDifficulty}`}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => (
              <motion.div key={q.id} variants={itemVariants}>
                <Link
                  href={`/practice/${q.id}`}
                  className="group block bg-white rounded-[2rem] border border-slate-100 p-8 space-y-6 card-hover-lift shadow-sm shadow-slate-200/40 relative overflow-hidden h-full"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-50 group-hover:bg-primary transition-colors" />
                  
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-slate-50 rounded-2xl text-primary font-black group-hover:bg-primary/10 transition-colors">
                      {activeSkill}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        q.difficulty === "Hard" ? "bg-red-50 text-red-500" :
                        q.difficulty === "Medium" ? "bg-orange-50 text-orange-500" :
                        "bg-green-50 text-green-500"
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        BAND {q.bandRange}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
                      {q.title}
                    </h3>
                    <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">{q.subType}</p>
                    <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                      Real-world IELTS scenarios focusing on {q.subType.toLowerCase()} to build precision.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    {q.attempted ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={3} />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                          Score: {q.score}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unattempted</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs font-black text-slate-900 group-hover:text-primary transition-all">
                      {q.attempted ? "REVIEW" : "START"} <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants} className="col-span-full bg-white rounded-[2rem] p-20 border border-slate-100 border-dashed text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight text-center">No matching sessions</p>
                <p className="text-xs font-medium text-slate-400 text-center">Try adjusting your difficulty or skill filters.</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
