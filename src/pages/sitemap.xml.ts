// /sitemap.xml — every public page, with the date it last changed.
// Submit https://<your-domain>/sitemap.xml in Google Search Console.
import type { APIRoute } from 'astro';
import { getGames, getGuides, getGuideDate, getGuideGameId, getGameUrl, getGuideUrl } from '@/utils/content';
import { toIsoDate } from '@/utils/date';

interface SitemapEntry {
  path: string;
  lastmod?: Date;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Set `site` in astro.config.mjs to build the sitemap.');

  const [games, guides] = await Promise.all([getGames(), getGuides()]);
  // Drafts never go in the sitemap, even when previewing in dev.
  const publicGuides = guides.filter((guide) => !guide.data.draft);

  const newestGuideDate = (list: typeof publicGuides) =>
    list.length > 0 ? new Date(Math.max(...list.map((g) => getGuideDate(g).getTime()))) : undefined;

  const entries: SitemapEntry[] = [
    { path: '/', lastmod: newestGuideDate(publicGuides) },
    ...games.map((game) => ({
      path: getGameUrl(game),
      lastmod: newestGuideDate(publicGuides.filter((g) => getGuideGameId(g) === game.id)),
    })),
    ...publicGuides.map((guide) => ({ path: getGuideUrl(guide), lastmod: getGuideDate(guide) })),
  ];

  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = escapeXml(new URL(path, site).toString());
      return lastmod
        ? `  <url><loc>${loc}</loc><lastmod>${toIsoDate(lastmod)}</lastmod></url>`
        : `  <url><loc>${loc}</loc></url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
