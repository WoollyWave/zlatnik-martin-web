/**
 * Sdílená logika sitemap — konzumují ji dva endpointy:
 * - /sitemap.xml     (všechny URL, CS + EN)
 * - /sitemap-en.xml  (jen EN podmnožina — kvůli samostatnému monitoringu
 *                     indexace anglické mutace v GSC; duplicita URL napříč
 *                     sitemapami Googlu nevadí)
 *
 * Obsahuje <lastmod>, <image:image> bloky a <xhtml:link hreflang> alternates.
 * BUILD_DATE = frozen timestamp z buildu — `new Date()` per request by Googlu
 * tvrdil „vše se změnilo dnes" při každém crawlu a snižoval crawl trust.
 */
import { SITE } from '../data/site';
import { products } from '../data/products';
import { portfolioCases } from '../data/portfolio';

const BUILD_DATE = new Date().toISOString().split('T')[0];

interface Alternate {
  hreflang: string;
  href: string;
}

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  images?: { loc: string; caption?: string }[];
  alternates?: Alternate[];
}

function abs(path: string): string {
  return `${SITE.url}${path.startsWith('/') ? path : '/' + path}`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
}

/** Vytvoří hreflang alternates pro pár URL (CS canonical + EN canonical + x-default). */
function altPair(csPath: string, enPath: string): Alternate[] {
  return [
    { hreflang: 'cs',         href: abs(csPath) },
    { hreflang: 'en',         href: abs(enPath) },
    { hreflang: 'x-default',  href: abs(csPath) },
  ];
}

export function buildSitemapEntries(): SitemapEntry[] {
  // --- Top-level CS pages with EN alternates ---
  const topLevelPairs: Array<[csPath: string, enPath: string, priority: number, changefreq: SitemapEntry['changefreq']]> = [
    ['/',                          '/en/',                       1.0, 'weekly'],
    ['/zakazkova-tvorba/',         '/en/custom-jewelry/',        0.9, 'monthly'],
    ['/snubni-prsteny-na-miru/',   '/en/wedding-rings/',         0.9, 'monthly'],
    ['/skladem/',                  '/en/in-stock/',              0.9, 'weekly'],
    ['/portfolio/',                '/en/portfolio/',             0.9, 'monthly'],
    ['/o-dilne/',                  '/en/about/',                 0.8, 'monthly'],
    ['/kontakt/',                  '/en/contact/',               0.8, 'yearly'],
    ['/ochrana-osobnich-udaju/',   '/en/privacy/',               0.3, 'yearly'],
  ];

  const staticEntries: SitemapEntry[] = topLevelPairs.flatMap(([csPath, enPath, priority, changefreq]) => {
    const alternates = altPair(csPath, enPath);
    return [
      { loc: abs(csPath), lastmod: BUILD_DATE, priority, changefreq, alternates },
      { loc: abs(enPath), lastmod: BUILD_DATE, priority, changefreq, alternates },
    ];
  });

  // --- CS-only landing pages (žádné EN ekvivalenty) ---
  const csOnlyPages: Array<[path: string, priority: number, changefreq: SitemapEntry['changefreq']]> = [
    ['/opravy-sperku-praha/',      0.85, 'monthly'],
  ];
  const csOnlyEntries: SitemapEntry[] = csOnlyPages.map(([path, priority, changefreq]) => ({
    loc: abs(path), lastmod: BUILD_DATE, priority, changefreq,
  }));

  // --- Product detail pages (CS + EN) ---
  const productEntries: SitemapEntry[] = products.flatMap((p) => {
    const csPath = `/sperky/${p.slug}/`;
    const enPath = `/en/jewelry/${p.slugEn || p.slug}/`;
    const alternates = p.slugEn ? altPair(csPath, enPath) : undefined;
    const csImage = { loc: abs(p.image), caption: p.alt };
    const enImage = { loc: abs(p.image), caption: p.altEn || p.alt };
    const entries: SitemapEntry[] = [
      { loc: abs(csPath), lastmod: BUILD_DATE, priority: 0.7, changefreq: 'monthly', images: [csImage], alternates },
    ];
    if (p.slugEn) {
      entries.push({ loc: abs(enPath), lastmod: BUILD_DATE, priority: 0.7, changefreq: 'monthly', images: [enImage], alternates });
    }
    return entries;
  });

  // --- Portfolio detail pages (CS + EN) ---
  const portfolioEntries: SitemapEntry[] = portfolioCases.flatMap((c) => {
    const csPath = `/tvorba/${c.slug}/`;
    const enPath = `/en/work/${c.slugEn || c.slug}/`;
    const alternates = c.slugEn ? altPair(csPath, enPath) : undefined;
    const hero = c.heroImage || c.cardImage;
    const csImage = { loc: abs(hero), caption: c.heroAlt || c.cardAlt };
    const enImage = { loc: abs(hero), caption: c.heroAltEn || c.cardAltEn || c.heroAlt || c.cardAlt };
    const entries: SitemapEntry[] = [
      { loc: abs(csPath), lastmod: BUILD_DATE, priority: 0.7, changefreq: 'monthly', images: [csImage], alternates },
    ];
    if (c.slugEn) {
      entries.push({ loc: abs(enPath), lastmod: BUILD_DATE, priority: 0.7, changefreq: 'monthly', images: [enImage], alternates });
    }
    return entries;
  });

  return [...staticEntries, ...csOnlyEntries, ...productEntries, ...portfolioEntries];
}

export function renderSitemapXml(entries: SitemapEntry[]): Response {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map((e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>${e.alternates ? '\n' + e.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escapeXml(a.href)}" />`).join('\n') : ''}${e.images ? '\n' + e.images.map((img) => `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>${img.caption ? `\n      <image:caption>${escapeXml(img.caption)}</image:caption>` : ''}
    </image:image>`).join('\n') : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
