"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ============================================================
   Scroll-linked 3D
   ============================================================ */

/**
 * A surface that rotates through 3D space as it travels the viewport.
 *
 * The card leans away as it rises from the bottom, sits flat and closest to the
 * viewer near centre, then leans back as it leaves. Because every DepthCard
 * shares the same mapping, a column of them reads as one continuous space
 * instead of a set of unrelated tilts.
 *
 * Requires an ancestor with `.stage-3d` to supply the shared perspective.
 */
export function DepthCard({
  children,
  className,
  intensity = 1,
  lift = 1,
}: {
  children: React.ReactNode;
  className?: string;
  /** Multiplier on rotation. 0.5 is a whisper, 2 is dramatic. */
  intensity?: number;
  /** Multiplier on the Z-axis travel. */
  lift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.55,
  });

  const rotateX = useTransform(smooth, [0, 0.5, 1], [9 * intensity, 0, -7 * intensity]);
  const z = useTransform(smooth, [0, 0.5, 1], [-90 * lift, 0, -70 * lift]);
  const opacity = useTransform(smooth, [0, 0.16, 0.85, 1], [0.55, 1, 1, 0.65]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("layer-3d", className)}
      style={{ rotateX, translateZ: z, opacity } as MotionStyle}
    >
      {children}
    </motion.div>
  );
}

/**
 * Vertical parallax. `speed` is the fraction of the scroll distance the element
 * travels relative to the page: negative rises faster, positive lags behind.
 */
export function Parallax({
  children,
  className,
  speed = -0.14,
  clamp = 140,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  /** Maximum travel in px, so tall elements never drift off their section. */
  clamp?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const distance = Math.min(Math.abs(speed) * 1000, clamp) * Math.sign(speed);
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const smoothY = useSpring(y, { stiffness: 180, damping: 34, mass: 0.4 });

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={cn("will-change-transform", className)} style={{ y: smoothY }}>
      {children}
    </motion.div>
  );
}

/**
 * Scales and un-rounds as the element reaches the viewport — the "settle into
 * place" move. Good for a single hero image or mockup, not for grids.
 */
export function ScrollSettle({
  children,
  className,
  from = 0.86,
}: {
  children: React.ReactNode;
  className?: string;
  from?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 34%"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [34, 14]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [11, 0]);
  const borderRadius = useMotionTemplate`${radius}px`;

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("layer-3d overflow-hidden", className)}
      style={{ scale, borderRadius, rotateX }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   Pointer-linked 3D
   ============================================================ */

/**
 * Pointer tilt with a spring. Disabled on coarse pointers, where there is no
 * hover to drive it and the transform only causes layout jitter.
 */
export function TiltCard({
  children,
  className,
  max = 7,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Peak rotation in degrees at the corners. */
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 260, damping: 26, mass: 0.4 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.28), transparent 55%)`;

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("layer-3d relative", className)}
      style={{ rotateX, rotateY, transformPerspective: 1100 } as MotionStyle}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}

/**
 * Moves a child within a TiltCard on its own Z plane, so the card gains real
 * depth rather than tilting as a flat sheet.
 */
export function TiltLayer({
  children,
  className,
  depth = 40,
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}) {
  return (
    <div className={cn("layer-3d", className)} style={{ transform: `translateZ(${depth}px)` }}>
      {children}
    </div>
  );
}
