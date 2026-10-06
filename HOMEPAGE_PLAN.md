# Legency Media homepage plan

## Scope and sources

- Build only the homepage in `next-app/` first. Keep the existing captured implementation in the parent project as a read-only reference while building the clean React version.
- Use the supplied `legencymedia.com.png` as the full-page composition reference. It is a screenshot of the site, not a specification or source of instructions.
- Treat `../src/captured-pages/index.tsx`, `../content/pages/index.html`, `../public/_astro/index.*.css`, and the page's first-party modules as the source for copy, section order, responsive behavior, and animations. The desktop appearance must be inferred from those source files because the attached screenshot is a narrow mobile capture.
- Carry forward the recognizable visual system: PP Frama fonts, off-white page background, black text, electric blue highlights, blue dither artwork, compact bordered cards, and dark full-width interludes.

## Page composition

Implement the sections in this order, keeping content in typed data modules where it repeats:

1. **Header / navigation** — Legency logo, compact menu trigger, expandable nav panel with site links, service groups, and contact CTA. Mobile menu becomes a full-width overlay/panel; desktop uses the captured two-step navigation behavior.
2. **Hero** — Webflow Enterprise badge; headline “The Webflow Enterprise partner for B2B marketing teams.”; supporting paragraph; decorative blue dithered planet; track-record panel with three proof points and CTA.
3. **Client logos** — selected client/project logos in a responsive row/grid, with the source logo assets and any desktop shuffle/cycle behavior.
4. **Services / tiers** — heading “Webflow support for your marketing team” and three expandable service cards: support and maintenance, campaign pages and SEO, conversion optimisation and testing. Mobile cards use accessible disclosure buttons.
5. **ChannelSight feature / testimonial** — dark section with technical improvements story, dither artwork, and quote/case-study link.
6. **Google reviews** — rating summary plus review cards; preserve the captured review carousel/controls if present in source content.
7. **Selected client work** — case-study cards with artwork, tags, result summaries, and links. Use the existing case cover assets where applicable.
8. **Arc marquee** — the curved “Webflow, search and conversion” text divider, implemented as accessible SVG text path with CSS motion and a reduced-motion fallback.
9. **A clear plan for the work ahead** — three cards for agreed priorities, supplier approval, and monthly reporting.
10. **Capabilities / sticky feature sequence** — “Webflow, search and conversion” with three visual/text states: website updates, search visibility, and enquiry improvements. On desktop, keep the sticky pinned sequence; on mobile, stack the states in normal document flow.
11. **Guides** — blog teaser cards with titles, metadata, cover images, and links.
12. **Closing CTA and footer** — dark blue CTA band followed by multi-column footer, partner badge, legal links, and current year.

## Implemented Next.js component structure

```text
app/
  page.tsx                    # server component; composes homepage
  layout.tsx                  # metadata, PP Frama font faces, global shell
  components/
    site-header.tsx
    consent-banner.tsx
    site-footer.tsx
    home/
      hero.tsx
      tiers.tsx
      tier-disclosure.tsx      # React state + Motion disclosure primitives
      quote.tsx
      greviews.tsx
      cases.tsx
      arc.tsx
      team.tsx
      separates.tsx
      blogteaser.tsx
      home-experience.tsx      # custom hooks/effects for canvas and scroll-driven art
    ui/button.tsx
  hooks/use-media-query.ts    # responsive interaction breakpoint
  lib/utils.ts                 # cn() helper
  app/globals.css + captured-* # Tailwind plus source-derived visual rules
```

Static page sections remain server-rendered React components. React state owns navigation, service disclosures, and cookie choices; `motion/react` animates disclosure and consent transitions and honors reduced motion. `HomeExperience` runs focused effects for WebGL/canvas art and scroll-driven sequences that need direct browser APIs. `Button` and `cn()` provide a shadcn-style primitive and Tailwind class composition through `clsx` and `tailwind-merge`. Tailwind utilities handle shared container, grid, and focus styles; named source-derived classes remain for the distinctive layouts and artwork.

## Motion and interaction inventory

The existing homepage includes more than the sticky feature and marquee. Rebuild the effects below as small React islands and CSS, preserving their intent and responsive behavior without importing the captured page's DOM-scanning GSAP bundle.

