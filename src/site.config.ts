// Site-wide settings. Change these in one place once the site has a real name.
export const SITE = {
  name: 'Game Guides', // placeholder until the brand name is chosen
  tagline: 'Detailed guides for the games people are playing right now.',
  description:
    'In-depth game guides, tips and walkthroughs for ROB RUN, GTA and more — written by players with hundreds of hours in each game.',
  locale: 'en',
  ogLocale: 'en_US',
  // Default image for social link previews, e.g. '/og-default.png' (1200x630, in /public).
  // Leave as null until the image exists, so previews don't point to a missing file.
  defaultOgImage: null as string | null,
} as const;

// Links shown in the header and footer navigation.
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Games', href: '/#games' },
] as const;
