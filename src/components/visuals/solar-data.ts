// Celestial bodies of the solar system for the Grade 6 explorer (SCI6-OI5-GQ1-LO1, K1.2-K1.7,
// S1.1-S1.4, S1.6). Numbers are from the NASA Planetary Fact Sheet
// (nssdc.gsfc.nasa.gov/planetary/factsheet) and NASA Science solar system pages.

export type Kind = 'star' | 'planet' | 'dwarf planet' | 'moon' | 'asteroid' | 'comet' | 'meteoroid';

export interface Body {
  id: string;
  name: string;
  kind: Kind;
  /** Diameter in km. */
  diameter: number;
  /** Average distance from the Sun in millions of km (planets and dwarf planets). */
  distance?: number;
  /** Average temperature in °C (cloud tops for the giant planets). */
  temp?: number;
  /** Surface gravity in m/s², where it makes sense. */
  gravity?: number;
  emits: boolean;
  madeOf: string;
  shape: 'round' | 'irregular';
  atmosphere: string;
  note: string;
}

export const BODIES: Body[] = [
  { id: 'sun', name: 'The Sun', kind: 'star', diameter: 1392000, temp: 5500, gravity: 274, emits: true, madeOf: 'Hot, glowing gas', shape: 'round', atmosphere: 'Its outer layers are gas.', note: 'About 109 Earths would fit across it. Its surface is about 5500 °C.' },
  { id: 'mercury', name: 'Mercury', kind: 'planet', diameter: 4879, distance: 57.9, temp: 167, gravity: 3.7, emits: false, madeOf: 'Rock and metal', shape: 'round', atmosphere: 'Almost none.', note: 'The closest planet to the Sun. With almost no air to hold heat, days are scorching and nights are freezing.' },
  { id: 'venus', name: 'Venus', kind: 'planet', diameter: 12104, distance: 108.2, temp: 464, gravity: 8.9, emits: false, madeOf: 'Rock and metal', shape: 'round', atmosphere: 'Very thick, mostly carbon dioxide.', note: 'The hottest planet, even though Mercury is closer to the Sun. Its thick air traps heat.' },
  { id: 'earth', name: 'Earth', kind: 'planet', diameter: 12756, distance: 149.6, temp: 15, gravity: 9.8, emits: false, madeOf: 'Rock and metal', shape: 'round', atmosphere: 'Mostly nitrogen and oxygen.', note: 'The only planet known to have life, and liquid water on its surface.' },
  { id: 'moon', name: 'The Moon', kind: 'moon', diameter: 3475, temp: -20, gravity: 1.6, emits: false, madeOf: 'Rock', shape: 'round', atmosphere: 'Almost none.', note: 'Earth’s natural satellite. It shines by reflecting sunlight.' },
  { id: 'mars', name: 'Mars', kind: 'planet', diameter: 6792, distance: 228.0, temp: -65, gravity: 3.7, emits: false, madeOf: 'Rock and metal', shape: 'round', atmosphere: 'Thin, mostly carbon dioxide.', note: 'Red because of rusty dust. It has two small moons with irregular shapes.' },
  { id: 'ceres', name: 'Ceres', kind: 'dwarf planet', diameter: 940, distance: 413.7, gravity: 0.3, emits: false, madeOf: 'Rock and ice', shape: 'round', atmosphere: 'None.', note: 'The largest object in the main asteroid belt, between Mars and Jupiter.' },
  { id: 'asteroid', name: 'An asteroid', kind: 'asteroid', diameter: 1, emits: false, madeOf: 'Rock, sometimes metal', shape: 'irregular', atmosphere: 'None.', note: 'Most asteroids orbit in the main asteroid belt. Many are lumpy, like potatoes. Sizes range from about a metre to hundreds of kilometres.' },
  { id: 'jupiter', name: 'Jupiter', kind: 'planet', diameter: 142984, distance: 778.5, temp: -110, gravity: 23.1, emits: false, madeOf: 'Mostly gas', shape: 'round', atmosphere: 'Thick, mostly hydrogen and helium.', note: 'The largest planet. It has faint rings and a giant storm called the Great Red Spot.' },
  { id: 'saturn', name: 'Saturn', kind: 'planet', diameter: 120536, distance: 1432.0, temp: -140, gravity: 9.0, emits: false, madeOf: 'Mostly gas', shape: 'round', atmosphere: 'Thick, mostly hydrogen and helium.', note: 'Its bright rings of ice and rock are the easiest to see of any planet.' },
  { id: 'uranus', name: 'Uranus', kind: 'planet', diameter: 51118, distance: 2867.0, temp: -195, gravity: 8.7, emits: false, madeOf: 'Ices and gas', shape: 'round', atmosphere: 'Hydrogen, helium and methane.', note: 'An ice giant that spins tipped on its side. It has faint rings.' },
  { id: 'neptune', name: 'Neptune', kind: 'planet', diameter: 49528, distance: 4515.0, temp: -200, gravity: 11.0, emits: false, madeOf: 'Ices and gas', shape: 'round', atmosphere: 'Hydrogen, helium and methane.', note: 'The farthest planet from the Sun, with the fastest winds in the solar system.' },
  { id: 'pluto', name: 'Pluto', kind: 'dwarf planet', diameter: 2376, distance: 5906.4, temp: -225, gravity: 0.7, emits: false, madeOf: 'Rock and ice', shape: 'round', atmosphere: 'Very thin.', note: 'Called the ninth planet from 1930 until 2006, when it was reclassified as a dwarf planet.' },
  { id: 'comet', name: 'A comet', kind: 'comet', diameter: 10, emits: false, madeOf: 'Ice, dust and rock', shape: 'irregular', atmosphere: 'None, until it nears the Sun.', note: 'Near the Sun, its ice turns to gas and makes a glowing cloud and a long tail that reflect sunlight.' },
  { id: 'meteoroid', name: 'A meteoroid', kind: 'meteoroid', diameter: 0.001, emits: false, madeOf: 'Rock or metal', shape: 'irregular', atmosphere: 'None.', note: 'A small piece of rock or metal in space, from a grain of dust to about a metre across. If it enters Earth’s air it burns up as a streak of light.' },
];

