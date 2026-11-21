// Structured data (JSON-LD) for Google. It tells search engines what each page is:
// the site itself, a game's collection of guides, or a single guide article.
// Test any page at https://search.google.com/test/rich-results once the site is live.
import { SITE } from '@/site.config';
import { getGameUrl, getGuideDate, getGuideUrl, type Game, type Guide } from '@/utils/content';

type JsonLd = Record<string, unknown>;

function absolute(path: string, site: URL): string {
  return new URL(path, site).toString();
}

export function websiteSchema(site: URL): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    description: SITE.description,
    url: absolute('/', site),
    inLanguage: SITE.locale,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[], site: URL): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path, site),
    })),
  };
}

export function gameHubSchema(game: Game, guides: Guide[], site: URL): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${game.data.name} Guides`,
    description: game.data.description,
    url: absolute(getGameUrl(game), site),
    inLanguage: SITE.locale,
    about: { '@type': 'VideoGame', name: game.data.name },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: guides.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absolute(getGuideUrl(guide), site),
        name: guide.data.title,
      })),
    },
  };
}

export function guideSchema(guide: Guide, game: Game, site: URL): JsonLd {
  const url = absolute(getGuideUrl(guide), site);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.data.title,
    description: guide.data.description,
    url,
    mainEntityOfPage: url,
    inLanguage: SITE.locale,
    datePublished: guide.data.publishedAt.toISOString(),
    dateModified: getGuideDate(guide).toISOString(),
    author: { '@type': 'Person', name: guide.data.author },
    publisher: { '@type': 'Organization', name: SITE.name, url: absolute('/', site) },
    about: { '@type': 'VideoGame', name: game.data.name },
    ...(guide.data.tags.length > 0 && { keywords: guide.data.tags.join(', ') }),
    ...((guide.data.image ?? game.data.cover) && { image: absolute((guide.data.image ?? game.data.cover)!, site) }),
  };
}
