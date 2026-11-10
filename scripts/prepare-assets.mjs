// Builds every optimised image in public/img from the originals in reference-materials/.
// Run with: npm run assets
import sharp from 'sharp';
import { removeBackground } from '@imgly/background-removal-node';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SRC = 'reference-materials';
const OUT = 'public/img';
const PHOTO = path.join(SRC, '487314984_2413101942361224_4344868059524881344_n.jpg');
await mkdir(OUT, { recursive: true });

// ---------- portrait ----------
// The original is 1326x2048. It is resampled (Lanczos3 + light unsharp mask) to a 4K-tall
// master (3840px); smaller responsive sizes are cut from that master.
// If reference-materials/portrait-upscaled.png exists (Real-ESRGAN x4 output blended 62/38 with the
// plain resample to keep skin texture), it is used as the 4K master instead.
const UPSCALED = path.join(SRC, 'portrait-upscaled.png');
const master = existsSync(UPSCALED)
  ? await sharp(UPSCALED).resize({ height: 3840 }).toBuffer()
  : await sharp(PHOTO).resize({ height: 3840, kernel: 'lanczos3' }).sharpen({ sigma: 1.1, m1: 0.6, m2: 1.6 }).toBuffer();
await sharp(master).webp({ quality: 88 }).toFile(`${OUT}/portrait-4k.webp`);
await sharp(master).jpeg({ quality: 90, mozjpeg: true }).toFile(`${OUT}/portrait-4k.jpg`);
for (const h of [1920, 960]) await sharp(master).resize({ height: h }).webp({ quality: 84 }).toFile(`${OUT}/portrait-${h}.webp`);

// cut-out (transparent background) for the hero figure; matting runs locally, nothing is uploaded
const cutPath = `${SRC}/captures/_cutout.png`;
if (!existsSync(cutPath)) {
  const blob = await removeBackground(pathToFileURL(path.resolve(PHOTO)).href, { model: 'medium', output: { format: 'image/png' } });
  await writeFile(cutPath, Buffer.from(await blob.arrayBuffer()));
}
// the matte from the original photo is scaled up and applied to the 4K master
const mm = await sharp(master).metadata();
const alpha = await sharp(await readFile(cutPath)).resize(mm.width, mm.height, { fit: 'fill' }).extractChannel(3).toBuffer();
const rgb = await sharp(master).removeAlpha().png().toBuffer(); // flatten first: sharp applies removeAlpha after joinChannel
const trimmed = await sharp(await sharp(rgb).joinChannel(alpha).png().toBuffer()).trim().toBuffer();
const cut = await sharp(trimmed).resize({ height: 2880, withoutEnlargement: true }).toBuffer();
for (const h of [2880, 1600, 900]) await sharp(cut).resize({ height: h }).webp({ quality: 86, alphaQuality: 92 }).toFile(`${OUT}/figure-${h}.webp`);
// tight head-and-shoulders crop for the ability card
const meta = await sharp(master).metadata();
await sharp(master).extract({ left: Math.round(meta.width * 0.16), top: Math.round(meta.height * 0.22), width: Math.round(meta.width * 0.74), height: Math.round(meta.width * 0.74 * 0.92) })
  .resize({ width: 1400 }).webp({ quality: 88 }).toFile(`${OUT}/card-portrait.webp`);

// ---------- project captures ----------
const shots = { 'jh-home': 1, 'jh-collection': 1, 'jh-product': 1, 'jh-home-s1': 1, 'jh-home-s3': 1, 'jh-login': 1, 'adda-home': 1, 'kihoto-home': 1, 'ai-workflow': 0, 'ai-banner': 0, 'jh-home-m': 2, 'jh-collection-m': 2, 'adda-home-m': 2, 'kihoto-home-m': 2 };
for (const [name, kind] of Object.entries(shots)) {
  const f = `${SRC}/captures/${name}.png`;
  if (!existsSync(f)) { console.warn('missing', f); continue; }
  let img = sharp(f);
  if (kind === 1) img = img.resize({ width: 2400, withoutEnlargement: true });
  if (kind === 2) img = img.resize({ width: 900, withoutEnlargement: true });
  await img.webp({ quality: 84 }).toFile(`${OUT}/${name}.webp`);
}
// social preview
await sharp(master).resize(1200, 630, { fit: 'cover', position: 'top' }).jpeg({ quality: 84 }).toFile(`${OUT}/og.jpg`);
console.log('assets ready');
