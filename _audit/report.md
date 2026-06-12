# Audit report — zlatnik-martin.cz (refactor/audit-2026)

**Datum:** 12. 6. 2026 · **Větev:** `refactor/audit-2026` (10 commitů nad `portfolio-case-studies`)
**Finální stav:** `pnpm build` ✓ 57 stránek · `pnpm typecheck` ✓ 0/0/0 · `pnpm audit` ✓ 0 zranitelností
Detailní záznam všech změn po krocích: [`_audit/changelog.md`](changelog.md)

---

## 1. Co je opraveno (hotovo, commitnuto)

| Commit | Oblast | Shrnutí |
|---|---|---|
| `c1be568` | Závislosti | Astro 6.3.1→6.4.6, npm→pnpm, pinned exact verze, overrides (vite 7.3.5, zod 4.4.3), `.nvmrc`, odstraněn mrtvý `@astrojs/sitemap`. TS záměrně na 5.9.3 (6.0 je čerstvý major). |
| `0bc734b` | Fonty/syntaxe | Migrace na **Astro 6 Fonts API** (self-host, hash, metric-compatible fallbacky → méně CLS), smazán `meta generator`, typecheck 0 chyb. |
| `03f6208` | Bezpečnost | **Native Astro CSP bez `unsafe-inline`** (SHA-256 hashe), .htaccess CSP zredukován na `frame-ancestors`, oprava yaml CVE (GHSA-48c2-rrv3-qjmp), secrets sken čistý. |
| `86417c8` | Kvalita | `animations.ts`: 144řádkový init → 6 funkcí, konstanty, **fix ~60 GSAP console warningů** na každém loadu. |
| `212a8d3` | A11y | **Kritická oprava: Nav dropdown (Snubní/Opravy) byl z klávesnice i odečítačky zcela nedostupný** (tabindex=-1 + trvalé aria-hidden). Smooth scroll respektuje reduced-motion. |
| `e9e3828` | Výkon | `min-h-screen`→`min-h-dvh` (8×), **odstraněn body fade-in blokující LCP**, smazán nepoužívaný 403kB asset, layout stabilizéry. |
| `e44e67f` | Design | Gradient overlay na tokenu místo rgba literálu (vizuálně identické). |
| `72dbc33` | Consent | **GA se načítá VÝHRADNĚ po souhlasu** (dřív jela při první interakci i bez něj). Consent Mode v2 basic, banner lokalizován pro EN. Odhalena a vyřešena CSP past: `is:inline` skripty Astro nehashuje → blokovala by je. |
| `3caee85` | Média | **7 vlastních OG obrázků 1200×630** + generátor `scripts/generate-og.mjs`, napojeno na 12 stránek (CS+EN), og:image:width/height. |
| `c946544` | SEO/GEO | Product schema: smazán neplatný `productionDate`, **`sold: true` → SoldOut** přepínač. **NAP sjednocen znak po znaku** (footer měl adresu bez PSČ). |

**Ověřeno e2e v prohlížeči proti built outputu:** 13 stránek 200 + h1 + canonical + CSP, consent flow (souhlas/odmítnutí/persistence), keyboard dropdown, lightbox (alt se nastavuje), mobilní cookie lišta, 0 console errors pod striktní CSP.

**Co bylo v pořádku už před auditem** (předchozí audity odvedly práci): JSON-LD @graph architektura (JewelryStore/Person/Product/Breadcrumb/Service/FAQ), hreflang obousměrně vč. překládaných slugů, vlastní sitemap s image+alternates, robots.txt s explicitním povolením GPTBot/ClaudeBot/PerplexityBot a dalších, llms.txt, send.php (origin check, honeypot, rate-limit, header-injection guard), focus trap mobilního menu, kontrastní paleta, touch targets.

---

## 2. Čeká na tvoje schválení

### 🔴 Důležité

