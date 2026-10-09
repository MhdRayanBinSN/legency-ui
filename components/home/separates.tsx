import type { JSX } from "react";

export default function Separates(): JSX.Element {
  return (
    <section className="separates" data-astro-cid-lcdefpme>
      <div
        className="pixelated-scroll-transition"
        data-pixelated-scroll-transition
        data-columns="24"
       
       
        data-rows="8"
       
        style={{ color: "var(--bg)" }}
        aria-hidden="true"
      ></div>
      {/* Empty spacer behind the dark band. It has no content; .separates__bg
         reserves the scroll length (height:100vh, position:sticky,
         margin-bottom:-100vh) that the pinned panel animates through.
         Positioning is load-bearing and has bitten four times - read the note
         on .separates__bg in captured-home.css before changing it. */}
      <div
        className="separates__bg"
        aria-hidden="true"
        data-astro-cid-lcdefpme
      ></div>
      <div
        className="container mx-auto w-full max-w-[var(--max-w)] px-[var(--pad-x)]"
        data-astro-cid-lcdefpme
      >
        <h2 className="separates__title" data-astro-cid-lcdefpme>
          Webflow, search
          <br data-astro-cid-lcdefpme />
          and conversion
        </h2>
        <div
          className="separates__panel"
          data-sticky-feature-wrap
          data-live-dither-host
          data-astro-cid-lcdefpme
        >
          <div className="separates__text-col" data-astro-cid-lcdefpme>
            <div className="separates__items" data-astro-cid-lcdefpme>
              <div
                className="separates__item"
                data-sticky-feature-item
                data-astro-cid-lcdefpme
              >
                <span
                  className="separates__num"
                  data-sticky-feature-text
                  data-astro-cid-lcdefpme
                >
                  01
                </span>
                <h3 data-sticky-feature-text data-astro-cid-lcdefpme>
                  A website your team can update
                </h3>
                <p data-sticky-feature-text data-astro-cid-lcdefpme>
                  We build reusable page templates so your marketing team can
                  publish routine pages and content updates consistently. We
                  handle the development work needed for more complex changes.
                </p>
              </div>
              <div
                className="separates__item"
                data-sticky-feature-item
                data-astro-cid-lcdefpme
              >
                <span
                  className="separates__num"
                  data-sticky-feature-text
                  data-astro-cid-lcdefpme
                >
                  02
                </span>
                <h3 data-sticky-feature-text data-astro-cid-lcdefpme>
                  Search visibility where buyers research
                </h3>
                <p data-sticky-feature-text data-astro-cid-lcdefpme>
                  We improve the content and technical foundations that help
                  buyers find your business through Google and AI tools. We
                  track search performance and AI citations to guide the next
                  improvements.
                </p>
              </div>
              <div
                className="separates__item"
                data-sticky-feature-item
                data-astro-cid-lcdefpme
              >
                <span
                  className="separates__num"
                  data-sticky-feature-text
                  data-astro-cid-lcdefpme
                >
                  03
                </span>
                <h3 data-sticky-feature-text data-astro-cid-lcdefpme>
                  Improve the path to an enquiry
                </h3>
                <p data-sticky-feature-text data-astro-cid-lcdefpme>
                  We review the pages and forms buyers use to evaluate your
                  business and get in touch. We check the tracking, make
                  improvements and use A/B tests where traffic supports a
                  reliable result.
                </p>
              </div>
            </div>
            <div
              className="separates__progress"
              aria-hidden="true"
              data-astro-cid-lcdefpme
            >
              <span data-sticky-feature-progress data-astro-cid-lcdefpme></span>
            </div>
          </div>
          {/* UnicornStudio sticky visuals, staging scene order preserved
             (staging had a 4th scene for a 4th item; this build has three
             items, so scene 4 is deliberately unused). The halftone crops
             stay as instant-paint fallbacks under each canvas. */}
          <div
            className="separates__visuals"
            aria-hidden="true"
            data-astro-cid-lcdefpme
          >
            <div
              className="separates__visual separates__visual--1"
              data-sticky-feature-visual-wrap
              data-live-dither="/img/separates-speed-src.jpg"
              data-astro-cid-lcdefpme
            ></div>
            <div
              className="separates__visual separates__visual--2"
              data-sticky-feature-visual-wrap
              data-live-dither="/img/separates-direct-src.jpg"
              data-astro-cid-lcdefpme
            ></div>
            <div
              className="separates__visual separates__visual--3"
              data-sticky-feature-visual-wrap
              data-live-dither="/img/separates-systems-src.jpg"
              data-astro-cid-lcdefpme
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
