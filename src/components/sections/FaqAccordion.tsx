"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export type FaqItem = { question: string; answer: string };

export function FaqAccordion({
  items,
  className,
  defaultOpen = null,
}: {
  items: readonly FaqItem[];
  className?: string;
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, index) => {
        const expanded = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.question} className="border-t border-line last:border-b">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
                className="group/faq flex w-full items-start gap-5 py-6 text-left"
              >
                <span className="type-mono mt-1.5 shrink-0 text-[0.62rem] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className={cn(
                    "flex-1 font-display text-[1.1rem] tracking-tight transition-colors duration-300 sm:text-[1.25rem]",
                    expanded ? "text-ink" : "text-ink/85 group-hover/faq:text-ink",
                  )}
                >
                  {item.question}
                </span>

                <motion.span
                  aria-hidden
                  animate={{ rotate: expanded ? 45 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className={cn(
                    "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                    expanded
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink group-hover/faq:border-ink",
                  )}
                >
                  <Plus size={14} />
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 pl-[3.1rem] pr-12 text-[0.94rem] leading-relaxed text-slate">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
