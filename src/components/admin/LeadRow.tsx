"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Loader2, Mail, Phone } from "lucide-react";
import { updateLeadNotes, updateLeadStatus } from "@/app/admin/leads/actions";
import { leadStatusLabels, leadStatuses, type Lead, type LeadStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { StatusPill } from "@/components/admin/StatusPill";

const EASE = [0.16, 1, 0.3, 1] as const;

export function LeadRow({ lead, formattedDate }: { lead: Lead; formattedDate: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [noteSaved, setNoteSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const [savingNote, startNoteTransition] = useTransition();

  const handleStatusChange = (next: LeadStatus) => {
    const previous = status;
    setStatus(next); // optimistic

    const formData = new FormData();
    formData.set("id", lead.id);
    formData.set("status", next);

    startTransition(async () => {
      const result = await updateLeadStatus(formData);
      if (!result.ok) setStatus(previous);
    });
  };

  const handleSaveNote = () => {
    const formData = new FormData();
    formData.set("id", lead.id);
    formData.set("notes", notes);

    startNoteTransition(async () => {
      const result = await updateLeadNotes(formData);
      if (result.ok) {
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 2200);
      }
    });
  };

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="grid w-full grid-cols-1 items-center gap-2 px-6 py-4 text-left transition-colors hover:bg-paper lg:grid-cols-[1.4fr_1fr_0.9fr_0.9fr_auto] lg:gap-4"
      >
        <div className="min-w-0">
          <p className="truncate text-[0.92rem] text-ink">{lead.business_name}</p>
          <p className="truncate text-[0.78rem] text-muted lg:hidden">
            {lead.name} &middot; {formattedDate}
          </p>
        </div>

        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-[0.85rem] text-slate">{lead.name}</p>
          <p className="truncate text-[0.76rem] text-muted">{lead.email}</p>
        </div>

        <span className="hidden truncate text-[0.85rem] text-slate lg:block">
          {lead.service ?? "—"}
        </span>

        <span className="hidden truncate text-[0.85rem] text-slate lg:block">
          {lead.budget ?? "—"}
        </span>

        <div className="flex items-center gap-3 justify-self-start lg:justify-self-end">
          <StatusPill status={status} />
          <span className="hidden text-[0.78rem] text-muted xl:block">{formattedDate}</span>
          <ChevronDown
            size={15}
            className={cn(
              "text-muted transition-transform duration-300",
              open && "rotate-180",
            )}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden bg-paper"
          >
            <div className="grid gap-6 border-t border-line px-6 py-6 lg:grid-cols-[1.5fr_1fr]">
              {/* Message + notes */}
              <div className="flex flex-col gap-5">
                <div>
                  <p className="type-mono mb-2 text-[0.55rem] text-muted">Message</p>
                  <p className="whitespace-pre-wrap text-[0.9rem] leading-relaxed text-ink">
                    {lead.message}
                  </p>
                </div>

                <div>
                  <p className="type-mono mb-2 text-[0.55rem] text-muted">Internal notes</p>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                    placeholder="Follow-up notes, call outcomes, next steps…"
                    className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[0.88rem] text-ink outline-none transition-colors focus:border-accent"
                  />
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveNote}
                      disabled={savingNote}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-[0.78rem] text-ink transition-colors hover:border-ink disabled:opacity-60"
                    >
                      {savingNote && <Loader2 size={12} className="animate-spin" />}
                      Save note
                    </button>
                    {noteSaved && <span className="text-[0.76rem] text-accent">Saved</span>}
                  </div>
                </div>
              </div>

              {/* Detail + actions */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-4">
                  <Detail label="Email" value={lead.email} href={`mailto:${lead.email}`} icon={<Mail size={12} />} />
                  {lead.phone && (
                    <Detail label="Phone / LINE" value={lead.phone} icon={<Phone size={12} />} />
                  )}
                  {lead.website && <Detail label="Website" value={lead.website} href={lead.website} />}
                  {lead.business_type && <Detail label="Business type" value={lead.business_type} />}
                  {lead.timeline && <Detail label="Timeline" value={lead.timeline} />}
                  <Detail label="Source" value={lead.source} />
                </div>

                <div>
                  <label
                    htmlFor={`status-${lead.id}`}
                    className="type-mono mb-2 block text-[0.55rem] text-muted"
                  >
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id={`status-${lead.id}`}
                      value={status}
                      disabled={pending}
                      onChange={(event) => handleStatusChange(event.target.value as LeadStatus)}
                      className="w-full appearance-none rounded-xl border border-line bg-surface px-3.5 py-2.5 pr-10 text-[0.88rem] text-ink outline-none transition-colors focus:border-accent disabled:opacity-60"
                    >
                      {leadStatuses.map((value) => (
                        <option key={value} value={value}>
                          {leadStatusLabels[value]}
                        </option>
                      ))}
                    </select>
                    {pending ? (
                      <Loader2
                        size={14}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-muted"
                      />
                    ) : (
                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function Detail({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="type-mono shrink-0 text-[0.55rem] text-muted">{label}</span>
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="inline-flex min-w-0 items-center gap-1.5 truncate text-[0.85rem] text-accent hover:underline"
        >
          {icon}
          <span className="truncate">{value}</span>
        </a>
      ) : (
        <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-[0.85rem] text-ink">
          {icon}
          <span className="truncate">{value}</span>
        </span>
      )}
    </div>
  );
}