**R1 — `formular@zlatnik-martin.cz` musí existovat na Hostingeru. ✅ VYŘEŠENO (ověřeno 12. 6. 2026)**
Ověřeno proti ostrému provozu: schránka existuje (SMTP RCPT `250 Ok`, přičemž neexistující adresa na stejné doméně vrací `550` — server není accept-all), MX → Hostinger, SPF + DKIM (hostingermail-a/b/c) + DMARC záznamy v DNS kompletní. `send.php` je na produkci nasazený a odpovídá správně (405 na GET). Zbývá jen běžný post-deploy test formuláře (checklist bod 1).

**R2 — AEO FAQ: ✅ VYŘEŠENO (12. 6. 2026).** Stránka oprav už kompletní FAQ s FAQPage schématem má (5 otázek vč. cen 400–900 Kč za zmenšení, lhůt do 5 dnů) — můj původní návrh vycházel z nepřesného průzkumu. Ceny jdou na web prvním deployem → při kontrole před deployem je s Martinem potvrď. Totéž platí pro ceny ve FAQ snubních prstenů (od 18 000 Kč/pár, 4–8 týdnů).

**R3+Y1 — EN snubní prsteny + sloučení CS/EN: ✅ HOTOVO (12. 6. 2026, schváleno Danielem).** `/en/wedding-rings/` vytvořeno (překlad CS copy, hreflang, sitemap, EN nav dropdown). 9 párů stránek sloučeno do `src/page-templates/` — HTML výstup ověřen jako identický (`scripts/diff-dist.py`). Bonus: opravena pre-existující hreflang chyba CS-only stránek (deklarovaly EN alternate na homepage).

