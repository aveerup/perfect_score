"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<RedirectFallback />}>
      <LoginRedirect />
    </Suspense>
  );
}

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get("mode") === "join" ? "join" : "login";
    router.replace(`/?auth=${mode}#auth`);
  }, [router, searchParams]);

  return <RedirectFallback />;
}

function RedirectFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Opening Perfect Score...</p>
    </main>
  );
}
