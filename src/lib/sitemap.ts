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
  images?: { loc: string }[];
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
  // <priority>/<changefreq> záměrně neuvádíme — Google je dle vlastní dokumentace
  // ignoruje („Google ignores <priority> and <changefreq> values").
  const topLevelPairs: Array<[csPath: string, enPath: string]> = [
    ['/',                          '/en/'],
    ['/zakazkova-tvorba/',         '/en/custom-jewelry/'],
    ['/snubni-prsteny-na-miru/',   '/en/wedding-rings/'],
    ['/retezy/',                   '/en/chains/'],
    ['/skladem/',                  '/en/in-stock/'],
    ['/portfolio/',                '/en/portfolio/'],
    ['/o-dilne/',                  '/en/about/'],
    ['/kontakt/',                  '/en/contact/'],
    ['/ochrana-osobnich-udaju/',   '/en/privacy/'],
  ];

  // Galerijní/showcase obrázky, které žijí jen jako <img> v mřížce (nemají vlastní
  // URL). Připoj je k listing stránce, ať je najde Google Images. DRŽET V SYNC
  // s galleryItems ve WeddingRingsPage.astro a PortfolioPage.astro (base názvy).
  const listingGalleryImages: Record<string, string[]> = {
    '/snubni-prsteny-na-miru/': [
      'zasnubni-zlute', 'zasnubni-bile-pave', 'srdcovy-safir', 'par-kovany', 'par-dvoubarevny',
      'vlnka', 'listek', 'soliter-korunka', 'soliter-tenka',
    ].map((b) => `/images/snubni--ukazka-${b}.webp`)
      .concat(['01--klasicky', '02--spletany', '03--pave-diamanty', '04--origami'].map((b) => `/images/snubni--styly-${b}.webp`)),
    '/portfolio/': ['zalud', 'ryby', 'tycka'].map((b) => `/images/portfolio--ukazka-${b}.webp`),
  };

  const staticEntries: SitemapEntry[] = topLevelPairs.flatMap(([csPath, enPath]) => {
    const alternates = altPair(csPath, enPath);
    const gallery = listingGalleryImages[csPath];
    const images = gallery ? gallery.map((loc) => ({ loc: abs(loc) })) : undefined;
    return [
      { loc: abs(csPath), lastmod: BUILD_DATE, alternates, ...(images ? { images } : {}) },
      { loc: abs(enPath), lastmod: BUILD_DATE, alternates, ...(images ? { images } : {}) },
    ];
  });

  // --- CS-only landing pages (žádné EN ekvivalenty) ---
  const csOnlyPages: string[] = ['/opravy-sperku-praha/'];
  const csOnlyEntries: SitemapEntry[] = csOnlyPages.map((path) => ({
    loc: abs(path), lastmod: BUILD_DATE,
  }));

  // <image:caption> je deprecated — podporovaný zůstal jen <image:loc>.
  // Pošli VŠECHNY fotky URL (hlavní + detailní / galerie), ne jen jednu —
  // víc obrázků v image-sitemapě = víc příležitostí v Google Images / Discover.
  const uniqueImages = (paths: string[]): { loc: string }[] =>
    [...new Set(paths.filter(Boolean))].map((p) => ({ loc: abs(p) }));

  // --- Product detail pages (CS + EN) ---
  const productEntries: SitemapEntry[] = products.flatMap((p) => {
    const csPath = `/sperky/${p.slug}/`;
    const enPath = `/en/jewelry/${p.slugEn || p.slug}/`;
    const alternates = p.slugEn ? altPair(csPath, enPath) : undefined;
    const images = uniqueImages([p.image, ...(p.detailImages?.map((d) => d.src) ?? [])]);
    const entries: SitemapEntry[] = [
      { loc: abs(csPath), lastmod: BUILD_DATE, images, alternates },
    ];
    if (p.slugEn) {
      entries.push({ loc: abs(enPath), lastmod: BUILD_DATE, images, alternates });
    }
    return entries;
  });

  // --- Portfolio detail pages (CS + EN) ---
  const portfolioEntries: SitemapEntry[] = portfolioCases.flatMap((c) => {
    const csPath = `/tvorba/${c.slug}/`;
    const enPath = `/en/work/${c.slugEn || c.slug}/`;
    const alternates = c.slugEn ? altPair(csPath, enPath) : undefined;
    const images = uniqueImages([c.heroImage || c.cardImage, ...(c.gallery?.map((g) => g.src) ?? [])]);
    const entries: SitemapEntry[] = [
      { loc: abs(csPath), lastmod: BUILD_DATE, images, alternates },
    ];
    if (c.slugEn) {
      entries.push({ loc: abs(enPath), lastmod: BUILD_DATE, images, alternates });
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
    <lastmod>${e.lastmod}</lastmod>${e.alternates ? '\n' + e.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escapeXml(a.href)}" />`).join('\n') : ''}${e.images ? '\n' + e.images.map((img) => `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
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
