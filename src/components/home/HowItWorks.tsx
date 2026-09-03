import { SectionHead } from "@/components/site/SectionHead";
import { ArrowLink } from "@/components/site/ui";
import { Reveal } from "@/components/motion/Reveal";
import { WorkflowDiagram } from "@/components/motion/WorkflowDiagram";

const facts = [
  { value: "24/7", label: "Runs without anyone watching an inbox" },
  { value: "< 1 min", label: "From enquiry to confirmation email" },
  { value: "1 record", label: "Every channel writes to the same place" },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="tech-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute right-[8%] top-[12%] size-[34rem] rounded-full opacity-[0.13] blur-[130px]"
        style={{ background: "radial-gradient(circle, #19b3a6, transparent 68%)" }}
      />

      <div className="shell section relative">
        <SectionHead
          eyebrow="How automation works"
          title="One form. Everything else happens on its own."
          description="This is a real workflow, not an illustration of one — it is how an enquiry moves through a system we build."
          tone="light"
          aside={<ArrowLink href="/services#business-automation" tone="light">Automation services</ArrowLink>}
        />

        <Reveal className="mt-16 lg:mt-20" amount={0.1}>
          <WorkflowDiagram />
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line-dark bg-line-dark sm:grid-cols-3">
          {facts.map((fact, index) => (
            <Reveal key={fact.value} delay={index * 0.08}>
              <div className="h-full bg-ink p-7">
                <p className="font-display text-[1.9rem] leading-none tracking-tight text-accent-bright">
                  {fact.value}
                </p>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-paper/55">{fact.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
