import Link from "next/link";

/**
 * Shown when Supabase env vars are absent, so a fresh clone renders something
 * useful instead of throwing on a missing key.
 */
export function SetupNotice() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6">
      <div className="w-full max-w-lg rounded-2xl border border-line bg-surface p-8">
        <p className="type-mono text-[0.6rem] text-accent">Setup required</p>
        <h1 className="type-h3 mt-4">The dashboard is not connected yet.</h1>
        <p className="mt-4 text-[0.92rem] leading-relaxed text-slate">
          Add your Supabase credentials to <code className="text-ink">.env.local</code>, then run{" "}
          <code className="text-ink">supabase/schema.sql</code> in the Supabase SQL editor.
        </p>

        <div className="mt-6 rounded-xl border border-line bg-paper p-4">
          <pre className="overflow-x-auto text-[0.78rem] leading-relaxed text-slate">
{`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...`}
          </pre>
        </div>

        <p className="mt-6 text-[0.85rem] text-muted">
          Full instructions are in <code className="text-ink">README.md</code>.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex h-10 items-center rounded-full border border-line px-5 text-[0.85rem] text-ink transition-colors hover:border-ink"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
