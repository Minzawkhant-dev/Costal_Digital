import { brand } from "@/lib/content";

/**
 * Email templates.
 *
 * Written as inline-styled HTML with a plain-text counterpart. Email clients
 * strip <style> blocks and many never render the HTML at all, so every message
 * has to read correctly as text on its own.
 */

export type LeadEmailData = {
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  businessType?: string;
  website?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  submittedAt: Date;
  leadId?: string;
};

const INK = "#0a141c";
const SLATE = "#4a5a68";
const MUTED = "#7b8a97";
const LINE = "#e2ded4";
const PAPER = "#f7f6f2";
const ACCENT = "#0e7c86";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(date);
}

/**
 * Wraps a message body in the email chrome.
 *
 * `preheader` is escaped here rather than at the call site. One caller builds
 * it from the submitter's own name and business name, which are free text from
 * a public form — escaping in the shell makes every present and future caller
 * safe by construction instead of relying on each one to remember.
 */
function shell(inner: string, preheader: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${brand.name}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${LINE};border-radius:14px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
          <tr>
            <td style="padding:26px 32px;border-bottom:1px solid ${LINE};">
              <p style="margin:0;font-size:15px;font-weight:700;letter-spacing:.18em;color:${INK};">COASTAL</p>
              <p style="margin:4px 0 0;font-size:9px;letter-spacing:.26em;text-transform:uppercase;color:${ACCENT};">Digital Studio</p>
            </td>
          </tr>
          ${inner}
          <tr>
            <td style="padding:22px 32px;border-top:1px solid ${LINE};background:${PAPER};">
              <p style="margin:0;font-size:12px;color:${MUTED};">${brand.name}</p>
              <p style="margin:4px 0 0;font-size:12px;color:${ACCENT};">${brand.tagline}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function row(label: string, value?: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:11px 0;border-bottom:1px solid ${LINE};vertical-align:top;width:132px;">
      <span style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">${label}</span>
    </td>
    <td style="padding:11px 0;border-bottom:1px solid ${LINE};vertical-align:top;">
      <span style="font-size:14px;color:${INK};line-height:1.5;">${escapeHtml(value)}</span>
    </td>
  </tr>`;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ============================================================
   Client confirmation
   ============================================================ */

export function clientConfirmationSubject() {
  return `We've received your project request — ${brand.name}`;
}

export function clientConfirmationHtml(data: LeadEmailData) {
  const inner = `
  <tr>
    <td style="padding:34px 32px 8px;">
      <p style="margin:0 0 20px;font-size:20px;font-weight:600;color:${INK};letter-spacing:-.02em;">
        Thanks for contacting ${brand.name}.
      </p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${SLATE};">
        We&rsquo;ve received your project request and will review the details shortly.
      </p>
      <p style="margin:0 0 26px;font-size:15px;line-height:1.65;color:${SLATE};">
        We&rsquo;ll get back to you as soon as possible.
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 30px;">
      <div style="border:1px solid ${LINE};border-radius:10px;padding:18px 20px;background:${PAPER};">
        <p style="margin:0 0 12px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">
          A copy of what you sent
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("Name", data.name)}
          ${row("Business", data.businessName)}
          ${row("Service", data.service)}
          ${row("Timeline", data.timeline)}
        </table>
        <p style="margin:14px 0 0;font-size:13px;line-height:1.6;color:${SLATE};white-space:pre-wrap;">${escapeHtml(
          data.message,
        )}</p>
      </div>
    </td>
  </tr>`;

  return shell(inner, "We've received your project request and will review it shortly.");
}

export function clientConfirmationText(data: LeadEmailData) {
  return `Thanks for contacting ${brand.name}.

We've received your project request and will review the details shortly.

We'll get back to you as soon as possible.

---
A copy of what you sent

Name: ${data.name}
Business: ${data.businessName}${data.service ? `\nService: ${data.service}` : ""}${
    data.timeline ? `\nTimeline: ${data.timeline}` : ""
  }

${data.message}

---
${brand.name}
${brand.tagline}`;
}

/* ============================================================
   Admin notification
   ============================================================ */

export function adminNotificationSubject(data: LeadEmailData) {
  return `New Project Lead — ${data.businessName}`;
}

export function adminNotificationHtml(data: LeadEmailData) {
  const inner = `
  <tr>
    <td style="padding:34px 32px 6px;">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${ACCENT};">
        New project lead
      </p>
      <p style="margin:0 0 22px;font-size:21px;font-weight:600;color:${INK};letter-spacing:-.02em;">
        ${escapeHtml(data.businessName)}
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${row("Name", data.name)}
        ${row("Business", data.businessName)}
        ${row("Email", data.email)}
        ${row("Phone / LINE", data.phone)}
        ${row("Business type", data.businessType)}
        ${row("Website", data.website)}
        ${row("Service", data.service)}
        ${row("Budget", data.budget)}
        ${row("Timeline", data.timeline)}
        ${row("Submitted", formatDateTime(data.submittedAt))}
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:22px 32px 32px;">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">
        Message
      </p>
      <div style="border-left:2px solid ${ACCENT};padding:2px 0 2px 14px;">
        <p style="margin:0;font-size:14px;line-height:1.65;color:${INK};white-space:pre-wrap;">${escapeHtml(
          data.message,
        )}</p>
      </div>
      <p style="margin:24px 0 0;">
        <a href="mailto:${escapeHtml(data.email)}"
           style="display:inline-block;background:${INK};color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;padding:11px 22px;border-radius:999px;">
          Reply to ${escapeHtml(data.name)}
        </a>
      </p>
    </td>
  </tr>`;

  return shell(inner, `${data.name} at ${data.businessName} — ${data.service ?? "new enquiry"}`);
}

export function adminNotificationText(data: LeadEmailData) {
  const lines = [
    `NEW PROJECT LEAD — ${brand.name}`,
    "",
    `Name: ${data.name}`,
    `Business: ${data.businessName}`,
    `Email: ${data.email}`,
    data.phone ? `Phone / LINE: ${data.phone}` : null,
    data.businessType ? `Business type: ${data.businessType}` : null,
    data.website ? `Website: ${data.website}` : null,
    data.service ? `Service: ${data.service}` : null,
    data.budget ? `Budget: ${data.budget}` : null,
    data.timeline ? `Timeline: ${data.timeline}` : null,
    `Submitted: ${formatDateTime(data.submittedAt)}`,
    "",
    "Message:",
    data.message,
  ].filter(Boolean);

  return lines.join("\n");
}
