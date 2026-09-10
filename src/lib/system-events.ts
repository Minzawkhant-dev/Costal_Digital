import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * The durable half of failure reporting.
 *
 * Telegram is the immediate half — it reaches you in seconds and is how you
 * find out at all. This is what is still there on Thursday when you want to
 * know whether that Tuesday failure was a one-off or the third this week.
 *
 * Never throws, and never made a request fail. It is called from paths that are
 * already handling a failure, so an error here must not become the error the
 * visitor sees. A write that does not land is logged and dropped.
 */

export type EventLevel = "error" | "warn" | "info";

export async function recordEvent({
  level = "error",
  source,
  message,
  leadId,
  context,
}: {
  level?: EventLevel;
  /** Dotted origin, e.g. "leads.client" or "leads.crm". Grouped on, so keep it coarse. */
  source: string;
  message: string;
  leadId?: string;
  context?: Record<string, unknown>;
}): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("system_events").insert({
      level,
      source,
      message: message.slice(0, 2000),
      lead_id: leadId ?? null,
      context: context ?? null,
    });

    if (error) {
      // Most likely cause: migration 004 has not been run. Say so plainly rather
      // than leaving a bare Postgres code in the log.
      console.error("[system-events] insert failed:", error.message);
    }
  } catch (cause) {
    console.error(
      "[system-events] insert threw:",
      cause instanceof Error ? cause.message : "unknown",
    );
  }
}
