// A simplified front view of the human body and four of its systems (SCI5-OI4-GQ1-LO1,
// K1.3-K1.7). The body sits between x = 50 and 250 inside VIEWBOX, leaving room for labels on
// both sides. Its right side is on the viewer's left, as in any picture of a person facing
// you. Shared by the body explorer and the body experiment.
export type SystemId = 'digestive' | 'respiratory' | 'circulatory' | 'musculoskeletal';

export const SYSTEMS: { id: SystemId; label: string; does: string; parts: string[] }[] = [
  { id: 'digestive', label: 'Digestive', does: 'breaks down food and absorbs nutrients', parts: ['mouth', 'stomach', 'intestines', 'liver', 'pancreas'] },
  { id: 'respiratory', label: 'Respiratory', does: 'exchanges oxygen and carbon dioxide', parts: ['trachea', 'lungs', 'diaphragm'] },
  { id: 'circulatory', label: 'Circulatory', does: 'moves blood around the body', parts: ['heart', 'blood vessels'] },
  { id: 'musculoskeletal', label: 'Musculoskeletal', does: 'supports and moves the body', parts: ['muscles', 'bones'] },
];

/** What each major part does (K1.4-K1.7, S1.2), in one short line. */
export const PART_JOBS: Record<string, string> = {
  mouth: 'Teeth chew food into small pieces, so it is easier to break down.',
  stomach: 'Squeezes and mixes food with juices that break it down.',
  intestines: 'Finish breaking food down. Nutrients pass through their walls into the blood.',
  liver: 'Makes a juice that helps break food down. Food never passes through the liver.',
  pancreas: 'Makes juices that help break food down. Food never passes through the pancreas.',
  trachea: 'The windpipe. Carries air down to the lungs and back out again.',
  lungs: 'Oxygen passes from the air into the blood. Carbon dioxide passes out and is breathed out.',
  diaphragm: 'A muscle under the lungs. It pulls down to bring air in, then relaxes to let air out.',
  heart: 'A strong muscle that squeezes again and again, pumping blood into the blood vessels.',
  'blood vessels': 'Tubes that carry blood from the heart to every part of the body, and back to the heart.',
  muscles: 'Pull on bones to move them. A muscle gets shorter and fatter when it pulls.',
  bones: 'Hard and strong. They hold the body up and give it its shape.',
};

/** The class on each part's drawing in ORGANS, so one part can be picked out. */
export const PART_CLASS: Record<string, string> = {
  mouth: 'bd-mouth',
  stomach: 'bd-stomach',
  intestines: 'bd-intestine',
  liver: 'bd-liver',
  pancreas: 'bd-pancreas',
  trachea: 'bd-trachea',
  lungs: 'bd-lung',
  diaphragm: 'bd-diaphragm',
  heart: 'bd-heart',
  'blood vessels': 'bd-vessel',
  muscles: 'bd-muscle',
  bones: 'bd-bone',
};

/**
 * A bending arm, seen from the side, for the muscles-and-bones animation. `pull` runs from 0
 * (relaxed, arm hanging straight) to 1 (arm bent). The muscle runs from the upper arm to just
 * below the elbow, so it gets shorter as the arm bends. Returns the points to draw.
 */
export function armPose(pull: number) {
  const p = Math.min(1, Math.max(0, pull));
  const shoulder = { x: 120, y: 40 };
  const elbow = { x: 120, y: 170 };
  const angle = (p * 135 * Math.PI) / 180;
  const along = (d: number) => ({ x: elbow.x + d * Math.sin(angle), y: elbow.y + d * Math.cos(angle) });
  const hand = along(120);
  const top = { x: 134, y: 64 };
  const bottom = along(30);
  const length = Math.hypot(bottom.x - top.x, bottom.y - top.y);
  return { shoulder, elbow, hand, top, bottom, length, angle };
}

/** The relaxed muscle's length, for working out how fat it gets. */
export const ARM_REST_LENGTH = armPose(0).length;

export const VIEWBOX = '-90 0 470 470';

export const OUTLINE =
  '<g class="bd-body">' +
  '<circle cx="150" cy="52" r="32"/>' +
  '<rect x="138" y="80" width="24" height="24" rx="6"/>' +
  '<path d="M98,104 Q150,92 202,104 L210,200 Q206,268 196,292 L104,292 Q94,268 90,200 Z"/>' +
  '<path d="M98,108 Q78,114 72,150 L56,262 Q58,276 70,272 L90,170 Z"/>' +
  '<path d="M202,108 Q222,114 228,150 L244,262 Q242,276 230,272 L210,170 Z"/>' +
  '<path d="M106,288 L148,288 L140,452 Q128,462 116,452 Z"/>' +
  '<path d="M152,288 L194,288 L184,452 Q172,462 160,452 Z"/>' +
  '</g>';

