import { products } from '../data/products';
import { portfolioCases } from '../data/portfolio';

/**
 * Obousměrné slug↔slug mapy (cs↔en) pro produkty a portfolio.
 * SEO-kritické pro hreflang alternates — jeden zdroj pravdy pro Layout i LangSwitcher.
 */
export function buildSlugMaps() {
  const productSlugMap = new Map<string, string>();
  for (const p of products) {
    if (p.slugEn) {
      productSlugMap.set(p.slug, p.slugEn);
      productSlugMap.set(p.slugEn, p.slug);
    }
  }
  const portfolioSlugMap = new Map<string, string>();
  for (const c of portfolioCases) {
    if (c.slugEn) {
      portfolioSlugMap.set(c.slug, c.slugEn);
      portfolioSlugMap.set(c.slugEn, c.slug);
    }
  }
  return { productSlugMap, portfolioSlugMap };
}
