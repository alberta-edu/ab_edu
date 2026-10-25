// World land outlines for the 3D globe, as compact GeoJSON (Natural Earth 1:110m, public domain).
// Built once at build time; the globe fetches it only when it scrolls into view.
import type { APIRoute } from 'astro';
import { feature } from 'topojson-client';
import land110 from 'world-atlas/land-110m.json';

type Coords = number | Coords[];
const round = (c: Coords): Coords => (typeof c === 'number' ? Math.round(c * 10) / 10 : c.map(round));

export const GET: APIRoute = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geo = feature(land110 as any, (land110 as any).objects.land) as any;
  for (const f of geo.features) f.geometry.coordinates = round(f.geometry.coordinates);
  return new Response(JSON.stringify(geo), { headers: { 'Content-Type': 'application/json' } });
};
