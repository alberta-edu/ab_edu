// The garden robot's program for the conditionals experiment (SCI6-OI6-GQ1-LO1, K1.6-K1.8):
// repeat 5 times { move to next pot; if soil is dry then water it else skip it }.

/** Pots in order; true means the soil is dry at the start. */
export const IF_ROBOT_POTS = [true, false, true, true, false];

export interface RobotStep {
  pot: number;
  water: boolean;
}

/** Runs the program: one step per pot, watering only the dry ones. */
export function runIfRobot(dry: boolean[]): RobotStep[] {
  const steps: RobotStep[] = [];
  for (let pot = 0; pot < dry.length; pot++) steps.push({ pot, water: dry[pot] });
  return steps;
}
