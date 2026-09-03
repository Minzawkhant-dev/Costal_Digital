import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   Button
   ============================================================ */

type Variant = "primary" | "accent" | "outline" | "light" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-ink-soft border border-ink hover:border-ink-soft",
  accent:
    "bg-accent text-white hover:bg-accent-bright border border-accent hover:border-accent-bright",
  outline:
    "bg-transparent text-ink border border-line hover:border-ink hover:bg-ink hover:text-paper",
  light:
    "bg-paper text-ink border border-paper hover:bg-white hover:border-white",
  ghost:
    "bg-transparent text-ink border border-transparent hover:bg-sand",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8rem] gap-1.5",
  md: "h-11 px-5 text-[0.875rem] gap-2",
  lg: "h-[3.25rem] px-7 text-[0.925rem] gap-2.5",
};

const base =
  "group/btn inline-flex shrink-0 items-center justify-center rounded-full font-medium transition-[background-color,border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  icon = "arrow-up-right",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: "arrow-up-right" | "arrow-right" | "none";
}) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
      <ButtonIcon icon={icon} size={size} />
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  icon = "arrow-up-right",
  ...props
}: React.ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  icon?: "arrow-up-right" | "arrow-right" | "none";
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
      <ButtonIcon icon={icon} size={size} />
    </Link>
  );
}

function ButtonIcon({ icon, size }: { icon: string; size: Size }) {
  const dimension = size === "lg" ? 17 : size === "md" ? 15 : 14;
  if (icon === "none") return null;
  if (icon === "arrow-right") {
    return (
      <ArrowRight
        size={dimension}
        className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-1"
      />
    );
  }
  return (
    <ArrowUpRight
      size={dimension}
      className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
    />
  );
}

/* ============================================================
   Text primitives
   ============================================================ */

export function Eyebrow({
  children,
  className,
  tone = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light" | "accent";
}) {
  const tones = {
    dark: "text-muted",
    light: "text-paper/55",
    accent: "text-accent",
  };

  return (
    <p className={cn("type-mono flex items-center gap-2.5", tones[tone], className)}>
      <span
        aria-hidden
        className={cn(
          "inline-block h-px w-6",
          tone === "light" ? "bg-paper/30" : tone === "accent" ? "bg-accent/50" : "bg-line",
        )}
      />
      {children}
    </p>
  );
}

export function ArrowLink({
  href,
  children,
  className,
  tone = "dark",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/link inline-flex items-center gap-2 border-b pb-1 text-[0.9rem] font-medium transition-colors duration-300",
        tone === "light"
          ? "border-paper/25 text-paper hover:border-paper"
          : "border-ink/20 text-ink hover:border-ink",
        className,
      )}
    >
      {children}
      <ArrowUpRight
        size={15}
        className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
      />
    </Link>
  );
}

/** The DEMO badge. Required on every surface that shows a project. */
export function DemoBadge({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "type-mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] leading-none",
        tone === "light"
          ? "border-paper/30 text-paper/80"
          : "border-signal/35 bg-signal-soft text-signal",
        className,
      )}
    >
      <span aria-hidden className="inline-block size-1 rounded-full bg-current" />
      Demo Project
    </span>
  );
}

/** Numbered index label used on cards and steps. */
export function Numeral({
  children,
  className,
  tone = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "type-mono text-[0.72rem]",
        tone === "light" ? "text-paper/40" : "text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
