/* eslint-disable @next/next/no-img-element */
import type { JSX } from "react";
import { BubbleArrowLink } from "@/components/ui/bubble-arrow-link";
import { CASE_STUDIES } from "@/components/home/case-studies";

export default function Cases(): JSX.Element {
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
          {CASE_STUDIES.map((study) => (
            <article key={study.href} className="case-card" data-astro-cid-lcdefpme>
              <img
                className="case-card__img"
                src={`/img/covers/${study.image}.jpg`}
                srcSet={`/img/covers/${study.image}.jpg 1600w, /img/covers/${study.image}-2x.jpg 3200w`}
                sizes="(max-width: 900px) 94vw, 47vw"
                alt={study.alt}
                width="1600"
                height="1067"
                loading="lazy"
                decoding="async"
                data-astro-cid-lcdefpme
              />
              <div className="case-card__chips" data-astro-cid-lcdefpme>
                {study.chips.map(([value, label]) => (
                  <span key={label} data-astro-cid-lcdefpme>
                    <strong data-astro-cid-lcdefpme>{value}</strong>{" "}{label}
                  </span>
                ))}
              </div>
              <p className="case-card__context" data-astro-cid-lcdefpme>
                {study.context}
              </p>
              <div className="case-card__bar" data-astro-cid-lcdefpme>
                <span className="case-card__client" data-astro-cid-lcdefpme>
                  {study.client}
                </span>
                <BubbleArrowLink variant="white" href={study.href}>
                  Read the case study
                </BubbleArrowLink>
              </div>
            </article>
          ))}

        </div>
      </div>
    </section>
  );
}
