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
 * What changes with age. Each younger grade gets less: shorter lessons, fewer words, fewer problems,
 * and something to watch or play with in every step, because younger children can't concentrate as
 * long. Grades 4 to 6 share Grade 5's limits. `npm run verify` enforces all of them.
 */
export interface GradeProfile {
  /** Most problems per level: Warm-up, Build, Deep Think. */
  maxPerLevel: { 1: number; 2: number; 3: number };
  /** Fewest problems per level. */
  minPerLevel: { 1: number; 2: number; 3: number };
  /** Problems to solve at one level before the next unlocks. */
  unlockAfter: number;
  /** Most parts an investigation may have. 0 means no investigations. */
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
  /** Most blocks in one lesson step. */
  maxBlocksPerStep: number;
  /** Most key terms. 0 means no limit. */
  maxKeyTerms: number;
  /** Every lesson step must hold a visual, experiment or figure. */
  visualEveryStep: boolean;
  /** Longest problem prompt in words, apart from passages and tables. 0 means no limit. */
  maxPromptWords: number;
}

/** Grades 4 to 6: Grade 5's limits. */
const GRADES_4_TO_6: GradeProfile = {
  maxPerLevel: { 1: 3, 2: 4, 3: 2 },
  minPerLevel: { 1: 3, 2: 3, 3: 2 },
  unlockAfter: UNLOCK_AFTER,
  maxParts: 3,
  maxDeepSteps: 5,
  minMoves: 4,
  maxWords: 40,
  maxSentences: 2,
  minBlobWords: 25,
  maxBigIdeaBullets: 0,
  maxSteps: 8,
  maxBlocksPerStep: 5,
  maxKeyTerms: 0,
  visualEveryStep: false,
  maxPromptWords: 0,
};

const GRADE_3: GradeProfile = {
  maxPerLevel: { 1: 2, 2: 2, 3: 2 },
  minPerLevel: { 1: 2, 2: 2, 3: 2 },
  unlockAfter: 1,
  maxParts: 2,
  maxDeepSteps: 3,
  minMoves: 3,
  maxWords: 25,
  maxSentences: 2,
  minBlobWords: 18,
  maxBigIdeaBullets: 3,
  maxSteps: 5,
  maxBlocksPerStep: 3,
  maxKeyTerms: 5,
  visualEveryStep: true,
  maxPromptWords: 40,
};

const GRADE_2: GradeProfile = {
  maxPerLevel: { 1: 2, 2: 1, 3: 1 },
  minPerLevel: { 1: 2, 2: 1, 3: 1 },
  unlockAfter: 1,
  maxParts: 0,
  maxDeepSteps: 1,
  minMoves: 3,
  maxWords: 15,
  maxSentences: 2,
  minBlobWords: 12,
  maxBigIdeaBullets: 2,
  maxSteps: 4,
  maxBlocksPerStep: 2,
  maxKeyTerms: 4,
  visualEveryStep: true,
  maxPromptWords: 20,
};

const GRADE_1: GradeProfile = {
  maxPerLevel: { 1: 1, 2: 1, 3: 1 },
  minPerLevel: { 1: 1, 2: 1, 3: 1 },
  unlockAfter: 1,
  maxParts: 0,
  maxDeepSteps: 1,
  minMoves: 2,
  maxWords: 10,
  maxSentences: 2,
  minBlobWords: 8,
  maxBigIdeaBullets: 2,
  maxSteps: 3,
  maxBlocksPerStep: 2,
  maxKeyTerms: 3,
  visualEveryStep: true,
  maxPromptWords: 12,
};

export const gradeProfile = (g: number): GradeProfile => (g <= 1 ? GRADE_1 : g === 2 ? GRADE_2 : g === 3 ? GRADE_3 : GRADES_4_TO_6);

/** Problems in a full set for a grade. */
export const problemsPerTopic = (g: number) => {
  const m = gradeProfile(g).maxPerLevel;
  return m[1] + m[2] + m[3];
};
