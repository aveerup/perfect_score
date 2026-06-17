"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { type AuthUser } from "@/lib/auth";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { 
  Home, Video, PenTool, BookOpen, ClipboardCheck, Calendar,
  Search, User, Keyboard, LogOut, Settings, Trophy, CheckCircle2
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Lectures", href: "/lectures", icon: Video },
  { name: "Practice", href: "/practice", icon: PenTool },
  { name: "Vocab", href: "/vocab", icon: BookOpen },
  { name: "Mock", href: "/mock", icon: ClipboardCheck },
  { name: "Plan", href: "/plan", icon: Calendar },
  { name: "Typing", href: "/typing", icon: Keyboard },
  { name: "Profile", href: "/profile", icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

      try {
        let response = await fetch(`${apiUrl}/me`, {
          credentials: "include",
        });

        if (response.status === 401) {
          const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
            method: "POST",
            credentials: "include",
          });

          if (refreshResponse.ok) {
            response = await fetch(`${apiUrl}/me`, {
              credentials: "include",
            });
          }
        }

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const authenticatedUser = await response.json() as AuthUser;
        setUser(authenticatedUser);
      } catch {
        window.location.replace("/login");
      }
    };

    void validateSession();
  }, []);

  const handleLogout = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

    try {
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      window.location.href = "/login";
    }
  };

  const getTitle = () => {
    const item = navItems.find(i => pathname.startsWith(i.href));
    return item ? item.name : "Dashboard";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
          Loading your account...
        </span>
      </div>
    );
  }

  const initials = user.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-surface">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-20 lg:w-72 border-r border-slate-200/60 fixed top-0 left-0 h-full bg-white z-20 transition-all duration-300">
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100 overflow-hidden">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <CheckCircle2 className="w-6 h-6 stroke-[3px]" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 lg:block hidden">PERFECT SCORE</span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-10 px-4 overflow-hidden">
          <div className="space-y-2">
            {navItems.map((item, i) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3.5 transition-all duration-200 rounded-2xl group relative overflow-hidden ${
                      isActive
                        ? "bg-primary/5 text-primary"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-300"
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "stroke-[2.5px]" : "stroke-[1.8px]"}`} />
                    <span className={`text-sm font-bold whitespace-nowrap transition-all lg:opacity-100 opacity-0 lg:w-auto w-0 overflow-hidden tracking-tight`}>
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-slate-100 overflow-hidden space-y-2">
          <Link
            href="#"
            className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-300 transition-all rounded-2xl"
          >
            <Settings className="w-5 h-5 shrink-0 stroke-[1.8px]" />
            <span className="text-sm font-bold tracking-tight whitespace-nowrap lg:opacity-100 opacity-0 lg:w-auto w-0 overflow-hidden">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-2xl"
          >
            <LogOut className="w-5 h-5 shrink-0 stroke-[1.8px]" />
            <span className="text-sm font-bold tracking-tight whitespace-nowrap lg:opacity-100 opacity-0 lg:w-auto w-0 overflow-hidden">Log Out</span>
          </button>

          {/* User */}
          <Link href="/profile" className="flex items-center gap-3 px-4 py-6 mt-4 border-t border-slate-50 hover:bg-slate-50 transition-colors rounded-2xl group">
            <div className="w-10 h-10 shrink-0 rounded-2xl bg-primary/10 border border-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
              <span className="text-xs font-black text-primary group-hover:text-white">{initials}</span>
            </div>
            <div className="flex flex-col whitespace-nowrap lg:opacity-100 opacity-0 lg:w-auto w-0 overflow-hidden">
              <span className="text-xs font-black text-slate-900 leading-none">{user.name}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{user.role}</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-20 lg:ml-72 flex flex-col min-h-screen pb-20 md:pb-0 transition-all duration-300">
        {/* TOP BAR */}
        <header className="h-20 border-b border-slate-200/60 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center justify-between px-8 lg:px-12">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">Platform</span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">{getTitle()}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
              <Trophy className="w-4 h-4 text-primary" strokeWidth={2.5} />
              <span className="text-xs font-black text-slate-700">Band {user.currentBand.toFixed(1)}</span>
            </div>
            <button onClick={() => setSearchOpen(true)} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100">
              <Search className="w-5 h-5 text-slate-400" strokeWidth={2} />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center md:hidden shadow-lg shadow-primary/20">
              <span className="text-xs font-black text-white">{initials}</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto w-full">

          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border z-30 h-16 px-2">
        <ul className="flex items-center justify-around h-full">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.name} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 h-full relative transition-colors ${
                    isActive ? "text-on-surface" : "text-secondary"
                  }`}
                >
                  <Icon className={`w-5 h-5 stroke-[1.5px] ${isActive ? "stroke-[2px]" : ""}`} />
                  <span className="text-[9px] font-black tracking-tight uppercase">{item.name}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
