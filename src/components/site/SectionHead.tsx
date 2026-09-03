import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/site/ui";
import { Reveal, MaskedHeading } from "@/components/motion/Reveal";

/**
 * Standard section header. `aside` sits on the right on wide screens — used for
 * a "view all" link so headings and their escape hatch stay on one baseline.
 */
export function SectionHead({
  eyebrow,
  title,
  description,
  aside,
  tone = "dark",
  align = "split",
  className,
  masked = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  aside?: React.ReactNode;
  tone?: "dark" | "light";
  align?: "split" | "center" | "stack";
  className?: string;
  masked?: boolean;
}) {
  const headingClass = cn("type-h2 mt-6", tone === "light" ? "text-paper" : "text-ink");

  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-3xl text-center",
        align === "split" && "grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end",
        className,
      )}
    >
      <div className={cn(align === "center" && "flex flex-col items-center")}>
        <Reveal>
          <Eyebrow tone={tone === "light" ? "light" : "dark"}>{eyebrow}</Eyebrow>
        </Reveal>

        {masked ? (
          <MaskedHeading text={title} className={cn(headingClass, "max-w-3xl")} />
        ) : (
          <Reveal delay={0.06}>
            <h2 className={cn(headingClass, "max-w-3xl")}>{title}</h2>
          </Reveal>
        )}

        {description && align !== "split" && (
          <Reveal delay={0.12}>
            <p
              className={cn(
                "type-lede mt-6 max-w-2xl",
                tone === "light" && "text-paper/60",
                align === "center" && "mx-auto",
              )}
            >
              {description}
            </p>
          </Reveal>
        )}
      </div>

      {align === "split" && (description || aside) && (
        <div className="flex flex-col items-start gap-6 lg:items-end">
          {description && (
            <Reveal delay={0.12}>
              <p className={cn("type-lede max-w-md", tone === "light" && "text-paper/60")}>
                {description}
              </p>
            </Reveal>
          )}
          {aside && <Reveal delay={0.18}>{aside}</Reveal>}
        </div>
      )}
    </div>
  );
}
