// Logic and facts for the Athens assembly visual (Grade 6, outcome 0LESAYIP8UKL5ECn4gOmiw K1.7).
// Pure functions, so they can be tested and used both at build time and in the browser.
//
// Sources: Aristotle, The Athenian Constitution 43-44 (Council) and 63-69 (courts and bronze
// ballots); M. H. Hansen, The Athenian Democracy in the Age of Demosthenes (1991).

/** A small seeded random generator, so each run differs but tests are repeatable. */
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

export interface Tally {
  yes: number;
  no: number;
  passes: boolean;
}

/** Majority rule: a law passes when more people vote yes than no. */
export function tally(votes: boolean[]): Tally {
  const yes = votes.filter(Boolean).length;
  const no = votes.length - yes;
  return { yes, no, passes: yes > no };
}

/** Each citizen votes yes with probability `lean`. */
export function castVotes(n: number, lean: number, seed: number): boolean[] {
  const r = rng(seed);
  return Array.from({ length: n }, () => r() < lean);
}

/** Picks `take` different positions out of `size`, for each of `groups` groups: a lottery. */
export function drawLots(groups: number, size: number, take: number, seed: number): number[][] {
  const r = rng(seed);
  return Array.from({ length: groups }, () => {
    const pool = Array.from({ length: size }, (_, i) => i);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, take).sort((a, b) => a - b);
  });
}

/** Seats on the hillside, in arcs facing the speakers' platform. */
export function assemblySeats(rows: number[], cx: number, cy: number, r0: number, gap: number): [number, number][] {
  const seats: [number, number][] = [];
  rows.forEach((n, row) => {
    const r = r0 + row * gap;
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (1.12 + (0.76 * (i + 0.5)) / n);
      seats.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  });
  return seats;
}

export const ASSEMBLY_ROWS = [7, 9, 11, 13, 15];
export const TRIBES = 10;
/** Dots per tribe in the Council lottery. Each dot stands for 10 citizens. */
export const TRIBE_POOL = 10;
export const PER_TRIBE = 5;
export const JURORS = 21;

export interface Body {
  id: 'ecclesia' | 'boule' | 'dikasteria';
  name: string;
  english: string;
  icon: string;
  who: string;
  chosen: string;
  job: string;
  run: string;
}

export const BODIES: Body[] = [
  {
    id: 'ecclesia',
    name: 'Ecclesia',
    english: 'the Assembly',
    icon: '🗳️',
    who: 'Any male citizen could come. Thousands met on a hill called the Pnyx.',
    chosen: 'No one was chosen. Every male citizen had the right to attend.',
    job: 'Debated proposed laws, then voted. The majority decided.',
    run: '▶ Debate, then vote',
  },
  {
    id: 'boule',
    name: 'Boule',
    english: 'the Council of 500',
    icon: '🏛️',
    who: '500 male citizens: 50 from each of the 10 tribes of Athens.',
    chosen: 'By lottery, for one year.',
    job: 'Prepared the proposals that the Assembly would debate.',
    run: '▶ Draw by lottery',
  },
  {
    id: 'dikasteria',
    name: 'Dikasteria',
    english: 'the courts',
    icon: '⚖️',
    who: 'Large juries of male citizens aged 30 or older, often 201 or 501 of them.',
    chosen: 'By lottery, on the morning of the trial.',
    job: 'Judged cases, voting with bronze ballots in secret.',
    run: '▶ Vote in secret',
  },
];
