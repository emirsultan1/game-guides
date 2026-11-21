// Helpers for reading games and guides. Pages should use these instead of
// calling getCollection directly, so drafts and sorting work the same everywhere.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Game = CollectionEntry<'games'>;
export type Guide = CollectionEntry<'guides'>;

/** All games, in homepage order. */
export async function getGames(): Promise<Game[]> {
  const games = await getCollection('games');
  return games.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

/** The game id comes from the guide's folder: "rob-run/first-hour" -> "rob-run". */
export function getGuideGameId(guide: Guide): string {
  return guide.id.split('/')[0];
}

/** The guide's own slug, without the game folder: "rob-run/first-hour" -> "first-hour". */
export function getGuideSlug(guide: Guide): string {
  return guide.id.split('/').slice(1).join('/');
}

/** Public URL of a guide, e.g. /rob-run/first-hour-in-looty-bay */
export function getGuideUrl(guide: Guide): string {
  return `/${guide.id}`;
}

/** Public URL of a game hub, e.g. /rob-run */
export function getGameUrl(game: Game): string {
  return `/${game.id}`;
}

/** The date to show and sort by: last update if there is one, else publish date. */
export function getGuideDate(guide: Guide): Date {
  return guide.data.updatedAt ?? guide.data.publishedAt;
}

/**
 * All guides that should appear on the site, newest first.
 * Drafts are included in `npm run dev` only, so you can preview them.
 * Fails the build if a guide sits in a folder with no matching game, or uses
 * a category its game doesn't have.
 */
export async function getGuides(): Promise<Guide[]> {
  const [guides, games] = await Promise.all([getCollection('guides'), getCollection('games')]);
  const gamesById = new Map(games.map((game) => [game.id, game]));

  for (const guide of guides) {
    const gameId = getGuideGameId(guide);
    const game = gamesById.get(gameId);
    if (!game || !guide.id.includes('/')) {
      throw new Error(
        `Guide "${guide.id}" must be inside a game folder that has a matching src/content/games/<game>.json file.`,
      );
    }
    const categoryIds = game.data.categories.map((c) => c.id);
    if (!categoryIds.includes(guide.data.category)) {
      throw new Error(
        `Guide "${guide.id}" uses category "${guide.data.category}", but ${game.data.name} only has: ${categoryIds.join(', ')}.`,
      );
    }
  }

  return guides
    .filter((guide) => import.meta.env.DEV || !guide.data.draft)
    .sort((a, b) => getGuideDate(b).getTime() - getGuideDate(a).getTime());
}

/**
 * Games that have at least one guide to show, in homepage order.
 * A game with no guides yet (like a game that just came out) stays hidden
 * everywhere, so the site never shows an empty section.
 * Drafts count in `npm run dev`, so you can preview a game before publishing.
 */
export async function getGamesWithGuides(): Promise<Game[]> {
  const [games, guides] = await Promise.all([getGames(), getGuides()]);
  const gameIds = new Set(guides.map(getGuideGameId));
  return games.filter((game) => gameIds.has(game.id));
}

/** Games to list on the homepage and other pages: has guides and isn't archived. */
export async function getActiveGames(): Promise<Game[]> {
  const games = await getGamesWithGuides();
  return games.filter((game) => game.data.status !== 'archived');
}

/** Guides for one game, newest first. */
export async function getGuidesForGame(gameId: string): Promise<Guide[]> {
  const guides = await getGuides();
  return guides.filter((guide) => getGuideGameId(guide) === gameId);
}

/** The game a guide belongs to. */
export async function getGameForGuide(guide: Guide): Promise<Game> {
  const game = await getEntry('games', getGuideGameId(guide));
  if (!game) throw new Error(`No game found for guide "${guide.id}".`);
  return game;
}

/** The readable label of a category, e.g. "base" -> "Base & plot". */
export function getCategoryLabel(game: Game, categoryId: string): string {
  return game.data.categories.find((c) => c.id === categoryId)?.label ?? categoryId;
}
