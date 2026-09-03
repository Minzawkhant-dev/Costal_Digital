"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { solutions } from "@/lib/content";
import { cn } from "@/lib/utils";
import { SectionHead } from "@/components/site/SectionHead";
import { ArrowLink } from "@/components/site/ui";
import { Reveal } from "@/components/motion/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Solutions() {
  const [active, setActive] = useState(0);
  const current = solutions[active];
  const chain = current.stack.split(" + ");

  return (
    <section className="section relative" id="solutions">
      <div className="shell">
        <SectionHead
          eyebrow="Solutions"
          title="Simple systems. Better business."
          description="Each outcome below is a small set of connected parts, not a pile of software."
          aside={<ArrowLink href="/solutions">See all solutions</ArrowLink>}
        />

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Selector */}
          <div className="flex flex-col">
            {solutions.map((solution, index) => {
              const selected = index === active;
              return (
                <button
                  key={solution.outcome}
                  type="button"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  aria-pressed={selected}
                  className={cn(
                    "group/item relative border-t border-line py-6 text-left transition-colors duration-400 last:border-b",
                    selected ? "text-ink" : "text-slate hover:text-ink",
                  )}
                >
                  {/* Progress rail on the active row */}
                  <motion.span
                    aria-hidden
                    className="absolute left-0 top-0 h-px origin-left bg-accent"
                    initial={false}
                    animate={{ scaleX: selected ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    style={{ width: "100%" }}
                  />

                  <div className="flex items-center gap-4">
                    <span className="type-mono text-[0.62rem] text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-display text-[1.3rem] tracking-tight sm:text-[1.55rem]">
                      {solution.outcome}
                    </span>
                    <motion.span
                      aria-hidden
                      animate={{ rotate: selected ? 45 : 0, opacity: selected ? 1 : 0.35 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="grid size-7 shrink-0 place-items-center rounded-full border border-line"
                    >
                      <Plus size={13} />
                    </motion.span>
                  </div>

                  <AnimatePresence initial={false}>
                    {selected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-md pl-10 pt-3 text-[0.92rem] leading-relaxed text-slate">
                          {solution.detail}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* Stack diagram */}
          <Reveal direction="left" className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-ink p-8 sm:p-10">
              <div aria-hidden className="tech-grid absolute inset-0 opacity-60" />
              <div
                aria-hidden
                className="absolute -right-[20%] -top-[30%] size-[24rem] rounded-full opacity-25 blur-[90px]"
                style={{ background: "radial-gradient(circle, #19b3a6, transparent 70%)" }}
              />

              <div className="relative">
                <p className="type-mono text-[0.6rem] text-paper/40">The system</p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.outcome}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <h3 className="mt-4 font-display text-[1.7rem] tracking-tight text-paper sm:text-[2.1rem]">
                      {current.outcome}
                    </h3>

                    <div className="mt-8 flex flex-col gap-2.5">
                      {chain.map((part, index) => (
                        <motion.div
                          key={part}
                          initial={{ opacity: 0, x: -14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.09, ease: EASE }}
                        >
                          <div className="flex items-center gap-3 rounded-xl border border-line-dark bg-paper/[0.04] px-4 py-3.5">
                            <span className="type-mono text-[0.55rem] text-accent-bright">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[0.9rem] text-paper/85">{part}</span>
                          </div>
                          {index < chain.length - 1 && (
                            <div className="flex justify-start py-1 pl-7">
                              <ArrowRight size={13} className="rotate-90 text-paper/25" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8 flex items-center gap-2.5 border-t border-line-dark pt-5">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-bright opacity-70" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-accent-bright" />
                      </span>
                      <span className="type-mono text-[0.58rem] text-paper/45">
                        Runs automatically, once configured
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
