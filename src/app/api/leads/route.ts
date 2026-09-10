import { NextResponse } from "next/server";
import { z } from "zod";
import { leadSchema, MIN_FILL_MS } from "@/lib/validation/lead";
import { createAdminClient } from "@/lib/supabase/admin";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { sendLeadEmails } from "@/lib/email/send";
import { dispatchToN8n } from "@/lib/n8n";
import { notifyIssues, notifyLeadLost, notifyTelegram, processLead } from "@/lib/crm";
import { recordEvent } from "@/lib/system-events";
import { hasServiceRole, hasSupabaseConfig } from "@/lib/env";
import type { LeadEmailData } from "@/lib/email/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/leads
 *
 * The single write path for the public site. Order matters:
 *
 *   1. shape validation      — reject malformed input before touching anything
 *   2. spam checks           — honeypot and fill-time, both cheap and silent
 *   3. rate limit            — per IP and per email, atomic in Postgres
 *   4. persist               — service role insert; RLS gives anon no write path
 *   5. notify                — emails, CRM promotion, Telegram and n8n, none of
 *                              which can fail the request
 *
 * A visitor whose lead was saved always gets a success response, even if a
 * downstream notification failed. Losing the enquiry would be the worse outcome,
 * and the row is in the database for the admin dashboard either way.
 */
export async function POST(request: Request) {
  if (!hasSupabaseConfig() || !hasServiceRole()) {
    console.error("[leads] Supabase is not configured; cannot accept submissions.");
    return NextResponse.json(
      { ok: false, error: "This form is not connected yet. Please email us directly." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const input = parsed.data;

  /* --- 2. Spam checks -----------------------------------------------------
     Both return a plain success. Telling a bot which signal caught it just
     helps whoever is writing the bot. */

  if (input.company && input.company.length > 0) {
    console.warn("[leads] honeypot triggered");
    return NextResponse.json({ ok: true, id: null });
  }

  if (typeof input.elapsedMs === "number" && input.elapsedMs < MIN_FILL_MS) {
    console.warn(`[leads] submitted too fast (${input.elapsedMs}ms)`);
    return NextResponse.json({ ok: true, id: null });
  }

  /* --- 3. Rate limiting --------------------------------------------------- */

  const ip = getClientIp(request.headers);
  const ipHash = hashIp(ip);

  const [byIp, byEmail] = await Promise.all([
    rateLimit({ identifier: ipHash, limit: 5, windowSeconds: 3600, scope: "lead:ip" }),
    rateLimit({
      identifier: input.email.toLowerCase(),
      limit: 3,
      windowSeconds: 3600,
      scope: "lead:email",
    }),
  ]);

  if (!byIp.allowed || !byEmail.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "You've sent several requests recently. Please wait a little while, or email us directly.",
      },
      { status: 429, headers: { "retry-after": "3600" } },
    );
  }

  /* --- 4. Persist --------------------------------------------------------- */

  const supabase = createAdminClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      name: input.name,
      business_name: input.businessName,
      email: input.email.toLowerCase(),
      phone: input.phone ?? null,
      business_type: input.businessType ?? null,
      website: input.website ?? null,
      service: input.service ?? null,
      budget: input.budget ?? null,
      timeline: input.timeline ?? null,
      message: input.message,
      source: input.source ?? "website",
      ip_hash: ipHash,
      user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
    })
    .select("id")
    .single();

  if (error || !lead) {
    // The only failure that loses data. Everything downstream of here can be
    // retried by hand from the dashboard; this cannot, because there is no row.
    const detail = error?.message ?? "insert returned no row";
    console.error("[leads] insert failed:", detail);
    await Promise.allSettled([
      notifyLeadLost(detail, `${input.name} — ${input.email}`),
      recordEvent({ level: "error", source: "leads.insert", message: detail }),
    ]);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your request. Please try again in a moment." },
      { status: 500 },
    );
  }

  /* --- 5. Notify ---------------------------------------------------------- */

  const emailData: LeadEmailData = {
    name: input.name,
    businessName: input.businessName,
    email: input.email,
    phone: input.phone,
    businessType: input.businessType,
    website: input.website,
    service: input.service,
    budget: input.budget,
    timeline: input.timeline,
    message: input.message,
    submittedAt: new Date(),
    leadId: lead.id,
  };

  // All four are independent and none can fail the request. The CRM promotion
  // and the Telegram alert run here rather than only inside n8n so the site is
  // complete without an always-on automation host; n8n still receives the same
  // payload, and process_lead is idempotent, so a hosted workflow doing the
  // same work duplicates nothing.
  const [emails, crm, alert, n8n] = await Promise.all([
    sendLeadEmails(emailData),
    processLead(lead.id),
    notifyTelegram(emailData),
    dispatchToN8n({ ...emailData, source: input.source }),
  ]);

  /* --- 6. Report -----------------------------------------------------------
     Everything above is best-effort, which used to mean failures existed only
     in a server log nobody reads. They now go two places: one Telegram message
     listing every step that failed, and a `system_events` row the dashboard
     reads back later.

     n8n is excluded when simply unconfigured — that is the expected state, not
     a fault, and alerting on it would train you to ignore the alert. */

  const failures: { step: string; error?: string }[] = [];
  if (!emails.client.sent) failures.push({ step: "client email", error: emails.client.error });
  if (!crm.ok) failures.push({ step: "CRM promotion", error: crm.error });
  if (!alert.sent) failures.push({ step: "telegram", error: alert.error });
  if (!n8n.sent && n8n.error && !/not configured|skipped/i.test(n8n.error)) {
    failures.push({ step: "n8n dispatch", error: n8n.error });
  }

  if (failures.length > 0) {
    for (const f of failures) console.error(`[leads] ${f.step} failed:`, f.error);
    await Promise.allSettled([
      notifyIssues({
        failures,
        leadId: lead.id,
        who: `${input.name} — ${input.businessName}`,
      }),
      ...failures.map((f) =>
        recordEvent({
          level: "error",
          source: `leads.${f.step.split(" ")[0].toLowerCase()}`,
          message: f.error ?? "failed",
          leadId: lead.id,
        }),
      ),
    ]);
  }

  return NextResponse.json({
    ok: true,
    id: lead.id,
    // Lets the client soften its wording when no confirmation is on its way.
    confirmationSent: emails.client.sent,
  });
}
