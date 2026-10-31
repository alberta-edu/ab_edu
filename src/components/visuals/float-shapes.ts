// Objects and fluids for the float-or-sink lab and the egg experiment. Densities are
// typical values, used only to decide what floats and how deep it sits; the page never
// shows them as numbers.

export type FluidId = 'fresh' | 'salt' | 'oil';
export const FLUIDS: Record<FluidId, { label: string; density: number; cls: string }> = {
  fresh: { label: 'Tap water', density: 1.0, cls: 'fl-fresh' },
  salt: { label: 'Salt water', density: 1.2, cls: 'fl-salt' },
  oil: { label: 'Vegetable oil', density: 0.92, cls: 'fl-oil' },
};

export type ThingId = 'cork' | 'wood' | 'apple' | 'egg' | 'clay-ball' | 'clay-boat' | 'bolt';
export interface Thing {
  label: string;
  density: number;
  /** Height in px; the shape is drawn with its top at y = 0 and centred on x = 0. */
  h: number;
  svg: string;
}

export const THINGS: Record<ThingId, Thing> = {
  cork: { label: 'Cork', density: 0.24, h: 30, svg: '<rect class="fo-cork" x="-24" y="0" width="48" height="30" rx="6"/>' },
  wood: { label: 'Wooden block', density: 0.5, h: 40, svg: '<rect class="fo-wood" x="-42" y="0" width="84" height="40" rx="3"/>' },
  apple: { label: 'Apple', density: 0.8, h: 52, svg: '<circle class="mt-apple fo-line" cx="0" cy="27" r="25"/><path class="mt-leaf" d="M2,4 Q12,-6 20,0 Q10,8 2,4 Z"/>' },
  egg: { label: 'Egg', density: 1.05, h: 54, svg: '<ellipse class="obj obj--egg" cx="0" cy="27" rx="21" ry="27"/>' },
  'clay-ball': { label: 'Clay ball', density: 1.8, h: 44, svg: '<circle class="fo-clay" cx="0" cy="22" r="22"/>' },
  // The same clay, shaped into a boat that holds air: it takes up much more space.
  'clay-boat': { label: 'Clay boat', density: 0.45, h: 30, svg: '<path class="fo-clay" d="M-58,0 L-46,0 L-38,20 L38,20 L46,0 L58,0 L46,30 L-46,30 Z"/>' },
  bolt: { label: 'Steel bolt', density: 7.9, h: 22, svg: '<rect class="fo-steel" x="-36" y="0" width="16" height="22" rx="2"/><rect class="fo-steel" x="-20" y="6" width="56" height="10" rx="2"/>' },
};

/**
 * Where an object comes to rest. A floating object sits with part of it below the surface,
 * a sinking one rests on the floor. Buoyant force is given as a fraction of the weight.
 */
export function restingPlace(thing: Thing, fluid: { density: number }, surface: number, floor: number) {
  const floats = thing.density <= fluid.density;
  const top = floats ? surface - thing.h * (1 - thing.density / fluid.density) : floor - thing.h;
  const buoyant = floats ? 1 : fluid.density / thing.density;
  return { floats, top, buoyant };
}
