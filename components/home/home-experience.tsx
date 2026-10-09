"use client";

import { useEffect } from "react";

type Cleanup = () => void;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

// Fullscreen triangle, identical in every dither shader in this file.
const TRIANGLE = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);

function setupTriangle(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const buffer = gl.createBuffer();
  if (!buffer) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, TRIANGLE, gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  return buffer;
}

// The RAF loop, resize handling, visibility gating and pointer smoothing are the
// same in every dither canvas here, so they live in one place. Each caller
// supplies its own fragment source and an onFrame hook for its own uniforms;
// uniform names stay as the shaders already declare them.
type DitherFrame = {
  gl: WebGL2RenderingContext
  program: WebGLProgram
  /** getUniformLocation for this frame's program. */
  uniform: (name: string) => WebGLUniformLocation | null
  elapsed: number
  pointer: { x: number; y: number }
  target: { x: number; y: number }
  pixelRatio: number
  ripple: number
  rippleTarget: number
  pointerActive: boolean
  width: number
  height: number
};

type DitherOptions = {
  host: HTMLElement
  canvas: HTMLCanvasElement
  fragmentSource: string
  canvasClass: string
  /** Called once the program and uniforms are live, to set static uniforms. */
  onInit?: (frame: DitherFrame) => void
  /** Called every draw, to update per-frame uniforms. Return false to skip the draw. */
  onFrame: (frame: DitherFrame) => boolean
  /** Called when the canvas is resized to a new pixel size. */
  onResize?: (frame: DitherFrame) => void
  /** Skip the first-draw guard; the footer wave draws even when not loaded. */
  drawWhenIdle?: boolean
};

