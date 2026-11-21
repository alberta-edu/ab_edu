// Data for the Grade 4 law lens: how the Royal Proclamation (1763) and the Quebec Act (1774)
// changed ways of living for three groups (outcome XiuhdUoB8EacTXvZQi9Djw, K1.8 and K1.9).
// Sources: the text of the Royal Proclamation, 1763, and the Quebec Act, 1774 (Library and Archives
// Canada); the Canadian Encyclopedia articles "Royal Proclamation of 1763" and "Quebec Act, 1774".

export type Aspect = 'territory' | 'rights' | 'government' | 'land';

export const ASPECTS: { id: Aspect; label: string; icon: string }[] = [
  { id: 'territory', label: 'Size and place of territory', icon: '🗺️' },
  { id: 'rights', label: 'Religion and language', icon: '⛪' },
  { id: 'government', label: 'How it was governed', icon: '🏛️' },
  { id: 'land', label: 'Buying and using land', icon: '🌾' },
];

export const GROUPS = [
  { id: 'fn', label: 'First Nations', icon: '🪶' },
  { id: 'french', label: 'French colonists', icon: '⚜️' },
  { id: 'british', label: 'British colonists', icon: '👑' },
] as const;
export type Group = (typeof GROUPS)[number]['id'];

export const LAWS = [
  { id: 'rp', label: 'Royal Proclamation, 1763' },
  { id: 'qa', label: 'Quebec Act, 1774' },
] as const;
export type Law = (typeof LAWS)[number]['id'];

/** What changed, by law, group and aspect. A missing entry means little changed for that group. */
export const LENS: Record<Law, Record<Group, Partial<Record<Aspect, string>>>> = {
  rp: {
    fn: {
      territory: 'The land west of the colonies was kept for First Nations.',
      land: 'Settlers could not buy First Nations land. Only the Crown could, at a public meeting, if the First Nation agreed.',
      government: 'The Crown dealt with First Nations as nations.',
    },
    french: {
      territory: 'New France became a small Province of Quebec, along the St. Lawrence.',
      rights: 'They could still be Catholic. But Catholics could not hold government jobs.',
      government: 'British laws replaced French laws, under a British governor.',
    },
    british: {
      territory: 'They were told not to settle west of a line along the mountains.',
      land: 'Many were angry. They had hoped to farm the land to the west.',
      government: 'In Quebec, they were promised an assembly, with members chosen by voters.',
    },
  },
  qa: {
    fn: {
      territory: 'Many First Nations lands around the Great Lakes and the Ohio River were put inside Quebec.',
      government: 'The governor of Quebec now ran those lands for the Crown.',
    },
    french: {
      territory: 'Quebec grew much bigger, all the way to the Ohio River.',
      rights: 'Their language and their Catholic religion were recognized. Catholics could now hold government jobs.',
      government: 'French laws came back for property and daily life.',
      land: 'Land was held the French way again, under French laws.',
    },
    british: {
      government: 'Quebec got no assembly. A governor and a council chosen by the king ruled.',
      territory: 'In the Thirteen Colonies, people were angry. The western lands they wanted went to Quebec.',
    },
  },
};
