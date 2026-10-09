import type { JSX } from "react";
import { TeamIcon } from "@/components/home/icons";

export default function WorkPlan(): JSX.Element {
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
          <article className="sys-card" data-astro-cid-lcdefpme>
            <TeamIcon name="plan" />
            <h3 data-astro-cid-lcdefpme>
              Agreed priorities and delivery dates
            </h3>
            <p data-astro-cid-lcdefpme>
              We agree the priorities with your team and schedule work around
              your plans. Requests stay in a shared channel, with larger changes
              scoped before work starts.
            </p>
          </article>
          <article className="sys-card" data-astro-cid-lcdefpme>
            <TeamIcon name="supplier" />
            <h3 data-astro-cid-lcdefpme>
              Support for your supplier approval process
            </h3>
            <p data-astro-cid-lcdefpme>
              We work with your legal and finance teams on contracts, security
              questions and purchase-order billing. Our experience includes
              enterprise security reviews and corporate accounts payable.
            </p>
          </article>
          <article className="sys-card" data-astro-cid-lcdefpme>
            <TeamIcon name="reporting" />
            <h3 data-astro-cid-lcdefpme>Monthly reporting on results</h3>
            <p data-astro-cid-lcdefpme>
              Your report shows completed work, the results we can measure and
              the priorities we recommend next. Depending on the agreed scope,
              it covers search visibility, AI citations and conversions.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
