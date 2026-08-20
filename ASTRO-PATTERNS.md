# Astro — Patterns & Lessons Learned

Reference dokument pro Astro static weby. Konsoliduje vzory, decisions a pitfally ze stávajících projektů. **Použij jako baseline pro každý nový Astro projekt.**

Stack: Astro 6 + Tailwind CSS v4 (CSS-first) + GSAP + Sharp + self-hosted WOFF2 fonty + Astro sitemap.

---

## 0. Zlatá pravidla (lessons learned — nejdřív tohle)

1. **`overflow-hidden` na rodiči láme `position: sticky`.** Pokud uvnitř sekce potřebuješ sticky element (např. detail produktu — text vlevo scrolluje, foto vpravo sticky), použij `overflow-clip` místo `overflow-hidden`.
2. **GSAP `data-anim` na sticky elementu láme sticky.** GSAP aplikuje `transform` které vytváří containing block. Animaci dej na **vnitřní element**, ne na sticky wrapper.
3. **V CSS Gridu pro sticky grid item potřebuješ `align-self: start`** (Tailwind: `lg:self-start`). Bez toho je item stretched na výšku řádku a sticky nemá kam se chytit.
4. **Pro `object-cover` ořezávání: source foto musí mít stejný aspect ratio jako container**, jinak se ořeže obsah. Šperky 1000×1000 v `aspect-[4/3]` s `object-cover` = ořezaná 25 % výšky. Buď přeřež zdroje na 3:2 / 4:3 / 16:9, nebo použij `object-contain` + cream bg.
5. **`fixed bottom-0` element (cookie banner) překrývá patičku.** Při zobrazení banneru přidej `padding-bottom` k `<body>` o výšce banneru, jinak footer linky nejdou kliknout.
6. **`pointer-events-none` nestačí — použij `invisible`** pro fixed elementy v hidden stavu. Robustnější napříč prohlížeči.
7. **NavOverlay konzistence.** Pokud má hlavní web nav floatující nad hero (`navOverlay` prop), použij to na **každé** stránce s hero — jinak Layout přidá spacer a stránka se rozsesedne.
8. **Image source = 1× hodnota, ne 2×.** Když fotka je 1200×800, `width="1200" height="800"`. Lhaní v rozměrech láme `sizes`/responsive hint.
9. **`max-w` kapuj na kartu, ne na grid wrapper.** Když uživatel chce menší karty, neúvádej grid do úzkého sloupce (vypadá ošklivě) — dej `max-w-[520px] mx-auto` na samotnou kartu.
10. **Nikdy nepoužívej `data-anim="up"` přímo na grid container.** Stagger jde na container (`data-anim="stagger"`), animace na děti (`data-anim-child`). Jiné kombinace dělají divné věci.

---

## 1. Stack & Setup

### package.json (klíčové dependency)
```json
{
  "dependencies": {
    "astro": "^6.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "gsap": "^3.12.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "sharp": "^0.33.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "images": "node scripts/process-images.mjs"
  }
}
```

### astro.config.mjs
```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://example.com',
  build: {
    inlineStylesheets: 'always',  // CSS inlined → žádný render-blocking <link>
  },
  vite: { plugins: [tailwindcss()] },
});
```

### tsconfig.json
```json
{ "extends": "astro/tsconfigs/strict" }
```

---

## 2. Color System (Tailwind v4 CSS-first)

**Žádný `tailwind.config.mjs`.** Vše v `src/styles/global.css` přes `@theme {}`.

