import { Check, Clock, Mail, TrendingUp, UserRound } from "lucide-react";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Generated artwork for each demo project.
 *
 * Drawn rather than photographed, on purpose — the brief rules out stock
 * photography, and an abstract UI reading of the system is more honest about
 * what these builds are than a picture of a café would be.
 */
export function ProjectArtwork({ project }: { project: Project }) {
  const glow: Record<Project["accent"], string> = {
    accent: "rgba(25,179,166,0.35)",
    signal: "rgba(228,99,63,0.30)",
    ink: "rgba(80,120,200,0.28)",
  };

  return (
    <div className="absolute inset-0 bg-ink">
      <div aria-hidden className="tech-grid absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="absolute -right-[10%] -top-[20%] size-[26rem] rounded-full blur-[90px]"
        style={{ background: `radial-gradient(circle, ${glow[project.accent]}, transparent 68%)` }}
      />

      <div className="relative flex h-full items-center justify-center p-7 sm:p-9">
        <div className="w-full max-w-[22rem] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/project:-translate-y-1.5 group-hover/project:scale-[1.02]">
          {project.slug === "restaurant-digital-system" && <RestaurantArt />}
          {project.slug === "salon-booking-system" && <SalonArt />}
          {project.slug === "small-business-automation" && <AutomationArt />}
        </div>
      </div>
    </div>
  );
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <p className="type-mono text-[0.52rem] text-paper/40">{children}</p>;
}

/* ---------- 01 · Restaurant ---------- */

function RestaurantArt() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="flex flex-col gap-3">
      <Panel>
        <div className="flex items-center justify-between">
          <PanelLabel>Reservations</PanelLabel>
          <span className="type-mono text-[0.5rem] text-accent-bright">This week</span>
        </div>

        <div className="mt-3.5 grid grid-cols-7 gap-1.5">
          {days.map((day, index) => (
            <div key={`${day}-${index}`} className="text-center">
              <span className="type-mono block text-[0.45rem] text-paper/30">{day}</span>
              <span
                className={cn(
                  "mt-1 grid h-7 place-items-center rounded-md text-[0.6rem] font-medium",
                  index === 4
                    ? "bg-accent-bright text-ink"
                    : "border border-white/10 bg-white/[0.03] text-paper/60",
                )}
              >
                {12 + index}
              </span>
            </div>
          ))}
        </div>

        {/* Occupancy bars */}
        <div className="mt-3.5 flex items-end gap-1.5 border-t border-white/10 pt-3">
          {[42, 58, 50, 71, 96, 88, 64].map((height, index) => (
            <div key={index} className="flex-1">
              <div
                className={cn("rounded-sm", index === 4 ? "bg-accent-bright" : "bg-paper/20")}
                style={{ height: `${height * 0.28}px` }}
              />
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-white">
          <Check size={14} strokeWidth={3} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.78rem] text-paper">Booking confirmed &middot; 19:30</p>
          <p className="type-mono mt-0.5 text-[0.5rem] text-paper/40">
            Guest emailed &middot; kitchen notified
          </p>
        </div>
      </Panel>
    </div>
  );
}

/* ---------- 02 · Salon ---------- */

function SalonArt() {
  const slots = [
    { time: "10:00", name: "Cut & finish", taken: true },
    { time: "11:30", name: "Colour", taken: true },
    { time: "14:00", name: "Available", taken: false },
    { time: "15:30", name: "Treatment", taken: true },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Panel>
        <div className="flex items-center justify-between">
          <PanelLabel>Today &middot; Stylist A</PanelLabel>
          <span className="type-mono text-[0.5rem] text-accent-bright">4 booked</span>
        </div>

        <div className="mt-3.5 flex flex-col gap-1.5">
          {slots.map((slot) => (
            <div
              key={slot.time}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2",
                slot.taken
                  ? "border border-white/10 bg-white/[0.04]"
                  : "border border-dashed border-accent-bright/40 bg-accent-bright/5",
              )}
            >
              <span className="type-mono w-9 shrink-0 text-[0.52rem] text-paper/45">
                {slot.time}
              </span>
              <span
                className={cn(
                  "flex-1 truncate text-[0.72rem]",
                  slot.taken ? "text-paper/75" : "text-accent-bright",
                )}
              >
                {slot.name}
              </span>
              {slot.taken && (
                <span className="grid size-5 place-items-center rounded-full bg-white/10 text-paper/60">
                  <UserRound size={10} />
                </span>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-signal text-white">
          <Clock size={14} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.78rem] text-paper">Reminder scheduled</p>
          <p className="type-mono mt-0.5 text-[0.5rem] text-paper/40">
            24 hours before appointment
          </p>
        </div>
      </Panel>
    </div>
  );
}

/* ---------- 03 · Automation ---------- */

function AutomationArt() {
  const stages = [
    { label: "New", count: 12 },
    { label: "Contacted", count: 7 },
    { label: "Qualified", count: 4 },
    { label: "Won", count: 2 },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Panel>
        <div className="flex items-center justify-between">
          <PanelLabel>Lead pipeline</PanelLabel>
          <span className="type-mono flex items-center gap-1 text-[0.5rem] text-accent-bright">
            <TrendingUp size={9} />
            Live
          </span>
        </div>

        <div className="mt-3.5 grid grid-cols-4 gap-1.5">
          {stages.map((stage, index) => (
            <div
              key={stage.label}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2.5 text-center"
            >
              <p
                className={cn(
                  "font-display text-[1.05rem] leading-none tracking-tight",
                  index === 0 ? "text-accent-bright" : "text-paper",
                )}
              >
                {stage.count}
              </p>
              <p className="type-mono mt-1.5 text-[0.42rem] text-paper/40">{stage.label}</p>
            </div>
          ))}
        </div>

        {/* Funnel bars */}
        <div className="mt-3.5 flex flex-col gap-1 border-t border-white/10 pt-3">
          {[100, 58, 33, 17].map((width, index) => (
            <div
              key={index}
              className={cn("h-1.5 rounded-full", index === 0 ? "bg-accent-bright" : "bg-paper/20")}
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      </Panel>

      <Panel className="flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-white">
          <Mail size={13} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.78rem] text-paper">Auto-reply sent</p>
          <p className="type-mono mt-0.5 text-[0.5rem] text-paper/40">
            Admin notified &middot; task created
          </p>
        </div>
      </Panel>
    </div>
  );
}
