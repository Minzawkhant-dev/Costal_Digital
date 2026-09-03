import Link from "next/link";
import { ArrowUpRight, FileText, FolderKanban, Inbox, Wallet } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { getDashboardStats, getLeads, getLeadStatusCounts } from "@/lib/admin/queries";
import { leadStatusLabels } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";
import { StatusPill } from "@/components/admin/StatusPill";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const session = await requireAdmin();
  const [stats, recentLeads, statusCounts] = await Promise.all([
    getDashboardStats(),
    getLeads({ limit: 6 }),
    getLeadStatusCounts(),
  ]);

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: stats.currency,
    maximumFractionDigits: 0,
  });

  const cards = [
    { label: "New leads", value: String(stats.newLeads), icon: <Inbox size={17} />, href: "/admin/leads" },
    {
      label: "Active projects",
      value: String(stats.activeProjects),
      icon: <FolderKanban size={17} />,
      href: "/admin/projects",
    },
    {
      label: "Pending quotes",
      value: String(stats.pendingQuotes),
      icon: <FileText size={17} />,
      href: "/admin/leads?status=proposal",
    },
    {
      label: "Revenue this month",
      value: currency.format(stats.monthlyRevenue),
      icon: <Wallet size={17} />,
      href: "/admin/projects",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="type-h2 text-[1.9rem]">
          {session.fullName ? `Hello, ${session.fullName.split(" ")[0]}.` : "Overview"}
        </h1>
        <p className="mt-2 text-[0.92rem] text-slate">
          Where the pipeline stands right now.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-line bg-surface p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/25"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-lg border border-line bg-paper text-accent">
                {card.icon}
              </span>
              <ArrowUpRight
                size={15}
                className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
            <p className="mt-5 font-display text-[2rem] leading-none tracking-tight text-ink">
              {card.value}
            </p>
            <p className="type-mono mt-2.5 text-[0.58rem] text-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent leads */}
        <section className="rounded-2xl border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="text-[0.95rem] font-medium text-ink">Recent leads</h2>
            <Link href="/admin/leads" className="text-[0.82rem] text-accent hover:underline">
              View all
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <p className="px-6 py-12 text-center text-[0.88rem] text-muted">
              No leads yet. They&rsquo;ll appear here as soon as the form is used.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.92rem] text-ink">{lead.business_name}</p>
                    <p className="truncate text-[0.8rem] text-muted">
                      {lead.name} &middot; {lead.service ?? "No service selected"}
                    </p>
                  </div>
                  <StatusPill status={lead.status} />
                  <span className="hidden shrink-0 text-[0.78rem] text-muted sm:block">
                    {formatDate(lead.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Pipeline breakdown */}
        <section className="rounded-2xl border border-line bg-surface">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-[0.95rem] font-medium text-ink">Pipeline</h2>
          </div>
          <div className="flex flex-col gap-3 p-6">
            {(Object.keys(leadStatusLabels) as (keyof typeof leadStatusLabels)[]).map((status) => {
              const count = statusCounts[status];
              const total = Object.values(statusCounts).reduce((sum, value) => sum + value, 0);
              const percent = total > 0 ? (count / total) * 100 : 0;

              return (
                <div key={status}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[0.85rem] text-slate">{leadStatusLabels[status]}</span>
                    <span className="type-mono text-[0.7rem] text-ink">{count}</span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-line">
                    <div
                      className="h-1 rounded-full bg-accent transition-[width] duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
