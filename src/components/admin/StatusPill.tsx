import { cn } from "@/lib/utils";
import {
  leadStatusLabels,
  paymentStatusLabels,
  projectStatusLabels,
  type LeadStatus,
  type PaymentStatus,
  type ProjectStatus,
} from "@/lib/supabase/types";

const leadTone: Record<LeadStatus, string> = {
  new: "border-accent/30 bg-accent-soft text-accent",
  contacted: "border-line bg-paper text-slate",
  qualified: "border-line bg-paper text-slate",
  proposal: "border-signal/30 bg-signal-soft text-signal",
  won: "border-accent/40 bg-accent text-white",
  lost: "border-line bg-paper text-muted",
};

const projectTone: Record<ProjectStatus, string> = {
  planning: "border-line bg-paper text-slate",
  in_progress: "border-accent/30 bg-accent-soft text-accent",
  review: "border-signal/30 bg-signal-soft text-signal",
  launched: "border-accent/40 bg-accent text-white",
  on_hold: "border-line bg-paper text-muted",
  cancelled: "border-line bg-paper text-muted",
};

const paymentTone: Record<PaymentStatus, string> = {
  unpaid: "border-line bg-paper text-muted",
  deposit_paid: "border-line bg-paper text-slate",
  partially_paid: "border-signal/30 bg-signal-soft text-signal",
  paid: "border-accent/40 bg-accent text-white",
};

const base =
  "type-mono inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[0.58rem] leading-none";

export function StatusPill({ status }: { status: LeadStatus }) {
  return <span className={cn(base, leadTone[status])}>{leadStatusLabels[status]}</span>;
}

export function ProjectStatusPill({ status }: { status: ProjectStatus }) {
  return <span className={cn(base, projectTone[status])}>{projectStatusLabels[status]}</span>;
}

export function PaymentPill({ status }: { status: PaymentStatus }) {
  return <span className={cn(base, paymentTone[status])}>{paymentStatusLabels[status]}</span>;
}