### Vzor: warm cream paleta s gold akcentem

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Backgrounds */
  --color-bg-primary: #F1EEE5;        /* warm cream — base */
  --color-bg-secondary: #E7E1D6;      /* one stop deeper */
  --color-bg-tertiary: #E7E1D6;

  /* Text — všechny WCAG AA na bg-primary */
  --color-text-primary: #1E1B18;
  --color-text-secondary: #5F5A54;    /* 7.5:1 AAA */
  --color-text-muted: #6B665E;        /* 5.3:1 AA — jen labels uppercase 10-13px */

  /* Accent — gold */
  --color-gold-primary: #C6A85A;      /* dekorativní (pozadí, dot) — NIKDY jako text na světlém */
  --color-gold-soft: #E8D7A8;
  --color-gold-deep: #7B6529;         /* 4.9:1 — text accent + focus ring */
  --color-gold-on-light: #726025;     /* 5.1:1 — links, labels */

  /* UI utility */
  --color-button-text: #FAFBF8;
  --color-border: #E5DFD6;
  --color-divider: #EDE7DD;
  --color-error: #B64536;
  --color-success: #4F6F5E;
  --color-hover-bg: #EAE4DA;
  --color-hover-gold: #B8963A;
}
```

### Pravidla paletty (přiměřená luxusní značce)

- **70 % bg-primary, 5 % gold accent, 5 % text-muted/labels, 20 % text + photos.**
- `gold-primary` **NIKDY** jako text na světlém pozadí — použij `gold-deep` (4.9:1) nebo `gold-on-light` (5.1:1).
- `gold-primary` OK jako: dekorativní pozadí, label-dot, gradient overlay, hover bg.
- `text-muted` (5.3:1) **jen** pro labels/meta 10–13 px s `letter-spacing ≥ 0.1em` a `font-medium`/uppercase. Pro běžný odstavec použij `text-text-secondary`.
- Žádné dark sekce, žádný dark hero. Konzistentně light & warm.

### OKLCH alternativa (doporučeno pro nové projekty)

Tailwind v4 podporuje OKLCH a je to lepší pro:
- Konzistentní perceptual lightness (kontrast snadnější vyladit)
- Wider gamut pro P3 monitors
- Lepší interpolaci v gradientech

```css
@theme {
  --color-bg-primary: oklch(0.94 0.012 80);   /* L 0.94, lehce teplá */
  --color-text-primary: oklch(0.20 0.008 60);
  --color-gold-deep: oklch(0.50 0.08 75);     /* approx 4.9:1 na bg-primary */
}
```

Pro reference [oklch.com](https://oklch.com).

---

## 3. Typography

### Self-hosted WOFF2 fonts (NE Google CDN — privacy + výkon)

```html
<!-- Layout.astro <head> -->
<link rel="preload" href="/fonts/GeneralSans-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/GeneralSans-Medium.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/PlayfairDisplay-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/PlayfairDisplay-Italic.woff2" as="font" type="font/woff2" crossorigin />
```

```css
@theme {
  --font-serif: "Playfair Display", Georgia, serif;
  --font-sans: "General Sans", system-ui, -apple-system, sans-serif;
}

