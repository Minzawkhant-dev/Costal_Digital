import { createServerSupabase } from "@/lib/supabase/server";
import type {
  FollowUpTask,
  Lead,
  LeadStatus,
  Project,
  SystemEvent,
} from "@/lib/supabase/types";

/**
 * Admin data access.
 *
 * Everything here goes through the *user-scoped* client, so RLS re-checks admin
 * membership on every query. The service-role client is deliberately not used:
 * a bug in a page should not be able to read data the signed-in user cannot.
 */

export type DashboardStats = {
  newLeads: number;
  activeProjects: number;
  pendingQuotes: number;
  monthlyRevenue: number;
  currency: string;
};

const ACTIVE_PROJECT_STATUSES = ["planning", "in_progress", "review"] as const;

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerSupabase();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [newLeads, activeProjects, pendingQuotes, paidThisMonth] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),

    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .in("status", [...ACTIVE_PROJECT_STATUSES]),

    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "proposal"),

    // Revenue recognised this month = projects marked paid whose record was
    // last updated this month. Simple and honest about what it measures.
    supabase
      .from("projects")
      .select("budget")
      .eq("payment", "paid")
      .gte("updated_at", startOfMonth.toISOString()),
  ]);

  const monthlyRevenue = (paidThisMonth.data ?? []).reduce(
    (total, row) => total + Number(row.budget ?? 0),
    0,
  );

  return {
    newLeads: newLeads.count ?? 0,
    activeProjects: activeProjects.count ?? 0,
    pendingQuotes: pendingQuotes.count ?? 0,
    monthlyRevenue,
    currency: "THB",
  };
}

export async function getLeads({
  status,
  limit = 100,
}: { status?: LeadStatus; limit?: number } = {}): Promise<Lead[]> {
  const supabase = await createServerSupabase();

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) {
    console.error("[admin] getLeads failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getLeadStatusCounts(): Promise<Record<LeadStatus, number>> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("leads").select("status");

  const counts = {
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    won: 0,
    lost: 0,
  } satisfies Record<LeadStatus, number>;

  if (error || !data) return counts;

  for (const row of data) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

export type ProjectWithLead = Project & {
  leads: { name: string; business_name: string } | null;
};

export async function getProjects(): Promise<ProjectWithLead[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("projects")
    .select("*, leads ( name, business_name )")
    .order("deadline", { ascending: true, nullsFirst: false })
    .limit(200);

  if (error) {
    console.error("[admin] getProjects failed:", error.message);
    return [];
  }

  return (data ?? []) as unknown as ProjectWithLead[];
}

/* ============================================================
   System monitor
   ============================================================ */

export type SystemHealth = {
  /** Integrations, as booleans. The values themselves never reach the browser. */
  integrations: { label: string; configured: boolean; required: boolean }[];
  /** Whether migration 004 has actually been run. */
  eventsTableReady: boolean;
  recentEvents: SystemEvent[];
  failuresLast24h: number;
  failuresLast7d: number;
  tasksOpen: number;
  tasksOverdue: number;
  nextTasks: (FollowUpTask & { lead: Pick<Lead, "name" | "business_name" | "email"> | null })[];
  lastLeadAt: string | null;
};

/**
 * Everything the system monitor needs, in one pass.
 *
 * Reads through the user-scoped client like every other query here, so RLS
 * re-checks admin membership rather than trusting the page that called it.
 *
 * Degrades rather than throws. A missing `system_events` table means migration
 * 004 has not been run yet, which is worth reporting on the page rather than
 * turning into a 500 — the rest of the monitor is still useful without it.
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  const supabase = await createServerSupabase();

  const now = Date.now();
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  const nowIso = new Date(now).toISOString();

  const [events, day, week, open, overdue, next, lastLead] = await Promise.all([
    supabase
      .from("system_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("system_events")
      .select("id", { count: "exact", head: true })
      .eq("level", "error")
      .gte("created_at", dayAgo),
    supabase
      .from("system_events")
      .select("id", { count: "exact", head: true })
      .eq("level", "error")
      .gte("created_at", weekAgo),
    supabase
      .from("follow_up_tasks")
      .select("id", { count: "exact", head: true })
      .in("status", ["open", "in_progress"]),
    supabase
      .from("follow_up_tasks")
      .select("id", { count: "exact", head: true })
      .in("status", ["open", "in_progress"])
      .lt("due_at", nowIso),
    supabase
      .from("follow_up_tasks")
      .select("*, lead:leads(name, business_name, email)")
      .in("status", ["open", "in_progress"])
      .order("due_at", { ascending: true })
      .limit(8),
    supabase
      .from("leads")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    integrations: [
      { label: "Supabase", configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL), required: true },
      { label: "Service role key", configured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY), required: true },
      { label: "Resend (client email)", configured: Boolean(process.env.RESEND_API_KEY), required: true },
      { label: "Sending address", configured: Boolean(process.env.EMAIL_FROM), required: true },
      { label: "Reply-to address", configured: Boolean(process.env.ADMIN_EMAIL), required: true },
      { label: "Telegram bot", configured: Boolean(process.env.TELEGRAM_BOT_TOKEN), required: true },
      { label: "Telegram chat", configured: Boolean(process.env.TELEGRAM_CHAT_ID), required: true },
      { label: "IP hash salt", configured: Boolean(process.env.IP_HASH_SALT), required: false },
      { label: "n8n webhook", configured: Boolean(process.env.N8N_WEBHOOK_URL), required: false },
    ],
    eventsTableReady: !events.error,
    recentEvents: (events.data ?? []) as SystemEvent[],
    failuresLast24h: day.count ?? 0,
    failuresLast7d: week.count ?? 0,
    tasksOpen: open.count ?? 0,
    tasksOverdue: overdue.count ?? 0,
    nextTasks: (next.data ?? []) as SystemHealth["nextTasks"],
    lastLeadAt: lastLead.data?.created_at ?? null,
  };
}
