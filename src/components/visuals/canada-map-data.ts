// Data for the Grade 4 map of eastern North America: explorers' voyages, the first colonies, French
// settlements, fur-trade posts and the borders that changed from 1713 to 1867. Coordinates are
// [longitude, latitude], north and east positive. Borders are deliberately rough. They are clipped
// to the land when drawn and labelled "approximate", because many were never surveyed at the time.
//
// Sources: Library and Archives Canada and the Canadian Encyclopedia for dates; the texts of the
// Royal Proclamation (1763), the Quebec Act (1774), the Treaty of Paris (1783), the Constitution
// Act, 1791, the Act of Union (1840) and the British North America Act (1867) for the borders;
// Parks Canada and the U.S. National Park Service for Île Sainte-Croix, Port-Royal and the posts.

export type LonLat = [number, number];

/** Who held or claimed an area. Colours come from the map's CSS. */
export type Owner = 'fr' | 'br' | 'hbc' | 'fn' | 'us' | 'ca';

export const OWNER_LABEL: Record<Owner, string> = {
  fr: 'French',
  br: 'British',
  hbc: 'Hudson’s Bay Company (British)',
  fn: 'Kept for First Nations',
  us: 'United States',
  ca: 'Dominion of Canada',
};

// ---------------------------------------------------------------- shared border lines

/** The Hudson Bay watershed, roughly the south edge of Rupert's Land, from west to east. */
const HBC_SOUTH: LonLat[] = [
  [-98.5, 45.9], [-96.6, 45.8], [-95.6, 47.0], [-95.0, 47.6], [-94.0, 47.9], [-92.5, 47.8], [-91.0, 47.9], [-90.0, 48.2],
  [-89.5, 48.7], [-88.5, 49.6], [-87.0, 49.8], [-85.5, 49.4], [-84.0, 48.9], [-82.5, 48.4], [-81.0, 48.3], [-79.5, 48.6],
  [-77.5, 48.3], [-76.0, 48.2], [-74.5, 48.6], [-73.8, 49.5], [-73.0, 50.8], [-71.5, 51.2], [-70.0, 51.5], [-68.8, 52.5],
  [-67.0, 53.0], [-65.5, 54.2], [-64.0, 54.6],
];
/** The border through the Great Lakes, from Lake of the Woods east to the St. Lawrence at 45°N. */
const LAKES_BORDER: LonLat[] = [
  [-95.15, 49.0], [-93.0, 48.62], [-91.5, 48.1], [-90.0, 48.1], [-89.6, 48.0], [-88.4, 48.3], [-86.5, 47.6], [-85.0, 46.8],
  [-84.6, 46.5], [-84.1, 46.2], [-83.6, 46.1], [-82.4, 45.3], [-82.2, 44.0], [-82.42, 43.0], [-82.5, 42.6], [-82.95, 42.35],
  [-83.1, 42.05], [-82.7, 41.68], [-81.3, 42.2], [-80.0, 42.4], [-78.95, 42.85], [-79.06, 43.27], [-78.0, 43.6], [-76.8, 43.6],
  [-76.4, 44.1], [-75.8, 44.4], [-75.0, 44.95], [-74.7, 45.0],
];
/** Along 45°N, then the highlands south of the St. Lawrence and the St. Croix River to the sea. */
const MAINE_LINE: LonLat[] = [
  [-74.7, 45.0], [-71.5, 45.0], [-71.1, 45.3], [-70.8, 45.4], [-70.25, 45.95], [-70.0, 46.7], [-69.23, 47.45], [-68.3, 47.35],
  [-67.8, 47.07], [-67.8, 45.7], [-67.43, 45.6], [-67.2, 45.2], [-66.98, 44.85],
];
/** From the Maine line north and east to the Gulf: New Brunswick's border with Quebec. */
const RESTIGOUCHE: LonLat[] = [[-69.23, 47.45], [-68.3, 47.9], [-67.0, 48.05], [-66.3, 48.05], [-65.5, 47.95], [-64.6, 47.9]];
/** Around the Gaspé and along the north shore of the Gulf of St. Lawrence to the Strait of Belle Isle. */
const GULF_NORTH: LonLat[] = [[-64.15, 48.5], [-64.15, 48.85], [-61.5, 49.0], [-59.0, 50.0], [-57.3, 51.1], [-57.1, 51.42]];
/** The Ottawa River, from the St. Lawrence up to Lake Timiskaming, then north to the watershed. */
const OTTAWA: LonLat[] = [
  [-74.38, 45.17], [-74.4, 45.55], [-75.7, 45.43], [-76.4, 45.5], [-77.1, 45.83], [-77.8, 46.1], [-78.7, 46.32], [-79.45, 46.85],
  [-79.5, 47.6], [-79.5, 48.6],
];
/** The Mississippi, from its source down to where the Ohio joins it. */
const MISSISSIPPI: LonLat[] = [
  [-95.2, 47.24], [-94.6, 47.45], [-93.5, 47.2], [-94.2, 46.3], [-93.3, 45.0], [-91.2, 43.5], [-91.1, 42.0], [-90.6, 41.5],
  [-91.4, 40.4], [-90.2, 38.6], [-89.2, 37.0],
];
/** The Ohio River, upstream from the Mississippi to Pennsylvania's western border. */
const OHIO: LonLat[] = [
  [-89.2, 37.0], [-88.5, 37.1], [-88.1, 37.7], [-86.8, 37.9], [-85.8, 38.25], [-84.5, 39.1], [-83.0, 38.73], [-82.45, 38.42],
  [-81.56, 39.27], [-80.72, 40.06], [-80.52, 40.64],
];
/** The Royal Proclamation line along the Appalachians, from 45°N south. */
const PROCLAMATION: LonLat[] = [
  [-74.7, 45.0], [-75.2, 44.6], [-76.0, 43.2], [-77.5, 42.0], [-77.8, 41.5], [-78.4, 40.6], [-78.8, 39.7], [-79.4, 38.6],
  [-80.3, 37.6], [-81.7, 36.3], [-82.3, 33.0],
];