@font-face {
  font-family: "Playfair Display";
  src: url("/fonts/PlayfairDisplay-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
/* + Italic variant, + General Sans Regular/Medium */
```

### Fluid type scale (clamp)

```css
h1, h2, h3, h4 {
  font-family: var(--font-serif);
  font-weight: 400;
  color: var(--color-text-primary);
  text-wrap: balance;
}

h1 { font-size: clamp(2rem,    1.3rem + 2.8vw, 4rem);    line-height: 1.15; letter-spacing: -0.02em; }
h2 { font-size: clamp(1.5rem,  1rem   + 2vw,   3rem);    line-height: 1.15; letter-spacing: -0.02em; }
h3 { font-size: clamp(1.15rem, 1rem   + 0.7vw, 1.5rem);  line-height: 1.25; }
h4 { font-size: clamp(1rem,    0.95rem + 0.25vw, 1.25rem); line-height: 1.35; }

/* Italic accent — gold */
h1 em, h2 em, h3 em {
  font-weight: 400;
  font-style: italic;
  color: var(--color-gold-deep);
}

/* Body utility classes */
.body-lg { font-size: clamp(1rem,    0.9rem  + 0.4vw, 1.125rem); line-height: 1.6; }
.body-md { font-size: clamp(0.875rem, 0.8rem + 0.25vw, 0.9375rem); line-height: 1.65; }
```

### `.prose` pro text-heavy stránky (privacy, podmínky)

```css
.prose {
  font-size: clamp(0.9375rem, 0.875rem + 0.25vw, 1rem);
  line-height: 1.75;
  color: var(--color-text-secondary);
}
.prose p { margin-bottom: 1em; }
.prose p:last-child { margin-bottom: 0; }
.prose p strong { color: var(--color-text-primary); font-weight: 500; }

.prose h2 {
  margin-top: clamp(3rem, 5vw, 4.5rem);
  margin-bottom: 0.75em;
  scroll-margin-top: 6rem;  /* pro anchor links — nepřebije fixed nav */
}
.prose h2:first-child { margin-top: 0; }

.prose h3 {
  margin-top: clamp(2rem, 3vw, 2.5rem);
  margin-bottom: 0.5em;
  color: var(--color-text-primary);
}

.prose ul {
  list-style: none;
  margin: 0 0 1.25em 0;
  padding: 0;
}
.prose ul li {
  position: relative;
  padding-left: 1.5em;
  margin-bottom: 0.5em;
}
.prose ul li::before {
  content: '';
  position: absolute;
  left: 0.25em; top: 0.75em;
  width: 6px; height: 6px;
  border-radius: 50%;
  background-color: var(--color-gold-primary);
}
```

### Link styling (gold underline)

```css
.prose a, p a {
  color: var(--color-gold-on-light);
  text-underline-offset: 3px;
  text-decoration: underline;
  text-decoration-color: var(--color-gold-soft);
  transition: text-decoration-color 0.2s;
}
.prose a:hover, p a:hover {
  text-decoration-color: var(--color-gold-on-light);
}
```

---

## 4. Section Spacing (klíčový vzor pro konzistenci)

**Definuj tokens v `@theme` a používej je v utility třídách. Žádné ad-hoc `py-20`.**

```css
@theme {
  /* Section vertical rhythm */
  --space-section-sm: clamp(3rem, 6vw,  4.5rem);   /* 48 → 72px — utility */
  --space-section-md: clamp(4rem, 8vw,  6rem);     /* 64 → 96px — standard */
  --space-section-lg: clamp(5rem, 10vw, 8rem);     /* 80 → 128px — narrative/CTA */

  /* Hero spacing */
  --space-hero-top: clamp(9.5rem, 8rem + 4vw, 11.5rem);  /* 152 → 184px (visible 64 → 96px after nav) */
  --space-hero-bot: clamp(4rem, 8vw, 6rem);              /* 64 → 96px */
}

.section-sm   { padding-block: var(--space-section-sm); }
.section-md   { padding-block: var(--space-section-md); }
.section-lg   { padding-block: var(--space-section-lg); }
.section-hero { padding-top: var(--space-hero-top); padding-bottom: var(--space-hero-bot); }
```

### Standard section wrapper pattern

```astro
<section class="relative bg-bg-primary border-b border-border section-md overflow-hidden">
  <div class="radial-overlay"></div>
  <div class="relative max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-14">
    <div class="max-w-3xl" data-anim="up">
      <!-- content -->
    </div>
  </div>
</section>
```

- `relative` + `overflow-hidden` → containment pro `.radial-overlay`
- `border-b border-border` → jemná oddělovací linka mezi sekcemi
- `max-w-[1400px] mx-auto` → outer container, centrovaný
- `px-6 sm:px-8 lg:px-14` → konzistentní horizontální padding (24/32/56px)
- `max-w-3xl` (768px) → inner content width pro pohodlné čtení

### Radial overlay (jemný depth bez nutnosti backgroundu)

```css
.radial-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(circle at top left,     rgba(198,168,90,0.06), transparent 34%),
    radial-gradient(circle at bottom right, rgba(30,27,24,0.04),   transparent 28%);
}
```

### Section sequence template

```
Hero (section-hero) → Body sections (section-md) → CTA (section-lg) → Footer
```

Mezi sekcemi cream → secondary cream → cream → secondary cream → primary bg footer. Drobné alternování bg dá rytmus bez výraznosti.

---

## 5. Layout pattern (Nav + Footer + navOverlay)

### Layout.astro signatura
```ts
interface Props {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  jsonLd?: object;
  /** true = nav pluje nad první sekcí (bez 96px spaceru). První sekce si musí zajistit vlastní padding-top. */
  navOverlay?: boolean;
}
```

### Konzistence pravidlo:

**Pokud má jakákoli stránka `navOverlay`, musí ho mít VŠECHNY stránky s hero.** Jinak Layout přidá spacer a stránky vypadají rozsesedlé.

### Nav (sticky pill design)
```astro
<header class="fixed top-4 inset-x-0 z-50 px-4 sm:px-5">
  <div class="max-w-[1400px] mx-auto">
    <nav class="relative flex items-center justify-between h-[72px] px-2 sm:px-3 lg:px-4 rounded-full border border-border/75 bg-bg-primary/96 sm:bg-bg-primary/88 sm:backdrop-blur-md shadow-float">
      <!-- logo + links + CTAs -->
    </nav>
  </div>
</header>
```

---

## 6. Responsive Design Patterns

### Breakpointy (Tailwind defaults)
- `sm`: 640px — mobil portrait → tablet portrait
- `md`: 768px — tablet
- `lg`: 1024px — desktop
- `xl`: 1280px — wide desktop

### Card grid pattern
```html
<!-- 1 column mobile, 2 columns od lg -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
```

**Nedělej `sm:grid-cols-2`** na úzkých kartách s vícesloupcovým info (cena, badge) — vypadá to stísněně. Single column až do lg.

### Photo card aspect ratio
- **Square photos (1:1 source):** card `aspect-square` + `object-cover` → fotka plní rám bez ořezu.
- **Landscape product photos (3:2 source):** `aspect-[3/2]` + `object-cover` → čisté.
- **Mix sources:** `object-contain` + `bg-bg-primary` fallback (cream pruhy okolo).

### Card max-width strategy
```html
<!-- Cap card, ne grid wrapper -->
<a href="..." class="group flex flex-col h-full max-w-[460px] lg:max-w-[520px] mx-auto border border-border">
```

Karta se chová stejně na mobilu i desktopu (max-w-[460px] mobile + max-w-[520px] desktop), ale centrovaná v gridu.

---

## 7. Image Pipeline (Sharp)

### scripts/process-images.mjs pattern
```js
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { resolve, basename, extname } from 'path';

const SRC = 'images-selekce';  // raw 3000+px source
const OUT = 'public/images';

const sizes = {
  hero:    { w: 1920, h: 1080 },  // 16:9 fullwidth hero
  card:    { w: 800,  h: 600 },   // 4:3 card
  product: { w: 1000, h: 1000 },  // 1:1 product
  mobile:  { w: 800,  h: 1000 },  // 4:5 mobile portrait
};

// Generate 1x + @2x for each
for (const file of readdirSync(SRC)) {
  if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;
  const stem = basename(file, extname(file));
  for (const [name, { w, h }] of Object.entries(sizes)) {
    await sharp(`${SRC}/${file}`)
      .resize(w, h, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(`${OUT}/${stem}--${name}.webp`);
    await sharp(`${SRC}/${file}`)
      .resize(w * 2, h * 2, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(`${OUT}/${stem}--${name}@2x.webp`);
  }
}
```

### Standard `<img>` pattern v Astro
```astro
<img
  src={image}                              <!-- 1x baseline -->
  srcset={`${image} 1x, ${image2x} 2x`}    <!-- retina -->
  width="1200" height="800"                <!-- intrinsic — match source dimensions -->
  sizes="(min-width: 1024px) 600px, 100vw" <!-- responsive hint pro browser -->
  alt={alt}
  loading="lazy"                           <!-- eager + fetchpriority="high" pro hero -->
  decoding="async"
  class="absolute inset-0 w-full h-full object-cover"
/>
```

### Object-fit decision tree
- **Source aspect == container aspect** → `object-cover` (čistý fit)
- **Source aspect ≠ container aspect, ořezávání akceptovatelné** → `object-cover` + zvol `object-position` aby zachoval důležitou část
- **Source aspect ≠ container aspect, oříznutí NENÍ ok** → `object-contain` + `bg-bg-primary` (cream pruhy okolo)

### Folder strategy
- `public/images/` — globální obrázky generované přes `npm run images`
- `public/skladem/` — manuálně ořezané pro listing/card (pokud potřebuješ jiný aspect než hero)
- `public/skladem/karta/` — 3:2 card varianty (užší listing krat než detail)

---

## 8. Animations (GSAP + ScrollTrigger)

### Lazy load — neimportuj GSAP do main bundle

```html
<!-- Layout.astro před </body> -->
<script>
  // Skip GSAP download na stránkách bez animací (privacy, 404)
  const hasAnims = document.querySelector('[data-anim],[data-parallax],[data-animate]');
  if (hasAnims) {
    const loadAnimations = () => import('../scripts/animations.ts');
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadAnimations, { timeout: 1500 });
    } else {
      setTimeout(loadAnimations, 200);
    }
  }
</script>
```

### scripts/animations.ts — patterns

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Respect prefers-reduced-motion
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const scrollConfig = (el: HTMLElement) => ({
    trigger: el,
    start: 'top 85%',
    toggleActions: 'play none none none',
  });

  gsap.utils.toArray('[data-anim="up"]').forEach((el) => {
    gsap.from(el, { scrollTrigger: scrollConfig(el as HTMLElement), y: 40, opacity: 0, duration: 0.9, ease: 'power2.out' });
  });

  gsap.utils.toArray('[data-anim="scale"]').forEach((el) => {
    gsap.from(el, { scrollTrigger: scrollConfig(el as HTMLElement), scale: 1.04, opacity: 0, duration: 1.6, ease: 'power2.out' });
  });

  gsap.utils.toArray('[data-anim="stagger"]').forEach((parent) => {
    const children = (parent as HTMLElement).querySelectorAll('[data-anim-child]');
    gsap.from(children, {
      scrollTrigger: scrollConfig(parent as HTMLElement),
      y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
    });
  });
});
```

### Animation cheatsheet
| Attribute | Effect |
|---|---|
| `data-anim="up"` | y:40 → 0, opacity:0 → 1 |
| `data-anim="fade"` | opacity:0 → 1 |
| `data-anim="scale"` | scale:1.04 → 1, opacity:0 → 1 |
| `data-anim="stagger"` (parent) + `data-anim-child` | postupné stagger animace dětí |
| `data-anim="parallax"` | y transform on scroll |

### ⚠️ GOTCHA: GSAP transform vs position:sticky

GSAP aplikuje `transform: translate3d(...)` na element s `data-anim`. Transform na sticky elementu láme sticky chování (vytváří containing block). **Pokud potřebuješ sticky, dej `data-anim` na vnitřní element, ne na sticky wrapper:**

```astro
<!-- ❌ ŠPATNĚ -->
<div class="lg:sticky lg:top-28" data-anim="scale">
  <img src="..." />
</div>

<!-- ✅ SPRÁVNĚ -->
<div class="lg:sticky lg:top-28">
  <div data-anim="scale">
    <img src="..." />
  </div>
</div>
```

---

## 9. Sticky Position Patterns

### Detail produktu — text vlevo, sticky foto vpravo

```astro
<section class="relative bg-bg-primary border-b border-border overflow-clip">
  <!--                                                       ^^^^^^^^^^^^ NE overflow-hidden! -->
  <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
    <!-- Left — long text content -->
    <div data-anim="up">
      <h1>...</h1>
      <p>... lots of text ...</p>
    </div>

    <!-- Right — sticky photo -->
    <div class="lg:sticky lg:top-28 lg:self-start">
      <!--               ^^^^^^^^^^^ KRITICKÉ pro grid sticky -->
      <div data-anim="scale">
        <img src="..." />
      </div>
    </div>
  </div>
</section>
```

### Pravidla sticky:
1. **Section parent musí být `overflow-clip`**, ne `overflow-hidden`. Overflow-hidden vytváří scroll container který láme sticky.
2. **Grid item musí mít `self-start`** (Tailwind: `lg:self-start`). Bez toho je item stretched a sticky se chytí až úplně dole.
3. **Žádný transform na sticky elementu** (žádné GSAP `data-anim`). Animaci dej na vnitřní element.

---

## 10. Accessibility (WCAG 2.2 AA)

### Mandatory
- `lang="cs"` (nebo příslušný jazyk) na `<html>`
- Skip-to-content link první v `<body>`
- Semantic HTML: `<header>`, `<nav>`, `<main id="main">`, `<section>`, `<footer role="contentinfo">`
- `aria-label` na icon-only buttonech ("Otevřít menu", "Instagram")
- Form labels linkované přes `for=`/`id=`
- Touch targets ≥ 44 × 44 px (Tailwind `h-11`/`h-12`)

### Focus indicator
```css
:focus-visible {
  outline: 2px solid var(--color-gold-deep);  /* 4.9:1 kontrast — SC 1.4.11 */
  outline-offset: 2px;
}
```

### Skip-to-content
```astro
<a href="#main" class="skip-to-content">Přeskočit na obsah</a>
<main id="main" tabindex="-1" class="focus:outline-none">
```

```css
.skip-to-content {
  position: absolute;
  top: -100px; left: 16px;
  background: var(--color-text-primary);
  color: var(--color-button-text);
  padding: 12px 20px;
  z-index: 100;
}
.skip-to-content:focus { top: 16px; }
```

### Screen reader only
```css
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Reduced motion (respektovat globálně)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Image alt strategy
- Čistě dekorativní obrázky: `alt="" aria-hidden="true"`
- Funkční obrázky: popisný alt v jazyku stránky

### Color contrast checklist
Pro každý text/bg combo zkontroluj v contrast checkeru:
- Normal text ≥ 4.5:1 (AA), ≥ 7:1 (AAA)
- Large text (≥ 24px nebo ≥ 19px bold) ≥ 3:1 (AA)
- Non-text UI (border, focus, icons) ≥ 3:1

---

## 11. Performance

### CSS inlining
```js
// astro.config.mjs
build: { inlineStylesheets: 'always' }
```
→ CSS inlined do HTML, žádný render-blocking external `<link>`.

### Font preload
```html
<link rel="preload" href="/fonts/X.woff2" as="font" type="font/woff2" crossorigin />
```
Preload jen 4 nejdůležitější varianty (Regular + key Italic + Medium). Ne víc.

### FOUC prevention
```css
.js body { opacity: 0; transition: opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
.js body.is-loaded { opacity: 1; }
```
```js
// Z JS hned na začátku
document.documentElement.classList.add('js');
// Po DOM ready
document.body.classList.add('is-loaded');
```

### Lazy load images
```html
<img loading="lazy" decoding="async" ... />
```
Hero/above-the-fold: `loading="eager" fetchpriority="high"`.

### `.htaccess` (Hostinger LiteSpeed)
```apache
# Cache static assets aggressively
<FilesMatch "\.(woff2|webp|svg|jpg|jpeg|png|gif|css|js)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# HTML musí být revalidated
<FilesMatch "\.html$">
  Header set Cache-Control "public, max-age=0, must-revalidate"
</FilesMatch>

# Security headers
Header set X-Frame-Options "SAMEORIGIN"
Header set X-Content-Type-Options "nosniff"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
Header set Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com; font-src 'self';"
```

### PageSpeed cílové hodnoty (static Astro)
- Lighthouse Performance: 95+
- LCP: < 2.0s
- CLS: 0
- FID/INP: < 100ms
- TBT: < 200ms

---

## 12. GDPR / Cookies / Analytics

### Google Consent Mode v2 (povinné v EU)

```html
<!-- Layout.astro <head>, PŘED gtag.js -->
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500,
  });
  try {
    const stored = localStorage.getItem('cookie-consent');
    if (stored === 'granted') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  } catch (e) {}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });
