// Dates are shown the same way everywhere on the site, e.g. "Nov 19, 2026".
const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return formatter.format(date);
}

/** For <time datetime="...">, e.g. "2026-11-19". */
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
