import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | Date, locale = "en-GB") {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: string | Date, locale = "en-GB") {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * U+2028 (line separator) and U+2029 (paragraph separator).
 *
 * Built with `new RegExp` from an escaped string rather than written as a regex
 * literal on purpose: both characters are LineTerminators in ECMAScript source,
 * so a regex literal containing one is a syntax error — and being invisible in
 * an editor, it is a syntax error nobody can see.
 */
const LINE_SEPARATORS = new RegExp("[\\u2028\\u2029]", "g");

/**
 * Serialises structured data for a `<script type="application/ld+json">` tag.
 *
 * `JSON.stringify` escapes quotes but leaves `<` alone, so an answer containing
 * `</script>` would close the tag early and turn the rest of the string into
 * live markup. `services` and `faq` are database-backed and edited from the
 * dashboard, so this content is escaped rather than trusted.
 *
 * The separators get the same treatment: legal inside a JSON string, but line
 * terminators inside a script element.
 *
 * Every replacement is still valid JSON — a parser reads `<` back as `<` —
 * so the structured data search engines see is unchanged.
 */
export function jsonLdHtml(data: unknown) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(LINE_SEPARATORS, (char) =>
      char.charCodeAt(0) === 0x2028 ? "\\u2028" : "\\u2029",
    );
}
