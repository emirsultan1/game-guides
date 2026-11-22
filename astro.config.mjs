// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { guideMedia } from './src/plugins/guide-media.mjs';

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

  image: {
    // Screenshots get several sizes (srcset), so phones download a small file.
    layout: 'constrained',
  },

  markdown: {
    // Turns guide images into captioned figures and galleries, and handles [SCREENSHOT: ...] notes.
    // See src/plugins/guide-media.mjs.
    processor: satteri({ hastPlugins: [guideMedia()] }),
  },
});
