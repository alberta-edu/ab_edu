// Map frames and geography for the Social Studies maps: trade routes, empires and African
// empires. Coordinates are [longitude, latitude] in degrees, north and east positive. Cities are
// at their archaeological sites. Empire outlines are deliberately rough: they are clipped to
// the land when drawn, and the maps label them "approximate".

export interface MapFrame {
  lon0: number;
  latN: number;
  width: number;
  height: number;
  /** Map units per degree. */
  scale: number;
}
export type LonLat = [number, number];

export function makeFrame(lon0: number, lon1: number, latS: number, latN: number, width: number): MapFrame {
  const scale = width / (lon1 - lon0);
  return { lon0, latN, width, height: Math.round((latN - latS) * scale), scale };
}
export const toMap = (f: MapFrame, [lon, lat]: LonLat): [number, number] => [(lon - f.lon0) * f.scale, (f.latN - lat) * f.scale];

export const linePath = (f: MapFrame, pts: LonLat[], close = false) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${toMap(f, p).map((v) => v.toFixed(1)).join(' ')}`).join('') + (close ? 'Z' : '');

// ---------------------------------------------------------------- trade routes

export const TRADE_FRAME = makeFrame(-20, 125, 0, 50, 720);

export interface TradeRoute {
  id: string;
  name: string;
  kind: 'land' | 'water';
  traveller: string;
  points: LonLat[];
  stops: { name: string; at: LonLat; side?: 'above' | 'below' }[];
  connects: string;
  about: string;
  goods: string[];
  ideas: string[];
}

export const TRADE_ROUTES: TradeRoute[] = [
  {
    id: 'silk',
    name: 'The Silk Road',
    kind: 'land',
    traveller: '🐫',
    points: [[108.9, 34.3], [103.8, 36.1], [94.7, 40.1], [76, 39.5], [67, 39.7], [62.2, 37.7], [44.6, 33.1], [38.3, 34.6], [36.2, 36.2]],
    stops: [
      { name: "Chang'an", at: [108.9, 34.3], side: 'below' },
      { name: 'Samarkand', at: [67, 39.7] },
      { name: 'Antioch', at: [36.2, 36.2] },
    ],
    connects: 'China to the Mediterranean, by way of Central Asia and Persia',
    about: 'Not one road, but a network of paths. Most traders travelled only part of the way and passed goods along to the next trader.',
    goods: ['Silk from China', 'Spices', 'Glass from the Mediterranean', 'Horses from Central Asia'],
    ideas: ['**Religions and belief systems:** Buddhism travelled with merchants and monks from India to China.', '**Gunpowder:** invented in China, then its secret spread west.', '**Medicine:** knowledge of healing plants moved along with traders.'],
  },
  {
    id: 'royal',
    name: 'The Royal Road',
    kind: 'land',
    traveller: '🐎',
    points: [[48.3, 32.2], [44, 36.2], [43.2, 36.4], [39, 36.9], [35, 38.5], [28, 38.5]],
    stops: [
      { name: 'Susa', at: [48.3, 32.2], side: 'below' },
      { name: 'Sardis', at: [28, 38.5] },
    ],
    connects: 'Susa in Persia to Sardis, near the Aegean Sea',
    about: 'Persian kings kept this road of more than 2,400 km. On foot it took about 90 days. Royal messengers, changing horses at stations, did it in about 9.',
    goods: ['Cloth', 'Metals', 'Food', 'Royal messages and taxes'],
    ideas: ['**Cultures:** the road linked many peoples under Persian rule, so their ways of life came into contact.', '**Fast news:** rulers could send orders across the empire in days instead of months.'],
  },
  {
    id: 'sahara',
    name: 'The trans-Saharan route',
    kind: 'land',
    traveller: '🐫',
    points: [[-4.3, 31.3], [-5, 23.6], [-3, 16.8], [0, 16.3]],
    stops: [
      { name: 'Sijilmasa', at: [-4.3, 31.3] },
      { name: 'Taghaza', at: [-5, 23.6] },
      { name: 'Timbuktu', at: [-3, 16.8], side: 'below' },
    ],
    connects: 'North Africa to West Africa, across the Sahara Desert',
    about: 'Camel caravans crossed the desert between oases. West Africa had gold but needed salt. The Sahara had salt.',
    goods: ['Gold from West Africa', 'Salt from the Sahara', 'Cloth', 'Copper'],
    ideas: ['**Religions and belief systems:** Muslim traders brought Islam to West Africa.', '**Writing:** Arabic writing came with it, and Timbuktu became a centre of learning.'],
  },
  {
    id: 'sea',
    name: 'The Red Sea and Indian Ocean route',
    kind: 'water',
    traveller: '⛵',
    points: [[35.5, 23.9], [39.5, 18], [43.2, 13], [50, 12.5], [60, 13], [75.5, 10.5]],
    stops: [
      { name: 'Berenice', at: [35.5, 23.9] },
      { name: 'Muziris', at: [76.2, 10.1], side: 'below' },
    ],
    connects: 'Egypt and Rome to India, by sea',
    about: 'Ships from Roman Egypt sailed down the Red Sea, then used the seasonal monsoon winds to cross to India and back. A water route could carry far more than camels could.',
    goods: ['Pepper and other spices from India', 'Gems and cotton', 'Roman gold and silver coins', 'Wine'],
    ideas: ['**Medicine:** books of medical knowledge from India and Greece were later translated into Arabic, and spread to new places.', '**Religions and belief systems:** traders carried their beliefs from port to port.'],
  },
];

// ---------------------------------------------------------------- empires that grew

export const EMPIRE_FRAME = makeFrame(-14, 84, 8, 58, 720);

export interface Empire {
  id: string;
  name: string;
  stages: { label: string; area: LonLat[] }[];
  how: string;
  /** Where the home region label goes. */
  home: { name: string; at: LonLat };
}

const PERSIA_AREA: LonLat[] = [[26, 41.5], [30, 42], [36, 42], [42, 41.5], [48, 43], [54, 42], [60, 44], [68, 42], [72, 38], [73, 33], [71, 27], [67, 24.5], [60, 25], [56, 26], [50, 29], [47, 30], [42, 32], [36, 29], [35, 25], [33, 22], [29, 23], [25, 30], [25, 32.5], [33, 32], [35, 33], [36, 36], [30, 35.8], [26, 36.5]];

export const EMPIRES: Empire[] = [
  {
    id: 'persia',
    name: 'Persia',
    home: { name: 'Persia', at: [53, 30] },
    stages: [{ label: 'about 500 BCE', area: PERSIA_AREA }],
    how: 'Persian armies conquered kingdoms from Egypt to the Indus River. The Royal Road and new coins then helped trade and taxes flow across the empire.',
  },
  {
    id: 'greece',
    name: 'Greece',
    home: { name: 'Greece', at: [22.5, 39] },
    stages: [
      {
        label: 'about 323 BCE',
        area: [[20, 42], [27, 42], [34, 42], [40, 41], [47, 43], [53, 40], [60, 43], [69, 42], [72, 38], [75, 32], [73, 25], [67, 24], [60, 25], [55, 26], [50, 29], [47, 30], [42, 31], [36, 29], [35, 25], [32, 23], [28, 24], [24, 30], [24, 32.5], [33, 32], [35, 33], [36, 36], [26, 35], [21, 36]],
      },
    ],
    how: 'Alexander the Great led Greek and Macedonian armies to conquer the Persian Empire in about 10 years. Greek cities that he founded became new centres of trade.',
  },
  {
    id: 'rome',
    name: 'Rome',
    home: { name: 'Rome', at: [12.5, 41.9] },
    stages: [
      { label: 'about 264 BCE', area: [[7, 44.5], [14, 46], [14, 42], [19, 40], [16.5, 37.5], [14, 37.8], [10, 42]] },
      { label: '44 BCE', area: [[-10, 43.5], [-5, 48.5], [-2, 51], [6, 51.5], [8, 47], [13, 46.5], [19, 42.5], [24, 42], [28, 41.5], [34, 42], [37, 37], [38, 33], [34.8, 31.3], [33, 33], [25.5, 33], [25, 30.5], [20, 30.5], [10, 33], [8, 37.5], [-7, 35.5], [-10, 36.5]] },
      { label: '117 CE', area: [[-10, 43.5], [-5, 48.5], [-6, 50], [-6, 56], [-2, 56], [2, 51.5], [6, 52], [8, 48], [14, 48], [17, 48.5], [20, 45], [24, 47.5], [29, 45.5], [34, 45], [38, 44], [41, 41.5], [46, 40], [48, 37], [48, 30], [44, 30.5], [39, 31], [36, 27.5], [34, 24], [32, 23], [29, 24], [25, 29], [15, 30], [10, 33], [-1, 33], [-7, 32], [-10, 35]] },
    ],
    how: 'Rome took over Italy, then lands all around the Mediterranean. Conquest brought land and wealth, and trade followed its roads and sea lanes.',
  },
  {
    id: 'arab',
    name: 'Arab',
    home: { name: 'Arabia', at: [44, 23] },
    stages: [
      { label: 'about 750 CE', area: [[-10, 44], [-2, 44.5], [3, 43], [2, 39], [-1, 36.8], [10, 37.8], [12, 33], [20, 33], [32, 32], [35, 37], [40, 38], [47, 42], [52, 39], [60, 41], [70, 42.5], [75, 37], [73, 30], [71, 23.5], [62, 24], [57, 23], [55, 16], [45, 11], [42, 15], [39, 21], [35, 28], [33, 23], [28, 24], [15, 27], [3, 28], [-10, 28], [-11, 36]] },
    ],
    how: 'After 632 CE, Arab armies spread out from Arabia, from Spain in the west to the Indus River in the east. Traders then linked the lands from the Atlantic to India.',
  },
];

// ---------------------------------------------------------------- African empires

export const AFRICA_FRAME = makeFrame(-18, 48, 2, 26, 720);

export interface AfricanPlace {
  name: string;
  at: LonLat;
  /** Rough dates for the timeline; the years are approximate. */
  from: number;
  to: number;
  dates: string;
  /** Puts the label under the dot, where a neighbour would otherwise collide with it. */
  below?: boolean;
}
export interface AfricanChain {
  id: string;
  label: string;
  places: AfricanPlace[];
  dispute: string;
  ending: string;
}

export const AFRICAN_CHAINS: AfricanChain[] = [
  {
    id: 'kush-axum',
    label: 'Kush and Axum',
    places: [
      { name: 'Kush', at: [33.75, 16.94], from: -750, to: 350, dates: 'about 750 BCE to 350 CE' },
      { name: 'Axum', at: [38.72, 14.13], from: 100, to: 940, dates: 'about 100 to 940 CE', below: true },
    ],
    dispute: 'Kush grew rich from gold, iron and ivory. Axum, near the Red Sea, controlled the ships passing by. The two kingdoms competed for trade, including ivory.',
    ending: 'About 350 CE, King Ezana of Axum attacked Meroë, the capital of Kush. Kush ended and Axum became the leading power. Historians still debate how weak trade troubles had already made Kush.',
  },
  {
    id: 'west-africa',
    label: 'Ghana, Mali and Songhai',
    places: [
      { name: 'Ghana', at: [-7.97, 15.76], from: 700, to: 1200, dates: 'about 700 to 1200 CE' },
      { name: 'Mali', at: [-8.4, 11.4], from: 1235, to: 1600, dates: 'about 1235 to 1600 CE' },
      { name: 'Songhai', at: [-0.04, 16.27], from: 1464, to: 1591, dates: 'about 1464 to 1591 CE' },
    ],
    dispute: 'Each empire grew rich by controlling and taxing the trade in gold and salt across the Sahara. Whoever held the trade routes held the power.',
    ending: 'Ghana weakened after attacks from the north, and Mali took over the trade. Princes in Mali fought over the throne, and Songhai broke away. In 1591, an army from Morocco invaded Songhai to seize the gold trade.',
  },
  {
    id: 'ife-benin',
    label: 'Ife and Benin',
    places: [
      { name: 'Ife', at: [4.56, 7.47], from: 1200, to: 1420, dates: 'at its height about 1200 to 1420 CE' },
      { name: 'Benin', at: [5.62, 6.33], from: 1250, to: 1897, dates: 'about 1250 to 1897 CE', below: true },
    ],
    dispute: 'Ife grew rich from trade and crafts, such as its glass beads. Some traditions say a prince from Ife began the line of kings in Benin. Benin then became a strong trader in its own right.',
    ending: "In the 1400s, Benin cut off Ife's access to the coastal ports, and Ife lost its place as a trading power. Ife stayed an important religious centre, while Benin's kingdom grew.",
  },
];
