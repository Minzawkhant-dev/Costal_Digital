/* ============================================================
   Projects — the portfolio's single source of truth
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU EDIT TO ADD A PROJECT.

   Copy the block at the bottom marked TEMPLATE, fill it in, drop
   the screenshots into /public/work/<slug>/ and you are done. The
   card, the case-study page, the numbering, the status badge, the
   sitemap entry and the next/previous links all follow from here.

   Two fields are derived for you, so they can never fall out of
   step with each other:

     number   the 01 / 02 / 03 label, from list order
     isDemo   true unless status is "live"

   Honesty rule: `status` is not decoration. A project that is not
   real, delivered client work must be "demo" or "concept", and
   every surface that renders it will say so.
   ============================================================ */

export type ProjectStatus = "live" | "demo" | "concept";

/** One screenshot, at one breakpoint. */
export type Shot = {
  /** Path under /public. */
  src: string;
  /** Intrinsic pixel size of the file, for next/image. */
  width: number;
  height: number;
  /** Shown under the image. Say what the screen does, not what it is. */
  caption: string;
  alt: string;
};

/** A named capability, for the "Key features" grid. */
export type Feature = {
  title: string;
  detail: string;
};

/** What an author writes. `number` and `isDemo` are added by defineProjects. */
export type ProjectInput = {
  slug: string;
  title: string;

  /* --- the labels on the card --- */
  /** Sector, e.g. "Restaurant". Rendered as the project type chip. */
  category: string;
  /** What was built, e.g. "Website + Online Booking + Admin Panel". */
  stack: string;
  status: ProjectStatus;
  /** Omit for a demo or concept, where a delivery year would be meaningless. */
  year?: string;

  /* --- optional provenance --- */
  client?: string;
  location?: string;
  /** Omit for a project with nothing public to visit. */
  liveUrl?: string;

  /* --- copy --- */
  /** One or two lines. This is the card's short description. */
  summary: string;
  /** 1. Project overview — a paragraph. Falls back to `summary` when omitted. */
  overview?: string;
  /** 2. The problem. */
  problem: string;
  /** 2. The challenge that made it awkward. */
  challenge: string;
  /** 3. What we built — the paragraph. */
  solution: string;
  /** 3. What we built — the itemised list. */
  system: string[];
  /** 4. Key features. The section is omitted entirely when there are none. */
  features?: Feature[];
  /** What changed for the business. */
  result: string[];
  technology: string[];

  /* --- imagery --- */
  /** Card image. Falls back to generated artwork when omitted. */
  cover?: Shot;
  /** 5. Project screenshots. Either list may be empty. */
  shots?: {
    desktop: Shot[];
    mobile: Shot[];
  };

  /** Tints the artwork and the accent rules. */
  accent: "accent" | "signal" | "ink";
};

export type Project = ProjectInput & {
  number: string;
  /** Derived from status. Kept so older components reading it still work. */
  isDemo: boolean;
};

function defineProjects(list: ProjectInput[]): Project[] {
  return list.map((project, index) => ({
    ...project,
    number: String(index + 1).padStart(2, "0"),
    isDemo: project.status !== "live",
  }));
}

/* ------------------------------------------------------------
   Shot helpers — the two viewports every capture is taken at, so
   a new project's screenshots do not need their sizes typed out.
   ------------------------------------------------------------ */

const DESKTOP = { width: 2880, height: 1800 };
const MOBILE = { width: 780, height: 1688 };

const desktopShot = (src: string, caption: string, alt: string): Shot => ({
  src,
  ...DESKTOP,
  caption,
  alt,
});

const mobileShot = (src: string, caption: string, alt: string): Shot => ({
  src,
  ...MOBILE,
  caption,
  alt,
});

/* ============================================================
   The projects
   ============================================================ */

