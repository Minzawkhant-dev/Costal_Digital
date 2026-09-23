/**
 * Site content.
 *
 * All marketing copy lives here rather than inline in components, so it can be
 * edited without touching layout — and so `services` / `faq` can later be swapped
 * for Supabase reads with no change to the pages that consume them.
 */

export const brand = {
  name: "Coastal Digital Studio",
  shortName: "Coastal",
  tagline: "Work Smarter. Serve Better.",
  audience: "Small & Growing Businesses",
  description:
    "We build websites, automate workflows, and create practical digital solutions for small and growing businesses.",
  // The published contact address — what a visitor writes to. A free mailbox
  // for now, on purpose: it is reachable today.
  //
  // Two things it deliberately is not:
  //   - It is not `EMAIL_FROM`. Resend will only send from a domain you have
  //     verified, and nobody can verify gmail.com, so the sending identity in
  //     `.env.example` stays on a domain the studio controls.
  //   - It is not the strongest entity signal. Search and answer engines read
  //     a contact address on the site's own domain as better evidence that
  //     this is one business. Worth moving once mail is set up there.
  email: "coastaldigitalocean.studio@gmail.com",
} as const;

/* ============================================================
   Location
   ------------------------------------------------------------
   Drives LocalBusiness structured data.

   Deliberately null until the city is settled. `ProfessionalService` markup
   without a real locality is worse than none — Google expects an address on
   that type — so `organizationSchema()` emits a plain `Organization` while
   this is null, and upgrades itself once it is filled in.

   No other change is needed to activate it:

     export const location: Location | null = {
       city: "Phuket",
       region: "Phuket",
       country: "TH",
       areaServed: ["Thailand"],
     };

   A street address is not required. This is a service-area business, so Google
   prefers `areaServed` with the locality over a postal address you don't have.
   ============================================================ */

export type Location = {
  /** addressLocality — city or town. */
  city: string;
  /** addressRegion — province or state. */
  region: string;
  /** addressCountry — ISO 3166-1 alpha-2, e.g. "TH". */
  country: string;
  /** Where clients can be, if wider than the city. */
  areaServed: string[];
  /** Optional published phone, E.164 format, e.g. "+66812345678". */
  phone?: string;
};

export const location: Location | null = null;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/solutions", label: "Solutions" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
] as const;

export const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61594383865619",
  },
  { label: "TikTok", href: "https://www.tiktok.com/@coastaldigitalstudio" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/coastaldigitalocean.studio/",
  },
] as const;

/* ============================================================
   Contact channels
   ------------------------------------------------------------
   Drives the floating contact dock — `components/site/ContactDock`.

   `href: null` means "not set up yet", and an unset channel is
   dropped from the dock rather than rendered as a dead button.
   Same rule `sameAs` follows in schema.ts, for the same reason: a
   contact route that goes nowhere costs more than an absent one,
   because the visitor who taps it is the one who wanted to talk.

   To activate a channel, replace its `null` with the URL. Nothing
   else needs to change — the dock renders whatever is configured,
   in this order, nearest the button first.
   ============================================================ */

export type ContactChannel = {
  id: "email" | "line" | "messenger" | "whatsapp" | "form";
  label: string;
  /** One short line under the label. Say what the visitor gets. */
  detail: string;
  /** null until the account exists. Unset channels never render. */
  href: string | null;
  /** Opens in a new tab. mailto:, tel: and internal routes do not. */
  external?: boolean;
};

