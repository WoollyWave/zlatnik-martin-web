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

---

## Krok 3 — Kvalita kódu

- **`src/scripts/animations.ts` — refactor** (144řádkový `init()` → 6 pojmenovaných funkcí):
  - `animateNav / animateHero / animateParallax / animateScrollReveals / animateRingReveal / animateFloats` — každá jedna zodpovědnost.
  - Magická čísla → konstanty `EASE`, `DUR`, `SCROLL_START`, `DESKTOP_MQ`.
  - Varianty up/fade/scale sjednoceny do mapy — odstraněna trojí duplicita téhož bloku.
  - **Oprava console šumu:** hero timeline se stavěla na všech stránkách a GSAP logoval "target not found" pro chybějící prvky (~60 warningů na load). Selektory se teď filtrují podle přítomnosti v DOM (`ifExists`). Ověřeno v prohlížeči: 0 nových warningů, hero animace funguje.
- **`nav.ts`, `filter-pills.ts`, `web-vitals.ts`** — prověřeny, čisté (focus trap, INP-friendly filter přes CSS třídu, vitals s consent guardem). Bez zásahu.
- **CS/EN duplicita stránek** — strukturální nález do reportu (řešení = sloučení do `[locale]` dynamických rout, větší zásah vyžadující schválení).
- **Ověření:** `pnpm typecheck` ✓ 0/0/0, `pnpm build` ✓, vizuální kontrola v prohlížeči ✓.

---

## Krok 4 — Přístupnost (WCAG 2.2 AA)

- **Nav dropdown nedostupný z klávesnice — KRITICKÉ, opraveno** (`Nav.astro`):
  - Podpoložky „Snubní prsteny na míru" a „Opravy šperků" měly `tabindex="-1"` + wrapper trvalé `aria-hidden="true"` → uživatel klávesnice ani odečítačky se k nim z desktop navigace vůbec nedostal (selhání WCAG 2.1.1).
  - Oprava: `invisible` + `group-focus-within:visible` pattern (visibility řídí viditelnost pro AT i tab order zároveň), odstraněn tabindex i aria-hidden. Odstraněn `aria-haspopup` — sliboval ARIA menu widget chování, které disclosure pattern nemá.
  - **Ověřeno v prohlížeči**: focus na rodičovský odkaz → dropdown visible; Tab → podpoložka fokusovatelná; dropdown zůstává otevřený.
- **`scroll-behavior: smooth` podmíněn `prefers-reduced-motion: no-preference`** (global.css) — smooth scroll je animace, vestibulárně citliví uživatelé dostanou okamžitý skok.
- **FAQ accordion** — dekorativní plus ikona dostala `aria-hidden="true"`; native `<details>/<summary>` keyboard ovládání prověřeno (funguje out-of-box).
- **LangSwitcher** — `aria-label` lokalizován („Přepínač jazyka" na CS stránkách, anglicky byl natvrdo).
- **Prověřeno bez nálezu:** heading hierarchie (unikátní h1, logické h2→h3), alt texty (dekorativní `alt=""` + `aria-hidden` správně), focus indikátory (gold-deep 4.9:1, na tmavé gold-soft), touch targets ≥44px, focus trap mobilního menu (inert pozadí), kontrast palety (řešeno předchozím auditem, tokeny dodržené), formulářové labely (for/id), lightbox (native `<dialog>` = focus trap + Esc zdarma).
- **Navíc:** vypnut Shiki highlighter (`markdown.syntaxHighlight: false`) — web nemá markdown obsah a Shiki inline styly kolidovaly s hash-based CSP (build warning).
- **Ověření:** `pnpm build` ✓ bez warningů.

---

## Krok 5 — Výkon a stabilita layoutu (CWV)

- **`min-h-screen` → `min-h-dvh`** — 8 výskytů v 6 souborech (hero sekce: index, zakazkova-tvorba, snubni-prsteny, opravy, en/index, en/custom-jewelry). `100vh` na mobilech ignoruje dynamický browser chrome → přetečení/CLS; `dvh` sleduje reálnou výšku viewportu.
- **Odstraněn globální body fade-in** (global.css `.js body{opacity:0}` + 2 skripty v Layout.astro):
  - Stránka se vykreslovala s `opacity: 0` až do DOMContentLoaded + 0.8s transition — **přímá penalizace LCP** (browser nemůže zaznamenat paint neviditelného obsahu) a závislost viditelnosti obsahu na JS.
  - FOUC, proti kterému to mělo chránit, nehrozí — CSS je inlinované (`inlineStylesheets: 'always'`), render-blocking stylesheet neexistuje.
  - Vstupní dojem nadále obstarávají GSAP entrance animace per-element (zachovány beze změny).
- **Smazán `hero-martin3.webp` (403 kB)** — nikde nereferencovaný mrtvý asset.
- **Hero váhy prověřeny:** všechny 1x heroes 45–92 kB ✓ (limit 200 kB). `@2x` retina varianty 110–276 kB ponechány — rekomprese q70 ušetřila jen ~4 % za cenu dvojité ztrátové komprese (nevyplatí se); efektivní LCP payload pro běžné displeje je 1x.
- **Layout stabilizéry doplněny** (global.css): `.flex-child{min-width:0}`, `.card img{object-fit:cover}`. Už existovalo: box-sizing, img max-width/height auto, overflow-wrap na body.
- **Prověřeno bez nálezu:** width/height na všech obrázcích, `loading="eager" fetchpriority="high"` na hero / `lazy` mimo viewport, LCP preload s imagesrcset, font-weight všude číslem, žádné scroll-driven CSS animace (GSAP za matchMedia), GSAP+web-vitals lazy po idle, GA preconnect.
- **Ověření:** `pnpm build` ✓, vizuální kontrola homepage v prohlížeči ✓.

---

## Krok 6 — Design konzistence

- **`from-[rgba(30,27,24,0.25)]` → `from-text-primary/25`** (index, zakazkova-tvorba, en/index) — gradient overlay na fotkách teď referencuje token místo literálu (stejná barva, stejná alfa).
- **Prověřeno bez zásahu:** spacing tokeny (`section-sm/md/lg`, hero) konzistentně použité; typografická škála fluid clamp z global.css; radius systém dodržen (pill UI / `rounded-[2px]` formuláře a fotorámy / `rounded-2xl` plovoucí panely); hover/focus stavy na všech interaktivních prvcích; CTA styly jednotné přes `Button.astro`.
- **Ponecháno (odvozené od tokenů, do reportu):** rgba s alfou v radial-gradientech (Footer dekor) a scoped CSS lightboxu — hodnoty derivují z gold-primary/text-primary/button-text; převod na `color-mix(...)` by byl jen kosmetický.
- `<meta name="theme-color" content="#F1EEE5">` — literál nutný (meta tag neumí var()), odpovídá `--color-bg-primary`.

---

## Krok 7 — Cookie lišta a Consent Mode v2

- **GA se načítala i bez souhlasu — opraveno** (Layout.astro): gtag.js se dřív injektoval při první interakci/idle bez ohledu na consent (advanced mode = cookieless pingy na Google). Teď **basic mode**: skript se načítá VÝHRADNĚ (a) po kliknutí na „Souhlasím" (banner volá `window.__loadGA()`), nebo (b) deferred pro vracející se návštěvníky s dříve uloženým souhlasem. **Bez souhlasu / při odmítnutí neodejde na Google jediný request** — ověřeno v prohlížeči (interakce, reload, žádný gtag.js v DOM).
- **Consent Mode v2** — `gtag('consent', 'default', { …všechno denied, wait_for_update: 500 })` zachováno + update na granted po souhlasu/z localStorage.
- **CSP past odhalena testem**: Astro CSP hashuje jen *zpracované* skripty — `is:inline` consent/GA skripty striktní CSP tiše blokovala (consent přežíval jen díky pozici před `<meta>` CSP). Oba převedeny na zpracované module skripty (Astro je hashuje automaticky). Deferred provedení je v basic módu bezpečné — gtag.js před souhlasem neexistuje, `gtag()` jen plní dataLayer frontu. Pozor zachováno: dataLayer dostává `arguments` objekty (rest parametr by gtag commandy rozbil).
- **Banner lokalizován** (CookieBanner.astro) — texty byly natvrdo česky i na EN stránkách; teď `locale` prop (heading, body, tlačítka, odkaz na /en/privacy/).
- **Tlačítka Odmítnout/Souhlasím** — už byla rovnocenná (h-12, shodný padding, plná šířka na mobilu) ✓. Keyboard: nativní `<button>` ✓. Volba se ukládá do localStorage ✓.
- **E2E ověřeno v prohlížeči (built output, striktní CSP):** ① bez rozhodnutí: banner viditelný, GA nikde ani po scrollu/kliku, consent default denied v dataLayer; ② souhlas: localStorage granted, gtag.js injektován, banner mizí; ③ odmítnutí + reload: banner se nevrací, GA se nenačte ani po interakcích; ④ mobilní viewport screenshot ✓.
- **Ověření:** `pnpm typecheck` ✓ 0/0/0, `pnpm build` ✓, všechny vykonatelné inline skripty mají SHA-256 hash v CSP ✓.

---

## Krok 8 — Fotky a média

- **Vlastní OG obrázky 1200×630** — nový generátor `scripts/generate-og.mjs` (Sharp, attention/center crop, mozjpeg q82, 38–142 kB). Vygenerováno 7 obrázků do `public/images/og/` z existujících fotek projektu a napojeno přes `ogImage` prop na 12 stránek (CS+EN): kontakt (Martin u ponku), zakázková tvorba (přívěsek quartz), skladem (vltavínový prsten), portfolio (vltavín wide), o dílně (dílna), snubní prsteny (snubáky), opravy (Martin portrét). Vizuálně zkontrolovány všechny výřezy.
- **`og:image:width/height`** doplněno do Layout head (rychlejší první share — scraper nemusí obrázek stahovat kvůli rozměrům). Homepage zůstává na og-default.jpg (1200×630 ✓).
- **Oprava srcset** (kontakt cs+en) — `srcset` odkazoval stejný soubor pro 1x i 2x (@2x verze neexistuje) → odstraněn.
- **Alt texty, rozměry, lazy loading, formáty** — prověřeno v krocích 4–5, bez dalších nálezů. Relevance fotek k sekcím: bez problémů; případné výměny viz report.
- **Ověření:** `pnpm build` ✓, og:image meta zkontrolována v dist na 8 stránkách.

---

## Krok 9 — SEO / AEO / GEO / AIO

- **Product schema opravy** (`src/lib/seo.ts`, `src/data/products.ts`):
  - Odstraněn neplatný `productionDate: 'on-demand'` (schema.org očekává Date — validátor by hlásil chybu).
  - **`availability` přepínač InStock/SoldOut**: nové pole `sold?: boolean` na Product — `sold: true` přepne offer na `schema.org/SoldOut` (stránka se nemaže, drží SERP historii). Všechny kusy aktuálně skladem = beze změny dat.
- **NAP konzistence (GEO)**: footer zobrazoval adresu bez PSČ („Pod Kesnerkou 46, Praha 5") — sjednoceno na `SITE.address.full` → **„Pod Kesnerkou 46, Praha 5, 150 00" znak po znaku identicky** ve footeru, na kontaktu, v JSON-LD i llms.txt. Telefon/e-mail/IČO už konzistentní byly (jediný zdroj `site.ts`).
- **Prověřeno bez zásahu (už implementováno správně):**
  - Unikátní title + description všude, canonical, **obousměrný hreflang cs/en/x-default** (ověřeno v dist na statických i detailových stránkách vč. přeložených slugů).
  - JSON-LD @graph: JewelryStore+LocalBusiness (adresa, telefon, geo 50.058644/14.403715, otevírací doba Po–Pá 9–17), Person (Martin Ševr, E-E-A-T), WebSite+speakable, Product s Merchant Listing poli (vratky, doprava), BreadcrumbList, Service (zakázková/opravy/snubní), CollectionPage+ItemList, FAQPage na zakázkové tvorbě. Všech 57 stránek parsuje validně.
  - Vlastní sitemap.xml endpoint s lastmod + image: + hreflang alternates; robots.txt explicitně povoluje GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended a další; llms.txt s NAP, službami a popisem stránek.
  - Klíčové info (kontakt, adresa, služby) v plain HTML bez JS závislosti (statický Astro výstup).
  - Interní prolinkování: opravy-sperku-praha a snubni-prsteny-na-miru linkované z Nav dropdownu (nyní i přístupného) a footeru — žádné orphan stránky.
- **AEO návrhy textů FAQ** (cena zakázky, doba výroby, opravy) → report ke schválení; struktura (FAQ.astro + faqPageSchema) připravena.
- **Ověření:** `pnpm typecheck` ✓, `pnpm build` ✓, JSON-LD parse test na všech stránkách ✓.

---

## Krok 10 — Sloučení CS/EN do sdílených šablon + EN snubní prsteny (schváleno Danielem)

- **8 párů stránek sloučeno do `src/page-templates/`** (Home, CustomJewelry, InStock, Portfolio, About, Contact, ProductDetail, CaseStudy + WeddingRings) — route soubory jsou 5řádkové wrappery, texty v per-locale slovnících, `getStaticPaths` zůstává ve wrapperech. Privacy pár záměrně nesloučen (celostránková právní próza). Netto −864 řádků.
- **Verifikace:** vlastní nástroj `scripts/diff-dist.py` — HTML výstup PŘED a PO refactoru porovnán na všech 57 stránkách (normalizace: whitespace na hranicích tagů, HTML entity, komentáře, pořadí CSP hashů). Výsledek: ✓ IDENTICKÉ. Mezery u inline `<em>` (normalizací maskované) zkontrolovány vizuálně v prohlížeči.
- **Odhalený drift CS/EN (nyní už nemožný):** CS „Tři pravidla" vs 4 karty (EN „Four principles" správně) — ke schválení v reportu; gradient overlay class nekonzistence; CS odkazy bez trailing slash vs EN s; EN chybělo testimonial-zakomentování.
- **Nová stránka `/en/wedding-rings/`** — překlad schválené CS copy (voice & tone: 1. osoba, bez vykřičníků). Zapojeno: `PATH_MAP.weddingRings`, hreflang pár, sitemap alternates, EN nav dropdown („Wedding rings"), `weddingRingsServiceSchema(locale)`, OG obrázek sdílený. Build: 58 stránek.
- **Oprava pre-existující hreflang chyby:** CS-only stránky (opravy) deklarovaly `hreflang="en"` na homepage — mismatched hreflang. Nově `getAlternatePathStrict()`: hreflang se emituje jen při reálném ekvivalentu; opravy teď hreflang nemají vůbec (správně).
- **FAQ opravy (R2)**: zjištěno, že stránka už kompletní FAQ s cenami + FAQPage schema má (návrh v reportu vycházel z nepřesného průzkumu). Ceny (400–900 Kč zmenšení atd.) jdou na web prvním deployem — potvrdit s Martinem.

---

## Krok 11 — Responzivní oprava hero „Zakázková tvorba" (CS i EN)

- **Problém:** scattered fotky byly pozicované procenty viewportu nezávisle na textu → ve středních šířkách (~900–1300 px) a na nižších oknech kolidovaly s nadpisem, podtitulem i tlačítky.
- **Řešení — bezpečné koridory od středu:** text má `max-w-3xl` (768 px) centrovaný; boční fotky se nově pozicují `calc(50% ± ≥390px)` → matematicky nemohou kolidovat na žádné šířce. Šířky fotek přes `clamp()` (plynulé škálování místo skoků).
- **Breakpoint scattered vrstvy md→lg** — pod 1024 px koridory nemají prostor; tablet (768–1023) nově dostává mobilní layout s hero fotkou (vizuálně čistší než ořezané proužky).
- **Adaptivní hustota:** lg = 2 rohové fotky; xl = +4 boční; středové akcenty (nad/pod textem) jen při `min-width:1280px AND min-height:780px` (arbitrary media variant) — na nízkých oknech by narazily do obsahu vertikálně.
- **Ověřeno měřením kolizí v DOM + screenshoty:** 375×812, 768×1024, 1024×768, 1280×700, 1440×900, 1920×1080 — 0 kolizí, 0 horizontal overflow. Sdílená šablona = oprava platí i pro /en/custom-jewelry/.
- **Iterace po feedbacku z produkce (2 kola):** ① kotvení ke středu stahovalo fotky na širokých monitorech k textu; ② kotvení k okrajům viewportu zase kompozici roztrhalo (fotky daleko a malé). **Finální řešení: centrované plátno `max-w-[1600px]`** — kompozice se nad 1600 px přestane roztahovat a drží pohromadě jako původní návrh; pod 1600 px je plátno rovno viewportu a kolizím brání strop šířky `min(%, maxPx, calc(Nvw − 400px))`. Ověřeno 2D kolizním měřením (1280×800: 0 kolizí, šířky fotek 150–266 px) a vizuálně na 1920×1080.

---

## Krok 12 — Červencová vlna zacommitována + otevírací doba (20. 8. 2026)

**Výchozí stav:** poslední commit byl z 11. 7., ale práce z 27.–29. 7. (stránky
Čištění šperků CZ+EN, EN mutace Oprav, přepis `src/lib/seo.ts`, lastmod z gitu,
produkt #20) byla tři týdny nasazená na produkci **bez commitu**. Ověřeno
porovnáním všech 70 stránek: produkce byla byte-identická s necommitnutým
`src/`, lišila se jen v build-date polích.

### Co to způsobovalo
- **Sitemapa lhala.** `gitLastmod()` bere datum posledního commitu dotýkajícího
  se zdrojů stránky. Bez commitu hlásilo 64 z 68 URL datum 10.–11. 7., přestože
  obsah vznikl 27.–29. 7. Google se o změnách nikdy nedozvěděl.
- Tři týdny práce existovaly na jednom disku, `origin` měl jen `main` z 25. 3.

### Opravené chyby
- **`Stříbro · undefined` na CZ i EN homepage.** `HomePage.astro` skládal cenový
  tag natvrdo jako `Stříbro · ${priceSilver}`; produkt #20 je jen ve zlatě a po
  `products.reverse()` spadl do `slice(0, 3)`. Bylo živé na produkci.
- **`send.php`** razítkoval rate-limit před validací — zákazník s překlepem
  v e-mailu dostal 422 a jeho oprava do 30 s narazila na 429. Ztracená poptávka.
  Nově se razítkuje až za úspěšným `mail()`.
- **`.htaccess`** hostová podmínka nepočítala s portem v hlavičce `Host`; stejná
  třída chyby, jaká v 7/2026 poslala `X-Robots-Tag: noindex` na produkci.

### Otevírací doba → po telefonické dohodě
Na přání Martina: zákazníci chodili bez objednání ve chvílích, kdy nebyl
v dílně. Web navíc uváděl Po–Pá 9:00–17:00, zatímco Google Business Profile
Po–Pá 10:00–18:00 — dva zdroje si odporovaly.

- `SITE.hours` je nově `{ cs, en }`, jediný zdroj pravdy
- `openingHoursSpecification` **vypuštěno** z `LocalBusiness`. Schema.org pro
  „jen po domluvě" nemá hodnotu a vymyšlené hodiny Google ukazuje jako závazné.
  Nevracet zpět.
- GBP přepnut na „Otevřeno (bez hlavní otevírací doby)", důvod v popisu firmy

### Adversariální kontrola vlastních změn
32 nálezů → 26 nezávisle ověřeno → 9 potvrzeno. Opraveno:
- `prsten-s-vltavinem-original` neměl `priceSilverEn` → na EN stránkách svítilo
  „13 000 Kč" mezi devatenácti kartami ve formátu „CZK 13,200"
- `goldNote` se u gold-only kusu zahazovalo → karta #20 ukazovala 50 000 Kč bez
  zmínky, že jde o akci; detail ji přitom zobrazoval
- homepage nefiltrovala `sold` → po `reverse()` bere nejnovější kusy, tedy tu
  část katalogu, kde se „prodáno" objeví nejdřív, a karta badge nemá
- hmotnosti se vypisovaly česky i anglicky („Weight: 2,50 g" pod „CZK 19,200")
- FAQ na `/skladem/` říkalo „ideálně po předchozí domluvě" — po zrušení pevné
  doby je to podmínka, ne doporučení
- `/skladem/` se popisovalo jako stříbrný katalog, přestože nejdražší kus je zlatý

### Drobnosti
- `send.php` označuje zprávy ze stagingu v předmětu i těle; do patičky přibyl host
- `ContactForm` nastavuje `novalidate` až z JS — bez JS platí nativní validace
  prohlížeče, takže se neodešle nekompletní formulář a vyplněná data se neztratí
- akční cena #20 prodloužena z 23. 8. na **30. 9. 2026** (`goldNote`, `goldNoteEn`
  i `priceValidUntil` musí zůstat v souladu)
- `git gc` — repo z 105 na 97 MB, 2 960 loose objektů zabaleno
- dokumentace srovnána se skutečností: README (byl defaultní Astro šablona),
  IA v CLAUDE.md (13 CZ/EN párů místo 8 osiřelých CZ cest), sitemap sekce
  v ASTRO-PATTERNS (odkazovala na nepoužívaný `@astrojs/sitemap`)

### Ověření po nasazení
70/70 stránek byte-identických s buildem, 345/345 assetů 200, sitemapy a
`llms.txt` shodné, legacy 301 (`/retizky`, `/puncovni-znacky`) funkční.

### Zůstává otevřené
- ceny zlata `pricesAsOf: '2026-05-12'` — přes tři měsíce staré na 18 produktech
- GSC za 29. 7. – 20. 8. nikdo neviděl; dnešní změny chtějí kontrolu za ~14 dní
- `aggregateRating` čeká na recenze, 12 stříbrných vzorků snubáků na datový soubor
- staging `web.vilim.sbs` běží na buildu z 10. 7. se starým `.htaccess`
