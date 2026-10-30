// Force arrows and simple object drawings, shared by the force diagrams in problems and the
// flight and buoyancy visuals. Everything is SVG with CSS classes, so it follows the theme.

export type ForceKind = 'thrust' | 'drag' | 'lift' | 'weight' | 'buoyant';

export const FORCE_LABEL: Record<ForceKind, string> = {
  thrust: 'Thrust',
  drag: 'Drag',
  lift: 'Lift',
  weight: 'Weight',
  buoyant: 'Buoyant force',
};

/** Direction each force points in a side view where the object moves to the right. */
const DIR: Record<ForceKind, [number, number]> = {
  thrust: [1, 0],
  drag: [-1, 0],
  lift: [0, -1],
  weight: [0, 1],
  buoyant: [0, -1],
};

/**
 * One arrow from (x, y), `len` pixels long, in the direction of the force. The label sits just
 * past the tip. Returns '' for a zero-length arrow.
 */
export function forceArrow(kind: ForceKind, x: number, y: number, len: number, label: string | false = FORCE_LABEL[kind]): string {
  if (len < 1) return '';
  const [dx, dy] = DIR[kind];
  const head = Math.min(14, len * 0.6);
  const x2 = x + dx * len;
  const y2 = y + dy * len;
  const bx = x2 - dx * head;
  const by = y2 - dy * head;
  const w = head * 0.62;
  const tri = `${x2},${y2} ${bx - dy * w},${by + dx * w} ${bx + dy * w},${by - dx * w}`;
  let text = '';
  if (label) {
    const lx = x2 + dx * 10;
    const ly = y2 + dy * 10 + (dy === 0 ? 6 : dy > 0 ? 14 : 0);
    const anchor = dx > 0 ? 'start' : dx < 0 ? 'end' : 'middle';
    text = `<text class="fa-label fa-label--${kind}" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}">${label}</text>`;
  }
  return `<g class="fa fa--${kind}"><line x1="${x}" y1="${y}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}"/><polygon points="${tri}"/>${text}</g>`;
}

export type ObjectKind = 'plane' | 'bird' | 'arrow' | 'spear' | 'stone' | 'boat' | 'block' | 'egg' | 'balloon' | 'ball';

/** Simple side-view drawings centred on (0, 0), about 120 px wide at most. */
export const OBJECT_SVG: Record<ObjectKind, string> = {
  plane:
    '<path class="obj" d="M-78,-7 L58,-10 Q84,-8 90,0 Q84,8 58,9 L-78,7 Z"/><path class="obj" d="M-78,-6 L-94,-34 L-74,-34 L-54,-7 Z"/><path class="obj obj--dark" d="M-12,2 L-38,28 L-18,28 L22,2 Z"/><circle class="obj-window" cx="70" cy="-3" r="3.5"/>',
  bird:
    '<path class="obj" d="M-58,2 Q-26,-10 6,-6 Q30,-12 48,-6 L64,0 L48,4 Q20,12 -6,8 Q-34,10 -58,2 Z"/><path class="obj obj--dark" d="M-6,-6 Q-26,-46 -54,-56 Q-30,-28 -22,-4 Z"/><path class="obj" d="M-58,2 L-80,-8 L-76,10 Z"/><circle class="obj-eye" cx="50" cy="-4" r="2.5"/>',
  arrow:
    '<line class="obj-line" x1="-96" y1="0" x2="80" y2="0"/><path class="obj obj--dark" d="M100,0 L78,-9 L82,0 L78,9 Z"/><path class="obj" d="M-96,0 L-80,-11 L-62,-11 L-74,0 L-62,11 L-80,11 Z"/>',
  spear:
    '<line class="obj-line" x1="-112" y1="0" x2="70" y2="0"/><path class="obj obj--dark" d="M110,0 Q86,-11 66,-6 L66,6 Q86,11 110,0 Z"/>',
  stone: '<path class="obj obj--dark" d="M-15,-6 Q-12,-16 2,-15 Q16,-14 16,-2 Q16,13 0,14 Q-17,13 -15,-6 Z"/>',
  boat: '<path class="obj" d="M-72,-12 L72,-12 L50,22 L-50,22 Z"/><line class="obj-line" x1="0" y1="-12" x2="0" y2="-62"/><path class="obj obj--dark" d="M3,-60 L40,-20 L3,-20 Z"/>',
  block: '<rect class="obj" x="-36" y="-36" width="72" height="72" rx="5"/>',
  egg: '<ellipse class="obj obj--egg" cx="0" cy="0" rx="22" ry="29"/>',
  balloon:
    '<ellipse class="obj obj--balloon" cx="0" cy="-12" rx="32" ry="40"/><path class="obj obj--balloon" d="M-6,28 L6,28 L0,22 Z"/><path class="obj-string" d="M0,28 Q-8,44 2,58 Q10,70 0,82"/>',
  ball: '<circle class="obj" cx="0" cy="0" r="30"/>',
};

export interface ForceSpec {
  kind: ForceKind;
  /** Relative arrow length, 1 = normal. */
  size?: number;
  label?: string;
}

/**
 * A force diagram: an object with its forces drawn as arrows from its centre. With `water`
 * the object floats at a water line, and buoyant force replaces lift for the upward arrow.
 */
export function forceDiagram(object: ObjectKind, forces: ForceSpec[], opts: { water?: boolean; title?: string } = {}): string {
  const BASE = 68;
  // Arrows start at the edge of the object so they don't hide it.
  const edge: Record<ForceKind, number> = { thrust: 0, drag: 0, lift: 0, weight: 0, buoyant: 0 };
  const half = { plane: [92, 12], bird: [66, 12], arrow: [100, 12], spear: [112, 10], stone: [17, 16], boat: [72, 22], block: [36, 36], egg: [22, 29], balloon: [32, 52], ball: [30, 30] }[object];
  edge.thrust = edge.drag = half[0] + 4;
  edge.lift = edge.buoyant = edge.weight = half[1] + 4;
  const arrows = forces
    .map((f) => {
      const len = BASE * (f.size ?? 1);
      const [dx, dy] = DIR[f.kind];
      return forceArrow(f.kind, dx * edge[f.kind], dy * edge[f.kind], len, f.label ?? FORCE_LABEL[f.kind]);
    })
    .join('');
  const water = opts.water ? '<rect class="sci-water" x="-230" y="6" width="460" height="200"/><line class="sci-surface" x1="-230" y1="6" x2="230" y2="6"/>' : '';
  const names = forces.map((f) => f.label ?? FORCE_LABEL[f.kind]).join(', ');
  const aria = opts.title ?? `Force diagram: ${object} with ${names}.`;
  return `<svg viewBox="-230 -175 460 330" class="fig-svg force-svg" role="img" aria-label="${aria}">${water}<g>${OBJECT_SVG[object]}</g>${arrows}</svg>`;
}
