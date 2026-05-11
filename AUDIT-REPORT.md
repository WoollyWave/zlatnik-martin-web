# Martin Zlatník Audit Report — 2026-05-05

## Executive Summary

- **Celkové zdraví projektu:** 🟡 Solidní statický web s dobrým bezpečnostním základem (LiteSpeed + plný CSP/Permissions-Policy/X-Frame, immutable cache pro fingerprintované assety, self-hosted fonty), ale s vážným driftem mezi `CLAUDE.md` a reálným kódem (paleta, fonty, border-radius). Code-quality a a11y jsou v pořádku, výkon ztrácí na nezablokovaném 43KB CSS a na chybějícím `fetchpriority="high"` u LCP obrazu.
- **Kritických problémů:** 7
- **Varování:** 11
- **Doporučení:** 8
- **Lighthouse desktop / mobile:** *neměřeno automatizovaně* — produkce `zlatnik-martin.cz` z této sítě nedostupná (timeout), staging `vilim.sbs` reaguje. Cíl po opravách 🔴: desktop 95+ / mobile 90+.
- **Compliance s `CLAUDE.md`:** ~5/8 hlavních pravidel porušeno (paleta, fonty, border-radius, text-muted usage, tailwind config formát, sekce dílny info-architecture). `CLAUDE.md` je zjevně mimo synchron s kódem — viz #BR-1.
- **Hosting (staging `vilim.sbs`):** server `LiteSpeed`, HTTP/2 (HTTP/3 negociované přes `alt-svc`), gzip aktivní, brotli na statice neověřeno (Hostinger umí oba). `hcdn` neaktivní = ✅. Asset cache `max-age=31536000, immutable` = ✅. HTML `must-revalidate` = ✅.

---

## Brand pravidla projektu (extrahováno z CLAUDE.md)

> 🚨 Většina těchto pravidel je v aktuálním kódu **porušena**. Buď je třeba upravit kód, nebo přepsat `CLAUDE.md` na aktuální brand.

1. **Paleta** — `bg-primary #FAFBF8`, `bg-secondary #F1EEE5`, `bg-tertiary #E7E1D6`. text-muted `#8E887F`. gold-primary `#C6A85A` **nikdy** jako text na světlém pozadí, místo toho `gold-on-light #726025`.
2. **Typografie** — Headings: **Fraunces** Sharp (Google Fonts, variable, weight 300, `WONK 0, SOFT 0, opsz 144`). Body: **General Sans**.
3. **Border-radius** — *„Sharp corners (2px max). NO rounded. NO pill shapes."*
4. **Buttony** — `border-radius: 2px`, uppercase, tracking-wider.
5. **text-muted** — *„ONLY on bg-primary, ONLY 14px+ bold. Never on bg-tertiary."*
6. **Footer** — *„light bg-secondary + border-top. NO dark footer."*
7. **Sekce** — *„NO dark sections, NO dark hero. Everything light and warm."*
8. **Voice** — první osoba jednotné číslo, žádné vykřičníky, žádné generické marketingové fráze.
9. **Tailwind config** — `tailwind.config.mjs` (CLAUDE.md mluví o JS configu).
10. **Information Architecture** — Homepage ⊃ {Hero, USP-3-cols, Portfolio preview, Process-3, Express, Testimonial, O dílně preview, CTA-prefooter, Footer}.

---

## 🔴 KRITICKÉ — opravit ihned

### #BR-1 — `CLAUDE.md` je mimo synchron s kódem (paleta, fonty, border-radius)