/** Each system's organs. Labels are separate so they can be shown or hidden. */
export const ORGANS: Record<SystemId, string> = {
  digestive:
    '<path class="bd-mouth" d="M138,64 Q150,72 162,64"/>' +
    '<path class="bd-tube" d="M152,72 L156,120 L160,176 L168,196"/>' +
    '<path class="bd-liver" d="M104,198 Q130,186 152,198 Q146,222 116,226 Q104,218 104,198 Z"/>' +
    '<path class="bd-stomach" d="M166,192 Q194,190 194,212 Q192,236 166,236 Q152,234 156,224 Q176,226 178,212 Q176,200 164,202 Z"/>' +
    '<path class="bd-pancreas" d="M128,238 Q150,232 176,240 Q172,246 150,244 Q134,246 128,238 Z"/>' +
    '<path class="bd-intestine" d="M118,252 Q150,244 182,252 Q186,264 170,266 Q150,258 130,266 Q114,268 118,280 Q150,290 182,280"/>',
  respiratory:
    '<path class="bd-tube bd-trachea" d="M148,72 L148,130 M148,128 L130,140 M148,128 L166,140"/>' +
    '<path class="bd-lung" d="M140,124 Q112,118 106,160 Q104,190 136,188 Q142,160 140,124 Z"/>' +
    '<path class="bd-lung" d="M156,124 Q186,118 194,160 Q196,190 164,188 Q158,160 156,124 Z"/>' +
    '<path class="bd-diaphragm" d="M100,196 Q150,172 200,196"/>',
  circulatory:
    '<path class="bd-vessel" d="M158,162 L150,96 L150,70 M158,162 Q190,128 214,150 L238,262 M158,162 Q110,128 86,150 L62,262 M158,170 L150,230 L130,290 L126,440 M150,230 L170,290 L176,440"/>' +
    '<path class="bd-heart" d="M158,176 Q140,164 144,152 Q148,144 158,152 Q166,144 172,150 Q176,164 158,176 Z"/>',
  musculoskeletal:
    '<g class="bd-bone"><circle cx="150" cy="50" r="24"/><path d="M150,78 L150,288 M118,120 Q150,112 182,120 M116,138 Q150,130 184,138 M116,156 Q150,148 184,156 M118,174 Q150,166 182,174 M104,110 L196,110 M104,110 L82,160 L66,262 M196,110 L218,160 L234,262 M120,282 Q150,268 180,282 M130,288 L126,446 M170,288 L174,446"/></g>' +
    '<g class="bd-muscle"><ellipse cx="86" cy="150" rx="9" ry="22" transform="rotate(14 86 150)"/><ellipse cx="214" cy="150" rx="9" ry="22" transform="rotate(-14 214 150)"/><ellipse cx="129" cy="340" rx="12" ry="38"/><ellipse cx="171" cy="340" rx="12" ry="38"/></g>',
};

/** Label anchor (on the organ) and text position, per part. Labels with x < 0 sit in the left margin. */
export const LABELS: Record<string, [number, number, number, number]> = {
  mouth: [140, 66, -84, 66],
  stomach: [186, 214, 276, 214],
  intestines: [176, 262, 276, 268],
  liver: [112, 206, -84, 206],
  pancreas: [134, 240, -84, 244],
  trachea: [148, 100, 276, 96],
  lungs: [116, 160, -84, 160],
  diaphragm: [190, 190, 276, 188],
  heart: [166, 162, 276, 160],
  'blood vessels': [226, 210, 276, 236],
  muscles: [182, 340, 276, 340],
  bones: [126, 400, -84, 400],
};

export function labelSvg(part: string): string {
  const [ax, ay, tx, ty] = LABELS[part];
  const left = tx < 150;
  const name = part[0].toUpperCase() + part.slice(1);
  const end = left ? tx + name.length * 8.5 + 4 : tx - 4;
  return `<g class="bd-label"><line x1="${ax}" y1="${ay}" x2="${end}" y2="${ty - 4}"/><text x="${tx}" y="${ty}">${name}</text></g>`;
}
