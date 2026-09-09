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

/** Push alert for a new lead. Silently skipped when Telegram is not configured. */
export async function notifyTelegram(data: LeadEmailData): Promise<AlertResult> {
  const token = serverEnv.telegramBotToken;
  const chatId = serverEnv.telegramChatId;
  if (!token || !chatId) return { sent: false, error: "Telegram not configured" };

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
  ].filter(Boolean);

  try {
    // A slow messaging API must not hold up the visitor's response.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
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

function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

/** MarkdownV2 rejects the whole message if any reserved character is unescaped. */
function escapeMarkdown(value: string) {
  return value.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, (char) => `\\${char}`);
}
