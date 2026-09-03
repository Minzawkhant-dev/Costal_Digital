"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { CalendarCheck, Check, Mail, TrendingUp, Workflow } from "lucide-react";

/**
 * The hero system diagram.
 *
 * Four surfaces sit on separate Z planes inside one shared perspective. Scroll
 * pushes them apart and rotates the stage; the pointer adds a small parallax on
 * top. The point it makes visually is the point the copy makes in words — a
 * website, a booking, an automation and a dashboard are one connected system.
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scroll = useSpring(scrollYProgress, { stiffness: 150, damping: 32, mass: 0.5 });

  // Pointer parallax, normalised to -1..1 around the centre of the stage.
  const pointerX = useSpring(useMotionValue(0), { stiffness: 130, damping: 22, mass: 0.5 });
  const pointerY = useSpring(useMotionValue(0), { stiffness: 130, damping: 22, mass: 0.5 });

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handleLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  // Stage rotation: a gentle lean that flattens out as you scroll away.
  const stageRotateX = useTransform([scroll, pointerY] as const, ([s, p]: number[]) => 7 - s * 9 + p * -4);
  const stageRotateY = useTransform([scroll, pointerX] as const, ([s, p]: number[]) => -5 + s * 4 + p * 6);
  const stageY = useTransform(scroll, [0, 1], [0, -70]);

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="stage-3d relative mx-auto h-[26rem] w-full max-w-[38rem] sm:h-[30rem] lg:h-[34rem] lg:max-w-none"
    >
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
        style={{
          background: "radial-gradient(circle, rgba(25,179,166,0.30), rgba(14,124,134,0.10) 45%, transparent 70%)",
          opacity: useTransform(scroll, [0, 1], [1, 0.35]),
        }}
      />

      <motion.div
        className="layer-3d absolute inset-0"
        style={{
          rotateX: reduced ? 0 : stageRotateX,
          rotateY: reduced ? 0 : stageRotateY,
          y: reduced ? 0 : stageY,
        }}
      >
        {/* --- Base plane: the website --- */}
        <Plane scroll={scroll} depth={0} reduced={reduced} className="absolute inset-x-[7%] top-[12%]">
          <BrowserMockup />
        </Plane>

        {/* --- Booking confirmation --- */}
        <Plane
          scroll={scroll}
          depth={110}
          reduced={reduced}
          className="absolute -right-[2%] top-[2%] w-[13.5rem] sm:w-[15rem]"
        >
          <FloatCard delay={0.15}>
            <CardHead icon={<CalendarCheck size={13} />} label="Booking" status="Confirmed" tone="accent" />
            <p className="mt-3 font-display text-[1.05rem] tracking-tight text-ink">Table for 4</p>
            <p className="mt-0.5 text-[0.72rem] text-muted">Fri 14 &middot; 19:30</p>
            <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-2.5 text-[0.66rem] text-accent">
              <Check size={11} strokeWidth={3} />
              Confirmation sent automatically
            </div>
          </FloatCard>
        </Plane>

        {/* --- Automation workflow --- */}
        <Plane
          scroll={scroll}
          depth={165}
          reduced={reduced}
          className="absolute -left-[5%] top-[54%] w-[12rem] sm:w-[13rem]"
        >
          <FloatCard delay={0.3}>
            <CardHead icon={<Workflow size={13} />} label="Automation" status="Running" tone="ink" />
            <div className="mt-3 flex flex-col gap-1.5">
              <FlowRow label="Form received" done />
              <FlowRow label="Saved to CRM" done />
              <FlowRow label="Email sent" done />
              <FlowRow label="Task created" />
            </div>
          </FloatCard>
        </Plane>

        {/* --- Dashboard metric --- */}
        <Plane
          scroll={scroll}
          depth={205}
          reduced={reduced}
          className="absolute -right-[1%] bottom-[6%] w-[12rem] sm:w-[13rem]"
        >
          <FloatCard delay={0.45}>
            <CardHead icon={<TrendingUp size={13} />} label="This week" status="Live" tone="accent" />
            <p className="mt-3 font-display text-[1.6rem] leading-none tracking-tight text-ink">+38%</p>
            <p className="mt-1 text-[0.7rem] text-muted">Online bookings</p>
            <Sparkline />
          </FloatCard>
        </Plane>

        {/* --- Inbox pill --- */}
        <Plane
          scroll={scroll}
          depth={250}
          reduced={reduced}
          className="absolute bottom-[3%] left-[22%] hidden sm:block"
        >
          <FloatCard delay={0.6} className="flex items-center gap-2 !px-3 !py-2">
            <span className="grid size-6 place-items-center rounded-full bg-signal-soft text-signal">
              <Mail size={11} />
            </span>
            <span className="type-mono text-[0.58rem] text-slate">3 new leads</span>
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
            </span>
          </FloatCard>
        </Plane>
      </motion.div>
    </div>
  );
}

