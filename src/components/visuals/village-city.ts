// A made-up village of 100 people, to show the idea: better tools mean each farmer feeds more
// people, so fewer farmers are needed, and the others can take up other jobs. The numbers are
// chosen to show the pattern and are not historical measurements.

export const PEOPLE = 100;
const BASE_FOOD = 1.1; // people fed per farmer with hand tools
const TOOL_BOOST = 1.5;

export const foodPerFarmer = (irrigation: boolean, oxen: boolean) => BASE_FOOD * (irrigation ? TOOL_BOOST : 1) * (oxen ? TOOL_BOOST : 1);

export const farmersNeeded = (irrigation: boolean, oxen: boolean) => Math.ceil(PEOPLE / foodPerFarmer(irrigation, oxen));

export interface VillageState {
  farmers: number;
  others: number;
  /** People's worth of food grown in a year. */
  food: number;
  /** Food beyond what everyone eats (0 when there isn't enough). */
  surplus: number;
  hungry: boolean;
  stage: 'Hungry village' | 'Farming village' | 'Town' | 'City';
  jobs: string[];
  practices: string[];
}

/** Other jobs appear in this order, as more people are free to do something besides farm. */
export const JOBS: [number, string][] = [
  [8, 'potters'],
  [16, 'weavers'],
  [24, 'builders'],
  [32, 'metalworkers'],
  [40, 'traders'],
  [48, 'scribes'],
  [56, 'guards'],
];

/** Economic practices appear as the settlement grows and has food to spare. */
export const PRACTICES: [number, string][] = [
  [8, 'market'],
  [24, 'currency'],
  [40, 'bank'],
  [48, 'taxation'],
];

export function villageState(farmers: number, irrigation: boolean, oxen: boolean): VillageState {
  const others = PEOPLE - farmers;
  const food = Math.round(farmers * foodPerFarmer(irrigation, oxen));
  const hungry = food < PEOPLE;
  const surplus = Math.max(0, food - PEOPLE);
  const open = hungry ? 0 : others;
  return {
    farmers,
    others,
    food,
    surplus,
    hungry,
    stage: hungry ? 'Hungry village' : others < 20 ? 'Farming village' : others < 50 ? 'Town' : 'City',
    jobs: JOBS.filter(([n]) => open >= n).map(([, j]) => j),
    practices: PRACTICES.filter(([n]) => open >= n).map(([, p]) => p),
  };
}