</script>
<script is:inline async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### CookieBanner.astro pattern

```astro
<div
  id="cookie-banner"
  class="fixed bottom-0 inset-x-0 z-[100] invisible opacity-0 translate-y-4 transition-all duration-500 px-4 sm:px-6 pb-4 sm:pb-6"
  aria-hidden="true"
>
  <div class="max-w-[1100px] mx-auto bg-bg-primary border border-border shadow-soft p-5 sm:p-7">
    <!-- text + souhlasím/odmítnout buttons -->
  </div>
</div>

<script>
  const banner = document.getElementById('cookie-banner');
  const show = () => {
    banner.classList.remove('invisible', 'opacity-0', 'translate-y-4');
    document.body.style.paddingBottom = `${banner.offsetHeight + 16}px`;  // ⚠️ KRITICKÉ
  };
  const hide = () => {
    banner.classList.add('invisible', 'opacity-0', 'translate-y-4');
    document.body.style.paddingBottom = '';
  };
  // ... localStorage check + click handlers
</script>
```

### Pravidla:
1. **Default consent = denied.** Žádné cookies se neukládají dokud uživatel neklikne "Souhlasím".
2. **Použij `invisible` v hidden stavu**, ne jen `pointer-events-none` — robustnější.
3. **Při zobrazení banneru přidej `padding-bottom` k bodyu** o výšce banneru — jinak banner překryje footer linky.
4. **`anonymize_ip: true`** pro GA4.
5. **Žádné reklamní cookies** pro malé brand weby. Jen `analytics_storage`.

