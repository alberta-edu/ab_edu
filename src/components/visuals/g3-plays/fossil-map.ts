// Where dinosaur fossils have been found in Alberta (SCI3-OI3-GQ1-LO1 K4.5, K4.6, S4.4): the
// badlands, the Grande Cache area and the Fort McMurray area, and Dinosaur Provincial Park, a
// UNESCO World Heritage Site. Sources: Royal Tyrrell Museum; Government of Alberta, Dinosaur
// Provincial Park; Municipal District of Greenview, Grande Cache Dinosaur Tracksite; Brown et al.
// 2017, Borealopelta markmitchelli (found at Suncor's Millennium Mine, north of Fort McMurray, 2011).
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';
import { albertaPath, at } from '../g3-alberta.ts';

const n = 4;
const pin = (p: Parameters<typeof at>[0], i: number): Sprite[] => {
  const [x, y] = at(p);
  return [
    { kind: 'ellipse', x, y, w: 10, h: 10, cls: 'g3s-label' },
    only({ kind: 'emoji', text: '📍', x, y: y - 16, size: 34 }, i, n),
  ];
};
const [ex, ey] = at('edmonton');
const [cx, cy] = at('calgary');

const scene: PlayScene = {
  w: 480,
  h: 300,
  mode: 'jump',
  states: [
    { label: '🏜️ Badlands', say: 'Alberta’s badlands, along the Red Deer River, are full of dinosaur bones. Rain and wind wash them out of the hills.' },
    { label: '⛰️ Grande Cache', say: 'Near Grande Cache, in the mountains, people have found dinosaur fossils, and many dinosaur footprints in the rock.' },
    { label: '🚚 Fort McMurray', say: 'Near Fort McMurray, a worker digging in a mine found an armoured dinosaur, a nodosaur, in 2011.' },
    { label: '🏞️ Dinosaur Park', say: 'Dinosaur Provincial Park, in the badlands, is a UNESCO World Heritage Site. Its fossils are special to the whole world.' },
  ],
  bg:
    `<rect class="g3s-sky" width="480" height="300"/><path class="g3s-grass g3s-stroke" d="${albertaPath}"/>` +
    `<circle class="g3s-soft" cx="${ex}" cy="${ey}" r="4"/><text class="g3s-soft" x="${ex - 6}" text-anchor="end" y="${ey + 5}" font-size="17">Edmonton</text>` +
    `<circle class="g3s-soft" cx="${cx}" cy="${cy}" r="4"/><text class="g3s-soft" x="${cx - 8}" y="${cy + 18}" font-size="17">Calgary</text>`,
  sprites: [
    ...pin('drumheller', 0),
    ...pin('grandeCache', 1),
    ...pin('fortMcMurray', 2),
    ...pin('dinosaurPark', 3),
    // badlands
    only({ kind: 'path', d: 'M230,250 L260,170 L300,170 L330,250 Z M330,250 L370,150 L410,150 L450,250 Z', cls: 'g3s-l1' }, 0, n),
    only({ kind: 'emoji', text: '🦴', x: 290, y: 225, size: 34 }, 0, n),
    only({ kind: 'emoji', text: '🦴', x: 395, y: 200, size: 30 }, 0, n),
    // mountains and footprints
    only({ kind: 'path', d: 'M220,250 L300,120 L360,200 L400,150 L470,250 Z', cls: 'g3s-rock' }, 1, n),
    ...[[280, 230], [310, 205], [340, 230], [370, 205]].map(([x, y]) => only({ kind: 'path', d: 'M0,0 L-9,-14 M0,0 L0,-17 M0,0 L9,-14', x, y, cls: 'g3s-line' }, 1, n)),
    // a mine and a nodosaur
    only({ kind: 'rect', x: 220, y: 200, w: 250, h: 50, cls: 'g3s-dark' }, 2, n),
    only({ kind: 'emoji', text: '🚚', x: 270, y: 180, size: 50 }, 2, n),
    only({ kind: 'emoji', text: '🦕', x: 400, y: 220, size: 50 }, 2, n),
    // the park
    only({ kind: 'path', d: 'M220,250 L250,180 L290,180 L320,250 Z M330,250 L360,190 L400,190 L440,250 Z', cls: 'g3s-l3' }, 3, n),
    only({ kind: 'emoji', text: '🌍', x: 345, y: 120, size: 60 }, 3, n),
    only({ kind: 'text', text: 'World Heritage Site', x: 345, y: 274, size: 18, cls: 'g3s-label' }, 3, n),
  ],
};
export default scene;
