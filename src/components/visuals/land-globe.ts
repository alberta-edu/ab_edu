// A 3D globe of human-made structures on the land (LANENG6-OI1-GQ1-LO1, K7.1). Loaded only when the
// globe scrolls into view, so pages without it never download d3-geo or the land data.
import { geoOrthographic, geoPath, geoGraticule, geoDistance, type GeoPermissibleObjects } from 'd3-geo';

export interface LandSite {
  id: string;
  lat: number;
  lon: number;
}

/** Rotation that puts a place at the centre of the view, tilted a little so the poles don't sit flat. */
export const centreOn = (lon: number, lat: number): [number, number] => [-lon, -Math.max(-60, Math.min(60, lat))];

export function createLandGlobe(canvas: HTMLCanvasElement, land: GeoPermissibleObjects, sites: LandSite[]) {
  const ctx = canvas.getContext('2d')!;
  const projection = geoOrthographic().clipAngle(90).precision(0.4);
  const path = geoPath(projection, ctx);
  const graticule = geoGraticule().step([20, 20])();
  const state = { lon: -60, lat: 40, active: null as string | null };
  let size = 0;
  let dpr = 1;
  const css = (name: string, fallback: string) => getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = Math.round(canvas.getBoundingClientRect().width) || 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    projection.scale(size / 2 - 4).translate([size / 2, size / 2]);
    draw();
  }

  const visible = (lon: number, lat: number) => geoDistance([lon, lat], [state.lon, state.lat]) < Math.PI / 2 - 0.03;

  function draw() {
    projection.rotate(centreOn(state.lon, state.lat));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    const r = size / 2 - 4;
    const c = size / 2;
    const ocean = ctx.createRadialGradient(c - r * 0.35, c - r * 0.35, r * 0.1, c, c, r);
    ocean.addColorStop(0, '#9fd0f5');
    ocean.addColorStop(1, '#2f6fb3');
    ctx.beginPath();
    path({ type: 'Sphere' });
    ctx.fillStyle = ocean;
    ctx.fill();
    ctx.beginPath();
    path(land);
    ctx.fillStyle = '#c9b48a';
    ctx.fill();
    ctx.strokeStyle = 'rgba(80, 60, 30, 0.6)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.beginPath();
    path(graticule);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 0.7;
    ctx.stroke();
    // Inactive markers first, so the chosen one sits on top.
    const order = [...sites].sort((a, b) => Number(a.id === state.active) - Number(b.id === state.active));
    for (const s of order) {
      if (!visible(s.lon, s.lat)) continue;
      const [x, y] = projection([s.lon, s.lat])!;
      const on = s.id === state.active;
      ctx.beginPath();
      ctx.arc(x, y, on ? 9 : 5.5, 0, Math.PI * 2);
      ctx.fillStyle = on ? css('--ela', '#a63d66') : '#f2b01e';
      ctx.fill();
      ctx.lineWidth = on ? 3 : 2;
      ctx.strokeStyle = on ? '#ffffff' : '#1c1b24';
      ctx.stroke();
    }
    const limb = ctx.createRadialGradient(c, c, r * 0.75, c, c, r);
    limb.addColorStop(0, 'rgba(0,0,0,0)');
    limb.addColorStop(1, 'rgba(0,0,30,0.28)');
    ctx.beginPath();
    path({ type: 'Sphere' });
    ctx.fillStyle = limb;
    ctx.fill();
  }

  /** Turns the globe smoothly until a place faces the viewer. */
  function flyTo(lon: number, lat: number, ms = 900): Promise<void> {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) ms = 1;
    const [l0, p0] = [state.lon, state.lat];
    const dl = ((lon - l0 + 540) % 360) - 180;
    const t0 = performance.now();
    return new Promise((resolve) => {
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / ms);
        const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        state.lon = l0 + dl * e;
        state.lat = p0 + (lat - p0) * e;
        draw();
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  }

  /** The site under a tap, if any. */
  function siteAt(clientX: number, clientY: number): string | null {
    const rect = canvas.getBoundingClientRect();
    let best: string | null = null;
    let bestD = 16;
    for (const s of sites) {
      if (!visible(s.lon, s.lat)) continue;
      const [x, y] = projection([s.lon, s.lat])!;
      const d = Math.hypot(x - (clientX - rect.left), y - (clientY - rect.top));
      if (d < bestD) [best, bestD] = [s.id, d];
    }
    return best;
  }

  return { state, draw, resize, flyTo, siteAt };
}
