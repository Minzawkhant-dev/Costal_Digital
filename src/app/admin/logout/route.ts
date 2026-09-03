import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * POST-only sign out. A GET would let a third-party page log an admin out with
 * an <img> tag, which is a nuisance rather than a breach — but a form POST
 * costs nothing and avoids it.
 */
export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();

  const origin = new URL(request.url).origin || siteUrl;
  return NextResponse.redirect(new URL("/admin/login", origin), { status: 303 });
}
