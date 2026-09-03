import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-[1.05rem] font-semibold tracking-[0.2em] text-ink">
            COASTAL
          </p>
          <p className="type-mono mt-1.5 text-[0.55rem] text-accent">Digital Studio &middot; Admin</p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-[0.78rem] leading-relaxed text-muted">
          Access is limited to accounts listed in the <code className="text-slate">admins</code>{" "}
          table.
        </p>
      </div>
    </div>
  );
}
