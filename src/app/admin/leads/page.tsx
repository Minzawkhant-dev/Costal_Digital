import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getLeads, getLeadStatusCounts } from "@/lib/admin/queries";
import { leadStatusLabels, leadStatuses, type LeadStatus } from "@/lib/supabase/types";
import { cn, formatDate } from "@/lib/utils";
import { LeadRow } from "@/components/admin/LeadRow";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();

  const { status } = await searchParams;
  const activeStatus = leadStatuses.includes(status as LeadStatus)
    ? (status as LeadStatus)
    : undefined;

  const [leads, counts] = await Promise.all([
    getLeads({ status: activeStatus }),
    getLeadStatusCounts(),
  ]);

  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="type-h2 text-[1.9rem]">Leads</h1>
        <p className="mt-2 text-[0.92rem] text-slate">
          {total} {total === 1 ? "enquiry" : "enquiries"} in total.
        </p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <FilterChip href="/admin/leads" active={!activeStatus} label="All" count={total} />
        {leadStatuses.map((value) => (
          <FilterChip
            key={value}
            href={`/admin/leads?status=${value}`}
            active={activeStatus === value}
            label={leadStatusLabels[value]}
            count={counts[value]}
          />
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-20 text-center">
          <p className="text-[0.95rem] text-ink">No leads here yet.</p>
          <p className="mt-2 text-[0.86rem] text-muted">
            {activeStatus
              ? "Nothing in this stage right now."
              : "Submissions from the project form will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {/* Column headers, wide screens only — the rows are cards below that. */}
          <div className="hidden grid-cols-[1.4fr_1fr_0.9fr_0.9fr_auto] items-center gap-4 border-b border-line px-6 py-3 lg:grid">
            {["Business", "Contact", "Service", "Budget", ""].map((heading, index) => (
              <span key={index} className="type-mono text-[0.55rem] text-muted">
                {heading}
              </span>
            ))}
          </div>

          <ul className="divide-y divide-line">
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} formattedDate={formatDate(lead.created_at)} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.82rem] transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-surface text-slate hover:border-ink hover:text-ink",
      )}
    >
      {label}
      <span className={cn("type-mono text-[0.58rem]", active ? "text-paper/60" : "text-muted")}>
        {count}
      </span>
    </Link>
  );
}
