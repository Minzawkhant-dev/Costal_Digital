# Coastal Digital Studio

**Work Smarter. Serve Better.**

Marketing site, lead pipeline and admin dashboard for Coastal Digital Studio —
web development, business automation and digital solutions for small and growing
businesses.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Motion | Framer Motion 12 + Lenis (smooth scroll) |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Email | Resend |
| Alerts | Telegram bot (optional) |
| Automation | n8n (webhook, HMAC-signed) — optional |
| Hosting | Vercel |

---

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill it in — see below
npm run dev
```

The site runs with **no configuration at all**: without Supabase it still renders
every page from the built-in copy, and the lead form returns a clear "not
connected yet" message rather than erroring.

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → API**: copy the URL, the `anon` key and the
   `service_role` key into `.env.local`.
3. Open the **SQL Editor** and run `supabase/schema.sql`. This creates the
   tables, the enums, the RLS policies and the rate-limit function. It is safe
   to re-run.
4. Run `supabase/migrations/002_follow_up_tasks.sql`, after `schema.sql`. It adds
   the `follow_up_tasks` table and the `process_lead` RPC that turns a lead into
   a contact plus a follow-up task. `/api/leads` calls this on every submission,
   so it is not optional. Safe to re-run.
5. Run `supabase/migrations/003_function_grants.sql`. Postgres grants EXECUTE on
   a new function to `PUBLIC`, and Supabase publishes everything in the `public`
   schema as an RPC endpoint — so until this runs, `bump_rate_limit` is callable
   by anyone holding the anon key, which ships in the browser bundle. It is a
   **security step, not an optional one**. Safe to re-run.
6. Run `supabase/migrations/004_system_events.sql`. It adds the table the
   dashboard's System page reads — every failure that happens *after* a lead is
   safely stored. Telegram alerts work without it; the history does not. Safe to
   re-run.
7. Optionally run `supabase/seed.sql` to load the services and FAQ copy into the
   database so it becomes editable from the dashboard.

### 2. Create an admin user

Admin access is granted by a row in the `admins` table — there is no signup flow.

1. **Authentication → Users → Add user**, with an email and password.
2. Copy that user's UUID, then run:

```sql
insert into admins (user_id, email, full_name)
values ('<paste-the-uuid>', 'you@yourdomain.com', 'Your Name');
```

3. Sign in at `/admin/login`.

### 3. Resend

1. Add and verify your sending domain at [resend.com](https://resend.com).
2. Set `RESEND_API_KEY`, `EMAIL_FROM` (must be on the verified domain) and
   `ADMIN_EMAIL`.

Without these the lead is still saved — only the emails are skipped.

### 4. Telegram notifications (optional)

Each new lead is pushed to you on Telegram by the site itself, from
`src/lib/crm.ts`. Set both values in `.env.local`:

```
TELEGRAM_BOT_TOKEN=<from @BotFather>
TELEGRAM_CHAT_ID=<see below>
```

Telegram will not tell you a chat id until the bot has received a message.
Send the bot any message, then read the id back:

```bash
curl -s "https://api.telegram.org/bot<TOKEN>/getUpdates" | grep -o '"chat":{"id":[-0-9]*'
```

With either value missing the alert is skipped silently — the lead is still
saved and still emailed.

### 5. n8n (optional)

**The site does not need n8n.** `/api/leads` promotes the lead to a CRM contact
and a follow-up task in-process (`processLead` → `rpc/process_lead`) and sends
the Telegram alert itself, so an enquiry is validated, stored, emailed, promoted
and pushed with nothing else running. n8n is where you *extend* that flow — a
CRM sync, a Slack post, a spreadsheet row — without redeploying the site.

A ready-made workflow ships in `n8n/coastal-lead-intake.json`. It repeats the
`process_lead` call the site already made, which is harmless: the RPC is
idempotent, so a repeat returns the same `contactId` and `taskId` with
`taskCreated: false` rather than creating a second contact or a duplicate task.

`n8n/docker-compose.yml` runs a dedicated instance on port **5681**. It sets two
things the signature check cannot work without, both already in the file:

- `NODE_FUNCTION_ALLOW_BUILTIN=crypto` — the Code node calls `require('crypto')`
- `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` — n8n 2.x blocks `$env` inside Code nodes
  by default, so `$env.COASTAL_WEBHOOK_SECRET` throws *access to env vars denied*
  and the workflow dies before it can answer 401 or 200

```bash
cp .env.local n8n/.env   # or just copy N8N_WEBHOOK_SECRET across, renamed:
                         # COASTAL_WEBHOOK_SECRET=<same value>
