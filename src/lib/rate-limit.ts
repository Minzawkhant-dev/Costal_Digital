import "server-only";

import { createHash } from "node:crypto";
import { serverEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Rate limiting.
 *
 * Backed by Postgres rather than process memory: on Vercel each request may hit
 * a different instance, so an in-memory counter would reset unpredictably and
 * the limit would mean very little. `bump_rate_limit` does the increment and
 * the window roll atomically in SQL, so two concurrent submissions cannot both
 * read the same pre-increment count.
 *
 * Fails open. If the limiter itself errors we let the submission through rather
 * than lose a real enquiry — validation, the honeypot and the timing check are
 * all still in force.
 */

export type RateLimitResult = {
  allowed: boolean;
  count: number;
  limit: number;
};

export async function rateLimit({
  identifier,
  limit,
  windowSeconds,
  scope = "default",
}: {
  identifier: string;
  limit: number;
  windowSeconds: number;
  scope?: string;
}): Promise<RateLimitResult> {
  const key = `${scope}:${identifier}`;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("bump_rate_limit", {
      p_key: key,
      p_window_seconds: windowSeconds,
    });

    if (error || typeof data !== "number") {
      return { allowed: true, count: 0, limit };
    }

    return { allowed: data <= limit, count: data, limit };
  } catch {
    return { allowed: true, count: 0, limit };
  }
}

/**
 * Best-effort client IP.
 *
 * On Vercel `x-forwarded-for` is set by the proxy and its leftmost entry is the
 * real client. Behind another proxy this can be spoofed, which is why the IP is
 * only ever one of several signals and is stored hashed.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() ?? "unknown";
}

/**
 * Hash an IP before it touches the database. We need to tell submissions apart,
 * not to know where anyone lives, and a salted digest is enough for that.
 */
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${serverEnv.ipHashSalt}:${ip}`).digest("hex").slice(0, 40);
}
