"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createBrowserSupabase();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        // Deliberately generic: distinguishing "no such account" from "wrong
        // password" tells an attacker which emails are worth attacking.
        setError("Those details didn't work. Please check and try again.");
        setLoading(false);
        return;
      }

      // Refresh so the server re-reads the new session cookie before navigating.
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-7"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="admin-email" className="text-[0.82rem] text-slate">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(14,124,134,0.12)]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="admin-password" className="text-[0.82rem] text-slate">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(14,124,134,0.12)]"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-signal-soft px-3.5 py-2.5 text-[0.82rem] text-signal">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[0.88rem] font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        {loading ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
