"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A pinned scroll stage.
 *
 * The section is `pages` viewports tall; its inner panel sticks to the viewport
 * for that whole distance while `children` receives a 0→1 progress value. Use
 * it for sequences that should be *scrubbed* rather than merely revealed — the
 * process timeline, the automation workflow diagram.
 *
 * With reduced motion the pinning is dropped entirely and children render at
 * their final state (progress held at 1), so the content stays readable.
 */
export function ScrollScene({
  children,
  className,
  panelClassName,
  pages = 3,
  id,
}: {
  children: (progress: MotionValue<number>) => React.ReactNode;
  className?: string;
  panelClassName?: string;
  /** Scroll length of the pin, in viewport heights. */
  pages?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 190,
    damping: 34,
    mass: 0.4,
  });

  const staticProgress = useSpring(1, { stiffness: 1000, damping: 100 });

  if (reduced) {
    return (
      <section id={id} className={className}>
        <div className={panelClassName}>{children(staticProgress)}</div>
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={ref}
      className={cn("relative", className)}
      style={{ height: `${pages * 100}vh` }}
    >
      <div className={cn("sticky top-0 flex h-screen items-center overflow-hidden", panelClassName)}>
        {children(smooth)}
      </div>
    </section>
  );
}
/**
 * Horizontal scroll gallery driven by vertical scroll. The track slides left
 * as the pinned section is scrolled through.
 */
export function HorizontalScroll({
  children,
  className,
  trackClassName,
  pages = 2.4,
  travel = 62,
}: {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  pages?: number;
  /** How far the track moves, as a percentage of its own width. */
  travel?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${travel}%`]);
  const smoothX = useSpring(x, { stiffness: 190, damping: 36, mass: 0.5 });

  if (reduced) {
    return (
      <div className={cn("overflow-x-auto", className)}>
        <div className={cn("flex", trackClassName)}>{children}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative", className)} style={{ height: `${pages * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div className={cn("flex", trackClassName)} style={{ x: smoothX }}>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
