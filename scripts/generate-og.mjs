/**
 * Generuje per-page Open Graph obrázky 1200×630 (JPEG, ~q82) z existujících fotek.
 *
 * Spuštění: node scripts/generate-og.mjs
 * Výstup:   public/images/og/og-<page>.jpg
 *
 * `position: 'attention'` nechá Sharp najít vizuálně nejzajímavější výřez
 * (šperk/obličej), místo tupého center-crop.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const QUALITY = 82;
const SRC = 'public/images';
const OUT = 'public/images/og';

/** stránka → zdrojová fotka (bez přípony) + volitelná crop pozice.
 *  Drž v sync s ogImage props ve stránkách.
 *  position: 'attention' najde vizuálně dominantní výřez; u portrétů funguje
 *  lépe explicitní pozice. */
const PAGES = {
  'og-zakazkova-tvorba': { src: 'zakazkova--hero--privesek-quartz-na-krku@2x' },
  'og-skladem': { src: 'skladem--produkt-14--prsten-s-vltavinem-original@2x' },
  'og-portfolio': { src: 'detail-portfolio--vltavin--hero-wide@2x' },
  'og-o-dilne': { src: 'o-dilne--galerie--dilna-symetricky-ponk@2x' },
  'og-kontakt': { src: 'o-dilne--portret--martin-hero-u-ponku@2x', position: 'centre' },
  'og-snubni-prsteny': { src: 'portfolio--snubaky--hero@2x' },
  'og-opravy': { src: 'opravy--hero--martin-portret@2x' },
  'og-retezy': { src: 'retezy--nahrdelnik-zlute@2x' },
};

await mkdir(OUT, { recursive: true });

for (const [name, { src, position = 'attention' }] of Object.entries(PAGES)) {
  const out = `${OUT}/${name}.jpg`;
  await sharp(`${SRC}/${src}.webp`)
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(out);
  console.log(`✓ ${out} ← ${src} (${position})`);
}
