// How each province and territory makes most of its electricity (SCI5-OI2-GQ2-LO1, S1.3,
// K1.6). Main sources only, in plain words; based on Canada Energy Regulator provincial
// profiles. Tiles are a simplified map: each region is a box in roughly the right place.

export type Main = 'hydro' | 'fossil' | 'nuclear' | 'wind' | 'mix';

export const MAIN_LABEL: Record<Main, string> = {
  hydro: 'Mostly water (hydro)',
  fossil: 'Mostly fossil fuels',
  nuclear: 'Mostly nuclear',
  wind: 'Mostly wind',
  mix: 'A mix',
};

/** Whether a main source is renewable, for the legend. A mix has no single answer. */
export const MAIN_RENEWABLE: Record<Main, boolean | null> = { hydro: true, fossil: false, nuclear: false, wind: true, mix: null };

export interface Region {
  id: string;
  name: string;
  main: Main;
  sources: string;
  /** Tile position on a 640 × 360 map. */
  x: number;
  y: number;
  w: number;
  h: number;
}

export const REGIONS: Region[] = [
  { id: 'YT', name: 'Yukon', main: 'hydro', sources: 'Mostly water (hydro), with some diesel, a fossil fuel.', x: 20, y: 30, w: 82, h: 112 },
  { id: 'NT', name: 'Northwest Territories', main: 'mix', sources: 'A mix of water (hydro) and diesel, a fossil fuel. Many small communities use diesel generators.', x: 106, y: 30, w: 128, h: 112 },
  { id: 'NU', name: 'Nunavut', main: 'fossil', sources: 'Almost all diesel, a fossil fuel brought in by ship.', x: 238, y: 8, w: 178, h: 134 },
  { id: 'BC', name: 'British Columbia', main: 'hydro', sources: 'Mostly water (hydro) from dams on large rivers.', x: 20, y: 146, w: 104, h: 128 },
  { id: 'AB', name: 'Alberta', main: 'fossil', sources: 'Mostly fossil fuels (natural gas), plus wind, water (hydro) and biomass.', x: 128, y: 146, w: 70, h: 128 },
  { id: 'SK', name: 'Saskatchewan', main: 'fossil', sources: 'Mostly fossil fuels (natural gas and coal), plus water (hydro) and wind.', x: 202, y: 146, w: 70, h: 128 },
  { id: 'MB', name: 'Manitoba', main: 'hydro', sources: 'Almost all water (hydro) from large rivers.', x: 276, y: 146, w: 76, h: 128 },
  { id: 'ON', name: 'Ontario', main: 'nuclear', sources: 'Mostly nuclear, plus water (hydro), natural gas and wind.', x: 356, y: 166, w: 98, h: 150 },
  { id: 'QC', name: 'Quebec', main: 'hydro', sources: 'Almost all water (hydro).', x: 458, y: 110, w: 104, h: 160 },
  { id: 'NL', name: 'Newfoundland and Labrador', main: 'hydro', sources: 'Almost all water (hydro).', x: 566, y: 92, w: 62, h: 104 },
  { id: 'NB', name: 'New Brunswick', main: 'mix', sources: 'A mix of nuclear, water (hydro) and fossil fuels.', x: 498, y: 274, w: 46, h: 44 },
  { id: 'PE', name: 'Prince Edward Island', main: 'wind', sources: 'Wind on the island, plus electricity bought from New Brunswick.', x: 548, y: 274, w: 40, h: 22 },
  { id: 'NS', name: 'Nova Scotia', main: 'fossil', sources: 'Mostly fossil fuels (coal and natural gas), plus wind.', x: 548, y: 300, w: 80, h: 36 },
];