docker compose -f n8n/docker-compose.yml up -d
```

`n8n/.env` is gitignored. `COASTAL_WEBHOOK_SECRET` in it **must**
equal `N8N_WEBHOOK_SECRET` in `.env.local` — the site signs the request body with
it and this instance verifies with it. A dedicated instance keeps client
credentials and upgrades separate from any other local n8n you run.

**Then, in the editor at http://localhost:5681:**

1. **Import** `n8n/coastal-lead-intake.json` (Workflows → Import from File).
2. **Create a Supabase credential** named *Coastal Supabase (service key)* —
   host = your `NEXT_PUBLIC_SUPABASE_URL`, service key = your `sb_secret_…` key.
3. **Activate** the workflow, then set its production webhook URL as
   `N8N_WEBHOOK_URL` in `.env.local` — `http://localhost:5681/webhook/coastal-lead`.
   Leave that variable unset and the dispatch is skipped entirely.

In production, point `N8N_WEBHOOK_URL` at a publicly reachable n8n instead;
`localhost` means nothing to a Vercel function.

**What the workflow does**

```
POST /webhook/coastal-lead
   ├─ Verify signature      HMAC-SHA256 over the raw body, constant-time compare
   ├─ ✗ invalid  → 401      the webhook URL alone is not a credential
   └─ ✓ valid
        └─ Process lead     rpc/process_lead — one transaction:
             ├─ upsert contact        (deduped on lowercased email)
             └─ create follow-up task (due in 24h, one open task per lead)
                  ├─ Notify Telegram  disabled by default — see below
                  ├─ Notify LINE      disabled by default
                  └─ 200 with ids
```

**Both notify nodes ship disabled, on purpose.** The site already sends the
Telegram alert, and unlike `process_lead` a chat message has no idempotency —
enabling `Notify Telegram` here too means two messages for every lead. Turn it
on only if you also drop `notifyTelegram` from `src/app/api/leads/route.ts`.

**The same choice applies to email.** The site sends the client confirmation and
the admin notification inline via Resend before it ever calls n8n, so a visitor
gets their confirmation even when the automation host is down. Move them into
n8n if you prefer, but do not run both, or clients get two confirmations.

---

## The lead flow

```
Project form
   ↓  POST /api/leads
   ├─ 1. Zod validation          (identical schema on client and server)
   ├─ 2. Spam checks             (honeypot + minimum fill time)
   ├─ 3. Rate limit              (5/hr per IP, 3/hr per email — atomic in Postgres)
   ├─ 4. Insert into `leads`     (service role; anon has no write path at all)
   ├─ 5. Notify, in parallel     (none of these can fail the request)
   │     ├─ Resend   → client confirmation
   │     ├─ Postgres → CRM contact + follow-up task  (process_lead, idempotent)
   │     ├─ Telegram → studio push alert              (skipped if unconfigured)
   │     └─ n8n      → optional extension hook        (skipped if unconfigured)
   └─ 6. Report anything that failed
         ├─ Telegram → one message listing every failed step
         └─ Postgres → a system_events row per failure, read by /admin/system
```

The studio is told about a new enquiry **once**, on Telegram. There is no admin
email: being notified twice for the same event is how you learn to ignore both.
`ADMIN_EMAIL` is still used, as the reply-to on the client confirmation — that
message is sent from an address with no mailbox behind it, so without it a
customer replying to their own confirmation would be writing into nowhere.

Step 5 can never fail the request. Once the lead is stored the visitor gets a
success response, because losing a real enquiry is worse than a missed email.
Failures are logged, and the response carries `confirmationSent: false` so the
form can soften its wording.

---

## Security

- **RLS on every table.** `anon` cannot read, insert, update or delete a lead
  under any circumstances. The public site never talks to the database directly.
- **Service-role key is server-only.** `src/lib/env.ts` imports `server-only`, so
  pulling it into a client bundle is a build error, not a runtime surprise.
- **Admin auth is checked three times:** `src/proxy.ts` redirects,
  `src/app/admin/layout.tsx` re-checks the session and `admins` membership, and
  RLS enforces it at the database. The proxy alone is a convenience, not the
  boundary.
- **Server Actions re-authorise.** They are public HTTP endpoints, so each one
  calls `requireAdmin()` itself.
- **Rate limiting lives in Postgres,** not process memory — serverless instances
  don't share memory, so an in-memory counter would mean very little.
- **IPs are hashed** with a salt before storage.
- `/admin` and `/api` are disallowed in `robots.txt`, and the admin layout sets
  `robots: noindex`.

Never commit `.env.local`. Set production values in the Vercel dashboard.

---

## Motion system

Everything lives in `src/components/motion/` and respects
`prefers-reduced-motion` — under reduced motion the pinning, tilting and
parallax are dropped entirely and content renders in its final state.

| Component | What it does |
|---|---|
| `SmoothScroll` | Lenis smooth scrolling; drives real window scroll, so `useScroll` and anchors still work |
| `Reveal` / `RevealGroup` / `RevealItem` | Enter reveals, individually or as a stagger |
| `MaskedHeading` | Word-by-word reveal behind a clipping mask |
| `DepthCard` | **Scroll-linked 3D** — rotates through a shared perspective as it crosses the viewport |
| `TiltCard` / `TiltLayer` | Pointer-driven 3D tilt with layered depth |
| `Parallax` / `ScrollSettle` | Scroll-linked translation and settle-into-place |
| `ScrollScene` | **Pinned scroll scenes** — scrub a sequence instead of scrolling past it |
| `HorizontalScroll` | Horizontal gallery driven by vertical scroll |
| `WorkflowDiagram` | **Scroll-drawn SVG workflow** — connectors trace and nodes light up in run order |
| `Effects` | Scroll progress, Marquee, Magnetic, scroll-highlight text |
| `(site)/template.tsx` | Route transition — remounts per navigation, so every page enters consistently |

