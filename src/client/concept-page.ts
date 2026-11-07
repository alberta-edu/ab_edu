// Concept page: Learn / Practice tabs, the lesson stepper, the practice
// level tabs and the one-problem-at-a-time pager.
// Without JavaScript everything is simply shown in order, so content stays crawlable.
import { load, onChange } from './progress.ts';
import { UNLOCK_AFTER as DEFAULT_UNLOCK, LEVELS } from '../site.ts';
import { ENTER_AFTER_SOLVED } from '../lib/srs.ts';
import type { GradedDetail } from './problem-card.ts';

type Tab = 'learn' | 'practice';

const store = {
  get(k: string) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
};

export function initConceptPage() {
  const root = document.querySelector<HTMLElement>('[data-concept]');
  if (!root) return;
  root.classList.add('js');
  const concept = root.dataset.concept!;
  // Grades 1 and 2 unlock sooner (gradeProfile in src/site.ts); the page says how many.
  const UNLOCK_AFTER = Number(root.dataset.unlockAfter) || DEFAULT_UNLOCK;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toast = document.querySelector<HTMLElement>('[data-celebrate]');
  let toastTimer = 0;
  const celebrate = (text: string) => {
    if (!toast) return;
    toast.innerHTML = `<div class="celebrate__toast">${text}</div>`;
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => (toast.innerHTML = ''), 4200);
  };
  const tabsBar = root.querySelector<HTMLElement>('[data-tabs]')!;
  const scrollToTabs = () => {
    const y = tabsBar.getBoundingClientRect().top + window.scrollY - 70;
    if (window.scrollY > y) window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  };

  // ------------------------------------------------------------------ tabs
  const tabs = [...root.querySelectorAll<HTMLAnchorElement>('[data-tab]')];
  const panels = new Map(tabs.map((t) => [t.dataset.tab as Tab, root.querySelector<HTMLElement>(`#${t.dataset.tab}`)!]));

  const showTab = (tab: Tab, focus = false) => {
    for (const t of tabs) {
      const on = t.dataset.tab === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels.get(t.dataset.tab as Tab)!.hidden = !on;
    }
    if (focus) tabs.find((t) => t.dataset.tab === tab)!.focus();
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      history.replaceState(null, '', `#${t.dataset.tab}`);
      showTab(t.dataset.tab as Tab);
      scrollToTabs();
    });
    t.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      const next = tabs[(i + dir + tabs.length) % tabs.length];
      history.replaceState(null, '', `#${next.dataset.tab}`);
      showTab(next.dataset.tab as Tab, true);
    });
  });

  // ------------------------------------------------------------------ lesson stepper
  const steps = [...root.querySelectorAll<HTMLElement>('.lesson-step')];
  const stepLinks = [...root.querySelectorAll<HTMLAnchorElement>('[data-step-link]')];
  const stepNav = root.querySelector<HTMLElement>('[data-step-nav]')!;
  const nextBtn = stepNav.querySelector<HTMLButtonElement>('[data-step-next]')!;
  const prevBtn = stepNav.querySelector<HTMLButtonElement>('[data-step-prev]')!;
  const stepKey = `abedu.step.${concept}`;
  const visited = new Set<number>(JSON.parse(store.get(`${stepKey}.seen`) ?? '[]'));
  let step = Math.min(Number(store.get(stepKey) ?? 1) || 1, steps.length);
  stepNav.hidden = false;

  const showStep = (n: number, scroll = false) => {
    step = Math.max(1, Math.min(steps.length, n));
    visited.add(step);
    store.set(stepKey, String(step));
    store.set(`${stepKey}.seen`, JSON.stringify([...visited]));
    steps.forEach((s, i) => (s.hidden = i + 1 !== step));
    stepLinks.forEach((a) => {
      const k = Number(a.dataset.stepLink);
      a.toggleAttribute('aria-current', k === step);
      if (k === step) a.setAttribute('aria-current', 'step');
      a.classList.toggle('is-visited', visited.has(k) && k !== step);
    });
    stepNav.querySelector('[data-step-count]')!.textContent = `Step ${step} of ${steps.length}`;
    prevBtn.disabled = step === 1;
    const last = step === steps.length;
    nextBtn.textContent = last ? 'Start practice ✏️' : `Next: ${steps[step].querySelector('h2')!.textContent} →`;
    // Bring the active stepper pill into view on phones.
    stepLinks[step - 1]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'auto' });
    if (scroll) scrollToTabs();
  };
  nextBtn.addEventListener('click', () => {
    if (step === steps.length) {
      history.replaceState(null, '', '#practice');
      showTab('practice');
      scrollToTabs();
    } else showStep(step + 1, true);
  });
  prevBtn.addEventListener('click', () => showStep(step - 1, true));
  stepLinks.forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      showStep(Number(a.dataset.stepLink), true);
    }),
  );
  root.querySelector('.stepper__practice')?.addEventListener('click', (e) => {
    e.preventDefault();
    history.replaceState(null, '', '#practice');
    showTab('practice');
    scrollToTabs();
  });

  // ------------------------------------------------------------------ practice levels + pager
  const levelSections = [...root.querySelectorAll<HTMLElement>('.level-section')];
  const levelTabs = [...root.querySelectorAll<HTMLButtonElement>('[data-level-tab]')];
  const peekKey = `abedu.peek.${concept}`;
  const peeked = new Set<string>(JSON.parse(store.get(peekKey) ?? '[]'));
  const cardsOf = (section: HTMLElement) => [...section.querySelectorAll<HTMLElement>('problem-card')];
  const solvedIn = (section: HTMLElement) => {
    const p = load().problems;
    const cards = cardsOf(section);
    return { solved: cards.filter((c) => p[c.dataset.key!]?.s).length, total: cards.length };
  };
  const pagerIndex = new Map<HTMLElement, number>();

  const showProblem = (section: HTMLElement, i: number) => {
    const cards = cardsOf(section);
    const idx = Math.max(0, Math.min(cards.length - 1, i));
    pagerIndex.set(section, idx);
    const p = load().problems;
    cards.forEach((c, k) => (c.hidden = k !== idx));
    section.querySelectorAll<HTMLButtonElement>('[data-goto]').forEach((d, k) => {
      d.classList.toggle('is-current', k === idx);
      d.classList.toggle('is-solved', !!p[cards[k].dataset.key!]?.s);
      d.toggleAttribute('aria-current', k === idx);
    });
    section.querySelector('[data-pager-count]')!.textContent = `Problem ${idx + 1} of ${cards.length}`;
    section.querySelector<HTMLButtonElement>('[data-pager-prev]')!.disabled = idx === 0;
    // Next opens only once this problem is solved. On the last problem it leads on to the
    // next level, if that level is unlocked.
    const next = section.querySelector<HTMLButtonElement>('[data-pager-next]')!;
    const target = nextTarget(section, idx);
    const ready = !!p[cards[idx].dataset.key!]?.s && target !== null;
    next.disabled = !ready;
    next.textContent = target && 'level' in target ? `Next: ${LEVELS[target.level as 1 | 2 | 3].name} →` : 'Next problem →';
    next.classList.toggle('btn--primary', ready);
    next.classList.toggle('btn--ghost', !ready);
  };

  /** Where Next goes from problem idx: the next problem, the next level, or nowhere. */
  const nextTarget = (section: HTMLElement, idx: number): { problem: number } | { level: number } | null => {
    if (idx < cardsOf(section).length - 1) return { problem: idx + 1 };
    const i = levelSections.indexOf(section);
    return i + 1 < levelSections.length && isUnlocked(i + 1) ? { level: i + 2 } : null;
  };

  const firstUnsolved = (section: HTMLElement) => {
    const p = load().problems;
    const i = cardsOf(section).findIndex((c) => !p[c.dataset.key!]?.s);
    return i === -1 ? 0 : i;
  };

  const isUnlocked = (i: number) => {
    if (i === 0) return true;
    const prev = solvedIn(levelSections[i - 1]);
    return prev.solved >= Math.min(UNLOCK_AFTER, prev.total) || solvedIn(levelSections[i]).solved > 0 || peeked.has(String(i + 1));
  };

  const showLevel = (level: number) => {
    levelSections.forEach((s) => (s.hidden = Number(s.dataset.level) !== level));
    levelTabs.forEach((t) => {
      const on = Number(t.dataset.levelTab) === level;
      t.setAttribute('aria-selected', String(on));
    });
    const section = levelSections[level - 1];
    if (!pagerIndex.has(section)) showProblem(section, firstUnsolved(section));
  };

  const refreshPractice = () => {
    let total = 0;
    let solvedAll = 0;
    levelSections.forEach((section, i) => {
      const { solved, total: t } = solvedIn(section);
      total += t;
      solvedAll += solved;
      section.querySelector('[data-level-count]')!.textContent = `${solved} / ${t} solved`;
      (section.querySelector('[data-level-meter]') as HTMLElement).style.width = `${t ? (solved / t) * 100 : 0}%`;
      const unlocked = isUnlocked(i);
      section.classList.toggle('is-locked', !unlocked);
      const tab = levelTabs[i];
      tab.querySelector('[data-level-tab-count]')!.textContent = `${solved}/${t}`;
      (tab.querySelector('[data-level-lock]') as HTMLElement).hidden = unlocked;
      tab.classList.toggle('is-complete', solved === t);
      section.querySelector<HTMLElement>('[data-level-done]')!.hidden = solved !== t;
      if (pagerIndex.has(section)) showProblem(section, pagerIndex.get(section)!);
    });
    root.querySelector('[data-practice-count]')!.textContent = `${solvedAll}/${total}`;
  };

  levelSections.forEach((section) => {
    section.querySelector<HTMLElement>('[data-pager-dots]')!.hidden = false;
    section.querySelector<HTMLElement>('[data-pager-nav]')!.hidden = false;
    section.querySelectorAll<HTMLButtonElement>('[data-goto]').forEach((d) => d.addEventListener('click', () => showProblem(section, Number(d.dataset.goto))));
    section.querySelector('[data-pager-prev]')!.addEventListener('click', () => showProblem(section, pagerIndex.get(section)! - 1));
    section.querySelector('[data-pager-next]')!.addEventListener('click', () => {
      const target = nextTarget(section, pagerIndex.get(section)!);
      if (!target) return;
      if ('level' in target) {
        history.replaceState(null, '', `#level-${target.level}`);
        showLevel(target.level);
        scrollToTabs();
      } else showProblem(section, target.problem);
    });
    section.querySelector('[data-unlock]')?.addEventListener('click', () => {
      peeked.add(section.dataset.level!);
      store.set(peekKey, JSON.stringify([...peeked]));
      refreshPractice();
    });
  });
  levelTabs.forEach((t) => t.addEventListener('click', () => showLevel(Number(t.dataset.levelTab))));
  root.querySelectorAll<HTMLButtonElement>('[data-goto-level]').forEach((b) =>
    b.addEventListener('click', () => {
      showLevel(Number(b.dataset.gotoLevel));
      scrollToTabs();
    }),
  );

  document.addEventListener('problem-graded', (e) => {
    const d = (e as CustomEvent<GradedDetail>).detail;
    if (!d.correct) return;
    const section = levelSections[d.level - 1];
    if (!section) return;
    const { solved, total } = solvedIn(section);
    const totalSolved = Object.entries(load().problems).filter(([k, r]) => k.startsWith(concept + '/') && r.s).length;
    const next = levelSections[d.level];
    if (solved === total) celebrate(`🏆 You finished every ${LEVELS[d.level as 1 | 2 | 3].name} problem!`);
    else if (next && solved === UNLOCK_AFTER && solvedIn(next).solved === 0)
      celebrate(`🔓 ${LEVELS[(d.level + 1) as 2 | 3].name} unlocked! Ready for a challenge?`);
    else if (totalSolved === ENTER_AFTER_SOLVED) celebrate('📅 Added to your Review. It will come back tomorrow so you remember it.');
    else if (d.firstTry && d.level === 3) celebrate('🌟 First try on a Deep Think problem. Impressive reasoning!');
  });

  // ------------------------------------------------------------------ route from the URL hash
  const route = () => {
    const h = location.hash.slice(1);
    if (h === 'practice' || h.startsWith('level-')) {
      showTab('practice');
      if (h.startsWith('level-')) showLevel(Number(h.slice(6)) || 1);
    } else if (h.startsWith('step-')) {
      showTab('learn');
      showStep(Number(h.slice(5)) || 1);
    } else if (h.startsWith('q-')) {
      const card = document.getElementById(h);
      const section = card?.closest<HTMLElement>('.level-section');
      if (card && section) {
        showTab('practice');
        showLevel(Number(section.dataset.level));
        showProblem(section, cardsOf(section).indexOf(card));
      }
    } else showTab('learn');
  };

  showStep(step);
  showLevel(1);
  refreshPractice();
  route();
  window.addEventListener('hashchange', route);
  onChange(refreshPractice);
}
