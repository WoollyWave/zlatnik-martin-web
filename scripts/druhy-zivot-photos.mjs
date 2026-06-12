import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const OUT = 'public/images';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const RAW = '/Users/woollywave/weby/Zlatnik martin/Fotky-k-uprave/o-dilne';

const tasks = [
  ['02-hero-ALT--martin-prace-shora.jpg',      'druhy-zivot--hero--martin-pri-praci.webp',      { w: 1600, h: 900, q: 85 }],
  ['10-detail--martin-prace-bok.jpg',          'druhy-zivot--karta-1--babiccin-prsten.webp',    { w: 800,  h: 600, q: 85 }],
  ['07-remeslo-2--pilniky-kladiva-spalek.jpg', 'druhy-zivot--karta-2--ztracena-nausnice.webp',  { w: 800,  h: 600, q: 85 }],
  ['06-remeslo-1--klestiky-stetce-stena.jpg',  'druhy-zivot--karta-3--diskretni-zasnubak.webp', { w: 800,  h: 600, q: 85 }],
];

let okCount = 0, failCount = 0;
for (const [src, out, { w, h, q }] of tasks) {
  try {
    const inp = resolve(RAW, src);
    if (!existsSync(inp)) {
      console.warn(`⚠ skip ${src} — soubor neexistuje`);
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
