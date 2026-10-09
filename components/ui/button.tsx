import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

// One implementation, no variant map: `outline` and `ghost` were defined here
// but no call site ever passed either.
const base =
  "inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--blue)] disabled:pointer-events-none disabled:opacity-50";

export function Button({ className, ...props }: ButtonProps) {
  return <button className={className ? `${base} ${className}` : base} {...props} />;
}