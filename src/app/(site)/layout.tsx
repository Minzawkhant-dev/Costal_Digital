import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/Effects";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

/**
 * Marketing site chrome. Kept out of the root layout so /admin renders without
 * the public header, footer, or scroll hijacking.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </SmoothScroll>
  );
}
