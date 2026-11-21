// Data for the Grade 4 fur-trade visual (FurTrade.astro). Prices are made up for the model, in made
// beaver: the Hudson's Bay Company's unit of value, one prime beaver skin (Canadian Encyclopedia,
// "Made Beaver"). `rival` is the price once a rival post opens next door.

export const START_PELTS = 12;

export interface PostGood {
  id: string;
  name: string;
  icon: string;
  price: number;
  rival: number;
}

export const POST_GOODS: PostGood[] = [
  { id: 'kettle', name: 'Kettle', icon: '🍲', price: 5, rival: 4 },
  { id: 'blanket', name: 'Wool blanket', icon: '🛏️', price: 6, rival: 5 },
  { id: 'axe', name: 'Axe', icon: '🪓', price: 3, rival: 2 },
  { id: 'knife', name: 'Knife', icon: '🔪', price: 1, rival: 1 },
  { id: 'needles', name: 'Needles', icon: '🪡', price: 1, rival: 1 },
  { id: 'cloth', name: 'Cloth', icon: '🧵', price: 2, rival: 2 },
];

export interface FortPart {
  id: string;
  name: string;
  icon: string;
  about: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The parts of a trading post, laid out on a 720 by 360 drawing. */
export const FORT_PARTS: FortPart[] = [
  { id: 'gate', name: 'Gate and yard', icon: '🚪', about: 'People arrived by canoe and met in the yard. Leaders greeted each other before any trade began.', x: 290, y: 250, w: 140, h: 70 },
  { id: 'trade', name: 'Trading room', icon: '🤝', about: 'Here furs were **bartered**: swapped for goods, with no money. A clerk kept count of every trade.', x: 100, y: 80, w: 170, h: 120 },
  { id: 'store', name: 'Warehouse', icon: '📦', about: 'Furs waited here for the ships. Goods, supplies and medicines were stored here too.', x: 290, y: 80, w: 150, h: 120 },
  { id: 'house', name: 'Living quarters', icon: '🛏️', about: 'Workers and travellers slept and ate here. A post was a place to lodge, far from any town.', x: 460, y: 80, w: 160, h: 120 },
];
