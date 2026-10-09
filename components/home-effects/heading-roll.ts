import type { Cleanup } from "@/components/home-effects/types";

export function setupHeadingRoll(): Cleanup {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const heading = entry.target as HTMLElement;
      const letters = [...heading.querySelectorAll<HTMLElement>(".roll-letter")];
      letters.forEach((letter, index) => {
        letter.animate(
          [{ transform: "translateY(105%)" }, { transform: "translateY(0%)" }],
          { duration: 800, delay: Math.min(index * 11, 420), easing: "cubic-bezier(.16,1,.3,1)", fill: "both" },
        );
      });
      observer.unobserve(heading);
    }
  }, { threshold: 0.18 });

  const headings = [...document.querySelectorAll<HTMLElement>("main h2")].filter((heading) =>
    !heading.closest(".prose") && !heading.querySelector("button") &&
    !heading.hasAttribute("data-no-roll") && heading.textContent.trim().length <= 80,
  );
  for (const heading of headings) {
    const label = heading.textContent?.trim() || "";
    if (!label) continue;
    heading.setAttribute("aria-label", label);
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    for (const node of nodes) {
      const fragment = document.createDocumentFragment();
      for (const char of node.textContent || "") {
        const letter = document.createElement("span");
        letter.className = "roll-letter";
        letter.setAttribute("aria-hidden", "true");
        const current = document.createElement("span");
        current.className = "roll-char";
        current.textContent = char === " " ? "\u00a0" : char;
        const twin = document.createElement("span");
        twin.className = "roll-char-twin";
        twin.setAttribute("aria-hidden", "true");
        twin.textContent = char === " " ? "\u00a0" : char;
        letter.append(current, twin);
        fragment.appendChild(letter);
      }
      node.replaceWith(fragment);
    }
    observer.observe(heading);
  }
  return () => observer.disconnect();
}

