// What the Grade 3 town (g3ss-town) can show: the places a government looks after. Each lesson picks
// the places it needs and writes their text in its YAML; names and icons live here.

export interface TownSpot {
  id: string;
  name: string;
  icon: string;
}

export const SPOTS: TownSpot[] = [
  { id: 'hall', name: 'Town hall', icon: '🏛️' },
  { id: 'fire', name: 'Fire hall', icon: '🚒' },
  { id: 'police', name: 'Police', icon: '🚓' },
  { id: 'library', name: 'Library', icon: '📚' },
  { id: 'park', name: 'Town park', icon: '🛝' },
  { id: 'water', name: 'Water', icon: '🚰' },
  { id: 'road', name: 'Roads and sidewalks', icon: '🛣️' },
  { id: 'school', name: 'School', icon: '🏫' },
  { id: 'hospital', name: 'Hospital', icon: '🏥' },
  { id: 'provpark', name: 'Provincial park', icon: '🏕️' },
];

/** The catalogue entries for a lesson's places, in the lesson's order. Throws on an unknown id, so a typo fails the build. */
export function pickSpots(ids: string[]): TownSpot[] {
  return ids.map((id) => {
    const found = SPOTS.find((s) => s.id === id);
    if (!found) throw new Error(`g3ss-town: no place "${id}"`);
    return found;
  });
}

/** In a find game: is a tap right, wrong, or a place already found? */
export function judge(id: string, answer: string[], found: Set<string>): 'right' | 'wrong' | 'again' {
  if (!answer.includes(id)) return 'wrong';
  return found.has(id) ? 'again' : 'right';
}

/** True once every answer has been found. */
export const allFound = (answer: string[], found: Set<string>) => answer.every((id) => found.has(id));
