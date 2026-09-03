import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { serverEnv } from "@/lib/env";
import type { LeadEmailData } from "@/lib/email/templates";

/**
 * n8n dispatch.
 *
 * The form flow in the brief is:
 *   Website form → Supabase → n8n → save/update lead → client email →
 *   admin notify → follow-up task → CRM
 *
 * We do the Supabase write and the two transactional emails inline so the
 * visitor gets a confirmation even if n8n is down, then hand the same payload
 * to n8n for the CRM and follow-up steps. That keeps the visitor-facing path
 * independent of the automation platform.
 *
 * The payload is signed with HMAC-SHA256 so the n8n workflow can verify the
 * request genuinely came from this site — the webhook URL alone is not a
 * credential.
 */

export type N8nResult = { sent: boolean; error?: string };

export async function dispatchToN8n(
  data: LeadEmailData & { leadId?: string; source?: string },
): Promise<N8nResult> {
  const url = serverEnv.n8nWebhookUrl;
  if (!url) return { sent: false, error: "N8N_WEBHOOK_URL not configured" };

  const payload = JSON.stringify({
    event: "lead.created",
    leadId: data.leadId,
    submittedAt: data.submittedAt.toISOString(),
    source: data.source ?? "website",
    lead: {
      name: data.name,
      businessName: data.businessName,
      email: data.email,
      phone: data.phone ?? null,
      businessType: data.businessType ?? null,
      website: data.website ?? null,
      service: data.service ?? null,
      budget: data.budget ?? null,
      timeline: data.timeline ?? null,
      message: data.message,
    },
  });

  const headers: Record<string, string> = { "content-type": "application/json" };

  const secret = serverEnv.n8nWebhookSecret;
  if (secret) {
    headers["x-coastal-signature"] = createHmac("sha256", secret).update(payload).digest("hex");
  }

  try {
    // A slow automation platform must not hold up the visitor's response.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: payload,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { sent: false, error: `n8n responded ${response.status}` };
    }

    return { sent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "n8n request failed";
    console.error("[n8n] dispatch failed:", message);
    return { sent: false, error: message };
  }
}

/**
 * Verifies a signature on an inbound webhook, for the reverse direction —
 * n8n calling back into this app to update a lead's status.
 */
export function verifyN8nSignature(rawBody: string, signature: string | null): boolean {
  const secret = serverEnv.n8nWebhookSecret;
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");

  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
