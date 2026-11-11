'use client';

import { useEffect, useRef, type RefObject } from 'react';
import styles from './topocanvas.module.css';
import { mixColor, parseHex, terrain, type Rgb } from '../../utils/topo';
import { prefersReducedMotion } from '../../utils/motion';

const LEVELS = 14; // nombre de teintes entre le lagon et la lave
const SCALE = 0.003; // zoom du relief
const SPEED = 0.00006; // vitesse de déformation
const FRAME_MS = 33; // ~30 images par seconde suffisent
const DOT_SPACING = 26; // écart entre deux points de la grille, en pixels
const BUMP_RADIUS = 170; // rayon du relief soulevé par le pointeur, en pixels
const BUMP_HEIGHT = 0.2;
const CLEAR_FADE = 110; // distance sur laquelle les points regrossissent autour du texte

const LOW: Rgb = [47, 208, 230];
const MID: Rgb = [255, 111, 156];
const HIGH: Rgb = [255, 122, 47];

/**
 * Fond animé du bandeau d'accueil : une grille de points dont la taille et la
 * couleur suivent un relief qui se déforme lentement, et qui se soulève sous
 * le pointeur. Autour de l'élément `avoid` (le texte), les points restent très
 * fins pour ne pas gêner la lecture, puis regrossissent progressivement.
 */
export default function TopoCanvas({ avoid }: { readonly avoid?: RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const still = prefersReducedMotion();
    let width = 0;
    let height = 0;
    let colors: string[] = [];
    let frame = 0;
    let last = -Infinity;
    let visible = true;
    const bump = { x: 0, y: 0, strength: 0, target: 0 };

    const readColors = () => {
      const css = getComputedStyle(canvas);
      const low = parseHex(css.getPropertyValue('--topo-low'), LOW);
      const mid = parseHex(css.getPropertyValue('--topo-mid'), MID);
      const high = parseHex(css.getPropertyValue('--topo-high'), HIGH);
      const alpha = Number.parseFloat(css.getPropertyValue('--topo-alpha')) || 0.5;
      colors = Array.from({ length: LEVELS }, (_, i) =>
        mixColor(low, mid, high, i / (LEVELS - 1), alpha),
      );
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Hauteur du relief soulevé par le pointeur au point (x, y).
    const bumpAt = (x: number, y: number) =>
      bump.strength > 0.01
        ? BUMP_HEIGHT *
          bump.strength *
          Math.exp(-((x - bump.x) ** 2 + (y - bump.y) ** 2) / (2 * BUMP_RADIUS ** 2))
        : 0;

    const draw = (time: number) => {
      const t = time * SPEED;
      bump.strength += (bump.target - bump.strength) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Zone à épargner, dans le repère du canvas.
      const origin = canvas.getBoundingClientRect();
      const box = avoid?.current?.getBoundingClientRect();

      for (let y = DOT_SPACING / 2; y < height; y += DOT_SPACING) {
        for (let x = DOT_SPACING / 2; x < width; x += DOT_SPACING) {
          const value = Math.min(1, terrain(x * SCALE, y * SCALE, t) + bumpAt(x, y) * 2);
          ctx.fillStyle = colors[Math.min(LEVELS - 1, Math.floor(value * LEVELS))];
          ctx.beginPath();

          let growth = 1;
          if (box) {
            const dx = Math.max(box.left - origin.left - x, 0, x - (box.right - origin.left));
            const dy = Math.max(box.top - origin.top - y, 0, y - (box.bottom - origin.top));
            const near = Math.min(Math.hypot(dx, dy) / CLEAR_FADE, 1);
            growth = near * near * (3 - 2 * near);
          }
          ctx.arc(x, y, 0.6 + value * value * 3.4 * growth, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden || time - last < FRAME_MS) return;
      last = time;
      draw(time);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      bump.x = event.clientX - rect.left;
      bump.y = event.clientY - rect.top;
      bump.target = bump.y >= 0 && bump.y <= rect.height ? 1 : 0;
    };

    const onResize = () => {
      resize();
      if (still) draw(0);
    };

    const onThemeChange = () => {
      readColors();
      if (still) draw(0);
    };

    readColors();
    resize();

    globalThis.addEventListener('resize', onResize);
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    let viewObserver: IntersectionObserver | undefined;
    if (still) {
      draw(0);
    } else {
      globalThis.addEventListener('pointermove', onPointerMove, { passive: true });
      if (typeof IntersectionObserver !== 'undefined') {
        viewObserver = new IntersectionObserver((entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
        });
        viewObserver.observe(canvas);
      }
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      globalThis.removeEventListener('resize', onResize);
      globalThis.removeEventListener('pointermove', onPointerMove);
      themeObserver.disconnect();
      viewObserver?.disconnect();
    };
  }, [avoid]);

  return <canvas ref={ref} className={styles.canvas} aria-hidden="true" />;
}
