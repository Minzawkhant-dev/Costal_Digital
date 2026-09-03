import { whyCoastal } from "@/lib/content";
import { SectionHead } from "@/components/site/SectionHead";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Depth3D";

export function WhyCoastal() {
  return (
    <section className="section relative overflow-hidden">
      {/* Slow-drifting field behind the grid, to give the section its own depth. */}
      <Parallax speed={0.09} className="pointer-events-none absolute inset-x-0 -top-24 h-[130%]">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 size-[46rem] -translate-x-1/2 rounded-full opacity-[0.09] blur-[130px]"
          style={{ background: "radial-gradient(circle, #0e7c86, transparent 70%)" }}
        />
      </Parallax>

      <div className="shell relative">
        <SectionHead
          eyebrow="Why Coastal"
          title="More than a website. A better way to work."
          description="We are a digital partner, not a one-off supplier. The goal is a business that runs more easily after we finish than it did before we started."
          align="center"
        />

        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {whyCoastal.map((item, index) => (
            <RevealItem
              key={item.title}
              className={index === 3 ? "sm:col-span-1 lg:col-span-2" : undefined}
            >
              <div className="group/why relative h-full overflow-hidden bg-paper p-8 transition-colors duration-500 hover:bg-surface sm:p-10">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/why:scale-x-100"
                />

                <span className="type-mono text-[0.62rem] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="type-h3 mt-5">{item.title}</h3>
                <p className="mt-3 max-w-sm text-[0.92rem] leading-relaxed text-slate">
                  {item.detail}
                </p>
              </div>
            </RevealItem>
          ))}

          {/* Filler cell keeps the grid square on 3-up without an empty gap. */}
          <RevealItem className="hidden lg:block">
            <div className="flex h-full flex-col justify-end bg-ink p-8 sm:p-10">
              <p className="font-display text-[1.35rem] leading-tight tracking-tight text-paper">
                Work Smarter.
                <br />
                <span className="text-accent-bright">Serve Better.</span>
              </p>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
