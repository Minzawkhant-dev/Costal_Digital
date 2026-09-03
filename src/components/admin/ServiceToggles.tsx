"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toggleServicePublished } from "@/app/admin/settings/actions";
import type { ServiceRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

export function ServiceToggles({ services }: { services: ServiceRow[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {services.map((service) => (
        <ServiceToggleRow key={service.id} service={service} />
      ))}
    </ul>
  );
}

function ServiceToggleRow({ service }: { service: ServiceRow }) {
  const [published, setPublished] = useState(service.is_published);
  const [pending, startTransition] = useTransition();

  const handleToggle = () => {
    const next = !published;
    setPublished(next); // optimistic; reverted below if the write fails

    const formData = new FormData();
    formData.set("id", service.id);
    formData.set("published", String(next));

    startTransition(async () => {
      const result = await toggleServicePublished(formData);
      if (!result.ok) setPublished(!next);
    });
  };

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-line bg-paper px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-[0.9rem] text-ink">{service.title}</p>
        <p className="truncate text-[0.79rem] text-muted">{service.summary}</p>
      </div>
      <PublishToggle
        published={published}
        pending={pending}
        onToggle={handleToggle}
        label={service.title}
      />
    </li>
  );
}

export function PublishToggle({
  published,
  pending,
  onToggle,
  label,
}: {
  published: boolean;
  pending: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        role="switch"
        aria-checked={published}
        aria-label={published ? `Unpublish ${label}` : `Publish ${label}`}
        disabled={pending}
        onClick={onToggle}
        className={cn(
          "inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 disabled:opacity-60",
          published ? "bg-accent" : "bg-line",
        )}
      >
        <span
          className={cn(
            "inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-300",
            published ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
      {pending && (
        <Loader2 size={11} className="absolute -right-5 animate-spin text-muted" aria-hidden />
      )}
    </span>
  );
}
