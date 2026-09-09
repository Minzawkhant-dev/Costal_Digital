import { ImageResponse } from "next/og";
import { brand } from "@/lib/content";

/**
 * The social card, generated rather than designed.
 *
 * Every page inherits this one unless it exports its own, so a shared link on
 * LINE, Facebook or WhatsApp shows the brand instead of a blank rectangle.
 * Generating it from `content.ts` and the palette in `globals.css` means it
 * cannot drift out of date the way a checked-in PNG does.
 *
 * ImageResponse renders through Satori: flexbox only, no grid, and a subset of
 * CSS. It also deliberately uses no custom font — pulling Inter over the network
 * would make every build depend on Google Fonts being reachable.
 */
export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a141c",
          padding: "72px 80px",
        }}
      >
        {/* Accent rule, echoing the teal in the site palette. */}
        <div style={{ display: "flex", width: 96, height: 6, backgroundColor: "#19b3a6" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 700,
              color: "#f7f6f2",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {brand.tagline}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 32,
              color: "#9fb0bc",
              lineHeight: 1.35,
              maxWidth: 900,
            }}
          >
            Websites, business automation and digital solutions for small and growing businesses.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#f7f6f2" }}>
            {brand.name}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#19b3a6" }}>
            {brand.email.split("@")[1]}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
