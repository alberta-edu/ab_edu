// Where English words came from and how their meanings moved (LANENG5-OI3-GQ1-LO1, K1.1, K1.2).
// Etymologies are from Wiktionary (en.wiktionary.org), read October 2026. The map pin marks where the
// source language was spoken, not the exact place the word was first used.
import type { LonLat } from './ancient-map.ts';

export interface WordOrigin {
  word: string;
  language: string;
  source: string;
  sourceMeaning: string;
  at: LonLat;
}

export const ORIGINS: WordOrigin[] = [
  { word: 'kayak', language: 'Inuktitut', source: 'qayaq', sourceMeaning: 'hunter’s boat', at: [-85, 68] },
  { word: 'muskeg', language: 'Cree', source: 'maskek', sourceMeaning: 'a northern bog', at: [-108, 55] },
  { word: 'toboggan', language: 'Mi’kmaq or Abenaki, then French', source: 'tepaqan or dabôgan', sourceMeaning: 'a sled', at: [-65, 46] },
  { word: 'sky', language: 'Old Norse', source: 'ský', sourceMeaning: 'cloud', at: [10, 61] },
  { word: 'menu', language: 'French', source: 'menu', sourceMeaning: 'a detailed list', at: [2, 47] },
  { word: 'video', language: 'Latin', source: 'videō', sourceMeaning: 'I see', at: [12.5, 42] },
  { word: 'telephone', language: 'Ancient Greek', source: 'têle + phōnḗ', sourceMeaning: 'far away + voice', at: [23, 38] },
  { word: 'algebra', language: 'Arabic', source: 'al-jabr', sourceMeaning: 'resetting of broken parts', at: [44, 33] },
  { word: 'shampoo', language: 'Hindi', source: 'cā̃po', sourceMeaning: 'press, knead', at: [78, 26] },
  { word: 'emoji', language: 'Japanese', source: 'e + moji', sourceMeaning: 'picture + character', at: [139, 36] },
];

export interface MeaningShift {
  word: string;
  stops: { when: string; meaning: string }[];
}

export const SHIFTS: MeaningShift[] = [
  {
    word: 'nice',
    stops: [
      { when: 'In Latin', meaning: '*nescius*: not knowing, ignorant' },
      { when: 'In Old French', meaning: 'simple, foolish' },
      { when: 'Today', meaning: 'pleasant, kind' },
    ],
  },
  {
    word: 'awful',
    stops: [
      { when: 'Long ago', meaning: 'full of awe; awe-inspiring' },
      { when: 'Today', meaning: 'very bad' },
    ],
  },
  {
    word: 'mouse',
    stops: [
      { when: 'Long ago', meaning: 'a small furry animal' },
      { when: 'Today', meaning: 'also a tool that moves a pointer on a computer screen' },
    ],
  },
  {
    word: 'cloud',
    stops: [
      { when: 'Long ago', meaning: 'water droplets floating in the sky' },
      { when: 'Today', meaning: 'also computers on the internet that store your files' },
    ],
  },
];

export interface NewWord {
  word: string;
  year: string;
  how: string;
}

export const NEW_WORDS: NewWord[] = [
  { word: 'blog', year: '1999', how: 'Shortened from *weblog*, a log kept on the web.' },
  { word: 'selfie', year: '2002', how: '*Self* + *-ie*. First written in Australia.' },
  { word: 'podcast', year: '2004', how: 'A blend of *iPod* and *broadcast*.' },
];
