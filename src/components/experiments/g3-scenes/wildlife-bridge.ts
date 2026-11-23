// Animal crossings protect animals (SCI3-OI4-GQ1-LO1 K4.1, U4.1): in Banff National Park, elk and
// bears cross the busy Trans-Canada Highway on a grassy overpass while cars drive safely below.
// Source: Parks Canada, "Wildlife crossings" (44 structures: six overpasses and 38 underpasses).
import { showFrom, ticker, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const BUILD = 0.12;
const CROSS = 0.4;
const car = (text: string, y: number, dir: 1 | -1, t0: number): Sprite => ({
  kind: 'emoji', text, x: dir > 0 ? -40 : 520, y, size: 34, keys: [{ t: t0, x: dir > 0 ? -40 : 520 }, { t: t0 + 0.3, x: dir > 0 ? 520 : -40 }],
});

const scene: RunScene = {
  w: 480,
  h: 290,
  ms: 7500,
  live: 'A grassy bridge was built over the highway. The elk and the bear walked across the bridge, high above the cars. The cars kept driving safely underneath.',
  bg:
    '<rect class="g3s-grass" width="480" height="290"/>' +
    '<rect class="g3s-road" y="110" width="480" height="90"/><line x1="0" y1="155" x2="480" y2="155" stroke="#f2c230" stroke-width="4" stroke-dasharray="20 14"/>' +
    '<text class="g3s-label" x="12" y="280" font-size="16" font-weight="700">Banff National Park</text>',
  sprites: [
    // cars all the way through
    car('🚗', 132, 1, 0), car('🚙', 178, -1, 0.1), car('🚌', 132, 1, 0.35), car('🚗', 178, -1, 0.5), car('🚙', 132, 1, 0.68),
    // the overpass: walls, then grass on top
    { kind: 'rect', x: 170, y: 155, w: 140, h: 0, cls: 'g3s-rock', keys: [{ t: BUILD, y: 155, h: 0 }, { t: BUILD + 0.12, y: 96, h: 118 }] },
    showFrom({ kind: 'rect', x: 178, y: 96, w: 124, h: 118, cls: 'g3s-grass' }, BUILD + 0.14),
    showFrom({ kind: 'emoji', text: '🌲', x: 200, y: 122, size: 30 }, BUILD + 0.16),
    showFrom({ kind: 'emoji', text: '🌲', x: 282, y: 190, size: 30 }, BUILD + 0.16),
    // animals walk across
    { kind: 'emoji', text: '🦌', x: 240, y: 60, size: 46, keys: [{ t: CROSS, y: 60 }, { t: CROSS + 0.3, y: 250 }] },
    { kind: 'emoji', text: '🐻', x: 250, y: 40, size: 44, o: 0, keys: [{ t: CROSS + 0.15, y: 40, o: 0 }, { t: CROSS + 0.17, o: 1 }, { t: CROSS + 0.45, y: 236 }] },
    ticker(10, 20, [[0, 'A busy highway'], [BUILD, 'Build a bridge…'], [CROSS, 'Safe crossing!']], 20),
  ],
};
export default scene;
