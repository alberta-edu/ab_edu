// Canada's hazard symbols for consumer products (Consumer Chemicals and Containers Regulations,
// 2001; Health Canada, "Stay Safe" guide). The picture names the hazard. An octagon frame, like a
// stop sign, means the contents are dangerous. An upside-down triangle, like a yield sign, means
// the container is dangerous. Used by the Grade 4 hazard explorer (SCI4-OI1-GQ1-LO1, K2.2, K2.3).

export type HazardId = 'poison' | 'flammable' | 'corrosive' | 'explosive';
export type Frame = 'octagon' | 'triangle';

export interface Hazard {
  id: HazardId;
  name: string;
  picture: string;
  /** What can happen, in a Grade 4 child's words. */
  danger: string;
  frame: Frame;
  /** Where a child might see it: home, school or community. */
  found: string;
}

export const HAZARDS: Hazard[] = [
  {
    id: 'poison',
    name: 'Poisonous',
    picture: 'A skull and crossbones',
    danger: 'It can make you very sick, or even kill you, if you swallow it, lick it or breathe it in.',
    frame: 'octagon',
    found: 'Windshield washer fluid and antifreeze in a garage',
  },
  {
    id: 'flammable',
    name: 'Flammable',
    picture: 'A flame',
    danger: 'It, or the fumes coming off it, can catch fire very easily near heat, flames or sparks.',
    frame: 'octagon',
    found: 'Gasoline at a gas station, and lighter fluid for a barbecue',
  },
  {
    id: 'corrosive',
    name: 'Corrosive',
    picture: 'Drops falling and eating into a surface',
    danger: 'It can burn your skin and eyes, or your throat and stomach if swallowed.',
    frame: 'octagon',
    found: 'Drain cleaner and oven cleaner under a kitchen sink',
  },
  {
    id: 'explosive',
    name: 'Explosive',
    picture: 'A container bursting into pieces',
    danger: 'The container can burst if it gets hot or is punched with a hole. Flying pieces can hurt you.',
    frame: 'triangle',
    found: 'Spray cans, like spray paint in the school art room',
  },
];

export const FRAME_MEANING: Record<Frame, string> = {
  octagon: 'An octagon, like a stop sign: what is inside is dangerous.',
  triangle: 'An upside-down triangle, like a yield sign: the container is dangerous.',
};

/** A regular octagon with flat top and bottom, centred on (50, 50). */
function octagon(r: number): string {
  const pts = Array.from({ length: 8 }, (_, k) => {
    const a = ((k * 45 + 22.5) * Math.PI) / 180;
    return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
  });
  return pts.join(' ');
}

const PICTURES: Record<HazardId, string> = {
  poison:
    '<circle cx="50" cy="40" r="15"/><rect x="42" y="50" width="16" height="9" rx="2"/>' +
    '<circle cx="44" cy="39" r="4" style="fill:var(--surface)"/><circle cx="56" cy="39" r="4" style="fill:var(--surface)"/>' +
    '<line x1="30" y1="62" x2="70" y2="76" style="stroke:var(--ink);stroke-width:7;stroke-linecap:round"/><line x1="70" y1="62" x2="30" y2="76" style="stroke:var(--ink);stroke-width:7;stroke-linecap:round"/>',
  flammable:
    '<path d="M50,22 Q66,40 62,56 Q70,52 68,44 Q80,60 70,74 Q60,82 50,82 Q36,82 30,72 Q24,60 34,48 Q34,58 40,60 Q36,40 50,22 Z"/>',
  corrosive:
    '<rect x="30" y="20" width="14" height="22" rx="2"/><path d="M37,44 l-3,6 a3,3 0 1,0 6,0 Z"/><path d="M37,56 l-2,4 a2,2 0 1,0 4,0 Z"/>' +
    '<path d="M22,74 L46,66 L50,70 L56,64 L60,70 L78,64 L78,74 Z"/>',
  explosive:
    '<path d="M50,26 L55,42 L72,34 L62,50 L78,56 L60,60 L64,76 L50,64 L36,76 L40,60 L22,56 L38,50 L28,34 L45,42 Z"/>' +
    '<rect x="14" y="22" width="6" height="6" transform="rotate(20 17 25)"/><rect x="80" y="70" width="6" height="6" transform="rotate(30 83 73)"/><rect x="80" y="24" width="5" height="5"/>',
};

/** Inline styles, so a symbol looks the same in a lesson, a problem or dark mode. */
const FRAME_STYLE = 'fill:var(--surface);stroke:var(--ink);stroke-width:5;stroke-linejoin:round';

/** One hazard symbol as an SVG string, 100 × 100. */
export function hazardSvg(id: HazardId, extraClass = ''): string {
  const h = HAZARDS.find((x) => x.id === id)!;
  const frame =
    h.frame === 'octagon'
      ? `<polygon style="${FRAME_STYLE}" points="${octagon(46)}"/>`
      : `<polygon style="${FRAME_STYLE}" points="5,10 95,10 50,93"/>`;
  const pic = h.frame === 'triangle' ? `<g transform="translate(50 40) scale(0.62) translate(-50 -50)">${PICTURES[id]}</g>` : PICTURES[id];
  return `<svg viewBox="0 0 100 100" class="g4s-hz ${extraClass}" role="img" aria-label="${h.name} symbol: ${h.picture.toLowerCase()} in ${h.frame === 'octagon' ? 'an octagon' : 'an upside-down triangle'}">${frame}<g style="fill:var(--ink)">${pic}</g></svg>`;
}
