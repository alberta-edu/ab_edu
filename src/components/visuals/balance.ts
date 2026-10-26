// Solving a·x + b = c on a balance: undo the addition on both sides, then share both sides
// into a equal groups. Equality is kept because each step does the same thing to both sides
// (MAT5-OI2-GQ1-LO1: K3.1, K3.2, U3.1, U3.2, S3.2-S3.4).

export interface Scene {
  leftBags: number;
  leftCubes: number;
  rightCubes: number;
  /** Cubes about to be removed (highlighted) on each side. */
  takeLeft?: number;
  takeRight?: number;
  /** Split both sides into this many groups (dashed boxes), keeping one. */
  groups?: number;
  /** Bags shown opened with their value, for checking. */
  reveal?: number;
  /** Beam tilt in degrees; positive tips the right pan down. */
  tilt?: number;
}

export interface BalanceFrame {
  scene: Scene;
  equation: string;
  caption: string;
}

export function solveFrames(a: number, b: number, c: number, x = 'x'): BalanceFrame[] {
  if ((c - b) % a !== 0 || c - b <= 0) throw new Error(`${a}${x} + ${b} = ${c} has no whole-number solution`);
  const sol = (c - b) / a;
  const lhs = (bags: number, cubes: number) => `${bags === 1 ? '' : bags}${x}${cubes ? ` + ${cubes}` : ''}`;
  const frames: BalanceFrame[] = [];
  frames.push({
    scene: { leftBags: a, leftCubes: b, rightCubes: c },
    equation: `${lhs(a, b)} = ${c}`,
    caption: `Each bag holds the same unknown number, ${x}. The scale balances, so both sides are equal.`,
  });
  if (b) {
    frames.push({
      scene: { leftBags: a, leftCubes: b, rightCubes: c, takeLeft: b, takeRight: b },
      equation: `${lhs(a, b)} − ${b} = ${c} − ${b}`,
      caption: `Undo "+ ${b}": take ${b} cubes off BOTH sides. Subtracting is the inverse of adding.`,
    });
    frames.push({
      scene: { leftBags: a, leftCubes: 0, rightCubes: c - b },
      equation: `${lhs(a, 0)} = ${c - b}`,
      caption: `Still balanced, because both sides changed the same way.`,
    });
  }
  if (a > 1) {
    frames.push({
      scene: { leftBags: a, leftCubes: 0, rightCubes: c - b, groups: a },
      equation: `${a}${x} ÷ ${a} = ${c - b} ÷ ${a}`,
      caption: `Undo "× ${a}": share both sides into ${a} equal groups. Dividing is the inverse of multiplying.`,
    });
  }
  frames.push({
    scene: { leftBags: 1, leftCubes: 0, rightCubes: sol },
    equation: `${x} = ${sol}`,
    caption: `One bag balances ${sol} cubes. The solution is ${x} = ${sol}.`,
  });
  frames.push({
    scene: { leftBags: a, leftCubes: b, rightCubes: c, reveal: sol },
    equation: `${a === 1 ? '' : `${a} × `}${sol}${b ? ` + ${b}` : ''} = ${c} ✓`,
    caption: `Check: put ${sol} in every bag. ${a === 1 ? '' : `${a} × ${sol} = ${a * sol}, `}${b ? `${a * sol} + ${b} = ${c}. ` : ''}Both sides are ${c}.`,
  });
  return frames;
}

/** A wrong move: changing only one side tips the scale. */
export function wrongMove(a: number, b: number, c: number): BalanceFrame {
  const take = Math.max(1, b || 2);
  return {
    scene: { leftBags: a, leftCubes: Math.max(0, b - take), rightCubes: c, tilt: 12 },
    equation: `≠`,
    caption: `Taking ${take} cube${take === 1 ? '' : 's'} off only the left side tips the scale. The sides are no longer equal. Always do the same to both sides.`,
  };
}

// ---------------------------------------------------------------- drawing

const CUBE = 16;
const GAP = 3;
const PER_ROW = 6;

