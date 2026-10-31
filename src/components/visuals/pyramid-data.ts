// Social classes for the pyramid, from the top down. `people` and `power` are out of 5 and only
// show the shape of the idea (outcome _qCBFNsjyUuxF_UmZ0xkwg, K1.7): the highest class had the
// fewest people and the most power. They are not measurements.

export interface SocialClass {
  id: string;
  name: string;
  people: number;
  power: number;
  basedOn: string;
  opportunities: string;
  challenges: string;
}

export const PYRAMIDS: { id: string; name: string; classes: SocialClass[] }[] = [
  {
    id: 'egypt',
    name: 'Ancient Egypt',
    classes: [
      { id: 'pharaoh', name: 'Pharaoh', people: 1, power: 5, basedOn: 'Heredity', opportunities: 'Led the army, made the laws and held great wealth.', challenges: 'Had to keep Egypt fed and defended. Rivals could plot against the throne.' },
      { id: 'nobles', name: 'Nobles and priests', people: 2, power: 4, basedOn: 'Heredity and wealth', opportunities: 'Ran the temples and regions, and lived in large homes.', challenges: 'Had to stay loyal to the pharaoh, or lose their place.' },
      { id: 'scribes', name: 'Scribes', people: 2, power: 3, basedOn: 'Education', opportunities: 'Reading and writing led to good government jobs, away from heavy labour.', challenges: 'Years of hard schooling, which few families could afford.' },
      { id: 'workers', name: 'Craftspeople and soldiers', people: 3, power: 2, basedOn: 'Occupation', opportunities: 'Could earn extra grain and respect for their skill.', challenges: 'Long, hard work, and danger in war.' },
      { id: 'lower', name: 'Farmers and enslaved people', people: 5, power: 1, basedOn: 'Born into it, or captured', opportunities: 'Farmers kept part of their harvest. A few enslaved people gained their freedom.', challenges: 'Farmers paid grain tax and worked on royal projects. Enslaved people had no freedom at all.' },
    ],
  },
  {
    id: 'rome',
    name: 'Ancient Rome',
    classes: [
      { id: 'emperor', name: 'Emperor', people: 1, power: 5, basedOn: 'Heredity and force', opportunities: 'Commanded the army, and had the final say on the law.', challenges: 'Rivals and the army could remove him. Many emperors were killed.' },
      { id: 'senators', name: 'Senators and the rich', people: 2, power: 4, basedOn: 'Heredity and wealth', opportunities: 'Held high office, owned land, and could afford a good education.', challenges: 'Had to pay for public games and buildings to keep their standing.' },
      { id: 'plebeians', name: 'Plebeians with a trade', people: 3, power: 3, basedOn: 'Occupation', opportunities: 'Citizen men could vote and join the army. Some grew rich in trade.', challenges: 'Long hours in shops and workshops, and little say in how Rome was run.' },
      { id: 'lower', name: 'The poor and enslaved people', people: 5, power: 1, basedOn: 'Born into it, or captured in war', opportunities: 'Poor citizen men could still vote. A few enslaved people bought their freedom, and some then ran a business.', challenges: 'The poor paid high rents in crowded buildings. Enslaved people were treated as property, and could be sold or beaten.' },
    ],
  },
];
