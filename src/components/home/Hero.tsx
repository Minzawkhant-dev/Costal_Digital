"use client";

import { motion } from "framer-motion";
import { techStack } from "@/lib/content";
import { ButtonLink } from "@/components/site/ui";
import { Marquee } from "@/components/motion/Effects";
import { AmbientField } from "@/components/motion/AmbientField";
import { HeroVisual } from "@/components/home/HeroVisual";

const EASE = [0.16, 1, 0.3, 1] as const;

const line = {
  hidden: { y: "110%" },
  show: (index: number) => ({
    y: "0%",
    transition: { duration: 1.05, delay: 0.15 + index * 0.09, ease: EASE },
  }),
};

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: 0.42 + index * 0.09, ease: EASE },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-40">
      <AmbientField intensity={0.7} />
      <div aria-hidden className="tech-grid-light absolute inset-0 opacity-45" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top, var(--color-paper), transparent)" }}
      />

      <div className="shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-8">
          {/* Copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="type-mono flex items-center gap-2.5 text-muted"
            >
              <span aria-hidden className="inline-block h-px w-6 bg-line" />
              For Small &amp; Growing Businesses
            </motion.p>

            <h1 className="type-display mt-6">
              {["Work Smarter.", "Serve Better."].map((text, index) => (
                <span key={text} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    custom={index}
                    variants={line}
                    initial="hidden"
                    animate="show"
                  >
                    {index === 1 ? <em className="not-italic text-accent">{text}</em> : text}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              custom={0}
              variants={fade}
              initial="hidden"
              animate="show"
              className="type-lede mt-7 max-w-xl"
            >
              We build websites, automate workflows, and create digital solutions that help
              businesses work smarter and serve their customers better.
            </motion.p>

            <motion.div
              custom={1}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <ButtonLink href="/start-a-project" size="lg">
                Start a Project
              </ButtonLink>
              <ButtonLink href="/work" size="lg" variant="outline" icon="arrow-right">
                View Our Work
              </ButtonLink>
            </motion.div>
          </div>

          {/* 3D system visual */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <HeroVisual />
          </motion.div>
        </div>

        {/* Technology strip */}
        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-16 border-t border-line pt-7 lg:mt-24"
        >
          <p className="type-mono mb-5 text-center text-[0.6rem] text-muted">
            Built with tools your business can keep
          </p>
          <Marquee speed={38}>
            {techStack.map((tech) => (
              <span key={tech} className="type-mono whitespace-nowrap text-[0.72rem] text-slate">
                {tech}
              </span>
            ))}
          </Marquee>
        </motion.div>
      </div>
    </section>
  );
}
