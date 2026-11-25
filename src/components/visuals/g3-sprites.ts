// Grade 3 science: a tiny keyframe engine for playful SVG scenes. A scene is a list of sprites
// (emoji, labels and simple shapes) whose numbers move between keyframes. Experiments play a scene
// from t = 0 to 1 when the child presses Run (G3Scene.astro). Visuals jump between numbered states,
// t = 0, 1, 2…, when the child taps a button (G3Play.astro). Scenes live in their own small files
// and are lazy-loaded, so a page only downloads the one it shows.

export type NumProp = 'x' | 'y' | 'w' | 'h' | 's' | 'r' | 'o' | 'x2' | 'y2' | 'size';
type Nums = Partial<Record<NumProp, number>>;
interface Flags {
  /** Emoji or label text. */
  text?: string;
  /** CSS class, or a fill colour. */
  cls?: string;
  fill?: string;
}
export type Key = Nums & Flags & { t: number };

export interface Sprite extends Nums, Flags {
  /**
   * emoji, text: centred on x, y, with font `size`.
   * rect: top-left x, y, size w × h, corner radius `rx`.
   * ellipse: centre x, y, width w and height h.
   * line: x, y to x2, y2.
   * path: `d` drawn around x, y, turned by r and scaled by s.
   * arrow: a force arrow from x, y, `w` long, pointing `r` degrees (0 = right, 90 = down).
   */
  kind: 'emoji' | 'text' | 'rect' | 'ellipse' | 'line' | 'path' | 'arrow';
  d?: string;
  rx?: number;
  stroke?: string;
  sw?: number;
  anchor?: 'start' | 'middle' | 'end';
  keys?: Key[];
}

export interface Scene {
  w: number;
  h: number;
  /** Static SVG drawn under the sprites (sky, ground, a jar…). */
  bg?: string;
  sprites: Sprite[];
}

/** An experiment: played once from t = 0 to t = 1 over `ms`. */
export interface RunScene extends Scene {
  ms: number;
  /** Read to screen readers when the run ends. Says what the animation showed. */
  live: string;
}

/** A visual: states 0, 1, 2… with a sentence each. Keys use the state number as t. */
export interface PlayScene extends Scene {
  states: { label: string; say: string }[];
  /** "steps": Back and Next buttons. "jump": one button per state. */
  mode: 'steps' | 'jump';
  /** Labels for the Back and Next buttons in "steps" mode. */
  back?: string;
  next?: string;
}

export const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** The value of one number at time t: eased between the keys that set it. The sprite's own value counts as a key at t = 0. */
export function numAt(sp: Sprite, prop: NumProp, t: number, fallback = 0): number {
  const pts: [number, number][] = [];
  if (sp[prop] !== undefined) pts.push([0, sp[prop]!]);
  for (const k of sp.keys ?? []) if (k[prop] !== undefined) pts.push([k.t, k[prop]!]);
  if (!pts.length) return fallback;
  pts.sort((a, b) => a[0] - b[0]);
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [t1, v1] = pts[i];
    const [t0, v0] = pts[i - 1];
    if (t <= t1) return t1 === t0 ? v1 : v0 + (v1 - v0) * ease((t - t0) / (t1 - t0));
  }
  return pts[pts.length - 1][1];
}

/** Text, class or fill at time t: the latest key at or before t. */
export function flagAt(sp: Sprite, prop: keyof Flags, t: number): string | undefined {
  let v = sp[prop];
  let best = -Infinity;
  for (const k of sp.keys ?? []) if (k[prop] !== undefined && k.t <= t + 1e-9 && k.t >= best) {
    v = k[prop];
    best = k.t;
  }
  return v;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const f = (n: number) => (Math.round(n * 10) / 10).toString();

/** One sprite as SVG at time t, or '' while it is invisible. */
export function spriteSvg(sp: Sprite, t: number): string {
  const n = (p: NumProp, d = 0) => numAt(sp, p, t, d);
  const o = n('o', 1);
  if (o <= 0.01) return '';
  const cls = flagAt(sp, 'cls', t);
  const fill = flagAt(sp, 'fill', t);
  const paint = `${cls ? ` class="${cls}"` : ''}${fill ? ` fill="${fill}"` : ''}${sp.stroke ? ` stroke="${sp.stroke}" stroke-width="${sp.sw ?? 2}"` : ''}`;
  const op = o < 0.99 ? ` opacity="${f(o)}"` : '';
  const x = n('x');
  const y = n('y');
  const r = n('r');
  const s = n('s', 1);
  const move = `translate(${f(x)} ${f(y)})${r ? ` rotate(${f(r)})` : ''}${s !== 1 ? ` scale(${f(s)})` : ''}`;
  switch (sp.kind) {
    case 'emoji':
    case 'text': {
      const text = flagAt(sp, 'text', t) ?? '';
      if (!text) return '';
      const size = n('size', sp.kind === 'emoji' ? 40 : 20);
      const weight = sp.kind === 'text' ? ' font-weight="700"' : '';
      return `<g transform="${move}"${op}><text${paint} font-size="${f(size)}"${weight} text-anchor="${sp.anchor ?? 'middle'}" dominant-baseline="central">${esc(text)}</text></g>`;
    }
    case 'rect': {
      const w = n('w');
      const h = n('h');
      if (w <= 0.05 || h <= 0.05) return '';
      const turn = r ? ` transform="rotate(${f(r)} ${f(x + w / 2)} ${f(y + h / 2)})"` : '';
      return `<rect${paint} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${sp.rx ? ` rx="${sp.rx}"` : ''}${turn}${op}/>`;
    }
    case 'ellipse': {
      const w = n('w');
      const h = n('h');
      if (w <= 0.05 || h <= 0.05) return '';
      return `<ellipse${paint} cx="${f(x)}" cy="${f(y)}" rx="${f(w / 2)}" ry="${f(h / 2)}"${op}/>`;
    }
    case 'line':
      return `<line${paint} x1="${f(x)}" y1="${f(y)}" x2="${f(n('x2'))}" y2="${f(n('y2'))}"${op}/>`;
    case 'path':
      return `<path${paint} d="${sp.d}" transform="${move}"${op}/>`;
    case 'arrow': {
      const len = n('w');
      if (len < 4) return '';
      const thick = n('h', 8);
      const head = Math.min(len, thick * 2.4);
      const body = len - head;
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(r)})"${op}><rect${paint} x="0" y="${f(-thick / 2)}" width="${f(body)}" height="${f(thick)}"/><polygon${paint} points="${f(body)},${f(-thick * 1.3)} ${f(len)},0 ${f(body)},${f(thick * 1.3)}"/></g>`;
    }
  }
}