### Privacy policy obsah (povinné)
Viz `src/pages/ochrana-osobnich-udaju.astro` v tomto projektu — 9 sekcí dle čl. 13 GDPR:
1. Správce + kontakt
2. Účely + právní základy (rozdělené na podtypy)
3. Cookies (technické vs analytické)
4. Zpracovatelé (Hosting, GA)
5. Práva subjektu (všech 7 + ÚOOÚ)
6. Zabezpečení
7. Automatizované rozhodování
8. Děti
9. Změny zásad

---

## 13. SEO

### Sitemap vlastním endpointem (ne @astrojs/sitemap)
Integrace `@astrojs/sitemap` se v tomhle projektu **nepoužívá** — neumí
`lastmod` per stránku, `image:` tagy ani hreflang alternates v jednom souboru
a vyrábí zbytečný sitemap-index. Sitemapu proto skládá `src/lib/sitemap.ts`
a servírují ji endpointy `src/pages/sitemap.xml.ts` a `sitemap-en.xml.ts`.

```ts
// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';
import { buildSitemap } from '../lib/sitemap';

export const GET: APIRoute = () =>
  new Response(buildSitemap(), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
```

`lastmod` se bere z `git log -1 --format=%cI -- <zdroje stránky>`, ne z data
buildu — uniformní datum tvrdí „vše se změnilo dnes" a nenese žádný signál.
**Důsledek:** nikdy nebuildovat pro produkci z necommitnutého stromu.

