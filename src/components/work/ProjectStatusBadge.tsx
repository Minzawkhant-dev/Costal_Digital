import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/projects";

/**
 * The label that says what kind of project this is.
 *
 * This replaces the old always-on DemoBadge. The studio now has delivered
 * client work alongside demonstration builds, and the two must not look the
 * same — so the status drives the wording and the colour, and there is no way
 * to render a project without it.
 */

const LABELS: Record<ProjectStatus, string> = {
  live: "Client Project · Live",
  demo: "Demo Project",
  concept: "Concept Project",
};

const TONES: Record<ProjectStatus, { dark: string; light: string }> = {
  live: {
    dark: "border-accent/35 bg-accent-soft text-accent",
    light: "border-accent-bright/40 text-accent-bright",
  },
  demo: {
    dark: "border-signal/35 bg-signal-soft text-signal",
    light: "border-paper/30 text-paper/80",
  },
  concept: {
    dark: "border-line bg-sand text-slate",
    light: "border-paper/25 text-paper/70",
  },
};

export function ProjectStatusBadge({
  status,
  tone = "dark",
  className,
}: {
  status: ProjectStatus;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "type-mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6rem] leading-none",
        TONES[status][tone],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block size-1 rounded-full bg-current",
          status === "live" && "animate-pulse",
        )}
      />
      {LABELS[status]}
    </span>
  );
}

/**
 * The sentence under the badge on a case study. Demonstration builds get an
 * explicit disclaimer; delivered work gets its provenance instead.
 */
export function StatusNote({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  if (status === "live") return null;

  return (
    <p className={cn("text-[0.86rem] leading-relaxed text-slate", className)}>
      {status === "demo"
        ? "This is a demonstration build by Coastal Digital Studio, made to show our approach and capability. It is not client work, and no figure shown is drawn from a real business."
        : "This is a concept project — a design and build exploring how a problem could be solved. It has not been deployed for a client, and no figure shown is drawn from a real business."}
    </p>
  );
}
