// Block code for the robot puzzles and code figures (SCI5-OI6-GQ1-LO1, K1.2-K1.7, S1.2-S1.5).
// A program is a list of blocks; a repeat block holds its own list.

export type Block = 'move' | 'left' | 'right' | { repeat: number; body: Block[] };
export type Dir = 0 | 1 | 2 | 3; // 0 = right (east), 1 = down, 2 = left, 3 = up

export const BLOCK_TEXT = { move: 'move forward', left: 'turn left', right: 'turn right' } as const;

export interface Puzzle {
  id: string;
  title: string;
  size: number;
  start: [number, number];
  dir: Dir;
  goal: [number, number];
  walls?: [number, number][];
  /** Most blocks allowed (a repeat block and each block inside it all count). */
  maxBlocks?: number;
}

export interface Step {
  x: number;
  y: number;
  dir: Dir;
  /** Path of indexes to the block that ran, e.g. [1, 0] = first block inside the second block. */
  at: number[];
}

export type Outcome = { steps: Step[]; result: 'goal' | 'short' | 'wall' | 'edge' };

/** Counts every block, including the blocks inside repeat blocks. */
export function countBlocks(program: Block[]): number {
  return program.reduce((n, b) => n + (typeof b === 'string' ? 1 : 1 + countBlocks(b.body)), 0);
}

const DX = [1, 0, -1, 0];
const DY = [0, 1, 0, -1];

/** Runs a program on a puzzle, one step per move or turn. Stops at a wall, the edge, or the end. */
export function runProgram(program: Block[], p: Puzzle): Outcome {
  let x = p.start[0];
  let y = p.start[1];
  let dir: Dir = p.dir;
  const steps: Step[] = [];
  const walls = new Set((p.walls ?? []).map(([a, b]) => `${a},${b}`));
  let crash: 'wall' | 'edge' | null = null;
  const exec = (blocks: Block[], path: number[]) => {
    for (let i = 0; i < blocks.length && !crash; i++) {
      const b = blocks[i];
      if (typeof b !== 'string') {
        for (let r = 0; r < b.repeat && !crash; r++) exec(b.body, [...path, i]);
        continue;
      }
      if (b === 'left') dir = ((dir + 3) % 4) as Dir;
      else if (b === 'right') dir = ((dir + 1) % 4) as Dir;
      else {
        const nx = x + DX[dir];
        const ny = y + DY[dir];
        if (nx < 0 || ny < 0 || nx >= p.size || ny >= p.size) crash = 'edge';
        else if (walls.has(`${nx},${ny}`)) crash = 'wall';
        else [x, y] = [nx, ny];
      }
      steps.push({ x, y, dir, at: [...path, i] });
    }
  };
  exec(program, []);
  const result = crash ?? (x === p.goal[0] && y === p.goal[1] ? 'goal' : 'short');
  return { steps, result };
}

export const PUZZLES: Puzzle[] = [
  { id: 'line', title: 'Puzzle 1: Straight to the star', size: 6, start: [0, 2], dir: 0, goal: [5, 2], maxBlocks: 2 },
  { id: 'turn', title: 'Puzzle 2: Around the rocks', size: 6, start: [0, 5], dir: 0, goal: [3, 1], walls: [[4, 5], [4, 4], [4, 3], [0, 3], [1, 3], [2, 3]] },
  { id: 'stairs', title: 'Puzzle 3: Up the stairs', size: 6, start: [0, 5], dir: 0, goal: [4, 1], walls: [[1, 3], [2, 2], [3, 1], [2, 5], [3, 4], [4, 3]], maxBlocks: 5 },
];

const COLOURS = { move: '#3f7fe0', left: '#8a5cc7', right: '#8a5cc7', repeat: '#e08a1e' };

/** Code blocks as an SVG picture, for problems and figures. */
export function codeSvg(program: Block[], title = 'Block code'): string {
  const rows: string[] = [];
  let y = 8;
  const draw = (blocks: Block[], indent: number) => {
    for (const b of blocks) {
      const x = 8 + indent * 26;
      if (typeof b === 'string') {
        rows.push(`<rect x="${x}" y="${y}" width="${200 - indent * 26}" height="30" rx="7" fill="${COLOURS[b]}"/><text x="${x + 12}" y="${y + 20}" class="bc-text">${BLOCK_TEXT[b]}</text>`);
        y += 34;
      } else {
        const top = y;
        rows.push(`<text x="${x + 12}" y="${y + 20}" class="bc-text">repeat ${b.repeat} times</text>`);
        y += 32;
        const inner = rows.length;
        draw(b.body, indent + 1);
        // The C-shaped repeat block wraps the blocks inside it.
        const h = y - top + 12;
        rows.splice(inner - 1, 0, `<path d="M${x + 7},${top} H${x + 200 - indent * 26 - 7} Q${x + 200 - indent * 26},${top} ${x + 200 - indent * 26},${top + 7} V${top + 25} Q${x + 200 - indent * 26},${top + 30} ${x + 200 - indent * 26 - 7},${top + 30} H${x + 26} V${y} H${x + 120} Q${x + 126},${y} ${x + 126},${y + 4} V${top + h - 4} Q${x + 126},${top + h} ${x + 120},${top + h} H${x + 7} Q${x},${top + h} ${x},${top + h - 7} V${top + 7} Q${x},${top} ${x + 7},${top} Z" fill="${COLOURS.repeat}"/>`);
        y = top + h + 4;
      }
    }
  };
  draw(program, 0);
  return `<svg viewBox="0 0 216 ${y + 4}" class="fig-svg bc-svg" role="img" aria-label="${title}: ${describe(program)}">${rows.join('')}</svg>`;
}

/** Plain-language reading of a program, for screen readers. */
export function describe(program: Block[]): string {
  return program.map((b) => (typeof b === 'string' ? BLOCK_TEXT[b] : `repeat ${b.repeat} times (${describe(b.body)})`)).join(', then ');
}
