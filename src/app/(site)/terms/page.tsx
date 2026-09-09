import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { brand } from "@/lib/content";
import { LegalLayout, type LegalSection } from "@/components/site/LegalLayout";

export const metadata: Metadata = pageMetadata({
  title: "Terms",
  description: `The terms that apply to this website and to work carried out by ${brand.name}.`,
  path: "/terms",
});

const sections: LegalSection[] = [
  {
    heading: "About these terms",
    body: [
      `These terms apply to your use of this website and describe how we work with clients. They are not a project contract — the specific terms of any engagement are set out in the written proposal we send you and agree before work starts.`,
      `If anything here conflicts with a signed proposal, the proposal takes precedence.`,
    ],
  },
  {
    heading: "Using this website",
    body: [
      "You may read, share and link to anything on this site. You may not copy its design, code or written content for use in a competing offering.",
      "We try to keep the site accurate and available, but we do not guarantee it will be uninterrupted or free of errors.",
    ],
  },
  {
    heading: "Demonstration projects",
    body: [
      "The projects shown in the Work section are demonstration builds created by us to illustrate our approach. They are not client work.",
      "The outcomes described alongside them are the intended effects of those system designs. They are not measured results from a real business, and nothing on those pages should be read as a performance guarantee.",
    ],
  },
  {
    heading: "Enquiries and proposals",
    body: [
      "Submitting a form on this site does not create a contract and does not commit you to anything. It is a request for a conversation.",
      "Any figure we mention before scoping is an indication, not a quote. A quote is a written proposal listing deliverables, timeline, cost and anything explicitly out of scope. Work begins only once you approve that proposal.",
    ],
  },
  {
    heading: "Project work",
    body: [
      "Projects are delivered in the stages set out in our written proposal. Where a stage depends on something from you — content, access, approvals — a delay in providing it moves the remaining dates accordingly.",
      "Changes requested after a scope is agreed are quoted separately. We will tell you what a change costs and wait for your agreement before carrying it out.",
    ],
  },
  {
    heading: "Payment",
    body: [
      "Project work is invoiced according to the milestones in the proposal, typically with a deposit before work begins and the balance on completion.",
      "Ongoing support, hosting and maintenance plans are billed monthly and may be cancelled with reasonable notice as set out in the plan.",
    ],
  },
  {
    heading: "Ownership",
    body: [
      "On final payment, you own the deliverables we build for you: the site, its content, and the automations configured for your business.",
      "We retain ownership of our own underlying tools, libraries and general know-how, and of anything built before the engagement. Third-party software, fonts, hosting and services remain subject to their own licences, which we will identify in the proposal.",
      "Unless you ask us not to, we may reference the work in our portfolio.",
    ],
  },
  {
    heading: "Third-party services",
    body: [
      "Our work commonly connects to services operated by other companies — hosting, email delivery, payment providers, messaging platforms and similar.",
      "We configure and support those integrations, but we do not control those services and are not responsible for their availability, pricing changes or policy changes.",
    ],
  },
  {
    heading: "Liability",
    body: [
      "We take care over our work and will fix defects in what we have built. To the extent permitted by law, our liability in connection with a project is limited to the fees paid for that project.",
      "We are not liable for indirect or consequential losses, including lost profits or lost business, arising from the use of a system we built.",
    ],
  },
  {
    heading: "Contact",
    body: [
      `Questions about these terms can be sent to ${brand.email}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms"
      description="How this website may be used, and the terms that frame our project work."
      updated="3 September 2026"
      sections={sections}
    />
  );
}
