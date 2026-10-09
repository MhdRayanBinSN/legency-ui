"use client";

import { useEffect } from "react";

import { setupLogoCycle } from "@/components/home-effects/logo-cycle";
import { setupHeadingRoll } from "@/components/home-effects/heading-roll";
import { setupArcMarquee } from "@/components/home-effects/arc-marquee";
import { setupCapabilityStickyPanel } from "@/components/home-effects/capability-panel";
import { setupPixelReveal } from "@/components/home-effects/pixel-reveal";
import { setupFooterWave } from "@/components/home-effects/footer-wave";
import { setupDitherCanvas } from "@/components/home-effects/live-dither";

function useHomeExperience() {
  useEffect(() => setupLogoCycle(), []);
  useEffect(() => setupHeadingRoll(), []);
  useEffect(() => setupArcMarquee(), []);
  useEffect(() => setupCapabilityStickyPanel(), []);
  useEffect(() => setupPixelReveal(), []);
  useEffect(() => setupFooterWave(), []);
  useEffect(() => {
    const cleanups = [...document.querySelectorAll<HTMLElement>("[data-live-dither]")]
      .map((host) => setupDitherCanvas(host));
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);
  useEffect(() => {
    const year = document.querySelector<HTMLElement>("[data-dynamic-year]");
    if (year) year.textContent = String(new Date().getFullYear());
  }, []);
}

export default function HomeExperience() {
  useHomeExperience();

  return null;
}
