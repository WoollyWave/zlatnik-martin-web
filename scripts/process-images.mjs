import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'fs';
import { join, parse } from 'path';

const INPUT_DIR = 'images-selekce';
const OUTPUT_DIR = 'public/images';

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

// Ořezové rozměry podle prefixu názvu souboru
const SIZE_MAP = {
  // Hero / fullwidth → velké
  'homepage--hero': { w: 1200, h: 900, q: 85 },
  'zakazkova--hero': { w: 1920, h: 1080, q: 85 },
  'zakazkova--parallax': { w: 1920, h: 1080, q: 80 },
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

const files = readdirSync(INPUT_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

console.log(`Zpracovávám ${files.length} fotek...`);

for (const file of files) {
  const { name } = parse(file);
  const size = getSizeForFile(name);
  const inputPath = join(INPUT_DIR, file);

  try {
    // @1x verze
    await sharp(inputPath)
      .resize(size.w, size.h, { fit: 'cover', position: 'center' })
      .webp({ quality: size.q })
      .toFile(join(OUTPUT_DIR, `${name}.webp`));

    // @2x verze
    await sharp(inputPath)
      .resize(size.w * 2, size.h * 2, { fit: 'cover', position: 'center' })
      .webp({ quality: size.q })
      .toFile(join(OUTPUT_DIR, `${name}@2x.webp`));

    console.log(`✓ ${name} → ${size.w}×${size.h} + @2x`);
  } catch (err) {
    console.error(`✗ ${name}: ${err.message}`);
  }
}

console.log('Hotovo!');
