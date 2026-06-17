"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface SignupResponse {
  requiresEmailConfirmation: boolean;
}

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await api.post<SignupResponse>("/auth/signup", { fullName, email, password });
      if (result.requiresEmailConfirmation) {
        setMessage("Check your email to confirm the account, then sign in.");
        setLoading(false);
      } else {
        router.push("/onboarding");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create account");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-[2rem] p-9 shadow-xl space-y-5">
        <div><h1 className="text-4xl font-black">Create account</h1><p className="text-slate-500 mt-2">Start with the free learning workspace.</p></div>
        <Field label="Full name" value={fullName} onChange={setFullName} />
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Password" value={password} onChange={setPassword} type="password" hint="At least 8 characters" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-700 text-sm">{message}</p>}
        <button disabled={loading || Boolean(message)} className="w-full h-13 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50">{loading ? "Creating..." : "Create account"}</button>
        <p className="text-center text-sm text-slate-500">Already registered? <Link href="/login" className="text-primary font-bold">Sign in</Link></p>
      </form>
    </main>
  );
}

function Field({ label, value, onChange, type = "text", hint }: { label: string; value: string; onChange: (value: string) => void; type?: string; hint?: string }) {
  return <label className="block"><span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span><input required type={type} minLength={type === "password" ? 8 : undefined} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full h-12 border border-slate-200 rounded-xl px-4" />{hint && <span className="text-xs text-slate-400">{hint}</span>}</label>;
}
