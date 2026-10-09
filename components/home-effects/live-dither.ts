import type { Cleanup } from "@/components/home-effects/types";

import { mountDitherCanvas } from "@/components/home-effects/dither-canvas";
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

export function setupDitherCanvas(host: HTMLElement): Cleanup {
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

