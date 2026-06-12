import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const OUT = 'public/images';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const RAW = '/Users/woollywave/weby/Zlatnik martin/Fotky-k-uprave';

const tasks = [
  // CASE 1: VLTAVÍN — process shots (hero z public/skladem/)
  ['o-dilne/08-remeslo-3--zhaveny-kov.jpg',          'portfolio--vltavin--zhaveny-kov.webp',    { w: 1200, h: 900, q: 85 }],
  ['o-dilne/09-remeslo-4--kovani-jiskry.jpg',        'portfolio--vltavin--kovani-jiskry.webp',  { w: 1200, h: 900, q: 85 }],

  // CASE 2: SNUBNÍ PRSTENY
  ['portfolio/02-snubni-par-bile-zlato.png',         'portfolio--snubaky--hero.webp',           { w: 1920, h: 1080, q: 85 }],
  ['portfolio/02-snubni-par-bile-zlato.png',         'portfolio--snubaky--card.webp',           { w: 800,  h: 600,  q: 85 }],
  ['portfolio/12-detail-storytelling--skica-1.jpg',  'portfolio--snubaky--skica.webp',          { w: 1200, h: 900,  q: 85 }],
  ['o-dilne/05-galerie-3--dilna-symetricky-ponk.jpg','portfolio--snubaky--dilna.webp',          { w: 1200, h: 900,  q: 85 }],
  ['o-dilne/08-remeslo-3--zhaveny-kov.jpg',          'portfolio--snubaky--proces.webp',         { w: 1200, h: 900,  q: 85 }],
  ['o-dilne/02-hero-ALT--martin-prace-shora.jpg',    'portfolio--snubaky--martin.webp',         { w: 1200, h: 900,  q: 85 }],

  // CASE 3: RUBÍN HALO
  ['portfolio/01-prsten-rubin-halo.png',             'portfolio--rubin-halo--hero.webp',        { w: 1920, h: 1080, q: 85 }],
  ['portfolio/01-prsten-rubin-halo.png',             'portfolio--rubin-halo--card.webp',        { w: 800,  h: 600,  q: 85 }],
  ['portfolio/03-solitery-diamant.png',              'portfolio--rubin-halo--solitery.webp',    { w: 1200, h: 900,  q: 85 }],
  ['portfolio/13-detail-storytelling--skica-2.jpg',  'portfolio--rubin-halo--skica.webp',       { w: 1200, h: 900,  q: 85 }],
  ['o-dilne/02-hero-ALT--martin-prace-shora.jpg',    'portfolio--rubin-halo--martin.webp',      { w: 1200, h: 900,  q: 85 }],
  ['o-dilne/07-remeslo-2--pilniky-kladiva-spalek.jpg','portfolio--rubin-halo--nastroje.webp',   { w: 1200, h: 900,  q: 85 }],

  // CASE 4: LOCKET VERA
  ['portfolio/07-locket-vera.png',                   'portfolio--locket--hero.webp',            { w: 1920, h: 1080, q: 85 }],
  ['portfolio/07-locket-vera.png',                   'portfolio--locket--card.webp',            { w: 800,  h: 600,  q: 85 }],
  ['o-dilne/10-detail--martin-prace-bok.jpg',        'portfolio--locket--martin.webp',          { w: 1200, h: 900,  q: 85 }],
  ['o-dilne/06-remeslo-1--klestiky-stetce-stena.jpg','portfolio--locket--nastroje.webp',        { w: 1200, h: 900,  q: 85 }],
  ['o-dilne/04-galerie-2--dilna-zidle-rostlina.jpg', 'portfolio--locket--dilna.webp',           { w: 1200, h: 900,  q: 85 }],
];

let okCount = 0, failCount = 0;
for (const [src, out, { w, h, q }] of tasks) {
  try {
    const inp = resolve(RAW, src);
    if (!existsSync(inp)) {
      console.warn(`⚠  skip ${src} — soubor neexistuje`);
      failCount++;
      continue;
    }
    await sharp(inp).resize(w, h, { fit: 'cover', position: 'center' }).webp({ quality: q }).toFile(`${OUT}/${out}`);
    const out2x = out.replace('.webp', '@2x.webp');
    await sharp(inp).resize(w * 2, h * 2, { fit: 'cover', position: 'center' }).webp({ quality: q }).toFile(`${OUT}/${out2x}`);
    console.log(`✓ ${out} (${w}×${h} + @2x)`);
    okCount++;
  } catch (err) {
    console.error(`✗ ${out}: ${err.message}`);
    failCount++;
  }
}

console.log(`\nHotovo. Úspěch: ${okCount}, neúspěch: ${failCount}`);
