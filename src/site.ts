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
    blurb: 'Ancient civilizations, maps, trade and citizenship.',
    icon: 'globe',
  },
];

export const GRADES = [
  { slug: 'grade-5', number: 5, name: 'Grade 5', available: true },
] as const;

export const LEVELS = {
  1: { name: 'Warm-up', difficulty: 'Easy', stars: 1 },
  2: { name: 'Build', difficulty: 'Medium', stars: 2 },
  3: { name: 'Deep Think', difficulty: 'Tricky', stars: 3 },
} as const;

/** Problems a student must solve at one level before the next level unlocks. */
export const UNLOCK_AFTER = 2;
