import type { JSX } from "react";

export default function ArcMarquee(): JSX.Element {
  return (
    <section className="arc" aria-hidden="true" data-astro-cid-lcdefpme>
      <svg
        viewBox="0 0 1728 294"
        preserveAspectRatio="xMidYMid slice"
        data-astro-cid-lcdefpme
      >
        <path
          id="arc-path"
          d="M -200,330 Q 864,-30 1928,330"
          fill="none"
          data-astro-cid-lcdefpme
        ></path>
        <text data-astro-cid-lcdefpme>
          <textPath
            href="#arc-path"
            data-arc-marquee
            data-arc-unit="Webflow, search and conversion - "
            data-arc-reps="8"
            data-arc-speed="55"
            data-astro-cid-lcdefpme
          >
            Webflow, search and conversion - Webflow, search and conversion -
          </textPath>
        </text>
      </svg>
    </section>
  );
}