### JSON-LD schemas v src/lib/seo.ts
```ts
export function localBusinessSchema() {
  return {
    '@type': 'LocalBusiness',
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: { '@type': 'PostalAddress', /* ... */ },
    priceRange: '$$$$',
    image: `${SITE.url}/images/og-default.jpg`,
  };
}

export function productSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: `${SITE.url}${product.image}`,
    offers: [{
      '@type': 'Offer',
      price: parsePrice(product.priceSilver),
      priceCurrency: 'CZK',
      availability: 'https://schema.org/InStock',
    }, ...],
    material: product.material,
    brand: { '@type': 'Brand', name: SITE.shortName },
  };
}
```

### Layout meta tags
```astro
<title>{title}</title>
<meta name="description" content={description} />
<meta name="theme-color" content="#F1EEE5" />
<link rel="canonical" href={canonicalUrl} />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content={ogTitle || title} />
<meta property="og:image" content={`${siteUrl}${ogImage}`} />
<meta property="og:locale" content="cs_CZ" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />

<!-- JSON-LD -->
{jsonLd && (
  <script is:inline type="application/ld+json"
    set:html={JSON.stringify(jsonLd).replace(/</g, '\\u003c')} />
)}
```
**Důležité:** Escapuj `</` v JSON-LD aby řetězec uvnitř nemohl předčasně uzavřít `<script>` tag.

### robots.txt + llms.txt
```
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap-index.xml
```

```
# public/llms.txt — AI/LLM entry point
# Site description for AI crawlers
```

---

## 14. File Structure

