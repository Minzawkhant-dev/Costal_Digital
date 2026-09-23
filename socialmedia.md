# Social media

Two halves, because they have two different readers and go stale at different
rates. **Part one** is the plan — what the accounts are for and what goes on
them. **Part two** is the wiring — where the links live in this repository and
what breaks if they are edited carelessly.

Like `README.md` and `SCOPE.md`, nothing generates this file. It is accurate on
the day it is written and only stays that way by hand.

---

# Part one — the plan

## 1. The accounts

| Platform | Handle | In `sameAs` |
|---|---|---|
| Facebook | `profile.php?id=61594383865619` | Yes |
| TikTok | `@coastaldigitalstudio` | Yes |
| Instagram | `@coastaldigitalocean.studio` | Yes |

Three things about that table are worth fixing rather than living with:

- **The handles do not match each other.** TikTok is `coastaldigitalstudio`;
  Instagram and the published email are `coastaldigitalocean.studio`. Someone
  who finds one and searches for the other may not believe they are the same
  business — and `sameAs` exists precisely to answer that question. Claim the
  matching handle on each platform if it is free, and treat whichever one you
  keep as the canonical spelling everywhere.
- **Facebook is still a numeric profile URL.** `profile.php?id=…` is what an
  unclaimed vanity URL looks like. Setting a username makes the link legible,
  quotable, and obviously the same brand as the others.
- **There is no LINE Official Account.** In Thailand that is the channel a
  small business is actually reached on — this studio built LINE booking alerts
  for My Favorite Diner precisely because email was not where the staff were
  looking. A studio selling to Thai SMBs being absent from it is a gap, not a
  stylistic choice.

LinkedIn and YouTube were deliberately removed rather than left as bare
domains. Do not re-add either until there is a real profile with something on
it; a dead link in `sameAs` is worse than an absent one.

## 2. What these accounts are for

One job: get the right stranger to `/start-a-project`.

Not followers, not reach, not engagement for its own sake. This is a studio
with four services and a handful of case studies selling to owner-operated
businesses — the audience is small, local and specific, and a hundred of the
right people is worth more than ten thousand of the wrong ones.

The segments the site already names are the segments to speak to:
**restaurants and cafés, hospitality, service businesses, real estate**, and
small and growing businesses generally.

## 3. What to post

Five buckets. Everything should be recognisable as one of them.

| Bucket | What it is | Why it works |
|---|---|---|
| **Proof** | A real thing that was built, and what changed because of it | The only bucket that directly sells. Currently: My Favorite Diner |
| **The problem, named** | One of the six problems on `/solutions`, said plainly | Owners recognise their own week and self-identify |
| **How it works** | A short explanation of one mechanism — booking, automation, a menu that edits itself | Earns trust from people who are not ready to buy yet |
| **Behind the build** | Process, decisions, why something was done a particular way | Cheap to make, and the studio's actual differentiator |
| **The studio** | Who this is, where it works, what it stands for | Rare. Two of these a month is plenty |

Two rules that come from the site itself:

- **Never quote a price.** Every tier on `/pricing` renders as "Custom quote".
  A post that names a number the site will not confirm costs you the enquiry at
  the moment the visitor lands.
- **Never present a demo build as client work.** The site is careful about this
  — `status` drives a label on every project and `/work` says plainly how many
  are demonstrations. Social posts are the easiest place for that discipline to
  quietly break. Only My Favorite Diner is delivered client work.

## 4. Cadence and format

Two to three posts a week, sustained, beats a burst followed by silence. A
studio of this size should plan for what it can keep doing during a busy
delivery month.

| Platform | Format that fits | Note |
|---|---|---|
| **TikTok** | Vertical video, 15–40s, one idea | Screen recordings of a real panel being used outperform talking about it |
| **Instagram** | Carousels and Reels | Carousels suit the "problem, named" and "how it works" buckets |
| **Facebook** | Longer text, links, local reach | The one place a link in the post is not punished, and where Pattaya-area business groups live |

Reels and TikToks can share a cut. Do not cross-post the watermarked export.

## 5. The My Favorite Diner launch sequence

One delivered project is enough material for roughly eight posts. It is the
first piece of genuine proof the studio has, so it is worth spending properly
rather than in a single announcement.

1. **The announcement.** Live site, the client named, one line on what it does.
2. **The menu that edits itself.** 108 dishes across 12 sections, every price
   and photograph editable from a phone by someone who has never seen code.
3. **A booking, end to end.** Guest books, the staff LINE group is alerted
   within seconds, the guest gets a confirmation with a private cancel link.
4. **Guests cancel themselves.** A freed table can be sold again instead of
   becoming a no-show — the clearest money argument in the whole build.
5. **It still works when the database does not.** With Supabase disconnected
   the site serves a complete menu rather than an error. Few competitors can
   say this; most have never thought about it.
6. **The problem behind it.** A menu online drifts from the menu on the table
   within a month when every edit has to go through a developer.
7. **The panel, on a phone, mid-service.** The constraint that shaped the build.
8. **Quiet, unglamorous work.** PDPA retention, review moderation, unsubscribe
   handling — the things a business does not know to ask for.

