/**
 * i18n infrastructure.
 *
 * Architecture:
 * - CS is default (no URL prefix): /, /skladem/, /sperky/[slug]/
 * - EN under /en/ prefix: /en/, /en/in-stock/, /en/jewelry/[slug]/
 * - Slugs are translated for SEO (e.g. /sperky/prsten-cihlicka → /en/jewelry/brick-ring)
 */

import { cs } from './cs';
import { en } from './en';

export type Locale = 'cs' | 'en';
export const LOCALES: Locale[] = ['cs', 'en'];
export const DEFAULT_LOCALE: Locale = 'cs';

const translations = { cs, en } as const;

/** Vrací funkci `t(key)` pro daný jazyk. */
export function useTranslations(locale: Locale) {
  const dict = translations[locale];
  return function t(key: keyof typeof cs): string {
    return (dict as Record<string, string>)[key] ?? (cs as Record<string, string>)[key] ?? key;
  };
}

/** Z URL pathname zjistí aktuální locale. */
export function getLocaleFromUrl(url: URL | { pathname: string }): Locale {
  if (url.pathname.startsWith('/en/') || url.pathname === '/en') return 'en';
  return 'cs';
}

/** Mapping mezi top-level routes — používá se v Nav, Footer, hreflang. */
export const PATH_MAP: Record<string, { cs: string; en: string }> = {
  home: { cs: '/', en: '/en/' },
  customJewelry: { cs: '/zakazkova-tvorba/', en: '/en/custom-jewelry/' },
  weddingRings: { cs: '/snubni-prsteny-na-miru/', en: '/en/wedding-rings/' },
  inStock: { cs: '/skladem/', en: '/en/in-stock/' },
  portfolio: { cs: '/portfolio/', en: '/en/portfolio/' },
  about: { cs: '/o-dilne/', en: '/en/about/' },
  contact: { cs: '/kontakt/', en: '/en/contact/' },
  privacy: { cs: '/ochrana-osobnich-udaju/', en: '/en/privacy/' },
};

/** Vrací URL pro top-level routu v daném jazyce. */
export function localizedPath(key: keyof typeof PATH_MAP, locale: Locale): string {
  return PATH_MAP[key][locale];
}

/**
 * Striktní varianta: vrací ekvivalent ve druhém jazyce, nebo null pokud
 * neexistuje. Pro hreflang — CS-only stránka (opravy) NESMÍ deklarovat
 * alternate na homepage, to Google mate (mismatched hreflang).
 */
export function getAlternatePathStrict(
  currentPath: string,
  currentLocale: Locale,
  productSlugMap?: Map<string, string>,
  portfolioSlugMap?: Map<string, string>,
): string | null {
  const alt = getAlternateUrl(currentPath, currentLocale, productSlugMap, portfolioSlugMap);
  const fallbackHome = currentLocale === 'cs' ? '/en/' : '/';
  const isHome = Object.values(PATH_MAP)[0];
  // getAlternateUrl vrací homepage jako fallback — skutečná homepage je legitimní
  // jen když na ní opravdu jsme.
  if (alt === fallbackHome && currentPath !== isHome[currentLocale]) return null;
  return alt;
}

/**
 * Pro danou URL najde ekvivalent ve druhém jazyce.
 * Pokud ekvivalent neexistuje, vrací homepage druhého jazyka (graceful fallback).
 */
export function getAlternateUrl(
  currentPath: string,
  currentLocale: Locale,
  productSlugMap?: Map<string, string>,
  portfolioSlugMap?: Map<string, string>,
): string {
  const otherLocale: Locale = currentLocale === 'cs' ? 'en' : 'cs';
  const normalized = currentPath.endsWith('/') ? currentPath : currentPath + '/';

  // Top-level routes přes PATH_MAP
  for (const route of Object.values(PATH_MAP)) {
    if (normalized === route[currentLocale]) {
      return route[otherLocale];
    }
  }

  // Detail produktu
  if (productSlugMap) {
    const productMatch = normalized.match(/^\/(?:en\/jewelry|sperky)\/([^/]+)\/$/);
    if (productMatch) {
      const slug = productMatch[1];
      const altSlug = productSlugMap.get(slug);
      if (altSlug) {
        return otherLocale === 'en'
          ? `/en/jewelry/${altSlug}/`
          : `/sperky/${altSlug}/`;
      }
    }
  }

  // Detail portfolia
  if (portfolioSlugMap) {
    const caseMatch = normalized.match(/^\/(?:en\/work|tvorba)\/([^/]+)\/$/);
    if (caseMatch) {
      const slug = caseMatch[1];
      const altSlug = portfolioSlugMap.get(slug);
      if (altSlug) {
        return otherLocale === 'en'
          ? `/en/work/${altSlug}/`
          : `/tvorba/${altSlug}/`;
      }
    }
  }

  // Fallback: homepage druhého jazyka
  return otherLocale === 'en' ? '/en/' : '/';
}
