// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Sitemap je řešen vlastním endpointem src/pages/sitemap.xml.ts
// (jeden soubor místo sitemap-index pattern, s lastmod + image: tagy + hreflang alternates).

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://www.zlatnik-martin.cz',
  // Dev server respektuje $PORT env (kvůli preview tool autoPort). Default 4321.
  server: {
    port: Number(process.env.PORT) || 4321,
  },
  // i18n: čeština default (bez prefixu), angličtina pod /en/
  i18n: {
    defaultLocale: 'cs',
    locales: ['cs', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
