// /robots.txt — lets all search engines crawl the site and points them to the sitemap.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('/sitemap.xml', site).toString();
  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
