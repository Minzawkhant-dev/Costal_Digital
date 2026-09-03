import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";

export type AdminSession = {
  userId: string;
  email: string;
  fullName: string | null;
};

/**
 * Resolves the current admin, or null.
 *
 * `cache` dedupes this across a single render pass, so a layout and the page
 * inside it can each call it without two round trips.
 *
 * Membership is proven by a row in `admins`, read under RLS as the signed-in
 * user — so this cannot be spoofed by a forged cookie: an invalid token yields
 * no user, and a valid non-admin user reads no row.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  if (!hasSupabaseConfig()) return null;

  const supabase = await createServerSupabase();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: admin, error } = await supabase
    .from("admins")
    .select("user_id, email, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !admin) return null;

  return {
    userId: admin.user_id,
    email: admin.email,
    fullName: admin.full_name,
  };
});

/**
 * Guard for admin pages and Server Actions.
 *
 * This is the real boundary — `src/proxy.ts` only redirects, and a proxy check
 * on its own is not something to stake data access on.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
