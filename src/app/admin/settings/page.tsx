import { Check, X } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { brand, socials } from "@/lib/content";
import type { FaqRow, ServiceRow } from "@/lib/supabase/types";
import { FaqEditor } from "@/components/admin/FaqEditor";
import { ServiceToggles } from "@/components/admin/ServiceToggles";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const supabase = await createServerSupabase();

  const [faqResult, serviceResult] = await Promise.all([
    supabase.from("faq").select("*").order("sort_order", { ascending: true }),
    supabase.from("services").select("*").order("sort_order", { ascending: true }),
  ]);

  const faqRows = (faqResult.data ?? []) as FaqRow[];
  const serviceRows = (serviceResult.data ?? []) as ServiceRow[];

  // Booleans only. The values themselves must never reach the browser.
  const integrations = [
    { label: "Supabase", configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) },
    { label: "Service role key", configured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) },
    { label: "Resend (email)", configured: Boolean(process.env.RESEND_API_KEY) },
    { label: "Admin notification address", configured: Boolean(process.env.ADMIN_EMAIL) },
    { label: "n8n webhook", configured: Boolean(process.env.N8N_WEBHOOK_URL) },
    { label: "n8n webhook signature", configured: Boolean(process.env.N8N_WEBHOOK_SECRET) },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="type-h2 text-[1.9rem]">Settings</h1>
        <p className="mt-2 text-[0.92rem] text-slate">
          Business details, integrations, and the content shown on the public site.
        </p>
      </div>

      {/* Business information */}
      <Panel title="Business information">
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <Row label="Business name" value={brand.name} />
          <Row label="Tagline" value={brand.tagline} />
          <Row label="Contact email" value={brand.email} />
          <Row label="Audience" value={brand.audience} />
          <Row label="Social profiles" value={socials.map((s) => s.label).join(", ")} />
        </dl>
        <p className="mt-6 rounded-xl border border-line bg-paper px-4 py-3 text-[0.82rem] leading-relaxed text-muted">
          These values are set in <code className="text-slate">src/lib/content.ts</code>. They are
          used in page copy, metadata and email templates, so they are versioned with the code
          rather than edited live.
        </p>
      </Panel>

      {/* Integrations */}
      <Panel
        title="Email &amp; integrations"
        description="Whether each service is configured. Keys themselves are never displayed or sent to the browser."
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {integrations.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3"
            >
              <span className="text-[0.88rem] text-ink">{item.label}</span>
              <span
                className={`inline-flex items-center gap-1.5 text-[0.78rem] ${
                  item.configured ? "text-accent" : "text-muted"
                }`}
              >
                {item.configured ? <Check size={13} strokeWidth={3} /> : <X size={13} />}
                {item.configured ? "Configured" : "Not set"}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      {/* Services */}
      <Panel
        title="Services"
        description="Controls which services appear on the public site. Run supabase/seed.sql if this list is empty."
      >
        {serviceRows.length === 0 ? (
          <EmptyState what="services" />
        ) : (
          <ServiceToggles services={serviceRows} />
        )}
      </Panel>

      {/* FAQ */}
      <Panel
        title="FAQ"
        description="Edit answers and control which questions are published."
      >
        {faqRows.length === 0 ? (
          <EmptyState what="FAQ entries" />
        ) : (
          <FaqEditor entries={faqRows} />
        )}
      </Panel>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface">
      <div className="border-b border-line px-6 py-4">
        <h2 className="text-[0.95rem] font-medium text-ink">{title}</h2>
        {description && <p className="mt-1 text-[0.82rem] text-muted">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="type-mono text-[0.55rem] text-muted">{label}</dt>
      <dd className="mt-1.5 text-[0.9rem] text-ink">{value}</dd>
    </div>
  );
}

function EmptyState({ what }: { what: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-5 py-10 text-center">
      <p className="text-[0.9rem] text-ink">No {what} in the database yet.</p>
      <p className="mx-auto mt-2 max-w-md text-[0.83rem] leading-relaxed text-muted">
        The public site is showing the built-in copy from{" "}
        <code className="text-slate">src/lib/content.ts</code>. Run{" "}
        <code className="text-slate">supabase/seed.sql</code> to load it here and make it editable.
      </p>
    </div>
  );
}
