import { createServerSupabase } from "@/lib/supabase/server";
import type { Lead, LeadStatus, Project } from "@/lib/supabase/types";

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
