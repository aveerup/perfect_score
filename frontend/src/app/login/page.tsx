"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail ?? "Unable to sign in");
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 600);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in");
      setLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden flex flex-col md:flex-row min-h-[700px]"
      >
        {/* LEFT PANEL - Branded Info */}
        <div className="hidden md:flex flex-col justify-between w-[45%] bg-slate-50 p-12 lg:p-16 relative border-r border-slate-100">
          <div className="relative z-10">
            <Link href="/">
              <Image src="/logo.png" alt="Perfect Score" width={180} height={40} className="h-10 w-auto object-contain" priority />
            </Link>
          </div>

          <div className="relative z-10 space-y-12">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                IELTS Excellence
              </span>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Unlock your <br />
                <span className="text-primary">Band 9.0</span> potential.
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm">
                Join thousands of students who achieved their dreams with our precision learning tools.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {[
                { val: "12k+", label: "Success Stories" },
                { val: "0.8↑", label: "Avg. Band Jump" },
              ].map(({ val, label }) => (
                <div key={label} className="space-y-1">
                  <p className="text-3xl font-black text-slate-900">{val}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            © 2025 Perfect Score Platform
          </div>
        </div>

        {/* RIGHT PANEL - Form */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:px-24">
          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
          </Link>

          <div className="space-y-10 w-full max-w-sm mx-auto">
            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome home.</h1>
              <p className="text-slate-500 font-medium">Continue your journey to perfection.</p>
            </motion.div>

            <motion.form variants={itemVariants} onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block ml-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-14 bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white rounded-2xl outline-none transition-all px-5 font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block ml-1">Password</label>
                    <Link href="/forgot-password" className="text-[10px] font-bold text-primary uppercase tracking-widest">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-14 bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white rounded-2xl outline-none transition-all px-5 pr-12 font-semibold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 text-red-500 text-xs font-bold p-4 bg-red-50 rounded-2xl border border-red-100"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className="w-full h-14 bg-green-300 text-black hover:bg-green-500 rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Verifying..." : success ? "Welcome Back!" : "Sign In"}
              </button>
            </motion.form>

            <motion.div variants={itemVariants} className="pt-6 border-t border-slate-100 text-center space-y-4">
               <p className="text-xs font-semibold text-slate-400">
                 Sign in with an account from Supabase Authentication.
               </p>
               <p className="text-sm font-medium text-slate-500">
                  New to Perfect Score?{" "}
                  <Link href="/signup" className="text-primary font-black hover:underline underline-offset-4">
                    Create Account
                  </Link>
               </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