const rev = (l: LonLat[]) => [...l].reverse();
const between = (l: LonLat[], from: number, to?: number) => l.slice(from, to === undefined ? undefined : to + 1);
const idx = (l: LonLat[], p: LonLat) => l.findIndex(([a, b]) => a === p[0] && b === p[1]);

// ---------------------------------------------------------------- areas

const NOVA_SCOTIA: LonLat[] = [
  [-64.35, 45.88], [-64.05, 46.0], [-63.4, 45.93], [-62.6, 45.84], [-61.7, 46.1], [-61.3, 46.8], [-60.6, 47.2], [-59.6, 47.1],
  [-59.0, 46.0], [-60.5, 43.0], [-66.6, 43.0], [-66.6, 44.2], [-65.5, 45.15], [-64.8, 45.4], [-64.6, 45.45], [-64.45, 45.7],
];
/** Mainland Nova Scotia without Cape Breton, which France kept in 1713. */
const NS_PENINSULA: LonLat[] = [
  [-64.35, 45.88], [-64.05, 46.0], [-63.4, 45.93], [-62.6, 45.84], [-61.55, 45.75], [-61.42, 45.55], [-61.0, 45.2], [-60.5, 43.0],
  [-66.6, 43.0], [-66.6, 44.2], [-65.5, 45.15], [-64.8, 45.4], [-64.6, 45.45], [-64.45, 45.7],
];
const NEW_BRUNSWICK: LonLat[] = [
  [-64.35, 45.88], [-64.45, 45.7], [-64.6, 45.45], [-64.8, 45.4], [-65.5, 45.15], [-66.6, 44.6], ...rev(between(MAINE_LINE, idx(MAINE_LINE, [-69.23, 47.45]))),
  ...RESTIGOUCHE.slice(1), [-64.3, 47.8], [-64.5, 46.95], [-64.6, 46.45], [-63.75, 46.17], [-64.05, 46.0],
];
const PEI: LonLat[] = [[-64.05, 46.0], [-63.4, 45.93], [-62.6, 45.84], [-61.7, 46.1], [-61.5, 46.5], [-61.9, 47.2], [-64.0, 47.25], [-64.5, 46.95], [-64.6, 46.45], [-63.75, 46.17]];
const NEWFOUNDLAND: LonLat[] = [
  [-59.6, 47.4], [-59.7, 48.5], [-58.6, 49.4], [-57.6, 50.6], [-56.9, 51.3], [-56.6, 51.42], [-55.8, 51.62], [-55.2, 51.75], [-51.5, 50.5],
  [-51.5, 46.3], [-55.5, 46.4], [-55.9, 46.7], [-56.0, 47.25], [-57.0, 47.3],
];
/** The Acadia that France founded: the peninsula, the mainland beside it and the islands. */
const ACADIA: LonLat[] = [
  [-59.6, 47.1], [-59.0, 46.0], [-60.5, 43.0], [-66.6, 43.0], [-66.6, 44.6], ...rev(between(MAINE_LINE, idx(MAINE_LINE, [-69.23, 47.45]))),
  ...RESTIGOUCHE.slice(1), [-64.3, 47.8], [-64.0, 47.25], [-61.9, 47.25],
];
const RUPERTS_LAND: LonLat[] = [...HBC_SOUTH, [-64.0, 62], [-110, 62], [-110, 45.9]];

