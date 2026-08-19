"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { AlertCircle, ArrowLeft, Check, Eye, EyeOff } from "lucide-react";

export type AuthMode = "login" | "join";

type TransactionResponse = {
  transaction: {
    id: string;
    email: string;
    transactionId: string;
    planName: string;
    status: string;
    createdAt: string;
  };
};

type AuthJoinPanelProps = {
  mode?: AuthMode;
  defaultMode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  showBackLink?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const paneTransition = { duration: 0.28, ease: "easeOut" as const };

export function AuthJoinPanel({
  mode,
  defaultMode = "login",
  onModeChange,
  showBackLink = true,
}: AuthJoinPanelProps) {
  const router = useRouter();
  const [internalMode, setInternalMode] = useState<AuthMode>(defaultMode);
  const activeMode = mode ?? internalMode;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [planName, setPlanName] = useState("Standard");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const switchMode = (nextMode: AuthMode) => {
    setInternalMode(nextMode);
    setError("");
    setMessage("");
    setSuccess(false);
    setLoading(false);
    onModeChange?.(nextMode);
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
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

  const handleJoin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, transactionId, planName }),
      });
      const data = (await response.json()) as TransactionResponse | { detail?: string };

      if (!response.ok) {
        throw new Error("detail" in data ? data.detail : "Unable to save join request");
      }

      setSuccess(true);
      setMessage("Join request saved. We will verify your transaction and activate access.");
      setTransactionId("");
    } catch (joinError) {
      setError(joinError instanceof Error ? joinError.message : "Unable to save join request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex min-h-[700px] w-full flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/60 md:flex-row"
    >
      <aside className="flex flex-col justify-between bg-slate-50 p-8 md:w-[45%] md:border-r md:border-slate-100 md:p-12 lg:p-16">
        <div>
          <Link href="/" aria-label="Perfect Score home" className="inline-flex items-center gap-2 text-slate-900">
            <span className="grid h-6 w-6 place-items-center rounded bg-slate-900 text-white">
              <Check className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-black leading-[0.9]">
              PERFECT
              <br />
              SCORE
            </span>
          </Link>
        </div>

        <div className="relative grow md:grow-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`details-${activeMode}`}
              initial={{ opacity: 0, x: activeMode === "login" ? -18 : 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeMode === "login" ? 18 : -18 }}
              transition={paneTransition}
            >
              {activeMode === "login" ? <LoginDetails /> : <JoinDetails />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden text-[10px] font-bold uppercase tracking-widest text-slate-400 md:block">
          © 2026 Perfect Score Platform
        </div>
      </aside>

      <section className="flex flex-1 flex-col justify-center p-8 md:p-16 lg:px-24">
        {showBackLink ? (
          <Link href="/" className="group mb-10 inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
          </Link>
        ) : null}

        <div className="mx-auto w-full max-w-sm space-y-8">
          <motion.div variants={itemVariants} className="space-y-5">
            <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`relative h-11 rounded-xl text-sm font-black uppercase tracking-widest transition ${
                  activeMode === "login" ? "text-slate-950" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {activeMode === "login" ? (
                  <motion.span
                    layoutId="authModePill"
                    className="absolute inset-0 rounded-xl bg-white shadow-sm"
                    transition={paneTransition}
                  />
                ) : null}
                <span className="relative z-10">Login</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode("join")}
                className={`relative h-11 rounded-xl text-sm font-black uppercase tracking-widest transition ${
                  activeMode === "join" ? "text-slate-950" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {activeMode === "join" ? (
                  <motion.span
                    layoutId="authModePill"
                    className="absolute inset-0 rounded-xl bg-white shadow-sm"
                    transition={paneTransition}
                  />
                ) : null}
                <span className="relative z-10">Join</span>
              </button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`heading-${activeMode}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={paneTransition}
                className="space-y-3"
              >
                <h1 className="text-4xl font-black tracking-tight text-slate-900">
                  {activeMode === "login" ? "Welcome home." : "Join Perfect Score."}
                </h1>
                <p className="font-medium text-slate-500">
                  {activeMode === "login"
                    ? "Continue your journey to perfection."
                    : "Submit your payment details so we can verify your membership."}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait" initial={false}>
            {activeMode === "login" ? (
              <motion.form
                key="login-form"
                variants={itemVariants}
                initial={{ opacity: 0, x: -16, filter: "blur(3px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 16, filter: "blur(3px)" }}
                transition={paneTransition}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div className="space-y-4">
                  <Field
                    id="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="name@example.com"
                  />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Password
                      </label>
                      <Link href="/forgot-password" className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 pr-12 font-semibold text-slate-900 outline-none transition-all focus:border-primary focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors hover:text-primary"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <StatusMessage error={error} message={message} />

                <button
                  type="submit"
                  disabled={loading || success}
                  className="h-14 w-full rounded-2xl bg-green-300 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-green-500 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Verifying..." : success ? "Welcome Back!" : "Sign In"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="join-form"
                variants={itemVariants}
                initial={{ opacity: 0, x: 16, filter: "blur(3px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -16, filter: "blur(3px)" }}
                transition={paneTransition}
                onSubmit={handleJoin}
                className="space-y-5"
              >
                <div className="space-y-4">
                  <Field
                    id="join-email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="name@example.com"
                  />
                  <Field
                    id="transaction-id"
                    label="Transaction ID"
                    value={transactionId}
                    onChange={setTransactionId}
                    placeholder="e.g. TXN123456789"
                  />
                  <Field
                    id="plan-name"
                    label="Plan Name"
                    value={planName}
                    onChange={setPlanName}
                    placeholder="Standard"
                  />
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 md:hidden">
                  <JoinProcedureList />
                </div>

                <StatusMessage error={error} message={message} />

                <button
                  type="submit"
                  disabled={loading || success}
                  className="h-14 w-full rounded-2xl bg-green-300 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-green-500 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Saving..." : success ? "Request Saved" : "Submit Join Request"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="border-t border-slate-100 pt-6 text-center">
            <p className="text-sm font-medium text-slate-500">
              {activeMode === "login" ? "Need membership access?" : "Already have access?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(activeMode === "login" ? "join" : "login")}
                className="font-black text-primary hover:underline"
              >
                {activeMode === "login" ? "Join now" : "Login"}
              </button>
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

function LoginDetails() {
  return (
    <div className="my-12 space-y-12 md:my-0">
      <div className="space-y-4">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
          IELTS Excellence
        </span>
        <h2 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-900 lg:text-5xl">
          Unlock your <br />
          <span className="text-primary">Band 9.0</span> potential.
        </h2>
        <p className="max-w-sm text-lg font-medium leading-relaxed text-slate-500">
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
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function JoinDetails() {
  return (
    <div className="my-12 space-y-8 md:my-0">
      <div className="space-y-4">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
          Join Procedure
        </span>
        <h2 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-900 lg:text-5xl">
          Pay first. <br />
          We verify next.
        </h2>
        <p className="max-w-sm text-lg font-medium leading-relaxed text-slate-500">
          Submit the same email you want to use for Perfect Score, your payment transaction ID, and the plan name.
        </p>
      </div>

      <div className="hidden md:block">
        <JoinProcedureList />
      </div>
    </div>
  );
}

function JoinProcedureList() {
  const steps = [
    "Send the membership payment through the official Perfect Score payment channel.",
    "Copy the transaction ID exactly from your payment confirmation message.",
    "Enter your email, transaction ID, and selected plan name.",
    "Our team verifies the payment and activates access for that email.",
  ];

  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-4">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-black text-white">
            {index + 1}
          </span>
          <span className="text-sm font-semibold leading-6 text-slate-600">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 font-semibold text-slate-900 outline-none transition-all focus:border-primary focus:bg-white"
      />
    </label>
  );
}

function StatusMessage({ error, message }: { error: string; message: string }) {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-500"
      >
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{error}</span>
      </motion.div>
    );
  }

  if (message) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-xs font-bold text-green-700"
      >
        <Check className="h-4 w-4 shrink-0" />
        <span>{message}</span>
      </motion.div>
    );
  }

  return null;
}
