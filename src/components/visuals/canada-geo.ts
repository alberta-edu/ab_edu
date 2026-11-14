// Build-time only: projects the Grade 4 maps of North America (a conic projection, so Canada keeps
// its shape), and returns plain SVG paths and points. The browser never loads a map library.
// Land: Natural Earth 1:50m via world-atlas. Lakes and rivers: Natural Earth 1:50m (na-water.json).
import { feature } from 'topojson-client';
import { geoConicConformal, geoPath, type GeoProjection } from 'd3-geo';
import land50 from 'world-atlas/land-50m.json';
import water from './na-water.json';
import { FRAMES, type LonLat } from './canada-map-data.ts';

export interface Projected {
  width: number;
  height: number;
  land: string;
  lakes: string;
  rivers: string;
  /** Lon/lat to map units. */
  xy: (p: LonLat) => [number, number];
  /** A polygon or line through lon/lat points, as an SVG path. */
  path: (pts: LonLat[], close?: boolean) => string;
}

const cache = new Map<string, Projected>();

/**
 * Drops points closer than `tol` map units to the last point kept, and rings that end up tiny, so
 * the coastline stays sharp on screen without sending every bay of the 1:50m data.
 */
export function thin(d: string, tol = 1.4): string {
  return (d.match(/M[^M]*/g) ?? [])
    .map((ring) => {
      const pts = (ring.match(/-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?/g) ?? []).map((p) => p.split(',').map(Number));
      const kept: number[][] = [];
      pts.forEach((p, i) => {
        const q = kept[kept.length - 1];
        if (!q || i === pts.length - 1 || Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) >= tol) kept.push(p);
      });
      if (kept.length < 4) return '';
      return 'M' + kept.map((p) => p.join(',')).join('L') + (ring.trim().endsWith('Z') ? 'Z' : '');
    })
    .join('');
}

export function project(frameId: string): Projected {
  const hit = cache.get(frameId);
  if (hit) return hit;
  const f = FRAMES[frameId];
  if (!f) throw new Error(`Unknown map frame "${frameId}"`);
  const proj: GeoProjection = geoConicConformal()
    .rotate([-f.rotate, 0])
    .parallels(f.parallels)
    .fitExtent([[8, 8], [f.width - 8, f.height - 8]], { type: 'MultiPoint', coordinates: f.fit });
  const xy = (p: LonLat) => proj(p) as [number, number];
  const fmt = (n: number) => n.toFixed(1);
  const path = (pts: LonLat[], close = false) =>
    pts.map((p, i) => { const [x, y] = xy(p); return `${i ? 'L' : 'M'}${fmt(x)},${fmt(y)}`; }).join('') + (close ? 'Z' : '');
  // Only keep water that falls near the frame, so far-off rivers don't bloat the page.
  const near = (pts: LonLat[]) => pts.some((p) => { const [x, y] = xy(p); return x > -50 && y > -50 && x < f.width + 50 && y < f.height + 50; });
  const lakes = water.lakes.flatMap((l) => l.rings as LonLat[][]).filter(near).map((r) => thin(path(r, true), 1)).join('');
  const rivers = water.rivers.flatMap((r) => r.lines as LonLat[][]).filter(near).map((l) => path(l)).join('');
  const clipped = geoConicConformal()
    .rotate([-f.rotate, 0])
    .parallels(f.parallels)
    .scale(proj.scale())
    .translate(proj.translate())
    .clipExtent([[-4, -4], [f.width + 4, f.height + 4]]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const land = thin(geoPath(clipped).digits(1)(feature(land50 as any, (land50 as any).objects.land) as any) ?? '');
  const out = { width: f.width, height: f.height, land, lakes, rivers, xy, path };
  cache.set(frameId, out);
  return out;
}
