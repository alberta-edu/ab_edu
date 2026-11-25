// Grade 3 science: a simple map of Alberta for g3-plays scenes. Longitude and latitude become SVG
// coordinates, so towns land in the right place. The outline is simplified: straight borders on
// the north, east and south, and the Rocky Mountain border in the southwest.

const X0 = 30;
const Y0 = 12;
const KX = 17; // px per degree of longitude
const KY = 25; // px per degree of latitude

export const albertaXY = (lat: number, lon: number): [number, number] => [X0 + (lon + 120) * KX, Y0 + (60 - lat) * KY];

const border: [number, number][] = [
  [60, -120], [60, -110], [49, -110], [49, -114.06], [49.6, -114.7], [50.4, -114.8], [51.2, -115.8],
  [51.8, -116.6], [52.5, -117.8], [53.2, -118.6], [53.8, -120], [60, -120],
];

export const albertaPath = `M${border.map(([lat, lon]) => albertaXY(lat, lon).map((n) => Math.round(n)).join(',')).join(' L')} Z`;

/** Places named in Grade 3 science (lat, lon). */
export const places = {
  edmonton: [53.55, -113.49],
  calgary: [51.05, -114.07],
  drumheller: [51.46, -112.71],
  dinosaurPark: [50.76, -111.5],
  grandeCache: [53.89, -119.13],
  fortMcMurray: [56.73, -111.38],
  wembley: [55.15, -119.13],
  crowsnest: [49.63, -114.5],
} as const satisfies Record<string, readonly [number, number]>;

export const at = (p: keyof typeof places) => albertaXY(places[p][0], places[p][1]);
