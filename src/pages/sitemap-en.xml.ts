/**
 * EN podmnožina sitemap — stejné záznamy jako v sitemap.xml, jen /en/ URL.
 * Účel: samostatný monitoring indexace anglické mutace v GSC (report Sitemaps
 * ukazuje pokrytí per sitemap). Duplicita URL napříč sitemapami Googlu nevadí.
 */
import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { buildSitemapEntries, renderSitemapXml } from '../lib/sitemap';

export const GET: APIRoute = () =>
  renderSitemapXml(buildSitemapEntries().filter((e) => e.loc.startsWith(`${SITE.url}/en/`)));
