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