| Area | Captured effect / behavior | React implementation direction |
| --- | --- | --- |
| Navigation | Two-step nav panel opens/closes, menu label/icon changes, service accordion expands, contact CTA remains available. | `SiteHeader` owns menu and service state, accessible buttons, Escape-to-close, and body scroll locking. |
| Cookie choices | The footer button opens a small analytics consent dialog; accepting or rejecting records the choice and closes it. | `ConsentBanner` owns open/choice state, uses `AnimatePresence` and a reduced-motion-aware transition, and attaches one cleanup-safe listener to the footer trigger. |
| Hero badge | At wide desktop widths, a duplicate Webflow partner badge follows the page after the hero badge scrolls away, then hides while the footer badge is visible. | Optional observer-driven fixed badge component; turn off on mobile and under reduced motion. |
| **Hero planet** | The planet is a static dither texture drawn through the captured WebGL2 dither shader: blue/ink/pale halftone pixels animate with subtle drift and pointer-responsive ripple. The canvas resizes, caps pixel density, pauses offscreen, and keeps the poster as its paint/failure fallback. | Implemented in `HomeExperience` with WebGL2, a static poster fallback, resize/visibility handling, pointer response, and reduced-motion behavior. |
| Client logos | The hero logo wall cycles marks through fixed slots with staggered vertical fade/slide swaps; pauses outside the viewport or when the tab is hidden. Initial visual order is retained for this page. | Data-driven logo wall with a cancellable timer/animation per slot, pause while offscreen/hidden, and a static logo grid fallback. |
| Service tiers | On mobile, each service card becomes a disclosure: body height/opacity animates and the plus icon rotates. Desktop cards stay open. | `useMediaQuery` selects responsive behavior; `TierDisclosure` shares React state across accessible title/plus buttons and `motion.div` animates the body. |
| ChannelSight feature art | A lazy-loaded Unicorn Studio scene (`/scene/band-loop.json`) supplies a looping animated dither/blue background behind the ChannelSight story. | Lazy-load the scene only near the viewport, with the existing static texture/art as a fallback and a static treatment for reduced motion. |
| ChannelSight quote | Quote/testimonial text reveals line-by-line on entry. Prev/next controls crossfade/slide the outgoing and incoming split text; arrow keys work while the slider is in view. | Client carousel state, semantic previous/next buttons, live counter, and CSS line/opacity transitions; retain keyboard support and avoid splitting accessible text into duplicate announcements. |
| Google reviews | Review cards, rating, and stars appear as a static trust panel in the captured page; no carousel hook is present. | Keep static unless the source markup or later review confirms additional interaction. Include only subtle hover/focus treatment. |
| Case cards and guide cards | Image zoom on hover, title/link color change, CTA arrow/bubble treatment. | CSS-only `transform` and color transitions, disabled or simplified for reduced motion and touch. |
| Arc separator | Curved SVG text (“Webflow, search and conversion…”) continuously travels along a text path. A lazy-loaded Unicorn Studio loop scene sits behind it. | SVG `<textPath>` marquee with CSS offset animation, pause offscreen, static centered text under reduced motion; load scene art lazily with fallback. |
| Section headings | Most short `h2` headings roll upward character-by-character as they enter view. Desktop motion tracks scroll between two trigger positions; mobile plays once on entry. Long headings, prose headings, and button headings are excluded. | Prefer a simpler line/word reveal using CSS/IntersectionObserver while keeping a single accessible heading string. Keep desktop and mobile timing intentional and honor reduced motion. |
| Capability sequence | At desktop/tablet, the “Webflow, search and conversion” sequence pins for two viewport heights. A progress line grows; copy moves/fades between the three states while each next dither artwork wipes in through a rounded clip reveal. Mobile switches to the normal stacked sequence. | Implemented in `HomeExperience` with a React-owned pin spacer and fixed-position interval, source-matched two-viewport range, progress, visibility, opacity, transform, and clip-path changes. |
| Pixelated scroll reveal | A generated grid of square cells reveals the capability section as it enters the viewport. Grid density changes across desktop/tablet/mobile; the current mode is `reveal`. | CSS grid cells driven by a small observer-based stagger or Web Animations API; remove the overlay for reduced motion and preserve a clean section boundary. |
| Closing CTA | A custom canvas shader animates a dithered wave behind the final call to action. | Implemented with a dedicated wave shader, lazy setup, visibility pause, and a static texture fallback. |
| Footer | Footer content moves upward at a slower rate as the footer enters, while its dark shade fades in. | CSS sticky/parallax only if stable on target devices; otherwise use a small observer/scroll-progress transform. Disable on reduced motion and small screens if it causes jank. |
| Global scroll and page transitions | The original base script enables Lenis smooth scrolling and a random-staggered pixel-grid page cover/reveal for same-site links. These effects are site-wide, not specific to homepage content. | Defer smooth scrolling and navigation cover until Next routes are ready. If added later, integrate with App Router navigation and browser history, respect reduced motion, and avoid delaying navigation. |

