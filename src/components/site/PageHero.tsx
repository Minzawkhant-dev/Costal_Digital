import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/site/ui";
import { MaskedHeading, Reveal } from "@/components/motion/Reveal";

/**
 * Standard hero for interior pages. Keeps the top of every page on the same
 * rhythm as the home hero without repeating its 3D scene.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden pb-14 pt-28 sm:pt-32 lg:pb-20 lg:pt-40", className)}>
      <div aria-hidden className="tech-grid-light absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32"
        style={{ background: "linear-gradient(to top, var(--color-paper), transparent)" }}
      />

      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
            <MaskedHeading as="h1" text={title} className="type-display mt-6 max-w-4xl" />
          </div>

          {(description || children) && (
            <div className="lg:pb-3">
              {description && (
                <Reveal delay={0.15}>
                  <p className="type-lede max-w-lg">{description}</p>
                </Reveal>
              )}
              {children && (
                <Reveal delay={0.22}>
                  <div className="mt-7 flex flex-wrap gap-3">{children}</div>
                </Reveal>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
