// Places and rivers for the latitude/longitude map. Coordinates are in degrees
// (north and east positive). Site coordinates are for well-known archaeological sites;
// river courses are simplified to a few points each, which is accurate enough at
// world-map scale.

export interface Site {
  id: string;
  name: string;
  place: string;
  lat: number;
  lon: number;
  feature: string;
  era: string;
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
    feature: 'Nile River',
    era: 'from about 3100 BCE',
    note: 'The Nile flooded every year and left rich, dark soil on its banks, so farmers could grow wheat and barley in the middle of a desert.',
  },
  {
    id: 'mesopotamia',
    name: 'Mesopotamia',
    place: 'Babylon',
    lat: 32.54,
    lon: 44.42,
    feature: 'Tigris and Euphrates rivers',
    era: 'cities from about 3500 BCE',
    note: '“Mesopotamia” means “land between the rivers.” Farmers dug canals to bring river water to their fields (irrigation).',
  },
  {
    id: 'indus',
    name: 'Indus Valley (ancient India)',
    place: 'Mohenjo-daro',
    lat: 27.33,
    lon: 68.14,
    feature: 'Indus River',
    era: 'from about 2600 BCE',
    note: 'Its cities had straight streets, brick houses and covered drains. The site is in present-day Pakistan.',
  },
  {
    id: 'china',
    name: 'Ancient China (Shang)',
    place: 'Anyang',
    lat: 36.1,
    lon: 114.35,
    feature: 'Yellow River (Huang He)',
    era: 'from about 1600 BCE',
    note: 'The Yellow River carries yellow silt that makes fertile farmland, but its floods could also be dangerous.',
  },
  {
    id: 'greece',
    name: 'Ancient Greece',
    place: 'Athens',
    lat: 37.97,
    lon: 23.73,
    feature: 'Aegean Sea coast',
    era: 'city-states from about 800 BCE',
    note: 'Greece is mountainous with little flat farmland, so Greeks used the sea for fishing, travel and trade.',
  },
  {
    id: 'rome',
    name: 'Ancient Rome',
    place: 'Rome',
    lat: 41.9,
    lon: 12.48,
    feature: 'Tiber River, near the Mediterranean Sea',
    era: 'from about 750 BCE',
    note: 'Rome grew beside the Tiber River. Romans later built aqueducts to carry fresh water into the city.',
  },
  {
    id: 'petra',
    name: 'Nabataean Arabs',
    place: 'Petra',
    lat: 30.33,
    lon: 35.44,
    feature: 'desert trade routes',
    era: 'from about 300 BCE',
    note: 'Petra had no big river. The Nabataeans built channels and cisterns to catch rare rainwater, and grew rich from caravan trade.',
  },
  {
    id: 'edmonton',
    name: 'You are here',
    place: 'Edmonton, Alberta',
    lat: 53.55,
    lon: -113.49,
    feature: 'North Saskatchewan River',
    era: 'today',
    note: 'Edmonton is much farther north than any of these ancient civilizations, so it has a shorter growing season.',
    home: true,
  },
];

/** [lon, lat] points, source to mouth. */
export const RIVERS: { name: string; points: [number, number][] }[] = [
  {
    name: 'Nile',
    points: [[33.2, 0.4], [32.5, 3.6], [31.6, 9.5], [32.5, 15.6], [33.9, 18.5], [32.2, 20.4], [31.4, 21.9], [32.9, 24.1], [32.6, 25.7], [31.2, 27.4], [31.2, 30.0], [30.4, 31.4]],
  },
  {
    name: 'Tigris',
    points: [[39.6, 38.4], [41.2, 37.4], [43.1, 36.3], [44.4, 33.3], [46.2, 31.9], [47.4, 30.9], [48.5, 29.9]],
  },
  {
    name: 'Euphrates',
    points: [[39.0, 39.5], [38.3, 37.8], [38.1, 36.0], [40.1, 35.3], [42.0, 34.4], [44.4, 32.5], [45.8, 31.3], [47.4, 30.9]],
  },
  {
    name: 'Indus',
    points: [[81.0, 31.0], [77.6, 34.2], [74.5, 35.6], [72.5, 33.9], [71.3, 32.0], [70.7, 29.5], [68.2, 27.3], [68.3, 25.4], [67.4, 24.0]],
  },
  {
    name: 'Yellow River',
    points: [[96.0, 35.0], [101.5, 36.0], [103.8, 36.1], [106.3, 38.5], [109.5, 40.6], [111.0, 40.3], [110.5, 36.5], [110.3, 34.6], [113.7, 34.8], [116.0, 35.8], [118.8, 37.7]],
  },
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
