import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'fs';
import { join, parse } from 'path';

const INPUT_DIR = 'images-selekce';
const OUTPUT_DIR = 'public/images';

// AVIF doplňuje WebP — ResponsivePicture/hero <picture> servíruje obojí, AVIF má
// přednost (typicky o 30–50 % menší). q60 AVIF vizuálně odpovídá q85 WebP.
const AVIF_QUALITY = 60;
const AVIF_EFFORT = 4;

// ---------------------------------------------------------------------------
// `--backfill-avif`: jednorázově dogeneruje .avif ke každému existujícímu .webp
// v CELÉM public/ (rekurzivně — kryje i public/skladem/, kam míří ProductCard).
// Transcode z WebP (ne z raw zdroje) záměrně — garantuje identické rozměry
// a crop, protože AVIF sdílí sloty v srcset. Idempotentní: existující přeskakuje.
// ---------------------------------------------------------------------------
if (process.argv.includes('--backfill-avif')) {
  const SCAN_DIR = 'public';
  const all = readdirSync(SCAN_DIR, { recursive: true })
    .filter((f) => f.endsWith('.webp'));
  const todo = all.filter((f) => !existsSync(join(SCAN_DIR, f.replace(/\.webp$/, '.avif'))));
  console.log(`AVIF backfill: ${todo.length}/${all.length} souborů…`);

  let done = 0;
  let failed = 0;
  const BATCH = 8;
  for (let i = 0; i < todo.length; i += BATCH) {
    await Promise.all(
      todo.slice(i, i + BATCH).map(async (f) => {
        const src = join(SCAN_DIR, f);
        const out = src.replace(/\.webp$/, '.avif');
        try {
          await sharp(src).avif({ quality: AVIF_QUALITY, effort: AVIF_EFFORT }).toFile(out);
          done++;
        } catch (err) {
          failed++;
          console.error(`✗ ${f}: ${err.message}`);
        }
      }),
    );
    if ((i / BATCH) % 5 === 0) console.log(`  … ${Math.min(i + BATCH, todo.length)}/${todo.length}`);
  }
  console.log(`Hotovo: ${done} vytvořeno, ${failed} selhalo.`);
  process.exit(failed > 0 ? 1 : 0);
}

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

// Ořezové rozměry podle prefixu názvu souboru
const SIZE_MAP = {
  // Hero / fullwidth → velké
  'homepage--hero': { w: 1200, h: 900, q: 85 },
  'zakazkova--hero': { w: 1920, h: 1080, q: 85 },
  'zakazkova--parallax': { w: 1920, h: 1080, q: 80 },
  // Parallax pás na /opravy — tři dedikované cropy: portrét 4:5 mobil,
  // 16:9 tablet, 2,35:1 desktop. Desktop crop je záměrně VYŠŠÍ než render
  // pásu (~2,7–3,8:1): obraz v pásu klouže (oversized-img parallax, viz
  // animations.ts), přebytek výšky je dráha posunu. Zdroj -pano je 3:2 master.
  // Delší prefixy (-vyska/-pano) vyhrávají nad základním 16:9.
  'opravy--parallax--brouseni-prstenu-vyska': { w: 640, h: 800, q: 82 },
  'opravy--parallax--brouseni-prstenu-pano': { w: 1920, h: 817, q: 82 },
  'opravy--parallax--brouseni-prstenu': { w: 1920, h: 1080, q: 82 },
  'detail-portfolio--vltavin--hero': { w: 1920, h: 1080, q: 85 },

  // Horizontální karty 4:3
  'homepage--portfolio': { w: 800, h: 600, q: 85 },
  'homepage--o-dilne': { w: 800, h: 600, q: 85 },
  'zakazkova--proces': { w: 800, h: 600, q: 85 },
  'zakazkova--materialy': { w: 800, h: 600, q: 85 },
  'portfolio--': { w: 800, h: 600, q: 85 },
  'o-dilne--galerie': { w: 800, h: 600, q: 85 },
  'o-dilne--certifikaty': { w: 800, h: 600, q: 85 },
  'detail-portfolio--': { w: 800, h: 600, q: 85 },

  // Produktové čtverce 1:1
  'skladem--produkt': { w: 800, h: 800, q: 85 },
  'snubni--styly': { w: 800, h: 800, q: 85 },

  // Snubni hero — 4:3 s mobilní variantou
  'snubni--hero': { w: 1200, h: 900, q: 85 },

  // Opravy hero — čtvercový 1:1 portrét Martin při práci
  'opravy--hero': { w: 1000, h: 1000, q: 85 },

  // Detail produkty 1:1
  'detail--': { w: 1000, h: 1000, q: 85 },

  // Portrétní 3:4
  'o-dilne--portret': { w: 600, h: 800, q: 85 },
  'kontakt--formular': { w: 600, h: 800, q: 85 },

  // Extra — defaultní 4:3
  'extra--': { w: 800, h: 600, q: 85 },
};

function getSizeForFile(filename) {
  // Hledej nejdelší matchující prefix
  let bestMatch = null;
  let bestLen = 0;
  for (const [prefix, size] of Object.entries(SIZE_MAP)) {
    if (filename.startsWith(prefix) && prefix.length > bestLen) {
      bestMatch = size;
      bestLen = prefix.length;
    }
  }
  return bestMatch || { w: 800, h: 600, q: 85 };
}

// Pro velké obrázky (hero/parallax ≥1200w) generuj i mobilní variantu 800w.
const MOBILE_WIDTH = 800;
const LARGE_THRESHOLD = 1200;

const files = readdirSync(INPUT_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

console.log(`Zpracovávám ${files.length} fotek paralelně...`);

/** Jeden zdroj → WebP + AVIF ve stejném rozměru/cropu. */
function emitPair(inputPath, w, h, q, outName) {
  return [
    sharp(inputPath)
      .resize(w, h, { fit: 'cover', position: 'center' })
      .webp({ quality: q })
      .toFile(join(OUTPUT_DIR, `${outName}.webp`)),
    sharp(inputPath)
      .resize(w, h, { fit: 'cover', position: 'center' })
      .avif({ quality: AVIF_QUALITY, effort: AVIF_EFFORT })
      .toFile(join(OUTPUT_DIR, `${outName}.avif`)),
  ];
}

async function processFile(file) {
  const { name } = parse(file);
  const size = getSizeForFile(name);
  const inputPath = join(INPUT_DIR, file);

  const tasks = [
    ...emitPair(inputPath, size.w, size.h, size.q, name),
    ...emitPair(inputPath, size.w * 2, size.h * 2, size.q, `${name}@2x`),
  ];

  let mobileSuffix = '';
  if (size.w >= LARGE_THRESHOLD) {
    const mobileH = Math.round((size.h / size.w) * MOBILE_WIDTH);
    tasks.push(
      ...emitPair(inputPath, MOBILE_WIDTH, mobileH, size.q, `${name}-mobile`),
      ...emitPair(inputPath, MOBILE_WIDTH * 2, mobileH * 2, size.q, `${name}-mobile@2x`),
    );
    mobileSuffix = ` + mobile ${MOBILE_WIDTH}×${mobileH} (@1x/@2x)`;
  }

  try {
    await Promise.all(tasks);
    console.log(`✓ ${name} → ${size.w}×${size.h} + @2x${mobileSuffix} (webp+avif)`);
  } catch (err) {
    console.error(`✗ ${name}: ${err.message}`);
  }
}

await Promise.all(files.map(processFile));

console.log('Hotovo!');
