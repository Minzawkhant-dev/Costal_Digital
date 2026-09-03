"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { createServerSupabase } from "@/lib/supabase/server";

const toggleSchema = z.object({
  id: z.string().uuid(),
  published: z.enum(["true", "false"]),
});

/** Publish / unpublish an FAQ entry. */
export async function toggleFaqPublished(formData: FormData) {
  await requireAdmin();

  const parsed = toggleSchema.safeParse({
    id: formData.get("id"),
    published: formData.get("published"),
  });
  if (!parsed.success) return { ok: false as const, error: "Invalid request." };

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("faq")
    .update({ is_published: parsed.data.published === "true" })
    .eq("id", parsed.data.id);

  if (error) return { ok: false as const, error: "Could not update that entry." };

  revalidatePath("/admin/settings");
  revalidatePath("/faq");
  revalidatePath("/");
  return { ok: true as const };
}

export async function toggleServicePublished(formData: FormData) {
  await requireAdmin();

  const parsed = toggleSchema.safeParse({
    id: formData.get("id"),
    published: formData.get("published"),
  });
  if (!parsed.success) return { ok: false as const, error: "Invalid request." };

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("services")
    .update({ is_published: parsed.data.published === "true" })
    .eq("id", parsed.data.id);

  if (error) return { ok: false as const, error: "Could not update that service." };

  revalidatePath("/admin/settings");
  revalidatePath("/services");
  revalidatePath("/");
  return { ok: true as const };
}

const faqEditSchema = z.object({
  id: z.string().uuid(),
  question: z.string().trim().min(4).max(300),
  answer: z.string().trim().min(10).max(4000),
});

export async function updateFaq(formData: FormData) {
  await requireAdmin();

  const parsed = faqEditSchema.safeParse({
    id: formData.get("id"),
    question: formData.get("question"),
    answer: formData.get("answer"),
  });
  if (!parsed.success) {
    return { ok: false as const, error: "Please check the question and answer." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("faq")
    .update({ question: parsed.data.question, answer: parsed.data.answer })
    .eq("id", parsed.data.id);

  if (error) return { ok: false as const, error: "Could not save that entry." };

  revalidatePath("/admin/settings");
  revalidatePath("/faq");
  revalidatePath("/");
  return { ok: true as const };
}
