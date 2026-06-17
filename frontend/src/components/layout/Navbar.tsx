"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={`sticky top-0 z-50 w-full h-20 flex items-center transition-all duration-500 ${
          scrolled
            ? "bg-surface/80 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-surface border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                  <CheckCircle2 className="w-6 h-6 stroke-[3px]" />
                </div>
                <span className="text-xl font-black tracking-tight text-foreground">PERFECT SCORE</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-8">
                {["Features", "Pricing", "About"].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors relative group"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link
                  href="/login"
                  className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                >
                  Log in
                </Link>
                <Link href="/onboarding">
                  <Button className="h-11 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all font-bold text-sm">
                    Start Free
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-slate-900"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                <motion.span 
                  animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-current rounded-full" 
                />
                <motion.span 
                  animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-full h-0.5 bg-current rounded-full" 
                />
                <motion.span 
                  animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-current rounded-full" 
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 z-40 bg-surface border-b border-border md:hidden overflow-hidden shadow-2xl"
          >
            <div className="p-6 space-y-6">
              {["Features", "Pricing", "About"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="block text-lg font-bold text-foreground active:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-sm font-bold text-slate-500">Theme</span>
                  <ThemeToggle />
                </div>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-200">Log in</Button>
                </Link>
                <Link href="/onboarding" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full h-12 rounded-xl bg-primary text-white font-bold">Start Free</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