```
/
├── ASTRO-PATTERNS.md         # tento dokument (volitelné)
├── CLAUDE.md                 # project-specific instrukce pro Claude
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── .htaccess             # security + cache + redirects
│   ├── fonts/                # 4× WOFF2 (sans regular/medium, serif regular/italic)
│   ├── images/               # processed WebP, 1x + @2x variants
│   ├── favicon.svg, apple-touch-icon.png, site.webmanifest
│   ├── llms.txt              # AEO entry point
│   ├── robots.txt
│   └── og-default.jpg        # 1200×630 social share fallback
├── scripts/
│   └── process-images.mjs    # Sharp pipeline
├── images-selekce/           # raw source photos (gitignored if big)
└── src/
    ├── layouts/
    │   └── Layout.astro      # head, fonts, JSON-LD, nav, footer
    ├── components/
    │   ├── Nav.astro
    │   ├── Footer.astro
    │   ├── Button.astro      # variants: primary | secondary | text
    │   ├── CookieBanner.astro
    │   ├── ContactForm.astro
    │   ├── PhotoFrame.astro  # dekorativní vnitřní lemování
    │   └── ResponsivePicture.astro
    ├── pages/
    │   ├── index.astro
    │   ├── kontakt.astro
    │   ├── ochrana-osobnich-udaju.astro
    │   ├── 404.astro
    │   └── [section]/[slug].astro  # dynamic
    ├── data/
    │   ├── site.ts           # SITE konstanty (name, phone, email, address)
    │   ├── products.ts       # typed content
    │   └── portfolio.ts
    ├── lib/
    │   └── seo.ts            # JSON-LD helpers
    ├── scripts/
    │   ├── animations.ts     # GSAP scroll triggers (lazy-loaded)
    │   ├── nav.ts            # mobile menu toggle
    │   └── filter-pills.ts
    └── styles/
        └── global.css        # @import tailwindcss + @theme + base + utilities
```

### Data layer pattern (src/data/)

Vždy **typed**. Jeden export `interface XYZ` + jeden export `const items: XYZ[]`.

```ts
// src/data/products.ts
export interface Product {
  slug: string;
  title: string;
  category: 'prsteny' | 'nausnice' | 'privesky';
  // ... discriminated unions / literal types pro type safety
}
export const products: Product[] = [/* ... */];
```

### src/data/site.ts — globální konstanty

```ts
export const SITE = {
  url: 'https://example.com',
  name: 'Brand Full Name',
  shortName: 'Brand',
  description: '...',
  phone: '+420 xxx xxx xxx',
  phoneHref: 'tel:+420xxxxxxxxx',
  phoneDisplay: '+420 xxx xxx xxx',
  email: 'info@example.com',
  emailHref: 'mailto:info@example.com',
  whatsapp: 'https://wa.me/420xxxxxxxxx',
  ico: '12345678',
  address: {
    street: 'Street 1',
    city: 'Praha 5',
    postal: '150 00',
    country: 'CZ',
  },
};
```

---

## 15. Component Patterns

### Button.astro (3 variants)
```astro
---
interface Props {
  href: string;
  variant?: 'primary' | 'secondary' | 'text';
  // ...
}
const { href, variant = 'primary' } = Astro.props;

const base = 'inline-flex items-center justify-center font-sans text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300';
const variants = {
  primary:   `${base} h-12 px-8 rounded-full bg-text-primary text-button-text hover:bg-gold-deep`,
  secondary: `${base} h-12 px-8 rounded-full border border-border bg-white/80 text-text-primary hover:bg-white`,
  text:      `${base} text-text-primary hover:text-gold-deep gap-2`,
};
---
<a href={href} class={variants[variant]}>
  <slot />
  {variant === 'text' && <svg class="w-3.5 h-3.5">...</svg>}
</a>
```

### Card pattern (universal)
```astro
<a href={href} class="group flex flex-col h-full border border-border hover:border-text-muted/30 transition-all duration-300">
  <!-- Photo with hover scale -->
  <div class="relative aspect-[3/2] overflow-hidden">
    <img class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
  </div>

  <!-- Info -->
  <div class="flex-1 flex flex-col px-5 sm:px-6 py-5 sm:py-6">
    <h3 class="card-title group-hover:text-gold-deep transition-colors duration-300">{title}</h3>
    <!-- ... -->
    <div class="mt-auto pt-6 border-t border-border flex items-center justify-between">
      <span>Detail</span>
      <div class="h-10 w-10 rounded-full border border-border group-hover:bg-text-primary">
        <svg>→</svg>
      </div>
    </div>
  </div>
</a>
```

### Label-dot (small caps section indicator)
```astro
<span class="label-dot">Section name</span>
```
```css
.label-dot {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 500;
  color: var(--color-gold-on-light);
}
.label-dot::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background-color: var(--color-gold-primary);
}
```

---

## 16. Form Handling (mailto fallback / Web3Forms)

### mailto fallback (quick start, no backend)
```astro
<form action={`mailto:${SITE.email}?subject=Z%20webu`} method="post" enctype="text/plain">
  <input name="name" required />
  <textarea name="message" required></textarea>
  <button type="submit">Odeslat</button>
</form>
```

### Web3Forms (production — free up to 250/month)
```html
<form action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="YOUR-KEY" />
  <input type="hidden" name="redirect" value="https://example.com/dekujeme" />
  <input type="checkbox" name="botcheck" style="display:none;" />
  <!-- form fields -->
</form>
```

---

