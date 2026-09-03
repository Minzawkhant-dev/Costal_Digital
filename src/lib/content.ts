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
  email: "hello@coastaldigital.studio",
} as const;

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
  { label: "Facebook", href: "https://facebook.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "YouTube", href: "https://youtube.com" },
] as const;

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
   Demo projects
   ------------------------------------------------------------
   These are demonstration builds, not client work. Every surface that
   renders a project MUST show the DEMO label — see `isDemo`.
   ============================================================ */

export type Project = {
  slug: string;
  number: string;
  title: string;
  stack: string;
  category: string;
  isDemo: true;
  summary: string;
  problem: string;
  challenge: string;
  solution: string;
  system: string[];
  result: string[];
  technology: string[];
  accent: "accent" | "signal" | "ink";
};

export const projects: Project[] = [
  {
    slug: "restaurant-digital-system",
    number: "01",
    title: "Restaurant Digital System",
    stack: "Website + Booking + Email Automation",
    category: "Restaurant",
    isDemo: true,
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
    number: "02",
    title: "Salon Booking System",
    stack: "Website + Appointment + Reminder Automation",
    category: "Service Business",
    isDemo: true,
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
    number: "03",
    title: "Small Business Automation",
    stack: "Lead Form + CRM + Email + Dashboard",
    category: "Professional Services",
    isDemo: true,
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
];

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
    startingFrom: null,
    basis: "One-time project",
    detail: "Business sites, landing pages, restaurant and booking sites, redesigns.",
    includes: [
      "Design and build",
      "Mobile and performance work",
      "Basic on-page SEO",
      "Launch and handover",
    ],
  },
  {
    title: "Automation",
    startingFrom: null,
    basis: "Per workflow",
    detail: "Booking, email, lead and CRM automation built on n8n.",
    includes: [
      "Workflow mapping",
      "Build and testing",
      "Connections to your existing tools",
      "Documentation",
    ],
  },
  {
    title: "Digital Solutions",
    startingFrom: null,
    basis: "Custom quote",
    detail: "Dashboards, CRM, internal tools, databases and integrations.",
    includes: [
      "Requirements and data modelling",
      "Custom build",
      "Integrations and API work",
      "Training",
    ],
  },
  {
    title: "Digital Support",
    startingFrom: null,
    basis: "Monthly plan",
    detail: "Hosting, domains, business email, maintenance, backups and support.",
    includes: [
      "Hosting and domain management",
      "Updates and backups",
      "Monitoring and security",
      "Technical support",
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
   Technology
   ============================================================ */

export const techStack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "n8n",
  "Resend",
  "Vercel",
  "LINE API",
  "Google Workspace",
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
