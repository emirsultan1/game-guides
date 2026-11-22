# RespawnReady

**[respawnready.com](https://respawnready.com)** — a gaming guide website with detailed, first-hand guides for ROB RUN, GTA and more — written by players with hundreds of hours in each game.

Built with [Astro](https://astro.build) as a fast static site: every page is plain HTML, which keeps it quick to load and easy for Google to read.

> The site name, tagline and contact email live in `src/site.config.ts`. The domain lives in `astro.config.mjs`.

---

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Adding a game](#adding-a-game)
- [Adding a guide](#adding-a-guide)
- [Writing guides that rank](#writing-guides-that-rank)
- [SEO features](#seo-features)
- [Deploying to Cloudflare Pages](#deploying-to-cloudflare-pages)
- [Email, analytics and Search Console](#email-analytics-and-search-console)
- [Launch checklist](#launch-checklist)
- [Git workflow](#git-workflow)

---

## Tech stack

| Part        | Tool                                                                     |
| ----------- | ------------------------------------------------------------------------ |
| Framework   | Astro 7 (static output)                                                  |
| Language    | TypeScript (strict)                                                      |
| Content     | Markdown guides + JSON game files, validated with Astro content collections |
| Styling     | Plain CSS with design tokens (CSS variables) in `src/styles/global.css`  |
| Hosting     | Cloudflare Pages (free)                                                  |

## Getting started

Requirements: **Node.js 22.23.4 or newer** (Node 24 LTS recommended — see `.nvmrc`).

```bash
npm install
npm run dev
```

Open http://localhost:4321. Draft guides are visible in dev, marked with a yellow **Draft** tag.

## Scripts

| Command           | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Start the local dev server (drafts visible)           |
| `npm run check`   | Type-check the project                                |
| `npm run build`   | Type-check, then build the live site into `dist/`     |
| `npm run preview` | Preview the production build (drafts hidden)          |

## Project structure

```text
src/
├── components/          Reusable UI pieces
│   ├── Breadcrumbs.astro
│   ├── Footer.astro
│   ├── GameCard.astro        Game tile on the homepage
│   ├── GuideCard.astro       Featured / related guide tile
│   ├── GuideList.astro       List of guides with game, category and date
│   ├── Header.astro
│   ├── JsonLd.astro          Structured data for Google
│   ├── SeoHead.astro         Title, description, canonical and link-preview tags
│   ├── StatusBadge.astro     Live / Coming soon / Archived pill
│   └── TableOfContents.astro "On this page" list
├── content/
│   ├── games/               One JSON file per game
│   └── guides/              One folder per game, one Markdown file per guide
│       ├── _TEMPLATE.md      Copy this to start a new guide (ignored by the site)
│       └── rob-run/
├── content.config.ts    The rules every game and guide file must follow
├── layouts/
│   └── BaseLayout.astro     Page shell: head, header, main, footer
├── pages/
│   ├── index.astro          Homepage
│   ├── [game]/index.astro   Game hub (/rob-run)
│   ├── [game]/[...slug].astro  Guide page (/rob-run/<guide>)
│   ├── 404.astro
│   ├── robots.txt.ts
│   └── sitemap.xml.ts
├── styles/global.css    Theme, reset and layout helpers
├── utils/
│   ├── content.ts           Reading games and guides (sorting, drafts, URLs)
│   ├── date.ts              Date formatting
│   ├── schema.ts            Structured data builders
│   └── url.ts               Clean URL helper
└── site.config.ts       Site name, tagline, description, nav links, Search Console code
```

## Adding a game

1. Create `src/content/games/<game-id>.json`. The file name becomes the URL: `gta-6.json` → `/gta-6`.
2. Fill it in:

```json
{
  "name": "GTA 6",
  "tagline": "One line shown on the game card (max 120 characters).",
  "description": "One or two sentences for the hub page and Google (max 200 characters).",
  "status": "live",
  "platforms": ["PS5", "Xbox Series X|S"],
  "categories": [
    { "id": "beginner", "label": "Beginner" },
    { "id": "money", "label": "Money" }
  ],
  "cover": "/images/games/gta-6.jpg",
  "order": 2
}
```

| Field        | Required | Notes                                                                 |
| ------------ | -------- | --------------------------------------------------------------------- |
| `name`       | yes      | Display name                                                          |
| `tagline`    | yes      | Shown on the homepage card                                            |
| `description`| yes      | Shown on the hub page and used as its meta description               |
| `status`     | yes      | `live`, `coming-soon` or `archived` (archived games leave the homepage) |
| `platforms`  | no       | Shown on the hub page                                                 |
| `categories` | yes      | Topics guides can be filed under. `id`: lowercase letters, numbers, dashes |
| `cover`      | no       | Image path inside `public/`. Without it, a placeholder with the name shows |
| `teaser`     | no       | `true` shows a "Guides coming soon" card on the homepage while it has no guides |
| `order`      | no       | Lower numbers show first on the homepage (default 100)                |

3. Create the folder `src/content/guides/<game-id>/` for its guides.

The homepage card and the hub page appear automatically.

## Adding a guide

1. Copy `src/content/guides/_TEMPLATE.md` into the game's folder.
2. Rename it to the URL you want: `how-to-launder-money.md` → `/rob-run/how-to-launder-money`.
3. Fill in the frontmatter (the part between the `---` lines):

| Field         | Required | Notes                                                                       |
| ------------- | -------- | --------------------------------------------------------------------------- |
| `title`       | yes      | The exact question people search for. Becomes the H1 (max 110 characters)  |
| `description` | yes      | Shown in Google results. Aim for 120–160 characters (max 170)               |
| `category`    | yes      | Must match a category `id` in the game's JSON file                          |
| `quickAnswer` | no       | 1–2 sentence answer shown in a box at the top                               |
| `publishedAt` | yes      | `2026-11-19`                                                                |
| `updatedAt`   | no       | Set it every time you update the guide — shown on the page and in the sitemap |
| `gameVersion` | no       | The patch you last checked the guide on, e.g. `'0.9.2'`                     |
| `author`      | no       | Defaults to `Emir`                                                          |
| `featured`    | no       | `true` shows it in the hub's "Start here" section (max 3 shown)             |
| `tags`        | no       | e.g. `['money', 'solo']`                                                    |
| `draft`       | no       | `true` = visible in dev only. Set to `false` to publish                     |

4. Write the guide in Markdown below the frontmatter.
5. Run `npm run dev` to preview it, then set `draft: false` and commit.

The build fails with a clear message if a field is missing, a date is wrong, or the category doesn't exist for that game — so mistakes never reach the live site.

### Markdown cheat sheet

```md
## Main section            → shows in "On this page"
### Sub-section            → shows indented in "On this page"

1. Numbered step
- Bullet point
**bold**   *italic*   [link text](/rob-run/other-guide)

> **Watch out:** quote blocks become yellow tip / warning boxes.

| Column | Column |
| ------ | ------ |
| Cell   | Cell   |

![What the screenshot shows](@/assets/guides/rob-run/heist-store.png "Caption under the image")

[SCREENSHOT: what still needs a screenshot here]
```

### Images

**Screenshots inside a guide** go in `src/assets/guides/<game-id>/`. Astro converts them to WebP, makes
smaller copies for phones and sets their size so the page doesn't jump while loading. Drop in a PNG or JPG
straight from the game; no need to resize it first.

```md
<!-- One image on its own line = a full-width screenshot. The text in quotes is the caption. -->
![The heist store menu](@/assets/guides/rob-run/heist-store.png "The heist store at the pawn shop")

<!-- Two or three images on lines right after each other = side by side. -->
![Before](@/assets/guides/rob-run/panel-on.png "Panel on")
![After](@/assets/guides/rob-run/panel-off.png "Panel off")
```

- The text in `[ ]` is the **alt text**: describe what's in the picture. Google reads it.
- The text in quotes is the **caption** shown under the image. It's optional.
- Readers can click any screenshot to see it full size.
- Name files in lowercase with dashes: `heist-store.png`, not `Screenshot 2026-11-22 at 15.04.png`.

**Screenshot notes.** A line like `[SCREENSHOT: the bank vault door]` marks a spot that still needs a picture.
It shows as a dashed box in `npm run dev` and is removed on the live site, so a guide can go live first.
See [SCREENSHOTS.md](SCREENSHOTS.md) for the full list.

**Other images** go in `public/`, because they need a fixed URL for link previews:

| Image                | Where it goes                         | Size             | Used for                               |
| -------------------- | ------------------------------------- | ---------------- | -------------------------------------- |
| Game cover           | `public/images/games/<game-id>.webp`  | 1280×680         | Game cards, hub page, link previews    |
| Guide main image     | `public/images/<game-id>/<name>.webp` | 16:9, ~1280×720  | Top of the guide and its link preview  |
| Default link preview | `public/og-default.png`               | 1200×630         | Pages with no image of their own       |

- Set a game cover with `"cover": "/images/games/rob-run.webp"` in the game's JSON file.
- Set a guide's main image with `image` and `imageAlt` in its frontmatter.
- Link previews pick the guide image, then the game cover, then the default.
- **Use your own screenshots.** Official art and other sites' images belong to their owners.

**"Coming soon" games.** Add `"teaser": true` to a game's JSON file to show it on the homepage as a
"Guides coming soon" card before it has any guides (see GTA 6). It becomes a normal card with its own page
as soon as its first guide is published.

## Writing guides that rank

- **One question per guide.** "How to launder money in ROB RUN" gets its own page.
- **Use the exact search phrase** in the title, the file name (URL) and the first sentence.
- **Answer first.** Fill in `quickAnswer`, then go into detail.
- **Be first-hand.** Exact numbers, your own screenshots, routes and mistakes beat generic guides.
- **Keep it fresh.** After each patch, check your guides, update them and set `updatedAt`.
- **Link between guides.** Link to related guides inside the text, not only at the bottom.
- **Be fast on new content.** Publish within a day of a patch or new feature.

## SEO features

Built in, no setup needed:

- Clean URLs (`/rob-run/how-to-make-money`, no `.html` or trailing slash)
- Title, meta description and canonical URL on every page
- Open Graph and Twitter tags for link previews (Discord, WhatsApp, X)
- `/sitemap.xml` with last-modified dates (drafts excluded)
- `/robots.txt` pointing to the sitemap
- Structured data: `WebSite`, `CollectionPage`, `Article` and `BreadcrumbList`
- A 404 page marked `noindex`
- Fast static pages with no JavaScript needed to read a guide

## Deploying to Cloudflare Pages

1. Push the repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, and pick this repo.
3. Build settings:

| Setting                | Value           |
| ---------------------- | --------------- |
| Framework preset       | Astro           |
| Build command          | `npm run build` |
| Build output directory | `dist`          |
| Production branch      | `main`          |

4. If the build uses an old Node version, add an environment variable `NODE_VERSION` = `24`.
5. Deploy. Every merge into `main` redeploys the site automatically, and every PR gets its own preview link.
6. Under the project's **Custom domains** tab, add `respawnready.com`, then add `www.respawnready.com` too.
   Because the domain is on Cloudflare, the DNS records are created for you and HTTPS works within a few minutes.
7. To send `www` visitors to the main domain, go to **respawnready.com → Rules → Redirect Rules** and use the
   **Redirect from WWW to root** template.

## Email, analytics and Search Console

**Contact email.** The site shows `contact@respawnready.com`. It isn't a real inbox: Cloudflare forwards it to a private Gmail.

1. Cloudflare dashboard → **respawnready.com → Email → Email Routing** → **Get started**.
2. Add the destination address (your Gmail) and click the confirmation link Cloudflare emails you.
3. Create a custom address `contact` → send to that Gmail. Cloudflare adds the needed DNS records for you.
4. Test it by emailing `contact@respawnready.com` from another account.

**Analytics.** Cloudflare Web Analytics is free and cookieless, so no cookie banner is needed for it.
In the Pages project → **Metrics** → **Web Analytics** → **Enable**. Cloudflare adds the script automatically on the
next deploy. The Privacy Policy already mentions it.

**Google Search Console.**

1. Go to [search.google.com/search-console](https://search.google.com/search-console) → **Add property** → **Domain** → `respawnready.com`.
2. Google gives you a TXT record. Add it in Cloudflare → **DNS → Records**, then click **Verify**.
3. Open **Sitemaps** and submit `https://respawnready.com/sitemap.xml`.
4. (Optional) If you'd rather use the HTML-tag method, paste the code into `googleSiteVerification` in `src/site.config.ts` and redeploy.

## Launch checklist

**Done**

- [x] Brand name (RespawnReady) and tagline in `src/site.config.ts`
- [x] Domain `respawnready.com` bought on Cloudflare and set in `astro.config.mjs`
- [x] Link-preview image (`public/og-default.png`) and favicon
- [x] Contact email set (`contact@respawnready.com`)
- [x] Privacy Policy covers hosting, analytics and ads

**To do**

- [ ] Set up Email Routing so `contact@respawnready.com` reaches your inbox
- [ ] Review every ROB RUN guide, fix anything marked `CHECK` and set `draft: false`
- [ ] Pick the 3 `featured` guides that show under "Start here"
- [ ] Take the screenshots in [SCREENSHOTS.md](SCREENSHOTS.md) and add them to the guides
- [ ] Deploy to Cloudflare Pages and add `respawnready.com` (and `www.respawnready.com`) under **Custom domains**
- [ ] Enable Web Analytics on the Pages project
- [ ] Verify the domain in Google Search Console and submit the sitemap
- [ ] Check a link preview by pasting a guide link into Discord or WhatsApp

**After launch**

- [ ] Publish new guides regularly — consistency matters more than volume
- [ ] Watch Search Console for which searches bring visitors, and write more guides around them
- [ ] Apply for Google AdSense once there's steady traffic and 20+ published guides

## Look and feel

The site looks like a printed strategy guide: paper background, black ink, and a yellow highlighter for answers.

- **Colors** live at the top of `src/styles/global.css`. `--color-highlight` is the yellow used for short answers,
  link underlines and hover states. Use it only for those, so it keeps meaning "this is the important bit".
- **Fonts:** Barlow Condensed (headings and the site name) and Barlow (body), installed from npm through
  `@fontsource` and bundled with the site, so there's no request to Google Fonts.
- **Logo:** the header shows the name as text. `public/favicon.svg` is only the browser-tab icon.
- **Keep it simple:** no badges, pills or all-caps labels. Each guide appears once on its game's page.

## Git workflow

- `main` always holds working, deployable code.
- Every change goes on its own branch, then into `main` through a pull request.
- Branch names: `feat/...` for features, `fix/...` for bug fixes, `content/...` for new or updated guides, `docs/...` for documentation.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org): `feat: ...`, `fix: ...`, `content: ...`, `docs: ...`, `chore: ...`.
- Run `npm run build` before opening a PR — it must pass with 0 errors.
