import { NextResponse } from "next/server";
import { z } from "zod";
import { leadSchema, MIN_FILL_MS } from "@/lib/validation/lead";
import { createAdminClient } from "@/lib/supabase/admin";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { sendLeadEmails } from "@/lib/email/send";
import { dispatchToN8n } from "@/lib/n8n";
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
 *   5. notify                — emails and n8n, none of which can fail the request
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
    console.error("[leads] insert failed:", error?.message);
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

  const [emails, n8n] = await Promise.all([
    sendLeadEmails(emailData),
    dispatchToN8n({ ...emailData, source: input.source }),
  ]);

  if (!emails.client.sent) {
    console.error("[leads] confirmation email not sent:", emails.client.error);
  }
  if (!emails.admin.sent) {
    console.error("[leads] admin notification not sent:", emails.admin.error);
  }
  if (!n8n.sent) {
    console.warn("[leads] n8n dispatch skipped or failed:", n8n.error);
  }

  return NextResponse.json({
    ok: true,
    id: lead.id,
    // Lets the client soften its wording when no confirmation is on its way.
    confirmationSent: emails.client.sent,
  });
}
