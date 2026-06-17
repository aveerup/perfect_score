"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Mock Tests", href: "/mock" },
    { label: "Typing Practice", href: "/typing" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Study Guides", href: "/guides" },
    { label: "Contact", href: "/contact" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-16">
          {/* Brand */}
          <div className="md:col-span-3 space-y-10">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white shadow-xl shadow-accent/20">
                  <CheckCircle2 className="w-8 h-8 stroke-[3px]" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-slate-900">PERFECT SCORE</span>
              </div>
            </Link>
            <p className="text-2xl font-medium text-slate-500 leading-relaxed max-w-lg">
              Precision-engineered IELTS preparation for serious candidates. 
              <span className="block mt-6 font-black text-slate-900 uppercase text-sm tracking-[0.3em]">Bangladesh's Elite Platform.</span>
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Join 45,000+ Active Candidates</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="md:col-span-1">
              <h4 className="text-[10px] font-black text-slate-900 mb-8 uppercase tracking-[0.4em]">{category}</h4>
              <ul className="space-y-5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm font-bold text-slate-400 hover:text-accent transition-colors relative group uppercase tracking-widest"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-24 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Perfect Score. All levels covered within.
          </p>
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Region: Global</span>
             </div>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
               Engineering Excellence 🇧🇩
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
