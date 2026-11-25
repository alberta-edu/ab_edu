// Carnivores, herbivores and omnivores (SCI3-OI4-GQ1-LO1 K2.1, K2.2, K2.3, U2.1): a deer eats leaves,
// a wolf chases a hare, and a black bear eats berries and then a fish.
import { showFrom, ticker, type RunScene } from '../../visuals/g3-sprites.ts';

const GO = 0.12;
const scene: RunScene = {
  w: 480,
  h: 280,
  ms: 8000,
  live: 'The deer ate only leaves. It is a herbivore. The wolf chased and ate the hare. It is a carnivore. The bear ate berries and a fish. It eats both plants and meat, so it is an omnivore.',
  bg: '<rect class="g3s-sky" width="480" height="280"/><rect class="g3s-grass" y="200" width="480" height="80"/><rect class="g3s-water" x="300" y="236" width="180" height="44"/>',
  sprites: [
    // food
    { kind: 'emoji', text: '🌿', x: 60, y: 180, size: 48, keys: [{ t: GO + 0.15, s: 1, o: 1 }, { t: GO + 0.25, s: 0.4, o: 0 }] },
    { kind: 'emoji', text: '🐇', x: 230, y: 190, size: 40, keys: [{ t: 0.3, x: 230 }, { t: 0.42, x: 150, o: 1 }, { t: 0.46, o: 0 }] },
    { kind: 'emoji', text: '🫐', x: 380, y: 180, size: 36, keys: [{ t: 0.55, o: 1 }, { t: 0.62, o: 0 }] },
    { kind: 'emoji', text: '🐟', x: 420, y: 256, size: 32, keys: [{ t: 0.7, x: 420, y: 256 }, { t: 0.78, x: 410, y: 230, o: 1 }, { t: 0.82, o: 0 }] },
    // the eaters
    { kind: 'emoji', text: '🦌', x: 130, y: 150, size: 60, keys: [{ t: GO, x: 130 }, { t: GO + 0.15, x: 90 }] },
    { kind: 'emoji', text: '🐺', x: 300, y: 160, size: 56, keys: [{ t: 0.3, x: 300 }, { t: 0.45, x: 170 }, { t: 0.5, x: 200 }] },
    { kind: 'emoji', text: '🐻', x: 470, y: 160, size: 64, keys: [{ t: 0.5, x: 470 }, { t: 0.58, x: 380 }, { t: 0.72, x: 380 }, { t: 0.78, x: 405 }] },
    // labels
    showFrom({ kind: 'text', text: 'Herbivore', x: 90, y: 100, size: 20, cls: 'g3s-label' }, GO + 0.25),
    showFrom({ kind: 'text', text: 'Carnivore', x: 220, y: 100, size: 20, cls: 'g3s-label' }, 0.5),
    showFrom({ kind: 'text', text: 'Omnivore', x: 395, y: 100, size: 20, cls: 'g3s-label' }, 0.86),
    ticker(240, 26, [[0, 'Lunch time in the forest'], [GO, 'The deer is hungry…'], [0.3, 'The wolf is hungry…'], [0.5, 'The bear is hungry…'], [0.86, 'Everyone ate!']], 20, 'middle'),
  ],
};
export default scene;
