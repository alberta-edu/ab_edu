// Fills progress rings ([data-ring="g5/concept-id"] with data-total) from saved progress.
import { load, onChange, solvedIn } from './progress.ts';
import { isDue } from '../lib/srs.ts';

export function initRings() {
  const update = () => {
    const p = load();
    document.querySelectorAll<HTMLElement>('[data-ring]').forEach((el) => {
      const keys = el.dataset.ring!.split(' ');
      const total = Number(el.dataset.total);
      const solved = keys.reduce((n, k) => n + solvedIn(k, p), 0);
      const pct = total ? Math.round((solved / total) * 100) : 0;
      el.style.setProperty('--p', String(pct));
      el.querySelector('span')!.textContent = `${pct}%`;
      el.setAttribute('aria-label', `${solved} of ${total} problems solved`);
    });
    document.querySelectorAll<HTMLElement>('[data-due-for]').forEach((el) => {
      const r = p.review[el.dataset.dueFor!];
      el.hidden = !(r && isDue(r, Date.now()));
    });
  };
  update();
  onChange(update);
}
