"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { problems } from "@/lib/content";
import { Eyebrow } from "@/components/site/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ScrollHighlightText } from "@/components/motion/Effects";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Problems() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="tech-grid absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="absolute -left-[10%] top-[20%] size-[38rem] rounded-full opacity-[0.13] blur-[130px]"
        style={{ background: "radial-gradient(circle, #e4633f, transparent 68%)" }}
      />

      <div className="shell section relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <Eyebrow tone="light">Problems we solve</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="type-h2 mt-6 max-w-lg text-paper">
                Your business shouldn&rsquo;t be slowed down by manual work.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-10 flex items-start gap-3 rounded-2xl border border-line-dark bg-paper/[0.03] p-5">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent text-ink">
                  <ArrowRight size={14} strokeWidth={2.5} />
                </span>
                <p className="text-[0.95rem] leading-relaxed text-paper/75">
                  We turn these problems into simple digital systems.
                </p>
              </div>
            </Reveal>
          </div>

          <RevealGroup className="flex flex-col" stagger={0.07}>
            {problems.map((problem, index) => (
              <RevealItem key={problem.title}>
                <motion.div
                  className="group/row relative flex gap-5 border-t border-line-dark py-6 last:border-b"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <span className="type-mono pt-1 text-[0.62rem] text-paper/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1">
                    <h3 className="relative inline-block font-display text-[1.15rem] tracking-tight text-paper sm:text-[1.3rem]">
                      {problem.title}
                      {/* The line strikes through on hover — the problem being
                          crossed off, not merely highlighted. */}
                      <motion.span
                        aria-hidden
                        className="absolute left-0 top-1/2 h-px w-full origin-left bg-signal"
                        variants={{
                          rest: { scaleX: 0, opacity: 0 },
                          hover: { scaleX: 1, opacity: 1 },
                        }}
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    </h3>
                    <p className="mt-1.5 text-[0.9rem] leading-relaxed text-paper/50">
                      {problem.detail}
                    </p>
                  </div>
                </motion.div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="mt-20 border-t border-line-dark pt-12">
          <ScrollHighlightText
            text="Most small businesses do not have a technology problem. They have a time problem — the same tasks, repeated by hand, every single day."
            className="mx-auto max-w-4xl text-center font-display text-[1.4rem] leading-[1.4] tracking-tight text-paper sm:text-[1.9rem]"
          />
        </div>
      </div>
    </section>
  );
}
