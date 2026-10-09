/* eslint-disable @next/next/no-img-element */
import type { JSX } from "react";
import { BubbleArrowLink } from "@/components/ui/bubble-arrow-link";

export default function CaseStudies(): JSX.Element {
  return (
    <section className="section cases" data-astro-cid-lcdefpme>
      <div className="container mx-auto w-full max-w-[var(--max-w)] px-[var(--pad-x)]" data-astro-cid-lcdefpme>
        <div className="cases__head" data-astro-cid-lcdefpme>
          <h2 className="cases__title" data-astro-cid-lcdefpme>
            Selected client work
          </h2>
          <a
            className="cases__more"
            href="/case-studies/"
            data-astro-cid-lcdefpme
          >
            View all case studies &rarr;
          </a>
        </div>
        <div className="cases__grid" data-astro-cid-lcdefpme>
          <article className="case-card" data-astro-cid-lcdefpme>
            <img
              className="case-card__img"
              src="/img/covers/case-blueflame-ai.jpg"
              srcSet="/img/covers/case-blueflame-ai.jpg 1600w, /img/covers/case-blueflame-ai-2x.jpg 3200w"
              sizes="(max-width: 900px) 94vw, 47vw"
              alt="A soft field of blue light rendered as a pixel dither, captioned Organic ahead of paid"
              width="1600"
              height="1067"
              loading="lazy"
              decoding="async"
              data-astro-cid-lcdefpme
            />
            <div className="case-card__chips" data-astro-cid-lcdefpme>
              <span data-astro-cid-lcdefpme>
                <strong data-astro-cid-lcdefpme>18+</strong> months of ongoing
                support
              </span>
              <span data-astro-cid-lcdefpme>
                <strong data-astro-cid-lcdefpme>36 to 72</strong> mobile
                performance score
              </span>
            </div>
            <p className="case-card__context" data-astro-cid-lcdefpme>
              Lighthouse mobile Performance, 13 February 2026.
            </p>
            <div className="case-card__bar" data-astro-cid-lcdefpme>
              <span className="case-card__client" data-astro-cid-lcdefpme>
                Blueflame AI
              </span>
              <BubbleArrowLink variant="white" href="/case-studies/blueflame-ai/">Read the case study</BubbleArrowLink>
            </div>
          </article>
          <article className="case-card" data-astro-cid-lcdefpme>
            <img
              className="case-card__img"
              src="/img/covers/case-channelsight.jpg"
              srcSet="/img/covers/case-channelsight.jpg 1600w, /img/covers/case-channelsight-2x.jpg 3200w"
              sizes="(max-width: 900px) 94vw, 47vw"
              alt="A lit building facade in a regular grid, rendered as a blue pixel dither, captioned Readable to AI engines"
              width="1600"
              height="1067"
              loading="lazy"
              decoding="async"
              data-astro-cid-lcdefpme
            />
            <div className="case-card__chips" data-astro-cid-lcdefpme>
              <span data-astro-cid-lcdefpme>
                <strong data-astro-cid-lcdefpme>475</strong> pages with
                structured data
              </span>
              <span data-astro-cid-lcdefpme>
                <strong data-astro-cid-lcdefpme>83%</strong> fewer low-value
                URLs in the audit
              </span>
            </div>
            <p className="case-card__context" data-astro-cid-lcdefpme>
              Structured data helps describe page content to search and AI
              tools. Verified on 475 of 586 pages in the 15 July 2026 crawl.
              Low-value URLs fell from 2,349 to 410 between the June baseline
              and the audit after the first round of work.
            </p>
            <div className="case-card__bar" data-astro-cid-lcdefpme>
              <span className="case-card__client" data-astro-cid-lcdefpme>
                ChannelSight
              </span>
              <BubbleArrowLink variant="white" href="/case-studies/channelsight/">Read the case study</BubbleArrowLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
