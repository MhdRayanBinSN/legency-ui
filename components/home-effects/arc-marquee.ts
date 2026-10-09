import type { Cleanup } from "@/components/home-effects/types";

export function setupArcMarquee(): Cleanup {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const paths = [...document.querySelectorAll<SVGTextPathElement>("[data-arc-marquee]")];
  const cleanups: Cleanup[] = [];
  for (const path of paths) {
    const unit = path.dataset.arcUnit || "";
    const reps = Number(path.dataset.arcReps || 6);
    const speed = Number(path.dataset.arcSpeed || 60);
    if (!unit) continue;
    path.textContent = unit.repeat(reps);
    let active = false;
    let raf = 0;
    let last = 0;
    let offset = 0;
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    }, { threshold: 0 });
    const tick = (stamp: number) => {
      if (!active) return;
      if (last) offset += ((stamp - last) / 1000) * speed;
      last = stamp;
      const width = path.getComputedTextLength();
      path.setAttribute("startOffset", `${-(offset % Math.max(1, width / reps))}px`);
      raf = requestAnimationFrame(tick);
    };
    observer.observe(path);
    cleanups.push(() => { cancelAnimationFrame(raf); observer.disconnect(); });
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}

