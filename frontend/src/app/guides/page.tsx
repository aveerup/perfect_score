"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, BookOpen, PenTool, Mic, Headphones, Star } from "lucide-react";

const fadeUp: any = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
const stagger: any = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const VP = { once: true, amount: 0.1 };

const guides = [
  {
    icon: Headphones, skill: "Listening", badge: "Core Skill",
    title: "The IELTS Listening Blueprint: How to Score Band 8+",
    desc: "Most candidates lose marks not because they can't understand English — but because they don't know how the section is structured to trick you. This guide reveals the 7 most common trap types and exactly how to avoid them.",
    time: "15 min read", level: "Intermediate", tags: ["Section 4", "Multiple Choice", "Note Completion"],
    color: "bg-blue-50", accent: "text-blue-600", border: "border-blue-100",
  },
  {
    icon: BookOpen, skill: "Reading", badge: "Most Popular",
    title: "True / False / Not Given: The Definitive Answering System",
    desc: "TFNG questions are the most misunderstood in the entire IELTS test. This guide walks you through a 4-step elimination framework that eliminates ambiguity and gets you to the right answer every time — even under pressure.",
    time: "20 min read", level: "Advanced", tags: ["TFNG", "YNNG", "Skimming"],
    color: "bg-grape-50", accent: "text-grape-600", border: "border-grape-100",
  },
  {
    icon: PenTool, skill: "Writing", badge: "High Impact",
    title: "Task 2 Essay Structure That Examiners Award Band 8 To",
    desc: "Forget the 5-paragraph essay formula you learned in school. IELTS examiners are looking for something very specific. This guide breaks down the exact structure, paragraph functions, and cohesion devices used in Band 8+ model answers.",
    time: "25 min read", level: "Intermediate", tags: ["Task 2", "Opinion Essay", "Discussion"],
    color: "bg-amber-50", accent: "text-amber-600", border: "border-amber-100",
  },
  {
    icon: Mic, skill: "Speaking", badge: "Quick Win",
    title: "Part 2 Long Turn: Never Run Out of Things to Say",
    desc: "The 2-minute speaking task is where most candidates freeze. This guide gives you a universal storytelling framework, 10 filler connectors that buy you thinking time, and a method to extend any topic for a full 2 minutes with ease.",
    time: "12 min read", level: "Beginner", tags: ["Part 2", "Cue Card", "Fluency"],
    color: "bg-rose-50", accent: "text-rose-600", border: "border-rose-100",
  },
  {
    icon: PenTool, skill: "Writing", badge: "Task 1",
    title: "Task 1 Academic: How to Describe Any Graph or Chart",
    desc: "Whether it's a line graph, bar chart, pie chart, or process diagram — this guide gives you a universal description framework, the best data selection strategy, and the specific language features that push Task 1 scores into Band 7+.",
    time: "18 min read", level: "Intermediate", tags: ["Task 1", "Data Description", "Academic"],
    color: "bg-purple-50", accent: "text-purple-600", border: "border-purple-100",
  },
  {
    icon: BookOpen, skill: "Vocabulary", badge: "SRS Method",
    title: "Spaced Repetition for IELTS: Learn 500 Words in 30 Days",
    desc: "Raw memorisation doesn't work. Spaced repetition science does. This guide explains how Perfect Score's Lexical Hub is designed, how to get the most out of each session, and a 30-day vocabulary plan built around your exam date.",
    time: "10 min read", level: "Beginner", tags: ["Vocabulary", "SRS", "Memory"],
    color: "bg-green-50", accent: "text-green-600", border: "border-green-100",
  },
];

const levelColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative w-full pt-28 pb-20 md:pt-36 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:48px_48px] opacity-30 pointer-events-none" />
        <motion.div animate={{ x: [0, 30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl space-y-6">
            <motion.p variants={fadeUp} className="text-accent font-extrabold text-[11px] uppercase tracking-[0.4em]">Free Resources</motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-heading text-slate-900 leading-[0.9] tracking-tight">
              Study Guides &<br /><span className="font-serif italic font-normal text-accent">Strategy Playbooks.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
              Expert-written guides covering every IELTS skill. Free for every candidate — no sign-up required.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#7c2dbb", "#6b21a8", "#581c87"].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-black" style={{ background: c }}>
                    {["A","B","C"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-400">Read by 12,000+ candidates this month</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Guides grid */}
      <section className="w-full pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={VP} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((g, i) => {
              const Icon = g.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className={`bg-white rounded-3xl border ${g.border} shadow-sm overflow-hidden group hover:shadow-lg hover:shadow-slate-200/60 transition-all flex flex-col`}
                >
                  {/* Card top */}
                  <div className={`${g.color} p-8 flex items-start justify-between`}>
                    <div className={`w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center ${g.accent} shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${g.accent}`}>{g.badge}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${levelColors[g.level]}`}>{g.level}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8 flex flex-col flex-1 gap-4">
                    <div>
                      <p className={`text-[10px] font-extrabold uppercase tracking-widest ${g.accent} mb-2`}>{g.skill}</p>
                      <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-accent transition-colors">{g.title}</h3>
                    </div>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed flex-1">{g.desc}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {g.tags.map((tag, j) => (
                        <span key={j} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">{tag}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{g.time}</span>
                      </div>
                      <Link href="/login" className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest ${g.accent} hover:gap-2.5 transition-all`}>
                        Read Guide <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20 bg-slate-900">
        <motion.div initial="hidden" whileInView="show" viewport={VP} variants={stagger} className="max-w-3xl mx-auto px-6 text-center">
          <motion.div variants={fadeUp} className="flex justify-center mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Go beyond the guides.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 font-medium mb-8">
            These guides are just the beginning. Perfect Score's adaptive platform puts the strategy into practice with 5,000+ drills, AI feedback, and a personalised study plan.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link href="/onboarding">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-accent text-white hover:bg-grape-500 font-bold text-sm gap-2 shadow-xl shadow-accent/30">
                Start Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
