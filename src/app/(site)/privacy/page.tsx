import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { brand } from "@/lib/content";
import { LegalLayout, type LegalSection } from "@/components/site/LegalLayout";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${brand.name} collects, uses, stores and protects the information you provide.`,
  path: "/privacy",
});

/**
 * This policy describes what the site genuinely does: one lead form, stored in
 * Supabase, notified through Resend and n8n. Keep it in step with the code — if
 * a new integration is added, it belongs in section 04.
 */
const sections: LegalSection[] = [
  {
    heading: "Who we are",
    body: [
      `${brand.name} ("we", "us") builds websites, business automation and digital systems for small and growing businesses. This policy explains what happens to information you give us through this website.`,
      `If you have a question about anything here, contact us at ${brand.email}.`,
    ],
  },
  {
    heading: "What we collect",
    body: [
      "We only collect information you choose to send us. There is no account system on this site and we do not ask you to register.",
      "When you submit the project or contact form, we collect:",
    ],
    list: [
      "Your name and business name",
      "Your email address",
      "Your phone, LINE or WhatsApp contact, if you provide one",
      "Your business type and current website, if you provide them",
      "The service, budget range and timeline you select",
      "The message you write",
      "Technical metadata: a one-way hashed form of your IP address and your browser's user agent string",
    ],
  },
  {
    heading: "Why we collect it",
    body: [
      "We use your contact details and message to reply to your enquiry, to prepare a proposal, and to keep a record of our correspondence with you.",
      "The technical metadata exists only to protect the form from automated abuse. Your IP address is hashed before it is stored, so we hold a value that lets us recognise repeat submissions without holding the address itself.",
      "We do not sell your information, and we do not use it for advertising or profiling.",
    ],
  },
  {
    heading: "Who processes it",
    body: [
      "We use a small number of third-party services to run this site. Each one only receives what it needs:",
    ],
    list: [
      "Vercel — hosts the website and serves your requests",
      "Supabase — stores the enquiry record in a Postgres database",
      "Resend — sends your confirmation email and our internal notification",
      "n8n — routes the enquiry into our follow-up workflow",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "We keep enquiry records for as long as we may reasonably need them for our working relationship, and for our own business records afterwards.",
      "If you would like your enquiry deleted, email us and we will remove it. Where we are required to retain certain records — for example for tax or accounting purposes — we will tell you what we cannot delete and why.",
    ],
  },
  {
    heading: "How we protect it",
    body: [
      "The site is served over HTTPS. Enquiry data is written to the database by our server, never directly from your browser, and the database enforces row-level security so that stored enquiries are not publicly readable.",
      "Access to the enquiry dashboard is restricted to authenticated administrator accounts. Credentials for our third-party services are held as server-side environment variables and are never sent to your browser.",
    ],
  },
  {
    heading: "Cookies and analytics",
    body: [
      "This site does not set advertising or tracking cookies, and it does not use third-party analytics.",
      "Cookies are only used for the administrator dashboard, to keep an authenticated session active. They are not set for ordinary visitors.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You can ask us what information we hold about you, ask us to correct it if it is wrong, or ask us to delete it. Email us and we will respond.",
      "You are never required to give us any information to browse this site. The forms are the only place we ask for anything, and only four fields on them are required.",
    ],
  },
  {
    heading: "Changes",
    body: [
      "If we change how this site handles information, we will update this page and change the date shown alongside it.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Privacy Policy"
      description="What we collect, why we collect it, who processes it, and how to have it removed."
      updated="3 September 2026"
      sections={sections}
    />
  );
}
