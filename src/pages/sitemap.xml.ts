/**
 * Hlavní sitemap — všechny veřejné URL (CS + EN). Logika v src/lib/sitemap.ts.
 */
import type { APIRoute } from 'astro';
import { buildSitemapEntries, renderSitemapXml } from '../lib/sitemap';

export const GET: APIRoute = () => renderSitemapXml(buildSitemapEntries());
