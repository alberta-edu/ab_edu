// Climate normals for the climate graph (SCI5-OI3-GQ1-LO1, K1.3, K1.5, S1.3, S1.4, S1.6): average
// monthly temperature (°C) and precipitation (mm) for 1991-2020, rounded to whole numbers.
// Canadian stations: Environment and Climate Change Canada, Canadian Climate Normals 1991-2020
// (Edmonton City Centre 3012208, Calgary Airport 3031092, Vancouver Airport 1108395, Toronto
// Pearson 6158731, Iqaluit 2402592). Singapore: National Environment Agency. Cairo Airport:
// World Meteorological Organization normals, as published by NOAA.

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
  { id: 'edmonton', name: 'Edmonton', where: 'Alberta', zone: 'continental', temp: [-10, -8, -3, 5, 12, 16, 18, 17, 12, 5, -4, -9], precip: [20, 12, 17, 29, 44, 70, 83, 61, 39, 21, 18, 12] },
  { id: 'calgary', name: 'Calgary', where: 'Alberta', zone: 'continental', temp: [-8, -6, -2, 5, 10, 14, 17, 16, 12, 5, -2, -6], precip: [10, 12, 18, 30, 61, 113, 66, 54, 37, 17, 16, 13] },
  { id: 'vancouver', name: 'Vancouver', where: 'British Columbia', zone: 'temperate', temp: [4, 5, 7, 9, 13, 16, 18, 18, 15, 10, 6, 4], precip: [174, 91, 106, 86, 59, 51, 34, 36, 52, 124, 175, 172] },
  { id: 'toronto', name: 'Toronto', where: 'Ontario', zone: 'continental', temp: [-5, -4, 1, 7, 14, 19, 22, 21, 17, 10, 4, -2], precip: [62, 50, 51, 77, 78, 81, 74, 69, 69, 67, 72, 59] },
  { id: 'iqaluit', name: 'Iqaluit', where: 'Nunavut', zone: 'polar', temp: [-26, -27, -22, -14, -3, 4, 8, 8, 3, -3, -11, -19], precip: [16, 14, 21, 23, 21, 49, 40, 62, 51, 30, 19, 16] },
  { id: 'singapore', name: 'Singapore', where: 'Southeast Asia', zone: 'tropical', temp: [27, 27, 28, 28, 29, 29, 28, 28, 28, 28, 27, 27], precip: [222, 105, 152, 164, 164, 135, 147, 147, 125, 168, 252, 332] },
  { id: 'cairo', name: 'Cairo', where: 'Egypt', zone: 'dry', temp: [14, 16, 18, 22, 26, 28, 29, 29, 28, 25, 20, 16], precip: [5, 4, 6, 1, 0, 0, 0, 0, 0, 1, 4, 3] },
];

export const ZONE_LABEL: Record<Zone, string> = {
  continental: 'Continental',
  temperate: 'Temperate',
  polar: 'Polar',
  tropical: 'Tropical',
  dry: 'Dry',
};

export const total = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
