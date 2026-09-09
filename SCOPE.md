# Project scope

**Coastal Digital Studio — Work Smarter. Serve Better.**

One Next.js application doing three jobs: selling four service lines to small and
growing businesses, capturing every enquiry through a single hardened endpoint,
and giving the studio a private dashboard to work those enquiries.

`README.md` covers setup and operation. This file covers what is in the build,
what is deliberately optional, and where the boundary sits.

---

## 1. The offer the site has to sell

The commercial scope is defined once in `src/lib/content.ts` and consumed by
every page.

### Service lines

| # | Line | Sells |
|---|---|---|
| 01 | **Web Development** | Business sites, landing pages, restaurant & café, booking, e-commerce, redesign, maintenance |
| 02 | **Business Automation** | n8n workflows, booking, email, lead and CRM automation, LINE, Google Sheets, AI-powered flows |
| 03 | **Digital Solutions** | Dashboards, CRM systems, internal tools, databases, API and AI integrations |
| 04 | **Digital Support** | Domain & DNS, hosting, business email, maintenance, backup, security, technical support |

### Target segments

Restaurants & cafés · Hospitality · Service businesses · Real estate ·
Small & growing businesses.

### Engagement model

Four tiers, each with a different commercial *basis* rather than a different
feature count:

| Tier | Basis |
|---|---|
| Website | One-time project |
| Automation | Per workflow |
| Digital Solutions | Custom quote |
| Digital Support | Monthly plan |

Delivery runs through six stages — Discover, Plan, Design, Build, Launch,
Support — each with named outputs. Scope is written down at the Plan stage,
including what is explicitly out of it.

---

## 2. Surfaces built

| Area | Routes | Contents |
|---|---|---|
| Public site | `(site)/` | 12 fixed pages — home, services, solutions, work, about, process, pricing, faq, contact, start-a-project, privacy, terms — plus a dynamic `/work/[slug]` |
| Lead endpoint | `/api/leads` | The only public write path in the application |
| Admin | `/admin/*` | Dashboard, leads, projects, settings, login, logout |
| Discovery | `sitemap.ts`, `robots.ts` | Canonical URLs from `NEXT_PUBLIC_SITE_URL`; `/admin` and `/api` disallowed |
| Motion | `components/motion/` | 12 components — smooth scroll, scroll-linked 3D, pinned scenes, horizontal gallery, scroll-drawn workflow SVG |

Every motion component respects `prefers-reduced-motion`: under reduced motion
the pinning, tilting and parallax are dropped and content renders in its final
state.

### Stack

Next.js 16 (App Router, Turbopack — middleware is renamed `src/proxy.ts`) ·
TypeScript · React 19 · Tailwind CSS v4 · Framer Motion 12 + Lenis ·
Supabase Postgres with RLS · Resend · Zod 4 · Vercel.

---

## 3. The lead pipeline

The commercial core. The project form posts once to `/api/leads`, and five steps
run in order.

| # | Step | Detail |
|---|---|---|
| 1 | Validate | Zod, identical schema on client and server. Ten fields: name, business name, email, phone, business type, website, service, budget, timeline, message |
| 2 | Screen for spam | Honeypot field plus a 2.5s minimum fill time |
| 3 | Rate limit | 5/hr per IP, 3/hr per email — counted atomically in Postgres, because serverless instances share no memory |
| 4 | Store | Insert into `leads` with the service role; anon has no write path to it |
| 5 | Notify | Five destinations, in parallel — see below |

Step 5:

```
├─ Resend    → client confirmation
├─ Resend    → studio notification
├─ Postgres  → process_lead: upsert contact (deduped on lowercased email)
│               + open follow-up task (due 24h), one transaction, idempotent
├─ Telegram  → studio push alert     (skipped if unconfigured)
└─ n8n       → signed extension hook (skipped if unconfigured)
```

**Step 5 can never fail the request.** Once the lead is stored the visitor gets a
success response, because losing a real enquiry is worse than a missed email.
Failures are logged, and the response carries `confirmationSent: false` so the
form can soften its wording.

---

## 4. Data model

Eight tables and three enums — `supabase/schema.sql` plus
`migrations/002_follow_up_tasks.sql`. The migration is **required**, not
optional: `/api/leads` calls its RPC on every submission. Both files are safe to
re-run.

| Table | Holds | Reachable by `anon` |
|---|---|---|
| `leads` | Every enquiry, with a six-value status lifecycle | No |
| `contacts` | Deduplicated people, promoted from leads | No |
| `follow_up_tasks` | One open task per lead, due 24h after enquiry | No |
| `projects` | Delivery tracking — status, deadline, payment status | No |
| `admins` | The allowlist granting dashboard access | No |
| `services` | Service copy, editable from the dashboard | Read, if published |
| `faq` | FAQ copy, editable from the dashboard | Read, if published |
| `rate_limits` | Counters keyed on hashed IP and email | No |

Lifecycles:

- `lead_status` — new → contacted → qualified → proposal → won / lost
- `project_status` — planning → in_progress → review → launched, plus on_hold, cancelled
- `payment_status` — unpaid → deposit_paid → partially_paid → paid

**Content strategy.** Marketing copy lives in `content.ts`. `services` and `faq`
are additionally database-backed: `cms.ts` reads them from Supabase and falls
back to `content.ts` when the tables are empty or unreachable, so the site never
renders a blank section.

---

