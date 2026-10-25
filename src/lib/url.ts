import { SITE_URL } from '../site.ts';

const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** Internal link that respects the deploy base path: href('grade-5/') → '/ab_edu/grade-5/'. */
export const href = (path = '') => BASE + path.replace(/^\//, '');

/** Absolute URL for canonical links, sitemaps and JSON-LD. */
export const absolute = (path = '') => new URL(href(path), SITE_URL).toString();
