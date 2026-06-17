"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, Lock, Eye, Database, Bell, Globe } from "lucide-react";

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: any = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const VP = { once: true, amount: 0.1 };

const highlights = [
  { icon: Lock, title: "Encrypted Data", desc: "All data in transit and at rest is encrypted using industry-standard AES-256." },
  { icon: Eye, title: "No Data Selling", desc: "We will never sell, rent, or share your personal data with third-party advertisers." },
  { icon: Database, title: "Data Portability", desc: "You can request an export of all your personal data at any time from your profile settings." },
  { icon: Bell, title: "Opt-Out Anytime", desc: "All marketing communications include unsubscribe links. We respect your inbox." },
  { icon: Globe, title: "GDPR Compliant", desc: "Our practices comply with the General Data Protection Regulation for EU residents." },
  { icon: Shield, title: "Right to Deletion", desc: "Request permanent account deletion and data erasure at any time." },
];

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us when you create an account, including your name, email address, and optionally your phone number and location. We also collect usage data — such as which lessons you complete, your practice scores, time spent on each module, and device/browser information — to power our adaptive learning engine and improve the platform.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use collected data to: (a) provide, personalise, and improve the Perfect Score platform; (b) generate your adaptive study plan and band score predictions; (c) send service-related communications (account confirmations, study reminders); (d) respond to your support requests; (e) detect and prevent fraud or abuse; and (f) conduct anonymised research to improve our AI and content.`,
  },
  {
    title: "3. Data Sharing",
    content: `We do not sell your personal data. We may share data with: (a) service providers who assist in operating the platform (cloud hosting, payment processing, email delivery) under strict data processing agreements; (b) law enforcement when required by applicable law or to protect the rights and safety of our users; (c) a successor entity in the event of a merger or acquisition, with advance notice to you.`,
  },
  {
    title: "4. Cookies and Tracking",
    content: `We use essential cookies to keep you logged in and remember your preferences. We use analytic cookies (via privacy-first tools) to understand how the platform is used in aggregate. You can control cookie preferences in your browser settings. Disabling essential cookies may affect platform functionality.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain your personal data for as long as your account is active, or as long as necessary to provide the service. If you delete your account, we will delete or anonymise your personal data within 30 days, except where we are required by law to retain it longer (e.g., financial transaction records for 7 years).`,
  },
  {
    title: "6. Security",
    content: `We implement appropriate technical and organisational measures to protect your personal data against accidental or unlawful destruction, loss, alteration, disclosure, or access. This includes TLS encryption, access controls, regular security audits, and employee training. No system is 100% secure; we encourage you to use a strong, unique password.`,
  },
  {
    title: "7. Your Rights",
    content: `You have the right to: access the personal data we hold about you; correct inaccurate data; request deletion of your data; object to or restrict certain data processing; and data portability. To exercise these rights, email privacy@perfectscore.app. We will respond within 30 days.`,
  },
  {
    title: "8. Children's Privacy",
    content: `Perfect Score is not intended for children under 13. We do not knowingly collect personal data from children under 13. If we become aware that we have collected such data, we will delete it promptly. If you believe a child under 13 has provided us with personal information, please contact us.`,
  },
  {
    title: "9. Changes to this Policy",
    content: `We may update this Privacy Policy periodically. We will notify you of material changes via email or an in-app notice at least 14 days before they take effect. Your continued use of the platform after that date constitutes acceptance of the updated policy.`,
  },
  {
    title: "10. Contact Us",
    content: `For privacy-related questions, requests, or complaints, contact our Data Protection Officer at: privacy@perfectscore.app. Response time: within 5 business days. Mailing address: Perfect Score Ltd., House 42, Road 11, Banani, Dhaka 1213, Bangladesh.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="w-full pt-28 pb-16 md:pt-36 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-4">
            <motion.p variants={fadeUp} className="text-accent font-extrabold text-[11px] uppercase tracking-[0.4em]">Legal</motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
              Privacy Policy
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-500 font-medium">
              Last updated: 1 May 2025 · Your data, your rights.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="w-full py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={VP} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <motion.div key={i} variants={fadeUp} className="bg-white p-7 rounded-2xl border border-slate-100 flex gap-5 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 mb-1">{h.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{h.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Full policy */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={VP} variants={stagger} className="space-y-10">
            {sections.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="space-y-3">
                <h2 className="text-xl font-black text-slate-900">{s.title}</h2>
                <p className="text-slate-600 font-medium leading-relaxed">{s.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
