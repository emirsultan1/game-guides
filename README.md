# Game Guides

A gaming guide website with detailed guides for ROB RUN, GTA and more. Built with [Astro](https://astro.build) as a fast static site.

> The site name is a placeholder. Change it in `src/site.config.ts` once the brand is chosen.

## Requirements

- Node.js 22.23.4 or newer (Node 24 LTS recommended, see `.nvmrc`)

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:4321.

## Scripts

| Command           | What it does                                 |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the local dev server                   |
| `npm run check`   | Type-check the project                       |
| `npm run build`   | Type-check, then build the site into `dist/` |
| `npm run preview` | Preview the production build locally         |

## Workflow

- `main` holds the project setup.
- Every feature goes on its own branch (`feat/...`) and is merged through a pull request.
