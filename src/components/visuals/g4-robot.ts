// A recycling robot on a grid, for the Grade 4 algorithm builder (SCI4-OI6-GQ1-LO1, K1.3, S1.4).
// An algorithm is a sequence of instructions: here, only forward and turns, run one after another.

export type Step = 'forward' | 'left' | 'right';
export interface Cell { x: number; y: number }

export const ROBOT_GRID = {
  size: 5,
  start: { x: 0, y: 4 },
  /** 0 = up, 1 = right, 2 = down, 3 = left. */
  facing: 0,
  bin: { x: 3, y: 1 },
  puddles: [
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 2, y: 2 },
  ],
};

const MOVES = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export type Outcome = 'bin' | 'puddle' | 'wall' | 'short';

/** Runs a program and returns every position the robot visits, and how the run ended. */
export function runRobot(program: Step[], grid = ROBOT_GRID): { path: (Cell & { facing: number })[]; outcome: Outcome } {
  let { x, y } = grid.start;
  let facing = grid.facing;
  const path = [{ x, y, facing }];
  for (const step of program) {
    if (step === 'left') facing = (facing + 3) % 4;
    else if (step === 'right') facing = (facing + 1) % 4;
    else {
      const nx = x + MOVES[facing][0];
      const ny = y + MOVES[facing][1];
      if (nx < 0 || ny < 0 || nx >= grid.size || ny >= grid.size) return { path, outcome: 'wall' };
      x = nx;
      y = ny;
      if (grid.puddles.some((p) => p.x === x && p.y === y)) {
        path.push({ x, y, facing });
        return { path, outcome: 'puddle' };
      }
    }
    path.push({ x, y, facing });
  }
  return { path, outcome: x === grid.bin.x && y === grid.bin.y ? 'bin' : 'short' };
}
