/**
 * Database types.
 *
 * Hand-written to match `supabase/schema.sql`. Once your Supabase project is
 * live you can replace this file wholesale with generated types:
 *
 *   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
 */

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "review"
  | "launched"
  | "on_hold"
  | "cancelled";

export type PaymentStatus = "unpaid" | "deposit_paid" | "partially_paid" | "paid";

export const leadStatuses: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];

export const projectStatuses: ProjectStatus[] = [
  "planning",
  "in_progress",
  "review",
  "launched",
  "on_hold",
  "cancelled",
];

export type Lead = {
  id: string;
  name: string;
  business_name: string;
  email: string;
  phone: string | null;
  business_type: string | null;
  website: string | null;
  service: string | null;
  budget: string | null;
  timeline: string | null;
  message: string;
  status: LeadStatus;
  source: string;
  ip_hash: string | null;
  user_agent: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

/** Everything the database fills in itself, or that is genuinely optional. */
export type LeadInsert = {
  name: string;
  business_name: string;
  email: string;
  message: string;
  phone?: string | null;
  business_type?: string | null;
  website?: string | null;
  service?: string | null;
  budget?: string | null;
  timeline?: string | null;
  status?: LeadStatus;
  source?: string;
  ip_hash?: string | null;
  user_agent?: string | null;
  notes?: string | null;
};

export type Project = {
  id: string;
  lead_id: string | null;
  name: string;
  description: string | null;
  status: ProjectStatus;
  budget: number | null;
  currency: string;
  payment: PaymentStatus;
  start_date: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
};

export type Contact = {
  id: string;
  name: string;
  business_name: string | null;
  email: string;
  phone: string | null;
  line_id: string | null;
  business_type: string | null;
  website: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  deliverables: string[];
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Shaped to satisfy supabase-js's `GenericSchema`: every table needs
 * Row / Insert / Update / Relationships, and the schema needs Views, Functions,
 * Enums and CompositeTypes even when empty.
 */
export type Database = {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: Partial<Lead>;
        Relationships: [];
      };
      projects: {
        Row: Project;
        Insert: Partial<Project> & { name: string };
        Update: Partial<Project>;
        Relationships: [
          {
            foreignKeyName: "projects_lead_id_fkey";
            columns: ["lead_id"];
            referencedRelation: "leads";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
        ];
      };
      contacts: {
        Row: Contact;
        Insert: Partial<Contact> & { name: string; email: string };
        Update: Partial<Contact>;
        Relationships: [];
      };
      services: {
        Row: ServiceRow;
        Insert: Partial<ServiceRow> & { slug: string; title: string; summary: string };
        Update: Partial<ServiceRow>;
        Relationships: [];
      };
      faq: {
        Row: FaqRow;
        Insert: Partial<FaqRow> & { question: string; answer: string };
        Update: Partial<FaqRow>;
        Relationships: [];
      };
      admins: {
        Row: { user_id: string; email: string; full_name: string | null; created_at: string };
        Insert: { user_id: string; email: string; full_name?: string | null };
        Update: { email?: string; full_name?: string | null };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      bump_rate_limit: {
        Args: { p_key: string; p_window_seconds: number };
        Returns: number;
      };
    };
    Enums: {
      lead_status: LeadStatus;
      project_status: ProjectStatus;
      payment_status: PaymentStatus;
    };
    CompositeTypes: Record<never, never>;
  };
};

/** Human labels for lead statuses, used across the admin UI. */
export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  planning: "Planning",
  in_progress: "In progress",
  review: "Review",
  launched: "Launched",
  on_hold: "On hold",
  cancelled: "Cancelled",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  deposit_paid: "Deposit paid",
  partially_paid: "Partially paid",
  paid: "Paid",
};
