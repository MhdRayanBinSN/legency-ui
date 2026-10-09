import type { Cleanup } from "@/components/home-effects/types";

export function setupPixelReveal(): Cleanup {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const hosts = [...document.querySelectorAll<HTMLElement>("[data-pixelated-scroll-transition]")];
  const cleanups: Cleanup[] = [];
  for (const host of hosts) {
    const section = host.closest("section");
    if (!section) continue;
    const panel = document.createElement("div");
    panel.className = "pixelated-scroll-transition__panel";
    panel.setAttribute("aria-hidden", "true");
    const columns = Number(host.dataset.columns || 24);
    const rows = Number(host.dataset.rows || 8);
    panel.style.setProperty("--pixel-columns", String(columns));
    for (let x = 0; x < columns; x += 1) {
      const column = document.createElement("span");
      column.className = "pixelated-scroll-transition__col";
      for (let y = 0; y < rows; y += 1) {
        const pixel = document.createElement("i");
        pixel.className = "pixelated-scroll-transition__pixel";
        pixel.style.setProperty("--pixel-delay", `${Math.random() * 0.55 + (rows - y) * 0.025}s`);
        column.appendChild(pixel);
      }
      panel.appendChild(column);
    }
    host.appendChild(panel);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        panel.classList.add("is-revealing");
        observer.disconnect();
      }
    }, { rootMargin: "-10% 0px -10%" });
    observer.observe(section);
    cleanups.push(() => { observer.disconnect(); panel.remove(); });
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}