function cubes(n: number, x0: number, yBase: number, take = 0, groups = 0, cls = 'bs-cube'): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const g = groups ? Math.floor(i / (n / groups)) : 0;
    const iInGroup = groups ? i % (n / groups) : i;
    const perRow = groups ? Math.max(1, Math.ceil(n / groups / 3)) : PER_ROW;
    const colsGroupW = groups ? perRow * (CUBE + GAP) + 10 : 0;
    const col = iInGroup % perRow;
    const row = Math.floor(iInGroup / perRow);
    const x = x0 + g * colsGroupW + col * (CUBE + GAP);
    const y = yBase - (row + 1) * (CUBE + GAP);
    const removing = i >= n - take;
    const faded = groups && g > 0;
    s += `<rect class="${cls}${removing ? ' bs-take' : ''}${faded ? ' bs-faded' : ''}" x="${x}" y="${y}" width="${CUBE}" height="${CUBE}" rx="3"/>`;
  }
  if (groups) {
    const per = n / groups;
    const perRow = Math.max(1, Math.ceil(per / 3));
    const w = perRow * (CUBE + GAP) + 6;
    const rows = Math.ceil(per / perRow);
    for (let g = 0; g < groups; g++) {
      const x = x0 + g * (w + 4) - 3;
      s += `<rect class="bs-group${g ? ' bs-faded' : ''}" x="${x}" y="${yBase - rows * (CUBE + GAP) - 6}" width="${w}" height="${rows * (CUBE + GAP) + 6}" rx="6"/>`;
    }
  }
  return s;
}

function bags(n: number, x0: number, yBase: number, letter: string, reveal?: number, groups = 0): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * 44;
    const faded = groups && i > 0;
    s += `<g class="bs-bag${faded ? ' bs-faded' : ''}" transform="translate(${x} ${yBase - 46})"><path d="M14 4 C15 9, 8 13, 5 22 C1 36, 8 44, 20 44 C32 44, 39 36, 35 22 C32 13, 25 9, 26 4 Z"/><text x="20" y="34" text-anchor="middle">${reveal ?? letter}</text></g>`;
    if (groups) s += `<rect class="bs-group${faded ? ' bs-faded' : ''}" x="${x - 3}" y="${yBase - 52}" width="46" height="54" rx="6"/>`;
  }
  return s;
}

export function balanceSvg(f: BalanceFrame, letter = 'x'): string {
  const { scene: s } = f;
  const tilt = s.tilt ?? 0;
  const cx = 300;
  const beamY = 70;
  const half = 200;
  const dy = Math.sin((tilt * Math.PI) / 180) * half;
  const panY = (side: -1 | 1) => beamY + 20 + side * dy + 70;
  const leftX = cx - half;
  const rightX = cx + half;
  let out = `<polygon class="bs-stand" points="${cx - 40},270 ${cx + 40},270 ${cx},${beamY}"/>`;
  out += `<line class="bs-beam" x1="${leftX}" y1="${beamY - dy}" x2="${rightX}" y2="${beamY + dy}"/>`;
  out += `<circle class="bs-pivot" cx="${cx}" cy="${beamY}" r="8"/>`;
  for (const side of [-1, 1] as const) {
    const px = side < 0 ? leftX : rightX;
    const py = panY(side);
    out += `<line class="bs-string" x1="${px}" y1="${beamY + side * dy}" x2="${px - 75}" y2="${py}"/><line class="bs-string" x1="${px}" y1="${beamY + side * dy}" x2="${px + 75}" y2="${py}"/>`;
    out += `<path class="bs-pan" d="M${px - 90} ${py} L${px + 90} ${py} Q${px} ${py + 26} ${px - 90} ${py} Z"/>`;
  }
  const lp = panY(-1);
  const rp = panY(1);
  const leftW = s.leftBags * 44 + (s.leftCubes ? Math.min(s.leftCubes, PER_ROW) * (CUBE + GAP) + 6 : 0);
  let lx = leftX - leftW / 2;
  out += bags(s.leftBags, lx, lp, letter, s.reveal, s.groups);
  lx += s.leftBags * 44 + 6;
  out += cubes(s.leftCubes, lx, lp, s.takeLeft ?? 0);
  const groupsW = s.groups ? s.groups * (Math.max(1, Math.ceil(s.rightCubes / s.groups / 3)) * (CUBE + GAP) + 10) : Math.min(s.rightCubes, PER_ROW) * (CUBE + GAP);
  out += cubes(s.rightCubes, rightX - groupsW / 2, rp, s.takeRight ?? 0, s.groups);
  return `<svg viewBox="0 0 600 290" class="bs-svg" role="img" aria-label="${f.equation}">${out}</svg>`;
}