**NOVÉ — Keyword optimalizace (12. 6. 2026, detailně v [_audit/keywords.md](keywords.md)):** „zlatnictví" (2→20 stránek), „Smíchov" (1→22), „šperky na zakázku" (1→20), „vltavín" v titles listingů, EN titles keyword-first, JewelryStore areaServed+keywords, oprava llms.txt („v centru Prahy" → Smíchov — fakticky špatný údaj pro AI odpovědi). Body copy nedotčeno. Ke zvážení zůstává: zmínka „10 minut od Anděla" v textu (body copy → schválit), obsahová vrstva (blog) pro informační dotazy, Google Business Profile kategorie „Zlatnictví".

**PŮVODNÍ R2 (přeskočeno — nahrazeno výše) — návrhy FAQ textů:** Struktura (FAQ.astro + FAQPage schema) je hotová, zakázková tvorba má 5 otázek. Navrhuji doplnit na **/opravy-sperku-praha** (nemá žádné FAQ, přitom cílí na nejčastější dotazy):
1. *„Kolik stojí oprava prstenu?"* — Zmenšení/zvětšení stříbrného prstenu od několika set korun, u zlata dle gramáže; přesnou cenu řeknu po prohlédnutí kusu — pošlete fotku na WhatsApp, odpovím do 24 hodin.
2. *„Opravíte i šperk koupený jinde?"* — Ano. Opravuji šperky bez ohledu na to, kde vznikly — včetně zděděných a starožitných kusů.
3. *„Jak dlouho oprava trvá?"* — Běžné opravy do týdne, jednoduché úpravy často na počkání po domluvě.
4. *„Vyměníte vypadlý kámen?"* — Ano, seženu a zasadím nový kámen; u přírodních kamenů vybíráme společně.
⚠️ Ceny a lhůty v odpovědích 1 a 3 jsou **moje odhady — potvrď je s Martinem**, pak je nasadím (struktura + schema hotové, jde jen o vložení schválených textů).

**R3 — EN verze SEO landing pages neexistují.** `/opravy-sperku-praha` a `/snubni-prsteny-na-miru` jsou CS-only (vypadá to záměrně — lokální klíčová slova). Pokud chceš lovit i EN klientelu na snubní prsteny (expati v Praze = reálný trh), dává smysl `/en/wedding-rings/`. Rozhodnutí o obsahu je tvoje.

### 🟡 Střední

**Y1 — CS/EN duplicita stránek.** Každá stránka existuje 2× (index vs en/index…), změny se musí dělat dvakrát — riziko rozjetí verzí. Návrh: sloučit do dynamických `[locale]` rout s i18n daty (struktura `src/i18n/` už existuje). Větší refactor (~1 den), čistě maintenance přínos, vizuálně nulová změna.

**Y2 — og-skladem výřez.** Attention-crop vltavínového prstenu mírně ořezává vršek kamene. Pokud vadí, vyber jinou produktovku — přegenerování je 1 příkaz (`node scripts/generate-og.mjs`).

**Y3 — HSTS preload.** Po pár týdnech stabilního HTTPS zvaž v .htaccess `max-age=63072000; includeSubDomains; preload` + registraci na hstspreload.org.

**Y4 — @2x hero varianty 110–276 kB.** Pod limitem pro běžné displeje (1x = 45–92 kB), ale pokud chceš ještě níž, je potřeba regenerovat z originálů v `Fotky new fin/` s nižší kvalitou v `process-images.mjs` — ne rekomprese WebP→WebP (tu jsem zamítl, ušetřila ~4 % za cenu degradace).

### 🟢 Nízká priorita

- **G1 — Logo schema**: Google doporučuje PNG ≥600×60 na světlém pozadí; teď je `favicon.svg`. Až bude logotyp v PNG, vyměnit v `seo.ts`.
- **G2 — Review/AggregateRating schema**: až budou reálné Google recenze (testimonial na homepage je teď jen vizuální).
- **G3 — `rounded-2xl` plovoucí panely** (dropdown, mobilní menu, cookie lišta) vs. design pravidlo „sharp corners jen formuláře/foto" — působí jako vědomá výjimka pro floating vrstvy; nechal jsem být.
- **G4 — radial-gradient dekory** (Footer) drží rgba literály odvozené z tokenů — převod na `color-mix()` by byl kosmetický.

---

## 3. Finální build

```
pnpm typecheck  →  0 errors / 0 warnings / 0 hints (54 souborů)
pnpm build      →  57 stránek, bez warningů, Complete!
pnpm audit      →  No known vulnerabilities found
```

---

## 4. Před deployem ověř ručně

1. **Kontaktní formulář na produkci** — odeslání testovací zprávy (Origin check vyžaduje `https://www.zlatnik-martin.cz`, lokálně formulář projde jen mailto fallbackem). Souvisí s 🔴 R1.
2. **Cookie lišta** — odmítni → Network tab nesmí ukázat žádný request na googletagmanager/google-analytics ani po scrollu; pak v anonymním okně souhlas → GA4 Realtime tě musí ukázat.
3. **Mapa na /kontakt** — embed se musí načíst (CSP `frame-src` povoluje maps.google.com — ověř, že LiteSpeed serví nový .htaccess i meta CSP z HTML).
4. **Oba jazyky** — proklikat CS↔EN přepínač na homepage, detailu šperku (překládané slugy) a detailu portfolia; EN cookie lišta anglicky.
5. **Fonty** — servírují se z `/_astro/fonts/*.woff2` (stará cesta `/fonts/` už neexistuje — hard refresh).
6. **PageSpeed Insights** po deployi — LCP by se mělo zlepšit (odstraněný body fade); pošli mi výsledky, ať porovnáme.
7. **Google Search Console** — Rich Results test na 1 produkt (`/sperky/prsten-s-ametystem-kulaty/`) a `/zakazkova-tvorba/` (FAQ), pak resubmit sitemap.
8. **Sociální share** — vlož /kontakt a /portfolio do opengraph.xyz nebo WhatsApp — musí se ukázat nové OG obrázky.

**Deploy:** `pnpm build` → nahrát `dist/*` na Hostinger (vč. `.htaccess`). Nedeployoval jsem nic — čeká na tebe.
