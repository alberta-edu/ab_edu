// A simple plant with roots, stem and four leaves, shared by the plant visuals (SCI5-OI4-GQ1-LO1,
// K2.1-K2.4). Coordinates sit inside the viewBox "60 20 440 330", with the soil line at y = 262.

export const PLANT_VIEWBOX = '60 20 440 330';

export const PLANT_PARTS = {
  roots: '<g class="pt-root"><path d="M272,262 Q230,300 200,330 M272,262 Q300,300 340,330 M272,262 L270,318 M280,262 Q290,290 300,320 M236,298 L222,318 M312,302 L326,316" /></g>',
  stem: '<path class="pt-stem" d="M262,262 L262,36 Q280,22 298,36 L298,262 Z" />',
  leaves:
    '<g class="pt-leaf">' +
    '<path d="M262,90 Q220,40 160,58 Q200,100 262,90 Z" />' +
    '<path d="M262,150 Q210,108 150,128 Q196,170 262,150 Z" />' +
    '<path d="M298,120 Q340,70 400,92 Q360,136 298,120 Z" />' +
    '<path d="M298,190 Q350,148 400,168 Q356,212 298,190 Z" />' +
    '</g>',
  veins:
    '<g class="pt-vein">' +
    '<path d="M262,90 Q214,70 164,60 M232,82 L214,64 M210,74 L198,86" />' +
    '<path d="M262,150 Q206,132 154,128 M230,142 L214,124 M204,134 L192,148" />' +
    '<path d="M298,120 Q350,100 396,92 M326,112 L342,96 M352,104 L366,116" />' +
    '<path d="M298,190 Q352,172 396,168 M326,182 L342,166 M352,176 L366,188" />' +
    '</g>',
} as const;

export type PlantPart = keyof typeof PLANT_PARTS;

/** What each part does in the transport system, in one short line (K2.1-K2.4, S2.1). */
export const PLANT_JOBS: Record<PlantPart, string> = {
  roots: 'Take in water and nutrients from the soil. The xylem starts here and carries them up.',
  stem: 'Holds the plant up. Its xylem and phloem run between the roots and the leaves.',
  leaves: 'Make sugars, the plant’s food. The phloem carries the sugars to the rest of the plant.',
  veins: 'Bundles of xylem and phloem. They bring water into the leaf and carry sugars out.',
};

export const PLANT_LABELS: Record<PlantPart, string> = { roots: 'Roots', stem: 'Stem', leaves: 'Leaves', veins: 'Leaf veins' };

/**
 * A stem cut across: tubes run in bundles arranged in a ring. In each bundle the xylem faces the
 * centre and the phloem faces the outside. Returns the bundles' centres and angles.
 */
export function stemBundles(count = 8, cx = 150, cy = 150, r = 86) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    const at = (d: number) => ({ x: cx + d * Math.cos(a), y: cy + d * Math.sin(a) });
    return { angle: (a * 180) / Math.PI, xylem: at(r - 11), phloem: at(r + 11) };
  });
}
