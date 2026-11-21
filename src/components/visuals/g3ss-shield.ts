// The parts of Alberta's shield for the Grade 3 shield builder (g3ss-shield-build), drawn on a
// 120 × 138 canvas from top to bottom. A simple picture, not a copy of the official artwork.
// Source for what the shield shows: Government of Alberta, "Emblems of Alberta" (alberta.ca/emblems):
// a red St. George's Cross on white, blue sky over snow-capped mountains, green hills, prairie and a
// wheat field.

export const SHIELD_PATH = 'M0 0 H120 V78 Q120 132 60 138 Q0 132 0 78 Z';

const wheatLines = Array.from({ length: 11 }, (_, i) => 6 + i * 10.8)
  .map((x) => `<line x1="${x.toFixed(1)}" y1="114" x2="${x.toFixed(1)}" y2="138" stroke="#b88a10" stroke-width="2"/>`)
  .join('');

export const PARTS: Record<string, { name: string; svg: string }> = {
  cross: {
    name: 'Red cross',
    svg: '<rect width="120" height="27" fill="#fff"/><rect x="51" width="18" height="27" fill="#c8102e"/><rect y="9" width="120" height="9" fill="#c8102e"/>',
  },
  mountains: {
    name: 'Mountains',
    svg: '<rect y="27" width="120" height="63" fill="#5aa7e0"/><polygon points="0,72 27,39 45,60 66,33 90,63 105,45 120,63 120,90 0,90" fill="#f4f4f4" stroke="#8aa" stroke-width="1.5"/>',
  },
  hills: { name: 'Hills', svg: '<path d="M0 81 Q30 63 60 78 T120 75 V99 H0 Z" fill="#3f8a3f"/>' },
  prairie: { name: 'Prairie', svg: '<rect y="96" width="120" height="15" fill="#b9d77e"/>' },
  wheat: { name: 'Wheat field', svg: `<rect y="111" width="120" height="30" fill="#e8b830"/>${wheatLines}` },
};

/** The parts a lesson lists, in its order. Throws on an unknown id, so a typo fails the build. */
export function pickParts(ids: string[]) {
  return ids.map((id) => {
    const p = PARTS[id];
    if (!p) throw new Error(`g3ss-shield-build: no part "${id}"`);
    return { id, ...p };
  });
}
