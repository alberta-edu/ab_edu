// First Nations, Métis and Inuit and natural materials (SCI3-OI1-GQ1-LO1 K1.3, K1.4): tap a
// purpose to see what it is made from. Sources: Glenbow Museum (Blackfoot tipis, sweetgrass, plant
// medicines); Canadian Museum of History (qajaq); Indigenous Peoples Atlas of Canada (caribou skin).
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const TIPI = 'M0,-90 L-70,70 L70,70 Z M-14,-112 L14,-62 M14,-112 L-14,-62 M-16,70 L-16,30 Q0,16 16,30 L16,70';
const IGLU = 'M-80,60 A80,80 0 0 1 80,60 Z M-78,30 L78,30 M-66,0 L66,0 M-42,-30 L42,-30 M-30,60 L-30,30 M30,60 L30,30 M0,30 L0,0 M-40,0 L-40,-30 M40,0 L40,-30 M-26,60 A26,26 0 0 1 26,60';
const QAJAQ = 'M-110,0 Q0,-26 110,0 Q0,22 -110,0 Z M-20,-8 A20,6 0 0 0 20,-8';
const PARKA = 'M-30,-66 Q0,-90 30,-66 L58,-24 L44,-12 L34,-30 L36,64 L-36,64 L-34,-30 L-44,-12 L-58,-24 Z';

const items: { button: string; say: string; draw: Sprite; made: [string, string][] }[] = [
  { button: 'Tipi', say: 'Blackfoot families made tipis from lodgepole pine poles and bison hides.', draw: { kind: 'path', d: TIPI, x: 120, y: 140, cls: 'g3s-hide' }, made: [['🌲', 'Pine poles'], ['🦬', 'Bison hides']] },
  { button: 'Igloo', say: 'Inuit build igloos, or snow houses, from blocks of hard-packed snow.', draw: { kind: 'path', d: IGLU, x: 120, y: 150, cls: 'g3s-snow' }, made: [['❄️', 'Snow blocks']] },
  { button: 'Qajaq', say: 'Inuit made the qajaq, a kayak, from a wood frame covered with sealskin.', draw: { kind: 'path', d: QAJAQ, x: 120, y: 140, cls: 'g3s-hide' }, made: [['🪵', 'Driftwood'], ['🦭', 'Sealskin']] },
  { button: 'Parka', say: 'Inuit sew warm parkas from caribou skin. Its hollow hairs trap heat.', draw: { kind: 'path', d: PARKA, x: 120, y: 140, cls: 'g3s-hide' }, made: [['🦌', 'Caribou skin'], ['🧵', 'Sinew thread']] },
  { button: 'Medicine', say: 'Blackfoot teachings say each plant has gifts. Some plants are medicines that help people heal.', draw: { kind: 'emoji', text: '🌿', x: 120, y: 140, size: 110 }, made: [['🌱', 'Plants']] },
  { button: 'Ceremony', say: 'Some Blackfoot families burn sweetgrass each morning as part of a prayer.', draw: { kind: 'emoji', text: '🌾', x: 120, y: 140, size: 110 }, made: [['🌾', 'Sweetgrass']] },
];
const n = items.length;
const sprites: Sprite[] = [];
items.forEach((it, i) => {
  sprites.push(only(it.draw, i, n));
  it.made.forEach(([emoji, label], j) => {
    sprites.push(
      only({ kind: 'emoji', text: emoji, x: 262, y: 90 + j * 90, size: 56 }, i, n),
      only({ kind: 'text', text: label, x: 296, y: 90 + j * 90, size: 24, anchor: 'start', cls: 'g3s-label' }, i, n),
    );
  });
});

const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'jump',
  states: items.map((it) => ({ label: it.button, say: it.say })),
  bg: '<text class="g3s-soft" x="240" y="34" font-size="20" font-weight="700">MADE FROM</text>',
  sprites,
};
export default scene;
