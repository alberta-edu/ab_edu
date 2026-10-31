// Data for the Social Studies timeline and for the rise-and-fall city. The civilizations are
// the curriculum's own examples. Years are negative for BCE; dates are the usual textbook ones,
// and the earliest are approximate.

export const FIRST_YEAR = -3200;
export const LAST_YEAR = 500;

export const yearText = (y: number) => (y === 0 ? '1 CE' : y < 0 ? `${-y} BCE` : `${y} CE`);

export interface Civ {
  id: string;
  name: string;
  spans: [number, number][];
  dates: string;
  rise: { factor: string; text: string };
  fall: { factor: string; text: string };
}

export const CIVS: Civ[] = [
  {
    id: 'egypt',
    name: 'Egypt',
    spans: [[-3100, -30]],
    dates: 'about 3100 BCE to 30 BCE',
    rise: { factor: 'Organized structures and strong leadership', text: 'Kings united Egypt around 3100 BCE. Officials then organized farming and stored grain along the Nile.' },
    fall: { factor: 'War and military conquest', text: 'Persia, then Greece, then Rome conquered Egypt. Egypt became part of Rome in 30 BCE, after the death of Cleopatra.' },
  },
  {
    id: 'india',
    name: 'India (Indus Valley)',
    spans: [[-2600, -1900]],
    dates: 'about 2600 BCE to 1900 BCE',
    rise: { factor: 'Innovations', text: 'Cities such as Mohenjo-daro were carefully planned, with straight streets, wells and covered drains.' },
    fall: { factor: 'Environmental changes', text: 'Around 1900 BCE, people left the big cities. Many scientists think weaker rains and changing rivers were part of the reason.' },
  },
  {
    id: 'china',
    name: 'China',
    spans: [[-1600, 220]],
    dates: 'about 1600 BCE to 220 CE',
    rise: { factor: 'Strong leadership', text: 'In 221 BCE, the first emperor united warring states. One writing system and one set of measures tied China together.' },
    fall: { factor: 'Rebellions and struggles for power', text: 'Huge farmer rebellions in 184 CE shook the Han dynasty. Generals fought for control, and China split apart in 220 CE.' },
  },
  {
    id: 'greece',
    name: 'Greece',
    spans: [[-800, -146]],
    dates: 'about 800 BCE to 146 BCE',
    rise: { factor: 'Opportunity', text: 'A sea full of bays gave Greeks the chance to trade by ship and start new cities around the Mediterranean.' },
    fall: { factor: 'War and military conquest', text: 'Long wars between Greek city-states wore them down. Macedon took control, and then Rome conquered Greece in 146 BCE.' },
  },
  {
    id: 'rome',
    name: 'Rome',
    spans: [[-753, 476]],
    dates: '753 BCE to 476 CE, by tradition',
    rise: { factor: 'Military power and organized structures', text: 'Trained, paid soldiers won land all around the Mediterranean. Roads and written laws held it together.' },
    fall: { factor: 'Expenses, power struggles and war', text: 'Paying for a huge army drained the treasury, and rivals fought to be emperor. In 476 CE the last western emperor was removed. The eastern half lasted almost 1,000 years more.' },
  },
  {
    id: 'arab',
    name: 'Arab (Nabataeans)',
    spans: [[-300, 106]],
    dates: 'about 300 BCE to 106 CE',
    rise: { factor: 'Wealth', text: 'The Nabataeans of Petra grew rich by guiding and taxing the caravans that carried incense and spices through the desert.' },
    fall: { factor: 'War and military conquest', text: 'Rome took over their kingdom in 106 CE. Trade was already moving to the sea routes, away from Petra.' },
  },
];

export const civsAlive = (year: number) => CIVS.filter((c) => c.spans.some(([a, b]) => year >= a && year <= b));

export interface CityFactor {
  id: string;
  label: string;
  /** The building it adds or breaks in the picture. */
  piece: string;
  example: string;
}

export const RISE_FACTORS: CityFactor[] = [
  { id: 'organized', label: 'Organized structures', piece: 'granary', example: 'Egyptian officials counted harvests and stored grain, so people could eat in bad years.' },
  { id: 'leader', label: 'Strong leadership', piece: 'palace', example: 'In China, the first emperor united warring states into one country in 221 BCE.' },
  { id: 'military', label: 'Military power', piece: 'wall', example: 'Roman soldiers were trained and paid, and they won land around the Mediterranean.' },
  { id: 'innovations', label: 'Innovations', piece: 'aqueduct', example: 'Roman aqueducts and concrete let cities grow bigger than ever before.' },
  { id: 'wealth', label: 'Wealth', piece: 'market', example: 'The Nabataeans of Petra grew rich from the caravans that carried incense and spices.' },
  { id: 'opportunity', label: 'Opportunity', piece: 'harbour', example: 'A sea full of bays gave Greeks the chance to trade and start new cities.' },
];

export const FALL_FACTORS: CityFactor[] = [
  { id: 'environment', label: 'Environmental changes', piece: 'harbour', example: 'Weaker rains and changing rivers may have helped empty the cities of the Indus Valley.' },
  { id: 'rebellion', label: 'Rebellions', piece: 'granary', example: 'Huge farmer rebellions in 184 CE shook the Han dynasty of China.' },
  { id: 'expenses', label: 'Expenses', piece: 'market', example: 'Paying for a huge army drained the Roman treasury, so emperors put less silver in their coins.' },
  { id: 'power', label: 'Struggles for power and leadership', piece: 'palace', example: 'Rome had more than 20 emperors in about 50 years in the 200s CE, as rivals fought for the throne.' },
  { id: 'values', label: 'Changes to values and belief systems', piece: 'aqueduct', example: 'As new religions spread in Egypt, the old temples closed. The last known hieroglyphs were carved in 394 CE.' },
  { id: 'war', label: 'War and military conquest', piece: 'wall', example: 'Rome conquered Greece in 146 BCE and Egypt in 30 BCE.' },
];

export const CITY_PIECES = ['harbour', 'granary', 'market', 'wall', 'aqueduct', 'palace'] as const;
