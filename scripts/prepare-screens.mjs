// Converts 4x-upscaled screenshots (Real-ESRGAN output, PNG) into the WebP files the site uses:
//   <name>-4k.webp  3840 px wide (case-study sheet, large screens)
//   <name>.webp     1920 px wide (project cards)
// Usage: node scripts/prepare-screens.mjs <folder-with-upscaled-pngs>
// The originals are kept in reference-materials/screens/.
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const src = process.argv[2];
if (!src) throw new Error('Pass the folder that holds the upscaled PNG files.');
const out = 'public/img';
const S = 4; // upscale factor, used to place the blur boxes below

// Crops, in pixels of the original screenshot. The Gomoku capture is trimmed to the board so it fills a phone screen.
const crops = { gomoku: { x: 215, y: 15, w: 530, h: 600 } };
// Rows of the EduSync "Manage Users" table show other people's email addresses and phone
// numbers. They are blurred before the image is published.
const blurRows = { 'edusync-users': { x: 485, w: 240, h: 44, ys: [377, 454, 531, 608, 686, 763] } };

for (const f of (await readdir(src)).filter((n) => n.endsWith('.png'))) {
  const name = path.basename(f, '.png');
  const file = path.join(src, f);
  const meta = await sharp(file).metadata();
  let buf = await sharp(file).png().toBuffer();

  const b = blurRows[name];
  if (b) {
    const patches = [];
    for (const y of b.ys) {
      const r = { left: b.x * S, top: y * S, width: b.w * S, height: Math.min(b.h * S, meta.height - y * S) };
      if (r.height <= 0) continue;
      patches.push({ input: await sharp(file).extract(r).blur(28).toBuffer(), left: r.left, top: r.top });
    }
    buf = await sharp(buf).composite(patches).png().toBuffer();
  }

  const c = crops[name];
  if (c) buf = await sharp(buf).extract({ left: c.x * S, top: c.y * S, width: c.w * S, height: c.h * S }).png().toBuffer();

  const landscape = !c && meta.width >= meta.height * 1.2;
  await sharp(buf).resize(landscape ? { width: 3840, withoutEnlargement: true } : { height: 3240, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${out}/${name}-4k.webp`);
  await sharp(buf).resize(landscape ? { width: 1920 } : { height: 1400 }).webp({ quality: 84 }).toFile(`${out}/${name}.webp`);
  const big = await sharp(`${out}/${name}-4k.webp`).metadata();
  console.log(name, `${big.width}x${big.height}`, `${Math.round((await stat(`${out}/${name}-4k.webp`)).size / 1024)} KB`);
}