const Q_SOUTH_EAST: LonLat[] = [...between(MAINE_LINE, 1, idx(MAINE_LINE, [-69.23, 47.45])), ...RESTIGOUCHE.slice(1), ...GULF_NORTH];
/** The small Province of Quebec of the Royal Proclamation: Lac Saint-Jean to Lake Nipissing to 45°N. */
const QUEBEC_1763: LonLat[] = [[-79.5, 46.2], [-74.7, 45.0], ...between(Q_SOUTH_EAST, 0, Q_SOUTH_EAST.length - 5), [-65.3, 49.5], [-64.3, 50.35], [-72.0, 48.6]];
/** The St. Lawrence shore from 45°N, through the middle of Lake Ontario and along Lake Erie, to Pennsylvania. */
const QUEBEC_ACT_SOUTH: LonLat[] = [...rev(between(LAKES_BORDER, idx(LAKES_BORDER, [-79.06, 43.27]))), [-78.95, 42.85], [-79.76, 42.27], [-80.52, 42.0], [-80.52, 40.64]];
const LABRADOR: LonLat[] = [[-57.1, 51.42], [-55.5, 51.6], [-55.0, 57.0], [-64.0, 57.0], [-64.0, 54.6]];
/** The Quebec Act's Quebec: the old province, plus the Great Lakes and Ohio lands and Labrador. */
const QUEBEC_1774: LonLat[] = [
  ...QUEBEC_ACT_SOUTH, ...rev(OHIO).slice(1), ...rev(MISSISSIPPI).slice(1), [-95.6, 47.0], ...between(HBC_SOUTH, 3), ...rev(LABRADOR).slice(1),
  ...rev(GULF_NORTH).slice(1), ...rev(RESTIGOUCHE).slice(0, -1), ...rev(between(MAINE_LINE, 1, idx(MAINE_LINE, [-69.23, 47.45]))),
];
/** British land north of the lakes once the United States had its border (1783). */
const north = (west: LonLat[], east: LonLat[]) => [...west, ...east];
const QUEBEC_1783: LonLat[] = north(
  [...rev(between(LAKES_BORDER, idx(LAKES_BORDER, [-89.6, 48.0]))), [-89.6, 48.0], ...between(HBC_SOUTH, idx(HBC_SOUTH, [-90.0, 48.2]))],
  [...rev(LABRADOR).slice(1), ...rev(GULF_NORTH).slice(1), ...rev(RESTIGOUCHE).slice(0, -1), ...rev(between(MAINE_LINE, 1, idx(MAINE_LINE, [-69.23, 47.45])))],
);
const UPPER_CANADA: LonLat[] = [
  ...OTTAWA, ...rev(between(HBC_SOUTH, idx(HBC_SOUTH, [-90.0, 48.2]), idx(HBC_SOUTH, [-79.5, 48.6]))), [-89.6, 48.0],
  ...between(LAKES_BORDER, idx(LAKES_BORDER, [-89.6, 48.0]) + 1),
];
const lowerCanada = (labrador: boolean): LonLat[] => [
  ...OTTAWA, ...between(HBC_SOUTH, idx(HBC_SOUTH, [-79.5, 48.6]) + 1), ...(labrador ? rev(LABRADOR).slice(1) : [[-64.0, 52.0] as LonLat, [-57.1, 52.0] as LonLat, [-57.1, 51.42] as LonLat]),
  ...rev(GULF_NORTH).slice(1), ...rev(RESTIGOUCHE).slice(0, -1), ...rev(between(MAINE_LINE, 0, idx(MAINE_LINE, [-69.23, 47.45]))),
];
const THIRTEEN: LonLat[] = [...between(MAINE_LINE, 1).reverse(), [-74.7, 45.0], ...PROCLAMATION.slice(1), [-75, 31], [-62, 40], [-66.6, 43.5]];
/** The United States after the Treaty of Paris (1783): from the Atlantic to the Mississippi. */
const USA_1783: LonLat[] = [...rev(MAINE_LINE), ...rev(LAKES_BORDER).slice(1), [-95.2, 47.24], ...MISSISSIPPI.slice(1), [-90, 30], [-75, 31], [-62, 40], [-66.6, 43.5]];
/** Lands the Royal Proclamation kept for First Nations, west of the colonies (1763). */
const RESERVE_1763: LonLat[] = [[-79.5, 46.2], [-72.0, 48.6], [-64.3, 50.35], [-64.0, 54.6], ...rev(between(HBC_SOUTH, 2)), ...MISSISSIPPI, [-90.0, 33.0], [-82.3, 33.0], ...rev(PROCLAMATION).slice(1)];
/** After the Quebec Act, the land kept for First Nations south of the Ohio River. */
const RESERVE_1774: LonLat[] = [...OHIO, ...between(PROCLAMATION, idx(PROCLAMATION, [-78.8, 39.7])), [-90.0, 33.0]];
/** Louisiana, France's colony along the Mississippi (rough). */
const LOUISIANA: LonLat[] = [[-101, 46], [-91.5, 44.5], [-88, 42], [-86.5, 41], [-84.5, 38.8], [-84.5, 35], [-87.5, 30.4], [-89.5, 28.8], [-94, 29.4], [-101, 29.5]];
/** New France (Canada): the St. Lawrence valley and the Great Lakes, with no exact border. */
const NEW_FRANCE: LonLat[] = [
  ...QUEBEC_ACT_SOUTH, [-84.5, 41.2], [-88, 42], [-91.5, 44.5], [-95.6, 47.0], ...between(HBC_SOUTH, 3),
  [-64.0, 52.0], [-57.1, 52.0], [-57.1, 51.42], ...rev(GULF_NORTH).slice(1), [-64.3, 47.8], ...rev(RESTIGOUCHE).slice(0, -1),
  ...rev(between(MAINE_LINE, 1, idx(MAINE_LINE, [-69.23, 47.45]))),
];

