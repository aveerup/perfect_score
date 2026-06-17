"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: any = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const VP = { once: true, amount: 0.1 };

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using Perfect Score (perfectscore.app), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform. These terms apply to all users, including visitors, registered learners, and premium subscribers.`,
  },
  {
    title: "2. Use of Service",
    content: `Perfect Score grants you a limited, non-exclusive, non-transferable licence to access and use the platform for personal, non-commercial IELTS preparation purposes. You agree not to: (a) reproduce, duplicate, copy, sell, or exploit any portion of the service without express written permission; (b) use the platform for any unlawful purpose; (c) share your account credentials with others; (d) attempt to gain unauthorised access to any part of the service or its related systems.`,
  },
  {
    title: "3. Account Responsibility",
    content: `You are responsible for maintaining the confidentiality of your account login credentials and for all activities that occur under your account. You must notify us immediately at support@perfectscore.app of any unauthorised use or security breach. Perfect Score will not be liable for any loss or damage arising from your failure to comply with this obligation.`,
  },
  {
    title: "4. Subscription and Payments",
    content: `Certain features of Perfect Score require a paid subscription. All payments are processed securely through our payment partners. Subscriptions are billed on a monthly or annual basis as selected at checkout. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period. Perfect Score does not offer refunds for partial billing periods, except where required by applicable law.`,
  },
  {
    title: "5. Intellectual Property",
    content: `All content on Perfect Score — including but not limited to course materials, videos, practice questions, audio recordings, written content, and software — is the exclusive property of Perfect Score Ltd. and is protected by applicable copyright, trademark, and intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without explicit written permission.`,
  },
  {
    title: "6. User-Generated Content",
    content: `When you submit content to Perfect Score (such as writing submissions or speaking recordings for AI evaluation), you grant us a limited, non-exclusive licence to process and store that content for the purpose of delivering the service to you. We do not claim ownership of your submissions. Your submissions may be anonymised and used in aggregate to improve our AI systems.`,
  },
  {
    title: "7. Disclaimer of Warranties",
    content: `Perfect Score is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, error-free, or free of viruses. We do not guarantee any specific IELTS band score outcome as a result of using our platform. Individual results vary based on effort, prior ability, and exam conditions.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `To the fullest extent permitted by applicable law, Perfect Score Ltd. shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to loss of profits, data, or goodwill — arising out of or in connection with your use of the platform, even if we have been advised of the possibility of such damages.`,
  },
  {
    title: "9. Termination",
    content: `We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we determine violates these Terms, is harmful to other users, us, third parties, or for any other reason. Upon termination, your right to use the service will immediately cease.`,
  },
  {
    title: "10. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the People's Republic of Bangladesh, without regard to conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Dhaka, Bangladesh.`,
  },
  {
    title: "11. Changes to Terms",
    content: `We reserve the right to modify these terms at any time. We will provide at least 14 days' notice of material changes via email or an in-app notification. Your continued use of the platform after any changes constitutes your acceptance of the new terms. If you do not agree to the modified terms, you must discontinue your use of the platform.`,
  },
  {
    title: "12. Contact",
    content: `If you have questions about these Terms of Service, please contact us at: legal@perfectscore.app or write to Perfect Score Ltd., House 42, Road 11, Banani, Dhaka 1213, Bangladesh.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="w-full pt-28 pb-16 md:pt-36 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-4">
            <motion.p variants={fadeUp} className="text-accent font-extrabold text-[11px] uppercase tracking-[0.4em]">Legal</motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
              Terms of Service
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-500 font-medium">
              Last updated: 1 May 2025 · Effective immediately upon account creation.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VP}
            variants={stagger}
            className="space-y-10"
          >
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
