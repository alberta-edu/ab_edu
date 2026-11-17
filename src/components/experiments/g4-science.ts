// Small models behind the Grade 4 science experiments. Kept here, apart from the drawing code,
// so the numbers each animation shows can be tested against what the lesson says.

/**
 * Magnet reach (SCI4-OI2-GQ1-LO1, K1.5): the school bar magnet in the experiment lifts a steel
 * paper clip from up to 3 cm away, through cardboard or not. Farther away, the pull is too weak.
 */
export const MAGNET_REACH_CM = 3;
export const clipLifts = (gapCm: number) => gapCm <= MAGNET_REACH_CM;

