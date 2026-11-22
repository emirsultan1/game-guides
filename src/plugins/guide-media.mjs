// @ts-check
/**
 * Markdown plugin (Sätteri hast plugin) that upgrades images in guides.
 *
 * 1. An image on its own line becomes a <figure>. The text in quotes becomes the caption:
 *      ![Heist store menu](@/assets/guides/rob-run/heist-store.png "The heist store at the pawn shop")
 *
 * 2. Two or three images on consecutive lines (no blank line between them) become a
 *    side-by-side gallery. Each keeps its own caption.
 *
 * 3. A line on its own like
 *      [SCREENSHOT: the heist store menu]
 *    marks where a screenshot still needs to go. It shows as a dashed box in `npm run dev`
 *    and is removed from the real site, so a guide can go live before every screenshot is ready.
 */

const SCREENSHOT_NOTE = /^\s*\[screenshot:\s*(.+?)\]\s*$/i;

/** @param {any} node */
const isBlank = (node) =>
  (node.type === 'text' && !node.value.trim()) || (node.type === 'element' && node.tagName === 'br');

/** @param {any} node */
const isImage = (node) => node.type === 'element' && node.tagName === 'img';

/** @param {string} value */
const text = (value) => ({ type: 'text', value });

/** @param {any} img */
function figureFor(img) {
  const { title, ...properties } = img.properties ?? {};
  const caption = typeof title === 'string' ? title.trim() : '';
  const children = [{ ...img, properties: { ...properties, loading: 'lazy', decoding: 'async' } }];
  if (caption) {
    children.push({ type: 'element', tagName: 'figcaption', properties: {}, children: [text(caption)] });
  }
  return { type: 'element', tagName: 'figure', properties: { className: ['guide-figure'] }, children };
}

/**
 * @param {{ showPlaceholders?: boolean }} [options]
 *   showPlaceholders: show [SCREENSHOT: ...] boxes. Defaults to true in dev, false in the build.
 */
export function guideMedia(options = {}) {
  // Astro sets NODE_ENV to "production" during `npm run build`.
  const nodeEnv = /** @type {any} */ (globalThis).process?.env?.NODE_ENV;
  const showPlaceholders = options.showPlaceholders ?? nodeEnv !== 'production';

  return {
    name: 'guide-media',
    element: {
      filter: ['p'],
      /** @param {any} node @param {any} ctx */
      visit(node, ctx) {
        const content = (node.children ?? []).filter((/** @type {any} */ child) => !isBlank(child));
        if (content.length === 0) return;

        // [SCREENSHOT: ...]
        if (content.length === 1 && content[0].type === 'text') {
          const match = content[0].value.match(SCREENSHOT_NOTE);
          if (!match) return;
          if (!showPlaceholders) {
            ctx.removeNode(node);
            return;
          }
          ctx.replaceNode(node, {
            type: 'element',
            tagName: 'div',
            properties: { className: ['screenshot-needed'], role: 'note' },
            children: [
              { type: 'element', tagName: 'strong', properties: {}, children: [text('Screenshot needed:')] },
              text(` ${match[1]}`),
            ],
          });
          return;
        }

        // Image-only paragraphs
        if (!content.every(isImage)) return;
        if (content.length === 1) {
          ctx.replaceNode(node, figureFor(content[0]));
          return;
        }
        ctx.replaceNode(node, {
          type: 'element',
          tagName: 'div',
          properties: { className: ['guide-gallery', `guide-gallery-${Math.min(content.length, 3)}`] },
          children: content.map(figureFor),
        });
      },
    },
  };
}
