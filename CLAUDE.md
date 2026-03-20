# Zlatník Martin Ševr — Static Build (Astro)

## Quick Start
```bash
npm create astro@latest . -- --template minimal
npx astro add tailwind
npm install gsap @splinetool/runtime
```

## Project Goal
Build a luxury jewelry workshop presentation website. Static, no CMS, no e-commerce. Czech language first, EN later via duplicate pages. Deploy via FTP to Hostinger.

## Stack
- **Astro** (static output, zero JS by default)
- **Tailwind CSS** (with custom config matching design system)
- **GSAP + ScrollTrigger** (scroll animations)
- **Spline** (3D ring in hero — Phase 2)
- **Google Fonts** (Fraunces) + **Fontshare** (General Sans — self-hosted WOFF2)

## Build Order (do in this sequence)
1. **Design system** — tailwind.config.mjs with colors, fonts, spacing
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
- **Photographer**: Betty (Raketta)

## Information Architecture
```
/ — Domů (Homepage)
/zakazkova-tvorba — Zakázková tvorba
/skladem — Skladem (listing page)
/portfolio — Portfolio (listing page)
/o-dilne — O dílně
/kontakt — Kontakt
/sperky/[slug] — Detail hotového šperku
/tvorba/[slug] — Detail portfolia
```

## Color Palette (LOCKED — use in tailwind.config.mjs)
```js
colors: {
  bg: {
    primary: '#FAFBF8',
    secondary: '#F1EEE5',
    tertiary: '#E7E1D6',
  },
  text: {
    primary: '#1E1B18',
    secondary: '#5F5A54',
    muted: '#8E887F',
  },
  gold: {
    primary: '#C6A85A',
    soft: '#E8D7A8',
    deep: '#8F7430',
    'on-light': '#726025',
  },
  border: '#E5DFD6',
  divider: '#EDE7DD',
  white: '#FFFFFF',
  error: '#B64536',
  success: '#4F6F5E',
  hover: {
    bg: '#EAE4DA',
    gold: '#B8963A',
  },
  'accent-cool': '#8FA3A6',
}
```

### Palette Rules
- text-muted ONLY on bg-primary, ONLY 14px+ bold. Never on bg-tertiary.
- gold-primary NEVER as text on light bg → use gold-on-light #726025 (5.1:1 AA).
- Footer: light (bg-secondary + border-top). NO dark footer.
- Ratio: 55% bg-primary, 30% bg-secondary, 5% dark text, 5% gold, 5% muted.
- NO dark sections, NO dark hero. Everything light and warm.

## Typography (LOCKED)
- **Headings**: Fraunces Sharp (Google Fonts, variable, weight 300, WONK 0, SOFT 0, opsz 144)
- **Body/UI**: General Sans (Fontshare, self-hosted WOFF2, weight 400 body, 500 buttons/labels)

```js
// tailwind.config.mjs
fontFamily: {
  serif: ['"Fraunces"', 'serif'],
  sans: ['"General Sans"', 'sans-serif'],
}
fontSize: {
  h1: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  h2: ['2.5rem', { lineHeight: '1.15' }],
  h3: ['1.75rem', { lineHeight: '1.2' }],
  h4: ['1.25rem', { lineHeight: '1.3' }],
  body: ['1rem', { lineHeight: '1.6' }],
  small: ['0.875rem', { lineHeight: '1.5' }],
  caption: ['0.75rem', { lineHeight: '1.4' }],
  button: ['0.8125rem', { lineHeight: '1', letterSpacing: '0.05em' }],
}
```

### Heading Style
```css
h1, h2, h3, h4 {
  font-family: 'Fraunces', serif;
  font-weight: 300;
  font-variation-settings: 'WONK' 0, 'SOFT' 0, 'opsz' 144;
}
```

## Buttons
- Primary: bg-text-primary text-bg-primary, border-radius 2px, uppercase, tracking-wider, text-button, font-medium, px-7 py-3.5
- Secondary: bg-transparent border border-border text-text-primary, same sizing
- Hover primary: bg-gold-primary
- Hover secondary: bg-hover-bg
- Sharp corners (2px max). NO rounded. NO pill shapes.

## Voice & Tone
- First person singular ALWAYS (já, mé, pracuji, vyrobím). NEVER "we" or "our team".
- Calm confidence. Craftsman who lets work speak.
- Fraunces italic for emotion, General Sans for facts.
- No exclamation marks. No generic marketing phrases.

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
6. **Testimonial** — 5 stars + quote + "Helena Novotná, Sběratelka šperků, Praha"
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

## Accessibility
- All images need alt text (Czech)
- Form labels linked to inputs
- Focus states visible (gold focus ring)
- Skip to content link
- Semantic HTML (header, main, nav, section, footer)
- ARIA labels on icon-only buttons

## File Structure
```
/
├── CLAUDE.md
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── public/
│   ├── fonts/
│   │   ├── GeneralSans-Regular.woff2
│   │   └── GeneralSans-Medium.woff2
│   ├── images/ (placeholders for now)
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── layouts/
│   │   └── Layout.astro (base HTML, head, fonts, meta)
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Button.astro
│   │   ├── CTA.astro (pre-footer CTA block)
│   │   ├── SectionHeader.astro (reusable page header)
│   │   ├── PortfolioCard.astro
│   │   ├── ProductCard.astro
│   │   ├── FilterPills.astro
│   │   ├── FAQ.astro (accordion)
│   │   ├── Testimonial.astro
│   │   └── ContactForm.astro
│   ├── pages/
│   │   ├── index.astro (Homepage)
│   │   ├── zakazkova-tvorba.astro
│   │   ├── skladem.astro
│   │   ├── portfolio.astro
│   │   ├── o-dilne.astro
│   │   ├── kontakt.astro
│   │   ├── sperky/
│   │   │   └── [slug].astro (or individual .astro files)
│   │   └── tvorba/
│   │       └── [slug].astro
│   ├── data/
│   │   ├── products.ts (skladem items data)
│   │   └── portfolio.ts (portfolio items data)
│   └── styles/
│       └── global.css (font-face, base resets, GSAP classes)
```

## Deploy
```bash
npm run build    # outputs to dist/
# Upload dist/ contents via FTP to Hostinger public_html/
```

astro.config.mjs:
```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://zlatnikmartin.cz', // update when domain ready
});
```
