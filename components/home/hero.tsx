/* eslint-disable @next/next/no-img-element */
import type { JSX } from "react";
import { BubbleArrowLink } from "@/components/ui/bubble-arrow-link";
import { PARTNERS } from "@/components/home/partners";

export default function Hero(): JSX.Element {
  return (
    <section className="hero" data-astro-cid-lcdefpme>
      <div
        className="hero__stage"
        data-live-dither-host
        data-astro-cid-lcdefpme
      >
        <div className="hero__art" aria-hidden="true" data-astro-cid-lcdefpme>
          <div
            className="hero__planet"
            data-live-dither="/img/home-planet.webp"
            data-live-dither-theme="light"
            data-astro-cid-lcdefpme
          ></div>
        </div>
        <div className="container mx-auto w-full max-w-[var(--max-w)] px-[var(--pad-x)] hero__inner" data-astro-cid-lcdefpme>
          <div className="hero__badge" data-astro-cid-lcdefpme>
            <a
              className="badge-link"
              href="https://webflow.com/@legencymedia"
              target="_blank"
              rel="noopener"
              aria-label="Legency Media on Webflow - Premium Partner, Enterprise tier"
              data-astro-cid-o3c3tdmk
            >
              <img
                className="badge"
                src="/img/badge-enterprise.svg"
                alt="Webflow Premium Partner - Enterprise"
                width="225"
                height="33"
                data-astro-cid-o3c3tdmk
              />
            </a>
          </div>
          <h1 className="hero__title" data-astro-cid-lcdefpme>
            The Webflow Enterprise partner for{" "}
            <span className="hero__title-accent" data-astro-cid-lcdefpme>
              B2B marketing teams
            </span>
            .
          </h1>
          <p className="hero__sub" data-astro-cid-lcdefpme>
            We{" "}
            <a href="/services/webflow-enterprise/" data-astro-cid-lcdefpme>
              build and manage your website
            </a>{" "}
            alongside SEO, AI visibility and conversion optimisation. Your team
            gets a shared plan and monthly reporting on the results.
          </p>
        </div>
      </div>
      <div className="hero__bottom" data-astro-cid-lcdefpme>
        <div className="container mx-auto w-full max-w-[var(--max-w)] px-[var(--pad-x)] hero__bottom-inner" data-astro-cid-lcdefpme>
          <div className="hero__proof" data-astro-cid-lcdefpme>
            <p className="hero__proof-label" data-astro-cid-lcdefpme>
              Track record
            </p>
            <ul data-astro-cid-lcdefpme>
              <li data-astro-cid-lcdefpme>
                <strong data-astro-cid-lcdefpme>18+ months</strong>
                <span data-astro-cid-lcdefpme>
                  Of ongoing support for an established client.
                </span>
              </li>
              <li data-astro-cid-lcdefpme>
                <strong data-astro-cid-lcdefpme>16 of 56</strong>
                <span data-astro-cid-lcdefpme>
                  AI answers cited a client in our July 2026 research.
                  <small data-astro-cid-lcdefpme>
                    14 questions across 4 AI tools, July 2026.
                  </small>
                </span>
              </li>
              <li data-astro-cid-lcdefpme>
                <strong data-astro-cid-lcdefpme>Enterprise experience</strong>
                <span data-astro-cid-lcdefpme>
                  Client security reviews, contracts and purchase-order billing.
                </span>
              </li>
            </ul>
            <BubbleArrowLink href="/get-in-touch/">Get in touch</BubbleArrowLink>
          </div>
          <div className="hero__partners" data-astro-cid-lcdefpme>
            <span className="hero__partners-label" data-astro-cid-lcdefpme>
              Selected clients and website projects
            </span>
            <div
              data-logo-wall-shuffle="false"
              data-logo-wall-cycle-init=""
              className="logo-wall"
              aria-hidden="true"
              data-astro-cid-rafju4uq
            >
              <div className="logo-wall__collection" data-astro-cid-rafju4uq>
                <div
                  data-logo-wall-list=""
                  className="logo-wall__list"
                  data-astro-cid-rafju4uq
                >
                {PARTNERS.map((partner) => (
                  <div
                    key={partner.file}
                    data-logo-wall-item=""
                    className="logo-wall__item"
                    data-astro-cid-rafju4uq
                  >
                    <div className="logo-wall__logo" data-astro-cid-rafju4uq>
                      <div className="logo-wall__logo-before" data-astro-cid-rafju4uq></div>
                      <div
                        data-logo-wall-target=""
                        className="logo-wall__logo-target"
                        data-astro-cid-rafju4uq
                      >
                        <img
                          src={`/img/partners/${partner.file}`}
                          loading="lazy"
                          width="160"
                          alt={partner.name}
                          className={`logo-wall__logo-img${partner.tonal ? " logo-wall__logo-img--tonal" : ""}`}
                          data-astro-cid-rafju4uq
                        />
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
            <ul
              className="logo-wall__names"
              aria-label="Clients and website projects"
              data-astro-cid-rafju4uq
            >
              {PARTNERS.map((partner) => (
                <li key={partner.file} data-astro-cid-rafju4uq>
                  {partner.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