// ---------------------------------------------------------------- frames

export interface FrameSpec {
  id: string;
  /** Central meridian and the two standard parallels of the conic projection. */
  rotate: number;
  parallels: [number, number];
  /** Points that must fit inside the frame. */
  fit: LonLat[];
  width: number;
  height: number;
}

export const FRAMES: Record<string, FrameSpec> = {
  sea: { id: 'sea', rotate: -66, parallels: [44, 52], fit: [[-83.5, 44], [-49, 46], [-50, 53.5], [-83.5, 47.5], [-66, 43]], width: 720, height: 480 },
  east: { id: 'east', rotate: -74, parallels: [42, 54], fit: [[-91, 38], [-52.5, 46.5], [-55, 53], [-91, 50], [-76, 37.5]], width: 720, height: 540 },
  colonies: { id: 'colonies', rotate: -78, parallels: [35, 50], fit: [[-97, 29], [-54, 45], [-56, 53], [-97, 49], [-80, 28.5]], width: 720, height: 620 },
  st: { id: 'st', rotate: -68, parallels: [44, 48], fit: [[-74.5, 44], [-63.5, 43.6], [-63.5, 49.3], [-74.5, 48.6]], width: 720, height: 460 },
  west: { id: 'west', rotate: -92, parallels: [45, 58], fit: [[-118, 50], [-70, 44], [-70, 50], [-114, 60], [-90, 42]], width: 720, height: 520 },
};

