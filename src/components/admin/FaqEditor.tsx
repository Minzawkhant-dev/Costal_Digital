"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Loader2 } from "lucide-react";
import { toggleFaqPublished, updateFaq } from "@/app/admin/settings/actions";
import type { FaqRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { PublishToggle } from "@/components/admin/ServiceToggles";

const EASE = [0.16, 1, 0.3, 1] as const;

export function FaqEditor({ entries }: { entries: FaqRow[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => (
        <FaqEditorRow key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}

function FaqEditorRow({ entry }: { entry: FaqRow }) {
  const [open, setOpen] = useState(false);
  const [published, setPublished] = useState(entry.is_published);
  const [question, setQuestion] = useState(entry.question);
  const [answer, setAnswer] = useState(entry.answer);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [togglePending, startToggle] = useTransition();
  const [savePending, startSave] = useTransition();

  const dirty = question !== entry.question || answer !== entry.answer;

  const handleToggle = () => {
    const next = !published;
    setPublished(next);

    const formData = new FormData();
    formData.set("id", entry.id);
    formData.set("published", String(next));

    startToggle(async () => {
      const result = await toggleFaqPublished(formData);
      if (!result.ok) setPublished(!next);
    });
  };

  const handleSave = () => {
    setError(null);

    const formData = new FormData();
    formData.set("id", entry.id);
    formData.set("question", question);
    formData.set("answer", answer);

    startSave(async () => {
      const result = await updateFaq(formData);
      if (result.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2200);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <li className="overflow-hidden rounded-xl border border-line bg-paper">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <ChevronDown
            size={14}
            className={cn(
              "shrink-0 text-muted transition-transform duration-300",
              open && "rotate-180",
            )}
          />
          <span className="truncate text-[0.9rem] text-ink">{question}</span>
        </button>
        <PublishToggle
          published={published}
          pending={togglePending}
          onToggle={handleToggle}
          label={entry.question}
        />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 border-t border-line bg-surface px-4 py-4">
              <label className="flex flex-col gap-1.5">
                <span className="type-mono text-[0.55rem] text-muted">Question</span>
                <input
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-[0.88rem] text-ink outline-none transition-colors focus:border-accent"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="type-mono text-[0.55rem] text-muted">Answer</span>
                <textarea
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-[0.88rem] leading-relaxed text-ink outline-none transition-colors focus:border-accent"
                />
              </label>

              {error && (
                <p role="alert" className="text-[0.8rem] text-signal">
                  {error}
                </p>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={savePending || !dirty}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ink px-4 text-[0.78rem] text-paper transition-colors hover:bg-ink-soft disabled:opacity-45"
                >
                  {savePending && <Loader2 size={12} className="animate-spin" />}
                  Save changes
                </button>
                {saved && <span className="text-[0.78rem] text-accent">Saved</span>}
                {dirty && !saved && (
                  <span className="text-[0.78rem] text-muted">Unsaved changes</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
