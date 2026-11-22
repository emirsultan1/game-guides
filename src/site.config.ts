// Site-wide settings. Change the name, email or tagline here and it updates everywhere.
export const SITE = {
  name: 'RespawnReady',
  tagline: 'Game guides from real players.',
  description:
    'In-depth game guides, tips and walkthroughs for ROB RUN, GTA 6 and more — clear, fact-checked and kept up to date.',
  locale: 'en',
  ogLocale: 'en_US',
  // Default image for social link previews (1200x630, in /public).
  // Used when a page has no image of its own. Regenerate it when the site name changes.
  defaultOgImage: '/og-default.png' as string | null,
  // Google Search Console "HTML tag" verification code (only the content="..." value).
  // Leave as null until you set up Search Console for the real domain.
  googleSiteVerification: null as string | null,
  // Public contact email shown on the Contact and Privacy pages.
  // Forwarded to a private inbox with Cloudflare Email Routing. Set to null to hide it.
  contactEmail: 'contact@respawnready.com' as string | null,
  // Shown on the Privacy Policy. Update it whenever you change that page.
  privacyUpdated: '2026-11-22',
} as const;

// Links shown in the header and footer navigation.
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Games', href: '/#games' },
] as const;

// Links shown in the footer only.
export const FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
] as const;
