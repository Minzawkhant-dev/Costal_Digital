"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary, for a failure in the root layout itself.
 *
 * This one replaces the whole document, so it has to render its own <html> and
 * <body> — the root layout is exactly what has failed by the time it shows. For
 * the same reason it cannot rely on the site's fonts or components, and the
 * styling is inline: the stylesheet may be what went wrong.
 *
 * The marketing pages are covered by `(site)/error.tsx` first; this only runs
 * if that boundary could not itself be rendered.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global] root layout error:", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#f7f6f2",
          color: "#0a141c",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ maxWidth: "34rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#0e7c86",
            }}
          >
            Coastal Digital Studio
          </p>

          <h1
            style={{
              margin: "1rem 0 0",
              fontSize: "2rem",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              fontWeight: 600,
            }}
          >
            The site is temporarily unavailable.
          </h1>

          <p style={{ margin: "1rem 0 0", lineHeight: 1.6, color: "#4a5a68" }}>
            Something failed at a level we could not recover from. Reloading usually clears it.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2rem" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                font: "inherit",
                cursor: "pointer",
                border: "none",
                borderRadius: "999px",
                background: "#0a141c",
                color: "#f7f6f2",
                padding: "0.85rem 1.75rem",
              }}
            >
              Reload
            </button>
            <a
              // Hardcoded like the colours above, for the same reason: this
              // boundary must not import from the app it is catching. Keep in
              // step with `brand.email` in lib/content.ts.
              href="mailto:coastaldigitalocean.studio@gmail.com"
              style={{
                font: "inherit",
                borderRadius: "999px",
                border: "1px solid #e2ded4",
                color: "#0a141c",
                textDecoration: "none",
                padding: "0.85rem 1.75rem",
              }}
            >
              Email us
            </a>
          </div>

          {error.digest ? (
            <p style={{ marginTop: "2.5rem", fontSize: "0.8rem", color: "#7b8a97" }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
