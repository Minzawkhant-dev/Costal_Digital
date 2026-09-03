"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { leadStatuses } from "@/lib/supabase/types";

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(leadStatuses as [string, ...string[]]),
});

/**
 * Update a lead's pipeline status.
 *
 * Server Actions are a public HTTP endpoint, so this re-checks admin
 * membership itself rather than assuming the caller came from an admin page.
 */
export async function updateLeadStatus(formData: FormData) {
  await requireAdmin();

  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { ok: false as const, error: "Invalid request." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("leads")
    .update({ status: parsed.data.status as never })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("[admin] updateLeadStatus failed:", error.message);
    return { ok: false as const, error: "Could not update that lead." };
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true as const };
}

const noteSchema = z.object({
  id: z.string().uuid(),
  notes: z.string().max(5000),
});

export async function updateLeadNotes(formData: FormData) {
  await requireAdmin();

  const parsed = noteSchema.safeParse({
    id: formData.get("id"),
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) return { ok: false as const, error: "Invalid request." };

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("leads")
    .update({ notes: parsed.data.notes })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("[admin] updateLeadNotes failed:", error.message);
    return { ok: false as const, error: "Could not save that note." };
  }

  revalidatePath("/admin/leads");
  return { ok: true as const };
}
