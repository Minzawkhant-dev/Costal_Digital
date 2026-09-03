"use client";

import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-xl border bg-surface px-4 py-3 text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted/70 focus:border-accent focus:shadow-[0_0_0_3px_rgba(14,124,134,0.12)]";

function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="flex items-baseline gap-1.5 text-[0.82rem] text-slate">
        {label}
        {required && (
          <span className="text-accent" aria-hidden>
            *
          </span>
        )}
        {hint && <span className="text-[0.72rem] text-muted">{hint}</span>}
      </label>

      {children}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="text-[0.78rem] text-signal"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TextField({
  label,
  error,
  hint,
  required,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(inputBase, error ? "border-signal" : "border-line")}
        {...props}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  required,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <textarea
        id={id}
        rows={6}
        aria-invalid={Boolean(error)}
        className={cn(inputBase, "resize-y", error ? "border-signal" : "border-line")}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  error,
  hint,
  required,
  options,
  placeholder = "Select an option",
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  hint?: string;
  options: readonly string[];
  placeholder?: string;
}) {
  const id = useId();
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <div className="relative">
        <select
          id={id}
          aria-invalid={Boolean(error)}
          className={cn(
            inputBase,
            "appearance-none pr-11",
            error ? "border-signal" : "border-line",
            !props.value && "text-muted",
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option} className="text-ink">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
    </FieldShell>
  );
}

/**
 * Honeypot. Hidden from sight and from assistive technology, but a form-filling
 * bot walking the DOM will still find it and fill it in.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute left-[-9999px] opacity-0">
      <label htmlFor="company-website-field">Company (leave blank)</label>
      <input
        id="company-website-field"
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
