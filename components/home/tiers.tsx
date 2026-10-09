import type { JSX } from "react";
import {
  TierBody,
  TierDisclosure,
  TierToggle,
} from "@/components/home/tier-disclosure";
import { BubbleArrowLink } from "@/components/ui/bubble-arrow-link";
import { TierIcon } from "@/components/home/icons";

export default function ServiceTiers(): JSX.Element {
  return (
    <section className="section tiers" data-astro-cid-lcdefpme>
      <div
        className="container mx-auto w-full max-w-[var(--max-w)] px-[var(--pad-x)]"
        data-astro-cid-lcdefpme
      >
        <div className="tiers__head" data-astro-cid-lcdefpme>
          <span className="label" data-astro-cid-lcdefpme>
            Retainers
          </span>
          <h2 className="tiers__title" data-astro-cid-lcdefpme>
            Webflow support for
            <br data-astro-cid-lcdefpme />
            your marketing team
          </h2>
          <p className="tiers__intro" data-astro-cid-lcdefpme>
            Choose ongoing support around the work your team needs. We also take
            on individual projects, including Webflow and Astro builds, SEO, AI
            visibility and Google Ads.
          </p>
          <p className="tiers__intro" data-astro-cid-lcdefpme>
            Explore our{" "}
            <a href="/b2b-web-design/" data-astro-cid-lcdefpme>
              B2B web design
            </a>
            ,{" "}
            <a href="/saas-website-design/" data-astro-cid-lcdefpme>
              SaaS website design
            </a>
            ,{" "}
            <a
              href="/services/wordpress-to-webflow-migration/"
              data-astro-cid-lcdefpme
            >
              WordPress to Webflow migrations
            </a>{" "}
            and{" "}
            <a href="/web-design-galway/" data-astro-cid-lcdefpme>
              web design Galway
            </a>
            .
          </p>
        </div>
        <div
          className="tiers__grid grid grid-cols-1 gap-[var(--sp-3)] min-[1001px]:grid-cols-3"
          data-astro-cid-lcdefpme
        >
          <TierDisclosure>
            <div className="tier__head" data-astro-cid-lcdefpme>
              <span className="tier__chip" data-astro-cid-lcdefpme>
                Core
              </span>
              <TierToggle
                id="tier-body-0"
                label="Toggle Webflow support and maintenance"
                className="tier__plus appearance-none bg-transparent p-0"
              />
            </div>
            <h3 className="tier__title" data-astro-cid-lcdefpme>
              <TierToggle id="tier-body-0">
                Webflow support and maintenance
              </TierToggle>
            </h3>
            <TierBody id="tier-body-0">
              <p className="tier__lead" data-astro-cid-lcdefpme>
                What’s included:
              </p>
              <ul className="tier__list" data-astro-cid-lcdefpme>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="code" />
                  Webflow development
                </li>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="bug" />
                  Bug fixes
                </li>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="database" />
                  CMS setup and updates
                </li>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="slack" />
                  Slack support
                </li>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="calendar" />
                  Monthly planning call
                </li>
              </ul>
              <p className="tier__note" data-astro-cid-lcdefpme>
                For marketing teams that need regular site updates and technical
                support.
              </p>
              <div className="tier__cta" data-astro-cid-lcdefpme>
                <BubbleArrowLink variant="black" href="/get-in-touch/">
                  Discuss your requirements
                </BubbleArrowLink>
              </div>
            </TierBody>
          </TierDisclosure>
          <TierDisclosure>
            <div className="tier__head" data-astro-cid-lcdefpme>
              <span className="tier__chip" data-astro-cid-lcdefpme>
                Velocity
              </span>
              <TierToggle
                id="tier-body-1"
                label="Toggle campaign pages and SEO"
                className="tier__plus appearance-none bg-transparent p-0"
              />
            </div>
            <h3 className="tier__title" data-astro-cid-lcdefpme>
              <TierToggle id="tier-body-1">Campaign pages and SEO</TierToggle>
            </h3>
            <TierBody id="tier-body-1">
              <p className="tier__lead" data-astro-cid-lcdefpme>
                Everything in Core, plus:
              </p>
              <ul className="tier__list" data-astro-cid-lcdefpme>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="document" />
                  Campaign landing pages
                </li>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="search-ai" />
                  Search engine optimisation (SEO)
                </li>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="lightning" />
                  Priority handling for urgent requests
                </li>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="calendar" />2 planning calls per month
                </li>
              </ul>
              <p className="tier__note" data-astro-cid-lcdefpme>
                For marketing teams with a regular schedule of campaigns and new
                pages.
              </p>
              <div className="tier__cta" data-astro-cid-lcdefpme>
                <BubbleArrowLink variant="black" href="/get-in-touch/">
                  Discuss your requirements
                </BubbleArrowLink>
              </div>
            </TierBody>
          </TierDisclosure>
          <TierDisclosure className="tier--dark">
            <div
              className="tier__video"
              aria-hidden="true"
              data-astro-cid-lcdefpme
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/video/donut-poster.jpg"
                data-astro-cid-lcdefpme
              >
                <source
                  src="/video/donut.mp4"
                  type="video/mp4"
                  data-astro-cid-lcdefpme
                />
                <source
                  src="/video/donut.webm"
                  type="video/webm"
                  data-astro-cid-lcdefpme
                />
              </video>
              <div className="tier__video-shade" data-astro-cid-lcdefpme></div>
            </div>
            <div className="tier__head" data-astro-cid-lcdefpme>
              <span className="tier__chip" data-astro-cid-lcdefpme>
                Premium
              </span>
              <TierToggle
                id="tier-body-2"
                label="Toggle conversion optimisation and testing"
                className="tier__plus appearance-none bg-transparent p-0"
              />
            </div>
            <h3 className="tier__title" data-astro-cid-lcdefpme>
              <TierToggle id="tier-body-2">
                Conversion optimisation and testing
              </TierToggle>
            </h3>
            <TierBody id="tier-body-2">
              <p className="tier__lead" data-astro-cid-lcdefpme>
                Everything in Velocity, plus:
              </p>
              <ul className="tier__list" data-astro-cid-lcdefpme>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="flask" />
                  A/B testing where traffic supports a reliable result
                </li>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="chart" />
                  Conversion rate optimisation
                </li>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="analytics" />
                  Analytics setup
                </li>
                <li data-astro-cid-lcdefpme>
                  <TierIcon name="calendar" />
                  Weekly planning calls
                </li>
              </ul>
              <p className="tier__note" data-astro-cid-lcdefpme>
                For teams that need to understand why visitors leave and improve
                the path to an enquiry.
              </p>
              <div className="tier__cta" data-astro-cid-lcdefpme>
                <BubbleArrowLink href="/get-in-touch/">
                  Discuss your requirements
                </BubbleArrowLink>
              </div>
            </TierBody>
          </TierDisclosure>
        </div>
      </div>
    </section>
  );
}
