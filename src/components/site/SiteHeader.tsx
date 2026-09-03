"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/components/motion/Effects";
import { ButtonLink } from "@/components/site/ui";
import { Logo } from "@/components/site/Logo";

const EASE = [0.16, 1, 0.3, 1] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled(20);
  const [open, setOpen] = useState(false);

  // Close on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled || open
            ? "border-b border-line/70 bg-paper/80 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            "shell flex items-center justify-between transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            scrolled ? "h-16" : "h-20",
          )}
        >
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="group/nav relative px-3 py-2 text-[0.875rem] text-slate transition-colors duration-300 hover:text-ink"
              >
                <span className={cn(isActive(item.href) && "text-ink")}>{item.label}</span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3 bottom-1 h-px origin-left bg-accent transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/contact"
              className="px-3 py-2 text-[0.875rem] text-slate transition-colors hover:text-ink"
            >
              Contact
            </Link>
            <ButtonLink href="/start-a-project" size="sm" variant="primary">
              Start a Project
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-ink lg:hidden"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="fixed inset-x-0 top-16 z-[55] border-b border-line bg-paper lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="shell flex flex-col py-4">
              {nav.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.04 * index, ease: EASE }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between border-b border-line/70 py-3.5 font-display text-[1.35rem] tracking-tight transition-colors",
                      isActive(item.href) ? "text-accent" : "text-ink",
                    )}
                  >
                    {item.label}
                    <span className="type-mono text-[0.6rem] text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.04 * nav.length, ease: EASE }}
                className="mt-5 flex flex-col gap-2.5 pb-2"
              >
                <ButtonLink href="/start-a-project" size="lg" className="w-full">
                  Start a Project
                </ButtonLink>
                <ButtonLink href="/contact" size="lg" variant="outline" className="w-full">
                  Contact
                </ButtonLink>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
