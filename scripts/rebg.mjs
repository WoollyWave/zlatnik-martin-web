/**
 * Převede plochou krémovou výplň pozadí na čistě bílou (#ffffff).
 *
 * Použití:  node scripts/rebg.mjs <vstup> <výstup> [<vstup2> <výstup2> …]
 *
 * Jednorázový nástroj — pouští se ručně na fotky ze studia, není součástí
 * `npm run images` ani buildu.
 *
 * Postup: flood fill OD OKRAJŮ, takže se maska nikdy nedotkne světlých ploch
 * uvnitř šperku (fasety briliantu jsou taky skoro bílé — prostý threshold přes
 * celý obrázek by je poškodil). Na hranici masky se dopočítá měkký přechod,
 * aby po prstenu nezůstal krémový lem.
 */
import sharp from 'sharp';

const TOL = 42;        // tolerance vzdálenosti od barvy pozadí (flood fill)
const FEATHER = 3;     // šířka pásu měkkého dopočtu kolem masky
const WHITE = [255, 255, 255];

const dist = (d, i, c) =>
  Math.abs(d[i] - c[0]) + Math.abs(d[i + 1] - c[1]) + Math.abs(d[i + 2] - c[2]);

export async function rebg(src, out) {
  const { data, info } = await sharp(src)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // Barva pozadí = medián rohových vzorků (ne jeden pixel, kvůli šumu).
  const corners = [];
  for (const [x, y] of [[1, 1], [W - 2, 1], [1, H - 2], [W - 2, H - 2]]) {
    const i = (y * W + x) * C;
    corners.push([data[i], data[i + 1], data[i + 2]]);
  }
  const BG = [0, 1, 2].map((k) =>
    Math.round(corners.map((c) => c[k]).sort((a, b) => a - b)[1]),
  );

  // --- flood fill od okrajů ---
  const mask = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) { stack.push(x, (H - 1) * W + x); }
  for (let y = 0; y < H; y++) { stack.push(y * W, y * W + W - 1); }

  while (stack.length) {
    const p = stack.pop();
    if (mask[p]) continue;
    if (dist(data, p * C, BG) > TOL) continue;
    mask[p] = 1;
    const x = p % W, y = (p / W) | 0;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - W);
    if (y < H - 1) stack.push(p + W);
  }

  // --- aplikace ---
  const delta = [0, 1, 2].map((k) => WHITE[k] - BG[k]);
  let filled = 0, feathered = 0;

  for (let p = 0; p < W * H; p++) {
    const i = p * C;
    if (mask[p]) {
      data[i] = WHITE[0]; data[i + 1] = WHITE[1]; data[i + 2] = WHITE[2];
      filled++;
      continue;
    }
    // Pixel sousedící s maskou = antialiasovaná hrana → posun úměrný tomu,
    // jak moc je ještě "pozadím".
    let near = false;
    const x = p % W, y = (p / W) | 0;
    for (let dy = -FEATHER; dy <= FEATHER && !near; dy++) {
      for (let dx = -FEATHER; dx <= FEATHER; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        if (mask[ny * W + nx]) { near = true; break; }
      }
    }
    if (!near) continue;
    const w = Math.max(0, 1 - dist(data, i, BG) / (TOL * 2.5));
    if (w <= 0) continue;
    for (let k = 0; k < 3; k++) {
      data[i + k] = Math.min(255, Math.max(0, Math.round(data[i + k] + w * delta[k])));
    }
    feathered++;
  }

  await sharp(data, { raw: { width: W, height: H, channels: C } })
    .webp({ quality: 85 })
    .toFile(out);

  const pct = ((filled / (W * H)) * 100).toFixed(1);
  console.log(`${out.split('/').slice(-2).join('/').padEnd(16)} BG ${BG.map(v=>v.toString(16).padStart(2,'0')).join('')} → ffffff · maska ${pct} % · hrana ${feathered} px`);
}

const jobs = process.argv.slice(2);
for (let i = 0; i < jobs.length; i += 2) await rebg(jobs[i], jobs[i + 1]);
