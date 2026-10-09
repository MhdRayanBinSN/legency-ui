// Shared inline SVG icons for the home page sections.
//
// 14 distinct icons: 11 in the retainer tier cards (strokeWidth 1.5, bare
// chips at 22px) and 3 in "How we work" (strokeWidth 1.7, 48px chips).
//
// The <path> elements carry no data-astro-cid-ccg5yoga — only the <svg> and
// the wrapper span do, matching the original markup byte for byte.

import type { CSSProperties, JSX } from "react";

/** Builds a 24x24 stroked icon. `weight` is the strokeWidth the source used. */
const icon = (weight: string, children: JSX.Element): JSX.Element => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={weight}
    strokeLinecap="round"
    strokeLinejoin="round"
    data-astro-cid-ccg5yoga
  >
    {children}
  </svg>
);

const thin = (children: JSX.Element): JSX.Element => icon("1.5", children);
const bold = (children: JSX.Element): JSX.Element => icon("1.7", children);

/**
 * The rounded-square wrapper the captured CSS styles.
 *
 * `bare` matches the tier cards' `icon-chip--bare`; the default is the "How we
 * work" `icon-chip`.
 */
export function IconChip({
  size,
  children,
  bare = false,
}: {
  size: string;
  children: JSX.Element;
  bare?: boolean;
}): JSX.Element {
  return (
    <span
      className={bare ? "icon-chip icon-chip--bare" : "icon-chip"}
      style={{ "--icon-chip-size": size } as CSSProperties}
      aria-hidden="true"
      data-astro-cid-ccg5yoga
    >
      {children}
    </span>
  );
}

const TIER_ICONS = {
  code: thin(
    <>
      <path d="M5.21173 15.1113L2.52473 12.4243C2.29041 12.1899 2.29041 11.8101 2.52473 11.5757L5.21173 8.88873C5.44605 8.65442 5.82595 8.65442 6.06026 8.88873L8.74727 11.5757C8.98158 11.8101 8.98158 12.1899 8.74727 12.4243L6.06026 15.1113C5.82595 15.3456 5.44605 15.3456 5.21173 15.1113Z"></path>
      <path d="M11.5757 21.475L8.88874 18.788C8.65443 18.5537 8.65443 18.1738 8.88874 17.9395L11.5757 15.2525C11.8101 15.0182 12.19 15.0182 12.4243 15.2525L15.1113 17.9395C15.3456 18.1738 15.3456 18.5537 15.1113 18.788L12.4243 21.475C12.19 21.7094 11.8101 21.7094 11.5757 21.475Z"></path>
      <path d="M11.5757 8.7475L8.88874 6.06049C8.65443 5.82618 8.65443 5.44628 8.88874 5.21197L11.5757 2.52496C11.8101 2.29065 12.19 2.29065 12.4243 2.52496L15.1113 5.21197C15.3456 5.44628 15.3456 5.82618 15.1113 6.06049L12.4243 8.7475C12.19 8.98181 11.8101 8.98181 11.5757 8.7475Z"></path>
      <path d="M17.9396 15.1113L15.2526 12.4243C15.0183 12.1899 15.0183 11.8101 15.2526 11.5757L17.9396 8.88873C18.174 8.65442 18.5539 8.65442 18.7882 8.88873L21.4752 11.5757C21.7095 11.8101 21.7095 12.1899 21.4752 12.4243L18.7882 15.1113C18.5539 15.3456 18.174 15.3456 17.9396 15.1113Z"></path>
    </>,
  ),
  bug: thin(
    <>
      <path d="M9.00001 21L8.00001 21C6.89544 21 6.00001 20.1057 6.00001 19.0011C6.00001 17.4501 6.00001 15.3443 6 14C6 13 4.5 12 4.5 12C4.5 12 6.00001 11 6.00001 10C6.00001 8.827 6.00001 6.62207 6.00001 4.99914C6.00001 3.89457 6.89544 3 8.00001 3L9.00001 3"></path>
      <path d="M15 21L16 21C17.1046 21 18 20.1057 18 19.0011C18 17.4501 18 15.3443 18 14C18 13 19.5 12 19.5 12C19.5 12 18 11 18 10C18 8.827 18 6.62207 18 4.99914C18 3.89457 17.1046 3 16 3L15 3"></path>
    </>,
  ),
  database: thin(
    <>
      <path d="M5 12V18C5 18 5 21 12 21C19 21 19 18 19 18V12" strokeWidth="1.5"></path>
      <path d="M5 6V12C5 12 5 15 12 15C19 15 19 12 19 12V6" strokeWidth="1.5"></path>
      <path d="M12 3C19 3 19 6 19 6C19 6 19 9 12 9C5 9 5 6 5 6C5 6 5 3 12 3Z" strokeWidth="1.5"></path>
    </>,
  ),
  slack: thin(
    <>
      <path d="M17 12.5C17.2761 12.5 17.5 12.2761 17.5 12C17.5 11.7239 17.2761 11.5 17 11.5C16.7239 11.5 16.5 11.7239 16.5 12C16.5 12.2761 16.7239 12.5 17 12.5Z" fill="currentColor"></path>
      <path d="M12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z" fill="currentColor"></path>
      <path d="M7 12.5C7.27614 12.5 7.5 12.2761 7.5 12C7.5 11.7239 7.27614 11.5 7 11.5C6.72386 11.5 6.5 11.7239 6.5 12C6.5 12.2761 6.72386 12.5 7 12.5Z" fill="currentColor"></path>
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"></path>
    </>,
  ),
  calendar: thin(
    <>
      <path d="M15 4V2M15 4V6M15 4H10.5M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10H3Z"></path>
      <path d="M3 10V6C3 4.89543 3.89543 4 5 4H7"></path>
      <path d="M7 2V6"></path>
      <path d="M21 10V6C21 4.89543 20.1046 4 19 4H18.5"></path>
    </>,
  ),
  document: thin(
    <>
      <path d="M4 21.4V2.6C4 2.26863 4.26863 2 4.6 2H16.2515C16.4106 2 16.5632 2.06321 16.6757 2.17574L19.8243 5.32426C19.9368 5.43679 20 5.5894 20 5.74853V21.4C20 21.7314 19.7314 22 19.4 22H4.6C4.26863 22 4 21.7314 4 21.4Z"></path>
      <path d="M8 10L16 10"></path>
      <path d="M8 18L16 18"></path>
      <path d="M8 14L12 14"></path>
      <path d="M16 2V5.4C16 5.73137 16.2686 6 16.6 6H20"></path>
    </>,
  ),
  "search-ai": thin(
    <>
      <path d="M20 12V5.74853C20 5.5894 19.9368 5.43679 19.8243 5.32426L16.6757 2.17574C16.5632 2.06321 16.4106 2 16.2515 2H4.6C4.26863 2 4 2.26863 4 2.6V21.4C4 21.7314 4.26863 22 4.6 22H11"></path>
      <path d="M8 10H16M8 6H12M8 14H11"></path>
      <path d="M20.5 20.5L22 22"></path>
      <path d="M15 18C15 19.6569 16.3431 21 18 21C18.8299 21 19.581 20.663 20.1241 20.1185C20.6654 19.5758 21 18.827 21 18C21 16.3431 19.6569 15 18 15C16.3431 15 15 16.3431 15 18Z"></path>
      <path d="M16 2V5.4C16 5.73137 16.2686 6 16.6 6H20"></path>
    </>,
  ),
  lightning: thin(<path d="M13 10V3L5 14H11V21L19 10H13Z"></path>),
  flask: thin(
    <>
      <path d="M18.5 15L5.5 15"></path>
      <path d="M16 4L8 4"></path>
      <path d="M9 4.5L9 10.2602C9 10.7376 8.82922 11.1992 8.51851 11.5617L3.48149 17.4383C3.17078 17.8008 3 18.2624 3 18.7398V19C3 20.1046 3.89543 21 5 21L19 21C20.1046 21 21 20.1046 21 19V18.7398C21 18.2624 20.8292 17.8008 20.5185 17.4383L15.4815 11.5617C15.1708 11.1992 15 10.7376 15 10.2602L15 4.5"></path>
      <path d="M12 9.01L12.01 8.99889"></path>
      <path d="M11 2.01L11.01 1.99889"></path>
    </>,
  ),
  chart: thin(
    <>
      <path d="M20 20H4V4"></path>
      <path d="M4 16.5L12 9L15 12L19.5 7.5"></path>
    </>,
  ),
  analytics: thin(
    <path d="M9 21H15M9 21V16M9 21H3.6C3.26863 21 3 20.7314 3 20.4V16.6C3 16.2686 3.26863 16 3.6 16H9M15 21V9M15 21H20.4C20.7314 21 21 20.7314 21 20.4V3.6C21 3.26863 20.7314 3 20.4 3H15.6C15.2686 3 15 3.26863 15 3.6V9M15 9H9.6C9.26863 9 9 9.26863 9 9.6V16" strokeWidth="1.5"></path>,
  ),
} as const;

