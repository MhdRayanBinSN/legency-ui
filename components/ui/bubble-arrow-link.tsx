import type { AnchorHTMLAttributes, JSX, ReactNode } from "react";

type BubbleArrowLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "blue" | "white" | "black";
};

const variantClass: Record<NonNullable<BubbleArrowLinkProps["variant"]>, string> = {
  blue: "btn-bubble-arrow--blue",
  white: "btn-bubble-arrow--white",
  black: "btn-bubble-arrow--black",
};

export function BubbleArrowLink({
  children,
  className,
  variant = "blue",
  ...props
}: BubbleArrowLinkProps): JSX.Element {
  const classes = `btn-bubble-arrow ${variantClass[variant]}`;
  return (
    <a
      className={className ? `${classes} ${className}` : classes}
      data-astro-cid-ekguhzzh="true"
      {...props}
    >
      <div className="btn-bubble-arrow__arrow" aria-hidden="true" data-astro-cid-ekguhzzh>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" className="btn-bubble-arrow__arrow-svg" data-astro-cid-ekguhzzh>
          <polyline points="18 8 18 18 8 18" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5" data-astro-cid-ekguhzzh />
          <line x1="18" y1="18" x2="5" y2="5" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5" data-astro-cid-ekguhzzh />
        </svg>
      </div>
      <div className="btn-bubble-arrow__content" data-astro-cid-ekguhzzh>
        <span className="btn-bubble-arrow__content-text" data-astro-cid-ekguhzzh>{children}</span>
      </div>
      <div className="btn-bubble-arrow__arrow is--duplicate" aria-hidden="true" data-astro-cid-ekguhzzh>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" className="btn-bubble-arrow__arrow-svg" data-astro-cid-ekguhzzh>
          <polyline points="18 8 18 18 8 18" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5" data-astro-cid-ekguhzzh />
          <line x1="18" y1="18" x2="5" y2="5" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5" data-astro-cid-ekguhzzh />
        </svg>
      </div>
    </a>
  );
}