export const contactChannels: ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    detail: "Write to us directly",
    href: `mailto:${brand.email}`,
  },
  {
    id: "line",
    label: "LINE",
    detail: "Message us on LINE",
    // Basic ID @359uwgvw, read off the Official Account QR
    // (qr-official.line.me/gs/M_359uwgvw_GW.png). This one link covers both
    // devices on its own: on a phone it opens the LINE app straight at the
    // add-friend screen, and on a desktop LINE serves its own page with a
    // scannable QR on it — which is why there is no QR image in this repo to
    // go stale the next time the account is regenerated.
    href: "https://line.me/R/ti/p/@359uwgvw",
    external: true,
  },
  {
    id: "messenger",
    label: "Messenger",
    detail: "Chat on Facebook",
    // Derived from the Facebook profile id in `socials` above. Verify it
    // opens a thread before relying on it: m.me resolves for Pages, and a
    // personal profile that has never enabled messaging will not.
    href: "https://m.me/61594383865619",
    external: true,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    detail: "Call or message",
    // `https://wa.me/66812345678` — country code, no +, no spaces.
    // There is no published number anywhere in the site yet; `location.phone`
    // is null for the same reason.
    href: null,
    external: true,
  },
  {
    id: "form",
    label: "Project form",
    detail: "Tell us about the project",
    href: "/start-a-project",
  },
];

/* ============================================================
   Services
   ============================================================ */

export type Service = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
};

export const services: Service[] = [
  {
    slug: "web-development",
    number: "01",
    title: "Web Development",
    summary: "Modern websites designed to turn visitors into customers.",
    description:
      "A website should do more than exist. We design and build fast, clear sites that load quickly, read well on a phone, and make the next step obvious — whether that step is a booking, an enquiry, or a purchase.",
    deliverables: [
      "Business websites",
      "Landing pages",
      "Restaurant & café websites",
      "Booking websites",
      "E-commerce",
      "Website redesign",
      "Website maintenance",
    ],
  },
  {
    slug: "business-automation",
    number: "02",
    title: "Business Automation",
    summary: "Automate repetitive work and connect the tools your business already uses.",
    description:
      "Most small teams lose hours every week to copying information between apps. We map the work you actually do, then build workflows that handle the repetitive parts — reliably, in the background, without anyone remembering to press a button.",
    deliverables: [
      "n8n workflows",
      "Booking automation",
      "Email automation",
      "Lead automation",
      "CRM automation",
      "LINE integrations",
      "Google Sheets automation",
      "AI-powered workflows",
    ],
  },
  {
    slug: "digital-solutions",
    number: "03",
    title: "Digital Solutions",
    summary: "Custom systems, dashboards and integrations built around your business.",
    description:
      "When off-the-shelf software nearly fits but not quite, we build the missing piece. Dashboards that show what matters, databases that hold your customer history properly, and integrations that make separate tools behave like one system.",
    deliverables: [
      "Custom dashboards",
      "CRM systems",
      "Internal business tools",
      "Database systems",
      "API integrations",
      "AI integrations",
      "Custom business systems",
    ],
  },
  {
    slug: "digital-support",
    number: "04",
    title: "Digital Support",
    summary: "Reliable support for websites, domains, hosting, email and digital systems.",
    description:
      "Launch is the beginning, not the end. We keep the technical foundation steady — hosting, domains, business email, backups and security — so you can think about your business instead of your infrastructure.",
    deliverables: [
      "Domain & DNS",
      "Hosting",
      "Business email",
      "Website maintenance",
      "Backup",
      "Security",
      "Technical support",
    ],
  },
];

/* ============================================================
   Problems
   ============================================================ */

export const problems = [
  {
    title: "No professional website",
    detail: "Customers search, find nothing convincing, and go to a competitor instead.",
  },
  {
    title: "Too many repetitive tasks",
    detail: "The same copy-paste job, several times a day, every day.",
  },
  {
    title: "Manual booking and follow-ups",
    detail: "Every reservation depends on somebody being free to reply.",
  },
  {
    title: "Customer information everywhere",
    detail: "Names in a notebook, numbers in a chat, orders in a spreadsheet.",
  },
  {
    title: "Tools that don't communicate",
    detail: "Five apps that each hold one piece of the same story.",
  },
  {
    title: "Too much time on admin",
    detail: "Hours spent running the business instead of growing it.",
  },
] as const;

/* ============================================================
   Solutions
   ============================================================ */

