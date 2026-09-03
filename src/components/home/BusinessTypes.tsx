import { Building2, Home, UtensilsCrossed, Sparkles, TrendingUp } from "lucide-react";
import { businessTypes } from "@/lib/content";
import { SectionHead } from "@/components/site/SectionHead";
import { TiltCard, TiltLayer } from "@/components/motion/Depth3D";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const icons = [
  <UtensilsCrossed key="0" size={19} strokeWidth={1.6} />,
  <Building2 key="1" size={19} strokeWidth={1.6} />,
  <Sparkles key="2" size={19} strokeWidth={1.6} />,
  <Home key="3" size={19} strokeWidth={1.6} />,
  <TrendingUp key="4" size={19} strokeWidth={1.6} />,
];

export function BusinessTypes() {
  return (
    <section className="section relative bg-sand/45">
      <div className="shell">
        <SectionHead
          eyebrow="By business type"
          title="Digital solutions built around your business."
          description="The same building blocks, arranged differently depending on how you actually work."
          align="center"
        />

        <RevealGroup
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
          stagger={0.075}
        >
          {businessTypes.map((type, index) => (
            <RevealItem
              key={type.title}
              className={index === 0 ? "sm:col-span-2 lg:col-span-1" : undefined}
            >
              <TiltCard max={5} className="group h-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-shadow duration-500 hover:shadow-[0_26px_55px_-30px_rgba(10,20,28,0.28)]">
                  <TiltLayer depth={26} className="flex h-full flex-col">
                    <span className="grid size-10 place-items-center rounded-xl border border-line bg-paper text-accent">
                      {icons[index]}
                    </span>

                    <h3 className="type-h3 mt-6">{type.title}</h3>
                    <p className="mt-2.5 flex-1 text-[0.9rem] leading-relaxed text-slate">
                      {type.detail}
                    </p>

                    <p className="type-mono mt-6 border-t border-line pt-4 text-[0.58rem] leading-relaxed text-muted">
                      {type.stack}
                    </p>
                  </TiltLayer>
                </div>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
