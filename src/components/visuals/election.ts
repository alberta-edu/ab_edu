// A made-up provincial election (outcome TmeAXRKA1UWMLoMTK8midA K1.5-K1.8, S1.3, S1.4). In each
// riding, the candidate with the most votes wins a seat. The party with the most seats forms the
// government and its leader becomes premier; the party with the next most seats is the Official
// Opposition. Parties, ridings and votes are invented.
//
// Source for the process: Elections Alberta and Elections Canada, "How elections work".
import { rng } from './athens-assembly.ts';

export interface Party {
  id: 'wheat' | 'river' | 'rose';
  name: string;
  icon: string;
  colour: string;
}

export const PARTIES: Party[] = [
  { id: 'wheat', name: 'Wheat Party', icon: '🌾', colour: '#8a6100' },
  { id: 'river', name: 'River Party', icon: '🌊', colour: '#1a6b82' },
  { id: 'rose', name: 'Rose Party', icon: '🌹', colour: '#9c3468' },
];

export const RIDINGS = [
  'Aspen Grove', 'Bow Bend', 'Chinook Flats', 'Coulee Creek', 'Fireweed',
  'Hoodoo Valley', 'Larch Hill', 'Magpie Lake', 'Owl Ridge', 'Poplar Point',
  'Red Willow', 'Sage Hill', 'Spruce Bluff', 'Wild Rose', 'Yellow Grass',
];

export type Votes = Record<Party['id'], number>;

export interface RidingResult {
  name: string;
  votes: Votes;
  winner: Party['id'];
}

export interface ElectionResult {
  ridings: RidingResult[];
  seats: Votes;
  government: Party['id'];
  opposition: Party['id'];
}

/** The winner of a riding: the candidate with the most votes. Null on a tie. */
export function ridingWinner(votes: Votes): Party['id'] | null {
  const sorted = (Object.entries(votes) as [Party['id'], number][]).sort((a, b) => b[1] - a[1]);
  return sorted[0][1] === sorted[1][1] ? null : sorted[0][0];
}

/** Seats per party, and who forms the government and the Official Opposition. Null on a tie. */
export function tallySeats(winners: Party['id'][]): Pick<ElectionResult, 'seats' | 'government' | 'opposition'> | null {
  const seats: Votes = { wheat: 0, river: 0, rose: 0 };
  for (const w of winners) seats[w]++;
  const order = (Object.entries(seats) as [Party['id'], number][]).sort((a, b) => b[1] - a[1]);
  if (order[0][1] === order[1][1] || order[1][1] === order[2][1]) return null;
  return { seats, government: order[0][0], opposition: order[1][0] };
}

/** A whole election. Tries seeds until there are no ties, so the result always teaches clearly. */
export function runElection(seed: number): ElectionResult {
  for (let s = seed; ; s++) {
    const r = rng(s);
    const lean = PARTIES.map(() => 0.6 + r() * 0.8);
    const ridings: RidingResult[] = [];
    let ok = true;
    for (const name of RIDINGS) {
      const votes = { wheat: 0, river: 0, rose: 0 } as Votes;
      PARTIES.forEach((p, i) => (votes[p.id] = Math.round((150 + r() * 450) * lean[i])));
      const winner = ridingWinner(votes);
      if (!winner) {
        ok = false;
        break;
      }
      ridings.push({ name, votes, winner });
    }
    const tally = ok ? tallySeats(ridings.map((x) => x.winner)) : null;
    if (tally) return { ridings, ...tally };
  }
}
