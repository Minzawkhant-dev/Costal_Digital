"use client";

import { useEffect } from "react";
import { ButtonLink, Eyebrow } from "@/components/site/ui";

/**
 * Error boundary for the marketing pages.
 *
 * Renders inside `(site)/layout.tsx`, so the header and footer stay put and a
 * visitor who hits a failure can still navigate rather than staring at Next's
 * default error screen.
 *
 * Error boundaries must be Client Components — React needs to catch the throw
 * during render on the client and re-render this in place.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is the only thing tying this screen to a server log line.
    console.error("[site] render error:", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="relative overflow-hidden pb-24 pt-32 sm:pt-40">
      <div aria-hidden className="tech-grid-light absolute inset-0 opacity-40" />

      <div className="shell relative">
        <Eyebrow>Something went wrong</Eyebrow>

        <h1 className="type-display mt-6 max-w-3xl">This page failed to load.</h1>

        <p className="type-lede mt-6 max-w-xl text-slate">
          The problem is on our side, not yours. Trying again usually works — if it doesn&apos;t,
          the enquiry form is the fastest way to reach us.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[0.95rem] text-paper transition-transform duration-300 hover:-translate-y-0.5"
          >
            Try again
          </button>
          <ButtonLink href="/" variant="outline" size="lg">
            Back to home
          </ButtonLink>
        </div>

        {/* Shown only when present — it is what makes a report traceable. */}
        {error.digest ? (
          <p className="type-mono mt-12 text-[0.78rem] text-muted">
            Reference: {error.digest}
          </p>
        ) : null}
      </div>
    </section>
  );
}
