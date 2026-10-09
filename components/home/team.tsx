import type { JSX } from "react";
import { TeamIcon } from "@/components/home/icons";
import { WORK_PLAN_STEPS } from "@/components/home/work-plan";

export default function Team(): JSX.Element {
  return (
    <section className="section team" data-astro-cid-lcdefpme>
      <div
        className="container mx-auto w-full max-w-[var(--max-w)] px-[var(--pad-x)] team__inner"
        data-astro-cid-lcdefpme
      >
        <span className="label" data-astro-cid-lcdefpme>
          How we work
        </span>
        <h2 className="team__title" data-astro-cid-lcdefpme>
          A clear plan for
          <br data-astro-cid-lcdefpme />
          the work ahead
        </h2>
        {/* Tiles are benefit-first: the heading is what the marketing lead
           gets, the body carries the mechanism behind it. Icon chips reuse
           the blue rounded square from the tier chips and the numbered pills
           in "What Separates Us" (Icon.astro). */}
        <div className="team__grid" data-astro-cid-lcdefpme>
          {WORK_PLAN_STEPS.map((step) => (
            <article key={step.title} className="sys-card" data-astro-cid-lcdefpme>
              <TeamIcon name={step.icon} />
              <h3 data-astro-cid-lcdefpme>{step.title}</h3>
              <p data-astro-cid-lcdefpme>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
