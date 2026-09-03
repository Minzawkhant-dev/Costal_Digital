import { createServerSupabase } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { faqs as fallbackFaqs, services as fallbackServices, type Service } from "@/lib/content";
import type { FaqRow, ServiceRow } from "@/lib/supabase/types";

/**
 * Editable content.
 *
 * `services` and `faq` live in Postgres so they can be edited from the admin
 * dashboard, but the site must never depend on that being populated. Each
 * getter falls back to the copy in `content.ts` when Supabase is unconfigured,
 * unreachable, or simply empty — so a fresh clone renders the full site with no
 * database at all, and an outage degrades to the last-known good copy rather
 * than an empty page.
 *
 * Run `supabase/seed.sql` to load the fallback copy into the database.
 */

export type FaqEntry = { question: string; answer: string };

export async function getFaqs(): Promise<readonly FaqEntry[]> {
  if (!hasSupabaseConfig()) return fallbackFaqs;

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("faq")
      .select("question, answer, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return fallbackFaqs;

    return (data as Pick<FaqRow, "question" | "answer">[]).map((row) => ({
      question: row.question,
      answer: row.answer,
    }));
  } catch {
    return fallbackFaqs;
  }
}

export async function getServices(): Promise<readonly Service[]> {
  if (!hasSupabaseConfig()) return fallbackServices;

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("services")
      .select("slug, title, summary, description, deliverables, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return fallbackServices;

    const rows = data as Pick<
      ServiceRow,
      "slug" | "title" | "summary" | "description" | "deliverables"
    >[];

    return rows.map((row, index) => ({
      slug: row.slug,
      number: String(index + 1).padStart(2, "0"),
      title: row.title,
      summary: row.summary,
      description: row.description ?? "",
      deliverables: row.deliverables ?? [],
    }));
  } catch {
    return fallbackServices;
  }
}

/** How long a marketing page may serve stale CMS content, in seconds. */
export const CMS_REVALIDATE = 300;
