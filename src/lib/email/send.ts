import "server-only";

import { Resend } from "resend";
import { serverEnv } from "@/lib/env";
import {
  adminNotificationHtml,
  adminNotificationSubject,
  adminNotificationText,
  clientConfirmationHtml,
  clientConfirmationSubject,
  clientConfirmationText,
  type LeadEmailData,
} from "@/lib/email/templates";

/**
 * Email dispatch.
 *
 * Deliberately non-throwing: a lead is already saved by the time we get here,
 * so a Resend outage must not turn a captured enquiry into a 500 for the
 * visitor. Failures are logged and reported back in the result so the API route
 * can decide what to say.
 */

export type EmailResult = {
  client: { sent: boolean; error?: string };
  admin: { sent: boolean; error?: string };
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
    const error = "RESEND_API_KEY not configured";
    return { client: { sent: false, error }, admin: { sent: false, error } };
  }

  const from = serverEnv.emailFrom;
  const adminEmail = serverEnv.adminEmail;

  const [clientResult, adminResult] = await Promise.allSettled([
    resend.emails.send({
      from,
      to: data.email,
      subject: clientConfirmationSubject(),
      html: clientConfirmationHtml(data),
      text: clientConfirmationText(data),
      replyTo: adminEmail ? [adminEmail] : undefined,
    }),

    adminEmail
      ? resend.emails.send({
          from,
          to: adminEmail,
          subject: adminNotificationSubject(data),
          html: adminNotificationHtml(data),
          text: adminNotificationText(data),
          replyTo: [data.email],
        })
      : Promise.reject(new Error("ADMIN_EMAIL not configured")),
  ]);

  return {
    client: settledToResult(clientResult),
    admin: settledToResult(adminResult),
  };
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