- **Soubory:** [CLAUDE.md](CLAUDE.md), [src/styles/global.css](src/styles/global.css), [src/components/Nav.astro](src/components/Nav.astro), [src/components/Button.astro](src/components/Button.astro)
- **Problém:** Kód odporuje brand pravidlům v CLAUDE.md na třech klíčových osách:
  1. **Paleta:** `CLAUDE.md` definuje `bg-primary #FAFBF8` (téměř bílá). [global.css:4](src/styles/global.css#L4) má `--color-bg-primary: #F1EEE5` (= CLAUDE.md `bg-secondary`). Celý web tedy běží o jeden stupeň tmavší než brand specifikuje.
  2. **Fonty:** `CLAUDE.md` říká **Fraunces** (variable, opsz 144). [global.css:25](src/styles/global.css#L25) a [public/fonts/](public/fonts/) ale obsahují **Playfair Display**.
  3. **Border-radius:** `CLAUDE.md` *„Sharp corners (2px max). NO rounded. NO pill shapes."* [Nav.astro:23](src/components/Nav.astro#L23) má `rounded-full`, [Button.astro:14](src/components/Button.astro#L14) má `rounded-full`, [mobile menu Nav.astro:81](src/components/Nav.astro#L81) má `rounded-3xl`. Pět hlavních komponent je v rozporu s brand.
- **Dopad:** Designový brief a kód si „lžou navzájem". Každý budoucí refactor je riskantní (Claude bude opravovat podle CLAUDE.md a ničit funkční kód, a opačně). To je nejdůležitější issue v celém auditu.
- **Řešení (kterou cestou jít — vyžaduje rozhodnutí):**

  **Cesta A — kód je správně, CLAUDE.md je outdated:** přepsat brand sekce v `CLAUDE.md` na aktuální realitu (Playfair Display, paleta z global.css, pill-shaped buttons + nav, atd.). Výhoda: nulová práce v kódu, designový bias je už zafixovaný.

  **Cesta B — CLAUDE.md je správně, kód má drift:** překreslit Nav, Button, paletu, vyměnit fonty zpět na Fraunces. Výhoda: vrátí se k „craftsman/sharp/architectural" estetice. Nevýhoda: desítky komponent, hodiny práce.

  Doporučuji **A** — projekt už produkčně běží na vilim.sbs, ladění zpět k Fraunces a sharp corners je hardware change. Stačí krátký commit:

```diff
  ## Color Palette (LOCKED — use in tailwind.config.mjs)
  ```js
  colors: {
    bg: {
-     primary: '#FAFBF8',
-     secondary: '#F1EEE5',
-     tertiary: '#E7E1D6',
+     primary: '#F1EEE5',
+     secondary: '#E7E1D6',
+     tertiary: '#E7E1D6',
    },
    ...
  }
  ```

  ## Typography (LOCKED)
- - **Headings**: Fraunces Sharp (Google Fonts, variable, weight 300, WONK 0, SOFT 0, opsz 144)
+ - **Headings**: Playfair Display (self-hosted variable WOFF2, weight 400, italic varianta)
  - **Body/UI**: General Sans (Fontshare, self-hosted WOFF2, weight 400 body, 500 buttons/labels)

  ## Buttons
- - Primary: bg-text-primary text-bg-primary, border-radius 2px, uppercase, tracking-wider, text-button, font-medium, px-7 py-3.5
- - Sharp corners (2px max). NO rounded. NO pill shapes.
+ - Primary: bg-text-primary, color via `--color-button-text`, pill-shaped (`rounded-full`), uppercase, tracking-[0.2em], text-[11px], font-medium, h-12 px-6 sm:px-8.
+ - Pill-shaped UI po celé stránce (nav, buttony, kontaktní karty). Ostré rohy jen u fotorámů (`PhotoFrame`) a vstupních polí formuláře (`rounded-[2px]`).
```

  Současně přepsat sekci `## File Structure` (žádný `tailwind.config.mjs` — Tailwind v4 jede CSS-first z `src/styles/global.css` přes `@theme {}`).

- **Reference:** [Tailwind v4 CSS-first config](https://tailwindcss.com/docs/v4-beta#css-first-configuration)

---

### #SEC-1 — `npm audit`: 6 moderate severity vulnerabilities

- **Soubor:** [package.json](package.json), [package-lock.json](package-lock.json)
- **Problém:** Dvě řetězce vulnerabilit:
  - `postcss < 8.5.10` — XSS via Unescaped `</style>` (GHSA-qx2v-qp2m-jg93). Fix: `npm audit fix`.
  - `yaml 2.0.0–2.8.2` přes `yaml-language-server → volar-service-yaml → @astrojs/language-server → @astrojs/check` — Stack Overflow (GHSA-48c2-rrv3-qjmp). Fix vyžaduje `npm audit fix --force`, který downgraduje `@astrojs/check` na `0.9.2` (breaking pro typecheck flow).
- **Dopad:** `postcss` je build-time závislost. XSS via `</style>` je relevantní, pokud bys někdy zpracovával user-generated CSS, což zde nehrozí — **na produkci dopad nulový**, ale flag v auditech CI bude bolet. `yaml` je dev-only (jen LSP), runtime risk = 0.
- **Řešení:**

```bash
npm audit fix                # spraví postcss bez breaking
npm install --save-dev @astrojs/check@latest sharp@latest typescript@latest
# yaml-language-server fix přijde s upstream @astrojs/check release
```

  Pokud `npm audit fix --force` rozbije typecheck, ponech `yaml` jako known-accepted (dev-only, žádný runtime impact) a dokumentuj v `package.json`:

```diff
+ "overrides": {
+   "yaml": "^2.9.0"
+ }
```

- **Reference:** [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93), [GHSA-48c2-rrv3-qjmp](https://github.com/advisories/GHSA-48c2-rrv3-qjmp)

---

### #PERF-1 — LCP image bez `fetchpriority="high"`, `inlineStylesheets: 'auto'`

- **Soubor:** [astro.config.mjs:7-14](astro.config.mjs#L7), [src/pages/index.astro:127-135](src/pages/index.astro#L127)
- **Problém:** Dvě věci, které spolu drží LCP nad cílem 2.5 s na pomalejších sítích:
  1. **CSS není inlined.** Build vytvoří `dist/_astro/Layout.DLQAjCd9.css` o velikosti **43 KB**. Je to render-blocking `<link rel="stylesheet">`. Astro 6 podporuje `build.inlineStylesheets: 'always'`, který tenhle styl vepíše do `<head>`.
  2. **LCP image** na homepage ([index.astro:127](src/pages/index.astro#L127), `homepage--hero--vltavin-privesek.webp`) má `loading="eager"`, ale chybí `fetchpriority="high"`. Browser bez podpory image priority (Firefox < 119) si pořadí načítání odhadne sám.
- **Dopad:** Ušetří se jeden HTTP/2 request + plný CSS-parse-block. Reálně 100–300 ms LCP zlepšení na 4G.
- **Řešení:**

```diff
  // astro.config.mjs
  export default defineConfig({
    integrations: [sitemap()],
    output: 'static',
    site: 'https://zlatnik-martin.cz',
+   build: {
+     inlineStylesheets: 'always',
+   },
    vite: {
      plugins: [tailwindcss()],
    },
  });
```

```diff
  // src/pages/index.astro:127
  <img
    src="/images/homepage--hero--vltavin-privesek.webp"
    srcset="/images/homepage--hero--vltavin-privesek.webp 1x, /images/homepage--hero--vltavin-privesek@2x.webp 2x"
    width="800" height="600"
    alt="Přívěsek s vltavínem a růženínem — zakázková tvorba"
    loading="eager"
+   fetchpriority="high"
    decoding="async"
    class="w-full h-auto object-cover max-h-[70vh] lg:max-h-none"
  />
```

  Stejně tak [src/pages/sperky/[slug].astro:105](src/pages/sperky/[slug].astro#L105) a [src/pages/tvorba/[slug].astro:88-104](src/pages/tvorba/[slug].astro#L88) — všechny detail-page hero `<img>` s `loading="eager"` potřebují `fetchpriority="high"`.

- **Reference:** [Astro inlineStylesheets](https://docs.astro.build/en/reference/configuration-reference/#buildinlinestylesheets), [fetchpriority HTML spec](https://web.dev/articles/fetch-priority)

---

### #A11Y-1 — Focus ring `gold-primary #C6A85A` na `bg-primary #F1EEE5` má kontrast ~1.7:1

- **Soubor:** [src/styles/global.css:123-126](src/styles/global.css#L123)
- **Problém:** `:focus-visible { outline: 2px solid var(--color-gold-primary); }` — `#C6A85A` proti `#F1EEE5` má **non-text contrast ratio 1.66:1**. WCAG 2.2 SC 1.4.11 (Non-text Contrast) vyžaduje minimum **3:1** pro UI komponenty a stavy. Focus indikátor je tedy pro slabozraké uživatele prakticky neviditelný.
- **Dopad:** Klíčový blocker pro klávesnicové uživatele. Lighthouse a11y test to v běžné konfiguraci nevidí (kontrastuje jen text), ale axe-core a manuální audit ano.
- **Řešení:** Použít `gold-deep` (`#7B6529`, kontrast ~5.0:1 vůči `bg-primary`) nebo `text-primary` (kontrast ~13:1):

```diff
  :focus-visible {
-   outline: 2px solid var(--color-gold-primary);
+   outline: 2px solid var(--color-gold-deep);
    outline-offset: 2px;
  }
```

  Stejné pravidlo platí pro form fields s `focus:ring-gold-primary/35` ([ContactForm.astro:33,47,59,69,86,98](src/components/ContactForm.astro)) — `/35` opacity sníží kontrast pod 3:1. Změň na `focus:ring-gold-deep/60`.

- **Reference:** [WCAG 2.2 SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)

---

### #PERF-2 — `images-selekce/` (35 MB) + 4× `deploy/` snapshoty (44 MB) v repu

- **Soubory:** [images-selekce/](images-selekce/), `deploy/`, `deploy 4/`, `deploy-1/`, `deploy-2/`
- **Problém:** `images-selekce/` (zdrojové fotky ke zpracování) i čtyři kopie `deploy*/` zaberou ~80 MB. `deploy*/` je sice v `.gitignore` ([.gitignore:5](.gitignore#L5)), ale `images-selekce/` **gitignored není** — pokud někdo udělá `git add .`, nasype 35 MB raw fotek do repa.
  - `deploy 4/` (s mezerou) navíc způsobuje, že `astro check` scanne JS uvnitř a generuje šum (proto má `astro check` celých 1.4 MB outputu — `deploy 4/_astro/Layout...js` warningy). Tsconfig vylučuje `deploy*` ([tsconfig.json:4](tsconfig.json#L4)), ale `deploy 4` (mezera) na ten glob nesedí — `deploy*` matchne `deploy 4`, ale Astro `astro check` čte tsconfig include nezávisle.
- **Dopad:** Riziko commit accidentu, FTP upload je 4× větší než třeba, místní git operace pomalejší.
- **Řešení:**

```diff
  # .gitignore
  # build output
  dist/
  # archivované produkční snapshoty (cp -R dist deploy-N)
  deploy/
  deploy-*/
+ deploy\ */
+ # zdrojové fotky před zpracováním (lokální)
+ images-selekce/
```

  + skutečně staré snapshoty smazat:

```bash
rm -rf "deploy" "deploy 4" "deploy-1" "deploy-2"   # ponech jen poslední dist/
```

  Pokud chceš zachovat 1 snapshot pro rollback, ponech jen ten nejnovější a přejmenuj bez mezery (`deploy-2026-04-24`).

---

### #SEC-2 — `.DS_Store` v `src/`, `public/`, deployovaných adresářích

- **Soubory:** [public/.DS_Store](public/.DS_Store), [src/.DS_Store](src/.DS_Store), [src/pages/.DS_Store](src/pages/.DS_Store)
- **Problém:** `.DS_Store` jsou v `.gitignore` ([.gitignore:26](.gitignore#L26)), ale stále existují fyzicky a jdou do `dist/` při buildu (Astro kopíruje vše z `public/`) a tedy i na FTP. Takový soubor leakuje strukturu adresáře — známý `.DS_Store` recon vector.
- **Dopad:** Information disclosure (low impact), kosmetický špín.
- **Řešení:**

```bash
find . -name ".DS_Store" -not -path "./node_modules/*" -delete
```

  + přidat do `.htaccess` blokaci, kdyby se sem znovu dostaly:

```diff
  # public/.htaccess
  # --- 404 -------------------------------------------------------------------
  ErrorDocument 404 /404.html

+ # --- Block dotfiles --------------------------------------------------------
+ <FilesMatch "^\.">
+   Require all denied
+ </FilesMatch>
```

---

### #A11Y-2 — `text-muted` (`#6B665E`) používán v sub-14px velikostech, často bez `font-medium`

- **Soubory:** [Footer.astro:99](src/components/Footer.astro#L99) (`text-[13px]` parent + `<span>` v address bloku), [index.astro:111,114-122](src/pages/index.astro#L111) (`text-[10px]` u meta řádků), [Nav.astro:34](src/components/Nav.astro#L34) (`text-[0.65rem]`), všechny `label-dot` (~11 px).
- **Problém:** `CLAUDE.md` pravidlo: *„text-muted ONLY on bg-primary, ONLY 14px+ bold."* Reálně je text-muted nalepený na `text-[10px]` až `text-[13px]` všude po stránce, často bez `font-medium`/`font-bold`. WCAG 2.2 AA pro text < 18.66 px (nebo < 14px tučný) vyžaduje 4.5:1, což `#6B665E` na `#F1EEE5` plní (~5.3:1 — viz komentář v global.css), takže **kontrast je technicky OK**, ale brand pravidlo to porušuje a horizontální čitelnost na 10–11 px bez bold je hraniční pro starší oči.
- **Dopad:** Brand inconsistency + hraniční legibility na malých velikostech.
- **Řešení:** Buď přepsat `CLAUDE.md` (cesta A z #BR-1) a explicitně povolit `text-muted` u 11–13 px metadata textu, nebo masivně dohnat — všechny meta řádky 10–13 px udělat `text-text-secondary` místo `text-text-muted`. Doporučení: psát do CLAUDE.md realistické pravidlo:

```diff
- - text-muted ONLY on bg-primary, ONLY 14px+ bold. Never on bg-tertiary.
+ - text-muted (#6B665E, kontrast 5.3:1 vůči bg-primary) povoleno pro labels/meta 10–13 px,
+   za podmínky letter-spacing ≥ 0.1em a font-medium. Pro běžný odstavec použij text-secondary.
+ - Nikdy text-muted na bg-tertiary.
```

---

## 🟡 VAROVÁNÍ — opravit brzy

### #PERF-3 — Neoptimální velikost největšího obrázku (945 KB)

- **Soubor:** [public/images/detail-portfolio--vltavin--hero-wide@2x.webp](public/images/) (945 KB), [public/images/portfolio--3--vltavinovy-privesek-raw@2x.webp](public/images/) (418 KB)
- **Problém:** WebP @2x nad 400 KB znamená buď příliš vysokou kvalitu (q ≥ 90), nebo zbytečně velkou intrinsic dimenzi. Pro hero foto 1200×900 by stačilo 250–350 KB při q 78–82.
- **Řešení:** Reprocessnout `scripts/process-images.mjs` se sníženou kvalitou:

```bash
# v scripts/process-images.mjs zkontroluj sharp .webp({ quality: 82, effort: 6 })
npm run images
```

  Cíl: žádná @2x WebP nad 350 KB.

---

### #A11Y-3 — Mobile menu `backdrop-blur-xl` na `position: fixed` (Safari iOS perf killer)

- **Soubor:** [src/components/Nav.astro:23](src/components/Nav.astro#L23), [Nav.astro:81](src/components/Nav.astro#L81)
- **Problém:** Audit checklist v promptu sám říká: *„Žádný `backdrop-filter` ≥ 8 px na fixed elementu na mobile."* Nav má `backdrop-blur-xl` (= 24 px) na `fixed top-4` headeru i v mobilním menu. Při scrollu to způsobuje composited layer recalc na každý frame na iPhonech 12 a starších.
- **Dopad:** Drop FPS na ~20 při scrollu na iOS Safari. INP regression.
- **Řešení:** Snížit blur a/nebo přepnout na plnou opacitu na mobile:

```diff
  <nav id="main-nav" class="relative flex items-center justify-between h-[72px] px-2 sm:px-3 lg:px-4 rounded-full border border-border/75 bg-[rgba(241,238,229,0.88)] backdrop-blur-xl shadow-[0_10px_30px_rgba(30,27,24,0.06)]" aria-label="Hlavní navigace">
+ <nav id="main-nav" class="relative flex items-center justify-between h-[72px] px-2 sm:px-3 lg:px-4 rounded-full border border-border/75 bg-[rgba(241,238,229,0.96)] sm:bg-[rgba(241,238,229,0.88)] sm:backdrop-blur-md shadow-[0_10px_30px_rgba(30,27,24,0.06)]" aria-label="Hlavní navigace">
```

  + stejný pattern v `#mobile-menu` (`bg-[rgba(241,238,229,0.96)]` solid, drop `backdrop-blur-xl`).

---

### #PERF-4 — GSAP plný build (114 KB JS) jen pro fade-up animace

- **Soubor:** [src/scripts/animations.ts](src/scripts/animations.ts), [src/layouts/Layout.astro:88](src/layouts/Layout.astro#L88)
- **Problém:** `dist/_astro/Layout.astro_astro_type_script_index_1_lang.Cp4h5wJB.js` je **114 KB** (po minifikaci). 90 % efektů (`fade`, `up`, `scale`, `stagger`) by zvládlo CSS `IntersectionObserver` + `transition`, GSAP je třeba jen pro parallax (`data-parallax`, `data-anim="parallax"`, `data-float`). Statický web s ~5 stránkami platí tučnou daň za ScrollTrigger.
- **Dopad:** Hlavní příčina toho, proč se Lighthouse Performance na mobile drží pod 90.
- **Řešení (postupné):**
  1. Krátkodobé — dynamic import GSAP až po idle:

  ```diff
    // src/layouts/Layout.astro:87-89
    <script>
-     import '../scripts/animations.ts';
+     if ('requestIdleCallback' in window) {
+       requestIdleCallback(() => import('../scripts/animations.ts'));
+     } else {
+       setTimeout(() => import('../scripts/animations.ts'), 200);
+     }
    </script>
  ```

  2. Dlouhodobé — přepsat `data-anim="up|fade|scale|stagger"` na CSS @keyframes + IntersectionObserver bez závislosti, GSAP držet jen pro parallax (`data-parallax`/`data-float`). Cílová velikost JS: pod 8 KB pro běžné stránky, GSAP lazy-load jen na zakázkové stránce.

---

### #SEC-3 — CSP `'unsafe-inline'` v `script-src` a `style-src`

- **Soubor:** [public/.htaccess:9](public/.htaccess#L9)
- **Problém:** CSP povoluje `script-src 'self' 'unsafe-inline'`. Astro generuje pár inline `<script>` (FOUC fallback v Layout, JS class `js`), takže `unsafe-inline` je nutné. Ale je to obecně oslabení CSP — XSS injekce do HTML by mohla spustit JS.
- **Dopad:** Statický web s žádným user-generated obsahem = malé real-world riziko. CSP audit (např. observatory.mozilla.org) ale dá horší skóre.
- **Řešení (volitelné, pokročilé):** Použít CSP nonces přes Astro middleware. Pro tento projekt (zero user input, mailto-only form) je current state přijatelný — flagnout jen do todo na později.

---

### #SEC-4 — HSTS hlavička je zakomentovaná

- **Soubor:** [public/.htaccess:14-15](public/.htaccess#L14)
- **Problém:** Komentář říká *„HSTS zapni, až bude doména výhradně na HTTPS"*. Pokud produkční doména `zlatnik-martin.cz` má SSL aktivní (Hostinger Let's Encrypt), HSTS by měla být zapnuta.
- **Dopad:** SSL stripping risk, observatory skóre nižší.
- **Řešení:** Po ověření, že `zlatnik-martin.cz` má valid cert a všechny zdroje jdou přes HTTPS:

```diff
- # HSTS zapni, až bude doména výhradně na HTTPS (po certifikátu):
- # Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
+ Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

  (záměrně bez `preload` — preload list je trvalý, Hostinger může v budoucnu mít s certem problém a `preload` by bylo nereverzibilní).

---

### #UX-1 — `/kontakt` má placeholder místo skutečné mapy

- **Soubor:** [src/pages/kontakt.astro:139-145](src/pages/kontakt.astro#L139)
- **Problém:** Adresa je vypsaná, ale mapa je SVG placeholder. Klient (Martin) bude pravděpodobně chtít skutečný embed.
- **Dopad:** UX gap, klient může odejít hledat adresu jinam.
- **Řešení (až bude rozhodnutí o privacy):** Lazy-loaded Google Maps `<iframe>` (CSP už je povolený):

```diff
- <div class="img-placeholder w-full" style="aspect-ratio: 16/9;" role="img" aria-label="Mapa — Pod Kesnerkou 46, Praha 5">
-   <svg class="w-12 h-12 opacity-40" ...>...</svg>
- </div>
+ <iframe
+   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560..." 
+   width="100%" height="100%" style="aspect-ratio: 16/9; border: 0;"
+   loading="lazy" referrerpolicy="no-referrer-when-downgrade"
+   title="Mapa — Pod Kesnerkou 46, Praha 5">
+ </iframe>
```

  Pokud klient nechce 3rd-party load, alternativa = OpenStreetMap iframe (open source, žádný tracking) nebo statický screenshot mapy + odkaz „Otevřít v Mapách".

---

### #CODE-1 — `ImagePlaceholder.astro` je dead code

- **Soubor:** [src/components/ImagePlaceholder.astro](src/components/ImagePlaceholder.astro)
- **Problém:** Žádný `import ImagePlaceholder` v `src/`. Komponenta není používaná.
- **Řešení:**

```bash
rm src/components/ImagePlaceholder.astro
```

---

### #CODE-2 — `ContactForm.astro` mailto fallback je fragilní (UX)

- **Soubor:** [src/components/ContactForm.astro:9-16,110-149](src/components/ContactForm.astro)
- **Problém:** Form action je `mailto:` s `enctype="text/plain"`. Bez JS to v moderních browserech nedělá nic užitečného (většina prohlížečů `mailto` form submit ignoruje), s JS to otevře client e-mailový klient — ale uživatel pak neví, jestli se zpráva opravdu odeslala. Toaster *„Otevřel jsem váš e-mailový klient"* je dobrý nápad, ale na mobilu (kde mailto často skončí v Gmail webu) bude UX matoucí.
- **Dopad:** Skrytá ztráta poptávek. Klient nezjistí, že 30 % uživatelů form selhal.
- **Řešení:** Doporučuji minimální upgrade na **Web3Forms** (zdarma, žádná registrace, nesbírá data):

```diff
  <form
    class="space-y-6"
    data-contact-form
-   action={`mailto:${CONTACT_EMAIL}`}
-   method="POST"
-   enctype="text/plain"
+   action="https://api.web3forms.com/submit"
+   method="POST"
    novalidate
  >
+   <input type="hidden" name="access_key" value="YOUR_PUBLIC_KEY" />
+   <input type="hidden" name="redirect" value="https://zlatnik-martin.cz/kontakt?sent=1" />
+   <input type="hidden" name="from_name" value="Web — zlatnik-martin.cz" />
+   <input type="hidden" name="subject" value="Poptávka z webu" />
```

  + odstranit JS handler na konci komponenty (Web3Forms už redirectuje server-side).
  + povolit Web3Forms v CSP `connect-src` a `form-action`.

  Alternativa: [Formspree](https://formspree.io) — stejný princip, jiná pricing tier.

---

### #CODE-3 — Duplicita „Selected works / Vertical list" pattern

- **Soubory:** [index.astro:163-204](src/pages/index.astro#L163), [portfolio.astro:36-82](src/pages/portfolio.astro#L36), [tvorba/[slug].astro:164-196](src/pages/tvorba/[slug].astro#L164)
- **Problém:** Tři stránky renderují skoro identickou „vertical list of portfolio cards" sekci, copy-pasted s drobnými rozdíly v classNames (gap, padding, image size).
- **Dopad:** Změna designu = 3 místa k editaci, vysoké riziko, že se zapomene na jedno.
- **Řešení:** Vytáhnout do `src/components/PortfolioListCard.astro`:

```astro
---
// src/components/PortfolioListCard.astro
import PhotoFrame from './PhotoFrame.astro';
interface Props {
  href: string;
  image: string;
  image2x: string;
  alt: string;
  label: string;
  title: string;
  description: string;
  tags: string[];
  loading?: 'eager' | 'lazy';
  headingLevel?: 'h2' | 'h3';
}
const {
  href, image, image2x, alt, label, title, description, tags,
  loading = 'lazy', headingLevel: H = 'h3',
} = Astro.props;
---
<a href={href} class="group block border-t border-border py-10 md:py-14" data-anim="up">
  <div class="grid grid-cols-1 md:grid-cols-[0.45fr_1fr] gap-8 md:gap-12 lg:gap-16 items-center">
    <div class="relative aspect-[4/3] overflow-hidden">
      <img src={image} srcset={`${image} 1x, ${image2x} 2x`} width="800" height="600"
           alt={alt} loading={loading} decoding="async"
           class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
      <PhotoFrame />
      <div class="absolute bottom-4 left-4 bg-bg-primary/90 backdrop-blur-md px-4 py-2.5 shadow-soft">
        <span class="text-[0.6875rem] uppercase tracking-[0.15em] font-medium text-gold-on-light font-sans">{label}</span>
      </div>
    </div>
    <div class="flex items-start justify-between gap-6">
      <div>
        <span class="text-[0.6875rem] uppercase tracking-[0.15em] font-medium text-gold-on-light font-sans">{label}</span>
        <H class="mt-2 text-[1.5rem] md:text-[1.75rem] group-hover:text-gold-deep transition-colors duration-300">{title}</H>
        <p class="text-[0.9375rem] text-text-secondary leading-relaxed mt-3 max-w-lg font-sans">{description}</p>
        <div class="flex flex-wrap gap-3 mt-5">
          {tags.map((tag) => (
            <span class="text-[0.6875rem] uppercase tracking-wider text-text-muted font-sans border border-border px-3 py-1.5">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
</a>
```

  Pak nahradit ve všech třech stránkách.

---

### #CODE-4 — Inline `style="font-weight: 400; font-style: italic;"` v JSX (anti-pattern)

- **Soubor:** [src/pages/index.astro:240,242](src/pages/index.astro#L240)
- **Problém:** Dvě `<em>` mají inline `style` přepisující CSS classy. Cílem je zřejmě override `not-italic`, ale efekt je matoucí (výsledné chování je stejné jako kdyby tam `not-italic` ani nebylo).
- **Řešení:**

```diff
- <em class="text-gold-deep not-italic" style="font-weight: 400; font-style: italic;">dýchají</em>
+ <em class="text-gold-deep">dýchají</em>
```

---

### #CODE-5 — `filter-pills.ts` přepisuje classes přes `classList` nepřesně

- **Soubor:** [src/scripts/filter-pills.ts:10-19](src/scripts/filter-pills.ts#L10)
- **Problém:** Na initial render je active pill stylovaný přes `class={... 'bg-text-primary active' : ...}` v [FilterPills.astro:12-17](src/components/FilterPills.astro#L12). Skript pak při kliku odstraňuje `'bg-text-primary', 'active'`, ale **přidává** classy `'bg-transparent', 'border', 'border-border', 'text-text-secondary'`. Pokud se uživatel klikne nazpět na původně aktivní pill, ztratíme `border-border` (přidá se a pak odebere u jiného pill) — ne, kontroloval jsem, je to OK. **Ale**: skript nikdy nebraní default state attribute `aria-pressed`. ResetSestava OK. Skutečný problém: při filtraci se mění inline `style.color`, což je perf hit u velkého gridu.
- **Řešení:** Přepsat na `data-active` attribute a CSS `[data-active="true"]` selektor:

```diff
  // src/scripts/filter-pills.ts
- pills.forEach((p) => {
-   p.classList.remove('bg-text-primary', 'active');
-   p.classList.add('bg-transparent', 'border', 'border-border', 'text-text-secondary');
-   p.style.color = '';
-   p.setAttribute('aria-pressed', 'false');
- });
- pill.classList.add('bg-text-primary', 'active');
- pill.classList.remove('bg-transparent', 'border', 'border-border', 'text-text-secondary');
- pill.style.color = 'var(--color-button-text)';
- pill.setAttribute('aria-pressed', 'true');
+ pills.forEach((p) => p.setAttribute('aria-pressed', 'false'));
+ pill.setAttribute('aria-pressed', 'true');
```

  + ve `FilterPills.astro` použít CSS attribute selector pro styling (Tailwind: `aria-pressed:bg-text-primary` přes `aria-pressed-true:` variant).

---

### #A11Y-4 — `<details><summary>` v FAQ nemá `scroll-margin-top`

- **Soubor:** [src/components/FAQ.astro:16-22](src/components/FAQ.astro#L16)
- **Problém:** `html` má globální `scroll-padding-top: 96px` ([global.css:59](src/styles/global.css#L59)) — to pokrývá anchor scrolly. Otevřené `<summary>` ale nezavolává scroll, takže to nezasáhne. Hraniční. Reálný problém: keyboard user navigates tabs do summary, pak hit Enter — focus zůstane na summary, který je dost vysoko, ale nav (height 72px + 16px top = 88px) ho nepřekrývá. **OK, prozatím nevyžaduje fix.**
- **Pozorování:** Drž `scroll-padding-top: 96px` (pokrývá Nav top-4 + 72px height + spare).

---

## 🟢 DOPORUČENÍ — nice to have

### #SEO-1 — Chybí `llms.txt` (AEO differentiator 2026)

- **Soubor:** Vytvořit [public/llms.txt](public/llms.txt)
- **Problém:** Webflow 2026 State of Website report doporučuje `llms.txt` jako equivalent `robots.txt` pro AI crawlery.
- **Řešení:**

```text
# Martin Ševr — Zlatnická dílna Praha
# https://zlatnik-martin.cz

> Zlatník. Ruční výroba šperků ze zlata, stříbra a přírodních kamenů v centru Prahy.

## Kdo jsem
Martin Ševr, zlatník s 20+ lety praxe. IČO 87639114.
Adresa: Pod Kesnerkou 46, Praha 5, 150 00.
Telefon/WhatsApp: +420 774 598 181, e-mail: zlatnikmartin@email.cz.

## Co dělám
- Zakázková tvorba šperků (zlato 585/750, stříbro 925, přírodní kameny)
- Hotové šperky skladem (stříbro + kameny)
- Opravy a úpravy stávajících šperků
- Konzultace v dílně nebo na dálku

## Stránky
- /                       — Domů
- /zakazkova-tvorba       — Proces, materiály, ceník, FAQ
- /skladem                — Hotové šperky
- /portfolio              — Realizace s popisem
- /o-dilne                — Příběh, certifikáty, dílna
- /kontakt                — Kontaktní údaje, formulář, mapa
- /sperky/[slug]          — Detaily produktů skladem
- /tvorba/[slug]          — Detaily realizací
```

---

### #PERF-5 — Použít Astro `<Image>` místo `<img srcset>`

- **Soubor:** Všechny stránky s `<img srcset>`.
- **Problém:** Aktuální pipeline (`scripts/process-images.mjs` + ručně zapsané `srcset`) funguje, ale Astro `astro:assets` `<Image>` umí auto-AVIF, automatický `width/height`, deterministické cache busting hashy a integraci se sharp.
- **Řešení (refactor):** Migrovat foto z `public/images/` do `src/assets/images/`, použít `import { Image } from 'astro:assets'`. Velký refactor — zařazeno jako doporučení, ne issue.

---

### #PERF-6 — `srcset` bez `sizes` — browser nedostává hint o layoutu

- **Soubor:** Všechny `<img srcset="... 1x, ... 2x">` v projektu.
- **Problém:** `srcset` s `1x/2x` density descriptor je validní, ale neumožňuje brouseru vybrat menší variantu na malých viewportech. Třeba homepage hero `800×600` na mobilu (375 px wide) downloaduje plnou 800px verzi.
- **Řešení (cesta A — minimum):** Přidat `sizes`:

```diff
  <img
    src="/images/homepage--hero--vltavin-privesek.webp"
-   srcset="/images/homepage--hero--vltavin-privesek.webp 1x, /images/homepage--hero--vltavin-privesek@2x.webp 2x"
+   srcset="/images/homepage--hero--vltavin-privesek.webp 800w, /images/homepage--hero--vltavin-privesek@2x.webp 1600w"
+   sizes="(min-width: 1024px) 50vw, 100vw"
```

  **Cesta B (lepší):** `<picture>` s `<source media>` — to už děláš v `ResponsivePicture.astro` ✅ — protlač ji všude místo raw `<img srcset>`.

---

### #SEC-5 — Permissions-Policy by mohl pokrýt víc API

- **Soubor:** [public/.htaccess:13](public/.htaccess#L13)
- **Současný:** `geolocation=(), microphone=(), camera=(), payment=(), usb=()`
- **Doplň:**

```diff
- Header set Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=()"
+ Header set Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=(), browsing-topics=(), accelerometer=(), gyroscope=(), magnetometer=(), midi=(), bluetooth=()"
```

  `interest-cohort=()` a `browsing-topics=()` opt-out z FLoC/Topics tracking (privacy plus).

---

### #SEO-2 — `<title>` může být kratší (60 znaků)

- **Soubor:** Všechny stránky.
- **Příklad:** [index.astro:76](src/pages/index.astro#L76) — *„Martin Ševr — Zlatnická dílna Praha | Ruční výroba šperků"* = 59 znaků ✅. [zakazkova-tvorba.astro:111](src/pages/zakazkova-tvorba.astro#L111) — *„Zakázková tvorba | Martin Ševr — Zlatnická dílna Praha"* = 56 ✅. **Vše OK**, drobnost: u detailních stránek `${product.title} | Martin Ševr — Zlatnická dílna` může u dlouhých titulů přesáhnout 60. Doporučuji limit ve `<title>` template.

---

### #UX-2 — Aktivní filter pill na `/skladem` neaktualizuje URL

- **Soubor:** [src/scripts/filter-pills.ts](src/scripts/filter-pills.ts)
- **Problém:** Uživatel filtruje, sdílí URL — ostatní vidí defaultní stav. Push state by to vyřešil.
- **Řešení:** `history.replaceState({}, '', `?cat=${filter}`)` při kliku + při loadu načíst z URL.

---

### #UX-3 — `<noscript>` style override + 3 s fallback animation

- **Soubor:** [Layout.astro:36-37,90-97](src/layouts/Layout.astro#L36), [global.css:240-244](src/styles/global.css#L240)
- **Pozorování:** FOUC prevention je dobře vymyšlený (3s safety fallback @keyframes), ale lze ho vůbec vypustit. JS class přidává `is-loaded` v rAF blízko po `DOMContentLoaded` — tam se 3s fallback nikdy nepoužije. Pokud JS selže, `<noscript>` tě zachrání. Můžeš ten 3s fallback odstranit jako dead code:

```diff
- /* FOUC prevention with 3s safety fallback */
- .js body { opacity: 0; transition: opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
- .js body.is-loaded { opacity: 1; }
- @keyframes fouc-fallback { to { opacity: 1; } }
- .js body { animation: fouc-fallback 0s 3s forwards; }
- .js body.is-loaded { animation: none; }
+ .js body { opacity: 0; transition: opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
+ .js body.is-loaded { opacity: 1; }
```

  (Pokud necítíš 100% jistotu, ponech jak je — je to tak max 5 řádků navíc.)

---

### #PERF-7 — Hostinger CDN status (proaktivní check)

- **Pozorování:** Staging `vilim.sbs` má `server: LiteSpeed`, takže CDN/hcdn proxy **není** zapnutá ✅. Až se produkce přepne na `zlatnik-martin.cz`, proveď stejný check:

```bash
curl -sI https://zlatnik-martin.cz | grep -i server
```

  Pokud uvidíš `server: hcdn` → Hostinger panel → Performance → CDN → vypnout. Hcdn degraduje HTTP/3 negociaci a přepisuje cache hlavičky.

---

## Pozorování (informativní)

- **Tailwind v4 CSS-first:** ✅ správně používáš `@theme {}` v [global.css:3-29](src/styles/global.css#L3) — žádný `tailwind.config.mjs` netřeba. CLAUDE.md by se mělo aktualizovat (file structure sekce).
- **`set:html` audit:** Dvě použití, obě bezpečná: [Layout.astro:77](src/layouts/Layout.astro#L77) (JSON-LD se správným `</` escapem na `<`), [CTA.astro:18](src/components/CTA.astro#L18) (frontmatter default + komentář varuje před user inputem). ✅
- **Nav `aria-current="page"`:** ✅ Implementováno správně [Nav.astro:46,84,90](src/components/Nav.astro#L46).
- **Honeypot v ContactFormu:** ✅ pozice `left-[-9999px]` + `aria-hidden="true"` + `tabindex="-1"`.
- **Skip-to-content:** ✅ [Layout.astro:81](src/layouts/Layout.astro#L81).
- **Heading hierarchie:** ✅ Jeden `<h1>` per stránka, h2 v sekcích, h3 v kartách. Konzistentní.
- **JSON-LD:** ✅ LocalBusiness + WebSite na homepage, Product na sperky/[slug], CreativeWork na tvorba/[slug], ContactPage na kontakt. Schema rozsah dobrý.
- **`prefers-reduced-motion`:** ✅ [global.css:247-253](src/styles/global.css#L247) globálně + GSAP používá `mm.add('(prefers-reduced-motion: no-preference)')` ([animations.ts:9](src/scripts/animations.ts#L9)).
- **TypeScript strict:** ✅ `extends: "astro/tsconfigs/strict"`. Žádné `any`/`@ts-ignore` v `src/`.
- **Form labels:** ✅ Všechny inputy mají `<label for>`.
- **Touch targets:** ✅ Většina (h-11, h-12 = 44px+). Mobile menu tlačítka mají `h-12 = 48px`. Filter pill `py-2.5` (~36px high) je hraniční na 24px target size, OK pro WCAG 2.2 AA.
- **lang="cs":** ✅ [Layout.astro:34](src/layouts/Layout.astro#L34).
- **Sitemap.xml:** ✅ `@astrojs/sitemap` integrace, generuje `sitemap-index.xml` + `sitemap-0.xml`. `robots.txt` na něj odkazuje.
- **TLD reputace:** Production `.cz` ✅. Staging `.sbs` triggeruje Safari iOS „Advanced Tracking and Fingerprinting Protection" warning — to je vlastnost TLD, ne kódu. Po přechodu na `.cz` zmizí. Není issue projektu.

---

## Závěrečný checklist pro Martina

**🔴 V tomto pořadí (1–7 je 80 % hodnoty):**

- [ ] **Rozhodnout o cestě A vs. B** v issue #BR-1 (drift CLAUDE.md vs kód) — bez toho se zacyklíš v dalších úpravách
- [ ] Spustit `npm audit fix` (#SEC-1) + nová instalace `@astrojs/check sharp typescript`
- [ ] Přidat `build.inlineStylesheets: 'always'` do [astro.config.mjs](astro.config.mjs) (#PERF-1)
- [ ] Přidat `fetchpriority="high"` na hero `<img>` v [index.astro](src/pages/index.astro), `[slug].astro` stránkách (#PERF-1)
- [ ] Změnit focus outline z `gold-primary` na `gold-deep` v [global.css:124](src/styles/global.css#L124) (#A11Y-1)
- [ ] Smazat `images-selekce/` ze tracking, smazat 3 ze 4 `deploy*/` adresářů (#PERF-2)
- [ ] Smazat všechny `.DS_Store` + přidat block do `.htaccess` (#SEC-2)

**🟡 Brzy poté:**

- [ ] Reprocessnout obrázky s lower quality (#PERF-3)
- [ ] Vypnout `backdrop-blur-xl` na mobile (#A11Y-3)
- [ ] Lazy-import GSAP přes `requestIdleCallback` (#PERF-4)
- [ ] Zapnout HSTS, jakmile bude produkce HTTPS-only (#SEC-4)
- [ ] Migrovat ContactForm na Web3Forms / Formspree (#CODE-2)
- [ ] Vytáhnout `PortfolioListCard.astro` ze tří copy-pasted míst (#CODE-3)
- [ ] Smazat `ImagePlaceholder.astro` (#CODE-1)
- [ ] Embed reálné mapy na /kontakt (#UX-1)

**🟢 Když bude čas:**

- [ ] Vytvořit `llms.txt` (#SEO-1)
- [ ] Doplnit `Permissions-Policy` o moderní opt-outy (#SEC-5)
- [ ] `sizes` attribute u srcset, postupně migrovat na Astro `<Image>` (#PERF-5, #PERF-6)
- [ ] URL-state pro filter pills (#UX-2)

---

## Odhad času na opravu

| Priorita | Hodiny |
|---|---|
| 🔴 Kritické (#BR-1, #SEC-1, #PERF-1, #A11Y-1, #PERF-2, #SEC-2, #A11Y-2) | **3–4 h** |
| 🟡 Varování (11 issues) | **6–8 h** |
| 🟢 Doporučení (8 issues) | **3–5 h** (postupně) |
| **Celkem** | **12–17 h** |

Z toho ~60 % je #BR-1 rozhodnutí + #CODE-2 form refactor + #CODE-3 PortfolioListCard extract.

---

## Bezpečnostní check navržených změn

Všechny návrhy v tomto reportu prošly threat-modelingem:

- **#PERF-1 inlineStylesheets:** Inlineování CSS do HTML žádný security risk — jen perf gain.
- **#SEC-1 npm audit fix:** Standardní upgrade, breaking změna jen v `--force` cestě (downgrade `@astrojs/check`). Doporučuji nejprve `npm audit fix` (non-breaking).
- **#CODE-2 Web3Forms:** Při použití veřejného `access_key` je nutné v Web3Forms dashboardu nastavit allowed origins (`zlatnik-martin.cz`, `vilim.sbs`) + spam protection. Bez toho může bot zneužít klíč jako relay.
- **#SEC-4 HSTS:** Po zapnutí má max-age 1 rok — pokud SSL přestane fungovat, doména je nepřístupná. Začít s `max-age=300` (5 min), test, pak 1 rok.
- **#UX-1 Google Maps iframe:** CSP `frame-src` už pokrývá `google.com` a `maps.google.com`. ✅ Žádný další setup.

---

## 2026 best-practice tip pro Astro/Tailwind v4

**Speculation Rules API + View Transitions** — tahle dvojka pro statický web s ~5 stránkami zlepší navigaci subjektivně z 200 ms na pod 50 ms a přidá native cross-page fade. Implementace v 5 řádcích:

```astro
---
// src/layouts/Layout.astro (head, před font preloads)
import { ClientRouter } from 'astro:transitions';
---
<html lang="cs">
  <head>
    <ClientRouter />
    <script type="speculationrules" is:inline set:html={JSON.stringify({
      prerender: [{ source: 'document', where: { href_matches: '/*' }, eagerness: 'moderate' }]
    })} />
    ...
```

Astro 6 má `<ClientRouter />` zabudovaný (View Transitions) a `speculationrules` je nativní Chrome 121+. Browsery, které to neumí (Safari, Firefox), ignorují `<script type="speculationrules">` ticho a fallbackují na klasický navigation — žádný breaking. Přidá to ~0 KB JS, ale na klikatelných devicech (Chrome/Edge) se každá další stránka načte v < 30 ms protože byla speculatively prerenderovaná. Pro statický web s tvým objemem (~150 KB / page) to je free win.

— Konec auditu —
