# Zlatník Martin Ševr — Static Build (Astro)

## Quick Start
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run images   # batch-process raw photos in images-selekce/
```

## Project Goal
Build a luxury jewelry workshop presentation website. Static, no CMS, no e-commerce. Czech language first, EN later via duplicate pages. Deploy via FTP to Hostinger.

## Stack
- **Astro 6** (static output, zero JS by default)
- **Tailwind CSS v4** (CSS-first config in `src/styles/global.css` via `@theme {}` — žádný `tailwind.config.mjs`)
- **GSAP + ScrollTrigger** (scroll animations, lazy-loaded přes `requestIdleCallback`)
- **Sharp** (image pipeline ve `scripts/process-images.mjs`)
- **Self-hosted WOFF2 fonty** — Playfair Display (variable) + General Sans (Fontshare)

## Build Order (do in this sequence)
1. **Design system** — `src/styles/global.css` → `@theme {}` (Tailwind v4 je CSS-first, žádný `tailwind.config.mjs`)
2. **Base layout** — Layout.astro with head, fonts, meta
3. **Components** — Nav.astro, Footer.astro, CTA.astro, Button.astro
4. **Homepage** — section by section
5. **Zakázková tvorba** — section by section
6. **Skladem** — header + grid + CTA
7. **Portfolio** — header + cards + CTA
8. **O dílně** — all sections
9. **Kontakt** — form + map
10. **Detail pages** — /sperky/*, /tvorba/* templates
11. **GSAP animations** — scroll triggers
12. **Responsive** — tablet + mobile
13. **SEO** — meta, JSON-LD, sitemap, robots.txt

## Client Info
- **Client**: Martin Ševr, zlatník, IČO 87639114
- **Address**: Pod Kesnerkou 46, Praha 5, 150 00
- **Phone**: +420 774 598 181 (WhatsApp)
- **Email**: zlatnikmartin@email.cz
- **Designer**: Daniel Vilím / Vilim.One
- **Photographer**: Betty

## Information Architecture
Každá CZ stránka má anglické zrcadlo pod `/en/`, spárované přes `PATH_MAP`
v `src/components/LangSwitcher.astro` a hreflang v `src/lib/seo.ts`.
Nová stránka musí přibýt na OBOU stranách, jinak se rozejde jazykový přepínač.

```
/                          /en/                      Domů
/zakazkova-tvorba          /en/custom-jewelry        Zakázková tvorba
/snubni-prsteny-na-miru    /en/wedding-rings         Snubní prsteny
/retezy                    /en/chains                Královské řetězy
/opravy-sperku-praha       /en/jewelry-repair        Opravy šperků
/cisteni-sperku            /en/jewelry-cleaning      Čištění šperků
/skladem                   /en/in-stock              Skladem (listing)
/portfolio                 /en/portfolio             Portfolio (listing)
/o-dilne                   /en/about                 O dílně
/kontakt                   /en/contact               Kontakt
/ochrana-osobnich-udaju    /en/privacy               Ochrana osobních údajů
/sperky/[slug]             /en/jewelry/[slug]        Detail hotového šperku
/tvorba/[slug]             /en/work/[slug]           Detail portfolia
/404                                                 Nenalezeno
```

Sitemapy: `/sitemap.xml` (vše, s hreflang alternates) a `/sitemap-en.xml`
(jen EN podmnožina, kvůli samostatnému monitoringu indexace v GSC).

**Legacy 301** v `public/.htaccess`: `/retizky` → `/retezy/`,
`/puncovni-znacky` → `/o-dilne/` — obě adresy vracely 404, ale pořád rankovaly.

## Color Palette (LOCKED — defined in `src/styles/global.css` `@theme {}`)
```css
/* src/styles/global.css */
@theme {
  --color-bg-primary: #F1EEE5;        /* warm cream — base background */
  --color-bg-secondary: #E7E1D6;      /* one stop deeper */
  --color-bg-tertiary: #E7E1D6;
  --color-text-primary: #1E1B18;
  --color-text-secondary: #5F5A54;    /* 7.5:1 na bg-primary, AAA */
  --color-text-muted: #6B665E;        /* 5.3:1 na bg-primary, AA */
  --color-gold-primary: #C6A85A;      /* dekorativní — pozadí, dot, gradient. NIKDY jako text na světlém pozadí. */
  --color-gold-soft: #E8D7A8;
  --color-gold-deep: #7B6529;         /* 4.9:1 na bg-primary — text + italic accent + focus ring */
  --color-gold-on-light: #726025;     /* 5.1:1 na bg-primary — links, labels */
  --color-button-text: #FAFBF8;       /* světlá výplň pro tmavé buttony */
  --color-border: #E5DFD6;
  --color-divider: #EDE7DD;
  --color-error: #B64536;
  --color-success: #4F6F5E;
  --color-hover-bg: #EAE4DA;
  --color-hover-gold: #B8963A;
  --color-accent-cool: #8FA3A6;
}
```

### Palette Rules
- **text-muted (`#6B665E`, kontrast 5.3:1)** — povoleno pro labels/meta 10–13 px ZA PODMÍNKY `letter-spacing ≥ 0.1em` a `font-medium`/uppercase. Pro běžný odstavec použij `text-text-secondary`. Nikdy text-muted na bg-tertiary.
- **gold-primary** NIKDY jako text na světlém pozadí → text gold použij `gold-deep` (4.9:1) nebo `gold-on-light` (5.1:1).
- **gold-primary** OK jako pozadí dekorativních prvků (label-dot, gradient overlay, hover bg na buttonu).
- **Footer** — light (bg-primary + border-top), žádný dark footer.
- **Ratio** — 70 % bg-primary, 5 % gold accent, 5 % text-muted/labels, 20 % text + photos.
- **NO dark sections, NO dark hero.** Vše světlé a teplé.