/** The eight planets, closest to the Sun first. */
export const PLANET_ORDER = BODIES.filter((b) => b.kind === 'planet')
  .sort((a, b) => a.distance! - b.distance!)
  .map((b) => b.name);

/** How many times wider than Earth a body is, rounded sensibly for a child. */
export function timesEarth(b: Body): string {
  const r = b.diameter / 12756;
  if (b.id === 'earth') return 'Same as Earth';
  if (r >= 10) return `About ${Math.round(r)} times as wide as Earth`;
  if (r >= 1) return `About ${Math.round(r * 10) / 10} times as wide as Earth`;
  if (b.diameter >= 100) return `${b.diameter.toLocaleString('en-CA')} km across, smaller than Earth`;
  return 'Tiny compared with Earth';
}

/** Gravity compared with Earth's, as a child would say it. */
export function gravityText(b: Body): string {
  if (b.gravity === undefined) return 'Very weak';
  const r = b.gravity / 9.8;
  if (Math.abs(r - 1) < 0.1) return 'About the same as Earth';
  if (r > 1) return `About ${Math.round(r * 10) / 10} times Earth’s`;
  if (r >= 0.85) return 'A little less than Earth’s';
  if (r >= 0.3) return 'Less than half of Earth’s';
  if (r >= 0.15) return 'About one-sixth of Earth’s';
  return 'Very weak';
}

/** Scale model: where a body sits if the Sun is shrunk to a ball `sunM` metres wide. */
export function scaleModel(b: Body, sunM: number) {
  const k = sunM / 1392000;
  return { size: b.diameter * k, distance: (b.distance ?? 0) * 1e6 * k };
}
