import Link from "next/link";
import type { Metadata } from "next";
import { nav } from "@/lib/content";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ButtonLink, Eyebrow } from "@/components/site/ui";

/**
 * Global 404.
 *
 * Lives at the app root rather than inside `(site)` because Next renders this
 * one for any URL that matches no route at all, wrapped in the root layout only
 * — a route group's layout does not apply. So the header and footer are brought
 * in explicitly here; without them a mistyped URL is a dead end with no way back
 * into the site, which on a lead-generation site means a lost visitor.
 *
 * `SiteHeader` tracks window scroll rather than the Lenis instance, so it works
 * here without the smooth-scroll provider the marketing pages get.
 */
export const metadata: Metadata = {
  title: "Page not found",
  // A 404 has nothing worth indexing, and letting it in dilutes the rest.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        <section className="relative overflow-hidden pb-24 pt-32 sm:pt-40 lg:pt-48">
          <div aria-hidden className="tech-grid-light absolute inset-0 opacity-40" />

          <div className="shell relative">
            <Eyebrow>Error 404</Eyebrow>

            <h1 className="type-display mt-6 max-w-3xl">This page doesn&apos;t exist.</h1>

            <p className="type-lede mt-6 max-w-xl text-slate">
              The link may be out of date, or the address slightly off. Nothing is broken —
              everything else is where you left it.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/" size="lg">
                Back to home
              </ButtonLink>
              <ButtonLink href="/start-a-project" variant="outline" size="lg">
                Start a project
              </ButtonLink>
            </div>

            {/* A mistyped URL is usually one letter from the right page. */}
            <div className="mt-16 border-t border-line pt-8">
              <p className="text-[0.82rem] uppercase tracking-[0.14em] text-muted">
                Or head straight to
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[0.95rem] text-slate underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="text-[0.95rem] text-slate underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
