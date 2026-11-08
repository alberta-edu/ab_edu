// Who each Charter right protects (outcome CYaAx2qY8U6xcG-pEKyXhA K1.2, K1.3). The people are
// invented; the "who" comes from the words of each section.
//
// Source: Canadian Charter of Rights and Freedoms, Constitution Act, 1982, Part I
// (laws-lois.justice.gc.ca/eng/const/page-12.html): s. 2 "Everyone has", s. 3 "Every citizen",
// s. 6(2) "Every citizen ... and every person who has the status of a permanent resident",
// s. 11 "Any person charged", s. 15 "Every individual".

export interface Person {
  id: 'citizen' | 'resident' | 'visitor';
  icon: string;
  name: string;
  who: string;
}

export const PEOPLE: Person[] = [
  { id: 'citizen', icon: '🧑🏽', name: 'Maya, 35', who: 'a Canadian citizen' },
  { id: 'resident', icon: '🧑🏻', name: 'Amir, 30', who: 'a permanent resident' },
  { id: 'visitor', icon: '🧑🏾', name: 'Lucy, 25', who: 'a tourist visiting Banff' },
];

export interface CharterRight {
  id: string;
  name: string;
  kind: string;
  /** The Charter's own words for who holds the right. */
  words: string;
  protects: Person['id'][];
}

const ALL: Person['id'][] = ['citizen', 'resident', 'visitor'];

export const RIGHTS: CharterRight[] = [
  { id: 'religion', name: 'Freedom of religion', kind: 'Fundamental freedom · section 2', words: '“Everyone has” this freedom.', protects: ALL },
  { id: 'expression', name: 'Freedom of expression', kind: 'Fundamental freedom · section 2', words: '“Everyone has” this freedom.', protects: ALL },
  { id: 'assembly', name: 'Freedom of peaceful assembly', kind: 'Fundamental freedom · section 2', words: '“Everyone has” this freedom.', protects: ALL },
  { id: 'trial', name: 'A fair trial if charged with a crime', kind: 'Legal right · section 11', words: '“Any person charged” has this right.', protects: ALL },
  { id: 'equality', name: 'Equal treatment under the law', kind: 'Equality right · section 15', words: '“Every individual” has this right.', protects: ALL },
  { id: 'move', name: 'Live and work in any province', kind: 'Mobility right · section 6', words: 'Every citizen and every permanent resident has this right.', protects: ['citizen', 'resident'] },
  { id: 'vote', name: 'Vote in elections', kind: 'Democratic right · section 3', words: '“Every citizen” has this right.', protects: ['citizen'] },
];
