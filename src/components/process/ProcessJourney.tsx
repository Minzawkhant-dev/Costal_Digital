"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { HorizontalScroll } from "@/components/motion/ScrollScene";
import { cn } from "@/lib/utils";

type Step = {
  number: string;
  title: string;
  summary: string;
  detail: string;
  outputs: readonly string[];
};

/**
 * Panel geometry, in viewport widths.
 *
 * These numbers exist twice on purpose: as Tailwind classes on the panels, so
 * the layout is correct on first paint with no JS, and here, so the track
 * travel can be derived from them. The pairs must stay in step — the comment
 * on each field names the class that has to match.
 */
const LAYOUT = {
  /** md and up — md:w-[44vw], md:mr-[2vw], md:w-[6vw] */
  wide: { panel: 44, gap: 2, pad: 6, rate: 0.58 },
  /** below md — w-[82vw], mr-[3vw], w-[5vw] */
  narrow: { panel: 82, gap: 3, pad: 5, rate: 0.72 },
} as const;

type Layout = (typeof LAYOUT)[keyof typeof LAYOUT];

/** Total track width in vw, matching the spacers and panels rendered below. */
function trackWidth(count: number, { panel, gap, pad }: Layout) {
  return count * panel + (count - 1) * gap + pad * 2;
}

/**
 * How far the track must slide, as a percentage of its own width, for the final
 * panel to land flush with the right edge rather than stopping short or
 * overshooting into empty space.
 */
function trackTravel(count: number, layout: Layout) {
  const width = trackWidth(count, layout);
  return ((width - 100) / width) * 100;
}

/**
 * The process stages as a pinned horizontal sequence: vertical scroll advances
 * the track sideways, one stage at a time.
 *
 * Every stage stays mounted, so the copy is present for search engines and
 * assistive tech regardless of scroll position. Under reduced motion
 * `HorizontalScroll` drops the pin and renders the same panels as a plain
 * swipeable row.
 */
export function ProcessJourney({ steps }: { steps: readonly Step[] }) {
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Only the scroll math reads this — the panels size themselves from CSS, so a
  // narrow viewport is laid out correctly before this effect has ever run.
  const layout = wide ? LAYOUT.wide : LAYOUT.narrow;
  const last = steps.length - 1;

  return (
    <HorizontalScroll
      pages={Math.min(4.6, steps.length * layout.rate)}
      travel={trackTravel(steps.length, layout)}
      trackClassName="items-stretch"
    >
      <div aria-hidden className="w-[5vw] shrink-0 md:w-[6vw]" />

      {steps.map((step, index) => (
        <article
          key={step.number}
          className={cn(
            "group/stage flex max-h-[76vh] w-[82vw] shrink-0 flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink/20 hover:shadow-[0_30px_60px_-34px_rgba(10,20,28,0.28)] md:w-[44vw]",
            index < last && "mr-[3vw] md:mr-[2vw]",
          )}
        >
          {/* Stage rail */}
          <div className="flex items-end justify-between border-b border-line bg-paper px-8 py-6">
            <span className="font-display text-[3rem] leading-none tracking-tighter text-accent lg:text-[3.6rem]">
              {step.number}
            </span>
            <span className="type-mono pb-1 text-[0.58rem] text-muted">
              Stage {index + 1} of {steps.length}
            </span>
          </div>

          {/* Copy */}
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-8 sm:p-9">
            <h3 className="type-h3 text-[1.5rem]">{step.title}</h3>
            <p className="text-[1rem] leading-relaxed text-ink/80">{step.summary}</p>
            <p className="text-[0.9rem] leading-relaxed text-slate">{step.detail}</p>

            <div className="mt-auto border-t border-line pt-5">
              <p className="type-mono mb-4 text-[0.58rem] text-muted">What you get</p>
              <ul className="flex flex-col gap-2.5">
                {step.outputs.map((output) => (
                  <li key={output} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span className="text-[0.86rem] leading-snug text-slate">{output}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}

      <div aria-hidden className="w-[5vw] shrink-0 md:w-[6vw]" />
    </HorizontalScroll>
  );
}
