// Small timing helpers for the virtual experiments.

/** Smooth start and stop. */
export const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Calls onFrame(t) with t going from 0 to 1 over `ms` milliseconds. With reduced motion the
 * same frames play much faster, so the end state is still shown.
 */
export function tween(ms: number, onFrame: (t: number) => void): Promise<void> {
  const dur = reducedMotion() ? Math.min(ms, 300) : ms;
  return new Promise((resolve) => {
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      onFrame(t);
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, reducedMotion() ? Math.min(ms, 100) : ms));

/**
 * Runs `tick` on every animation frame while the element is on screen, so off-screen
 * visuals don't use battery. `tick` gets the seconds since the last frame (capped).
 */
export function loopWhileVisible(el: Element, tick: (dt: number) => void) {
  let raf = 0;
  let last = 0;
  const frame = (now: number) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    tick(dt);
    raf = requestAnimationFrame(frame);
  };
  new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf);
    last = 0;
    if (e.isIntersecting) raf = requestAnimationFrame(frame);
  }).observe(el);
}