## Typography (LOCKED — definované v `src/styles/global.css`)
- **Headings**: **Playfair Display** (self-hosted variable WOFF2, weight 400 + 400 italic, w-range 400–900). Italic varianta je separátní WOFF2 pro lepší rendering.
- **Body/UI**: **General Sans** (Fontshare, self-hosted WOFF2, weight 400 body, 500 buttons/labels).

```css
@theme {
  --font-serif: "Playfair Display", Georgia, serif;
  --font-sans: "General Sans", system-ui, -apple-system, sans-serif;
}

/* Heading sizes — fluid clamp() v global.css */
h1 { font-size: clamp(2.5rem, 5.5vw + 0.5rem, 5.2rem); line-height: 1.05; letter-spacing: -0.02em; }
h2 { font-size: clamp(1.75rem, 3.5vw + 0.25rem, 3.8rem); line-height: 1.1; letter-spacing: -0.02em; }
h3 { font-size: clamp(1.35rem, 2vw + 0.25rem, 1.75rem); line-height: 1.2; }
h4 { font-size: clamp(1.1rem, 1.2vw + 0.25rem, 1.3rem); line-height: 1.3; }

h1, h2, h3, h4 { font-family: var(--font-serif); font-weight: 400; text-wrap: balance; }
h1 em, h2 em, h3 em { font-style: italic; color: var(--color-gold-deep); }
```

## Buttons
- **Primary**: `bg-text-primary`, color via `--color-button-text`, **pill-shaped** (`rounded-full`), uppercase, `tracking-[0.2em]`, `text-[11px]`, `font-medium`, `h-12 px-6 sm:px-8`. Hover → `bg-gold-deep`.
- **Secondary**: `border border-border`, `bg-white/80`, `text-text-primary`, pill-shaped, same sizing. Hover → `bg-white`.
- **Text variant**: text-only, malá šipka SVG, `hover:text-gold-deep`.
- **Pill-shaped UI** (rounded-full) napříč nav, buttony, kontaktními kartami. **Sharp corners** (`rounded-[2px]`) jen u form fields a fotorámů.
- Komponenta: `src/components/Button.astro` (variants: `primary | secondary | text`).

## Voice & Tone
- První osoba jednotného čísla VŽDY (já, mé, pracuji, vyrobím). NIKDY "my" nebo "náš tým".
- Klidná jistota. Řemeslník, který nechává práci mluvit.
- Italic Playfair pro emoce, General Sans pro fakta.
- Žádné vykřičníky. Žádné generické marketingové fráze.

