import "server-only";

import { Resend } from "resend";
import { serverEnv } from "@/lib/env";
import {
  clientConfirmationHtml,
  clientConfirmationSubject,
  clientConfirmationText,
  type LeadEmailData,
} from "@/lib/email/templates";

/**
 * Email dispatch.
 *
 * One email, to the customer. The studio is told about a new enquiry on
 * Telegram instead — an admin email as well meant being notified twice for the
 * same event, which trains you to ignore both.
 *
 * `ADMIN_EMAIL` is still read, as the reply-to on the confirmation: the message
 * is sent from an address with no mailbox behind it, so without this a customer
 * replying to their own confirmation would be writing into nowhere.
 *
 * Deliberately non-throwing. The lead is already saved by the time this runs,
 * so a Resend outage must not turn a captured enquiry into a 500 for the
 * visitor. The failure is returned, and the caller reports it.
 */

export type EmailResult = {
  client: { sent: boolean; error?: string };
};

let client: Resend | null = null;

function getResend() {
  const key = serverEnv.resendApiKey;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export async function sendLeadEmails(data: LeadEmailData): Promise<EmailResult> {
  const resend = getResend();

  if (!resend) {
    return { client: { sent: false, error: "RESEND_API_KEY not configured" } };
  }

  const [clientResult] = await Promise.allSettled([
    resend.emails.send({
      from: serverEnv.emailFrom,
      to: data.email,
      subject: clientConfirmationSubject(),
      html: clientConfirmationHtml(data),
      text: clientConfirmationText(data),
      replyTo: serverEnv.adminEmail ? [serverEnv.adminEmail] : undefined,
    }),
  ]);

  return { client: settledToResult(clientResult) };
}

function settledToResult(
  settled: PromiseSettledResult<{ error: unknown } | unknown>,
): { sent: boolean; error?: string } {
  if (settled.status === "rejected") {
    const message = settled.reason instanceof Error ? settled.reason.message : "Send failed";
    console.error("[email] send rejected:", message);
    return { sent: false, error: message };
  }

  // The Resend SDK resolves with `{ data, error }` rather than throwing.
  const value = settled.value as { error?: { message?: string } | null } | null;
  if (value && value.error) {
    const message = value.error.message ?? "Send failed";
    console.error("[email] send returned error:", message);
    return { sent: false, error: message };
  }

  return { sent: true };
}