export const solutions = [
  {
    outcome: "More Bookings",
    stack: "Website + Online Booking + Automatic Confirmation",
    detail:
      "A booking flow that works at midnight. The customer picks a time, the confirmation sends itself, and the reminder goes out before they forget.",
  },
  {
    outcome: "Less Manual Work",
    stack: "n8n + Business Automation",
    detail:
      "The repetitive steps between your apps become a workflow that runs on its own, in order, every time.",
  },
  {
    outcome: "Better Customer Management",
    stack: "CRM + Customer Database",
    detail:
      "One place that holds every customer, every enquiry and every conversation — searchable, and still there next year.",
  },
  {
    outcome: "Better Visibility",
    stack: "Dashboard + Business Analytics",
    detail:
      "The handful of numbers that actually tell you how the business is doing, on one screen, kept current automatically.",
  },
  {
    outcome: "Better Communication",
    stack: "Email + LINE + Notifications",
    detail:
      "Customers hear back quickly and your team gets told what needs attention, without anybody watching an inbox.",
  },
] as const;

/* ============================================================
   Business types
   ============================================================ */

export const businessTypes = [
  {
    title: "Restaurants & Cafés",
    stack: "Website, Menu, Booking and Customer Management",
    detail: "Show the menu properly, take reservations online, and keep guests coming back.",
  },
  {
    title: "Hospitality",
    stack: "Website, Direct Booking and Inquiry Automation",
    detail: "Take direct bookings, answer enquiries faster, and depend less on the platforms.",
  },
  {
    title: "Service Businesses",
    stack: "Website, Appointment and Customer Follow-up",
    detail: "Fill the calendar, cut no-shows with reminders, and follow up without the admin.",
  },
  {
    title: "Real Estate",
    stack: "Property Website, Lead Management and CRM",
    detail: "Present listings well and make sure no enquiry goes cold in an inbox.",
  },
  {
    title: "Small & Growing Businesses",
    stack: "Website, Automation and Digital Systems",
    detail: "A foundation that fits the business today and can grow with it.",
  },
] as const;

/* ============================================================
   Projects
   ------------------------------------------------------------
   The list itself lives in `@/lib/projects`, which is the one file
   you edit to add a case study. It is re-exported here so that
   everything already importing `projects` from this module — the
   sitemap, FeaturedWork, ProjectArtwork — keeps working unchanged.

   `isDemo` is now derived from each project's `status` rather than
   hardcoded, because the list holds delivered client work as well
   as demonstration builds.
   ============================================================ */

export type { Project, ProjectStatus, Shot, Feature } from "@/lib/projects";
export { projects, getProject } from "@/lib/projects";

/* ============================================================
   Why Coastal
   ============================================================ */

export const whyCoastal = [
  {
    title: "Business First",
    detail: "We focus on solving business problems, not simply adding technology.",
  },
  {
    title: "Practical Solutions",
    detail: "We build useful systems that solve real problems.",
  },
  {
    title: "Connected Systems",
    detail: "We connect websites, forms, CRM, email and automation into one workflow.",
  },
  {
    title: "Built to Grow",
    detail: "Our solutions can evolve as your business grows.",
  },
  {
    title: "Ongoing Support",
    detail: "We continue to support and improve your digital systems after launch.",
  },
] as const;

/* ============================================================
   Process
   ============================================================ */

