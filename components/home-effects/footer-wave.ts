import type { Cleanup } from "@/components/home-effects/types";

import { mountDitherCanvas } from "@/components/home-effects/dither-canvas";
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

export function setupFooterWave(): Cleanup {
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

