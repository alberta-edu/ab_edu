// Water safety in every season (SCI3-OI1-GQ1-LO1 S5.5). Sources: Canadian Red Cross; Lifesaving
// Society Alberta and Northwest Territories.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const seasons = [
  { button: '🌷 Spring', icon: '🌊', tip: 'Stay back from the edge', say: 'Spring: melting snow makes rivers high, fast and cold. Stay well back from the edge.' },
  { button: '☀️ Summer', icon: '🦺', tip: 'Wear a life jacket', say: 'Summer: swim only with a grown-up watching. Wear a life jacket in a boat.' },
  { button: '🍂 Fall', icon: '🚫', tip: 'New ice is thin', say: 'Fall: new ice is thin and weak. Stay off it, even if it looks solid.' },
  { button: '❄️ Winter', icon: '📏', tip: 'Only checked ice', say: 'Winter: go on ice only when a grown-up has checked it is thick enough.' },
];
const n = seasons.length;
const sprites: Sprite[] = [];
seasons.forEach((s, i) => {
  sprites.push(
    only({ kind: 'emoji', text: s.button.split(' ')[0], x: 120, y: 110, size: 96 }, i, n),
    only({ kind: 'emoji', text: s.icon, x: 340, y: 100, size: 80 }, i, n),
    only({ kind: 'text', text: s.tip, x: 240, y: 210, size: 28, cls: 'g3s-label' }, i, n),
  );
});

const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: seasons.map((s) => ({ label: s.button, say: s.say })),
  bg: '<rect class="g3s-sky" width="480" height="250"/>',
  sprites,
};
export default scene;