export const processSteps = [
  {
    number: "01",
    title: "Discover",
    summary: "Understand the business, goals and problems.",
    detail:
      "We start with how the business actually runs today — what takes too long, what gets forgotten, and where customers drop off. No solution is proposed until the problem is clear.",
    outputs: ["Discovery call", "Current workflow map", "Problem definition"],
  },
  {
    number: "02",
    title: "Plan",
    summary: "Define the solution, scope and timeline.",
    detail:
      "We agree what gets built, what it costs, and when it lands. Anything out of scope is written down as out of scope, so there are no surprises later.",
    outputs: ["Proposal", "Scope and deliverables", "Timeline and milestones"],
  },
  {
    number: "03",
    title: "Design",
    summary: "Create the user experience and visual direction.",
    detail:
      "Structure before decoration. We lay out the journey a customer takes, then give it a visual direction that fits the business rather than a trend.",
    outputs: ["Sitemap and user flow", "Visual direction", "Key screen designs"],
  },
  {
    number: "04",
    title: "Build",
    summary: "Develop the website, system or automation.",
    detail:
      "Development happens in visible stages. You see working pages and running workflows as they are completed, not only at the end.",
    outputs: ["Working build on a preview URL", "Automation workflows", "Progress checkpoints"],
  },
  {
    number: "05",
    title: "Launch",
    summary: "Test, deploy and make everything ready for customers.",
    detail:
      "We test the paths that matter — booking, submitting, paying — on real devices, then deploy with domains, email and analytics configured properly.",
    outputs: ["Testing across devices", "Domain, DNS and email setup", "Analytics and handover"],
  },
  {
    number: "06",
    title: "Support",
    summary: "Maintain, monitor and improve the system.",
    detail:
      "Systems drift. We keep things patched, backed up and monitored, and improve them as the business changes.",
    outputs: ["Monitoring and backups", "Maintenance and updates", "Ongoing improvements"],
  },
] as const;

/* ============================================================
   Pricing
   ------------------------------------------------------------
   `startingFrom: null` renders as "Custom quote". Set a string such as
   "฿35,000" once you have decided your published starting prices — nothing
   else needs to change.
   ============================================================ */

export type PricingTier = {
  title: string;
  startingFrom: string | null;
  basis: string;
  detail: string;
  includes: string[];
};

export const pricingTiers: PricingTier[] = [
  {
    title: "Website",
    startingFrom: "฿28,000",
    basis: "One-time project",
    detail: "Business sites, landing pages, restaurant and booking sites, redesigns. Built to load fast on a phone and to keep working when something breaks.",
    includes: [
      "Mobile-first design and build",
      "Contact form that reaches you in seconds",
      "Google Maps, opening hours and location",
      "Metadata, sitemap and social preview card",
      "Launch, handover and a recorded walkthrough",
      "Self-editable content and booking, scoped to fit",
    ],
  },
  {
    title: "Automation",
    startingFrom: "฿15,000",
    basis: "Per workflow",
    detail: "Booking, email, lead and CRM automation. The point is simple: nobody on your team retypes anything into a second system again.",
    includes: [
      "We map your current process first",
      "Built, tested and connected to your tools",
      "Alerts to LINE, not just email",
      "Error handling and automatic retries",
      "You are told when something fails",
      "Written documentation and handover",
    ],
  },
  {
    title: "Digital Solutions",
    startingFrom: "฿37,500",
    basis: "Custom quote",
    detail: "Dashboards, CRM, internal tools, databases and integrations. Quoted in days and scoped in writing before day one.",
    includes: [
      "Requirements and data modelling",
      "Scope in writing, including what is out",
      "Custom build on your own data",
      "Integrations and API work",
      "Access control, so staff see only their part",
      "Training and handover",
    ],
  },
  {
    title: "Digital Support",
    startingFrom: "฿2,500/month",
    basis: "Monthly plan",
    detail: "Hosting, domains, business email, backups and someone to call. A support plan is a promise to do work, not a subscription.",
    includes: [
      "Hosting and domain management",
      "Automatic backups, checked",
      "Security patches and updates",
      "Uptime monitoring",
      "Up to 1 hour of changes a month",
      "You contact a person, not a ticket queue",
    ],
  },
];

/* ============================================================
   FAQ
   ============================================================ */

