import { Check } from "lucide-react";
import { pricingTiers } from "@/lib/content";
import { ButtonLink } from "@/components/site/ui";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function PricingTiers() {
  return (
    <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
      {pricingTiers.map((tier, index) => (
        <RevealItem key={tier.title}>
          <div className="group/tier flex h-full flex-col rounded-2xl border border-line bg-surface p-7 transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_26px_55px_-30px_rgba(10,20,28,0.26)]">
            <div className="flex items-center justify-between">
              <h3 className="type-h3 text-[1.15rem]">{tier.title}</h3>
              <span className="type-mono text-[0.6rem] text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-5 border-y border-line py-5">
              {tier.startingFrom ? (
                <>
                  <p className="type-mono text-[0.55rem] text-muted">Starting from</p>
                  <p className="mt-1.5 font-display text-[1.9rem] leading-none tracking-tight text-ink">
                    {tier.startingFrom}
                  </p>
                </>
              ) : (
                <>
                  <p className="type-mono text-[0.55rem] text-muted">Pricing</p>
                  <p className="mt-1.5 font-display text-[1.5rem] leading-none tracking-tight text-ink">
                    Custom quote
                  </p>
                </>
              )}
              <p className="type-mono mt-2.5 text-[0.55rem] text-accent">{tier.basis}</p>
            </div>

            <p className="mt-5 text-[0.88rem] leading-relaxed text-slate">{tier.detail}</p>

            <ul className="mt-6 flex flex-1 flex-col gap-2.5">
              {tier.includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[0.85rem] text-slate">
                  <Check size={13} strokeWidth={2.5} className="mt-1 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>

            <ButtonLink
              href="/start-a-project"
              variant="outline"
              size="sm"
              className="mt-7 w-full"
            >
              Get a Quote
            </ButtonLink>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
