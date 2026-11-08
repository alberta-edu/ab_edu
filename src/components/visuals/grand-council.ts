// The Haudenosaunee Grand Council (outcome 0LESAYIP8UKL5ECn4gOmiw K1.17-K1.19, U1.4, S1.5).
//
// Sources, both Haudenosaunee: the Onondaga Nation, "Government" (onondaganation.org/government),
// for the 50 leaders on three benches and how a matter passes between them until all are of one
// mind; and the Haudenosaunee Confederacy, "Confederacy Structure"
// (haudenosauneeconfederacy.com/government), for the same order and for the Clan Mothers' role.

export interface Nation {
  name: string;
  chiefs: number;
}

export interface Bench {
  id: 'fire' | 'elder' | 'younger';
  name: string;
  nations: Nation[];
  note?: string;
}

export const BENCHES: Bench[] = [
  { id: 'fire', name: 'Firekeepers', nations: [{ name: 'Onondaga', chiefs: 14 }] },
  { id: 'elder', name: 'Elder Brothers', nations: [{ name: 'Mohawk', chiefs: 9 }, { name: 'Seneca', chiefs: 8 }] },
  {
    id: 'younger',
    name: 'Younger Brothers',
    nations: [{ name: 'Oneida', chiefs: 9 }, { name: 'Cayuga', chiefs: 10 }],
    note: 'The Tuscarora joined in the 1700s. Their voice comes with the Younger Brothers.',
  },
];

export const totalChiefs = (benches: Bench[] = BENCHES) => benches.reduce((n, b) => n + b.nations.reduce((m, x) => m + x.chiefs, 0), 0);

export interface CouncilStep {
  at: Bench['id'];
  say: string;
}

/** The path a matter takes. If the Younger Brothers disagree, it goes back for more talk first. */
export function councilSteps(disagree: boolean): CouncilStep[] {
  const steps: CouncilStep[] = [
    { at: 'fire', say: 'The Onondaga, the Firekeepers, bring a matter to the council.' },
    { at: 'elder', say: 'Mohawk and Seneca Chiefs talk it over until they are of one mind.' },
    { at: 'younger', say: 'They pass it across the fire. Oneida and Cayuga Chiefs talk it over.' },
  ];
  if (disagree) {
    steps.push(
      { at: 'elder', say: 'The Younger Brothers don’t agree, so it goes back for more discussion.' },
      { at: 'younger', say: 'The Elder Brothers send back a changed idea. This time the Younger Brothers agree.' },
    );
  }
  steps.push(
    { at: 'elder', say: 'Both sides of the fire now agree.' },
    { at: 'fire', say: 'The Firekeepers confirm it. The whole council is of one mind: that is consensus.' },
  );
  return steps;
}
