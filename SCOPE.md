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

| Tier | Basis | Starting from |
|---|---|---|
| Website | One-time project | ฿28,000 |
| Automation | Per workflow | ฿15,000 |
| Digital Solutions | Custom quote | ฿37,500 |
| Digital Support | Monthly plan | ฿2,500/month |

Prices live in `pricingTiers[].startingFrom` in `content.ts`; `null` would
render a tier as "Custom quote". Any launch promotion runs as separate copy, so
it can end without that file changing.

Delivery runs through six stages — Discover, Plan, Design, Build, Launch,
Support — each with named outputs. Scope is written down at the Plan stage,
including what is explicitly out of it.

---

## 2. Surfaces built

| Area | Routes | Contents |
|---|---|---|
| Public site | `(site)/` | 12 fixed pages — home, services, solutions, work, about, process, pricing, faq, contact, start-a-project, privacy, terms — plus a dynamic `/work/[slug]`, one per project in `lib/projects.ts` |
| Lead endpoint | `/api/leads` | The only public write path in the application |
| Admin | `/admin/*` | Dashboard, leads, projects, system, settings, login, logout |
| Discovery | `sitemap.ts`, `robots.ts`, `llms.txt`, `opengraph-image` | Canonical URLs from `NEXT_PUBLIC_SITE_URL`, per-page metadata, JSON-LD, a generated social card and a prose brief for answer engines; `/admin` and `/api` disallowed |
| Motion | `components/motion/` | Seven modules — smooth scroll, ambient hero light, scroll-linked 3D, pinned scenes, horizontal gallery, scroll-drawn workflow SVG |
| Contact dock | `components/site/ContactDock.tsx` | A floating bottom-right button fanning out into the channels in `contactChannels` — email, LINE and Messenger today, WhatsApp once it has a number. Unset channels are dropped, not rendered dead; the dock hides on `/contact` and `/start-a-project` and retires once the footer is on screen |

Every motion component respects `prefers-reduced-motion`: under reduced motion
the pinning, tilting and parallax are dropped and content renders in its final
state.

### The portfolio

`src/lib/projects.ts` is the single source of truth for case studies, and the
only file edited to add one — `content.ts` re-exports it, so nothing that
already imported `projects` had to change. `number` comes from list order and
`isDemo` from `status`, and the card, the case-study page, the status badge, the
sitemap entry and the next/previous links all follow from that one list.

`status` — `live`, `demo` or `concept` — is the honesty mechanism rather than
decoration. It sets the badge wording, decides whether a disclaimer paragraph
renders at all, and controls whether `/work` and the homepage carry their
"these are demonstration builds" notice. Four projects are listed: **My
Favorite Diner**, delivered client work, ahead of three demonstration builds.

Screenshots are real captures of a running site at 1440px and 390px, not
mockups — `tools/capture-screenshots.mjs` drives headless Chrome over the
DevTools Protocol to take them, because the `--screenshot` flag can neither
scroll nor emulate a phone viewport. A project with no screenshots falls back to
generated `ProjectArtwork`, labelled on the page as a mockup.

### Discovery

Everything machine-readable is generated from `content.ts` and `projects.ts`
rather than kept by hand: the sitemap, `robots.txt`, per-page metadata, the
JSON-LD graphs (organization, website, service, breadcrumb, FAQ), the 1200×630
social card, and `/llms.txt` — the same offer written as prose an answer engine
can quote. AI crawlers are allowed on purpose: being quotable is a lead source
for a studio nobody has heard of yet. All of it resolves against `siteUrl`, so
`NEXT_PUBLIC_SITE_URL` is the single setting that can misdirect the lot.

Caching follows the same shape as the content: the three database-backed
pages revalidate every 300s, `/work/[slug]` is prerendered per project at build
time, and the dashboard and `/api/leads` are always dynamic.

### Stack

Next.js 16 (App Router, Turbopack — middleware is renamed `src/proxy.ts`) ·
TypeScript · React 19 · Tailwind CSS v4 · Framer Motion 12 + Lenis ·
Supabase Postgres with RLS · Resend · Zod 4. Nothing is host-specific — it
deploys to Vercel or Netlify unchanged, each with its own canonical-URL
fallback.

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
| 5 | Notify | Four destinations, in parallel — see below |

Step 5:

```
├─ Resend    → client confirmation   (the only email the pipeline sends)
├─ Postgres  → process_lead: upsert contact (deduped on lowercased email)
│               + open follow-up task (due 24h), one transaction, idempotent
├─ Telegram  → studio push alert     (skipped if unconfigured)
└─ n8n       → signed extension hook (skipped if unconfigured)
```

The studio hears about an enquiry once, on Telegram. A second notification by
email for the same event trains you to read neither.

A sixth step reports whatever failed: one Telegram message listing every failed
step, and a `system_events` row per failure for `/admin/system` to read back.
Failing silently into a log was the real cost of step 5 never failing the
request.

**Step 5 can never fail the request.** Once the lead is stored the visitor gets a
success response, because losing a real enquiry is worse than a missed email.
Failures are logged, and the response carries `confirmationSent: false` so the
form can soften its wording.

---

## 4. Data model

