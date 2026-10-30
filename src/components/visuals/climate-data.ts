// Climate normals for the climate graph (SCI5-OI3-GQ1-LO1, K1.3, K1.5, S1.3, S1.4, S1.6):
// average monthly temperature (°C) and precipitation (mm) over about 30 years, rounded.
// Sources: Environment and Climate Change Canada climate normals; World Meteorological
// Organization normals for Singapore and Cairo.

export type Zone = 'continental' | 'temperate' | 'polar' | 'tropical' | 'dry';

export interface Place {
  id: string;
  name: string;
  where: string;
  zone: Zone;
  temp: number[];
  precip: number[];
}

export const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const PLACES: Place[] = [
  { id: 'edmonton', name: 'Edmonton', where: 'Alberta', zone: 'continental', temp: [-10, -9, -4, 5, 11, 15, 17, 16, 11, 4, -4, -9], precip: [21, 12, 16, 25, 46, 76, 94, 62, 39, 19, 17, 16] },
  { id: 'calgary', name: 'Calgary', where: 'Alberta', zone: 'continental', temp: [-7, -5, -2, 4, 9, 14, 16, 16, 11, 5, -2, -7], precip: [10, 10, 18, 26, 57, 94, 66, 56, 46, 16, 13, 11] },
  { id: 'vancouver', name: 'Vancouver', where: 'British Columbia', zone: 'temperate', temp: [4, 5, 7, 9, 13, 16, 18, 18, 15, 10, 6, 4], precip: [168, 105, 113, 88, 65, 54, 36, 37, 51, 120, 188, 161] },
  { id: 'toronto', name: 'Toronto', where: 'Ontario', zone: 'continental', temp: [-6, -5, 0, 7, 13, 19, 22, 21, 16, 10, 4, -2], precip: [61, 51, 52, 69, 76, 77, 75, 71, 74, 63, 74, 62] },
  { id: 'iqaluit', name: 'Iqaluit', where: 'Nunavut', zone: 'polar', temp: [-28, -28, -24, -15, -4, 4, 8, 7, 2, -5, -13, -22], precip: [21, 17, 22, 28, 27, 34, 57, 67, 50, 37, 27, 18] },
  { id: 'singapore', name: 'Singapore', where: 'Southeast Asia', zone: 'tropical', temp: [27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 27, 27], precip: [221, 105, 154, 164, 159, 136, 154, 165, 143, 155, 256, 287] },
  { id: 'cairo', name: 'Cairo', where: 'Egypt', zone: 'dry', temp: [14, 15, 18, 21, 25, 27, 28, 28, 26, 24, 19, 16], precip: [5, 4, 3, 1, 0, 0, 0, 0, 0, 1, 3, 6] },
];

export const ZONE_LABEL: Record<Zone, string> = {
  continental: 'Continental',
  temperate: 'Temperate',
  polar: 'Polar',
  tropical: 'Tropical',
  dry: 'Dry',
};

export const total = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
