// Content collections: the structure every game and guide must follow.
// Astro checks each file against these schemas at build time, so a missing
// title or a wrong date fails the build instead of breaking a page.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One JSON file per game in src/content/games/. The file name is the game's id
// and its URL: rob-run.json -> /rob-run
const games = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/games' }),
  schema: z.object({
    name: z.string(),
    // One line shown on game cards.
    tagline: z.string().max(120),
    // A sentence or two for the game hub page and its meta description.
    description: z.string().max(200),
    status: z.enum(['live', 'coming-soon', 'archived']),
    platforms: z.array(z.string()).default([]),
    // Topics that guides for this game can be filed under.
    categories: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and dashes'),
          label: z.string(),
        }),
      )
      .min(1),
    // Path in /public, e.g. "/images/games/rob-run.jpg". Optional until we have art.
    // Also used as the link-preview image for the game's hub page.
    cover: z.string().startsWith('/', 'Image paths start with / and point into /public').optional(),
    // Lower numbers show first on the homepage.
    order: z.number().int().default(100),
  }),
});

// One Markdown file per guide, in a folder named after its game:
// src/content/guides/rob-run/how-to-make-money.md -> /rob-run/how-to-make-money
// Files starting with "_" (like _TEMPLATE.md) are ignored.
const guides = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/guides' }),
  schema: z.object({
    // The exact question or phrase people search for. Shown as the H1.
    title: z.string().max(110),
    // Shown in Google results. Aim for 120–160 characters.
    description: z.string().max(170),
    // Must match one of the game's category ids.
    category: z.string(),
    // A 1–2 sentence answer shown at the top of the guide.
    quickAnswer: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    // The game patch the guide was last checked on, e.g. "0.9.2".
    gameVersion: z.string().optional(),
    author: z.string().default('Emir'),
    // Optional main image: shown under the title and used for link previews.
    // Path in /public, e.g. "/images/rob-run/bank-vault.jpg". Use your own screenshots.
    image: z.string().startsWith('/', 'Image paths start with / and point into /public').optional(),
    // Describes the image for screen readers and Google. Defaults to the title.
    imageAlt: z.string().optional(),
    // Featured guides show in the "Start here" section of the game hub.
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    // Drafts show in `npm run dev` but are left out of the real site.
    draft: z.boolean().default(false),
  }),
});

export const collections = { games, guides };
