# Md. Jubayer Hasan — Portfolio

An interactive portfolio: a flip-calendar hero, a wall of doors that open into project rooms, a scroll-driven timeline, a 3D ability card and a pull cord that switches the lights.

Design analysis and build decisions: [docs/reference-analysis.md](docs/reference-analysis.md).

## Run it

Requires Node.js 18 or newer.

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:5173>.

On Windows you can instead double-click `start-server.bat`. It installs dependencies the first time, starts the server and opens the site in your browser.

## Build

```bash
npm run build
```

```bash
npm run preview
```

The static site is written to `dist/`.

## Deploy

It is a static single-page app. Any static host works as long as unknown paths fall back to `index.html` (needed for `/work/...` URLs).

- **Vercel**: import the repository. `vercel.json` already contains the rewrite.
- **Netlify**: build command `npm run build`, publish directory `dist`. `public/_redirects` handles the fallback.
- **Other hosts**: configure a rewrite of all routes to `/index.html`.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_FORM_ENDPOINT` | No | URL that accepts a JSON `POST` (Formspree, Web3Forms, your own API). When unset, the contact form opens the visitor's email app with the message filled in. |

Copy `.env.example` to `.env.local` to set it.

## Editing content

All text lives in two typed files; no component needs to change.

| File | Contains |
|------|----------|
| `src/data/profile.ts` | Name, links, hero roles, skills, the "My story" timeline |
| `src/data/projects.ts` | The four rooms (doors) and every project card and case study |

To add a project, append an object to a room's `projects` array. Pick a `stage`:

| `kind` | Shows |
|--------|-------|
| `duo` | Monitor with crossfading screenshots plus a phone |
| `monitor` | Monitor only |
| `window` | A single image in an app window |
| `repo` | A file tree in a code window |
| `flow` | A numbered stage diagram |
| `paper` | A preprint sheet with title, authors and DOI |

Add a `detail` block to give the project a "Read the case study" sheet.

## Images

Originals are kept in `reference-materials/`. Everything in `public/img/` is generated:

```bash
npm run assets
```

This creates the 4K portrait (`portrait-4k.webp` and `.jpg`, 3840 px tall), the transparent hero cut-out in three sizes, the ability-card crop and WebP versions of the project screenshots. Background removal runs locally.

The portrait master is `reference-materials/portrait-upscaled.png`: the original photo (1326×2048) upscaled 4× on this machine with Real-ESRGAN, then blended 62/38 with a plain resample so skin keeps its texture. If that file is missing, the script falls back to a plain resample of the original. A before/after crop is in `docs/portrait-upscale-comparison.jpg` (plain resample, raw AI upscale, final blend).

Project screenshots supplied by hand are kept in `reference-materials/screens/`. They were upscaled 4× with Real-ESRGAN and converted with:

```bash
node scripts/prepare-screens.mjs <folder-with-upscaled-pngs>
```

That writes `<name>.webp` (1920 px, used on cards) and `<name>-4k.webp` (3840 px, offered to large screens through `srcset`). The script also blurs the email addresses and phone numbers in the EduSync "Manage Users" capture and crops the Gomoku capture to the board.

The technology logos in the "key rack" section come from `src/data/stack.ts` (Simple Icons, CC0). Add or remove a line there to change the rack.

To replace the portrait, delete `portrait-upscaled.png`, change the `PHOTO` path at the top of `scripts/prepare-assets.mjs`, delete `reference-materials/captures/_cutout.png` and run the command again.

## Structure

```
src/
  App.tsx              view switching, theme, overlays, route transitions
  lib/app.tsx          router, context, Lenis, scroll and clock hooks, icons
  data/                profile.ts, projects.ts
  styles/global.css    design tokens (light and dark), base, pills, chips
  components/
    Header.tsx         nav, clock, full-screen menu
    Cord.tsx           pull cord (theme switch)
    Hero.tsx           flip calendar, portrait figure
    Doors.tsx          door wall, scroll tour, enter transition
    Story.tsx          odometer, dial, timeline
    Room.tsx           project room, card stack, device frames
    Footer.tsx
    ContactModal.tsx   three-step form
    AbilityCard.tsx    3D card and embers
    Overlays.tsx       preloader, case study sheet, privacy and credits
scripts/prepare-assets.mjs
docs/reference-analysis.md
```

## Accessibility and performance

- Keyboard: every control is a real button or link; Escape closes overlays; the card flips with the arrow keys; visible focus rings.
- `prefers-reduced-motion` turns off smooth scrolling, the preloader sequence and decorative motion.
- No cookies, analytics or third-party requests. The font is self-hosted.
- About 71 KB of JavaScript and 14 KB of CSS, gzipped. Images are WebP, lazy-loaded below the fold.

## Credits

- Interaction design inspired by [therishithakor.com](https://therishithakor.com/). All code here is written from scratch; no source code or assets were copied from that site.
- Typeface: [Onest](https://fonts.google.com/specimen/Onest), SIL Open Font License.
- Smooth scrolling: [Lenis](https://github.com/darkroomengineering/lenis), MIT.
