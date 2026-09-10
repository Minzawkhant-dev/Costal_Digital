import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The brand logo.
 *
 * Two variants of the same lockup, because the wordmark is navy and the footer
 * sits on `bg-ink`: `logo.png` for light backgrounds, `logo-light.png` for dark.
 * Both keep the gradient mark — the dark variant recolours only the wordmark
 * rather than knocking the whole thing out to white, which would throw away the
 * one piece of brand colour the site has.
 *
 * `compact` renders the mark alone, for the mobile header where the full lockup
 * would dominate the bar. The two are separate elements rather than one
 * <picture>, because their aspect ratios differ enough that a single <img>
 * would shift the layout when the wider source loaded.
 *
 * Neither lockup carries the tagline. It used to be baked into the artwork,
 * which put it on screen at roughly 4px — illegible — and printed it twice in
 * the footer, once as pixels and again as the styled line beneath. It is real
 * text now, from `brand.tagline`, rendered where the design actually wants it.
 * The full lockup with the tagline is kept in `img/` for social and print.
 *
 * Plain <img> rather than next/image on purpose: these are small fixed-size
 * PNGs with nothing left to optimise, and it keeps the site free of any
 * dependency on a host's image pipeline. Width and height are always set, so
 * the header reserves the right space before the image arrives.
 */

const LOCKUP = { width: 602, height: 152 };
const MARK = { width: 128, height: 128 };

/* Describes the artwork, which is now the name alone. The link carries its own
   aria-label, so this is what a broken image falls back to. */
const ALT = "Coastal Digital Studio";

export function Logo({
  tone = "dark",
  compact = false,
  className,
}: {
  /** "light" for dark backgrounds — the footer. */
  tone?: "dark" | "light";
  /** Mark only, no wordmark. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Coastal Digital Studio — home"
      className={cn(
        "group/logo inline-flex items-center transition-opacity duration-300 hover:opacity-85",
        className,
      )}
    >
      {compact ? (
        <img
          src="/logo-mark.png"
          alt={ALT}
          width={MARK.width}
          height={MARK.height}
          className="h-9 w-9"
        />
      ) : (
        <img
          src={tone === "light" ? "/logo-light.png" : "/logo.png"}
          alt={ALT}
          width={LOCKUP.width}
          height={LOCKUP.height}
          className="h-10 w-auto sm:h-11"
        />
      )}
    </Link>
  );
}
