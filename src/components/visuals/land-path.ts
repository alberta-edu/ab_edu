// Build-time only: draws the land for one map frame, so the browser gets a plain SVG path and
// no map library. Keep this out of client scripts, because it pulls in the whole world map.
import { feature } from 'topojson-client';
import { geoEquirectangular, geoPath } from 'd3-geo';
import land110 from 'world-atlas/land-110m.json';
import type { MapFrame } from './ancient-map.ts';

export function landPath(f: MapFrame): string {
  const projection = geoEquirectangular()
    .scale(f.scale * (180 / Math.PI))
    .translate([-f.lon0 * f.scale, f.latN * f.scale])
    .clipExtent([[-4, -4], [f.width + 4, f.height + 4]]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return geoPath(projection).digits(1)(feature(land110 as any, (land110 as any).objects.land) as any) ?? '';
}
