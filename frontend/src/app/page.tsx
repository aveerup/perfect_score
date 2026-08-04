"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Video, PenTool, BookOpen,
  ArrowRight, Sparkles, Zap,
  TrendingUp, Trophy, Play, Star,
  BrainCircuit, BarChart3, Users
} from "lucide-react";

/* ─── animation variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const VP = { once: true, amount: 0.15 };

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden selection:bg-accent/20">
      <Navbar />

      {/* ══════════════════ HERO ══════════════════ */}
      <section ref={heroRef} className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-950 dark:bg-slate-950">
        {/* Animated Background Grid (Cyberpunk Style) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
        
        {/* Neon Glow Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-grape-600/20 blur-[140px] rounded-full pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Text Content */}
            <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-10 text-center lg:text-left">
              {/* Pulsing Badge */}
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                </span>
                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white/80">নেক্সট-জেন IELTS ইঞ্জিন ২.০</span>
              </motion.div>

              {/* Futuristic Headline */}
              <motion.h1 
                variants={fadeUp} 
                className="text-6xl md:text-7xl lg:text-[90px] font-heading text-white leading-[0.85] tracking-tight"
              >
                পারফেক্ট স্কোর<br />
                <span className="text-gradient font-serif italic font-normal tracking-wide">আয়ত্ত করুন</span>
              </motion.h1>

              {/* Subtext */}
              <motion.p variants={fadeUp} className="text-xl text-slate-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                আন্দাজনির্ভর প্রস্তুতি বাদ দিন। বাংলাদেশের সবচেয়ে উন্নত AI ইঞ্জিন দিয়ে প্রথম চেষ্টাতেই আপনার <span className="text-white font-black underline decoration-accent/50 underline-offset-8 transition-all hover:decoration-accent">Band 8.5+</span> নিশ্চিত করার প্রস্তুতি নিন।
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/onboarding" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-grape-600 text-white font-black text-lg gap-3 hover:bg-grape-500 transition-all btn-glow border-0 active:scale-[0.98]">
                    ফ্রি প্রস্তুতি শুরু করুন <Zap className="w-5 h-5 fill-current" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-16 px-10 rounded-2xl border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-all font-black text-lg gap-3 active:scale-[0.98]"
                >
                  <Play className="w-5 h-5 fill-current" /> যেভাবে কাজ করে
                </Button>
              </motion.div>

              {/* Social Proof */}
              <motion.div variants={fadeUp} className="flex flex-col items-center lg:items-start gap-6 pt-6">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
                  ].map((src, i) => (
                    <motion.img 
                      key={i} 
                      whileHover={{ y: -5, zIndex: 10 }}
                      src={src} 
                      className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover shadow-2xl" 
                      alt="শিক্ষার্থী" 
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center lg:justify-start gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 shadow-sm" />)}
                  </div>
                  <p className="text-sm font-bold text-slate-400 tracking-wide">৪৫,০০০+ পরীক্ষার্থীর আস্থা · ৯৪% সফলতার হার</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Hero Image / Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Floating Dashboard Mockup */}
              <div className="relative z-10 rounded-[2.5rem] border border-white/10 bg-slate-900/50 backdrop-blur-3xl p-4 shadow-[0_0_100px_rgba(124,45,187,0.2)]">
                <div className="overflow-hidden rounded-[2rem] border border-white/5 aspect-[4/3]">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop" 
                    alt="পারফেক্ট স্কোর ড্যাশবোর্ড" 
                    className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                
                {/* Floating "Success Alert" UI Element */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-border flex items-center gap-4 hidden xl:flex"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">লক্ষ্য অর্জিত</p>
                    <p className="text-xl font-black text-foreground italic">Band 8.5</p>
                  </div>
                </motion.div>

                {/* Floating "Practice Active" UI Element */}
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-10 -left-10 bg-accent p-6 rounded-3xl shadow-2xl flex items-center gap-4 hidden xl:flex"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="text-[10px] uppercase tracking-widest font-black opacity-80">AI অ্যানালাইসিস</p>
                    <p className="text-lg font-black">লাইভ স্কোর প্রেডিকশন</p>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -inset-20 bg-accent/20 blur-[120px] rounded-full -z-10 animate-pulse" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════ STATS TICKER ══════════════════ */}
      <section className="w-full py-14 border-y border-border bg-background dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VP}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-border"
          >
            {[
              { label: "সক্রিয় শিক্ষার্থী", val: "৪৫K+", icon: Users },
              { label: "Band 8.0 সাফল্য", val: "৯৪%", icon: TrendingUp },
              { label: "প্র্যাকটিস ড্রিল", val: "৫,০০০+", icon: BrainCircuit },
              { label: "অফিশিয়াল মক", val: "২০০+", icon: BarChart3 },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-center gap-4 md:px-10 first:pl-0 last:pr-0">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-3xl font-black text-foreground tracking-tighter leading-none">{s.val}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mt-1">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="w-full py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VP}
            variants={stagger}
            className="mb-16 max-w-2xl"
          >
            <motion.p variants={fadeUp} className="text-accent font-extrabold text-[11px] uppercase tracking-[0.4em] mb-4">The Engine</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
              কার্যকরী বিজ্ঞানভিত্তিক{" "}<span className="font-serif font-normal italic text-slate-400 dark:text-slate-500">প্রস্তুতি।</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-slate-500 font-medium">
              মেমরি ও ভাষা শেখার বাস্তব পদ্ধতি মাথায় রেখেই প্রতিটি মডিউল নিখুঁতভাবে সাজানো।
            </motion.p>
          </motion.div>

          {/* Cards */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VP}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <FeatureCard
              icon={<Video className="w-5 h-5" />}
              name="মাস্টারক্লাস"
              desc="শুধু প্রশ্নের ধরন নয়, পরীক্ষার মনস্তত্ত্ব বুঝে গভীর স্ট্র্যাটেজি শেখার ক্লাস।"
              img="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
              color="from-blue-50 to-white"
            />
            <FeatureCard
              icon={<PenTool className="w-5 h-5" />}
              name="অ্যাকটিভ প্র্যাকটিস"
              desc="আসল পরীক্ষার ইন্টারফেসের মতোই অনুশীলন করুন। টেস্ট ডের চাপ কমাতে হাই-স্টেকস সিমুলেশন।"
              img="https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop"
              color="from-grape-50 to-white"
            />
            <FeatureCard
              icon={<BookOpen className="w-5 h-5" />}
              name="লেক্সিক্যাল হাব"
              desc="Band 8.0 ভোকাবুলারি দীর্ঘমেয়াদে মনে রাখতে বৈজ্ঞানিক SRS (Spaced Repetition)।"
              img="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop"
              color="from-amber-50 to-white"
            />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      {/* Methodology Section with Glowing Backdrop */}
      <section className="w-full py-24 md:py-32 bg-slate-900 relative overflow-hidden">
        {/* Decorative accent glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-grape-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-grape-900/40 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left text */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={VP}
              variants={stagger}
              className="space-y-10"
            >
              <div className="space-y-4">
                <motion.p variants={fadeUp} className="text-accent font-extrabold text-[11px] uppercase tracking-[0.4em]">মেথডোলজি</motion.p>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                  আপনার Band <span className="text-accent italic">9.0</span><br />-এর পথ।
                </motion.h2>
              </div>

              <motion.div variants={stagger} className="space-y-8">
                {[
                  { num: "০১", title: "ডায়াগনস্টিক অ্যাসেসমেন্ট", desc: "আপনার বর্তমান দক্ষতা নির্ভুলভাবে বুঝতে আমাদের AI ৪২টি আলাদা স্কিল ক্লাস্টার বিশ্লেষণ করে।" },
                  { num: "০২", title: "অ্যাডাপটিভ স্টাডি প্ল্যান", desc: "আপনার গতি, নির্ভুলতা ও হাতে থাকা সময় অনুযায়ী প্রতিদিন আপডেট হওয়া স্মার্ট ক্যালেন্ডার।" },
                  { num: "০৩", title: "ডিপ সিমুলেশন", desc: "অফিশিয়াল টেস্টিং সফটওয়্যারের অভিজ্ঞতা প্রায় হুবহু দিতে প্রতি সপ্তাহে ফুল-লেংথ মক।" },
                ].map((step, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex gap-6 group">
                    <span className="text-accent font-serif text-3xl font-normal shrink-0 mt-0.5 group-hover:scale-110 transition-transform origin-center">{step.num}</span>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tight mb-1">{step.title}</h4>
                      <p className="text-slate-400 font-medium leading-relaxed text-sm">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Link href="/login">
                  <Button size="lg" className="h-14 px-8 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-accent hover:text-white transition-all shadow-xl gap-2">
                    এখনই আমার স্কোর বিশ্লেষণ করুন <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VP}
              transition={{ duration: 0.8 }}
              className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden group shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
                alt="সহযোগিতামূলক IELTS প্রস্তুতি"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 group-hover:bg-slate-900/30 transition-colors duration-500">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-white shadow-2xl shadow-accent/40"
                >
                  <Play className="w-7 h-7 fill-current ml-1" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="w-full py-24 md:py-32 bg-surface-container-low dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VP}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.p variants={fadeUp} className="text-accent font-extrabold text-[11px] uppercase tracking-[0.4em] mb-4">সোশ্যাল প্রুফ</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              সত্যিকারের শিক্ষার্থী। <span className="font-serif font-normal italic text-slate-400 dark:text-slate-500">সত্যিকারের ফলাফল।</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VP}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { name: "Klara Fischer", score: "8.5", univ: "Oxford University", desc: "Writing breakdown-টাই ছিল আমার টার্নিং পয়েন্ট। বহু বছরের সংগ্রামের পর Task 2 structure অবশেষে পুরোপুরি পরিষ্কার হয়েছে।", flag: "🇩🇪" },
              { name: "Arjun Mehta", score: "8.0", univ: "University of Toronto", desc: "Practice Mock একদম বাস্তব পরীক্ষার মতো ছিল। টেস্ট ডেতে আমার নার্ভাসনেস ছিল শূন্য।", flag: "🇮🇳" },
              { name: "Chen Wei", score: "9.0", univ: "Stanford MBA", desc: "Band 9.0 পাওয়ার জন্য যে নির্দিষ্ট lexical range দরকার ছিল, Perfect Score সেটাই আমাকে দিয়েছে।", flag: "🇨🇳" },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -6 }}
                className="bg-surface p-8 rounded-3xl border border-border shadow-sm flex flex-col gap-6 group transition-all hover:shadow-xl hover:shadow-accent/5"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                {/* Quote */}
                <p className="text-foreground/80 font-medium leading-relaxed flex-1 italic font-serif text-lg">“{t.desc}”</p>
                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent font-black text-sm">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">{t.name} {t.flag}</p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.univ}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-accent italic">{t.score}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ CTA BANNER ══════════════════ */}
      <section className="w-full py-20 md:py-28 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
        
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VP}
          variants={stagger}
          className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-accent">আজই ফ্রি শুরু করুন</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight mb-6">
            আপনার Band 8+<br />
            <span className="font-serif font-normal italic text-accent">মাত্র একটি সিদ্ধান্ত দূরে।</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-slate-500 font-medium mb-10 max-w-xl mx-auto leading-relaxed">
            ৪৫,০০০+ পরীক্ষার্থীর সঙ্গে যুক্ত হোন, যারা আন্দাজের বদলে বেছে নিয়েছে নির্ভুল প্রস্তুতি। কোনো ক্রেডিট কার্ড লাগবে না।
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-grape-600 text-white hover:bg-grape-500 font-bold text-lg gap-2 shadow-2xl shadow-grape-600/40 btn-glow border-0">
                ফ্রি শুরু করুন <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-border text-foreground hover:bg-surface transition-all font-bold text-sm">
                মূল্য দেখুন
              </Button>
            </Link>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-6 text-xs text-slate-400 font-medium">
            ✓ ফ্রি ফরএভার প্ল্যান &nbsp; ✓ ক্রেডিট কার্ড লাগবে না &nbsp; ✓ যেকোনো সময় বাতিল করুন
          </motion.p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

/* ─────────────────────── Feature Card ─────────────────────── */
function FeatureCard({ icon, name, desc, img, color }: {
  icon: React.ReactNode;
  name: string;
  desc: string;
  img: string;
  color: string;
}) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="group bg-surface border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-accent/5 transition-all"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-60 dark:opacity-40`} />
        <div className="absolute bottom-5 left-6 w-12 h-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-xl flex items-center justify-center text-accent shadow-lg">
          {icon}
        </div>
      </div>
      {/* Body */}
      <div className="p-7 space-y-3">
        <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-accent transition-colors">{name}</h3>
        <p className="text-slate-500 font-medium leading-relaxed text-sm">{desc}</p>
        <Link href="/login" className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-accent hover:gap-3 transition-all pt-2">
          মডিউল দেখুন <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