export const faqs = [
  {
    question: "How much does a website cost?",
    answer:
      "It depends on what the site needs to do. A focused landing page and a multi-language restaurant site with online booking are very different pieces of work. We scope around the outcome first, then send a written proposal with a fixed figure, the deliverables and the milestones before anything starts.",
  },
  {
    question: "How long does a project take?",
    answer:
      "A focused website is usually three to six weeks from kickoff. A single automation workflow is often one to two weeks. Larger custom systems depend on how many tools have to be connected — we give you a dated timeline during the planning stage rather than an estimate at the end.",
  },
  {
    question: "Do you provide hosting?",
    answer:
      "Yes. We can set up and manage hosting, domains, DNS, business email, backups and SSL, either as part of the project or as a monthly support plan. If you would rather own the accounts directly, we will set everything up in your name and hand over access.",
  },
  {
    question: "Can you redesign an existing website?",
    answer:
      "Yes, and it is often the faster route. We can keep what already works — your content, your rankings, your domain — and rebuild the design, the mobile experience and the structure around it. We can also connect an existing site to new booking or follow-up workflows without rebuilding it.",
  },
  {
    question: "Can you automate my existing workflow?",
    answer:
      "Usually, yes. If the steps are repeatable and the tools involved have an API or a webhook — most modern ones do — it can generally be automated. We start by mapping how the work is done now, then automate the parts that are genuinely repetitive and leave the judgement calls to people.",
  },
  {
    question: "Can you integrate LINE?",
    answer:
      "Yes. LINE is how a lot of businesses actually talk to customers, so we treat it as a first-class channel. We can send booking confirmations and reminders to customers, push new enquiry notifications to your team, and connect LINE into the same workflow as your website and email.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes. Monthly support plans cover maintenance, updates, backups, monitoring, hosting management and a set amount of improvement work. You can also come back for one-off changes without a plan — a plan simply makes response times and priorities predictable.",
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "No. That is the point of hiring us. We explain what we are proposing in plain terms, handle the technical setup ourselves, and hand over something you can operate without a manual. If part of the system needs your team to use it daily, we train them on it.",
  },
  {
    question: "Can you work with businesses remotely?",
    answer:
      "Yes. Most of our work runs over calls, email and LINE, with a shared preview link so you can see progress as it happens. Being in the same city is convenient but has never been a requirement.",
  },
  {
    question: "What happens after I submit a project request?",
    answer:
      "You get a confirmation email straight away so you know it arrived. We review the details and reply to arrange a short discovery call. After that call we send a written proposal covering scope, timeline and cost. Nothing is charged and nothing is committed until you approve that proposal.",
  },
] as const;

/* ============================================================
   What you get
   ------------------------------------------------------------
   The scrolling strip under the hero headline.

   This used to list the stack — Next.js, TypeScript, Supabase,
   Vercel, Resend. All true, and all meaningless to the people
   this site is written for: a diner owner in Jomtien does not
   know what Supabase is, and the first thing under the headline
   is the worst place to find that out.

   So these are the same capabilities said plainly. Two brand
   names stay, because they are the two a Thai business owner
   already recognises and trusts — LINE is where their customers
   actually message them, and Google is the email they know.

   The real stack has not been hidden, only moved to where
   someone technical goes looking for it: `technology` on each
   case study in projects.ts, rendered on /work/<slug>.
   ============================================================ */

export const whatYouGet = [
  "Online booking",
  "LINE notifications",
  "Automatic emails",
  "Your own customer list",
  "Google business email",
  "Works on every phone",
  "Daily backups",
  "Accounts in your name",
] as const;

/* ============================================================
   Form options
   ============================================================ */

export const serviceOptions = [
  "Website",
  "Website Redesign",
  "Booking System",
  "Automation",
  "CRM",
  "Digital Solution",
  "Digital Support",
  "Other",
] as const;

export const businessTypeOptions = [
  "Restaurant or Café",
  "Hotel or Hospitality",
  "Service Business",
  "Real Estate",
  "Retail or E-commerce",
  "Professional Services",
  "Other",
] as const;

export const budgetOptions = [
  "Not sure yet",
  "Under 30,000 THB",
  "30,000 – 60,000 THB",
  "60,000 – 120,000 THB",
  "120,000 – 250,000 THB",
  "250,000+ THB",
] as const;

export const timelineOptions = [
  "As soon as possible",
  "Within 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "Just planning ahead",
] as const;
