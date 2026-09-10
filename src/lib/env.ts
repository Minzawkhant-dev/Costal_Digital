import "server-only";

/**
 * Server-side environment access.
 *
 * Importing `server-only` makes it a build error for any client component to
 * pull this file into the browser bundle — which is the real guarantee that the
 * service-role key and the Resend key never reach a visitor.
 *
 * Values are read lazily so a missing optional integration (n8n, Resend) does
 * not break the build; only the genuinely required ones throw, and only when
 * something actually asks for them.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.example for the full list.`,
    );
  }
  return value;
}

function optional(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export const serverEnv = {
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabaseAnonKey() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  /** Bypasses RLS. Server only, never exposed to the client. */
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get resendApiKey() {
    return optional("RESEND_API_KEY");
  },
  get emailFrom() {
    return optional("EMAIL_FROM") ?? "Coastal Digital Studio <onboarding@resend.dev>";
  },
  get adminEmail() {
    return optional("ADMIN_EMAIL");
  },
  get n8nWebhookUrl() {
    return optional("N8N_WEBHOOK_URL");
  },
  get n8nWebhookSecret() {
    return optional("N8N_WEBHOOK_SECRET");
  },
  /**
   * Telegram admin alerts. Optional: without a token and chat id the lead is
   * still saved and emailed, there is simply no push notification.
   */
  get telegramBotToken() {
    return optional("TELEGRAM_BOT_TOKEN");
  },
  get telegramChatId() {
    return optional("TELEGRAM_CHAT_ID");
  },
  /**
   * Salt for hashing submitter IPs. Rotating it resets rate-limit buckets.
   *
   * There is deliberately no literal default. A constant written here would be
   * public — it ships in this repository — and the IPv4 space is small enough to
   * hash end to end against a known salt in minutes, so a shared default would
   * make every stored `ip_hash` reversible and undo the point of hashing at all.
   *
   * The service-role key is the fallback instead: secret, specific to the
   * deployment, and guaranteed to be present anywhere this is reached. Rate
   * limits live in Postgres, so `/api/leads` answers 503 and never hashes an IP
   * when it is missing. Rotating that key also rolls the buckets, same as
   * rotating the salt.
   */
  get ipHashSalt() {
    return (
      optional("IP_HASH_SALT") ?? `coastal:ip:${required("SUPABASE_SERVICE_ROLE_KEY")}`
    );
  },
} as const;

/** True when Supabase is configured — lets pages degrade instead of crashing. */
export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function hasServiceRole() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
