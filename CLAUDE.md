# Zlatník Martin Ševr — pravidla projektu

Prezentační web jednomužné zlatnické dílny (Martin Ševr, IČO 87639114, Pod Kesnerkou 46, Praha 5) —
https://www.zlatnik-martin.cz. Bez e-shopu: konverze = telefon, WhatsApp a formulář (`public/send.php` →
zlatnikmartin@email.cz). Fotky Betty. Staging `vilim.sbs`. Varianta na Webflow je opuštěná, platí tohle Astro.

## Příkazy

- pnpm: `pnpm dev` · `pnpm build` → `dist/` · `pnpm typecheck` · `pnpm images` (Sharp z `images-selekce/`
  → WebP 1x / @2x / -mobile / -mobile@2x) · OG obrázky `node scripts/generate-og.mjs`.
- `python3 scripts/diff-dist.py` porovná HTML dvou buildů — na diff proti minulému nasazení.

## Nasazení (Hostinger, LiteSpeed)

- **Pořadí vždy commit → build → upload.** `src/lib/sitemap.ts` bere `<lastmod>` z posledního commitu
  stránky; build z necommitnutého stromu hlásí Googlu staré datum (7/2026: 64 z 68 URL tři týdny staré).
- Upload přes hPanel → File Manager: ZIP jen změněných souborů, Extract do `public_html` s přepsáním
  (slučuje, nic nemaže). **Nahraný ZIP pak smazat** — v `public_html` je veřejně stažitelný; v mazacím
  dialogu je „Skip trash bin" předem zaškrtnuté, odškrtnout. Přihlášení do hPanelu dělá Daniel.
- `.htaccess` je skrytý a nese redirecty, CSP, cache i staging guard — při uploadu nesmí vypadnout.
  LiteSpeed ignoruje `Header … env=` (noindex jednou šel i na produkci) — host-based logika jen přes mod_rewrite.
- Hostinger CDN (hcdn) je vypnutý, degradoval HTTP/3 — ověřit po každé migraci.
- Stav se ověřuje curlem proti ostré doméně, ne proti gitu ani File Manageru.
- Poptávky se logují mimo web do `/files/form-log/RRRR-MM.ndjson` (0700, 90 dní) — důkaz, když zákazník
  tvrdí, že psal, a Martinovi nic nepřišlo.

## Web a obsah

- CZ na kořeni, EN zrcadlo pod `/en/`. Páry stránek v `PATH_MAP` (`src/i18n/index.ts`), šperků a realizací
  přes `slugEn` v datech (`src/lib/slug-maps.ts`), stránky jsou sdílené šablony v `src/page-templates/`.
  **Nová stránka musí vzniknout na obou stranách**, jinak se rozejde přepínač a hreflang.
- `www` je kanonické (apex 301 → www), `trailingSlash: 'always'`. Sitemapy jsou vlastní endpointy
  (`sitemap.xml` vše s hreflang, `sitemap-en.xml` jen EN kvůli GSC), ne `@astrojs/sitemap`.
- Legacy 301 v `public/.htaccess`: `/retizky` → `/retezy/`, `/puncovni-znacky` → `/o-dilne/` (rankovaly).
- `inlineStylesheets: 'always'` nechat — 56 KB CSS by jinak blokovalo vykreslení na každém prvním vstupu.
- Hlas: první osoba jednotného čísla (já, vyrobím), nikdy „my" ani „náš tým". Klidná jistota, žádné
  vykřičníky, žádné em-pomlčky „—" v copy (en-pomlčka v rozsazích je OK).

## Zamčená vizuální rozhodnutí

- Vše světlé a teplé: žádné tmavé sekce ani tmavý hero, patička světlá; poměr ~70 % pozadí, 5 % zlatý
  akcent. Hodnoty tokenů v `src/styles/global.css`.
- `gold-primary` nikdy jako text na světlém — zlatý text jen `gold-deep` / `gold-on-light`. `text-muted`
  jen na labely 10–13 px s `letter-spacing ≥ 0.1em` a medium/uppercase, nikdy na `bg-tertiary`;
  odstavce `text-secondary`. Focus ring `gold-deep` (4,9:1).
- Nadpisy Playfair Display 400, kurzíva `em` ve `gold-deep`; text General Sans 400/500; obojí self-host WOFF2.
- Tlačítka jsou pilulky (`rounded-full`) napříč navigací, tlačítky i kontaktními kartami; ostré rohy jen
  u polí formuláře a fotorámů. Varianty v `Button.astro`: `primary` tmavé, `secondary` bílá plocha s rámem,
  `text`. Projektové rozhodnutí má přednost před house preferencí proti pilulkám.
- Hero 4:3 napříč viewporty, žádný portrétní ořez; `max-width` na wrapperu místo `aspect-ratio`.
- Žádné AI vzory: box-callouty, kurzívní h3 v kartách, dekorativní zlatá čísla.
- GSAP se načítá líně přes `requestIdleCallback`, reduced motion přes `matchMedia`.

## Co nedělat (rozhodnuto 7. 9. 2026, `_audit/analyza-2026-09-07.md`)

- **`AggregateRating` a hvězdy v JSON-LD** — u LocalBusiness self-serving; nápad už jednou prošel
  (`06c434f`). Sociální důkaz textem a Google profilem. Vymyšlená reference byla odstraněna, žádné smyšlené recenze.
- **Pevná otevírací doba** — záměrně „po telefonické dohodě" (Martin 20. 8. 2026, lidé chodili, když nebyl
  v dílně). Nevracet do webu ani do `openingHoursSpecification`.
- **Automatický potvrzovací e-mail zákazníkovi** ze `send.php` — rate limit jen per IP / 30 s a Origin check
  jde obejít; vznikl by nástroj na backscatter a trpěla by doručitelnost poptávek.
- **Advanced consent mode** — nedosáhne na práh modelování. GA4 měří souhlas, ne návštěvnost; trend ověřuj v GSC.
  Vlastní event se stejným názvem jako Vylepšené měření = dvojité konverze.
- **Sticky spodní lišta s telefonem** — koliduje s cookie lištou (`fixed bottom-0 z-[100]`).
- **Slučovat detaily `/sperky/*` do karet** — rankují (pozice 5–9) a LLM z nich citují.
- **Cílit celostátní dotazy** („výroba šperků", pozice 18–48) — šanci mají lokální varianty s „praha".

Analýzy do `_audit/` s datem v názvu, změny do `_audit/changelog.md`, exporty z GSC do `_seo/`.
