"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, MessageSquare, Video, BookOpen, CreditCard, Settings, Shield } from "lucide-react";

const fadeUp: any = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
const stagger: any = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const VP = { once: true, amount: 0.1 };

const categories = [
  {
    icon: Video, label: "Getting Started",
    faqs: [
      { q: "How do I create my account?", a: "Click 'Start Free' on the homepage and fill in your name, email, and password. You can also sign up with Google. No credit card required for the free plan." },
      { q: "What is included in the free plan?", a: "The free plan gives you access to Masterclass previews, 50 practice questions per month, 200 vocabulary words, and your adaptive study plan overview. Upgrade to Pro for unlimited access." },
      { q: "Can I change my target band after onboarding?", a: "Yes. Go to Profile → Settings → Study Goals and update your target band and exam date. Your study plan regenerates automatically." },
      { q: "Is Perfect Score for both IELTS Academic and General Training?", a: "Yes. Both test types are fully supported. Select your test type during onboarding and all content will be filtered accordingly." },
    ],
  },
  {
    icon: BookOpen, label: "Practice & Content",
    faqs: [
      { q: "How does the AI Writing feedback work?", a: "Submit an essay and our AI evaluates it across all four official marking criteria, giving you a band estimate and specific feedback within 30 seconds." },
      { q: "How many mock tests are available?", a: "Pro subscribers have access to 200+ full-length mock tests updated quarterly with all four sections: Listening, Reading, Writing, and Speaking." },
      { q: "Can I download content for offline use?", a: "Pro subscribers can download video lessons and vocabulary sets via the Perfect Score mobile app. Practice quizzes require internet for scoring." },
    ],
  },
  {
    icon: CreditCard, label: "Billing & Plans",
    faqs: [
      { q: "How do I upgrade to Pro?", a: "Go to Settings → Billing, or click any locked feature. We accept bKash, Nagad, Rocket, debit/credit cards, and bank transfer." },
      { q: "Can I cancel my subscription?", a: "Yes, anytime. Go to Settings → Billing → Cancel. Your access continues until the end of your billing period. No partial refunds." },
      { q: "Do you offer a student discount?", a: "Students with a valid .edu email receive 30% off the annual Pro plan. Email support@perfectscore.app with your student ID." },
    ],
  },
  {
    icon: Settings, label: "Technical",
    faqs: [
      { q: "Which browsers are supported?", a: "Perfect Score works best on Chrome, Firefox, Edge, and Safari (latest 2 versions). Use Chrome or Firefox for Speaking practice." },
      { q: "The audio is not playing in my mock test.", a: "Check browser audio permissions, refresh the page, or clear your cache. Contact support if the issue persists." },
      { q: "Can I use Perfect Score on mobile?", a: "Yes — the platform is fully mobile-responsive. For Writing and Speaking, the desktop version gives the best experience." },
    ],
  },
  {
    icon: Shield, label: "Privacy & Security",
    faqs: [
      { q: "Is my data safe?", a: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never sell your data. See our Privacy Policy for details." },
      { q: "Can I delete my account?", a: "Yes. Go to Settings → Account → Delete Account. All data is permanently erased within 30 days. This cannot be undone." },
      { q: "Who can see my practice submissions?", a: "Your submissions are private by default. Anonymised data may be used to improve our AI, but never shared identifiably without consent." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between py-5 text-left gap-4 group">
        <span className="text-sm font-bold text-slate-900 group-hover:text-accent transition-colors">{q}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-accent" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm text-slate-500 font-medium leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState("");
  const allFaqs = categories.flatMap(c => c.faqs);
  const filtered = search.trim()
    ? allFaqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="w-full pt-28 pb-16 md:pt-36 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-black text-white tracking-tight">How can we help?</motion.h1>
            <motion.p variants={fadeUp} className="text-slate-400 font-medium text-lg">Search our knowledge base or browse by category.</motion.p>
            <motion.div variants={fadeUp} className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="e.g. how to cancel subscription..."
                className="w-full h-14 pl-12 pr-5 rounded-2xl border-0 bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {filtered ? (
            <div className="max-w-3xl mx-auto">
              <p className="text-sm font-bold text-slate-400 mb-6">{filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"</p>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                {filtered.length === 0
                  ? <p className="text-slate-500 font-medium text-center py-8">No results found. Try different keywords or <Link href="/contact" className="text-accent font-bold">contact us</Link>.</p>
                  : filtered.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)
                }
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <motion.div initial="hidden" whileInView="show" viewport={VP} variants={stagger} className="space-y-2">
                {categories.map((cat, i) => {
                  const Icon = cat.icon;
                  return (
                    <motion.button key={i} variants={fadeUp} onClick={() => setActiveCategory(i)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all font-bold text-sm ${activeCategory === i ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-slate-600 hover:bg-slate-50"}`}>
                      <Icon className="w-4 h-4 shrink-0" />{cat.label}
                    </motion.button>
                  );
                })}
              </motion.div>

              <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  {React.createElement(categories[activeCategory].icon, { className: "w-5 h-5 text-accent" })}
                  <h2 className="text-xl font-black text-slate-900">{categories[activeCategory].label}</h2>
                </div>
                {categories[activeCategory].faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Still have questions?</p>
                  <Link href="/contact">
                    <Button size="sm" className="rounded-xl bg-slate-900 text-white font-bold gap-2">
                      <MessageSquare className="w-3.5 h-3.5" /> Contact Support
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