function mountDitherCanvas(options: DitherOptions): Cleanup {
  const { host, canvas, fragmentSource, canvasClass } = options;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let gl: WebGL2RenderingContext | null = null;
  try {
    canvas.className = canvasClass;
    canvas.setAttribute("aria-hidden", "true");
    gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    if (!gl) return () => {};

    const vertexSource = `#version 300 es
      in vec2 a_pos; out vec2 v_uv;
      void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;
    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      canvas.remove();
      return () => {};
    }

    const program = gl.createProgram();
    if (!program) return () => {};
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      canvas.remove();
      return () => {};
    }
    gl.useProgram(program);

    const buffer = setupTriangle(gl, program);
    if (!buffer) return () => {};

    const frame: DitherFrame = {
      gl,
      program,
      uniform: (name) => gl?.getUniformLocation(program, name) ?? null,
      elapsed: 0,
      pointer: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      pixelRatio: 1,
      ripple: 0,
      rippleTarget: 0,
      pointerActive: false,
      width: 0,
      height: 0,
    };

    const startedAt = performance.now();
    let visible = false;
    let raf = 0;
    let disposed = false;

    const resize = () => {
      frame.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(host.clientWidth * frame.pixelRatio));
      const height = Math.max(1, Math.round(host.clientHeight * frame.pixelRatio));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      frame.width = width;
      frame.height = height;
      gl?.viewport(0, 0, width, height);
      frame.pointer = { x: width / 2, y: height / 2 };
      frame.target = { ...frame.pointer };
      options.onResize?.(frame);
    };

    const draw = (stamp: number) => {
      if (!gl || disposed) return;
      if (!visible && !options.drawWhenIdle) return;
      frame.elapsed = (stamp - startedAt) * 0.001;
      frame.pointer.x += (frame.target.x - frame.pointer.x) * 0.12;
      frame.pointer.y += (frame.target.y - frame.pointer.y) * 0.12;
      frame.ripple += (frame.rippleTarget - frame.ripple) * 0.06;
      if (options.onFrame(frame)) {
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        canvas.classList.add("is-live");
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reduceMotion) return;
      const rect = host.getBoundingClientRect();
      frame.target.x = (event.clientX - rect.left) * frame.pixelRatio;
      frame.target.y = (rect.height - (event.clientY - rect.top)) * frame.pixelRatio;
      frame.rippleTarget = 1;
      frame.pointerActive = true;
    };
    const onPointerLeave = () => {
      frame.rippleTarget = reduceMotion ? 0 : 0.28;
      frame.pointerActive = false;
    };
    const onVisibilityChange = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (visible && !reduceMotion) raf = requestAnimationFrame(draw);
    };

    const pointerHost = host.closest<HTMLElement>("[data-live-dither-host]") || host;
    options.onInit?.(frame);
    resize();

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden && !reduceMotion) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    });
    observer.observe(host);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (!reduceMotion) {
      pointerHost.addEventListener("pointermove", onPointerMove, { passive: true });
      pointerHost.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      pointerHost.removeEventListener("pointermove", onPointerMove);
      pointerHost.removeEventListener("pointerleave", onPointerLeave);
      canvas.remove();
      gl?.deleteBuffer(buffer);
      gl?.deleteProgram(program);
      gl?.deleteShader(vertex);
      gl?.deleteShader(fragment);
    };
  } catch {
    canvas.remove();
    return () => {};
  }
}

function setupLogoCycle(): Cleanup {
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

function setupHeadingRoll(): Cleanup {
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

function setupArcMarquee(): Cleanup {
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

function setupCapabilitySequence(): Cleanup {
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

function setupPixelReveal(): Cleanup {
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

const DITHER_FRAGMENT = `#version 300 es
      precision highp float;
      uniform sampler2D u_tex;
      uniform vec2 u_res; uniform vec2 u_texRes;
      uniform float u_time; uniform vec2 u_pointer; uniform float u_ripple; uniform float u_px;
      uniform vec3 u_ink; uniform vec3 u_blue; uniform vec3 u_pale;
      uniform float u_light;
      out vec4 fragColor;
      const float BAYER[64] = float[64](
         0.0,48.0,12.0,60.0, 3.0,51.0,15.0,63.0, 32.0,16.0,44.0,28.0,35.0,19.0,47.0,31.0,
         8.0,56.0, 4.0,52.0,11.0,59.0, 7.0,55.0, 40.0,24.0,36.0,20.0,43.0,27.0,39.0,23.0,
         2.0,50.0,14.0,62.0, 1.0,49.0,13.0,61.0, 34.0,18.0,46.0,30.0,33.0,17.0,45.0,29.0,
        10.0,58.0, 6.0,54.0, 9.0,57.0, 5.0,53.0, 42.0,26.0,38.0,22.0,41.0,25.0,37.0,21.0);
      float bayer8(vec2 c) { int x = int(mod(c.x, 8.0)); int y = int(mod(c.y, 8.0)); return BAYER[y * 8 + x] / 64.0; }
      void main() {
        float px = max(u_px, 1.0);
        vec2 cell = floor(gl_FragCoord.xy / px);
        vec2 p = cell * px + 0.5 * px;
        vec2 uv = p / u_res;
        float ra = u_res.x / u_res.y, ta = u_texRes.x / u_texRes.y;
        vec2 tuv = uv;
        if (ra > ta) { tuv.y = (uv.y - 0.5) * (ta / ra) + 0.5; }
        else { tuv.x = (uv.x - 0.5) * (ra / ta) + 0.5; }
        vec2 q = (p - 0.5 * u_res) / u_res.y;
        vec2 m = (u_pointer - 0.5 * u_res) / u_res.y;
        float d = length(q - m);
        float wave = u_ripple * 0.6 * sin(d * 16.0 - u_time * 3.2) * exp(-d * 2.2);
        vec2 dir = d > 0.0001 ? (q - m) / d : vec2(0.0);
        tuv += dir * wave * 0.012;
        tuv.y = 1.0 - tuv.y;
        float lum = dot(texture(u_tex, clamp(tuv, 0.0, 1.0)).rgb, vec3(0.299, 0.587, 0.114));
        float grain = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453) * 0.07;
        if (u_light > 0.5) {
          lum = clamp(lum + wave * 0.18 * smoothstep(0.03, 0.12, lum), 0.0, 1.0);
        } else {
          lum = clamp(lum + wave * 0.18 + grain, 0.0, 1.0);
        }
        float b = bayer8(cell);
        vec3 col = mix(u_ink, u_blue, 1.0 - step(clamp(lum * 2.0, 0.0, 1.0), b));
        col = mix(col, u_pale, 1.0 - step(clamp(lum * 2.0 - 1.0, 0.0, 1.0), b));
        fragColor = vec4(col, 1.0);
      }
    `;

function setupDitherCanvas(host: HTMLElement): Cleanup {
  const imageSrc = host.dataset.liveDither;
  if (!imageSrc) return () => {};

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(imageSrc);
  const isLight = host.dataset.liveDitherTheme === "light";

  const canvas = document.createElement("canvas");
  // Captured by the cleanup below; the texture teardown needs both objects.
  let teardown: { gl: WebGL2RenderingContext; texture: WebGLTexture } | null = null;
  let loaded = false;
  let started = false;
  let image: HTMLImageElement | HTMLVideoElement = new Image();

  const cleanup = mountDitherCanvas({
    host,
    canvas,
    canvasClass: "live-dither__canvas",
    fragmentSource: DITHER_FRAGMENT,
    onInit: (frame) => {
      const { gl, uniform } = frame;
      gl.uniform3fv(uniform("u_ink"), isLight ? [242 / 255, 242 / 255, 242 / 255] : [6 / 255, 6 / 255, 12 / 255]);
      gl.uniform3fv(uniform("u_blue"), [0, 4 / 255, 246 / 255]);
      gl.uniform3fv(uniform("u_pale"), [205 / 255, 204 / 255, 1]);
      gl.uniform1f(uniform("u_light"), Number(isLight));
      const texture = gl.createTexture();
      teardown = { gl, texture };
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      image = isVideo ? document.createElement("video") : new Image();
      if (image instanceof HTMLVideoElement) {
        image.muted = true;
        image.loop = true;
        image.playsInline = true;
        image.preload = "auto";
      } else {
        image.decoding = "async";
      }
      image.src = imageSrc;

      const onLoad = () => {
        loaded = true;
        const width = image instanceof HTMLVideoElement ? image.videoWidth : image.naturalWidth;
        const height = image instanceof HTMLVideoElement ? image.videoHeight : image.naturalHeight;
        gl.uniform2f(uniform("u_texRes"), width, height);
        if (image instanceof HTMLImageElement) {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        } else {
          image.play().catch(() => {});
        }
        host.appendChild(canvas);
        started = true;
      };
      image.addEventListener(image instanceof HTMLVideoElement ? "loadeddata" : "load", onLoad, { once: true });
      image.addEventListener("error", () => canvas.remove(), { once: true });
      if (image instanceof HTMLImageElement && image.complete && image.naturalWidth) onLoad();
      if (image instanceof HTMLVideoElement) {
        const video = image;
        image.addEventListener(
          "loadedmetadata",
          () => gl.uniform2f(uniform("u_texRes"), video.videoWidth, video.videoHeight),
          { once: true },
        );
      }
    },
    onResize: (frame) => {
      frame.gl.uniform2f(frame.uniform("u_res"), frame.width, frame.height);
      frame.gl.uniform1f(frame.uniform("u_px"), 4 * frame.pixelRatio);
      if (!reduceMotion) {
        frame.ripple = 0.28;
        frame.rippleTarget = 0.28;
      }
    },
    onFrame: (frame) => {
      if (!loaded || !started) return false;
      const { gl, uniform } = frame;
      // Idle drift, matching the original loop.
      if (!frame.pointerActive) {
        frame.target.x = frame.width * (0.5 + Math.sin(frame.elapsed * 0.23) * 0.18);
        frame.target.y = frame.height * (0.5 + Math.cos(frame.elapsed * 0.19) * 0.12);
      }
      gl.bindTexture(gl.TEXTURE_2D, teardown?.texture ?? null);
      if (image instanceof HTMLVideoElement) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      }
      gl.uniform2f(uniform("u_pointer"), frame.pointer.x, frame.pointer.y);
      gl.uniform1f(uniform("u_time"), frame.elapsed);
      gl.uniform1f(uniform("u_ripple"), frame.ripple);
      return true;
    },
  });

  return () => {
    cleanup();
    if (image instanceof HTMLVideoElement) {
      image.pause();
      image.removeAttribute("src");
      image.load();
    }
    teardown?.gl.deleteTexture(teardown.texture);
  };
}

const WAVE_FRAGMENT = `#version 300 es
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_pointer;
    uniform float u_ripple;
    uniform float u_pxSize;
    uniform vec3 u_bg;
    uniform vec3 u_fg;
    out vec4 fragColor;
    const float BAYER[64] = float[64](
      0.0,48.0,12.0,60.0, 3.0,51.0,15.0,63.0,
      32.0,16.0,44.0,28.0,35.0,19.0,47.0,31.0,
      8.0,56.0, 4.0,52.0,11.0,59.0, 7.0,55.0,
      40.0,24.0,36.0,20.0,43.0,27.0,39.0,23.0,
      2.0,50.0,14.0,62.0, 1.0,49.0,13.0,61.0,
      34.0,18.0,46.0,30.0,33.0,17.0,45.0,29.0,
      10.0,58.0, 6.0,54.0, 9.0,57.0, 5.0,53.0,
      42.0,26.0,38.0,22.0,41.0,25.0,37.0,21.0);
    float bayer8(vec2 cell) {
      int x = int(mod(cell.x, 8.0));
      int y = int(mod(cell.y, 8.0));
      return BAYER[y * 8 + x] / 64.0;
    }
    float waveField(vec2 p, float t) {
      float w = 0.0;
      w += sin(p.x * 3.0 + t * 1.15);
      w += sin(p.x * 1.7 - p.y * 2.3 + t * 0.9);
      w += 0.75 * sin(p.y * 4.0 + p.x * 1.1 - t * 1.7);
      w += 0.55 * sin((p.x + p.y) * 2.4 + t * 0.5);
      return w * 0.28;
    }
    void main() {
      vec2 res = u_resolution;
      float px = max(u_pxSize, 1.0);
      vec2 cell = floor(gl_FragCoord.xy / px);
      vec2 cellPx = cell * px + 0.5 * px;
      vec2 uv = (cellPx - 0.5 * res) / res.y;
      float w = waveField(uv, u_time);
      vec2 m = (u_pointer - 0.5 * res) / res.y;
      float d = length(uv - m);
      w += u_ripple * 0.6 * sin(d * 16.0 - u_time * 3.2) * exp(-d * 2.2);
      float r = length(uv * vec2(0.85, 1.0));
      float glow = smoothstep(0.66, 0.0, r + 0.12 * w);
      float intensity = clamp(mix(glow, 0.5 + 0.5 * w, 0.3) * 0.85 - 0.12, 0.0, 1.0);
      float bit = step(bayer8(cell), intensity);
      fragColor = vec4(mix(u_bg, u_fg, bit), 1.0);
    }
  `;

function setupFooterWave(): Cleanup {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-dithered-wave]");
  const host = canvas?.closest<HTMLElement>(".closer");
  if (!canvas || !host) return () => {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // With reduced motion there is no RAF loop, so onInit draws the one static
  // frame the original drew in its else branch.
  return mountDitherCanvas({
    host,
    canvas,
    canvasClass: "closer__wave",
    fragmentSource: WAVE_FRAGMENT,
    onInit: (frame) => {
      const { gl, uniform } = frame;
      gl.uniform3fv(uniform("u_bg"), [0, 0, 0]);
      gl.uniform3fv(uniform("u_fg"), [0, 4 / 255, 246 / 255]);
      if (reduceMotion) {
        gl.uniform1f(uniform("u_time"), 2);
        gl.uniform2f(uniform("u_pointer"), canvas.width / 2, canvas.height / 2);
        gl.uniform1f(uniform("u_ripple"), 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        canvas.classList.add("is-live");
      }
    },
    onResize: (frame) => {
      frame.gl.uniform2f(frame.uniform("u_resolution"), frame.width, frame.height);
      frame.gl.uniform1f(frame.uniform("u_pxSize"), 4 * frame.pixelRatio);
    },
    onFrame: (frame) => {
      const { gl, uniform } = frame;
      gl.uniform1f(uniform("u_time"), frame.elapsed);
      gl.uniform2f(uniform("u_pointer"), frame.pointer.x, frame.pointer.y);
      gl.uniform1f(uniform("u_ripple"), frame.ripple);
      return true;
    },
  });
}

function useHomeExperience() {
  useEffect(() => setupLogoCycle(), []);
  useEffect(() => setupHeadingRoll(), []);
  useEffect(() => setupArcMarquee(), []);
  useEffect(() => setupCapabilitySequence(), []);
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