The screenshots are already captured and sitting in
`public/work/my-favorite-diner/`. The `mobile-*.webp` set is shot at 780×1688,
which crops straight to vertical video with no re-shoot — see
[Capturing the screenshots](README.md#capturing-the-screenshots) if more are
needed.

Every post in this sequence ends in the same place: the case study at
`/work/my-favorite-diner`.

## 6. Knowing whether any of it works

Leads already carry a `source` column, and it is already populated — but with
the **form placement**, not with where the visitor came from:

| Where the form is | `source` recorded |
|---|---|
| `/start-a-project` | `start-a-project` |
| `/contact` | `contact` |

So today the database can tell you which page someone filled in, and nothing
about which platform sent them. Two small gaps sit between here and real
attribution, both inside code that already exists:

- **Nothing reads the URL.** `ProjectForm` takes `source` as a prop with a
  fixed value per placement, so a link posted as
  `…/start-a-project?from=tiktok` is ignored. Reading that parameter and
  preferring it over the default is the whole change — the column, the Zod
  field and the insert all accept it already.
- **The dashboard never shows it.** `/admin/leads` does not render `source` at
  all, so even the placement it does record is invisible without a SQL query.

Until those land, the honest measurement is manual: ask on the form, or in the
first reply, how they found the studio. That answer is worth more than most
analytics anyway.

---

# Part two — the wiring

## 7. Source of truth

`socials` in `src/lib/content.ts` is the only place a profile URL is written.
Four surfaces read it, so one edit moves all of them:

| Reader | What it does |
|---|---|
| `components/site/SiteFooter.tsx` | The footer links |
| `app/(site)/contact/page.tsx` | The contact page links |
| `app/admin/settings/page.tsx` | Lists the labels, read-only, so the dashboard shows what is configured |
| `lib/schema.ts` | Feeds `sameAs` in the organization JSON-LD |

## 8. Adding or changing a profile

Edit the array. There is no second place.

```ts
export const socials = [
  { label: "Facebook",  href: "https://www.facebook.com/…" },
  { label: "TikTok",    href: "https://www.tiktok.com/@…" },
  { label: "Instagram", href: "https://www.instagram.com/…/" },
] as const;
```

**A bare platform domain is silently dropped from `sameAs`.**
`realSocialProfiles()` in `schema.ts` keeps only URLs with a non-empty path:

```ts
new URL(href).pathname.replace(/\/+$/, "").length > 0
```

`https://www.facebook.com/` fails that test; `https://www.facebook.com/coastal`
passes. The guard is deliberate — a bare domain is the shape a placeholder
takes, and this way a half-finished entry cannot reach production and tell an
answer engine that the studio is the same entity as Facebook itself. It still
renders in the footer, so a placeholder stays visible to you and invisible to
crawlers.

The guard checks shape, not truth. A well-formed link to the wrong account
passes happily, which is why a wrong link is worse than a missing one.

## 9. `sameAs` and structured data

`sameAs` is how a search or answer engine confirms that a profile it found
elsewhere is this same business. It is emitted inside the organization graph in
`lib/schema.ts`, rendered through `JsonLd`, and anchored to a stable `@id` of
`<siteUrl>/#organization` so every block refers to one entity rather than
several.

Two related notes, both worth more than any single post:

- `location` in `content.ts` is still `null`, so the schema emits a plain
  `Organization`. Filling it in upgrades it to `ProfessionalService` — a
  LocalBusiness subtype, and considerably stronger both for `web design in
  <city>` and for an answer engine placing the business geographically.
- The published contact address is a Gmail one. It works today, but an address
  on the studio's own domain is a stronger signal that the site, the profiles
  and the business are one entity.

## 10. Share cards

What a link looks like when it is pasted into a post is generated, not
uploaded:

| File | What it does |
|---|---|
| `app/opengraph-image.tsx` | The 1200×630 card, drawn per request rather than checked in as a PNG |
| `lib/seo.ts` | `pageMetadata()` — builds title, description, canonical, `openGraph` and `twitter` (`summary_large_image`) from one call |

`seo.ts` names the card route explicitly rather than relying on inheritance.
Next only inherits a parent `openGraph` when a page sets none of it, so the
moment a page defined its own title the inherited image dropped out and the
card rendered blank. Building the title, the canonical and both cards from one
call is what stops a new page shipping without a card.

All of it — and the canonical URL in every link you share — resolves against
`siteUrl` in `lib/site.ts`. `NEXT_PUBLIC_SITE_URL` wins; otherwise Vercel and
Netlify each fall back to their own deployment origin. A wrong value here does
not break anything visibly. It just means every link you post points somewhere
you did not intend.

## 11. Before posting a link

1. Confirm `NEXT_PUBLIC_SITE_URL` is set to the real domain on the deployment
   you are linking to. Everything below it inherits that value.
2. Paste the URL into the platform's own debugger — Facebook's Sharing
   Debugger, or simply into a draft post — and confirm the card renders with
   the page's own title rather than the site-wide one.
3. Re-scrape after changing a page's metadata. Facebook in particular caches a
   card aggressively and will keep serving the old one for days.
