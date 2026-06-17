"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/auth/password-reset", { email });
      setMessage("If an account exists for that email, Supabase will send reset instructions.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to request reset");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-[2rem] p-9 shadow-xl space-y-5">
        <div><h1 className="text-4xl font-black">Reset password</h1><p className="text-slate-500 mt-2">Enter the email attached to your account.</p></div>
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full h-12 border border-slate-200 rounded-xl px-4" placeholder="name@example.com" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-700 text-sm">{message}</p>}
        <button className="w-full py-3 bg-primary text-white rounded-xl font-bold">Send reset email</button>
        <Link href="/login" className="block text-center text-sm font-bold text-primary">Back to sign in</Link>
      </form>
    </main>
  );
}
