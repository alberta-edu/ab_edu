// The Nile flood scale for the nilometer visual. The harvest words follow the scale that Pliny the
// Elder recorded in Natural History, book 5. The sizes out of 5 only show the idea.

const BOTTOM = 240;
const STEP = 22;

/** Height on the drawing of a flood measured in cubits. */
export const levelY = (cubits: number) => BOTTOM - (cubits - 10) * STEP;

export function reading(cubits: number) {
  if (cubits <= 12) return { word: 'Hunger', good: false, harvest: 1, tax: 1, note: 'Too little water reached the fields. Officials expected little grain, so there was little to tax.' };
  if (cubits === 13) return { word: 'Still hunger', good: false, harvest: 2, tax: 2, note: 'More land was watered, but not enough to feed everyone well.' };
  if (cubits === 14) return { word: 'Joy', good: true, harvest: 3, tax: 3, note: 'Water reached many fields, and officials could expect a good crop.' };
  if (cubits === 15) return { word: 'Security', good: true, harvest: 4, tax: 4, note: 'A safe, strong harvest was coming, so officials could expect a bigger grain tax.' };
  if (cubits === 16) return { word: 'Delight', good: true, harvest: 5, tax: 5, note: 'The best flood of all. Officials expected the biggest harvest, and the biggest grain tax.' };
  return { word: 'Too much', good: false, harvest: 2, tax: 2, note: 'The water stayed too long, so planting came late. A flood this high could bring famine too.' };
}
