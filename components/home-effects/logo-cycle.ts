import type { Cleanup } from "@/components/home-effects/types";

export function setupLogoCycle(): Cleanup {
  const walls = [...document.querySelectorAll<HTMLElement>("[data-logo-wall-cycle-init]")];
  const cleanups: Cleanup[] = [];
  for (const wall of walls) {
    const items = [...wall.querySelectorAll<HTMLElement>("[data-logo-wall-item]")];
    const list = wall.querySelector<HTMLElement>("[data-logo-wall-list]");
    if (!list || items.length < 2) continue;
    const sources = items.map((item) => {
      const image = item.querySelector<HTMLImageElement>("img");
      return image ? { src: image.src, alt: image.alt, width: image.width, height: image.height } : null;
    }).filter((item): item is NonNullable<typeof item> => Boolean(item));
    if (sources.length < 2) continue;

    let active = false;
    let next = 0;
    let cursor = 0;
    let timer = 0;
    const tick = () => {
      if (!active || document.hidden) return;
      const visibleItems = items.filter((item) => getComputedStyle(item).display !== "none");
      if (!visibleItems.length) return;
      const item = visibleItems[cursor % visibleItems.length];
      cursor += 1;
      const oldImage = item.querySelector<HTMLImageElement>("img");
      if (!oldImage) return;
      const source = sources[next % sources.length];
      next += 1;
      if (oldImage.src === source.src) return;
      const replacement = oldImage.cloneNode(false) as HTMLImageElement;
      replacement.src = source.src;
      replacement.alt = source.alt;
      replacement.width = source.width;
      replacement.height = source.height;
      replacement.classList.add("logo-wall__logo-img", "logo-wall__logo-img--entering");
      const target = oldImage.closest<HTMLElement>("[data-logo-wall-target]");
      if (!target) return;
      oldImage.classList.add("logo-wall__logo-img--leaving");
      target.appendChild(replacement);
      requestAnimationFrame(() => replacement.classList.remove("logo-wall__logo-img--entering"));
      window.setTimeout(() => oldImage.remove(), 950);
    };
    const visibility = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active && !timer) timer = window.setInterval(tick, 1500);
      if (!active && timer) { window.clearInterval(timer); timer = 0; }
    }, { threshold: 0 });
    const onPageVisibility = () => { if (!document.hidden && active) tick(); };
    visibility.observe(wall);
    document.addEventListener("visibilitychange", onPageVisibility);
    cleanups.push(() => {
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onPageVisibility);
      if (timer) window.clearInterval(timer);
    });
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}

