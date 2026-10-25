import type { APIRoute } from 'astro';
import { absolute } from '../lib/url.ts';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nDisallow: ${new URL(absolute('data/')).pathname}\n\nSitemap: ${absolute('sitemap-index.xml')}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });
