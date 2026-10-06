"use client";

import { useEffect, useRef, useState, type JSX } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

type ConsentChoice = "accepted" | "rejected";

export default function ConsentBanner(): JSX.Element {
  const [open, setOpen] = useState(false);
  const bannerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const reopenButton = document.querySelector<HTMLElement>("[data-consent-reopen]");
    const reopen = () => setOpen(true);

    reopenButton?.addEventListener("click", reopen);
    return () => reopenButton?.removeEventListener("click", reopen);
  }, []);

  useEffect(() => {
    if (open) bannerRef.current?.focus();
  }, [open]);

  const choose = (state: ConsentChoice) => {
    try {
      localStorage.setItem(
        "lm-consent",
        JSON.stringify({ state, version: "1", at: new Date().toISOString() }),
      );
    } catch {
      // Consent controls remain usable when storage is unavailable.
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          ref={bannerRef}
          id="consent-banner"
          className="consent"
          tabIndex={-1}
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          aria-describedby="consent-body"
          data-astro-cid-u6s5b3h2
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
        >
          <h2 id="consent-title" className="consent__title" data-astro-cid-u6s5b3h2>
            Analytics cookies
          </h2>
          <p id="consent-body" className="consent__body" data-astro-cid-u6s5b3h2>
            We use Google Analytics only if you accept. It uses cookies and sends information about your visit to Google. Our own cookie-free analytics runs either way. See our{" "}
            <a href="/cookies/" data-astro-cid-u6s5b3h2>
              Cookie Policy
            </a>
            .
          </p>
          <div className="consent__actions" data-astro-cid-u6s5b3h2>
            <Button
              type="button"
              className="consent__btn consent__btn--yes"
              onClick={() => choose("accepted")}
              data-astro-cid-u6s5b3h2
            >
              Accept analytics
            </Button>
            <Button
              type="button"
              className="consent__btn consent__btn--no"
              onClick={() => choose("rejected")}
              data-astro-cid-u6s5b3h2
            >
              Reject analytics
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
