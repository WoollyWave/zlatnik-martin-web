# zlatnik-martin.cz

Prezentační web zlatnické dílny **Martina Ševra** (Pod Kesnerkou 46, Praha 5).
Statický Astro build, dvojjazyčný (čeština v kořeni, angličtina pod `/en/`),
bez CMS a bez e-shopu. Nasazuje se ručně přes FTP na Hostinger.

Konvence projektu, design systém a tone of voice jsou v **[CLAUDE.md](CLAUDE.md)**.
Astro/Tailwind vzory v **[ASTRO-PATTERNS.md](ASTRO-PATTERNS.md)**.
Historie zásahů a audity v **[_audit/](_audit/)**.

## Provoz

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # → dist/
pnpm preview      # náhled produkčního buildu
pnpm typecheck    # astro check
pnpm images       # dávkové zpracování fotek z images-selekce/
```

Node ≥ 22.12, pnpm 9.15. Skript `scripts/rebg.mjs` je jednorázový nástroj na
převod krémového pozadí studiových fotek na bílé, mimo `pnpm images`.

## Deploy

```bash
pnpm build
# obsah dist/ → FTP → Hostinger public_html/
```

**Pořadí je vždy commit → build → upload.** Sitemapa bere `<lastmod>` z data
posledního commitu, který se dotkl zdrojů dané stránky (`src/lib/sitemap.ts`).
Build z necommitnutého stromu proto pošle Googlu datum staršího commitu a
změna se tváří, že se nestala.

**`.htaccess` je skrytý soubor** a FTP klienti ho běžně nezobrazují. Nese
redirecty, bezpečnostní hlavičky, cache pravidla a staging guard — bez něj
web funguje jen zdánlivě. Ve FileZille: *Server → Vynutit zobrazení skrytých
souborů*.

Po nahrání se stav ověřuje proti ostré doméně, ne proti gitu — produkce může
být napřed i pozadu.

## Prostředí

| | |
|---|---|
| Produkce | `https://www.zlatnik-martin.cz` (apex 301 → www) |
| Staging | `https://web.vilim.sbs` — servíruje zakazující `robots-staging.txt` |
| Hosting | Hostinger, LiteSpeed, HTTP/2 + HTTP/3. Hostinger CDN **vypnutá** (degradovala HTTP/3) |
| Formulář | `public/send.php` → `zlatnikmartin@email.cz`, PHP ≥ 8.1 |

## Struktura

```
src/
├── pages/            # routy; EN zrcadlí CZ pod /en/
├── page-templates/   # sdílené šablony stránek (jedna pro CZ i EN, větví přes isEn)
├── components/       # Nav, Footer, Button, ProductCard, ContactForm…
├── data/             # products.ts, portfolio.ts, site.ts (SITE = zdroj pravdy)
├── lib/              # seo.ts (JSON-LD), sitemap.ts, text.ts
├── i18n/             # cs.ts, en.ts, index.ts
├── scripts/          # animations.ts (GSAP, lazy), nav.ts, filter-pills.ts
└── styles/global.css # @import tailwindcss + @theme (design tokeny)
```

Stránky CZ i EN sdílejí jednu šablonu — **změna v `page-templates/` zasáhne obě
jazykové mutace**. Textové rozdíly se řeší přes objekt `t` s větví `isEn`.
