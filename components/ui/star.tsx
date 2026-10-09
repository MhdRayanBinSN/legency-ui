import type { JSX } from "react";

/**
 * A row of five filled stars, used by the Google reviews summary and each
 * review row.
 *
 * The rendered markup is identical to the inline SVG this replaced, including
 * the `data-astro-cid-yrxfijmp` attributes the captured CSS scopes against.
 */
export function Stars(): JSX.Element {
  return (
    <>
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
    </>
  );
}

function Star(): JSX.Element {
  return (
    <svg className="is-filled" viewBox="0 0 24 24" data-astro-cid-yrxfijmp>
      <path
        d="M12 2.6l2.93 5.94 6.56.95-4.75 4.63 1.12 6.53L12 17.57l-5.86 3.08 1.12-6.53L2.51 9.49l6.56-.95z"
        data-astro-cid-yrxfijmp
      ></path>
    </svg>
  );
}