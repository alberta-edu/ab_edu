// Static measuring pictures for problems and figures: a pan balance and a graduated
// cylinder. Drawn with the same CSS classes as the measuring visuals, so they follow the theme.

/** Standard masses are written like "100 g" or "1 kg"; anything else is drawn as a labelled cube. */
const isMass = (s: string) => /^\d+(\.\d+)? k?g$/.test(s);

function panItems(items: string[]): string {
  let out = '';
  let y = 0;
  const cubes = items.filter((s) => !isMass(s));
  const masses = items.filter(isMass);
  // Same-size cubes sit side by side; standard masses stack.
  cubes.forEach((label, i) => {
    const x = (i - (cubes.length - 1) / 2) * 58 - 26;
    out += `<rect class="obj" x="${x}" y="-52" width="52" height="52" rx="3"/><text class="sci-text" x="${x + 26}" y="-20" text-anchor="middle">${label}</text>`;
  });
  for (const m of masses) {
    const g = m.endsWith('kg') ? Number.parseFloat(m) * 1000 : Number.parseFloat(m);
    // Bigger masses are drawn bigger, but every label stays large enough to read.
    const h = g >= 500 ? 30 : g >= 100 ? 26 : 22;
    const w = g >= 500 ? 84 : g >= 100 ? 74 : 62;
    y -= h;
    out += `<rect class="mt-mass" x="${-w / 2}" y="${y}" width="${w}" height="${h}" rx="4"/><text class="sci-text" x="0" y="${y + h / 2 + 5}" text-anchor="middle">${m}</text>`;
  }
  return out;
}

/** A pan balance. `down` is the side that is lower (has more mass). */
export function balanceSvg(left: string[], right: string[], down: 'left' | 'right' | 'none'): string {
  const px = 280;
  const py = 70;
  const arm = 160;
  const deg = down === 'left' ? -12 : down === 'right' ? 12 : 0;
  const r = (deg * Math.PI) / 180;
  const ends = [-1, 1].map((s) => ({ x: px + s * arm * Math.cos(r), y: py + s * arm * Math.sin(r) }));
  const pans = ends
    .map((p, i) => {
      const y = p.y + 92;
      return (
        `<line class="mt-chain" x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${(p.x - 54).toFixed(1)}" y2="${y.toFixed(1)}"/>` +
        `<line class="mt-chain" x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${(p.x + 54).toFixed(1)}" y2="${y.toFixed(1)}"/>` +
        `<path class="mt-pan" d="M${(p.x - 62).toFixed(1)},${y.toFixed(1)} Q${p.x.toFixed(1)},${(y + 24).toFixed(1)} ${(p.x + 62).toFixed(1)},${y.toFixed(1)} Z"/>` +
        `<g transform="translate(${p.x.toFixed(1)} ${y.toFixed(1)})">${panItems(i === 0 ? left : right)}</g>`
      );
    })
    .join('');
  const aria = `Pan balance. Left pan: ${left.join(', ')}. Right pan: ${right.join(', ')}. ${down === 'none' ? 'The balance is level.' : `The ${down} side is lower.`}`;
  return (
    `<svg viewBox="0 -40 560 280" class="fig-svg" role="img" aria-label="${aria}">` +
    `<path class="mt-post" d="M262,228 L298,228 L288,${py} L272,${py} Z"/><rect class="mt-post" x="210" y="226" width="140" height="10" rx="4"/>` +
    `<line class="mt-beam" x1="${ends[0].x.toFixed(1)}" y1="${ends[0].y.toFixed(1)}" x2="${ends[1].x.toFixed(1)}" y2="${ends[1].y.toFixed(1)}"/><circle class="mt-post" cx="${px}" cy="${py}" r="7"/>` +
    pans +
    '</svg>'
  );
}

/**
 * A graduated cylinder filled to `level`. Small marks every `minor`, numbered marks every
 * `major` (both in mL).
 */
export function cylinderSvg(max: number, minor: number, major: number, level: number): string {
  const top = 30;
  const bottom = 300;
  const x0 = 140;
  const w = 70;
  const yOf = (v: number) => bottom - ((bottom - top) * v) / max;
  let ticks = '';
  for (let v = minor; v <= max + 1e-9; v += minor) {
    const isMajor = Math.abs(v / major - Math.round(v / major)) < 1e-9;
    const y = yOf(v).toFixed(1);
    ticks += `<line class="mt-tick${isMajor ? ' mt-tick--major' : ''}" x1="${x0 + w}" y1="${y}" x2="${x0 + w - (isMajor ? 22 : 11)}" y2="${y}"/>`;
    if (isMajor) ticks += `<text class="mt-num" x="${x0 + w + 8}" y="${Number(y) + 4}">${Math.round(v)} mL</text>`;
  }
  const ly = yOf(level).toFixed(1);
  return (
    `<svg viewBox="40 0 300 330" class="fig-svg fig-svg--square" role="img" aria-label="Graduated cylinder marked from 0 to ${max} mL with liquid in it.">` +
    `<rect class="mt-liquid" x="${x0 + 2}" y="${ly}" width="${w - 4}" height="${(bottom - Number(ly)).toFixed(1)}"/>` +
    `<path class="sci-glass" d="M${x0},${top - 18} L${x0},${bottom + 2} L${x0 + w},${bottom + 2} L${x0 + w},${top - 18}"/>` +
    `<rect class="mt-post" x="${x0 - 22}" y="${bottom + 2}" width="${w + 44}" height="8" rx="3"/>` +
    ticks +
    '</svg>'
  );
}