/** One Z-plane. `depth` is its resting distance toward the viewer. */
function Plane({
  children,
  className,
  scroll,
  depth,
  reduced,
}: {
  children: React.ReactNode;
  className?: string;
  scroll: MotionValue<number>;
  depth: number;
  reduced: boolean | null;
}) {
  // Planes spread further apart as the hero scrolls away, so the flat
  // composition resolves into visible depth rather than simply sliding.
  const z = useTransform(scroll, [0, 1], [depth, depth * 2.1]);
  const y = useTransform(scroll, [0, 1], [0, depth * -0.32]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div className={`layer-3d ${className ?? ""}`} style={{ translateZ: z, y }}>
      {children}
    </motion.div>
  );
}

function FloatCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.5 + delay, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl border border-line/80 bg-surface/90 px-4 py-3.5 shadow-[0_18px_40px_-14px_rgba(10,20,28,0.22)] backdrop-blur-md ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

function CardHead({
  icon,
  label,
  status,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  status: string;
  tone: "accent" | "ink";
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5">
        <span
          className={`grid size-5 place-items-center rounded-md ${
            tone === "accent" ? "bg-accent-soft text-accent" : "bg-sand text-ink"
          }`}
        >
          {icon}
        </span>
        <span className="type-mono text-[0.55rem] text-muted">{label}</span>
      </span>
      <span className="type-mono text-[0.5rem] text-accent">{status}</span>
    </div>
  );
}

function FlowRow({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`grid size-3.5 shrink-0 place-items-center rounded-full ${
          done ? "bg-accent text-white" : "border border-dashed border-line bg-transparent"
        }`}
      >
        {done && <Check size={8} strokeWidth={4} />}
      </span>
      <span className={`text-[0.68rem] ${done ? "text-slate" : "text-muted"}`}>{label}</span>
    </div>
  );
}

function Sparkline() {
  return (
    <svg viewBox="0 0 100 26" className="mt-2.5 w-full" fill="none" aria-hidden>
      <motion.path
        d="M0 21 L14 17 L28 19 L42 12 L56 14 L70 7 L84 9 L100 2"
        stroke="#0e7c86"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

/** The website plane — a simplified browser frame with a restaurant page in it. */
function BrowserMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_40px_80px_-30px_rgba(10,20,28,0.35)]"
    >
      <div className="flex items-center gap-1.5 border-b border-line bg-paper px-3 py-2">
        <span className="size-1.5 rounded-full bg-line" />
        <span className="size-1.5 rounded-full bg-line" />
        <span className="size-1.5 rounded-full bg-line" />
        <span className="type-mono ml-2 truncate text-[0.5rem] text-muted">yourbusiness.com</span>
      </div>

      <div className="relative aspect-[16/10] bg-ink">
        <div aria-hidden className="tech-grid absolute inset-0 opacity-70" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 70% 15%, rgba(25,179,166,0.35), transparent 55%), linear-gradient(to top, rgba(10,20,28,0.9), transparent)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="type-mono text-[0.45rem] text-paper/60">YOUR BUSINESS</span>
            <div className="hidden gap-3 sm:flex">
              {["Menu", "About", "Book"].map((item) => (
                <span key={item} className="text-[0.5rem] text-paper/45">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-[1.35rem] leading-[1.05] tracking-tight text-paper sm:text-[1.75rem]">
              Good food.
              <br />
              Good company.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-accent-bright px-3 py-1.5 text-[0.55rem] font-medium text-ink">
                Book a table
              </span>
              <span className="rounded-full border border-paper/25 px-3 py-1.5 text-[0.55rem] text-paper/70">
                View menu
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
