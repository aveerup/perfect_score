"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Video, PenTool, BookOpen, ClipboardCheck, Calendar,
  Keyboard, BrainCircuit, BarChart3, ArrowRight, CheckCircle2,
  Mic, Target, Zap, MessageSquare
} from "lucide-react";

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: any = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const VP = { once: true, amount: 0.15 };

const features = [
  {
    icon: Video, title: "Masterclasses", badge: "Video Content",
    desc: "Expert-led video lessons covering every IELTS skill. Our instructors break down examiner expectations, scoring criteria, and proven strategies you won't find in textbooks.",
    points: ["50+ hours of premium video", "Examiner-led walkthroughs", "Subtitled in English & Bengali", "Download for offline viewing"],
    color: "bg-blue-50",
    accent: "text-blue-600",
  },
  {
    icon: ClipboardCheck, title: "Full Mock Tests", badge: "Exam Simulation",
    desc: "Replicate the official IELTS testing environment down to the interface, timing, and question types. Build the mental stamina and confidence to perform under pressure.",
    points: ["200+ full mock papers", "Official-format interface", "Auto-graded Listening & Reading", "AI-scored Writing & Speaking"],
    color: "bg-grape-50",
    accent: "text-grape-600",
  },
  {
    icon: BookOpen, title: "Lexical Hub", badge: "Vocabulary SRS",
    desc: "Powered by Spaced Repetition Science, our vocabulary engine surfaces the right words at the right moment — locking Band 8+ academic vocabulary into your long-term memory.",
    points: ["10,000+ academic words", "Contextual example sentences", "Personalized repetition curves", "Progress tracked by domain"],
    color: "bg-amber-50",
    accent: "text-amber-600",
  },
  {
    icon: PenTool, title: "Writing Lab", badge: "Active Practice",
    desc: "Submit essays, task 1 reports, and get back detailed AI feedback on task achievement, coherence, lexical resource, and grammatical range — in under 30 seconds.",
    points: ["Task 1 & Task 2 practice", "AI band score estimate", "Model answer comparisons", "Targeted improvement drills"],
    color: "bg-purple-50",
    accent: "text-purple-600",
  },
  {
    icon: Mic, title: "Speaking Coach", badge: "AI Speaking",
    desc: "Practice speaking anytime without a partner. Our AI listens, evaluates fluency, pronunciation, and coherence, and gives you a detailed band breakdown and improvement tips.",
    points: ["Real IELTS speaking questions", "Pronunciation analysis", "Fluency & coherence scoring", "Record & review sessions"],
    color: "bg-rose-50",
    accent: "text-rose-600",
  },
  {
    icon: Calendar, title: "Adaptive Study Plan", badge: "Smart Planning",
    desc: "Your personal study calendar, rebuilt every day. Based on your current band, target date, and weakest skills — so you always know exactly what to study next.",
    points: ["Daily task generation", "Deadline-aware scheduling", "Skill gap prioritisation", "Streak & habit tracking"],
    color: "bg-green-50",
    accent: "text-green-600",
  },
  {
    icon: Keyboard, title: "Typing Academy", badge: "Exam Readiness",
    desc: "Most candidates lose marks in the computer-based IELTS Writing section not from language ability — but from slow typing. Our drills get your WPM up before exam day.",
    points: ["Academic vocabulary drills", "Speed & accuracy tracking", "IELTS-specific passages", "Progress leaderboard"],
    color: "bg-indigo-50",
    accent: "text-indigo-600",
  },
  {
    icon: BarChart3, title: "Analytics Dashboard", badge: "Performance Data",
    desc: "See exactly where you stand across all four skills. Track improvement over time, identify your weakest question types, and get data-driven recommendations.",
    points: ["Skill-level band tracking", "Question type breakdown", "Session history & trends", "Predicted exam score"],
    color: "bg-orange-50",
    accent: "text-orange-600",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative w-full pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:48px_48px] opacity-30 pointer-events-none" />
        <motion.div
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/8 blur-[120px] rounded-full pointer-events-none"
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl space-y-6">
            <motion.p variants={fadeUp} className="text-accent font-extrabold text-[11px] uppercase tracking-[0.4em]">Full Platform</motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-heading text-slate-900 leading-[0.9] tracking-tight">
              Everything you need<br />
              <span className="font-serif italic font-normal text-accent">to reach Band 9.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
              8 purpose-built modules. Every one designed around how the IELTS is actually marked — not how most coaches think it is.
            </motion.p>
            <motion.div variants={fadeUp} className="flex gap-4 flex-wrap">
              <Link href="/onboarding">
                <Button size="lg" className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-bold text-sm gap-2 hover:bg-accent transition-all">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-slate-200 text-slate-700 font-bold text-sm">
                  View Pricing
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="w-full pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isFlipped = i % 2 !== 0;
            return (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="show"
                viewport={VP}
                variants={fadeUp}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl border border-slate-100 shadow-sm p-10 lg:p-14 ${isFlipped ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={`space-y-5 ${isFlipped ? "lg:order-2" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${f.accent}`} />
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${f.accent}`}>{f.badge}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{f.title}</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                  <ul className="space-y-2">
                    {f.points.map((pt, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${isFlipped ? "lg:order-1" : ""}`}>
                  <div className={`aspect-video rounded-2xl ${f.color} flex items-center justify-center`}>
                    <Icon className={`w-24 h-24 ${f.accent} opacity-20`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20 bg-slate-900">
        <motion.div
          initial="hidden" whileInView="show" viewport={VP} variants={stagger}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            All 8 modules. One platform.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 font-medium mb-8">
            Free plan includes Masterclasses, Practice Drills, and Vocabulary. Upgrade for the full suite.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link href="/onboarding">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-accent text-white hover:bg-grape-500 font-bold text-sm gap-2 shadow-xl shadow-accent/30">
                Start Free Today <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