Nine tables, five enums and five functions — `supabase/schema.sql` plus three
migrations, all **required** rather than optional. `002_follow_up_tasks.sql`
adds the RPC `/api/leads` calls on every submission; `003_function_grants.sql`
revokes RPC execute from `anon`, without which `bump_rate_limit` is reachable by
anyone holding the public anon key; `004_system_events.sql` adds the failure log
the System dashboard reads. All four files are safe to re-run.

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
| `system_events` | Delivery failures, by dotted source, read by `/admin/system` | No |

Five functions back these: `set_updated_at`, `is_admin`, `bump_rate_limit`,
`process_lead` and `prune_system_events` — the last a service-role-only trim of
the failure log, defaulting to 90 days, for whenever the history stops earning
its space.

Lifecycles:

- `lead_status` — new → contacted → qualified → proposal → won / lost
- `project_status` — planning → in_progress → review → launched, plus on_hold, cancelled
- `payment_status` — unpaid → deposit_paid → partially_paid → paid
- `task_status` — open → in_progress → done, plus cancelled
- `event_level` — error / warn / info, on a `system_events` row

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
| System | Delivery failures in the last 24h/7d, follow-ups due and overdue, recent `system_events`, integration status |
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

- [x] **Prices are published.** Every tier carries a `startingFrom` — ฿28,000,
      ฿15,000, ฿37,500 and ฿2,500/month — and six specific inclusions in place
      of four generic ones.
- [x] **The first client case study is published.** My Favorite Diner — live,
      delivered work — now leads `/work`, with real screenshots at both
      breakpoints. `DemoBadge` gave way to `ProjectStatusBadge`, which labels
      each project from its own `status` instead of assuming every one is a
      demo, so the disclaimers appear over the three demonstration builds and
      nowhere else. Those three stay labelled until client work replaces them.
- [x] **Social links resolved.** Facebook, TikTok and Instagram now point at
      real profiles and appear in `sameAs`. LinkedIn and YouTube were removed
      rather than left as bare domains — the studio has no profile on either
      yet, and a dead link is worse than an absent one.
- [x] **The custom domain is attached.** `coastaldigitalstudio.com` serves
      from Netlify over HTTPS, `www` redirects to the apex, and
      `NEXT_PUBLIC_SITE_URL` is set, so the sitemap and canonical URLs resolve
      to the real domain.
- [ ] **WhatsApp has no number.** Its `contactChannels` entry is `null`, so the
      contact dock leaves it out until a `wa.me` link is filled in.
- [x] **Follow-up tasks are visible.** `/admin/system` lists the next ones due,
      flags overdue, and counts open against overdue.
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

Everything described in this document is built, committed, pushed to
`Minzawkhant-dev/Costal_Digital`, and live on Netlify at
`coastaldigitalstudio.com`. After the initial ten commits that built the site,
the library and the admin area, the work arrived in five rounds:

- **Production readiness.** Leads promoted in-process and n8n demoted to an
  extension point; RPC execution locked down and security headers added;
  per-page social cards with structured data and working ISR; the 404 and error
  boundaries; the create-next-app assets dropped.
- **Brand identity.** The inline-SVG wordmark replaced by real artwork —
  `logo.png` / `logo-light.png` for light and dark grounds, a mark-only variant
  for the phone header, and a 512px mark for structured data. The tagline was
  lifted out of the lockup: baked in, it rendered around 4px tall and appeared
  twice in the footer. It is real text now, from `brand.tagline`.
- **Layout, content and hardening.** `html { overflow-x: clip }` stops reveal
  transforms from widening the document and letting the page drag sideways on a
  phone; the page scrollbar is hidden; the mobile menu locks the root rather
  than `body`, and its sheet clears the header instead of tucking under it. Real
  social profiles and a published contact address, dead exports removed, the
  email preheader escaped, the IP hash salt's committed default dropped, and the
  canonical URL resolved on Netlify as well as Vercel.
- **Alerts, then the portfolio.** One notification per lead, with every failure
  after storage reported to Telegram and recorded in `system_events` behind
  `/admin/system` — including the case where the form is refusing submissions
  outright, which previously failed silently. Then the portfolio moved out of
  `content.ts` into `src/lib/projects.ts`, and My Favorite Diner joined it as
  the first client project, with status-driven labelling in place of the
  always-on demo badge.
- **Selling to the owner, not the developer.** Starting prices published on
  every tier, each with six specific inclusions in place of four generic ones.
  A floating contact dock puts email, LINE and Messenger one tap away, and the
  hero strip under the headline now says what the studio does in plain English
  rather than listing the stack — the stack moved to each case study's
  `technology`, where someone technical goes looking.

**Documentation.** This file, `README.md` and `socialmedia.md` are kept current
by hand and are the places a claim can quietly go stale. The last pass added the
discovery surfaces — `/llms.txt`, the generated social card, `seo.ts` and `schema.ts` —
which had shipped in the SEO round but were never written down, along with the
`prune_system_events` retention helper, the host-neutral deploy story, and the
files the structure tree had drifted past. `socialmedia.md` then joined them:
the posting plan for the three accounts on one side, and on the other the wiring
they hang off — the `socials` array, the `sameAs` path guard, and the generated
share card — so that the marketing use and the code that serves it are written
down in the same place.

What remains open is listed in §8: a WhatsApp number for the contact dock, and
creating a project row from the dashboard.
