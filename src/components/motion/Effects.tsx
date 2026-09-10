"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/** Fixed reading-progress bar across the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
/**
 * Seamless marquee. The track holds two copies of `children` and translates by
 * exactly half its width, so the loop has no visible seam.
 */
export function Marquee({
  children,
  speed = 42,
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  /** Seconds for one full pass. Higher is slower. */
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={cn("flex flex-wrap justify-center gap-x-10 gap-y-4", className)}>{children}</div>;
  }

  return (
    <div
      className={cn("relative flex overflow-hidden", className)}
      style={{
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <motion.div
        className="flex shrink-0 items-center gap-x-12 pr-12"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        <div className="flex shrink-0 items-center gap-x-12 pr-12">{children}</div>
        <div className="flex shrink-0 items-center gap-x-12 pr-12" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Magnetic hover — the element drifts toward the cursor within `strength` px.
 * Mouse pointers only; on touch it renders as a plain wrapper.
 */
export function Magnetic({
  children,
  className,
  strength = 12,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 20, mass: 0.35 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 20, mass: 0.35 });

  const handleMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * strength);
    y.set(Math.max(-1, Math.min(1, dy)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (reduced) return <span className={className}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}

/**
 * Text whose characters brighten in sequence as the block scrolls past — used
 * once, on the positioning statement.
 */
export function ScrollHighlightText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "end 0.42"],
  });

  const words = text.split(" ");

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <HighlightWord
          key={`${word}-${index}`}
          progress={scrollYProgress}
          range={[index / words.length, (index + 1.6) / words.length]}
        >
          {word}
        </HighlightWord>
      ))}
    </p>
  );
}

function HighlightWord({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

/**
 * Adds `data-scrolled` to the element once the page has scrolled past
 * `threshold`, for headers that need to compact on scroll.
 */
export function useScrolled(threshold = 24) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > threshold);
  });

  return scrolled;
}
