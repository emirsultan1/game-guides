// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Replace with the real domain once the site has a name.
  // Used for canonical URLs and the sitemap.
  site: 'https://example.com',

  // Guide URLs look like /rob-run/how-to-make-money (no trailing slash).
  trailingSlash: 'never',

  build: {
    // Outputs /rob-run/how-to-make-money.html instead of a folder per page,
    // which matches trailingSlash: 'never' on static hosts like Cloudflare Pages.
    format: 'file',
  },
});
