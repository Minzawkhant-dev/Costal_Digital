"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Loader2, Mail } from "lucide-react";
import {
  budgetOptions,
  businessTypeOptions,
  serviceOptions,
  timelineOptions,
  brand,
} from "@/lib/content";
import { emptyLeadForm, leadSchema, type LeadFormValues } from "@/lib/validation/lead";
import { Button } from "@/components/site/ui";
import { Honeypot, SelectField, TextAreaField, TextField } from "@/components/forms/Field";

const EASE = [0.16, 1, 0.3, 1] as const;

type FieldErrors = Partial<Record<keyof LeadFormValues, string>>;

/**
 * Everything optional that is not a way to reach the person. Hidden behind
 * "Add more details" so the form a visitor first sees is four fields long —
 * a café owner on a phone gives up on ten.
 */
const DETAIL_FIELDS: (keyof LeadFormValues)[] = [
  "businessName",
  "businessType",
  "website",
  "service",
  "budget",
  "timeline",
];
const DETAILS_ID = "project-form-details";

export function ProjectForm({
  source = "start-a-project",
  detailsOpen = false,
}: {
  source?: string;
  /** Start with the optional details expanded. */
  detailsOpen?: boolean;
}) {
  const [values, setValues] = useState<LeadFormValues>(emptyLeadForm);
  const [showDetails, setShowDetails] = useState(detailsOpen);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(true);

  // Used for the fill-time spam check. Set once, on first render.
  const mountedAt = useRef(Date.now());

  const set = (key: keyof LeadFormValues) => (value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "submitting") return;

    setFormError(null);

    // Validate client-side first for immediate feedback. The server runs the
    // identical schema, so this is convenience, not the actual gate.
    const candidate = {
      ...values,
      source,
      elapsedMs: Date.now() - mountedAt.current,
    };

    const parsed = leadSchema.safeParse(candidate);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof LeadFormValues;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("idle");

      // Move focus to the first problem so keyboard and screen-reader users
      // are not left guessing what changed.
      // A bad website address lives in the collapsed section, so open it
      // first — otherwise the error is on a field nobody can see.
      const firstKey = Object.keys(fieldErrors)[0];
      if (firstKey && DETAIL_FIELDS.includes(firstKey as keyof LeadFormValues)) {
        setShowDetails(true);
      }
      if (firstKey) {
        requestAnimationFrame(() =>
          document
            .querySelector<HTMLElement>(`[name="${firstKey}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" }),
        );
      }
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(candidate),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        if (result?.fieldErrors) {
          const fieldErrors: FieldErrors = {};
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            const list = messages as string[] | undefined;
            if (list?.[0]) fieldErrors[key as keyof LeadFormValues] = list[0];
          }
          setErrors(fieldErrors);
        }
        setFormError(result?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setConfirmationSent(result.confirmationSent !== false);
      setStatus("success");
    } catch {
      setFormError(
        "We couldn't reach the server. Please check your connection, or email us directly.",
      );
      setStatus("error");
    }
  };

  return (
    <div className="relative rounded-3xl border border-line bg-surface p-6 sm:p-9">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex min-h-[26rem] flex-col items-center justify-center text-center"
          >
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
              className="grid size-14 place-items-center rounded-full bg-accent text-white"
            >
              <Check size={26} strokeWidth={2.5} />
            </motion.span>

            <h3 className="type-h3 mt-7 text-[1.5rem]">Request received.</h3>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-slate">
              Thanks for contacting {brand.name}. We&rsquo;ve received your project request and
              will review the details shortly. We&rsquo;ll get back to you as soon as possible.
            </p>

            {!confirmationSent && (
              <p className="mt-5 max-w-md rounded-xl border border-line bg-paper px-4 py-3 text-[0.82rem] text-muted">
                Your request is saved. Our confirmation email didn&rsquo;t send — if you don&rsquo;t
                hear from us, reach us at {brand.email}.
              </p>
            )}

            <div className="mt-8 flex items-center gap-2 text-[0.82rem] text-muted">
              <Mail size={14} />
              <span>A confirmation is on its way to {values.email}</span>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col gap-7"
          >
            <Honeypot value={values.company} onChange={set("company")} />

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Name"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                value={values.name}
                error={errors.name}
                onChange={(event) => set("name")(event.target.value)}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@business.com"
                value={values.email}
                error={errors.email}
                onChange={(event) => set("email")(event.target.value)}
              />
              <TextField
                label="Phone / LINE"
                name="phone"
                hint="optional"
                autoComplete="tel"
                placeholder="However you prefer to be reached"
                value={values.phone}
                error={errors.phone}
                onChange={(event) => set("phone")(event.target.value)}
              />
            </div>

            <TextAreaField
              label="What do you need?"
              name="message"
              required
              placeholder="A sentence or two is plenty — e.g. a website for our café with online table booking."
              value={values.message}
              error={errors.message}
              onChange={(event) => set("message")(event.target.value)}
            />

            <div className="flex flex-col gap-5">
              <button
                type="button"
                onClick={() => setShowDetails((open) => !open)}
                aria-expanded={showDetails}
                aria-controls={showDetails ? DETAILS_ID : undefined}
                className="flex w-fit items-center gap-1.5 text-[0.85rem] text-accent transition-colors hover:text-ink"
              >
                {showDetails ? "Hide extra details" : "+ Add more details"}
                <span className="text-muted">(optional)</span>
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-300 ${showDetails ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {showDetails && (
                  <motion.div
                    id={DETAILS_ID}
                    key="details"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="grid gap-5 rounded-2xl border border-line bg-paper p-5 sm:grid-cols-2"
                  >
                    <TextField
                      label="Business name"
                      name="businessName"
                      autoComplete="organization"
                      placeholder="Your business"
                      value={values.businessName}
                      error={errors.businessName}
                      onChange={(event) => set("businessName")(event.target.value)}
                    />
                    <SelectField
                      label="Business type"
                      name="businessType"
                      options={businessTypeOptions}
                      placeholder="Select business type"
                      value={values.businessType}
                      error={errors.businessType}
                      onChange={(event) => set("businessType")(event.target.value)}
                    />
                    <TextField
                      label="Current website"
                      name="website"
                      hint="if you have one"
                      placeholder="yourbusiness.com"
                      value={values.website}
                      error={errors.website}
                      onChange={(event) => set("website")(event.target.value)}
                    />
                    <SelectField
                      label="Service needed"
                      name="service"
                      options={serviceOptions}
                      placeholder="Select a service"
                      value={values.service}
                      error={errors.service}
                      onChange={(event) => set("service")(event.target.value)}
                    />
                    <SelectField
                      label="Budget"
                      name="budget"
                      options={budgetOptions}
                      placeholder="Select a range"
                      value={values.budget}
                      error={errors.budget}
                      onChange={(event) => set("budget")(event.target.value)}
                    />
                    <SelectField
                      label="Timeline"
                      name="timeline"
                      options={timelineOptions}
                      placeholder="Select a timeline"
                      value={values.timeline}
                      error={errors.timeline}
                      onChange={(event) => set("timeline")(event.target.value)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {formError && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  className="rounded-xl border border-signal/30 bg-signal-soft px-4 py-3 text-[0.86rem] text-signal"
                >
                  {formError}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-[0.78rem] leading-relaxed text-muted">
                We reply to every request. Nothing is charged and nothing is committed until you
                approve a written proposal.
              </p>

              <Button
                type="submit"
                size="lg"
                disabled={status === "submitting"}
                icon={status === "submitting" ? "none" : "arrow-up-right"}
                className="w-full sm:w-auto"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending
                  </>
                ) : (
                  "Send Project Request"
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
