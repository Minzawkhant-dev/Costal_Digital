import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { brand, socials } from "@/lib/content";
import { PageHero } from "@/components/site/PageHero";
import { Eyebrow } from "@/components/site/ui";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Coastal Digital Studio about a website, business automation, a custom system or ongoing digital support.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your business."
        description="Send a message and we'll come back to you. If you already know roughly what you need, the project form gathers the useful detail in one pass."
      />

      <section className="pb-20 sm:pb-28">
        <div className="shell grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <Reveal>
            <ProjectForm source="contact" />
          </Reveal>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={0.1}>
              <Eyebrow>Direct</Eyebrow>
              <a
                href={`mailto:${brand.email}`}
                className="group/mail mt-6 flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-6 transition-[border-color,transform] duration-400 hover:-translate-y-0.5 hover:border-ink/25"
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full border border-line bg-paper text-accent">
                    <Mail size={15} />
                  </span>
                  <span className="text-[0.95rem] text-ink">{brand.email}</span>
                </span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-muted transition-transform duration-300 group-hover/mail:-translate-y-0.5 group-hover/mail:translate-x-0.5"
                />
              </a>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8">
                <Eyebrow>Follow</Eyebrow>
              </div>
            </Reveal>

            <RevealGroup className="mt-6 flex flex-col" stagger={0.05}>
              {socials.map((social) => (
                <RevealItem key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group/social flex items-center justify-between border-t border-line py-4 text-[0.92rem] text-slate transition-colors last:border-b hover:text-ink"
                  >
                    {social.label}
                    <ArrowUpRight
                      size={14}
                      className="text-muted transition-transform duration-300 group-hover/social:-translate-y-0.5 group-hover/social:translate-x-0.5"
                    />
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.25}>
              <p className="mt-8 text-[0.84rem] leading-relaxed text-muted">
                Looking for answers rather than a conversation? The{" "}
                <Link href="/faq" className="text-accent hover:underline">
                  FAQ
                </Link>{" "}
                covers cost, timelines, hosting and support.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