## Page Structures

### Homepage (/)
1. **Hero** — split layout: text left ("Každý šperk má svůj příběh" + subtitle + 2 CTAs), large jewelry photo right
2. **USP** — 3 columns centered, cream bg, icons + text:
   - "Váš šperk, váš příběh" — Fotím každý krok — od prvního náčrtu po hotový kus. Dostanete kompletní příběh vzniku vašeho šperku.
   - "Dílna bez tajemství" — Můžete být u toho, když váš šperk vzniká. Otevírám dveře dílny — ať vidíte, z čeho a jak se rodí.
   - "Mluvíte se mnou" — Žádný asistent, žádný formulář do prázdna. Voláte a píšete přímo zlatníkovi, který váš šperk vyrobí.
3. **Portfolio preview** — horizontal cards (photo left, text right), 3 items with tags + "Zobrazit detail →"
4. **Process** — "Jak se rodí váš šperk", 3 steps: Konzultace s vámi / Ruční výroba ve zlatnické dílně / Váš šperk je hotov
5. **Express** — "Expresní výroba" label, "Šperk na poslední chvíli? Zvládnu to." + description + 2 buttons
6. ~~**Testimonial**~~ — ODSTRANĚNO. Původní citace „Helena Novotná, Sběratelka
   šperků" byla vymyšlená; smyšlené reference porušují pravidla Google pro
   strukturovaná data a na webu řemeslníka jsou navíc kontraproduktivní.
   **Web dnes nemá žádný sociální důkaz**, přestože Google Business Profile
   nese 4,9 ★ z 27 recenzí. Infrastruktura pro recenze je v `src/data/products.ts`
   (typ `ProductReview` — pro recenze PRODUKTU; recenze firmy potřebují vlastní strukturu) a `src/lib/seo.ts` — čeká jen na skutečná hodnocení od Martina.
   Pozor: `aggregateRating` v `LocalBusiness` Google od 2019 ignoruje jako
   self-serving, takže hodnota je v konverzi pro lidi, ne v rich snippetu.
7. **O dílně preview** — icon + heading + paragraph + "O dílně" button + photo right
8. **CTA** — centered: "Máte zájem / o zakázkový šperk?" + subtitle + Zavolat + Napsat na WhatsApp
9. **Footer** — global

### Zakázková tvorba (/zakazkova-tvorba)
1. **Hero** — fullwidth image + minimal overlay, "Váš šperk na míru", one CTA "Poptat šperk"
2. **Process** — staggered grid 01-04 with photos, sticky left scrolling right
3. **Materials** — photo left, 3 items right (Zlato a stříbro, Drahé kameny, Přírodní kameny)
4. **Pricing Stříbro** — simple card/list
5. **Fullwidth parallax photo** — 60vh, background fixed, no text
6. **Pricing Zlato** — simple card/list
7. **FAQ** — accordion, 5 questions
8. **CTA pre-footer** — heading left, text + buttons right

### Skladem (/skladem)
1. **Header** — centered text only: "Hotové šperky" + subtitle. NO hero image.
2. **Filter pills** — Vše | Prsteny | Náušnice | Přívěsky | Řetízky | Sady
3. **Product grid** — 3 columns, photo + name + material + price
4. **CTA** — "Nenašli jste, co hledáte?" heading left, text + buttons right

### Portfolio (/portfolio)
1. **Header** — "Šperky z duše" + subtitle + filter pills
2. **Gallery cards** — horizontal (photo left, text + tags right)
3. **CTA** — "Chcete podobný šperk na míru"

### O dílně (/o-dilne)
1. **Header** — "Zlatnictví s tradicí a srdcem" centered
2. **About** — text left ("Zlatnictví není jen práce" — 1 paragraph), photo right
3. **Gallery** — 3 photos static grid (NO carousel)
4. **Certifikáty** — heading + text left, photo right
5. **CTA pre-footer**

### Kontakt (/kontakt)
1. **Header** — "Pojďme si promluvit" centered
2. **3 contact methods** — phone, WhatsApp, email (icons + text, centered row)
3. **Form** — left (Jméno, Email, Telefon, Zájem o dropdown, Zpráva, GDPR checkbox) + photo right
4. **Map** — Google Maps embed + address text

