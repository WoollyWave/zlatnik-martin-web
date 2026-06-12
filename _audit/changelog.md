# Audit changelog — refactor/audit-2026

Průběžný záznam změn. Každý krok = samostatný commit. Formát: co / kde / proč.

---

## Krok 0 — Verze a závislosti

- **Astro 6.3.1 → 6.4.6** (`package.json`) — nejnovější stabilní patch řady 6.4.x. Žádné breaking changes mezi 6.3 a 6.4 pro tento projekt (build prošel beze změn kódu).
- **npm → pnpm** — smazán `package-lock.json`, vygenerován `pnpm-lock.yaml`, přidáno pole `packageManager: pnpm@9.15.0`.
- **Pinned exact verze** — odstraněny všechny `^` rozsahy. Aktualizováno: `@tailwindcss/vite` + `tailwindcss` 4.2.2 → 4.3.0, `web-vitals` 5.2.0 → 5.3.0, `sharp` 0.34.5 → 0.35.1, `@astrojs/check` 0.9.8 → 0.9.9.
- **TypeScript ponechán na 5.9.3** — TS 6.0.3 je čerstvý major; `@astrojs/check`/Astro language server proti němu nejsou ověřené. Záměrné rozhodnutí, ne opomenutí.
- **Odstraněn `@astrojs/sitemap`** — nepoužívá se (sitemap řeší vlastní endpoint `src/pages/sitemap.xml.ts`, v configu integrace nebyla). Mrtvá závislost.
- **`pnpm.overrides`** — zamknuty tranzitivní deps: `vite 7.3.5`, `zod 4.4.3` (verze, které Astro 6.4.6 reálně resolvuje).
- **`.nvmrc`** — přidán (`22.12.0`), `engines.node >=22.12.0` už v package.json bylo.
- **Ověření:** `pnpm build` ✓ — 57 stránek bez chyb.

Tailwind v4 přes `@tailwindcss/vite` + CSS-first `@theme {}` už projekt měl (žádný `tailwind.config.js`, žádný `@astrojs/tailwind`) — migrace nebyla potřeba.

---

## Krok 1 — Syntaxe a sémantika

- **Migrace na Astro 6 Fonts API** (`astro.config.mjs`, `src/layouts/Layout.astro`, `src/styles/global.css`):
  - Fonty přesunuty `public/fonts/` → `src/assets/fonts/` (Astro je teď hashuje a self-hostuje do `_astro/fonts/`).
  - 4 ruční `@font-face` bloky v global.css smazány; 4 ruční `<link rel="preload">` v Layoutu nahrazeny `<Font cssVariable preload />`.
  - Astro generuje metric-compatible fallback fonty automaticky (méně CLS při swapu než ruční `Georgia`/`system-ui` fallback).
  - Tailwind tokeny `--font-serif`/`--font-sans` v `@theme` teď mapují na proměnné z Fonts API.
  - `.htaccess` cache pravidla fungují dál (matchují příponu `.woff2`, ne cestu).
- **Smazán `<meta name="generator">`** (Layout.astro) — prozrazoval verzi Astra (security through obscurity, ale zbytečný signál pro automatizované skenery).
- **Přidán `@types/node`** (dev) — `astro check` padal na `process.env` v astro.config.mjs. Typecheck teď 0 errors / 0 warnings.
- **Raw `<img>` → Astro `<Image>` NEPROVEDENO — záměrně.** Všechny obrázky žijí v `public/` a prochází vlastní Sharp pipeline (`scripts/process-images.mjs`: 1x/@2x + mobile varianty WebP). Astro `<Image>` optimalizuje jen importy ze `src/` — u `public/` cest by nepřinesl nic a migrace ~300 souborů by jen riskovala regrese. Všechny `<img>` mají width/height/loading/decoding/srcset. Detail v reportu.
- **Lightbox `alt=""`** (tvorba/[slug], en/work/[slug]) — prověřeno, NENÍ chyba: JS nastavuje `alt` z `data-alt` při každém renderu, prázdná hodnota je jen initial state zavřeného dialogu.
- **Ověření:** `pnpm build` ✓ 57 stránek, `pnpm typecheck` ✓ 0/0/0.

---

## Krok 2 — Bezpečnost

- **`pnpm audit`:** 1 moderate CVE — `yaml` <2.8.3 (stack overflow, GHSA-48c2-rrv3-qjmp), tranzitivní přes `@astrojs/check` (dev-only). Opraveno overridem `yaml: 2.9.0`. Po opravě: **0 zranitelností**.
- **Native Astro 6 CSP** (`astro.config.mjs` → `security.csp`):
  - Všechny inline `<script>`/`<style>` dostávají SHA-256 hash → **odstraněn `'unsafe-inline'`** ze script-src i style-src (předtím v .htaccess CSP). Reálné zpřísnění: injektovaný skript bez známého hashe se nespustí.
  - `script-src` resources: self + googletagmanager (gtag.js se injektuje dynamicky).
  - Direktivy (img/connect/frame/form-action/object/base-uri/upgrade-insecure-requests) přeneseny z .htaccess; vypuštěny `*.g.doubleclick.net` (web nemá reklamy, jen GA4 analytics).
  - **`.htaccess`**: CSP header zredukován na `frame-ancestors 'none'` — jediná direktiva, kterou `<meta>` CSP přenést neumí. Zbytek (X-Frame-Options, HSTS, Permissions-Policy…) beze změny.
  - `style="border:0"` na Maps iframe (kontakt cs+en) → třída `border-0` — poslední inline style atribut, který by striktní style-src blokoval.
  - **Ověřeno v prohlížeči proti built outputu**: 0 CSP violations, fonty/styly/GSAP/JSON-LD fungují.
- **Meta generator tag** — smazán už v kroku 1.
- **Secrets sken:** žádné FTP credentials, API klíče ani tokeny v repu (prohledáno vč. scripts/, .claude/, send.php). GA Measurement ID a GSC verification token jsou z podstaty veřejné. `send.php` prověřen: origin check, honeypot, rate-limit, header-injection guard, GDPR checkbox vyžadován — bez nálezu.
- **`.env`:** projekt žádné env proměnné nepoužívá (jen dev-time `$PORT`), `.env*` už je v .gitignore. `.env.example` záměrně nepřidán — není co exemplifikovat; přidat až s první reálnou proměnnou.