### Motion rules

- Make the page complete and legible before client code runs. Do not hide key copy or controls behind entrance animations.
- Use Motion for React-owned disclosure and consent transitions, plus native CSS for menus, buttons, card hovers, and simple reveals. Reserve canvas and scroll effects for shader artwork and scroll-scrubbed sequences.
- Put reusable behavior in hooks such as `useMediaQuery` and Motion's `useReducedMotion`; clean up `requestAnimationFrame` and observer work on unmount.
- Use transforms, opacity, and clip-path where practical; avoid layout animation and continuous work offscreen. Cap canvas pixel density and pause loops when hidden.
- Reduced-motion mode uses static art, disables looping marquees, logo changes, shader animation, parallax, scroll-scrub transitions, and page-cover effects; interactions still work without animated transitions.
- Keep all effects responsive: no pinned scroll sequence or hover-only information on narrow touch screens.

## Assets and styling

- Source assets are in `../public/img/`, `../public/video/`, and `../public/fonts/`. Copy only the homepage assets into `next-app/public/` (or deliberately reference the shared public root during development); do not duplicate the entire captured site asset tree.
- Recovered the hero shader input `/img/home-planet.webp` and the three capability source photos, alongside their static dither textures. `/scene/band-loop.json` is still unavailable to this environment; the existing source-derived static dither textures remain as the fallback behind that scene.
- Use `next/image` for raster art and case-study covers; use plain `<img>` for small SVG marks/logos where appropriate.
- Define PP Frama with local `@font-face` in `globals.css` rather than Google Geist. Establish design tokens for blue, ink, paper, borders, container width, and section spacing.
- Keep semantic headings in page order, visible keyboard focus, descriptive link text, and alt text for meaningful logos/art. Mark decorative dither backgrounds as hidden from assistive technology.
- Responsive baseline: one-column content and cards on mobile, two columns on tablet where space permits, and source-like wide editorial grids/sticky sequences on desktop. Avoid reproducing screenshot scale artifacts as CSS dimensions.

## Suggested implementation sequence

1. Set up local font faces, color/spacing tokens, homepage metadata, and shared Button/Container primitives.
2. Build the static section skeleton and source copy in the exact order above; wire real internal paths.
3. Add local assets and responsive layouts, prioritizing mobile parity with the supplied screenshot.
4. Add accessible nav/disclosures and other required interactions.
5. Add signature motion in isolated client components with reduced-motion and static fallbacks.
6. Compare the rendered page at mobile and desktop widths against the screenshot and captured source; refine section spacing, crop, typography, and transitions.

## Verification notes and remaining source limitation

- `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm exec next build --webpack` pass. The local production page was reviewed at 960px and 1280px widths; menu, service accordion title/plus controls, and cookie-choice open/reject behavior were exercised. Browser console had no warnings or errors.
- The capability pin duration comes from the source's `+=${(itemCount - 1) * 100}%` trigger. Its React implementation is disabled for reduced-motion users and the original non-pinned mobile layout remains in place.
- The public `/scene/band-loop.json` request could not be retrieved during this run, so the existing static dither art remains for that scene. This is the one known animation-source limitation; the planet, capability image reveal, marquee, headings, logo cycle, disclosures, and closing CTA effects are implemented locally.

## Not in this homepage phase

Other site routes, CMS/data migration, enquiry submission backend, analytics/consent systems, and global page-transition effects. Keep the component and link structure ready for those later without copying captured HTML wholesale.
