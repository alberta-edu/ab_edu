// Places in the story of democracy, for the Grade 6 democracy globe. Coordinates are [lat, lon] in
// degrees, north and east positive, at the real site. Only places the Grade 6 outcomes name:
// Athens, the Roman Republic, England (Magna Carta, Habeas Corpus Act, Bill of Rights), the
// Haudenosaunee Confederacy, and Canada's federal and provincial governments.
//
// Sources: Runnymede (National Trust); Onondaga Nation, onondaganation.org/government; Parliament of
// Canada, lop.parl.ca; Legislative Assembly of Alberta, assembly.ab.ca.

export interface DemocracyStop {
  id: string;
  /** The place, as a child would say it. */
  place: string;
  when: string;
  title: string;
  text: string;
  lat: number;
  lon: number;
  /** Alberta, marked in a different colour. */
  home?: boolean;
}

export const STOPS: DemocracyStop[] = [
  {
    id: 'athens',
    place: 'Athens, Greece',
    when: '508 BCE',
    title: 'Democracy begins',
    text: 'Athenians end the rule of tyrants. Male citizens now meet and vote on the laws themselves.',
    lat: 37.97,
    lon: 23.72,
  },
  {
    id: 'rome',
    place: 'Rome, Italy',
    when: 'about 509 to 27 BCE',
    title: 'The Roman Republic',
    text: 'Romans replace their king with leaders that citizens elect each year to decide for them.',
    lat: 41.89,
    lon: 12.49,
  },
  {
    id: 'runnymede',
    place: 'Runnymede, England',
    when: '1215',
    title: 'Magna Carta',
    text: 'Barons make King John agree that even the king has to follow the law.',
    lat: 51.44,
    lon: -0.56,
  },
  {
    id: 'westminster',
    place: 'London, England',
    when: '1679 and 1689',
    title: 'Habeas Corpus and the Bill of Rights',
    text: 'Parliament passes laws against unfair jailing, and for free elections and free speech in Parliament.',
    lat: 51.5,
    lon: -0.12,
  },
  {
    id: 'onondaga',
    place: 'Onondaga, in present-day New York State',
    when: 'from long ago to today',
    title: 'The Haudenosaunee Grand Council',
    text: 'Chiefs of the Haudenosaunee Nations meet on Onondaga territory and decide together, guided by the Great Law of Peace.',
    lat: 42.93,
    lon: -76.17,
  },
  {
    id: 'ottawa',
    place: 'Ottawa, Ontario',
    when: '1867 and 1982',
    title: 'The Parliament of Canada',
    text: 'Canada’s Parliament follows the British system. In 1982, the Charter of Rights and Freedoms joins the Constitution.',
    lat: 45.42,
    lon: -75.7,
  },
  {
    id: 'edmonton',
    place: 'Edmonton, Alberta',
    when: 'since 1906',
    title: 'Alberta’s Legislative Assembly',
    text: 'Albertans elect MLAs, who meet in the Legislature to make Alberta’s laws.',
    lat: 53.53,
    lon: -113.51,
    home: true,
  },
];