// ---------------------------------------------------------------- explorers (S1.3)

export interface Explorer {
  id: string;
  name: string;
  /** Short name for the button. */
  short: string;
  when: string;
  sentBy: string;
  /** Why they came, in the curriculum's three words. */
  why: { territory?: string; resources?: string; prestige?: string };
  route: LonLat[];
  stops: { name: string; at: LonLat; year: string; note: string; side?: 'above' | 'below' | 'left' | 'right' }[];
  /** Where the voyage starts: a label at the map edge. */
  from: string;
}

export const EXPLORERS: Explorer[] = [
  {
    id: 'caboto',
    name: 'Giovanni Caboto',
    short: 'Caboto',
    when: '1497',
    sentBy: 'King Henry VII of England',
    from: 'from Bristol, England',
    why: { territory: 'Claim new lands for England.', resources: 'Find a sea route to the riches of Asia.', prestige: 'Make England as famous as Spain and Portugal.' },
    route: [[-35, 51.5], [-45, 51.0], [-50.5, 49.8], [-53.1, 48.7]],
    stops: [{ name: 'Landfall', at: [-53.1, 48.7], year: '1497', note: 'No one knows for sure where Caboto landed. It may have been Newfoundland or Cape Breton. He reported seas full of cod.', side: 'left' }],
  },
  {
    id: 'cartier',
    name: 'Jacques Cartier',
    short: 'Cartier',
    when: '1534 and 1535',
    sentBy: 'King Francis I of France',
    from: 'from Saint-Malo, France',
    why: { territory: 'Claim land for France.', resources: 'Look for gold and a route to Asia.', prestige: 'Make France as great as Spain.' },
    route: [[-35, 52.5], [-48, 52.0], [-55.4, 51.6], [-57.5, 50.6], [-59.6, 48.6], [-61.8, 47.4], [-64.2, 47.25], [-65.4, 47.95], [-64.5, 48.8], [-64.3, 49.3], [-66.5, 49.3], [-69.7, 48.1], [-71.2, 46.81], [-72.4, 46.3], [-73.57, 45.5]],
    stops: [
      { name: 'Gaspé', at: [-64.5, 48.83], year: '1534', note: 'Cartier raised a cross and claimed the land for France. He met Stadaconans, led by Donnacona, who had come to fish.', side: 'right' },
      { name: 'Stadacona', at: [-71.21, 46.81], year: '1535', note: 'A village of about 500 people where Quebec City is now. The Iroquoian word *kanata* means “village”. It gave Canada its name.', side: 'below' },
      { name: 'Hochelaga', at: [-73.57, 45.5], year: '1535', note: 'A large village where Montreal is now. Cartier hoped the river would lead to Asia, but rapids blocked his ships.', side: 'below' },
    ],
  },
  {
    id: 'demonts',
    name: 'Pierre Du Gua de Monts',
    short: 'de Monts',
    when: '1604 and 1605',
    sentBy: 'King Henri IV of France',
    from: 'from Le Havre, France',
    why: { territory: 'Start a French colony.', resources: 'He alone could trade for furs, as long as he brought settlers.' },
    route: [[-35, 46.5], [-50, 45.2], [-60, 43.6], [-65.8, 43.4], [-66.6, 44.3], [-67.13, 45.13], [-66.3, 44.9], [-65.61, 44.71]],
    stops: [
      { name: 'Île Sainte-Croix', at: [-67.13, 45.13], year: '1604', note: 'The first winter was very cold. 35 of the 79 men died of scurvy.', side: 'left' },
      { name: 'Port-Royal', at: [-65.61, 44.71], year: '1605', note: 'The survivors moved across the bay to a sheltered harbour, and built Port-Royal.', side: 'below' },
    ],
  },
  {
    id: 'champlain',
    name: 'Samuel de Champlain',
    short: 'Champlain',
    when: '1608 to 1615',
    sentBy: 'King Henri IV of France and de Monts',
    from: 'from Honfleur, France',
    why: { territory: 'Build a French colony on the St. Lawrence.', resources: 'Trade for furs with First Nations.' },
    route: [[-35, 49.5], [-50, 48.6], [-59.0, 47.8], [-64.0, 49.3], [-69.72, 48.14], [-71.21, 46.81], [-72.5, 46.3], [-73.6, 45.45], [-75.7, 45.43], [-77.1, 45.83], [-78.7, 46.32], [-79.6, 46.25], [-80.5, 46.05], [-80.4, 45.4], [-79.9, 44.65]],
    stops: [
      { name: 'Quebec', at: [-71.21, 46.81], year: '1608', note: 'Champlain built a fort and storehouse, the Habitation, by the narrows of the river.', side: 'below' },
      { name: 'Wendake', at: [-79.9, 44.65], year: '1615', note: 'Champlain travelled to the homeland of the Wendat, his allies in the fur trade.', side: 'below' },
    ],
  },
];

