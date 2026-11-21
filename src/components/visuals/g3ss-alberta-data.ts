// What the Grade 3 Alberta map (g3ss-alberta-map) can show: natural regions, treaty areas, Métis
// Settlements, the borders and named places. Each lesson picks the items it needs and writes their
// text in its YAML; names, icons and positions live here.
//
// Sources:
// - Shapes: Government of Alberta open data (see g3ss-alberta-shapes.ts).
// - Natural regions: Natural Regions Committee, "Natural Regions and Subregions of Alberta" (2006).
// - Treaty dates: Crown-Indigenous Relations Canada, "Historic treaties in Alberta".
// - Places: Parks Canada, Alberta Parks, the Alberta Register of Historic Places (hermis.alberta.ca)
//   and UNESCO's World Heritage List. Positions are rounded to a tenth of a degree.
import { project } from './g3ss-alberta-shapes.ts';

export type Layer = 'regions' | 'border' | 'treaties' | 'metis' | 'places';

export interface MapItem {
  id: string;
  name: string;
  icon: string;
  /** Where the icon or label sits, in map units. */
  at: [number, number];
  /** Moves the icon off a crowded spot; a thin line joins it to the real place. */
  nudge?: [number, number];
}

const pt = (lat: number, lon: number) => project(lat, lon).map((v) => Math.round(v * 10) / 10) as [number, number];

export const REGIONS: MapItem[] = [
  { id: 'rocky', name: 'Rocky Mountains', icon: '🏔️', at: pt(51.3, -115.9) },
  { id: 'foothills', name: 'Foothills', icon: '⛰️', at: pt(53.9, -117.6) },
  { id: 'grassland', name: 'Grassland', icon: '🌾', at: pt(50.3, -111.6) },
  { id: 'parkland', name: 'Parkland', icon: '🌳', at: pt(52.6, -112.4) },
  { id: 'boreal', name: 'Boreal Forest', icon: '🌲', at: pt(57.0, -114.5) },
  { id: 'shield', name: 'Canadian Shield', icon: '🪨', at: pt(59.5, -110.8) },
];

export const TREATIES: MapItem[] = [
  { id: 't8', name: 'Treaty 8 (1899)', icon: '8', at: pt(57.6, -115.2) },
  { id: 't10', name: 'Treaty 10 (1906)', icon: '10', at: pt(55.0, -110.6) },
  { id: 't6', name: 'Treaty 6 (1876)', icon: '6', at: pt(53.2, -113.3) },
  { id: 't7', name: 'Treaty 7 (1877)', icon: '7', at: pt(50.5, -113.3) },
  { id: 't4', name: 'Treaty 4 (1874)', icon: '4', at: pt(49.85, -110.45) },
];

export const SIDES_INFO: MapItem[] = [
  { id: 'south', name: 'South border', icon: '⬇️', at: [208, 446.5] },
  { id: 'east', name: 'East border', icon: '➡️', at: [256, 230] },
  { id: 'north', name: 'North border', icon: '⬆️', at: [140, 12] },
  { id: 'west', name: 'West border', icon: '⬅️', at: [24, 135] },
  { id: 'rockies', name: 'Mountain border', icon: '🏔️', at: [86, 320] },
];

export const METIS: MapItem[] = [
  { id: 'paddle-prairie', name: 'Paddle Prairie', icon: '🟣', at: pt(57.9, -117.4) },
  { id: 'peavine', name: 'Peavine', icon: '🟣', at: pt(55.9, -116.3) },
  { id: 'gift-lake', name: 'Gift Lake', icon: '🟣', at: pt(55.85, -115.6) },
  { id: 'east-prairie', name: 'East Prairie', icon: '🟣', at: pt(55.2, -116.2) },
  { id: 'buffalo-lake', name: 'Buffalo Lake', icon: '🟣', at: pt(54.5, -112.4) },
  { id: 'kikino', name: 'Kikino', icon: '🟣', at: pt(54.4, -112.0) },
  { id: 'fishing-lake', name: 'Fishing Lake', icon: '🟣', at: pt(54.0, -110.2) },
  { id: 'elizabeth', name: 'Elizabeth', icon: '🟣', at: pt(54.15, -110.1) },
];

