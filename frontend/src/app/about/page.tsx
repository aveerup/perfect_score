"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, Zap, Globe, BookOpen, Award } from "lucide-react";

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: any = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const VP = { once: true, amount: 0.15 };

const team = [
  { name: "Rahim Chowdhury", role: "CEO & Co-Founder", bg: "#7c2dbb", initial: "RC", bio: "Former IELTS examiner with 12 years at the British Council. Band 9.0 speaker of 4 languages." },
  { name: "Priya Sharma", role: "Head of Content", bg: "#6b21a8", initial: "PS", bio: "Cambridge CELTA & DELTA certified. Creator of the acclaimed 'Band 8 Writing Blueprint' curriculum." },
  { name: "James Liu", role: "CTO", bg: "#581c87", initial: "JL", bio: "Ex-Google engineer. Architected adaptive learning systems used by 200,000+ learners globally." },
  { name: "Fatima Al-Hassan", role: "Lead Research Scientist", bg: "#4c1d95", initial: "FA", bio: "PhD in Applied Linguistics from UCL. Pioneer in SRS-based vocabulary acquisition for L2 learners." },
];

const values = [
  { icon: Target, title: "Precision Over Volume", desc: "We believe in targeted, deliberate practice — not endless drilling. Every exercise is mapped to a specific IELTS competency." },
  { icon: Zap, title: "Real-Time Adaptation", desc: "Our AI doesn't just track scores. It learns how you think, where you hesitate, and adjusts your plan accordingly." },
  { icon: Users, title: "Community First", desc: "45,000+ candidates collaborate, compete, and celebrate together. Isolation is the enemy of progress." },
  { icon: Globe, title: "Built for Bangladesh", desc: "Designed with the specific challenges Bangladeshi test-takers face — from accent coaching to academic vocabulary." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative w-full pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:48px_48px] opacity-30 pointer-events-none" />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/8 blur-[120px] rounded-full pointer-events-none"
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl space-y-6">
            <motion.p variants={fadeUp} className="text-accent font-extrabold text-[11px] uppercase tracking-[0.4em]">Our Story</motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-heading text-slate-900 leading-[0.9] tracking-tight">
              Built by educators.<br />
              <span className="font-serif italic font-normal text-accent">Obsessed with results.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
              Perfect Score was born in Dhaka in 2021, out of frustration with IELTS prep platforms that were built for Western learners — and a conviction that Bangladesh deserved better.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission stat band */}
      <section className="w-full py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="show" viewport={VP} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center"
          >
            {[
              { val: "2021", label: "Founded in Dhaka" },
              { val: "45K+", label: "Active Learners" },
              { val: "94%", label: "Hit Band 8+" },
              { val: "12", label: "Countries Served" },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp}>
                <p className="text-4xl md:text-5xl font-black tracking-tighter text-white">{s.val}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission statement */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div initial="hidden" whileInView="show" viewport={VP} variants={stagger} className="space-y-6">
              <motion.p variants={fadeUp} className="text-accent font-extrabold text-[11px] uppercase tracking-[0.4em]">Our Mission</motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Making Band 8+ accessible to every serious candidate.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-500 font-medium leading-relaxed text-lg">
                Too many students fail not because they lack ability — but because they had the wrong preparation. Generic platforms, recycled materials, and no real understanding of where they're going wrong.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-500 font-medium leading-relaxed">
                We built Perfect Score to fix this. Every feature — from our AI diagnostic to our SRS vocabulary engine — is designed around one question: <span className="text-slate-900 font-black">what does this learner need right now?</span>
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link href="/onboarding">
                  <Button size="lg" className="h-14 px-8 rounded-2xl bg-slate-900 text-white hover:bg-accent transition-all font-bold text-sm gap-2">
                    Start Your Journey <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VP}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Top EdTech 2024</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bangladesh Digital Awards</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="w-full py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={VP} variants={stagger} className="mb-16 text-center">
            <motion.p variants={fadeUp} className="text-accent font-extrabold text-[11px] uppercase tracking-[0.4em] mb-3">What We Believe</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Our <span className="font-serif font-normal italic text-slate-400">core values.</span>
            </motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={VP} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                  <v.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-sm">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={VP} variants={stagger} className="mb-16 text-center">
            <motion.p variants={fadeUp} className="text-accent font-extrabold text-[11px] uppercase tracking-[0.4em] mb-3">The People</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Meet the <span className="font-serif font-normal italic text-slate-400">team.</span>
            </motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={VP} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center group hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-lg mx-auto mb-5 shadow-lg" style={{ background: member.bg }}>
                  {member.initial}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">{member.name}</h3>
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-4">{member.role}</p>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20 bg-slate-900">
        <motion.div
          initial="hidden" whileInView="show" viewport={VP} variants={stagger}
          className="max-w-3xl mx-auto px-6 text-center text-white"
        >
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Ready to join us?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 font-medium mb-8">
            Start free. No credit card. Just results.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link href="/onboarding">
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-accent text-white hover:bg-grape-500 font-bold text-sm gap-2 shadow-xl shadow-accent/30">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
