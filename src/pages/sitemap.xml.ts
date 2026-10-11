import type { APIRoute } from 'astro';
import content from '../data/content.json';

/*
 * sitemap.xml, generated at build time.
 *
 * Static pages are discovered from the files in src/pages (so a new top-level
 * page is picked up automatically); case studies come from content.json. API
 * routes, this file, and dynamic [param] routes are skipped. URLs end in a
 * slash on purpose: that is the form the site serves (and what each page's
 * canonical tag points to) — the slash-less form 301s to it.
 */
const pageFiles = Object.keys(import.meta.glob('./**/*.astro')).filter(
  (file) => !file.includes('[') && !file.startsWith('./api/')
);

const staticPaths = pageFiles.map((file) => {
  const route = file
    .replace(/^\.\//, '')
    .replace(/\.astro$/, '')
    .replace(/(^|\/)index$/, '');
  return route === '' ? '/' : `/${route}/`;
});

const workPaths = content.work.map((study) => `/work/${study.slug}/`);

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('sitemap.xml needs `site` set in astro.config.mjs');

  const urls = [...new Set([...staticPaths, ...workPaths])].sort();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
