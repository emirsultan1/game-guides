// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { guideCleanup } from './src/plugins/guide-cleanup.mjs';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // The live domain. Used for canonical URLs, the sitemap, robots.txt and link previews.
  site: 'https://respawnready.com',

  // Guide URLs look like /rob-run/how-to-make-money (no trailing slash).
  trailingSlash: 'never',

  build: {
    // Outputs /rob-run/how-to-make-money.html instead of a folder per page,
    // which matches trailingSlash: 'never' on static hosts like Cloudflare Pages.
    format: 'file',
  },

  markdown: {
    // Removes <!-- ... --> author notes from guides so they never reach the page source.
    // See src/plugins/guide-cleanup.mjs.
    processor: satteri({ hastPlugins: [guideCleanup()] }),
  },
});
