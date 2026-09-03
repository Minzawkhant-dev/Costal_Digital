import Link from "next/link";
import { brand, nav, socials } from "@/lib/content";
import { Logo } from "@/components/site/Logo";
import { ButtonLink, Eyebrow } from "@/components/site/ui";
import { Reveal } from "@/components/motion/Reveal";

const explore = [...nav, { href: "/contact", label: "Contact" }];

const legal = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="tech-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute -right-[15%] -top-[35%] size-[46rem] rounded-full opacity-[0.16] blur-[120px]"
        style={{ background: "radial-gradient(circle, #19b3a6, transparent 68%)" }}
      />

      <div className="shell relative">
        {/* Final CTA */}
        <div className="grid gap-10 border-b border-line-dark py-20 md:grid-cols-[1.25fr_auto] md:items-end md:py-28">
          <Reveal>
            <Eyebrow tone="light">Ready when you are</Eyebrow>
            <h2 className="type-h2 mt-6 max-w-2xl text-paper">
              Ready to work smarter?
            </h2>
            <p className="type-lede mt-5 max-w-lg text-paper/60">
              Let&rsquo;s build a better digital system for your business.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/start-a-project" size="lg" variant="light">
              Start a Project
            </ButtonLink>
          </Reveal>
        </div>

        {/* Link grid */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo tone="light" />
            <p className="mt-5 text-[0.9rem] leading-relaxed text-paper/55">
              {brand.description}
            </p>
            <p className="type-mono mt-6 text-[0.62rem] text-accent-bright">{brand.tagline}</p>
          </div>

          <FooterColumn title="Explore">
            {explore.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Work with us">
            <FooterLink href="/start-a-project">Start a Project</FooterLink>
            <FooterLink href="/services">Services</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href={`mailto:${brand.email}`}>{brand.email}</FooterLink>
          </FooterColumn>

          <FooterColumn title="Follow">
            {socials.map((item) => (
              <FooterLink key={item.label} href={item.href} external>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-line-dark py-7 text-[0.8rem] text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()} {brand.name}
          </span>
          <div className="flex flex-wrap gap-6">
            {legal.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-paper">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="type-mono text-[0.62rem] text-paper/35">{title}</p>
      <div className="mt-5 flex flex-col gap-3">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    "w-fit text-[0.9rem] text-paper/60 transition-colors duration-300 hover:text-paper";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
