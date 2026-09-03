"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-drawn workflow diagram.
 *
 * The connectors draw themselves and each node lights up as the section is
 * scrolled through, so the sequence is read in the order it actually runs
 * rather than taken in all at once. This is the "workflow diagram" the brand
 * direction asks for — an explanation, not decoration.
 *
 * Under reduced motion the whole thing renders complete and static.
 */

export type WorkflowNode = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  tone?: "default" | "accent" | "signal";
};

export type WorkflowEdge = {
  from: string;
  to: string;
  /** SVG path. Drawn in node-coordinate space. */
  d: string;
};

const NODE_W = 150;
const NODE_H = 64;

const nodes: WorkflowNode[] = [
  { id: "form", label: "Website form", sub: "Customer enquiry", x: 20, y: 138, tone: "accent" },
  { id: "db", label: "Lead saved", sub: "Database", x: 225, y: 138 },
  { id: "flow", label: "Automation", sub: "n8n workflow", x: 430, y: 138, tone: "accent" },
  { id: "email", label: "Client email", sub: "Confirmation", x: 680, y: 40 },
  { id: "admin", label: "Team notified", sub: "Email + LINE", x: 680, y: 138 },
  { id: "task", label: "Follow-up task", sub: "CRM", x: 680, y: 236, tone: "signal" },
];

const edges: WorkflowEdge[] = [
  { from: "form", to: "db", d: "M170 170 H225" },
  { from: "db", to: "flow", d: "M375 170 H430" },
  { from: "flow", to: "email", d: "M580 170 C632 170 628 72 680 72" },
  { from: "flow", to: "admin", d: "M580 170 H680" },
  { from: "flow", to: "task", d: "M580 170 C632 170 628 268 680 268" },
];

/** Order in which things light up: node, node, edge, node… */
const sequence = [
  { kind: "node", id: "form" },
  { kind: "edge", id: "form-db" },
  { kind: "node", id: "db" },
  { kind: "edge", id: "db-flow" },
  { kind: "node", id: "flow" },
  { kind: "edge", id: "flow-email" },
  { kind: "edge", id: "flow-admin" },
  { kind: "edge", id: "flow-task" },
  { kind: "node", id: "email" },
  { kind: "node", id: "admin" },
  { kind: "node", id: "task" },
] as const;

const step = 1 / sequence.length;

function rangeFor(kind: "node" | "edge", id: string): [number, number] {
  const index = sequence.findIndex((item) => item.kind === kind && item.id === id);
  const start = index * step;
  // Overlap each item slightly with the next so the sequence flows rather than
  // ticking discretely.
  return [start, Math.min(1, start + step * 1.6)];
}

export function WorkflowDiagram({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 34,
    mass: 0.4,
  });

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {/* The diagram has a natural minimum width; let it scroll rather than
          shrink its labels into illegibility on a phone. */}
      <div className="-mx-1 overflow-x-auto pb-2">
        <svg
          viewBox="0 0 850 340"
          className="h-auto w-full min-w-[680px]"
          role="img"
          aria-label="Workflow: a website form saves a lead, which triggers an automation that sends a client confirmation, notifies the team, and creates a follow-up task."
        >
          <defs>
            <marker
              id="wf-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" fill="rgba(25,179,166,0.85)" />
            </marker>
          </defs>

          {/* Edges first, so nodes sit on top of the line ends. */}
          {edges.map((edge) => (
            <Edge
              key={`${edge.from}-${edge.to}`}
              edge={edge}
              progress={progress}
              reduced={Boolean(reduced)}
            />
          ))}

          {nodes.map((node) => (
            <Node key={node.id} node={node} progress={progress} reduced={Boolean(reduced)} />
          ))}
        </svg>
      </div>
    </div>
  );
}

function Edge({
  edge,
  progress,
  reduced,
}: {
  edge: WorkflowEdge;
  progress: ReturnType<typeof useSpring>;
  reduced: boolean;
}) {
  const [start, end] = rangeFor("edge", `${edge.from}-${edge.to}`);
  const pathLength = useTransform(progress, [start, end], [0, 1]);

  if (reduced) {
    return (
      <path
        d={edge.d}
        fill="none"
        stroke="rgba(25,179,166,0.55)"
        strokeWidth="1.5"
        markerEnd="url(#wf-arrow)"
      />
    );
  }

  return (
    <g>
      {/* Static rail, so the route is legible before it is traced. */}
      <path d={edge.d} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" />
      <motion.path
        d={edge.d}
        fill="none"
        stroke="rgba(25,179,166,0.85)"
        strokeWidth="1.5"
        strokeLinecap="round"
        markerEnd="url(#wf-arrow)"
        style={{ pathLength }}
      />
    </g>
  );
}

function Node({
  node,
  progress,
  reduced,
}: {
  node: WorkflowNode;
  progress: ReturnType<typeof useSpring>;
  reduced: boolean;
}) {
  const [start, end] = rangeFor("node", node.id);

  const opacity = useTransform(progress, [start, end], [0.25, 1]);
  const y = useTransform(progress, [start, end], [10, 0]);
  // Declared here, not inline in JSX: the early return below would otherwise
  // make it a conditional hook call.
  const haloOpacity = useTransform(progress, [start, end], [0, 0.09]);

  const stroke =
    node.tone === "accent"
      ? "rgba(25,179,166,0.55)"
      : node.tone === "signal"
        ? "rgba(228,99,63,0.5)"
        : "rgba(255,255,255,0.14)";

  const dotFill =
    node.tone === "accent" ? "#19b3a6" : node.tone === "signal" ? "#e4633f" : "rgba(255,255,255,0.5)";

  const content = (
    <>
      <rect
        width={NODE_W}
        height={NODE_H}
        rx="12"
        fill="rgba(255,255,255,0.05)"
        stroke={stroke}
        strokeWidth="1"
      />
      <circle cx="18" cy="24" r="3.5" fill={dotFill} />
      <text
        x="32"
        y="28"
        fill="rgba(247,246,242,0.95)"
        fontSize="13"
        fontFamily="var(--font-inter-tight), sans-serif"
        fontWeight="500"
      >
        {node.label}
      </text>
      <text
        x="18"
        y="46"
        fill="rgba(247,246,242,0.42)"
        fontSize="10"
        fontFamily="var(--font-mono-space), monospace"
        letterSpacing="0.06em"
      >
        {node.sub}
      </text>
    </>
  );

  if (reduced) {
    return <g transform={`translate(${node.x} ${node.y})`}>{content}</g>;
  }

  // Position with a plain transform on the outer <g>; animate only the offset
  // on the inner one, so the two never fight over the same transform.
  return (
    <g transform={`translate(${node.x} ${node.y})`}>
      <motion.g style={{ opacity, y }}>
        {/* Soft halo that fades in with the node. */}
        <motion.rect
          width={NODE_W}
          height={NODE_H}
          rx="12"
          fill="none"
          stroke={dotFill}
          strokeWidth="6"
          style={{ opacity: haloOpacity }}
        />
        {content}
      </motion.g>
    </g>
  );
}
