// Geography for the Grade 6 democracy map (outcome 0LESAYIP8UKL5ECn4gOmiw K1.4, K1.8, K1.11):
// mountainous Greece split into small city-states, and the small size of Athens beside the huge
// Roman Republic. Coordinates are [longitude, latitude]. Outlines are deliberately rough: they are
// clipped to the land when drawn, and the map says so.
//
// Sources: Attica's area of about 2,500 km² (M. H. Hansen, Polis: An Introduction to the Ancient
// Greek City-State, Oxford 2006); City of Calgary land area 820.6 km² (Statistics Canada, 2021
// Census); named peaks sit at their summits, rounded to 0.01°; the Republic in 44 BCE is the Grade 5
// empire map's outline (ancient-map.ts).
import { EMPIRES, makeFrame, type LonLat } from './ancient-map.ts';

export const GREECE_FRAME = makeFrame(19.6, 28.4, 35.6, 41.4, 720);
export const MED_FRAME = makeFrame(-11, 42, 28, 53, 720);

export const ATTICA: LonLat[] = [
  [23.33, 38.06], [23.42, 38.2], [23.7, 38.26], [23.98, 38.34], [24.12, 38.22], [24.06, 37.9],
  [24.03, 37.62], [23.86, 37.75], [23.68, 37.9], [23.55, 37.96], [23.38, 37.97],
];

export const MOUNTAINS: { name: string; at: LonLat }[] = [
  { name: 'Olympus', at: [22.36, 40.09] },
  { name: 'Pindus', at: [21.2, 39.6] },
  { name: 'Parnassus', at: [22.62, 38.54] },
  { name: 'Taygetus', at: [22.36, 36.95] },
  { name: 'Kyllini', at: [22.4, 37.94] },
  { name: '', at: [21.6, 38.9] },
  { name: '', at: [21.9, 37.55] },
  { name: '', at: [23.4, 38.15] },
];

export const CITY_STATES: { name: string; at: LonLat; home?: boolean; dx?: number; dy?: number }[] = [
  { name: 'Athens', at: [23.73, 37.98], home: true, dx: 14, dy: 22 },
  { name: 'Sparta', at: [22.43, 37.07], dx: -12, dy: 22 },
  { name: 'Corinth', at: [22.88, 37.91], dx: -8, dy: -12 },
  { name: 'Thebes', at: [23.32, 38.32], dx: 0, dy: -12 },
  { name: 'Argos', at: [22.73, 37.63], dx: -26, dy: 6 },
];

export const ROME: LonLat = [12.49, 41.89];
export const REPUBLIC_44BCE: LonLat[] = EMPIRES.find((e) => e.id === 'rome')!.stages.find((s) => s.label === '44 BCE')!.area;

export const ATTICA_KM2 = 2500;
export const CALGARY_KM2 = 820.6;

/** Kilometres per degree of longitude at a latitude, on a round Earth. */
export const kmPerDegLon = (lat: number) => 111.32 * Math.cos((lat * Math.PI) / 180);
