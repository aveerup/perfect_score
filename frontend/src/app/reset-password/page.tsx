"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }
    const token = new URLSearchParams(window.location.hash.slice(1)).get("access_token");
    if (!token) {
      setError("This reset link is missing or expired. Request a new email.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/password-update", { accessToken: token, password });
      setMessage("Password updated. You can now sign in.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-[2rem] p-9 shadow-xl space-y-5">
        <div><h1 className="text-4xl font-black">Choose a new password</h1><p className="text-slate-500 mt-2">Use at least eight characters.</p></div>
        <input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full h-12 border border-slate-200 rounded-xl px-4" placeholder="New password" />
        <input required minLength={8} type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="w-full h-12 border border-slate-200 rounded-xl px-4" placeholder="Confirm password" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-700 text-sm">{message}</p>}
        <button disabled={loading || Boolean(message)} className="w-full py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50">{loading ? "Updating..." : "Update password"}</button>
        {message && <Link href="/login" className="block text-center text-primary font-bold">Continue to sign in</Link>}
      </form>
    </main>
  );
}