## 17. Deploy

### Build & test
```bash
npm run build      # → dist/
npm run preview    # local preview na 4321
```

### Hostinger FTP deploy
- Stage: `vilim.sbs` (testovací doména)
- Prod: hlavní doména

```bash
# Po smazání starého obsahu public_html/:
# Upload dist/* + dist/.htaccess do public_html/
```

### Po deployi check
1. `https://example.com` — favicon, fonts, hero photo load
2. `https://example.com/sitemap-index.xml` — XML validní
3. `https://example.com/robots.txt` — Allow + Sitemap link
4. `https://example.com/llms.txt` — pokud AEO
5. Lighthouse: 95+ Performance, 100 SEO + Accessibility
6. PageSpeed Insights (real-world): LCP < 2s, CLS = 0
7. DevTools → Network → HTTP/2 (LiteSpeed) + HTTP/3 (alt-svc header)

### Hostinger CDN gotcha
Hostinger CDN (hcdn) může degradovat HTTP/3 negociaci. Doporučeno **vypnout**, ověřit po každé migraci.

---

## 18. Common Gotchas Reference (kompletní seznam)

| Problem | Řešení |
|---|---|
| Sticky nefunguje | Změň `overflow-hidden` na `overflow-clip` na rodičovi |
| Sticky v gridu nefunguje | Přidej `lg:self-start` na grid item |
| Sticky element s GSAP animací nefunguje | `data-anim` dej na vnitřní element, ne na sticky wrapper |
| Foto je oříznuté nahoře/dole | Source 1:1 v 4:3 containeru — buď nový crop ratio nebo `object-contain` + bg |
| Cookie banner blokuje patičku | Při zobrazení banneru přidej `padding-bottom: ${bannerHeight}px` k bodyu |
| `pointer-events-none` občas neblokuje | Použij `invisible` místo |
| Footer link v `<a>` nejde kliknout | Zkontroluj fixed elementy + z-index + pointer-events |
| Heading na text page sedí těsně na předchozím | Definuj `.prose h2 { margin-top: clamp(3rem, 5vw, 4.5rem) }` |
| Subtitle wraps jinak na různých stránkách | Sjednoť `max-w-xl` / `max-w-2xl` napříč herami |
| Stránka má spacer před hero | Chybí `navOverlay` na Layout |
| Build "warning: source map" | Astro 6 občas, ignoruj nebo `vite: { build: { sourcemap: false } }` |
| `astro check` errors po type změně | Restartuj dev server + smaž `.astro/types.d.ts` cache |
| Image srcset/sizes 2× hodnota | Vždy 1× v `width`/`height`, ne 2× |
| Cookie banner v dev se nezobrazuje | Smaž `cookie-consent` v localStorage → reload |
| `data-anim` nefunguje na privacy/404 | GSAP se neloaduje na "lean" pages — viz Layout.astro |

---

## 19. Voice & Tone (pro Czech web)

- **1. osoba jednotného čísla VŽDY** (já, mé, pracuji). NIKDY "my" nebo "náš tým".
- **Klidná jistota.** Řemeslník, který nechává práci mluvit.
- **Italic Playfair pro emoci, General Sans pro fakta.**
- **Žádné vykřičníky. Žádné generické marketingové fráze.**
- **Bez emoji v copy.** Emoji jen jako label icons (✦, ◦), ne v textu.

---

## 20. Checklist pro nový Astro projekt

- [ ] `git init` + `git remote add`
- [ ] `npm create astro@latest` → static template
- [ ] Přidat `@tailwindcss/vite` (sitemapu řeší vlastní endpoint, viz § 13)
- [ ] `tsconfig.json` → `extends: astro/tsconfigs/strict`
- [ ] `astro.config.mjs` → site URL + inlineStylesheets + tailwind plugin
- [ ] `src/styles/global.css` → `@import tailwindcss; @theme { ... }`
- [ ] Stáhnout WOFF2 fonty do `public/fonts/` + `@font-face` v global.css
- [ ] Layout.astro → head + nav + footer + cookie banner + GSAP lazy loader
- [ ] `src/data/site.ts` → SITE konstanty
- [ ] `src/lib/seo.ts` → JSON-LD helpers
- [ ] `src/scripts/animations.ts` → GSAP scroll triggers
- [ ] `public/.htaccess` → cache + security headers
- [ ] `public/robots.txt` + `og-default.jpg` (1200×630)
- [ ] `scripts/process-images.mjs` → Sharp pipeline
- [ ] Privacy policy page + cookie banner + Consent Mode v2 gtag
- [ ] 404 page
- [ ] Test: `astro check` 0 errors, `npm run build` projde, Lighthouse 95+
- [ ] Deploy: FTP do staging → test → FTP do prod

---

## Verze
- Astro 6.x
- Tailwind v4.x (CSS-first)
- Updated: 2026-05-13
- Origin project: zlatnik-martin.cz
