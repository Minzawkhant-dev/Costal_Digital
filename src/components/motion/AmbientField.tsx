import { cn } from "@/lib/utils";

/**
 * Ambient light behind a hero.
 *
 * Three tinted blobs drift on long, mismatched cycles under a film-grain
 * overlay. It is atmosphere rather than an effect — at these opacities it
 * should register as depth in the background, not as something animating.
 *
 * Deliberately a server component: the whole thing is CSS, so it adds nothing
 * to the client bundle and needs no hydration before it looks right.
 *
 * Drop it into any `relative overflow-hidden` section, before the content.
 */
export function AmbientField({
  className,
  intensity = 1,
}: {
  className?: string;
  /** Scales the whole field's opacity. Below 1 for busier sections. */
  intensity?: number;
}) {
  return (
    <div aria-hidden className={cn("ambient-field grain", className)} style={{ opacity: intensity }}>
      {BLOBS.map((blob) => (
        <div
          key={blob.animation}
          className="ambient-blob"
          style={{
            left: blob.left,
            top: blob.top,
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, color-mix(in srgb, var(${blob.tint}) ${blob.strength}, transparent), transparent 70%)`,
            animation: blob.animation,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Sized in vw so the field scales with the viewport instead of tiling, and
 * anchored off-canvas so no blob shows a soft edge inside the section.
 */
const BLOBS = [
  {
    tint: "--color-accent-bright",
    strength: "42%",
    size: "48vw",
    left: "-14%",
    top: "-22%",
    animation: "ambient-drift-a 34s ease-in-out infinite",
  },
  {
    tint: "--color-accent",
    strength: "34%",
    size: "40vw",
    left: "58%",
    top: "-10%",
    animation: "ambient-drift-b 47s ease-in-out infinite",
  },
  {
    // A little warmth against the teal, or the field reads cold and flat.
    tint: "--color-signal",
    strength: "16%",
    size: "34vw",
    left: "26%",
    top: "48%",
    animation: "ambient-drift-c 41s ease-in-out infinite",
  },
] as const;
