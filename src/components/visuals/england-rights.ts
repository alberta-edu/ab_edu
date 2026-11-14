// Three English documents that moved power from the monarch to Parliament and the law
// (outcome 0LESAYIP8UKL5ECn4gOmiw K1.12-K1.16, U1.1, S1.4).
//
// Sources: Magna Carta 1215, British Library translation (clauses 12, 14, 39, 40, 61);
// Habeas Corpus Act 1679 (31 Cha. 2 c. 2) and Bill of Rights 1689 (1 Will. & Mar. Sess. 2 c. 2),
// legislation.gov.uk. Clauses are paraphrased for Grade 6.

export type Principle = 'equality' | 'justice' | 'freedom' | 'representation';

export const PRINCIPLE_LABELS: Record<Principle, string> = {
  equality: 'Equality under law',
  justice: 'Justice',
  freedom: 'Freedom',
  representation: 'Representation',
};

export interface RightsStage {
  id: string;
  year: string;
  name: string;
  /** Beam angle in degrees: negative tips toward the monarch, positive toward Parliament. */
  tilt: number;
  what: string;
  points: string[];
  principles: Principle[];
}

export const STAGES: RightsStage[] = [
  {
    id: 'before',
    year: 'Before 1215',
    name: 'Absolute monarchy',
    tilt: -16,
    what: 'The king’s word is law. King John demands heavy taxes and punishes people as he likes. No one can stop him.',
    points: [],
    principles: [],
  },
  {
    id: 'magna-carta',
    year: '1215',
    name: 'Magna Carta',
    tilt: -7,
    what: 'Angry barons force King John to seal the Magna Carta, the "Great Charter", at Runnymede.',
    points: [
      'Even the king has to follow the law.',
      'No free man can be jailed or punished except by the law of the land.',
      'For some taxes, the king must first consult a council of barons and church leaders.',
    ],
    principles: ['equality', 'justice', 'representation'],
  },
  {
    id: 'habeas-corpus',
    year: '1679',
    name: 'Habeas Corpus Act',
    tilt: 2,
    what: 'Parliament passes a law to stop people being held in jail for no reason.',
    points: [
      'A person in jail can demand to be brought before a judge.',
      'If there is no lawful reason to hold them, they must go free.',
    ],
    principles: ['justice', 'freedom'],
  },
  {
    id: 'bill-of-rights',
    year: '1689',
    name: 'Bill of Rights',
    tilt: 12,
    what: 'William and Mary become king and queen. They accept a Bill of Rights from Parliament.',
    points: [
      'The monarch can’t set aside laws or raise taxes without Parliament.',
      'Elections to Parliament must be free.',
      'Members can speak freely in Parliament.',
      'Parliament must meet often.',
    ],
    principles: ['representation', 'freedom', 'equality'],
  },
];
