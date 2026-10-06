"use client";

import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { motion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

type TierDisclosureState = {
  collapsible: boolean;
  open: boolean;
  toggle: () => void;
};

const TierDisclosureContext = createContext<TierDisclosureState | null>(null);

function useTierDisclosure() {
  const state = useContext(TierDisclosureContext);
  if (!state) throw new Error("Tier disclosure parts must be inside TierDisclosure.");
  return state;
}

export function TierDisclosure({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const collapsible = useMediaQuery("(max-width: 991px)");
  const [open, setOpen] = useState(false);
  const state = {
    collapsible,
    open: collapsible ? open : true,
    toggle: () => setOpen((current) => !current),
  };

  return (
    <TierDisclosureContext.Provider value={state}>
      <article
        data-astro-cid-lcdefpme
        className={cn("tier", collapsible && "is-collapsible", collapsible && open && "is-open", className)}
      >
        {children}
      </article>
    </TierDisclosureContext.Provider>
  );
}

export function TierToggle({
  children,
  id,
  className,
  label,
}: PropsWithChildren<{ id: string; className?: string; label?: string }>) {
  const { open, toggle } = useTierDisclosure();
  return (
    <Button
      type="button"
      data-astro-cid-lcdefpme
      className={cn(className ? undefined : "tier__toggle", className)}
      aria-label={label}
      aria-expanded={open}
      aria-controls={id}
      onClick={toggle}
    >
      {children}
    </Button>
  );
}

type TierBodyProps = HTMLMotionProps<"div"> & { id: string };

export function TierBody({ children, className, id, ...props }: TierBodyProps) {
  const { collapsible, open } = useTierDisclosure();
  return (
    <motion.div
      {...props}
      id={id}
      data-astro-cid-lcdefpme
      className={cn("tier__body", className)}
      aria-hidden={collapsible && !open}
      initial={false}
      animate={{ height: collapsible ? (open ? "auto" : 0) : "auto", opacity: collapsible && !open ? 0 : 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      style={{
        ...props.style,
        maxHeight: "none",
        overflow: "hidden",
        flex: collapsible && !open ? "0 0 0px" : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}
