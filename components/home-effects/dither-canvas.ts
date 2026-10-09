import type { Cleanup } from "@/components/home-effects/types";
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

export function mountDitherCanvas(options: DitherOptions): Cleanup {
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

