import type { Metadata } from "next";
import Link from "next/link";
import { hasSupabaseConfig } from "@/lib/env";
import { getAdminSession } from "@/lib/admin/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { SetupNotice } from "@/components/admin/SetupNotice";

export const metadata: Metadata = {
  title: "Admin",
  // The dashboard must never be indexed, whatever the root metadata says.
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabaseConfig()) {
    return <SetupNotice />;
  }

  const session = await getAdminSession();

  // The login page renders its own shell; everything else gets the chrome.
  if (!session) {
    return <div className="min-h-screen bg-paper">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-baseline gap-2">
              <span className="font-display text-[0.95rem] font-semibold tracking-[0.18em] text-ink">
                COASTAL
              </span>
              <span className="type-mono text-[0.55rem] text-accent">Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden text-[0.82rem] text-slate transition-colors hover:text-ink sm:block"
            >
              View site
            </Link>
            <span className="hidden text-[0.82rem] text-muted md:block">{session.email}</span>
            <form action="/admin/logout" method="post">
              <button
                type="submit"
                className="rounded-full border border-line px-3.5 py-1.5 text-[0.78rem] text-slate transition-colors hover:border-ink hover:text-ink"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <AdminNav />
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
