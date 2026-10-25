// Concept page: unlocks levels progressively, fills the level meters and celebrates
// milestones. Unlocking is encouragement, not a wall: "Try it now" always opens a level.
import { load, onChange } from './progress.ts';
import { UNLOCK_AFTER, LEVELS } from '../site.ts';
import { ENTER_AFTER_SOLVED } from '../lib/srs.ts';
import type { GradedDetail } from './problem-card.ts';

const PEEK_KEY = 'abedu.peek';

function peeked(): Set<string> {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(PEEK_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

export function initPractice() {
  const root = document.querySelector<HTMLElement>('[data-concept]');
  if (!root) return;
  const concept = root.dataset.concept!;
  const sections = [...document.querySelectorAll<HTMLElement>('.level-section')];
  const toast = document.querySelector<HTMLElement>('[data-celebrate]');
  let toastTimer = 0;

  const solvedAt = (section: HTMLElement) => {
    const p = load().problems;
    const cards = [...section.querySelectorAll<HTMLElement>('problem-card')];
    return { solved: cards.filter((c) => p[c.dataset.key!]?.s).length, total: cards.length };
  };

  const update = () => {
    const open = peeked();
    sections.forEach((section, i) => {
      const level = Number(section.dataset.level);
      const { solved, total } = solvedAt(section);
      section.querySelector('[data-level-count]')!.textContent = `${solved} / ${total} solved`;
      (section.querySelector('[data-level-meter]') as HTMLElement).style.width = `${total ? (solved / total) * 100 : 0}%`;
      const toc = document.querySelector(`[data-toc-level="${level}"] [data-toc-count]`);
      if (toc) toc.textContent = `${solved}/${total}`;
      if (i === 0) return;
      const prev = solvedAt(sections[i - 1]);
      const unlocked = prev.solved >= Math.min(UNLOCK_AFTER, prev.total) || solved > 0 || open.has(`${concept}#${level}`);
      section.classList.toggle('is-locked', !unlocked);
    });
  };

  const celebrate = (text: string) => {
    if (!toast) return;
    toast.innerHTML = `<div class="celebrate__toast">${text}</div>`;
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => (toast.innerHTML = ''), 4200);
  };

  document.addEventListener('problem-graded', (e) => {
    const d = (e as CustomEvent<GradedDetail>).detail;
    if (!d.correct) return;
    const section = sections.find((s) => Number(s.dataset.level) === d.level);
    if (!section) return;
    const { solved, total } = solvedAt(section);
    const totalSolved = Object.entries(load().problems).filter(([k, r]) => k.startsWith(concept + '/') && r.s).length;
    const next = sections.find((s) => Number(s.dataset.level) === d.level + 1);
    if (solved === total) {
      celebrate(`🏆 You finished every ${LEVELS[d.level as 1 | 2 | 3].name} problem!`);
    } else if (next && solved === UNLOCK_AFTER && solvedAt(next).solved === 0) {
      celebrate(`🔓 ${LEVELS[(d.level + 1) as 2 | 3].name} unlocked! Ready for a challenge?`);
    } else if (totalSolved === ENTER_AFTER_SOLVED) {
      celebrate('📅 Added to your Review. It will come back tomorrow so you remember it.');
    } else if (d.firstTry && d.level === 3) {
      celebrate('🌟 First try on a Deep Think problem. Impressive reasoning!');
    }
  });

  document.querySelectorAll<HTMLButtonElement>('[data-unlock]').forEach((b) =>
    b.addEventListener('click', () => {
      const section = b.closest<HTMLElement>('.level-section')!;
      const set = peeked();
      set.add(`${concept}#${section.dataset.level}`);
      try {
        sessionStorage.setItem(PEEK_KEY, JSON.stringify([...set]));
      } catch {}
      section.classList.remove('is-locked');
      section.querySelector<HTMLElement>('problem-card')?.scrollIntoView({ block: 'start' });
    }),
  );

  update();
  onChange(update);
}
