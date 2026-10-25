// Interactive 3D globe (orthographic projection on a canvas). Loaded only when the globe
// scrolls into view, so pages without it never download d3-geo or the land data.
import { geoOrthographic, geoPath, geoGraticule, geoDistance, type GeoPermissibleObjects } from 'd3-geo';
import type { Site } from './latlong-data.ts';

export interface GlobeState {
  lon: number; // view centre
  lat: number;
  ringLat: number | null; // highlighted line of latitude
  meridianLon: number | null; // highlighted line of longitude
  pin: [number, number] | null; // [lon, lat]
  activeSite: string | null;
}

/** A line of latitude as a line (not a filled circle, which would be clipped along the globe's edge). */
const parallel = (lat: number): GeoPermissibleObjects => ({
  type: 'LineString',
  coordinates: Array.from({ length: 181 }, (_, i) => [-180 + i * 2, lat]),
});

export function createGlobe(canvas: HTMLCanvasElement, land: GeoPermissibleObjects, sites: Site[], onChange?: () => void) {
  const ctx = canvas.getContext('2d')!;
  const projection = geoOrthographic().clipAngle(90).precision(0.4);
  const path = geoPath(projection, ctx);
  const graticule = geoGraticule().step([15, 15])();
  const state: GlobeState = { lon: 30, lat: 25, ringLat: null, meridianLon: null, pin: null, activeSite: null };
  let size = 0;
  let dpr = 1;

  const css = (name: string, fallback: string) => getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = Math.round(canvas.getBoundingClientRect().width) || 360;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    projection.scale(size / 2 - 6).translate([size / 2, size / 2]);
    draw();
  }

  const visible = (lon: number, lat: number) => geoDistance([lon, lat], [state.lon, state.lat]) < Math.PI / 2 - 0.02;

  function label(text: string, lon: number, lat: number, color: string, dy = -12) {
    if (!visible(lon, lat)) return;
    const [x, y] = projection([lon, lat])!;
    ctx.font = `700 ${Math.max(12, size / 30)}px ${getComputedStyle(canvas).fontFamily}`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.strokeText(text, x, y + dy);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y + dy);
  }

  function draw() {
    projection.rotate([-state.lon, -state.lat]);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    const r = size / 2 - 6;
    const c = size / 2;

    // Ocean with soft 3D shading
    const ocean = ctx.createRadialGradient(c - r * 0.35, c - r * 0.35, r * 0.1, c, c, r);
    ocean.addColorStop(0, '#9fd0f5');
    ocean.addColorStop(1, '#2f6fb3');
    ctx.beginPath();
    path({ type: 'Sphere' });
    ctx.fillStyle = ocean;
    ctx.fill();

    ctx.beginPath();
    path(land);
    ctx.fillStyle = '#7cc47f';
    ctx.fill();
    ctx.strokeStyle = 'rgba(30, 80, 40, 0.6)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.beginPath();
    path(graticule);
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Equator and prime meridian
    ctx.beginPath();
    path(parallel(0));
    ctx.strokeStyle = css('--bad', '#b42318');
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    path({ type: 'LineString', coordinates: [[0, -90], [0, 0], [0, 90]] });
    ctx.strokeStyle = '#1d3fa8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const glow = '#f2b01e';
    if (state.ringLat !== null) {
      ctx.beginPath();
      path(parallel(state.ringLat));
      ctx.strokeStyle = glow;
      ctx.lineWidth = 5;
      ctx.stroke();
    }
    if (state.meridianLon !== null) {
      ctx.beginPath();
      path({ type: 'LineString', coordinates: [[state.meridianLon, -90], [state.meridianLon, 0], [state.meridianLon, 90]] });
      ctx.strokeStyle = glow;
      ctx.lineWidth = 5;
      ctx.stroke();
    }

    for (const s of sites) {
      if (!visible(s.lon, s.lat)) continue;
      const [x, y] = projection([s.lon, s.lat])!;
      ctx.beginPath();
      ctx.arc(x, y, s.id === state.activeSite ? 8 : 5.5, 0, Math.PI * 2);
      ctx.fillStyle = s.home ? css('--ela', '#a63d66') : s.id === state.activeSite ? '#e0452b' : glow;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1c1b24';
      ctx.stroke();
    }
    if (state.pin && visible(...state.pin)) {
      const [x, y] = projection(state.pin)!;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#1c1b24';
      ctx.stroke();
    }

    // Line names, placed on the side facing the viewer
    label('Equator 0°', state.lon, 0, css('--bad', '#b42318'));
    label('Prime Meridian 0°', 0, Math.max(-60, Math.min(60, state.lat + 18)), '#1d3fa8');
    if (state.ringLat !== null) label(fmtLat(state.ringLat), state.lon, state.ringLat, '#8a5a00');
    if (state.meridianLon !== null) label(fmtLon(state.meridianLon), state.meridianLon, Math.max(-60, Math.min(60, state.lat - 12)), '#8a5a00');

    // Limb shading and a highlight make the sphere look round
    const limb = ctx.createRadialGradient(c, c, r * 0.75, c, c, r);
    limb.addColorStop(0, 'rgba(0,0,0,0)');
    limb.addColorStop(1, 'rgba(0,0,30,0.28)');
    ctx.beginPath();
    path({ type: 'Sphere' });
    ctx.fillStyle = limb;
    ctx.fill();
    const shine = ctx.createRadialGradient(c - r * 0.45, c - r * 0.5, 0, c - r * 0.45, c - r * 0.5, r * 0.6);
    shine.addColorStop(0, 'rgba(255,255,255,0.35)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shine;
    ctx.fill();
    onChange?.();
  }

  /** Smoothly turns the globe to centre on a point. */
  function flyTo(lon: number, lat: number, ms = 900): Promise<void> {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [l0, p0] = [state.lon, state.lat];
    let dl = ((lon - l0 + 540) % 360) - 180; // shortest way round
    if (reduce) ms = 1;
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

  /** Lat/lon under a point on the canvas, or null if it's off the globe. */
  function invert(clientX: number, clientY: number): [number, number] | null {
    const rect = canvas.getBoundingClientRect();
    const p = projection.invert!([clientX - rect.left, clientY - rect.top]);
    if (!p || !visible(p[0], p[1])) return null;
    return p as [number, number];
  }

  return { state, draw, resize, flyTo, invert };
}

export const fmtLat = (v: number) => (Math.abs(v) < 0.5 ? '0° (Equator)' : `${Math.abs(Math.round(v))}°${v > 0 ? 'N' : 'S'}`);
export const fmtLon = (v: number) => (Math.abs(v) < 0.5 ? '0° (Prime Meridian)' : `${Math.abs(Math.round(v))}°${v > 0 ? 'E' : 'W'}`);
