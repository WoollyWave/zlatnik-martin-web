// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
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
  // Web nemá markdown obsah — vypnutí Shiki umlčí CSP warning při buildu
  // (Shiki generuje inline styly nekompatibilní s hash-based CSP).
  markdown: {
    syntaxHighlight: false,
  },
  // Native CSP (Astro 6) — auto-hash všech inline <script>/<style> → žádný
  // 'unsafe-inline'. Emituje se jako <meta http-equiv>. frame-ancestors meta
  // neumí přenést → zůstává v .htaccess (spolu s X-Frame-Options).
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com https://*.googletagmanager.com",
        "font-src 'self'",
        "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
        'frame-src https://www.google.com https://maps.google.com',
        "base-uri 'self'",
        "form-action 'self' mailto:",
        "object-src 'none'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: {
        // gtag.js se injektuje dynamicky → potřebuje explicitní doménu (hash nestačí).
        resources: ["'self'", 'https://www.googletagmanager.com', 'https://*.googletagmanager.com'],
      },
      styleDirective: {
        resources: ["'self'"],
      },
    },
  },
  // Astro 6 Fonts API — self-hosting, automatické metric-compatible fallbacky,
  // preload přes <Font /> v Layoutu. Nahrazuje ruční @font-face + <link rel="preload">.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'General Sans',
      cssVariable: '--font-general-sans',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/GeneralSans-Regular.woff2'], weight: 400, style: 'normal' },
          { src: ['./src/assets/fonts/GeneralSans-Medium.woff2'], weight: 500, style: 'normal' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Playfair Display',
      cssVariable: '--font-playfair',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          // Variable font — range 400–900 v jednom souboru, italic jako separátní soubor.
          { src: ['./src/assets/fonts/PlayfairDisplay-Regular.woff2'], weight: '400 900', style: 'normal' },
          { src: ['./src/assets/fonts/PlayfairDisplay-Italic.woff2'], weight: '400 900', style: 'italic' },
        ],
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