// ---------------------------------------------------------------- the first colonies (outcome 2, K1.3)

export interface Colony {
  id: string;
  name: string;
  owner: Owner;
  area: LonLat[];
  label: LonLat;
  about: string;
}

export const COLONIES: Colony[] = [
  { id: 'new-france', name: 'New France', owner: 'fr', area: NEW_FRANCE, label: [-77.5, 47.3], about: 'France’s main colony, along the St. Lawrence River and around the Great Lakes. Its towns were Quebec, Trois-Rivières and Montreal.' },
  { id: 'acadia', name: 'Acadia', owner: 'fr', area: ACADIA, label: [-65.2, 45.9], about: 'France’s colony by the Atlantic, where Port-Royal was built. Acadians farmed the marshes by the sea.' },
  { id: 'louisiana', name: 'Louisiana', owner: 'fr', area: LOUISIANA, label: [-92.5, 35.5], about: 'France’s colony along the Mississippi River, all the way to the Gulf of Mexico.' },
  { id: 'thirteen', name: 'Thirteen Colonies', owner: 'br', area: THIRTEEN, label: [-77.5, 38.8], about: 'Britain’s colonies along the Atlantic coast. They had many more settlers than New France.' },
];

// ---------------------------------------------------------------- borders over time (outcome 1)

export interface Region {
  name: string;
  owner: Owner;
  area: LonLat[];
  label?: LonLat;
}
export interface Era {
  id: string;
  year: string;
  title: string;
  /** What changed, one or two short sentences. */
  what: string;
  regions: Region[];
}

const hbc: Region = { name: 'Rupert’s Land', owner: 'hbc', area: RUPERTS_LAND, label: [-84, 52.6] };
const nfld: Region = { name: 'Newfoundland', owner: 'br', area: NEWFOUNDLAND, label: [-56.2, 48.6] };
const thirteen: Region = { name: 'Thirteen Colonies', owner: 'br', area: THIRTEEN, label: [-75.6, 41.4] };
const usa: Region = { name: 'United States', owner: 'us', area: USA_1783, label: [-82.5, 40.3] };
const ns: Region = { name: 'Nova Scotia', owner: 'br', area: NOVA_SCOTIA, label: [-63.6, 44.9] };
const nb: Region = { name: 'New Brunswick', owner: 'br', area: NEW_BRUNSWICK, label: [-66.4, 46.6] };
const pei: Region = { name: 'PEI', owner: 'br', area: PEI };

