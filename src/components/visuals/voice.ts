// How a voice delivers a sentence (LANENG5-OI2-GQ1-LO1, K2.4 to K2.6), and reading aloud with the
// browser's built-in speech. Speech is an extra: every visual that uses it also works silently.

export type Inflection = 'rising' | 'falling' | 'flat';
export type Pace = 'slow' | 'medium' | 'fast';

/** Height of the voice at each word, from 0 (low) to 1 (high). The stressed word jumps up. */
export function contour(words: number, inflection: Inflection, stress: number): number[] {
  return Array.from({ length: words }, (_, i) => {
    const t = words > 1 ? i / (words - 1) : 0;
    const line = inflection === 'rising' ? 0.25 + 0.5 * t : inflection === 'falling' ? 0.7 - 0.5 * t : 0.45;
    return Math.min(1, line + (i === stress ? 0.25 : 0));
  });
}

export const PACE_RATE: Record<Pace, number> = { slow: 0.7, medium: 1, fast: 1.45 };

/** Speech pitch for a height on the voice line: 0.6 is low, 1.6 is high. */
export const pitchAt = (height: number) => 0.6 + height;

/** How far a voice carries, from breath, body and energy together (K2.5, S2.2). 0 to 3 rows of the room. */
export function voiceReach(breath: boolean, body: boolean, energy: boolean): number {
  return [breath, body, energy].filter(Boolean).length;
}

// --- Browser only below ---

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

/** Settles the utterance in progress. Some browsers fire no event at all when speech is cancelled. */
let settle: (() => void) | null = null;

export function stopSpeaking() {
  if (canSpeak()) speechSynthesis.cancel();
  settle?.();
  settle = null;
}

/** Calls `stop` when the element disappears. A lesson step is hidden without leaving the page. */
export function whenHidden(el: HTMLElement, stop: () => void) {
  new ResizeObserver(() => {
    if (!el.offsetWidth) stop();
  }).observe(el);
  window.addEventListener('pagehide', stop);
}

/** Speaks one piece of text and resolves when it ends. Prefers a voice on the device. */
export function speak(text: string, opts: { rate?: number; pitch?: number } = {}): Promise<void> {
  return new Promise((resolve) => {
    if (!canSpeak()) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-CA';
    u.rate = opts.rate ?? 0.9;
    u.pitch = opts.pitch ?? 1;
    const voices = speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
    u.voice = voices.find((v) => v.localService && v.lang === 'en-CA') ?? voices.find((v) => v.localService) ?? null;
    settle = resolve;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}