## 5. Admin dashboard

A private area with its own chrome and no public navigation. There is no signup
flow — access is granted by inserting a row into `admins` against a Supabase auth
user.

| Screen | What it does |
|---|---|
| Overview | Dashboard statistics across leads and projects |
| Leads | Filter by status with live counts; change status and edit notes inline, optimistically |
| Projects | Read-only delivery table, soonest deadline first, with status/payment pills |
| Settings | Business details, integration status as booleans, publish toggles for services and FAQ, FAQ editor |

Integration status is deliberately rendered as configured / not configured. The
values themselves never reach the browser.

---

## 6. Security posture

- **RLS on every table.** `anon` cannot read, insert, update or delete a lead
  under any circumstances. The public site never talks to the database directly.
- **The service-role key is server-only by construction.** `src/lib/env.ts`
  imports `server-only`, so pulling it into a client bundle is a build error
  rather than a runtime surprise.
- **Admin auth is checked three times** — `proxy.ts` redirects, the admin layout
  re-checks session and `admins` membership, and RLS enforces it at the database.
  The proxy alone is a convenience, not the boundary.
- **Server Actions re-authorise individually.** They are public HTTP endpoints,
  so each calls `requireAdmin()` itself rather than trusting the layout that
  rendered it.
- **Rate limiting lives in Postgres,** so it holds across serverless instances.
- **Submitter IPs are hashed with a salt** before storage; rotating the salt
  resets the buckets.
- **The dashboard is kept out of search** — `/admin` and `/api` disallowed in
  robots, and the admin layout sets `robots: noindex`.
- **The n8n dispatch is signed** with HMAC-SHA256 over the raw body and verified
  with a constant-time compare, so the webhook URL alone is not a credential.
- **No advertising or tracking cookies,** and no third-party analytics — as
  stated on the privacy page.

---

## 7. Optional services, and how the site degrades

A deliberate constraint: nothing external is load-bearing. The site runs with no
configuration at all, and each missing integration removes exactly one
capability rather than breaking a page.

| Service | Role | If absent |
|---|---|---|
| Supabase | Storage, auth, rate limiting, CMS | Pages render from `content.ts`; the form returns a clear "not connected yet" message rather than erroring |
| Resend | Client confirmation, studio notification | Lead is still saved; emails skipped |
| Telegram | Push alert on a new lead | Skipped silently |
| n8n | Extension point for later workflows | Dispatch skipped entirely |

**The n8n boundary.** The site promotes the lead to a contact and a follow-up
task in-process and sends its own Telegram alert, so an enquiry is validated,
stored, emailed, promoted and pushed with nothing else running. n8n is where that
flow gets *extended* — a CRM sync, a Slack post, a spreadsheet row — without
redeploying the site.

Both notify nodes in the shipped workflow are **disabled on purpose**. Unlike
`process_lead`, a chat message has no idempotency, so enabling them alongside the
site's own alert means two messages per lead. The same applies to email: run it
in one place, never both.

---

## 8. Open decisions

Inside scope, built to accept an answer, still waiting on one.

- [ ] **Published prices.** Every tier's `startingFrom` is `null`, rendering as
      "Custom quote". Setting a string — `"฿35,000"` — is the entire change.
- [ ] **Case studies are demonstration builds, not client work.** Three of them;
      every surface that renders one shows a `DemoBadge` and `/work` states it
      plainly. That labelling stays until real client work replaces them.
- [ ] **Social links point at bare domains** — facebook.com, tiktok.com,
      instagram.com, linkedin.com, youtube.com — and need real profiles.
- [ ] **The custom domain is not attached.** `NEXT_PUBLIC_SITE_URL` drives
      canonical URLs and the sitemap, falling back to the deployment URL.
- [ ] **Follow-up tasks have no dashboard screen.** Every lead opens one and they
      are correct in the database, but today they are only visible there.
- [ ] **Projects cannot be created from the dashboard.** The screen tracks
      delivery; a project row still has to be inserted directly against a won lead.

---

## 9. Out of scope

Not built, and not currently planned in this codebase. Listed so the boundary is
explicit rather than assumed.

- **Payments and invoicing.** Projects carry a payment status field, but there is
  no checkout, no invoice generation and no payment provider.
- **A client portal.** The admin area is for the studio only; clients have no login.
- **Public booking or scheduling.** Sold as a client service, not built into this site.
- **A general CMS or blog.** Database-backed editing covers services and FAQ; all
  other copy is edited in `content.ts` and deployed.
- **Multi-language.** The site is English-only, though multi-language work appears
  in the demo case studies.
- **Analytics.** No provider is wired, matching the privacy page's claim.
- **An automated test suite.** `package.json` defines `dev`, `build` and `start` only.

---

## 10. Current working state

Five commits have landed: the public site, the admin area and lead API, the n8n
instance and workflow, the scroll-driven process journey, and the ambient light
field behind every hero.

On top of those sits an uncommitted change set across seven files with a single
theme: **demoting n8n from a dependency to an extension point.** A new
`src/lib/crm.ts` moves the two things only the workflow used to do — promoting a
lead to a contact with a follow-up task, and pushing the Telegram alert — into
the request itself. `/api/leads`, `env.ts`, the Supabase types, the workflow JSON
and the README were updated to match.

The practical effect: a self-hosted automation host is no longer needed for the
studio to be told about an enquiry and have a task waiting on it.
