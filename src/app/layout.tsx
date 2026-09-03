import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { brand } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-space",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s — ${brand.name}`,
  },
  description: brand.description,
  keywords: [
    "web development",
    "business website",
    "business automation",
    "n8n automation",
    "restaurant website",
    "booking automation",
    "digital solutions for small businesses",
    "CRM system",
    "custom dashboard",
    "website maintenance",
  ],
  authors: [{ name: brand.name }],
  creator: brand.name,
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a141c",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${mono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