/** The whole scene at time t. */
export function sceneSvg(sc: Scene, t: number): string {
  return (sc.bg ?? '') + sc.sprites.map((sp) => spriteSvg(sp, t)).join('');
}

/** Problems a scene file could have that would draw the wrong picture quietly. Used by the tests. */
export function sceneIssues(sc: Scene, tMax: number): string[] {
  const out: string[] = [];
  sc.sprites.forEach((sp, i) => {
    for (const k of sp.keys ?? []) if (k.t < 0 || k.t > tMax) out.push(`sprite ${i}: key at t=${k.t} is outside 0–${tMax}`);
    if (sp.kind === 'path' && !sp.d) out.push(`sprite ${i}: path without d`);
    if ((sp.kind === 'emoji' || sp.kind === 'text') && !sp.text && !(sp.keys ?? []).some((k) => k.text)) out.push(`sprite ${i}: no text`);
  });
  return out;
}

// ---------------------------------------------------------------- helpers for scene files

/** A sprite that fades in at t0 (over `fade`) and, if t1 is given, out at t1. */
export function showFrom(sp: Sprite, t0: number, t1?: number, fade = 0.04): Sprite {
  const keys: Key[] = [...(sp.keys ?? []), { t: Math.max(0, t0 - fade), o: 0 }, { t: t0, o: 1 }];
  if (t1 !== undefined) keys.push({ t: t1, o: 1 }, { t: t1 + fade, o: 0 });
  return { ...sp, o: 0, keys };
}

/** Falling drops (rain, snow) between t0 and t1, over a strip of sky. */
export function falling(text: string, n: number, x0: number, x1: number, y0: number, y1: number, t0: number, t1: number, size = 18, cls?: string): Sprite[] {
  const out: Sprite[] = [];
  const span = t1 - t0;
  for (let i = 0; i < n; i++) {
    const x = x0 + ((i * 37) % 100) / 100 * (x1 - x0);
    const start = t0 + ((i * 0.618) % 1) * span * 0.5;
    const end = Math.min(t1, start + span * 0.5);
    out.push({ kind: 'emoji', text, size, x, y: y0, o: 0, cls, keys: [{ t: start, o: 0, y: y0 }, { t: start + 0.01, o: 1 }, { t: end - 0.01, o: 1 }, { t: end, y: y1, o: 0 }] });
  }
  return out;
}

/** A label that changes over time, such as "Day 1", "Day 2". */
export function ticker(x: number, y: number, steps: [number, string][], size = 20, anchor: 'start' | 'middle' | 'end' = 'start'): Sprite {
  return { kind: 'text', x, y, size, anchor, cls: 'g3s-label', text: steps[0][1], keys: steps.map(([t, text]) => ({ t, text })) };
}

/** A play sprite that shows only at state i of n, fading as the picture moves between states. */
export function only(sp: Sprite, i: number, n: number): Sprite {
  const keys: Key[] = [...(sp.keys ?? [])];
  for (let t = 0; t < n; t++) keys.push({ t, o: t === i ? 1 : 0 });
  return { ...sp, o: i === 0 ? 1 : 0, keys };
}

/** A play sprite that shows from state i onward (and, if given, until state j). */
export function from(sp: Sprite, i: number, n: number, j = n - 1): Sprite {
  const keys: Key[] = [...(sp.keys ?? [])];
  for (let t = 0; t < n; t++) keys.push({ t, o: t >= i && t <= j ? 1 : 0 });
  return { ...sp, o: i === 0 ? 1 : 0, keys };
}
