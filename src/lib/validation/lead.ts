import { z } from "zod";
import {
  budgetOptions,
  businessTypeOptions,
  serviceOptions,
  timelineOptions,
} from "@/lib/content";

/**
 * Lead form schema.
 *
 * Shared by the client form and the API route, so the browser and the server
 * enforce exactly the same rules — the client copy is for fast feedback, the
 * server copy is the one that actually protects the database.
 */

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(120, "That name is too long"),

  businessName: z
    .string()
    .trim()
    .min(2, "Please enter your business name")
    .max(160, "That business name is too long"),

  email: z
    .string()
    .trim()
    .min(1, "Please enter your email")
    .max(320, "That email is too long")
    .email("Please enter a valid email address"),

  phone: optionalText(120),

  businessType: z
    .enum(businessTypeOptions)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),

  website: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined))
    .refine(
      (value) =>
        value === undefined ||
        /^((https?:\/\/)?[\w-]+(\.[\w-]+)+([\w\-./?%&=#:]*)?)$/i.test(value),
      { message: "Please enter a valid website address" },
    ),

  service: z
    .enum(serviceOptions)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),

  budget: z
    .enum(budgetOptions)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),

  timeline: z
    .enum(timelineOptions)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),

  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more — at least 10 characters")
    .max(5000, "Please keep this under 5000 characters"),

  source: z.string().trim().max(80).optional(),

  /* --- spam controls, not shown to real users --- */

  /**
   * Honeypot. Bots fill every field they find; humans never see this one.
   *
   * Deliberately permissive: rejecting it *here* returns a 400 naming the
   * field, which tells a bot exactly which input is the trap. The route
   * inspects it separately and answers with a plain success instead, so a bot
   * gets no signal that it was caught.
   */
  company: z.string().max(200).optional(),

  /** Milliseconds between form mount and submit. */
  elapsedMs: z.number().int().nonnegative().optional(),
});
/** Raw shape before parsing — what the form state actually holds. */
export type LeadFormValues = {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  website: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  company: string;
};

export const emptyLeadForm: LeadFormValues = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  businessType: "",
  website: "",
  service: "",
  budget: "",
  timeline: "",
  message: "",
  company: "",
};

/**
 * Minimum time a genuine submission takes to fill in. Anything faster is
 * almost certainly scripted. Deliberately low so a fast typist using autofill
 * is never blocked.
 */
export const MIN_FILL_MS = 2500;
