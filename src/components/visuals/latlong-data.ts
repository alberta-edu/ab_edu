// Places and rivers for the globe and the flat map. Coordinates are in degrees (north and
// east positive). The civilizations are the curriculum's own examples (Grade 5 Social
// Studies: Egypt, Greece, Rome, China, India, Arab civilizations), located at well-known
// archaeological sites. Notes use only ideas the outcome lists: water, fertile soil and
// climate in river valleys; coastlines for trade and travel; infrastructure to meet needs.

export interface Site {
  id: string;
  name: string;
  place: string;
  lat: number;
  lon: number;
  feature: string;
  note: string;
  home?: boolean;
}

export const SITES: Site[] = [
  {
    id: 'egypt',
    name: 'Ancient Egypt',
    place: 'Memphis',
    lat: 29.85,
    lon: 31.25,
    feature: 'Nile River valley',
    note: 'The Nile River gave water and fertile soil for farming.',
  },
  {
    id: 'india',
    name: 'Ancient India (Indus Valley)',
    place: 'Mohenjo-daro',
    lat: 27.33,
    lon: 68.14,
    feature: 'Indus River valley',
    note: 'The Indus River gave water and fertile soil for farming. This site is in present-day Pakistan.',
  },
  {
    id: 'china',
    name: 'Ancient China',
    place: 'Anyang',
    lat: 36.1,
    lon: 114.35,
    feature: 'Yellow River valley',
    note: 'The Yellow River gave water and fertile soil for farming.',
  },
  {
    id: 'greece',
    name: 'Ancient Greece',
    place: 'Athens',
    lat: 37.97,
    lon: 23.73,
    feature: 'Coastline on the Aegean Sea',
    note: 'The sea and its bays supported travel and trade.',
  },
  {
    id: 'rome',
    name: 'Ancient Rome',
    place: 'Rome',
    lat: 41.9,
    lon: 12.48,
    feature: 'Tiber River, near the Mediterranean coast',
    note: 'Romans built aqueducts to carry fresh water into their city.',
  },
  {
    id: 'arab',
    name: 'Arab civilization (Nabataeans)',
    place: 'Petra',
    lat: 30.33,
    lon: 35.44,
    feature: 'Desert, on trade routes',
    note: 'With no large river, people built channels and storage tanks to collect rainwater.',
  },
  {
    id: 'home',
    name: 'You are here',
    place: 'Edmonton, Alberta',
    lat: 53.55,
    lon: -113.49,
    feature: 'Alberta',
    note: 'Use your own home to practise reading latitude and longitude.',
    home: true,
  },
];

/** [lon, lat] points, source to mouth, simplified for world-map scale. */
export const RIVERS: { name: string; points: [number, number][] }[] = [
  {
    name: 'Nile',
    points: [[33.2, 0.4], [32.5, 3.6], [31.6, 9.5], [32.5, 15.6], [33.9, 18.5], [32.2, 20.4], [31.4, 21.9], [32.9, 24.1], [32.6, 25.7], [31.2, 27.4], [31.2, 30.0], [30.4, 31.4]],
  },
  {
    name: 'Indus',
    points: [[81.0, 31.0], [77.6, 34.2], [74.5, 35.6], [72.5, 33.9], [71.3, 32.0], [70.7, 29.5], [68.2, 27.3], [68.3, 25.4], [67.4, 24.0]],
  },
  {
    name: 'Yellow River',
    points: [[96.0, 35.0], [101.5, 36.0], [103.8, 36.1], [106.3, 38.5], [109.5, 40.6], [111.0, 40.3], [110.5, 36.5], [110.3, 34.6], [113.7, 34.8], [116.0, 35.8], [118.8, 37.7]],
  },
  { name: 'Tiber', points: [[11.9, 43.8], [12.4, 43.0], [12.5, 42.3], [12.48, 41.9], [12.25, 41.74]] },
];

/** Equirectangular projection onto a 960 × 480 canvas: 1° = 8/3 units. */
export const MAP_W = 960;
export const MAP_H = 480;
export const K = MAP_W / 360;
export const project = (lon: number, lat: number): [number, number] => [(lon + 180) * K, (90 - lat) * K];
export const unproject = (x: number, y: number): [number, number] => [x / K - 180, 90 - y / K];

export function formatCoord(lat: number, lon: number, digits = 0): string {
  const f = (v: number) => Math.abs(v).toFixed(digits);
  const ns = Math.abs(lat) < 0.5 / 10 ** digits ? '0°' : `${f(lat)}°${lat > 0 ? 'N' : 'S'}`;
  const ew = Math.abs(lon) < 0.5 / 10 ** digits ? '0°' : `${f(lon)}°${lon > 0 ? 'E' : 'W'}`;
  return `${ns}, ${ew}`;
}

export const VIEWS = {
  // 80°N to 60°S: the far polar areas are left out so the map is larger on small screens.
  world: { label: 'World', box: [0, 10 * K, MAP_W, 140 * K] as [number, number, number, number] },
  ancient: {
    label: 'Zoom: ancient world',
    // longitude -5° to 125°, latitude 55°N to 0°
    box: [(-5 + 180) * K, (90 - 55) * K, 130 * K, 55 * K] as [number, number, number, number],
  },
};