export const ERAS: Era[] = [
  {
    id: '1713',
    year: '1713',
    title: 'Treaty of Utrecht',
    what: 'After a war, France gave Acadia to Britain. The British called it Nova Scotia. France kept New France.',
    regions: [
      hbc,
      { name: 'New France', owner: 'fr', area: NEW_FRANCE, label: [-78, 46.9] },
      { name: '', owner: 'fr', area: ACADIA },
      thirteen,
      { name: 'Nova Scotia', owner: 'br', area: NS_PENINSULA, label: [-64.0, 44.6] },
      nfld,
    ],
  },
  {
    id: '1763',
    year: '1763',
    title: 'Treaty of Paris and the Royal Proclamation',
    what: 'France gave New France to Britain. The Royal Proclamation made a small Province of Quebec, and kept the lands to the west for First Nations.',
    regions: [
      hbc,
      { name: 'Kept for First Nations', owner: 'fn', area: RESERVE_1763, label: [-86, 44.4] },
      thirteen,
      { name: 'Quebec', owner: 'br', area: QUEBEC_1763, label: [-72.3, 47.4] },
      { name: 'Nova Scotia', owner: 'br', area: ACADIA, label: [-64.0, 44.6] },
      nfld,
    ],
  },
  {
    id: '1774',
    year: '1774',
    title: 'The Quebec Act',
    what: 'Quebec grew much bigger. It now reached the Ohio River in the south and the Hudson Bay lands in the north.',
    regions: [
      hbc,
      { name: 'Kept for First Nations', owner: 'fn', area: RESERVE_1774 },
      thirteen,
      { name: 'Quebec', owner: 'br', area: QUEBEC_1774, label: [-80, 45.9] },
      { name: 'Nova Scotia', owner: 'br', area: ACADIA, label: [-64.0, 44.6] },
      nfld,
    ],
  },
  {
    id: '1783',
    year: '1783',
    title: 'Treaty of Paris',
    what: 'The United States was now its own country. A new border ran through the Great Lakes. The land south of the lakes went to the United States.',
    regions: [hbc, usa, { name: 'Quebec', owner: 'br', area: QUEBEC_1783, label: [-75.5, 48.8] }, { name: 'Nova Scotia', owner: 'br', area: ACADIA, label: [-64.0, 44.6] }, nfld],
  },
  {
    id: '1791',
    year: '1791',
    title: 'The Constitution Act, 1791',
    what: 'Quebec was split in two along the Ottawa River: Upper Canada and Lower Canada. Loyalists had also made a new colony, New Brunswick.',
    regions: [
      hbc,
      usa,
      { name: 'Upper Canada', owner: 'br', area: UPPER_CANADA, label: [-81.0, 46.6] },
      { name: 'Lower Canada', owner: 'br', area: lowerCanada(true), label: [-72.2, 48.6] },
      nb,
      ns,
      pei,
      nfld,
    ],
  },
  {
    id: '1841',
    year: '1841',
    title: 'The Act of Union',
    what: 'Upper and Lower Canada joined into one Province of Canada. Its two parts were called Canada West and Canada East.',
    regions: [
      hbc,
      usa,
      { name: 'Canada West', owner: 'br', area: UPPER_CANADA, label: [-81.0, 46.6] },
      { name: 'Canada East', owner: 'br', area: lowerCanada(false), label: [-72.2, 48.6] },
      nb,
      ns,
      pei,
      nfld,
    ],
  },
  {
    id: '1867',
    year: '1867',
    title: 'Confederation',
    what: 'The BNA Act joined four provinces into the Dominion of Canada: Ontario, Quebec, New Brunswick and Nova Scotia.',
    regions: [
      hbc,
      usa,
      { name: 'Ontario', owner: 'ca', area: UPPER_CANADA, label: [-81.0, 46.6] },
      { name: 'Quebec', owner: 'ca', area: lowerCanada(false), label: [-72.2, 48.6] },
      { ...nb, owner: 'ca' },
      { ...ns, owner: 'ca' },
      pei,
      nfld,
    ],
  },
];

// ---------------------------------------------------------------- dots over time

export interface Dot {
  name: string;
  at: LonLat;
  year: number;
  /** Groups dots by colour, e.g. a company. */
  group: string;
  note: string;
  side?: 'above' | 'below' | 'left' | 'right';
}
export interface DotSet {
  frame: string;
  from: number;
  to: number;
  step: number;
  groups: { id: string; label: string }[];
  dots: Dot[];
  /** Canoe and ship routes drawn under the dots. */
  routes?: { group: string; points: LonLat[] }[];
}

