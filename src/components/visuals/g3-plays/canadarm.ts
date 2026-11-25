// A Canadian invention: the Canadarm (SCI3-OI6-GQ1-LO1 K2.5, S2.4, K2.3, S2.2, S2.5). Built in
// Toronto by Spar Aerospace with the National Research Council, it was first used in space in 1981
// on Space Shuttle Columbia (STS-2), to catch, move and repair satellites. Like a human arm, it has a
// shoulder, an elbow and a wrist. The astronauts’ hand controllers tell a computer what the arm
// should do, and the computer works out how each joint moves.
// Sources: Parks Canada, “Canadarm Deployment in Space, 1981, National Historic Event”;
// IEEE Canada, “The Shuttle Remote Manipulator System: the Canadarm”.
import { only, from, type PlayScene, type Sprite, type Key } from '../g3-sprites.ts';

const n = 4;
const S = [110, 196];
// elbow and wrist in each state: folded in the bay, bent like a flexed arm, then reaching for the satellite
const E = [[280, 192], [200, 110], [230, 110], [230, 110]];
const W = [[140, 188], [300, 150], [348, 96], [348, 96]];
const k = (pts: number[][], a: 'x' | 'x2', b: 'y' | 'y2'): Key[] => pts.map(([x, y], t) => ({ t, [a]: x, [b]: y }));
const joint = ([x, y]: number[], label: string): Sprite[] => [
  only({ kind: 'ellipse', x, y, w: 22, h: 22, cls: 'g3s-hl' }, 1, n),
  only({ kind: 'text', text: label, x, y: y - 28, size: 17, fill: '#fff' }, 1, n),
];

const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'The problem', say: 'Astronauts needed a way to catch and move big, heavy things in space, like satellites.' },
    { label: 'The idea', say: 'Canadian engineers had an idea: build an arm like yours, with a shoulder, an elbow and a wrist.' },
    { label: 'In space', say: 'The Canadarm was built in Toronto. In 1981, it reached into space on the Space Shuttle for the first time.' },
    { label: 'Computers help', say: 'Astronauts move hand controls. A computer works out how each joint of the arm should move.' },
  ],
  bg:
    '<rect class="g3s-night" width="480" height="260"/>' +
    [[30, 60], [140, 50], [420, 30], [300, 40], [460, 150], [200, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join('') +
    '<path d="M60,200 L360,200 L420,217 L360,235 L60,235 Z" fill="#f4f5f7" stroke="#7b8492" stroke-width="2"/>' +
    '<path d="M60,200 L22,178 L22,235 L60,235 Z" fill="#f4f5f7" stroke="#7b8492" stroke-width="2"/>',
  sprites: [
    { kind: 'emoji', text: '🛰️', x: 382, y: 80, size: 50 },
    only({ kind: 'text', text: '?', x: 440, y: 80, size: 40, fill: '#fff' }, 0, n),
    { kind: 'line', x: S[0], y: S[1], x2: E[0][0], y2: E[0][1], stroke: '#c7ccd4', sw: 12, keys: k(E, 'x2', 'y2') },
    { kind: 'line', x: E[0][0], y: E[0][1], x2: W[0][0], y2: W[0][1], stroke: '#c7ccd4', sw: 10, keys: [...k(E, 'x', 'y'), ...k(W, 'x2', 'y2')] },
    { kind: 'ellipse', x: W[0][0], y: W[0][1], w: 18, h: 18, cls: 'g3s-metal', keys: W.map(([x, y], t) => ({ t, x, y })) },
    ...joint(S, 'Shoulder'),
    ...joint(E[1], 'Elbow'),
    ...joint(W[1], 'Wrist'),
    only({ kind: 'emoji', text: '💪', x: 400, y: 150, size: 50 }, 1, n),
    from({ kind: 'text', text: '🇨🇦 Canadarm, 1981', x: 20, y: 26, size: 19, anchor: 'start', fill: '#fff' }, 2, n),
    only({ kind: 'emoji', text: '🕹️', x: 60, y: 130, size: 44 }, 3, n),
    only({ kind: 'emoji', text: '💻', x: 120, y: 130, size: 44 }, 3, n),
  ],
};
export default scene;
