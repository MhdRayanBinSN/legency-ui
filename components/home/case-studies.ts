// Case studies shown on the home page.
//
// Two cards that differed only in this data were copy-pasted; they now map over
// it. The chip label follows the value ("18+ months of ongoing support"), so the
// label lives with the number rather than being derived from it.
export type CaseStudy = {
  client: string;
  href: string;
  /** Covers at 1x and 2x. */
  image: string;
  alt: string;
  /** Two proof points, value then its label. */
  chips: [string, string][];
  /** Provenance note under the chips. */
  context: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    client: "Blueflame AI",
    href: "/case-studies/blueflame-ai/",
    image: "case-blueflame-ai",
    alt: "A soft field of blue light rendered as a pixel dither, captioned Organic ahead of paid",
    chips: [
      ["18+", "months of ongoing support"],
      ["36 to 72", "mobile performance score"],
    ],
    context: "Lighthouse mobile Performance, 13 February 2026.",
  },
  {
    client: "ChannelSight",
    href: "/case-studies/channelsight/",
    image: "case-channelsight",
    alt: "A lit building facade in a regular grid, rendered as a blue pixel dither, captioned Readable to AI engines",
    chips: [
      ["475", "pages with structured data"],
      ["83%", "fewer low-value URLs in the audit"],
    ],
    context:
      "Structured data helps describe page content to search and AI tools. Verified on 475 of 586 pages in the 15 July 2026 crawl. Low-value URLs fell from 2,349 to 410 between the June baseline and the audit after the first round of work.",
  },
];