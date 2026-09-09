import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Anonymous, session-less client for public content reads.
 *
 * `createServerSupabase` reads cookies to carry the visitor's session, and
 * touching cookies opts a route into dynamic rendering — which silently made
 * `export const revalidate` a no-op on /services, /pricing and /faq. Those
 * pages were server-rendered on every request, hitting Supabase each time.
 *
 * Published services and FAQ entries are readable by `anon` under RLS, so no
 * session is needed to fetch them. Reading them through this client keeps the
 * pages statically cacheable and lets `revalidate` mean what it says.
 *
 * Not a replacement for `createServerSupabase`: anything that depends on who is
 * signed in still needs the cookie-backed client.
 */
export function createPublicSupabase() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // There is no user here and nowhere to persist to; without this the
      // client sets up token refresh timers that never fire usefully on a
      // server render.
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
