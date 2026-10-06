import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "",
  outline: "border border-current bg-transparent",
  ghost: "bg-transparent hover:bg-black/5",
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--blue)] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