export const projects: Project[] = defineProjects([
  {
    slug: "my-favorite-diner",
    title: "My Favorite Diner",
    category: "Restaurant",
    stack: "Website + Online Booking + Admin Panel",
    status: "live",
    year: "2025",
    client: "My Favorite Diner Bar and Grill",
    location: "Jomtien Complex, Pattaya, Thailand",
    liveUrl: "https://myfavoritediner.com",

    summary:
      "A diner website whose staff run the whole thing themselves — menu, prices, photographs, bookings and mailshots — without anyone touching code.",

    overview:
      "My Favorite Diner is an American bar and grill on Thappraya Road in Jomtien, Pattaya. The site is the restaurant's shopfront and its back office at once: a menu-led marketing website with a gallery, guest reviews and online table booking on the front, and a private admin panel behind it where the team edits all of it. A menu of 108 dishes across 12 sections, every price in baht, every photograph — all of it is editable from a phone by someone who has never seen a line of code.",

    problem:
      "A restaurant menu is never finished. Prices move, dishes come off, a new burger goes on for the season, and the photograph the kitchen took last night is better than the one on the site. If every one of those edits has to go through a developer, the menu online drifts away from the menu on the table within a month — and the bookings that arrive by phone and Facebook message while the floor is busy quietly get lost.",

    challenge:
      "The panel had to be genuinely usable by busy floor staff on a phone, mid-service, or it would be abandoned and the site would go stale. Bookings had to reach the team through the channel they actually read — in Thailand that is LINE, not email. Guest data is personal data under Thailand's PDPA, so retention could not be an afterthought. And the site had to stay standing when a dependency did not: no restaurant should have a blank menu because a database is having a bad morning.",

    solution:
      "A Next.js site on Vercel with Supabase behind it, built so that the database is the menu — and so that nothing breaks when it isn't. Bookings write straight to Postgres, alert the staff LINE group within seconds, email the guest a confirmation with a private cancel link, and appear in a panel where they move from New to Confirmed to Done. Every piece of content on the public site has an editor behind it, and the whole thing degrades gracefully: with Supabase disconnected the site still serves a complete written-in menu rather than an error.",

    system: [
      "Marketing site with menu, gallery, reviews and location",
      "Online table booking with capacity limits and closed-day rules",
      "Private admin panel — menu, gallery, bookings, reviews, subscribers, promotions, settings",
      "LINE Messaging API alerts to the staff group on every booking and cancellation",
      "Transactional email for confirmations, cancellations and welcome messages",
      "Guest self-service cancellation by private link — no account, no phone call",
      "Moderated guest reviews with a staff approval queue",
      "Poster-first promotional mailshots with per-recipient unsubscribe",
      "System health monitor and plain-English activity log",
      "Nightly housekeeping for PDPA data retention",
    ],

    features: [
      {
        title: "The menu is the database",
        detail:
          "12 sections, 108 dishes, prices in baht, badges, per-section small print and around 110 dish photographs — all editable from the panel. Sections and dishes reorder with arrows rather than a number box, and a dish can be hidden with one press of the eye without losing it.",
      },
      {
        title: "Bookings that actually reach someone",
        detail:
          "A request lands in the staff LINE group within seconds of being submitted, with the guest's name, party size, phone and notes, and a button straight to the panel. Email is the backup, not the primary. An alert never blocks the booking — the guest is told their table is requested the moment it saves.",
      },
      {
        title: "Capacity and closed days, enforced server-side",
        detail:
          "The diner sets how many tables it accepts per day and which days it is closed. Those dates are struck through on the calendar, and the server refuses them anyway — so a guest with yesterday's page still open cannot slip past a setting that changed this morning.",
      },
      {
        title: "Guests cancel themselves",
        detail:
          "Every confirmation carries a private cancel link. No account, no login, no phone call. The table is freed automatically and the restaurant is told, which is the difference between a no-show and a table that can be sold again.",
      },
      {
        title: "Nothing a stranger writes goes live unapproved",
        detail:
          "Guest reviews land in a pending queue, notify the LINE group, and reach the homepage only when a human approves them. Submissions are rate-limited per address, and anything containing a web link is rejected outright — a link in a restaurant review is almost always advertising.",
      },
      {
        title: "Mailshots that survive a double-click",
        detail:
          "Upload a poster, preview it exactly as subscribers will see it, send a test, then send to the list. A second click or a second tab is turned away rather than starting a second send, and every delivered address is recorded as it goes — so a batch that fails halfway can be finished without mailing anyone twice.",
      },
      {
        title: "It tells you when it is broken",
        detail:
          "A monitor checks the database, the booking table, email configuration, whether a new booking would actually reach anybody, and how much of the LINE monthly allowance is left. Problems appear in plain English on the panel's home page, and /api/health returns 503 so an uptime monitor can watch it too.",
      },
      {
        title: "Personal data does not pile up",
        detail:
          "Guest names, phone numbers and notes are personal data under Thailand's PDPA. A nightly job deletes bookings older than twelve months, forgets people who unsubscribed over a year ago, and trims the activity log — so retention is a property of the system rather than a policy nobody performs.",
      },
      {
        title: "Built to be found",
        detail:
          "Restaurant and menu structured data covering every dish and price with THB offers, breadcrumbs, a sitemap, robots.txt and a branded share image. The phone number and address Google sees come from the panel's settings, so they stay in step automatically.",
      },
      {
        title: "Fails soft, everywhere",
        detail:
          "With Supabase disconnected the site serves a complete written-in menu instead of an error. Without email configured, sending is skipped and logged rather than crashing a booking. The guest-facing path is designed to survive every dependency it has.",
      },
    ],

    result: [
      "The restaurant edits its own menu, prices and photographs — no developer in the loop, no drift between the site and the table",
      "Table requests arrive around the clock and land where staff will see them, instead of competing with a busy service",
      "Guests cancel themselves, so a freed table can be sold again rather than becoming a no-show",
      "One panel replaces the scattering of chat threads, inboxes and printed menus the business ran on",
      "Retention, moderation and deliverability are handled by the system rather than left to somebody to remember",
    ],

    technology: [
      "Next.js 16 (App Router)",
      "TypeScript",
      "Tailwind CSS",
      "Supabase (Postgres, Auth, Storage)",
      "Resend",
      "LINE Messaging API",
      "Vercel",
    ],

    cover: desktopShot(
      "/work/my-favorite-diner/desktop-home.webp",
      "The homepage",
      "My Favorite Diner homepage, showing the Classic American Comfort Food hero",
    ),

    shots: {
      desktop: [
        desktopShot(
          "/work/my-favorite-diner/desktop-home.webp",
          "The homepage — hero, address and a direct route to the menu",
          "Desktop homepage with the diner's hero plate and booking call to action",
        ),
        desktopShot(
          "/work/my-favorite-diner/desktop-menu.webp",
          "The menu carousel — every section, dish and price served from the database",
          "Desktop menu section showing burger cards with photographs and descriptions",
        ),
        desktopShot(
          "/work/my-favorite-diner/desktop-fullmenu.webp",
          "The full menu page, grouped into courses the staff define themselves",
          "Desktop full menu page listing dishes by course",
        ),
        desktopShot(
          "/work/my-favorite-diner/desktop-visit.webp",
          "Find the diner — opening hours, contact details and the booking form",
          "Desktop booking section with address, opening hours and the Book a Table form",
        ),
        desktopShot(
          "/work/my-favorite-diner/desktop-gallery.webp",
          "The gallery — a photo grid the restaurant manages from the panel",
          "Desktop gallery section showing the restaurant photo grid",
        ),
        desktopShot(
          "/work/my-favorite-diner/desktop-about.webp",
          "The story section, set in the diner's own type and colour",
          "Desktop about section introducing the restaurant",
        ),
      ],
      mobile: [
        mobileShot(
          "/work/my-favorite-diner/mobile-home.webp",
          "The homepage at 390px — the layout most guests actually see",
          "Mobile homepage with collapsed navigation and stacked hero",
        ),
        mobileShot(
          "/work/my-favorite-diner/mobile-menu.webp",
          "The menu, re-flowed into a single swipeable column",
          "Mobile menu section showing a single dish card",
        ),
        mobileShot(
          "/work/my-favorite-diner/mobile-fullmenu.webp",
          "The full menu on a phone, course by course",
          "Mobile full menu page",
        ),
        mobileShot(
          "/work/my-favorite-diner/mobile-visit.webp",
          "Booking on a phone — 16px inputs, so iOS does not zoom on tap",
          "Mobile booking form",
        ),
        mobileShot(
          "/work/my-favorite-diner/mobile-gallery.webp",
          "The gallery grid on a phone",
          "Mobile gallery section",
        ),
        mobileShot(
          "/work/my-favorite-diner/mobile-about.webp",
          "The story section on a phone",
          "Mobile about section",
        ),
      ],
    },

    accent: "signal",
  },

  /* ------------------------------------------------------------
     Demonstration builds.

     Copy carried over unchanged from the original list. They have
     no `overview`, `features`, `year` or screenshots, and none has
     been invented for them — the case study falls back to the
     summary, skips the features section, and shows the generated
     artwork in place of a screenshot gallery.
     ------------------------------------------------------------ */

  {
    slug: "restaurant-digital-system",
    title: "Restaurant Digital System",
    category: "Restaurant",
    stack: "Website + Booking + Email Automation",
    status: "demo",
    summary:
      "A restaurant that takes reservations online and confirms them without anyone touching a phone.",
    problem:
      "A restaurant takes every reservation by phone and social media message. Bookings live in a paper diary at the host stand. When the restaurant is busy — exactly when bookings come in — nobody has a free hand to answer, and the enquiry is lost.",
    challenge:
      "The system had to be genuinely simpler than the paper diary, or the floor staff would quietly stop using it. It also had to work in two languages, handle the gap between an enquiry and a confirmed table, and never double-book a seating.",
    solution:
      "A fast, menu-led website with an online booking flow attached. A reservation writes straight to the database, sends the guest a confirmation immediately, notifies the floor manager, and schedules a reminder for the day before the booking.",
    system: [
      "Website with menu, gallery and location",
      "Online booking form with seating and time selection",
      "Reservation database with availability rules",
      "Automatic guest confirmation email",
      "Staff notification to LINE and email",
      "Day-before reminder to reduce no-shows",
      "Simple daily covers view for the manager",
    ],
    result: [
      "Reservations arrive around the clock, not only during quiet hours",
      "Confirmation is instant instead of depending on staff availability",
      "One reservation list replaces the diary, the inbox and the chat threads",
      "Reminders give the kitchen an accurate cover count the night before",
    ],
    technology: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "n8n", "Resend", "LINE Messaging API"],
    accent: "signal",
  },

  {
    slug: "salon-booking-system",
    title: "Salon Booking System",
    category: "Service Business",
    stack: "Website + Appointment + Reminder Automation",
    status: "demo",
    summary:
      "An appointment system that fills the calendar and quietly cuts down on no-shows.",
    problem:
      "A salon books appointments through chat. Each booking takes several messages to agree a time, the stylist's availability lives in their head, and clients who forget an appointment simply do not arrive — leaving an unbillable gap in the day.",
    challenge:
      "Different services take very different amounts of time, and each stylist has their own schedule. The booking flow had to reflect that without becoming a form nobody wants to fill in.",
    solution:
      "A booking site where a client picks a service, sees only the slots that stylist genuinely has free, and books in a single pass. Confirmation and reminders send themselves, and rebooking prompts go out after a set interval.",
    system: [
      "Service catalogue with duration and price per treatment",
      "Per-stylist availability and working hours",
      "Real-time slot calculation, so only bookable times are shown",
      "Instant confirmation email and calendar invite",
      "Reminder 24 hours before the appointment",
      "Automatic rebooking prompt after the usual return interval",
      "Client history stored against each record",
    ],
    result: [
      "Booking takes one pass instead of a chat conversation",
      "Reminders address the single biggest source of lost revenue",
      "Stylists stop being the scheduling system",
      "Client history makes returning visits easier to personalise",
    ],
    technology: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "n8n", "Resend", "Google Calendar API"],
    accent: "accent",
  },

  {
    slug: "small-business-automation",
    title: "Small Business Automation",
    category: "Professional Services",
    stack: "Lead Form + CRM + Email + Dashboard",
    status: "demo",
    summary:
      "Every enquiry captured, acknowledged, assigned and visible — without manual handling.",
    problem:
      "Enquiries arrive through a website form, a Facebook page and a LINE account. They are re-typed into a spreadsheet when someone remembers. Nobody can say how many leads came in last month, or which ones were never answered.",
    challenge:
      "Three separate intake channels had to converge into one record without duplicates, and the owner needed a view of the pipeline that stayed accurate on its own.",
    solution:
      "A single lead pipeline. Every channel writes to one database, the client is acknowledged immediately, the team is notified, a follow-up task is created, and a dashboard shows the pipeline as it actually stands.",
    system: [
      "One validated lead form feeding a single database",
      "Deduplication so repeat enquiries update rather than duplicate",
      "Immediate client acknowledgement email",
      "Admin notification with the full enquiry detail",
      "Automatic follow-up task with an owner and a due date",
      "Lead status pipeline from new through to won or lost",
      "Dashboard covering new leads, active projects and pending quotes",
    ],
    result: [
      "No enquiry sits unacknowledged while somebody is busy",
      "One pipeline replaces three inboxes and a spreadsheet",
      "Follow-up happens on a schedule rather than from memory",
      "The owner can see the state of the pipeline at a glance",
    ],
    technology: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "n8n", "Resend", "PostgreSQL"],
    accent: "ink",
  },

  /* ============================================================
     TEMPLATE — copy this, uncomment, fill in, done.
     Screenshots go in /public/work/<slug>/.
     Set status to "demo" or "concept" for anything that is not
     delivered client work; the badge follows automatically.
     ------------------------------------------------------------

  {
    slug: "kebab-case-slug",
    title: "Project Name",
    category: "Sector",
    stack: "What was built",
    status: "demo",
    year: "2026",
    client: "Client name",                    // optional
    location: "City, Country",                // optional
    liveUrl: "https://example.com",           // optional
    summary: "One or two lines for the card.",
    overview: "A paragraph introducing the project.",
    problem: "What was going wrong.",
    challenge: "What made it awkward to solve.",
    solution: "What was built, in a paragraph.",
    system: ["Component one", "Component two"],
    features: [
      { title: "Feature name", detail: "What it does and why it matters." },
    ],
    result: ["What changed for the business"],
    technology: ["Next.js", "TypeScript"],
    cover: desktopShot("/work/<slug>/desktop-home.webp", "Caption", "Alt text"),
    shots: {
      desktop: [desktopShot("/work/<slug>/desktop-home.webp", "Caption", "Alt text")],
      mobile: [mobileShot("/work/<slug>/mobile-home.webp", "Caption", "Alt text")],
    },
    accent: "accent",
  },

     ============================================================ */
]);

/** Lookup used by the case-study route. */
export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
