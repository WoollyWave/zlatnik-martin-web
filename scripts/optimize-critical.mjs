// Aggressive re-optimization of critical above-the-fold images for PageSpeed 100.
// Re-encodes from existing WebP files with smaller dimensions + lower quality + adds AVIF.
import sharp from 'sharp';
import { resolve } from 'path';

const DIR = 'public/images';

// {source, output, w, h, q}
const tasks = [
  // ─── HERO HOMEPAGE — LCP critical ───
  // Mobile fits viewport ≤ 1023px; max needed = 1023px wide. Card aspect 4:3.
  { src: 'homepage--hero--vltavin-privesek-mobile@2x.webp', out: 'homepage--hero--vltavin-privesek-mobile@2x.webp', w: 1200, h: 900, q: 72 },
  { src: 'homepage--hero--vltavin-privesek-mobile.webp',    out: 'homepage--hero--vltavin-privesek-mobile.webp',    w: 600,  h: 450, q: 72 },
  // Desktop ≥ 1024px, max width on grid column ~700px
  { src: 'homepage--hero--vltavin-privesek@2x.webp',        out: 'homepage--hero--vltavin-privesek@2x.webp',        w: 1600, h: 1200, q: 75 },
  { src: 'homepage--hero--vltavin-privesek.webp',           out: 'homepage--hero--vltavin-privesek.webp',           w: 900,  h: 675, q: 75 },

  // ─── PORTFOLIO 3 CARD — visible above fold on /portfolio listing ───
  { src: 'portfolio--3--vltavinovy-privesek-raw@2x.webp',   out: 'portfolio--3--vltavinovy-privesek-raw@2x.webp',   w: 1280, h: 960, q: 72 },
  { src: 'portfolio--3--vltavinovy-privesek-raw.webp',      out: 'portfolio--3--vltavinovy-privesek-raw.webp',      w: 640,  h: 480, q: 72 },
];

for (const { src, out, w, h, q } of tasks) {
  const inputPath = resolve(DIR, src);
  const outputPath = resolve(DIR, out);
  // Read to buffer first (so we can write back to same file)
  const buf = await sharp(inputPath).toBuffer();
  await sharp(buf)
    .resize(w, h, { fit: 'cover', position: 'center' })
    .webp({ quality: q, effort: 6 })
    .toFile(outputPath);
  console.log(`✓ ${out} → ${w}×${h} q${q}`);

  // Also generate AVIF (typically 30-50% smaller than WebP)
  const avifPath = outputPath.replace(/\.webp$/, '.avif');
  await sharp(buf)
    .resize(w, h, { fit: 'cover', position: 'center' })
    .avif({ quality: q, effort: 6 })
    .toFile(avifPath);
  console.log(`✓ ${avifPath.split('/').pop()} (AVIF)`);
}

console.log('\nDone. Run npm run build and verify file sizes.');
