// /search-index.json — a small list of every guide, used by the search page.
// Built with the site, so search works with no server and no extra service.
// Drafts are included in `npm run dev` only, like everywhere else.
import type { APIRoute } from 'astro';
import { getCategoryLabel, getGames, getGuideDate, getGuideGameId, getGuides, getGuideUrl } from '@/utils/content';

export interface SearchEntry {
  title: string;
  description: string;
  quickAnswer: string;
  url: string;
  game: string;
  category: string;
  tags: string[];
  date: string;
}

export const GET: APIRoute = async () => {
  const [games, guides] = await Promise.all([getGames(), getGuides()]);
  const gamesById = new Map(games.map((game) => [game.id, game]));

  const entries: SearchEntry[] = guides.map((guide) => {
    const game = gamesById.get(getGuideGameId(guide))!;
    return {
      title: guide.data.title,
      description: guide.data.description,
      quickAnswer: guide.data.quickAnswer ?? '',
      url: getGuideUrl(guide),
      game: game.data.name,
      category: getCategoryLabel(game, guide.data.category),
      tags: guide.data.tags,
      date: getGuideDate(guide).toISOString().slice(0, 10),
    };
  });

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
