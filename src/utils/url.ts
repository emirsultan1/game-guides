// With build.format 'file', Astro.url.pathname can end in ".html" or "/index.html"
// during the build. This turns it into the clean public URL path:
//   "/index.html"           -> "/"
//   "/rob-run/money.html"   -> "/rob-run/money"
//   "/rob-run/"             -> "/rob-run"
export function cleanPath(pathname: string): string {
  let path = pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path || '/';
}