### Detail produktu (/sperky/*)
- Sticky photo gallery left + info panel right (name, price, material, description, CTA → /kontakt)

### Detail portfolia (/tvorba/*)
1. Fullwidth hero photo
2. Centered info (name + material + paragraph)
3. Process gallery (3 photos row)
4. CTA pre-footer

## Footer (Global)
- Light bg-secondary, border-top
- Logo "Martin Ševr" (italic serif) + "Zlatnická dílna v centru Prahy"
- Navigation links: Domů, Zakázková tvorba, Skladem, Portfolio, O dílně, Kontakt
- Contact: +420 774 598 181, zlatnikmartin@email.cz, Pod Kesnerkou 46, Praha 5
- © 2026 Martin Ševr · Zlatnická dílna Praha
- NO newsletter, NO social icons

## Navigation (Global)
- Logo left: "Martin Ševr" or logotype (italic serif)
- Links center/right: Zakázková tvorba, Skladem, Portfolio, O dílně (dropdown?)
- CTAs far right: WhatsApp (outlined) + Volat (primary dark)
- Sticky on scroll, light bg, border-bottom on scroll

## GSAP Animations
- Scroll-triggered fade-in + slide-up on all sections (stagger 0.15, y: 40, duration: 0.8)
- Parallax photo section on Zakázková tvorba (background-attachment: fixed or GSAP y transform)
- Sticky process timeline (left column position: sticky)
- Hover scale on portfolio cards (scale: 1.02, duration: 0.3)
- Text reveal on h1 headings (optional, Phase 2)

## Images
- Use placeholder images for now (gray bg with icon, aspect-ratio maintained)
- Photo placeholders: 16:9 for hero, 1:1 for product cards, 4:3 for portfolio cards, 3:4 for portraits
- Betty will photograph later — build with placeholders

## SEO
Each page needs: title, description, canonical, Open Graph, structured data (JSON-LD).
- Homepage: LocalBusiness + WebSite schema
- Skladem items: Product schema
- Portfolio: CreativeWork schema
- Kontakt: ContactPage schema

## CSS Reset / Base
Include these stabilizers:
- box-sizing: border-box on everything
- img/video/svg: max-width 100%, height auto
- .flex-child: min-width 0
- overflow-wrap: anywhere on prose
- object-fit: cover on card images

## Accessibility (WCAG 2.2 AA, kontrolováno auditem)
- Všechny `<img>` mají český alt text (čistě dekorativní obrázky `alt=""` + `aria-hidden`).
- Form labels linkované přes `for=`/`id=`.
- Focus indikátor: `outline: 2px solid var(--color-gold-deep)` (kontrast 4.9:1, splňuje SC 1.4.11).
- Skip-to-content link na začátku body.
- Semantic HTML: `<header>`, `<nav>`, `<main id="main">`, `<section>`, `<footer role="contentinfo">`.
- ARIA labels na icon-only buttonech (`aria-label="Otevřít menu"`, `aria-label="Instagram"`).
- Touch targets ≥ 44 px (h-11/h-12 napříč navigací, buttony).
- `prefers-reduced-motion` respektováno globálně + GSAP přes `matchMedia`.
- `lang="cs"` na `<html>`.

