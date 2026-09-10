import { AlertTriangle, CheckCircle2, Clock, MinusCircle } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { getSystemHealth } from "@/lib/admin/queries";
import { cn, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * System monitor.
 *
 * Answers one question: is anything quietly broken?
 *
 * The lead pipeline is built so that nothing after the database insert can fail
 * the request — a missed email must never cost a real enquiry. The price of that
 * is silence: a failing integration looks exactly like a working one from the
 * outside. This is where that silence is broken.
 */
export default async function AdminSystemPage() {
  await requireAdmin();
  const health = await getSystemHealth();

  const missingRequired = health.integrations.filter((i) => i.required && !i.configured);
  const healthy = missingRequired.length === 0 && health.failuresLast24h === 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="type-h2 text-[1.9rem]">System</h1>
        <p className="mt-2 text-[0.92rem] text-slate">
          Delivery failures, follow-ups falling due, and what is configured.
        </p>
      </div>

      {/* Headline */}
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl border px-6 py-5",
          healthy
            ? "border-accent/30 bg-accent/[0.06]"
            : "border-signal/40 bg-signal/[0.07]",
        )}
      >
        {healthy ? (
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
        ) : (
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-signal" aria-hidden />
        )}
        <div>
          <p className="text-[0.95rem] font-medium text-ink">
            {healthy ? "Everything is delivering" : "Needs attention"}
          </p>
          <p className="mt-1 text-[0.86rem] leading-relaxed text-slate">
            {missingRequired.length > 0 && (
              <>
                {missingRequired.length} required integration
                {missingRequired.length === 1 ? " is" : "s are"} not configured
                {health.failuresLast24h > 0 ? ". " : "."}
              </>
            )}
            {health.failuresLast24h > 0 && (
              <>
                {health.failuresLast24h} failure
                {health.failuresLast24h === 1 ? "" : "s"} in the last 24 hours.
              </>
            )}
            {healthy && (
              <>
                No failures in the last 24 hours, and every required integration is
                connected.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Counters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Failures · 24h" value={health.failuresLast24h} tone={health.failuresLast24h > 0 ? "bad" : "ok"} />
        <Stat label="Failures · 7d" value={health.failuresLast7d} tone={health.failuresLast7d > 0 ? "warn" : "ok"} />
        <Stat label="Open follow-ups" value={health.tasksOpen} tone="neutral" />
        <Stat label="Overdue" value={health.tasksOverdue} tone={health.tasksOverdue > 0 ? "bad" : "ok"} />
      </div>

      {/* Follow-ups — every lead opens one, and until now they were only in the database. */}
      <Panel
        title="Follow-ups due next"
        note={
          health.lastLeadAt
            ? `Last enquiry ${formatDate(health.lastLeadAt)}`
            : "No enquiries yet"
        }
      >
        {health.nextTasks.length === 0 ? (
          <Empty>Nothing open. Every enquiry has been followed up.</Empty>
        ) : (
          <ul className="divide-y divide-line">
            {health.nextTasks.map((task) => {
              const overdue = task.due_at ? new Date(task.due_at).getTime() < Date.now() : false;
              return (
                <li key={task.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-4">
                  <Clock
                    size={14}
                    className={cn("shrink-0", overdue ? "text-signal" : "text-muted")}
                    aria-hidden
                  />
                  <span className="text-[0.9rem] text-ink">
                    {task.lead?.business_name ?? task.title}
                  </span>
                  {task.lead?.name && (
                    <span className="text-[0.84rem] text-slate">{task.lead.name}</span>
                  )}
                  <span
                    className={cn(
                      "type-mono ml-auto text-[0.72rem]",
                      overdue ? "text-signal" : "text-muted",
                    )}
                  >
                    {task.due_at ? (overdue ? "OVERDUE · " : "DUE ") + formatDate(task.due_at) : "NO DUE DATE"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      {/* Failures */}
      <Panel title="Recent failures" note={health.eventsTableReady ? "Newest first" : undefined}>
        {!health.eventsTableReady ? (
          <Empty>
            The <code className="text-slate">system_events</code> table is missing. Run{" "}
            <code className="text-slate">supabase/migrations/004_system_events.sql</code> in the
            Supabase SQL editor to start recording failures here. Telegram alerts work without it.
          </Empty>
        ) : health.recentEvents.length === 0 ? (
          <Empty>Nothing has failed. This is the state you want.</Empty>
        ) : (
          <ul className="divide-y divide-line">
            {health.recentEvents.map((event) => (
              <li key={event.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-6 py-4">
                <span
                  className={cn(
                    "type-mono shrink-0 text-[0.68rem] uppercase",
                    event.level === "error" ? "text-signal" : "text-muted",
                  )}
                >
                  {event.level}
                </span>
                <span className="type-mono shrink-0 text-[0.72rem] text-slate">{event.source}</span>
                <span className="min-w-0 flex-1 break-words text-[0.86rem] text-ink">
                  {event.message}
                </span>
                <span className="type-mono ml-auto shrink-0 text-[0.7rem] text-muted">
                  {formatDate(event.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* Integrations. Booleans only — the values themselves never reach the browser. */}
      <Panel title="Integrations" note="Configured or not. Values are never sent to the browser.">
        <ul className="divide-y divide-line">
          {health.integrations.map((item) => (
            <li key={item.label} className="flex items-center gap-3 px-6 py-3.5">
              {item.configured ? (
                <CheckCircle2 size={15} className="shrink-0 text-accent" aria-hidden />
              ) : item.required ? (
                <AlertTriangle size={15} className="shrink-0 text-signal" aria-hidden />
              ) : (
                <MinusCircle size={15} className="shrink-0 text-muted" aria-hidden />
              )}
              <span className="text-[0.9rem] text-ink">{item.label}</span>
              <span
                className={cn(
                  "type-mono ml-auto text-[0.72rem]",
                  item.configured ? "text-accent" : item.required ? "text-signal" : "text-muted",
                )}
              >
                {item.configured ? "CONNECTED" : item.required ? "MISSING" : "OPTIONAL"}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ok" | "warn" | "bad" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-5 py-4">
      <p className="type-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">{label}</p>
      <p
        className={cn(
          "mt-2 font-display text-[1.9rem] leading-none",
          tone === "bad" ? "text-signal" : tone === "warn" ? "text-ink" : "text-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Panel({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-6 py-4">
        <h2 className="text-[0.95rem] font-medium text-ink">{title}</h2>
        {note && <p className="type-mono text-[0.7rem] text-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-6 py-10 text-center text-[0.86rem] leading-relaxed text-muted">{children}</p>
  );
}
