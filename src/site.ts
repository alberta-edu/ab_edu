// Site-wide constants. Imported by astro.config.mjs, so keep this file free of Astro imports.

export const SITE_NAME = 'Alberta Edu';
export const SITE_TAGLINE = 'Free practice that follows the Alberta curriculum';
export const SITE_URL = 'https://alberta-edu.github.io';
/** GitHub Pages project path. Change to '/' if the site moves to a custom domain. */
export const BASE_PATH = '/ab_edu';

export type SubjectSlug = 'math' | 'science' | 'social-studies' | 'english-language-arts';

export interface SubjectInfo {
  slug: SubjectSlug;
  name: string;
  shortName: string;
  /** Short line under the subject name on grade pages. */
  blurb: string;
  icon: string;
}

/** Order matches how the subjects appear on grade pages. */
export const SUBJECTS: SubjectInfo[] = [
  {
    slug: 'english-language-arts',
    name: 'English Language Arts and Literature',
    shortName: 'ELA',
    blurb: 'Read closely, find evidence, and write with craft.',
    icon: 'book',
  },
  {
    slug: 'math',
    name: 'Mathematics',
    shortName: 'Math',
    blurb: 'Numbers, patterns, shapes and data, step by step.',
    icon: 'math',
  },
  {
    slug: 'science',
    name: 'Science',
    shortName: 'Science',
    blurb: 'Investigate matter, energy, Earth, life and space.',
    icon: 'flask',
  },
  {
    slug: 'social-studies',
    name: 'Social Studies',
    shortName: 'Social',
    blurb: 'People, places, the past and how we live together.',
    icon: 'globe',
  },
];

/** Grades the site follows. Kindergarten is not supported. A grade appears once it has content. */
export const GRADES = [1, 2, 3, 4, 5, 6] as const;
export type Grade = (typeof GRADES)[number];
export const gradeSlug = (g: number) => `grade-${g}`;
export const gradeName = (g: number) => `Grade ${g}`;

export const LEVELS = {
  1: { name: 'Warm-up', difficulty: 'Easy', stars: 1 },
  2: { name: 'Build', difficulty: 'Medium', stars: 2 },
  3: { name: 'Deep Think', difficulty: 'Tricky', stars: 3 },
} as const;

/** Problems a student must solve at one level before the next level unlocks (Grades 3–6). */
export const UNLOCK_AFTER = 2;

/**
 * What changes with age. Grades 1 and 2 read little, so lessons have less text and more to
 * watch, and practice is shorter. `npm run verify` enforces these limits.
 */
export interface GradeProfile {
  /** Most problems per level: Warm-up, Build, Deep Think. */
  maxPerLevel: { 1: number; 2: number; 3: number };
  /** Problems to solve at one level before the next unlocks. */
  unlockAfter: number;
  /** Most parts an investigation may have. */
  maxParts: number;
  /** Most steps Deep Think may take, counting each investigation part as a step. */
  maxDeepSteps: number;
  /** Fewest different thinking moves in a set. */
  minMoves: number;
  /** Longest prose paragraph or list item, in words. */
  maxWords: number;
  /** A paragraph with more sentences than this is a blob once it reaches minBlobWords. */
  maxSentences: number;
  minBlobWords: number;
  /** Most bullets in the Big idea. 0 means no limit. */
  maxBigIdeaBullets: number;
  /** Most lesson steps. */
  maxSteps: number;
  /** Every lesson step must hold a visual, experiment or figure. */
  visualEveryStep: boolean;
  /** Longest problem prompt in words, apart from passages and tables. 0 means no limit. */
  maxPromptWords: number;
}

const YOUNG: GradeProfile = {
  maxPerLevel: { 1: 2, 2: 2, 3: 2 },
  unlockAfter: 1,
  maxParts: 2,
  maxDeepSteps: 3,
  minMoves: 3,
  maxWords: 20,
  maxSentences: 2,
  minBlobWords: 15,
  maxBigIdeaBullets: 3,
  maxSteps: 5,
  visualEveryStep: true,
  maxPromptWords: 30,
};

const OLDER: GradeProfile = {
  maxPerLevel: { 1: 3, 2: 4, 3: 2 },
  unlockAfter: UNLOCK_AFTER,
  maxParts: 3,
  maxDeepSteps: 5,
  minMoves: 4,
  maxWords: 40,
  maxSentences: 2,
  minBlobWords: 25,
  maxBigIdeaBullets: 0,
  maxSteps: 8,
  visualEveryStep: false,
  maxPromptWords: 0,
};

export const gradeProfile = (g: number): GradeProfile => (g <= 2 ? YOUNG : OLDER);
