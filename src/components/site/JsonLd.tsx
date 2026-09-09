import { jsonLdHtml } from "@/lib/utils";

/**
 * Renders a structured-data block.
 *
 * Escaping goes through `jsonLdHtml` rather than `JSON.stringify` because some
 * of this data comes from database-backed copy — see that function for why a
 * bare stringify is unsafe inside a script element.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdHtml(data) }}
    />
  );
}
