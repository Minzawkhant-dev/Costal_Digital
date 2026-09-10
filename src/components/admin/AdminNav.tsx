"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/system", label: "System" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="border-t border-line/70">
      <div className="mx-auto flex w-full max-w-[1400px] gap-1 overflow-x-auto px-5 sm:px-8">
        {items.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative whitespace-nowrap px-3 py-3 text-[0.85rem] transition-colors",
                active ? "text-ink" : "text-slate hover:text-ink",
              )}
            >
              {item.label}
              {active && (
                <span aria-hidden className="absolute inset-x-3 bottom-0 h-[2px] bg-accent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