## File Structure (aktuální)
```
/
├── CLAUDE.md
├── AUDIT-REPORT.md          # technický audit, viz tam
├── astro.config.mjs
├── package.json             # Astro 6 + Tailwind v4 + GSAP + Sharp
├── tsconfig.json            # extends astro/tsconfigs/strict
├── public/
│   ├── .htaccess            # security headers, cache, redirect, dotfile block
│   ├── fonts/               # 4× WOFF2 (Playfair Reg+Italic, GeneralSans Reg+Medium)
│   ├── images/              # ~140 fotek 1x/@2x/-mobile/-mobile@2x WebP
│   ├── favicon.svg, apple-touch-icon.png, site.webmanifest
│   ├── llms.txt             # AEO entry point
│   └── robots.txt
├── scripts/
│   └── process-images.mjs   # Sharp pipeline: src → 1x/@2x/-mobile/-mobile@2x WebP
├── src/
│   ├── layouts/
│   │   └── Layout.astro     # head, fonty preload, JSON-LD, Nav, Footer, lazy GSAP
│   ├── components/
│   │   ├── Nav.astro                # sticky pill-shaped header
│   │   ├── Footer.astro             # CTA panel + sitemap + social
│   │   ├── Button.astro             # variants: primary | secondary | text
│   │   ├── CTA.astro                # pre-footer CTA block
│   │   ├── ContactForm.astro        # POST → public/send.php (+ no-JS fallback přes 303)
│   │   ├── ProductCard.astro
│   │   ├── PortfolioListCard.astro  # vertical list card pro homepage/portfolio/tvorba
│   │   ├── PhotoFrame.astro         # dekorativní vnitřní lemování
│   │   ├── ResponsivePicture.astro  # <picture> wrapper s mobilní variantou
│   │   ├── FilterPills.astro
│   │   └── FAQ.astro                # native <details>/<summary>
│   ├── pages/
│   │   ├── index.astro
│   │   ├── zakazkova-tvorba.astro
│   │   ├── skladem.astro
│   │   ├── portfolio.astro
│   │   ├── o-dilne.astro
│   │   ├── kontakt.astro
│   │   ├── ochrana-osobnich-udaju.astro
│   │   ├── 404.astro
│   │   ├── sperky/[slug].astro      # detail produktu skladem
│   │   └── tvorba/[slug].astro      # detail portfolia
│   ├── data/
│   │   ├── products.ts              # skladem items
│   │   └── portfolio.ts             # portfolio items
│   ├── scripts/
│   │   ├── animations.ts            # GSAP scroll triggers (lazy-loaded)
│   │   ├── nav.ts                   # mobile menu toggle
│   │   └── filter-pills.ts          # filter behavior
│   └── styles/
│       └── global.css               # @import tailwindcss + @theme + base resets
```

## Deploy
```bash
pnpm build                  # → dist/
# obsah dist/ → FTP → Hostinger public_html/
```

**Pořadí je vždy commit → build → upload.** `src/lib/sitemap.ts` bere `<lastmod>`
z data posledního commitu, který se dotkl zdrojů stránky. Build z necommitnutého
stromu proto hlásí Googlu datum staršího commitu a změna se tváří, že se nestala
(stalo se 7/2026: 64 z 68 URL hlásilo tři týdny staré datum).

**`.htaccess` je skrytý soubor** — FTP klienti ho defaultně nezobrazují a tiše
vynechají. Nese redirecty, CSP, cache i staging guard. FileZilla: *Server →
Vynutit zobrazení skrytých souborů*.

**Stav se ověřuje proti ostré doméně, ne proti gitu** — nasazuje se ručně,
takže produkce může být napřed i pozadu.

## astro.config.mjs (aktuální)
Sitemap NENÍ přes `@astrojs/sitemap` — řeší ji vlastní endpointy
`src/pages/sitemap.xml.ts` a `sitemap-en.xml.ts` (jeden soubor místo
sitemap-index, s `lastmod` z gitu, `image:` tagy a hreflang alternates).

```js
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://www.zlatnik-martin.cz',   // www je kanonické, apex 301 → www
  trailingSlash: 'always',                 // kanonické URL, sitemap i hreflang
  i18n: {
    defaultLocale: 'cs',                   // čeština bez prefixu, EN pod /en/
    locales: ['cs', 'en'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  build: { inlineStylesheets: 'always' },  // žádný render-blocking <link>
  vite: { plugins: [tailwindcss()] },
});
```

## Hosting (Hostinger)
- **Server**: LiteSpeed (HTTP/2 + HTTP/3 přes alt-svc)
- **Domain**: `zlatnik-martin.cz` (produkce), `vilim.sbs` (staging)
- Headers servíruje `public/.htaccess` — CSP, X-Frame-Options, Permissions-Policy, immutable cache pro `*.css|js|woff2|webp|svg`, `must-revalidate` pro HTML.
- Hostinger CDN (hcdn) **vypnut** (degradoval HTTP/3 negociaci) — ověřit po každé migraci.
