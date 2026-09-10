import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { serverEnv } from "@/lib/env";
import type { LeadEmailData } from "@/lib/email/templates";

/**
 * The CRM and alerting steps, run in-process.
 *
 * These are the two things the n8n workflow does that the visitor-facing path
 * did not: turn a lead into a CRM contact with a follow-up task, and push an
 * alert to the admin. Doing them here means the site needs no always-on
 * automation host to be fully functional — a self-hosted n8n is then an
 * enhancement rather than a dependency.
 *
 * Both are non-throwing for the same reason as the emails: by the time they
 * run, the lead is already saved, and a failure here must not turn a captured
 * enquiry into an error for the visitor.
 */

export type CrmResult = {
  ok: boolean;
  contactId?: string;
  taskId?: string;
  error?: string;
};

/**
 * Promotes a saved lead into a contact plus a follow-up task.
 *
 * Idempotent in the database: calling it twice for one lead returns the same
 * contact and task rather than duplicating either, so a retry is safe.
 */
export async function processLead(leadId: string, dueHours = 24): Promise<CrmResult> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("process_lead", {
      p_lead_id: leadId,
      p_due_hours: dueHours,
    });

    if (error) {
      console.error("[crm] process_lead failed:", error.message);
      return { ok: false, error: error.message };
    }

    const result = (data ?? {}) as { contactId?: string; taskId?: string };
    return { ok: true, contactId: result.contactId, taskId: result.taskId };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "process_lead threw";
    console.error("[crm] process_lead threw:", message);
    return { ok: false, error: message };
  }
}

export type AlertResult = { sent: boolean; error?: string };

/**
 * One place that actually talks to Telegram.
 *
 * Both the new-lead alert and the failure alert go through here, so the timeout
 * and the "never throw" contract are stated once. Four seconds: a slow
 * messaging API must not hold up the visitor's response.
 */
async function sendTelegram(text: string): Promise<AlertResult> {
  const token = serverEnv.telegramBotToken;
  const chatId = serverEnv.telegramChatId;
  if (!token || !chatId) return { sent: false, error: "Telegram not configured" };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      const message = `Telegram responded ${response.status}: ${body.slice(0, 200)}`;
      console.error("[crm]", message);
      return { sent: false, error: message };
    }

    return { sent: true };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Telegram request failed";
    console.error("[crm] telegram failed:", message);
    return { sent: false, error: message };
  }
}

/**
 * Alert that something failed after the lead was already saved.
 *
 * One message listing everything that went wrong, not one per failure — the
 * point of routing these to Telegram is that they get read, and three
 * notifications for one enquiry is how that stops happening.
 *
 * Never reports a Telegram failure to Telegram, for obvious reasons. That case
 * is left to the server log and the dashboard's system monitor.
 */
export async function notifyIssues({
  failures,
  leadId,
  who,
}: {
  failures: { step: string; error?: string }[];
  leadId?: string;
  who?: string;
}): Promise<AlertResult> {
  const real = failures.filter((f) => f.step !== "telegram");
  if (real.length === 0) return { sent: false, error: "nothing to report" };

  const lines = [
    "*⚠️ Lead saved, but something failed*",
    "",
    who ? `Enquiry: ${escapeMarkdown(who)}` : null,
    leadId ? `Lead: \`${escapeMarkdown(leadId)}\`` : null,
    "",
    ...real.map((f) => `• *${escapeMarkdown(f.step)}* — ${escapeMarkdown(truncate(f.error ?? "failed", 180))}`),
    "",
    escapeMarkdown("The enquiry is safe in the dashboard. Follow up manually if the client was not emailed."),
  ].filter(Boolean) as string[];

  return sendTelegram(lines.join("\n"));
}

/** Alert that an enquiry was lost outright — the one failure that loses data. */
export async function notifyLeadLost(detail: string, who?: string): Promise<AlertResult> {
  const lines = [
    "*🚨 An enquiry was NOT saved*",
    "",
    who ? `From: ${escapeMarkdown(who)}` : null,
    `Reason: ${escapeMarkdown(truncate(detail, 300))}`,
    "",
    escapeMarkdown("This one is not in the dashboard. Contact them directly if you have their details."),
  ].filter(Boolean) as string[];

  return sendTelegram(lines.join("\n"));
}

/** Push alert for a new lead. Silently skipped when Telegram is not configured. */
export async function notifyTelegram(data: LeadEmailData): Promise<AlertResult> {
  const lines = [
    "*New project lead*",
    "",
    `*${escapeMarkdown(data.businessName)}*`,
    `${escapeMarkdown(data.name)} — ${escapeMarkdown(data.email)}`,
    data.phone ? `Phone: ${escapeMarkdown(data.phone)}` : null,
    data.service ? `Service: ${escapeMarkdown(data.service)}` : null,
    data.budget ? `Budget: ${escapeMarkdown(data.budget)}` : null,
    data.timeline ? `Timeline: ${escapeMarkdown(data.timeline)}` : null,
    "",
    escapeMarkdown(truncate(data.message, 400)),
  ].filter(Boolean) as string[];

  return sendTelegram(lines.join("\n"));
}

function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

/** MarkdownV2 rejects the whole message if any reserved character is unescaped. */
function escapeMarkdown(value: string) {
  return value.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, (char) => `\\${char}`);
}
