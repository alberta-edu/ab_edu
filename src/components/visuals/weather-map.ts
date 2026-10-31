// A sample weather map of Alberta (SCI5-OI3-GQ1-LO1, S2.4, S2.5, K2.2). The readings are made
// up for the activity; the map outline and the town positions are real.

export type Sky = 'sun' | 'cloud' | 'rain' | 'snow';

export const SKY: Record<Sky, { icon: string; label: string }> = {
  sun: { icon: '☀️', label: 'Sunny' },
  cloud: { icon: '☁️', label: 'Cloudy' },
  rain: { icon: '🌧️', label: 'Rain' },
  snow: { icon: '❄️', label: 'Snow' },
};

export interface Town {
  id: string;
  name: string;
  lat: number;
  lon: number;
  sky: Sky;
  temp: number;
}

export const TOWNS: Town[] = [
  { id: 'fm', name: 'Fort McMurray', lat: 56.7, lon: -111.4, sky: 'cloud', temp: 13 },
  { id: 'gp', name: 'Grande Prairie', lat: 55.2, lon: -118.8, sky: 'rain', temp: 11 },
  { id: 'jasper', name: 'Jasper', lat: 52.9, lon: -118.1, sky: 'snow', temp: 1 },
  { id: 'edmonton', name: 'Edmonton', lat: 53.5, lon: -113.5, sky: 'rain', temp: 12 },
  { id: 'calgary', name: 'Calgary', lat: 51.0, lon: -114.1, sky: 'cloud', temp: 15 },
  { id: 'lethbridge', name: 'Lethbridge', lat: 49.7, lon: -112.8, sky: 'sun', temp: 19 },
];

/** Alberta's border as [lat, lon]. The straight sides are real; the Rockies side is simplified. */
const BORDER: [number, number][] = [
  [60, -120], [60, -110], [49, -110], [49, -114.06], [49.6, -114.7], [50.5, -115.1], [51, -115.6], [51.4, -116.3], [52, -117], [52.6, -118], [53, -118.6], [53.8, -120],
];

/** Projects a position onto the map's 300 × 450 canvas. East–west is squeezed to suit Alberta's latitude. */
export const project = (lat: number, lon: number): [number, number] => [40 + (lon + 120) * 21.7, 16 + (60 - lat) * 38.5];

export const borderPath = () => `M${BORDER.map(([a, o]) => project(a, o).map((v) => v.toFixed(1)).join(',')).join(' L')} Z`;

/** How many towns have the right symbol. */
export function countCorrect(placed: Record<string, Sky | undefined>): number {
  return TOWNS.filter((t) => placed[t.id] === t.sky).length;
}
