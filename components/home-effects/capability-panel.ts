import type { Cleanup } from "@/components/home-effects/types";

export function setupCapabilityStickyPanel(): Cleanup {
  const section = document.querySelector<HTMLElement>(".separates");
  const panel = section?.querySelector<HTMLElement>("[data-sticky-feature-wrap]");
  const container = panel?.closest<HTMLElement>(".container");
  if (!section || !panel || !container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const items = [...panel.querySelectorAll<HTMLElement>("[data-sticky-feature-item]")];
  const visuals = [...panel.querySelectorAll<HTMLElement>("[data-sticky-feature-visual-wrap]")];
  const progress = panel.querySelector<HTMLElement>("[data-sticky-feature-progress] span");
  if (!items.length || !visuals.length) return () => {};

  section.classList.add("separates--motion");
  panel.classList.add("is-sticky");
  const originalContainerPadding = container.style.paddingBottom;
  container.style.paddingBottom = "200svh";
  const flowTop = panel.offsetTop;
  const flowHeight = panel.getBoundingClientRect().height;
  const spacer = document.createElement("div");
  spacer.className = "separates__pin-spacer";
  spacer.setAttribute("aria-hidden", "true");
  spacer.style.height = `${flowHeight}px`;
  panel.before(spacer);
  const originalPanelStyles = {
    position: panel.style.position,
    top: panel.style.top,
    left: panel.style.left,
    width: panel.style.width,
    height: panel.style.height,
    zIndex: panel.style.zIndex,
  };
  panel.style.position = "absolute";
  panel.style.top = `${flowTop}px`;
  panel.style.left = `${panel.offsetLeft}px`;
  panel.style.width = `${panel.getBoundingClientRect().width}px`;
  panel.style.height = `${flowHeight}px`;
  panel.style.zIndex = "2";
  const setActive = (index: number, amount: number) => {
    items.forEach((item, itemIndex) => {
      const isActive = itemIndex === index;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-hidden", String(!isActive));
      // The source page uses GSAP autoAlpha, which writes visibility inline.
      // Match that here so its captured `.is-sticky` visibility rule does not
      // keep later feature copy hidden when only the active class changes.
      item.style.visibility = isActive ? "visible" : "hidden";
      item.style.opacity = isActive ? "1" : "0";
      item.style.transform = isActive ? "translateY(0)" : "translateY(30px)";
    });
    visuals.forEach((visual, visualIndex) => {
      visual.classList.toggle("is-active", visualIndex === index);
      visual.style.clipPath = visualIndex <= index ? "inset(0% round 0.75em)" : "inset(50% round 0.75em)";
    });
    if (progress) progress.style.transform = `scaleX(${amount})`;
  };
  let activeIndex = 0;
  let frame = 0;
  let start = 0;
  let span = 0;
  let stickyTop = 0;
  let panelLeft = 0;
  let panelWidth = 0;
  const measure = () => {
    const styles = getComputedStyle(container);
    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
    const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
    const containerRect = container.getBoundingClientRect();
    panelLeft = paddingLeft;
    panelWidth = Math.max(1, container.clientWidth - paddingLeft - paddingRight);
    panel.style.width = `${panelWidth}px`;
    const mobile = window.innerWidth <= 767;
    const panelHeight = Math.min(window.innerHeight * (mobile ? 0.92 : 0.85), mobile ? 760 : 840);
    panel.style.height = `${panelHeight}px`;
    spacer.style.height = panel.style.height;
    span = Math.max(1, window.innerHeight * Math.max(1, items.length - 1));
    stickyTop = Math.max(window.innerHeight * 0.075, (window.innerHeight - panelHeight) / 2);
    start = containerRect.top + window.scrollY + flowTop - (window.innerHeight - panel.getBoundingClientRect().height) / 2;
  };
  const update = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / span));
      const amount = Math.min(progress, 0.9) / 0.9;
      const next = Math.min(items.length - 1, Math.floor(amount * (items.length - 1) + 0.00001));
      if (window.scrollY < start) {
        panel.style.position = "absolute";
        panel.style.top = `${flowTop}px`;
        panel.style.left = `${panelLeft}px`;
      } else if (window.scrollY <= start + span) {
        panel.style.position = "fixed";
        panel.style.top = `${stickyTop}px`;
        panel.style.left = `${container.getBoundingClientRect().left + panelLeft}px`;
      } else {
        panel.style.position = "absolute";
        panel.style.top = `${flowTop + span}px`;
        panel.style.left = `${panelLeft}px`;
      }
      if (next !== activeIndex) activeIndex = next;
      setActive(activeIndex, amount);
    });
  };
  const onResize = () => { measure(); update(); };
  measure();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", onResize);
  setActive(0, 0);
  update();
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", onResize);
    section.classList.remove("separates--motion");
    panel.classList.remove("is-sticky");
    container.style.paddingBottom = originalContainerPadding;
    panel.style.position = originalPanelStyles.position;
    panel.style.top = originalPanelStyles.top;
    panel.style.left = originalPanelStyles.left;
    panel.style.width = originalPanelStyles.width;
    panel.style.height = originalPanelStyles.height;
    panel.style.zIndex = originalPanelStyles.zIndex;
    spacer.remove();
  };
}