export const DOT_SETS: Record<string, DotSet> = {
  settlements: {
    frame: 'st',
    from: 1600,
    to: 1650,
    step: 1,
    groups: [{ id: 'fr', label: 'French settlement' }],
    dots: [
      { name: 'Port-Royal', at: [-65.61, 44.71], year: 1605, group: 'fr', note: 'Built by de Monts and Champlain, by a sheltered harbour in Acadia.', side: 'below' },
      { name: 'Quebec', at: [-71.21, 46.81], year: 1608, group: 'fr', note: 'Founded by Champlain where the St. Lawrence River narrows.', side: 'right' },
      { name: 'Trois-Rivières', at: [-72.55, 46.35], year: 1634, group: 'fr', note: 'A fur-trading post where the Saint-Maurice River meets the St. Lawrence.', side: 'below' },
      { name: 'Montreal', at: [-73.57, 45.5], year: 1642, group: 'fr', note: 'Founded as Ville-Marie by Paul de Chomedey de Maisonneuve and Jeanne Mance.', side: 'below' },
    ],
  },
  posts: {
    frame: 'west',
    from: 1670,
    to: 1800,
    step: 1,
    groups: [
      { id: 'hbc', label: 'Hudson’s Bay Company' },
      { id: 'nwc', label: 'North West Company' },
    ],
    dots: [
      { name: 'Moose Factory', at: [-80.61, 51.26], year: 1673, group: 'hbc', note: 'One of the first posts on the shores of the bay. First Nations brought furs down the rivers to it.', side: 'right' },
      { name: 'York Factory', at: [-92.3, 57.0], year: 1684, group: 'hbc', note: 'For years the company waited by the bay for traders to come to its posts.', side: 'right' },
      { name: 'Cumberland House', at: [-102.27, 53.96], year: 1774, group: 'hbc', note: 'The company’s first post inland, built to stop furs going to traders from Montreal.', side: 'below' },
      { name: 'Montreal', at: [-73.57, 45.5], year: 1779, group: 'nwc', note: 'Traders in Montreal joined together as the North West Company. Their canoes left from here each spring.', side: 'below' },
      { name: 'Grand Portage', at: [-89.68, 47.96], year: 1784, group: 'nwc', note: 'Where canoes from Montreal met canoes from the west each summer to swap goods and furs.', side: 'below' },
      { name: 'Fort Chipewyan', at: [-111.31, 58.71], year: 1788, group: 'nwc', note: 'Far to the north, on Lake Athabasca, in what is now Alberta.', side: 'right' },
      { name: 'Fort Edmonton', at: [-113.2, 53.75], year: 1795, group: 'hbc', note: 'Built beside the North West Company’s Fort Augustus, in what is now Alberta.', side: 'below' },
      { name: 'Fort Augustus', at: [-113.2, 53.75], year: 1795, group: 'nwc', note: 'Built the same year as Fort Edmonton, right next to it. The rivals raced each other west.', side: 'above' },
    ],
    routes: [
      { group: 'hbc', points: [[-92.3, 57.0], [-94.5, 55.5], [-97.8, 53.9], [-99.3, 53.2], [-102.27, 53.96], [-105.7, 53.2], [-108.3, 52.9], [-110.0, 53.5], [-113.2, 53.75]] },
      { group: 'nwc', points: [[-73.57, 45.5], [-75.7, 45.43], [-78.7, 46.32], [-79.6, 46.25], [-80.5, 46.05], [-82.4, 46.1], [-84.4, 46.5], [-86.5, 47.0], [-89.68, 47.96], [-92.0, 48.4], [-94.5, 49.4], [-96.5, 50.5], [-97.5, 52.5], [-99.3, 53.2], [-102.27, 53.96], [-106.0, 55.5], [-108.5, 56.4], [-109.8, 56.6], [-111.31, 58.71]] },
    ],
  },
};
