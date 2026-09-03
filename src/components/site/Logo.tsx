import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Wordmark. The glyph is three stacked strokes — a horizon reading, and a
 * "layers of a system" reading. It animates on hover of the whole link.
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Coastal Digital Studio — home"
      className={cn("group/logo inline-flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-[10px] border transition-colors duration-500",
          tone === "light"
            ? "border-paper/20 bg-paper/5 text-paper"
            : "border-line bg-surface text-ink",
        )}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M2 6.2c1.6-1.5 3.2-1.5 4.8 0s3.2 1.5 4.8 0 3.2-1.5 4.4 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="origin-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:translate-x-[1.2px]"
          />
          <path
            d="M2 10.4c1.6-1.5 3.2-1.5 4.8 0s3.2 1.5 4.8 0 3.2-1.5 4.4 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.55"
            className="origin-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:-translate-x-[1.2px]"
          />
          <path
            d="M2 14.6c1.6-1.5 3.2-1.5 4.8 0s3.2 1.5 4.8 0 3.2-1.5 4.4 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.28"
            className="origin-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:translate-x-[1.2px]"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[0.95rem] font-semibold tracking-[0.2em]",
            tone === "light" ? "text-paper" : "text-ink",
          )}
        >
          COASTAL
        </span>
        <span
          className={cn(
            "type-mono mt-[3px] block text-[0.5rem] tracking-[0.28em]",
            tone === "light" ? "text-paper/50" : "text-accent",
          )}
        >
          Digital Studio
        </span>
      </span>
    </Link>
  );
}
