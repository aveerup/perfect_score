"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, MapPin, Phone, CheckCircle2, Send } from "lucide-react";

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: any = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const VP = { once: true, amount: 0.15 };

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative w-full pt-28 pb-20 md:pt-36 border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:48px_48px] opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-2xl space-y-5">
            <motion.p variants={fadeUp} className="text-accent font-extrabold text-[11px] uppercase tracking-[0.4em]">Get In Touch</motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-heading text-slate-900 tracking-tight leading-[0.9]">
              We're here<br />
              <span className="font-serif italic font-normal text-accent">to help.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 font-medium leading-relaxed">
              Have a question, suggestion, or just want to say hello? Our team responds within 24 hours on business days.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact grid */}
      <section className="w-full py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left — info */}
            <motion.div initial="hidden" whileInView="show" viewport={VP} variants={stagger} className="space-y-10">
              <motion.div variants={fadeUp}>
                <h2 className="text-3xl font-black text-slate-900 mb-6">Contact information</h2>
                <div className="space-y-6">
                  {[
                    { icon: Mail, label: "Email", value: "support@perfectscore.app", sub: "For general support & billing" },
                    { icon: MessageSquare, label: "Live Chat", value: "Available in-app", sub: "Mon–Fri, 9am–6pm BDT" },
                    { icon: Phone, label: "Phone", value: "+880 1700-000000", sub: "Mon–Fri, 10am–5pm BDT" },
                    { icon: MapPin, label: "Office", value: "House 42, Road 11, Banani", sub: "Dhaka 1213, Bangladesh" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div key={i} variants={fadeUp} className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                          <p className="text-base font-black text-slate-900">{item.value}</p>
                          <p className="text-sm font-medium text-slate-500">{item.sub}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-3">Response time commitment</h3>
                <div className="space-y-3">
                  {[
                    { type: "General queries", time: "Within 24 hours" },
                    { type: "Billing & payments", time: "Within 4 hours" },
                    { type: "Technical issues", time: "Within 2 hours" },
                    { type: "Legal & privacy", time: "Within 5 business days" },
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <span className="text-sm font-medium text-slate-600">{r.type}</span>
                      <span className="text-sm font-black text-accent">{r.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right — form */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP} transition={{ duration: 0.7 }}>
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-100 p-16 shadow-sm">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-3">Message sent!</h2>
                  <p className="text-slate-500 font-medium">We'll get back to you within 24 hours. Check your inbox (and spam, just in case).</p>
                  <Button className="mt-8 rounded-2xl bg-slate-900 text-white px-8 h-12 font-bold" onClick={() => setSubmitted(false)}>Send Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Send us a message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Your Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-slate-50"
                        placeholder="Mizbaur Rahman"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Email Address</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-slate-50"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Subject</label>
                    <select
                      required
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-slate-50"
                    >
                      <option value="">Select a topic...</option>
                      <option>General Question</option>
                      <option>Technical Issue</option>
                      <option>Billing & Subscription</option>
                      <option>Content Feedback</option>
                      <option>Partnership Inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-slate-50 resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-13 rounded-2xl bg-slate-900 text-white font-bold hover:bg-accent transition-all gap-2">
                    <Send className="w-4 h-4" /> Send Message
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
