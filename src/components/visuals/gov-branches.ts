// Branches of government, drawn as the three columns of a building that rests on a constitution.
// Used for the Roman Republic (outcome 0LESAYIP8UKL5ECn4gOmiw K1.10) and for Canada (outcome
// TmeAXRKA1UWMLoMTK8midA K1.3, K1.4, K1.6, K1.8, K1.11).
//
// Sources: Rome — Polybius, Histories 6.11-18; L. R. Taylor, Roman Voting Assemblies (1966).
// Canada — Parliament of Canada, "Our Procedure" and lop.parl.ca; Government of Canada, "Discover
// Canada" (2021); Legislative Assembly of Alberta, assembly.ab.ca.

export interface Branch {
  id: 'executive' | 'legislative' | 'judicial';
  name: string;
  icon: string;
  /** Short label on the column. */
  short: string;
  items: string[];
}

export interface GovSet {
  roof: string;
  base: string;
  branches: Branch[];
  check: string;
}

export const GOV_SETS: Record<'rome' | 'canada', GovSet> = {
  rome: {
    roof: 'The Roman Republic',
    base: 'Constitution: laws and customs',
    branches: [
      {
        id: 'executive',
        name: 'Executive',
        icon: '🦅',
        short: '2 consuls',
        items: [
          'Two **consuls**, elected by citizens for one year.',
          'They led the army and ran the government.',
        ],
      },
      {
        id: 'legislative',
        name: 'Legislative',
        icon: '📜',
        short: 'Senate and assemblies',
        items: [
          '**Senate:** about 300 men, most of them former magistrates. It gave advice and controlled money.',
          '**Comitia centuriata:** elected the consuls. Citizens voted in groups based on wealth.',
          '**Comitia tributa:** citizens voted in groups by tribe. It passed many laws.',
          '**Comitia curiata:** the oldest assembly. Later, it was mostly for ceremonies.',
          '**Concilium plebis:** plebeians only. It elected their own leaders and passed laws.',
        ],
      },
      {
        id: 'judicial',
        name: 'Judicial',
        icon: '⚖️',
        short: 'Judges',
        items: [
          'Elected officials called **praetors** ran the courts.',
          '**Judges** heard each case and decided it.',
        ],
      },
    ],
    check: 'Two consuls, not one king: each consul could **veto** (block) the other.',
  },
  canada: {
    roof: 'Canada',
    base: 'The Constitution',
    branches: [
      {
        id: 'executive',
        name: 'Executive',
        icon: '👑',
        short: 'Crown and prime minister',
        items: [
          'The **King** is represented by the **Governor General** in the federal government, and by a **lieutenant governor** in each province.',
          'The **prime minister** leads the federal government. A **premier** leads a provincial or territorial government.',
        ],
      },
      {
        id: 'legislative',
        name: 'Legislative',
        icon: '🏛️',
        short: 'Parliament and legislatures',
        items: [
          '**Parliament** in Ottawa. Citizens elect **MPs** to its House of Commons.',
          'A **legislative assembly** in each province and territory. Citizens elect **MLAs**.',
          'The **Official Opposition** questions the government and holds it to account.',
        ],
      },
      {
        id: 'judicial',
        name: 'Judicial',
        icon: '⚖️',
        short: 'Courts',
        items: [
          '**Judges** interpret the law and apply it to each case.',
          'They are **independent**: elected governments can’t tell them how to decide.',
        ],
      },
    ],
    check: 'Each branch has its own job, so no one person or group holds all the power.',
  },
};
