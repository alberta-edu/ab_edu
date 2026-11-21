// Length in standard units (MAT3-OI5-GQ1-LO1): metres to millimetres, measuring from 0, straightening
// a curve, inches, feet and yards, and rough metric-imperial matches.

// ---------------------------------------------------------------- Zooming into a metre

export const ZOOM = [
  { whole: '1 metre', part: 'decimetres', short: 'dm', say: '10 decimetres make 1 metre.', total: '1 m = 10 dm' },
  { whole: '1 decimetre', part: 'centimetres', short: 'cm', say: '10 centimetres make 1 decimetre. So 100 centimetres make 1 metre.', total: '1 m = 100 cm' },
  { whole: '1 centimetre', part: 'millimetres', short: 'mm', say: '10 millimetres make 1 centimetre. So 1000 millimetres make 1 metre.', total: '1 m = 1000 mm' },
];

/** How many of each unit make one metre. */
export const PER_METRE = { dm: 10, cm: 100, mm: 1000 } as const;

// ---------------------------------------------------------------- Measuring things

export interface Thing {
  id: string;
  name: string;
  icon: string;
  /** Length in millimetres. */
  mm: number;
  /** Where its left end starts, in millimetres from 0. */
  start: number;
  curve?: boolean;
}

export const THINGS: Thing[] = [
  { id: 'pencil', name: 'Pencil', icon: '✏️', mm: 120, start: 22 },
  { id: 'crayon', name: 'Crayon', icon: '🖍️', mm: 75, start: 35 },
  { id: 'worm', name: 'Worm', icon: '🪱', mm: 110, start: 15, curve: true },
  { id: 'leaf', name: 'Leaf', icon: '🍃', mm: 64, start: 48 },
];

export const thingById = (id: string) => THINGS.find((t) => t.id === id)!;

/** What the ruler says, in cm or mm, without decimals. */
export function readSay(t: Thing, unit: 'cm' | 'mm'): string {
  const name = t.name.toLowerCase();
  if (unit === 'mm') return `The ${name} is ${t.mm} mm long.`;
  if (t.mm % 10 === 0) return `The ${name} is ${t.mm / 10} cm long.`;
  const lo = Math.floor(t.mm / 10);
  return `The ${name} is between ${lo} cm and ${lo + 1} cm. Millimetres give a closer answer: ${t.mm} mm.`;
}

/** What you would read if you forgot to line up at 0: the number at the far end. */
export const wrongRead = (t: Thing) => (t.start + t.mm) / 10;

/**
 * Points along a wiggly worm of a given length, at straightness s (0 = wiggly, 1 = straight). The
 * body is n equal pieces that bend less and less, so its length never changes.
 */
export function wormPoints(len: number, s: number, n = 40): [number, number][] {
  const out: [number, number][] = [[0, 0]];
  const step = len / n;
  for (let i = 0; i < n; i++) {
    const a = 0.9 * (1 - s) * Math.cos(((i + 0.5) / n) * Math.PI * 4);
    const [x, y] = out[i];
    out.push([x + step * Math.cos(a), y + step * Math.sin(a)]);
  }
  return out;
}

export const pathLength = (pts: [number, number][]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

// ---------------------------------------------------------------- Inches, feet and yards

export const IMPERIAL = [
  { say: 'A ruler is 12 inches long. 12 inches make 1 foot.', total: '1 ft = 12 in' },
  { say: '3 rulers in a row make a yardstick. 3 feet make 1 yard.', total: '1 yd = 3 ft' },
  { say: '3 rows of 12 inches: 12 + 12 + 12 = 36 inches in 1 yard.', total: '1 yd = 36 in' },
];

/** Rough matches between metric and imperial, with the true sizes in centimetres. */
export const MATCHES = [
  { id: 'inch', label: 'Inch', a: { name: '2½ cm', cm: 2.5 }, b: { name: '1 in', cm: 2.54 }, say: '2½ cm is about 1 inch.' },
  { id: 'foot', label: 'Foot', a: { name: '30 cm', cm: 30 }, b: { name: '1 ft', cm: 30.48 }, say: '30 cm is about 1 foot.' },
  { id: 'yard', label: 'Yard', a: { name: '1 m', cm: 100 }, b: { name: '1 yd', cm: 91.44 }, say: '1 metre is about 1 yard, a little longer.' },
  { id: 'feet', label: '3 feet', a: { name: '1 m', cm: 100 }, b: { name: '3 ft', cm: 91.44 }, say: '1 metre is about 3 feet.' },
];
