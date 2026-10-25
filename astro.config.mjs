// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL, BASE_PATH } from './src/site.ts';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  // Personal pages (review, progress) and the 404 page don't belong in search results.
  integrations: [sitemap({ filter: (page) => !/\/(review|progress|404)\/$/.test(page) })],
  devToolbar: { enabled: false },
});