/** Named places, shown as icons. A lesson lists the ones it needs. */
export const PLACES: MapItem[] = [
  // Cities and towns
  { id: 'edmonton', name: 'Edmonton', icon: '⭐', at: pt(53.5, -113.5) },
  { id: 'calgary', name: 'Calgary', icon: '🏙️', at: pt(51.0, -114.1) },
  { id: 'lethbridge', name: 'Lethbridge', icon: '🏙️', at: pt(49.7, -112.8) },
  { id: 'red-deer', name: 'Red Deer', icon: '🏙️', at: pt(52.3, -113.8) },
  { id: 'grande-prairie', name: 'Grande Prairie', icon: '🏙️', at: pt(55.2, -118.8) },
  { id: 'st-albert', name: 'St. Albert', icon: '⛪', at: pt(53.6, -113.6) },
  { id: 'bonnyville', name: 'Bonnyville', icon: '⚜️', at: pt(54.3, -110.7) },
  { id: 'st-paul', name: 'St. Paul', icon: '⚜️', at: pt(54.0, -111.3) },
  { id: 'falher', name: 'Falher', icon: '⚜️', at: pt(55.7, -117.2) },
  // Landmarks and historic sites
  { id: 'head-smashed-in', name: 'Head-Smashed-In Buffalo Jump', icon: '🦬', at: pt(49.7, -113.65), nudge: [10, -8] },
  { id: 'writing-on-stone', name: 'Writing-on-Stone (Áísínai’pi)', icon: '🪨', at: pt(49.1, -111.6) },
  { id: 'dinosaur-park', name: 'Dinosaur Provincial Park', icon: '🦕', at: pt(50.8, -111.5) },
  { id: 'frank-slide', name: 'Frank Slide', icon: '⛰️', at: pt(49.6, -114.4), nudge: [-4, 20] },
  { id: 'legislature', name: 'Alberta Legislature Building', icon: '🏛️', at: pt(53.5, -113.5) },
  { id: 'rocky-mountain-house', name: 'Rocky Mountain House', icon: '🛶', at: pt(52.4, -114.9) },
  { id: 'lac-ste-anne', name: 'Lac Ste. Anne', icon: '💧', at: pt(53.7, -114.4) },
  { id: 'lacombe-chapel', name: 'Father Lacombe Chapel', icon: '⛪', at: pt(53.6, -113.6), nudge: [-20, -16] },
  { id: 'cave-basin', name: 'Cave and Basin', icon: '♨️', at: pt(51.2, -115.6) },
  // Natural resources
  { id: 'oil-sands', name: 'Oil sands', icon: '🛢️', at: pt(57.0, -111.6) },
  { id: 'leduc', name: 'Leduc oil field', icon: '🛢️', at: pt(53.3, -113.6) },
  { id: 'gas-medicine-hat', name: 'Medicine Hat gas', icon: '🔥', at: pt(50.0, -110.7) },
  { id: 'coal-crowsnest', name: 'Crowsnest Pass coal', icon: '⚫', at: pt(49.6, -114.5) },
  { id: 'coal-drumheller', name: 'Drumheller coal', icon: '⚫', at: pt(51.5, -112.7) },
  { id: 'wind-pincher', name: 'Pincher Creek wind', icon: '💨', at: pt(49.5, -114.0) },
  { id: 'sun-south', name: 'Sunny south', icon: '☀️', at: pt(50.2, -112.6) },
  { id: 'water-bow', name: 'Bow River dams', icon: '💧', at: pt(51.2, -114.8) },
  // Parks
  { id: 'banff', name: 'Banff National Park', icon: '🏞️', at: pt(51.5, -116.0) },
  { id: 'jasper', name: 'Jasper National Park', icon: '🏞️', at: pt(52.9, -118.1) },
  { id: 'waterton', name: 'Waterton Lakes National Park', icon: '🏞️', at: pt(49.1, -113.9) },
  { id: 'elk-island', name: 'Elk Island National Park', icon: '🦬', at: pt(53.6, -112.9) },
  { id: 'wood-buffalo', name: 'Wood Buffalo National Park', icon: '🦬', at: pt(59.0, -112.8) },
];

export const CATALOGUE: Record<Layer, MapItem[]> = { regions: REGIONS, border: SIDES_INFO, treaties: TREATIES, metis: METIS, places: PLACES };

/** The catalogue entries for a lesson's items, in the lesson's order. Throws on an unknown id, so a typo fails the build. */
export function pickItems(layer: Layer, ids: string[]): MapItem[] {
  return ids.map((id) => {
    const found = CATALOGUE[layer].find((m) => m.id === id);
    if (!found) throw new Error(`g3ss-alberta-map: no ${layer} item "${id}"`);
    return found;
  });
}

/** The next target in find mode: the first item not yet found, or null when all are found. */
export function nextTarget(order: string[], found: Set<string>): string | null {
  return order.find((id) => !found.has(id)) ?? null;
}