Cards share one `.stage-3d` perspective per section, so a grid reads as a single
space rather than a pile of unrelated tilts.

---

## Content

Marketing copy lives in `src/lib/content.ts`. `services` and `faq` are also
database-backed: `src/lib/cms.ts` reads them from Supabase and **falls back to
`content.ts`** when the tables are empty or unreachable, so the site never
renders a blank section.

**Pricing:** `pricingTiers[].startingFrom` is `null`, which renders as "Custom
quote". Set a string (e.g. `"฿35,000"`) once you have decided your published
starting prices — nothing else needs to change.

**Demo projects:** the three case studies are demonstration builds. Every surface
that shows one renders a `DemoBadge`, and `/work` states plainly that they are
not client work. Keep that until real client case studies replace them.

---

## Project structure

```
src/
├── app/
│   ├── (site)/          marketing pages (header + footer + smooth scroll)
│   ├── admin/           dashboard (its own chrome, no public nav)
│   ├── api/leads/       the single public write endpoint
│   └── layout.tsx       html/body/fonts only
├── components/
│   ├── motion/          the motion + 3D scroll system
│   ├── home/            home page sections
│   ├── site/            header, footer, shared UI
│   ├── forms/           lead form and fields
│   ├── work/            project artwork
│   └── admin/           dashboard components
├── lib/
│   ├── content.ts       all marketing copy
│   ├── cms.ts           DB-backed content with fallback
│   ├── supabase/        client / server / service-role clients + types
│   ├── email/           Resend templates and dispatch
│   ├── crm.ts           contact + follow-up task promotion, Telegram alert
│   ├── n8n.ts           signed dispatch to the optional automation host
│   ├── validation/      shared Zod schemas
│   └── rate-limit.ts
├── proxy.ts             session refresh + admin gate (Next 16 renamed middleware → proxy)
supabase/
├── schema.sql           tables, enums, RLS, functions
├── seed.sql             services + FAQ, generated from content.ts
└── migrations/
    ├── 002_follow_up_tasks.sql   tasks table + process_lead RPC (required)
    ├── 003_function_grants.sql   revokes RPC execute from anon (required)
    └── 004_system_events.sql     failure log behind /admin/system (required)
n8n/
└── coastal-lead-intake.json      importable workflow (optional)
```

---

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm start        # serve the production build
```

## Deploying

Nothing in the app is tied to a host. It is a standard Next.js 16 App Router
build using the Node runtime, so Netlify and Vercel both run it as-is.

### Netlify

1. Push to GitHub and **Add new site → Import an existing project**. Netlify
   detects Next.js and needs no build configuration — leave the command and
   publish directory as detected, and do not add a `netlify.toml` unless you
   have a reason to.
2. Add every variable from `.env.example` under **Site configuration →
   Environment variables**. `.env.local` is gitignored and never deploys, so
   until this is done `/api/leads` answers 503 and no enquiry reaches you.
3. **Set `NEXT_PUBLIC_SITE_URL`.** More important here than on Vercel: it
   drives canonical URLs, the sitemap, `robots.txt`, the Open Graph image and
   the structured data. `src/lib/site.ts` falls back to Netlify's own `URL`,
   which is the site's production origin — good enough to deploy with, but set
   this explicitly the moment a custom domain is attached.
4. Leave `N8N_WEBHOOK_URL` unset unless you are actually running n8n somewhere
   publicly reachable. The site does not need it, and a `localhost` value
   simply logs a warning on every lead.

Two things to check on the first deploy, because both fail quietly:

- **Security headers.** They are declared in `next.config.ts` via `headers()`.
  Confirm `X-Frame-Options` and the rest actually come back:
  `curl -sI https://your-site/ | grep -i -E 'x-frame|content-security|strict-transport'`
- **The admin gate.** `src/proxy.ts` is Next 16's renamed middleware. If a host
  does not run it, the only thing lost is the pre-render redirect — the admin
  layout re-checks the session and `admins` membership, and RLS enforces it at
  the database, so the area stays protected either way. Confirm by opening
  `/admin` signed out: you should land on `/admin/login`.

### Vercel

1. Import the repo at [vercel.com](https://vercel.com).
2. Add every variable from `.env.example` in **Project Settings → Environment
   Variables**.
3. Set `NEXT_PUBLIC_SITE_URL` to your custom domain once it is attached.
   Without it the build falls back to `VERCEL_PROJECT_PRODUCTION_URL`.
