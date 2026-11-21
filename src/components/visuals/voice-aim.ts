// Projection is a combination of breath, clarity and intentionality (LANENG4-OI2-GQ1-LO1, K2.3, K2.4).
// This works out what the voice-aim picture shows for each mix of the three.

/** x position of the back row in the picture, which the voice must reach. */
export const BACK_ROW = 490;

export function projection(breath: boolean, clarity: boolean, intent: boolean) {
  // Breath carries the sound far; without it, the sound fades near the front.
  const reach = breath ? (intent ? BACK_ROW - 10 : 400) : 190;
  const missing = [!breath && 'breath', !clarity && 'clarity', !intent && 'intention'].filter((x): x is string => !!x);
  return { reach, aimed: intent, clear: clarity, heard: breath && clarity && intent, missing };
}
