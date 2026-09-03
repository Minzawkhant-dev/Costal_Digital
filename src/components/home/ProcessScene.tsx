"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Check } from "lucide-react";
import { processSteps } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/site/ui";
import { ScrollScene } from "@/components/motion/ScrollScene";

const EASE = [0.16, 1, 0.3, 1] as const;
const COUNT = processSteps.length;

/**
 * The process, as a pinned scroll scene.
 *
 * The section is `COUNT` viewports tall and its panel sticks for that whole
 * distance, so scrolling scrubs through the six stages rather than scrolling
 * past six stacked cards. Under reduced motion `ScrollScene` drops the pin and
 * this falls back to a static list at full progress.
 */
export function ProcessScene() {
  return (
    <ScrollScene
      id="process"
      pages={COUNT}
      className="relative bg-ink text-paper"
      panelClassName="tech-grid"
    >
      {(progress) => <SceneContent progress={progress} />}
    </ScrollScene>
  );
}

function SceneContent({ progress }: { progress: MotionValue<number> }) {
  const [active, setActive] = useState(0);

  // Progress runs 0→1 across the whole pin; slice it into equal step windows.
  useMotionValueEvent(progress, "change", (latest) => {
    const index = Math.min(COUNT - 1, Math.max(0, Math.floor(latest * COUNT)));
    setActive(index);
  });

  const step = processSteps[active];

  // The rail fills continuously rather than snapping between steps.
  const railScale = useTransform(progress, [0, 1], [0.02, 1]);

  const glowX = useTransform(progress, [0, 1], ["12%", "78%"]);
  const glowY = useTransform(progress, [0, 1], ["25%", "70%"]);

  return (
    <div className="relative w-full">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
        style={{
          left: glowX,
          top: glowY,
          background: "radial-gradient(circle, #19b3a6, transparent 68%)",
        }}
      />

      <div className="shell relative">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <Eyebrow tone="light">Process</Eyebrow>
            <h2 className="type-h2 mt-5 text-paper">From idea to launch.</h2>
          </div>
          <p className="type-mono text-[0.62rem] text-paper/40">
            {String(active + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
          </p>
        </div>

        {/* Progress rail */}
        <div className="relative mb-12">
          <div className="h-px w-full bg-line-dark" />
          <motion.div
            className="absolute left-0 top-0 h-px w-full origin-left bg-accent-bright"
            style={{ scaleX: railScale }}
          />

          <div className="absolute inset-x-0 -top-[7px] flex justify-between">
            {processSteps.map((item, index) => (
              <div key={item.number} className="flex flex-col items-center">
                <motion.span
                  className={cn(
                    "grid size-[15px] place-items-center rounded-full border transition-colors duration-500",
                    index < active
                      ? "border-accent-bright bg-accent-bright text-ink"
                      : index === active
                        ? "border-accent-bright bg-ink text-accent-bright"
                        : "border-line-dark bg-ink text-transparent",
                  )}
                  animate={{ scale: index === active ? 1.35 : 1 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  {index < active && <Check size={8} strokeWidth={4} />}
                </motion.span>
                <span
                  className={cn(
                    "type-mono mt-3 hidden text-[0.55rem] transition-colors duration-500 sm:block",
                    index === active ? "text-paper" : "text-paper/30",
                  )}
                >
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active step */}
        <div className="grid gap-8 pt-8 sm:pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <div className="flex items-baseline gap-5">
                <span className="font-display text-[3.5rem] leading-none tracking-tighter text-accent-bright sm:text-[4.5rem]">
                  {step.number}
                </span>
                <h3 className="font-display text-[1.75rem] tracking-tight text-paper sm:text-[2.4rem]">
                  {step.title}
                </h3>
              </div>

              <p className="mt-6 max-w-lg text-[1.02rem] leading-relaxed text-paper/70">
                {step.summary}
              </p>
              <p className="mt-4 max-w-lg text-[0.92rem] leading-relaxed text-paper/45">
                {step.detail}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Deliverables for the active step */}
          <div className="lg:pt-4">
            <p className="type-mono mb-5 text-[0.58rem] text-paper/35">What you get</p>
            <div className="flex flex-col gap-2.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.number}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.07 } },
                    exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                  }}
                  className="flex flex-col gap-2.5"
                >
                  {step.outputs.map((output) => (
                    <motion.div
                      key={output}
                      variants={{
                        hidden: { opacity: 0, x: 18 },
                        show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
                        exit: { opacity: 0, x: -12, transition: { duration: 0.2 } },
                      }}
                      className="flex items-center gap-3 rounded-xl border border-line-dark bg-paper/[0.04] px-4 py-3.5"
                    >
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-white">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span className="text-[0.88rem] text-paper/80">{output}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
