# Md. Jubayer Hasan — Portfolio

An interactive portfolio: a flip-calendar hero, a wall of doors that open into project rooms, a scroll-driven timeline, a 3D ability card and a pull cord that switches the lights.

Design analysis and build decisions: [docs/reference-analysis.md](docs/reference-analysis.md).


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