const TEAM_ICONS = {
  plan: bold(
    <>
      <path d="M20 14.5a2.5 2.5 0 0 1-2.5 2.5H9l-4 3.5V6.5A2.5 2.5 0 0 1 7.5 4h10A2.5 2.5 0 0 1 20 6.5Z" data-astro-cid-ccg5yoga></path>
      <path d="M8.75 9.25h6.5" data-astro-cid-ccg5yoga></path>
      <path d="M8.75 12.25h4" data-astro-cid-ccg5yoga></path>
    </>,
  ),
  supplier: bold(
    <>
      <path d="M12 3.25 4.75 6.1v5.4c0 4.2 2.9 7.6 7.25 9.25 4.35-1.65 7.25-5.05 7.25-9.25V6.1Z" data-astro-cid-ccg5yoga></path>
      <path d="m9 12.1 2.15 2.15L15.3 10.1" data-astro-cid-ccg5yoga></path>
    </>,
  ),
  reporting: bold(
    <>
      <path d="M4.5 4v14.25a1.25 1.25 0 0 0 1.25 1.25H20" data-astro-cid-ccg5yoga></path>
      <path d="m8 15.25 3.5-3.9 2.6 2.3 4.4-5.15" data-astro-cid-ccg5yoga></path>
      <path d="M15.3 8.5h3.2v3.2" data-astro-cid-ccg5yoga></path>
    </>,
  ),
} as const;

/** Tier-card icon inside a 22px bare chip. */
export function TierIcon({ name }: { name: keyof typeof TIER_ICONS }): JSX.Element {
  return <IconChip size="22px" bare>{TIER_ICONS[name]}</IconChip>;
}

/** "How we work" icon inside a 48px chip. */
export function TeamIcon({ name }: { name: keyof typeof TEAM_ICONS }): JSX.Element {
  return <IconChip size="48px">{TEAM_ICONS[name]}</IconChip>;
}