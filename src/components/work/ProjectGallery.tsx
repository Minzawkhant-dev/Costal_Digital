"use client";

import { useState } from "react";
import Image from "next/image";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import type { Project, Shot } from "@/lib/projects";

/**
 * Project screenshots, desktop and mobile.
 *
 * Both sets are real captures of the running site at 1440px and 390px rather
 * than mockups, so the mobile tab is showing the layout a phone actually gets.
 * The toggle only appears when there is something to toggle between.
 */
export function ProjectGallery({
  shots,
  siteLabel,
}: {
  shots: NonNullable<Project["shots"]>;
  /** Domain shown in the fake browser bar, e.g. "myfavoritediner.com". */
  siteLabel?: string;
}) {
  const hasDesktop = shots.desktop.length > 0;
  const hasMobile = shots.mobile.length > 0;
  const [view, setView] = useState<"desktop" | "mobile">(hasDesktop ? "desktop" : "mobile");

  if (!hasDesktop && !hasMobile) return null;

  return (
    <div>
      {hasDesktop && hasMobile && (
        <div
          role="tablist"
          aria-label="Screenshot size"
          className="inline-flex rounded-full border border-line bg-surface p-1"
        >
          <Tab
            active={view === "desktop"}
            onClick={() => setView("desktop")}
            icon={<Monitor size={14} />}
            label="Desktop"
            count={shots.desktop.length}
          />
          <Tab
            active={view === "mobile"}
            onClick={() => setView("mobile")}
            icon={<Smartphone size={14} />}
            label="Mobile"
            count={shots.mobile.length}
          />
        </div>
      )}

      <div className="mt-8">
        {view === "desktop" ? (
          <div className="flex flex-col gap-10 sm:gap-12">
            {shots.desktop.map((shot, index) => (
              <BrowserFrame
                key={shot.src}
                shot={shot}
                siteLabel={siteLabel}
                priority={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:gap-7 md:grid-cols-3 lg:grid-cols-4">
            {shots.mobile.map((shot) => (
              <PhoneFrame key={shot.src} shot={shot} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Tab({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.82rem] font-medium transition-colors duration-300",
        active ? "bg-ink text-paper" : "text-slate hover:text-ink",
      )}
    >
      {icon}
      {label}
      <span className={cn("type-mono text-[0.58rem]", active ? "text-paper/55" : "text-muted")}>
        {count}
      </span>
    </button>
  );
}

/**
 * A desktop capture, sat in a restrained browser chrome.
 *
 * amount={0} on the reveal, because a full-width screenshot can be taller than
 * the viewport — the usual 25% threshold would never be met and the frame would
 * stay invisible.
 */
function BrowserFrame({
  shot,
  siteLabel,
  priority,
}: {
  shot: Shot;
  siteLabel?: string;
  priority?: boolean;
}) {
  return (
    <Reveal amount={0} duration={0.7}>
      <figure>
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-40px_rgba(10,20,28,0.4)]">
          <div className="flex items-center gap-2.5 border-b border-line bg-sand/60 px-4 py-3">
            <span aria-hidden className="flex gap-1.5">
              <span className="size-2 rounded-full bg-line" />
              <span className="size-2 rounded-full bg-line" />
              <span className="size-2 rounded-full bg-line" />
            </span>
            {siteLabel && (
              <span className="type-mono truncate rounded-full bg-surface px-3 py-1 text-[0.55rem] text-muted">
                {siteLabel}
              </span>
            )}
          </div>

          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="h-auto w-full"
            priority={priority}
          />
        </div>

        <figcaption className="mt-3.5 text-[0.85rem] leading-relaxed text-slate">
          {shot.caption}
        </figcaption>
      </figure>
    </Reveal>
  );
}

/** A 390px capture, sat in a phone outline. */
function PhoneFrame({ shot }: { shot: Shot }) {
  return (
    <Reveal amount={0} duration={0.7}>
      <figure>
        <div className="overflow-hidden rounded-[1.6rem] border-[5px] border-ink bg-ink shadow-[0_20px_45px_-30px_rgba(10,20,28,0.55)]">
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            sizes="(max-width: 768px) 45vw, 260px"
            className="h-auto w-full rounded-[1.15rem]"
          />
        </div>

        <figcaption className="mt-3 text-[0.78rem] leading-relaxed text-slate">
          {shot.caption}
        </figcaption>
      </figure>
    </Reveal>
  );
}
