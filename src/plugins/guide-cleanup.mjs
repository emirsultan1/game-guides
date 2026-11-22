// @ts-check
/**
 * Markdown plugin (Sätteri hast plugin) that removes HTML comments from guides.
 *
 * Guides can contain notes for the author, like <!-- CHECK: confirm this in a video -->.
 * They're useful in the Markdown files, but should never end up in the page source
 * that visitors and Google can read. This plugin strips them during the build.
 */

const HTML_COMMENT = /<!--[\s\S]*?-->/g;

export function guideCleanup() {
  return {
    name: 'guide-cleanup',

    comment(/** @type {any} */ node, /** @type {any} */ ctx) {
      ctx.removeNode(node);
    },

    raw(/** @type {any} */ node, /** @type {any} */ ctx) {
      const cleaned = String(node.value ?? '').replace(HTML_COMMENT, '');
      if (cleaned === node.value) return;
      if (!cleaned.trim()) {
        ctx.removeNode(node);
        return;
      }
      ctx.replaceNode(node, { ...node, value: cleaned });
    },
  };
}
