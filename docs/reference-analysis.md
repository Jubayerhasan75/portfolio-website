# Reference analysis and build decisions

Reference: <https://therishithakor.com/> (inspected live on 10 Nov 2026 at 1440×900 and 1024×768, plus the supplied screen recording, 2 min 47 s, sampled every 2 s).

Each finding is marked **[confirmed]** (read from the live DOM, computed styles or the recording) or **[assumed]** (inferred, not verified).

## 1. Section inventory

| # | Section | What it is |
|---|---------|------------|
| 1 | Preloader | Dark screen, three-digit counter bottom-left ("Opening up the work"), a stack of rounded pills in the door colours, brand top-left, category list top-right. [confirmed] |
| 2 | Hero (`#home`) | Light cream stage with rounded bottom corners. Eyebrow, "Hi, I'm …", muted "I am a", a desk flip calendar cycling five roles with a "01 / 05" counter, two pill buttons, a cut-out black-and-white portrait, a floating "My ability card" pill, and a mono bottom bar with three labels. [confirmed] |
| 3 | Doors (`#works`) | "Magic happens behind the doors" painted on a wall, four arched doors (navy, plum, sage, terracotta) with brass plates and handles, skirting board and floor. A fifth "secret" door exists in the DOM but is inert. [confirmed] |
| 4 | Rooms (`/web-developer/` etc.) | One page per door: large title, intro paragraph, a stack of project cards with device mock-ups, then the footer. Loaded inside iframes on the home page for the door transition. [confirmed] |
| 5 | My story (`#about`) | Pinned left column with heading, a four-digit rolling year, date label and an "01 / 05" meter; right column is a timeline with a rail and travelling dot. A canvas draws faint concentric dials behind the year. [confirmed] |
| 6 | Footer | Near-black panel with rounded top corners: status eyebrow, two-line headline, paragraph, CTA, four link columns, legal row. [confirmed] |
| 7 | Overlays | Full-screen menu (numbered list), ability-card viewer, five-step "Hire me" questionnaire, cookie banner, privacy and credits. [confirmed] |

## 2. Navigation map

`Home · Web Development · App Development · UI/UX Design · Graphic Design · My story · Contact`. Category items open the matching room; "My story" scrolls; "Contact" opens the questionnaire. Below roughly 1100 px the row collapses into a "Menu" chip that opens a full-screen list numbered 01–07. Rooms add a fixed "Back to the doors" chip bottom-left. The URL updates as you scroll (`/home`, `/work`, `/my-story`). [confirmed]

## 3. Component inventory

Header with nav and clock chip · pull cord (canvas rope and bead) · flip calendar · portrait figure · pills (dark with arrow badge, outline) · chips · door unit (casing, opening, room, door, flutes, plate, handle, lock, sill, light pool) · door info panel · custom "Click to enter" cursor · story clock, odometer, meter, rail · project card (info and stage) · monitor and phone frames · footer · back-to-top button with progress ring · modal, questionnaire, success states · ability card · cookie banner.

## 4. Typography

- Family: **Onest** (variable, 100–900), self-hosted woff2. [confirmed]
- Hero H1: 76 px at 1440 wide, weight 600, tracking −0.02em, line-height 0.98. [confirmed]
- Wall headline: 76 px, weight 700, tracking −0.03em. [confirmed]
- Small labels: monospace, about 11 px, uppercase, wide tracking. [confirmed]
- Body and nav: 14–16 px, weight 400–500. [confirmed]

## 5. Colour palette

| Token | Value | Use |
|-------|-------|-----|
| Light background | `#E8E4E0` (gradient `#EEEAE6` → `#D8CDCA`) | hero, rooms |
| Ink | `#1A1818` | text, dark buttons |
| Muted / subtle | `#857878` / `#B5A8A8` | secondary text |
| Accent | `#6B5C5C`, `#C4B0B0` | bullets, lines |
| Dark surfaces | `#1A1818`, `#221F1F`, `#252121`, `#302A2A` | dark theme |
| Lines | `rgba(196,176,176,.16)` | borders, chips |
| Doors | `#22304A`, `#4A3540`, `#7A8670`, `#A4552C` | one per category |
| Room light | `#FFDCAE` → `#C98447` → `#22160D` | glow behind an open door |
| Footer | `#0F0E0E` | contact panel |

All read from the reference's `:root` custom properties. [confirmed]

## 6. Spacing

Container max-width 88rem; side gutter 5.5rem on large screens; hero bottom bar 3.5rem. [confirmed] Smaller-screen gutters (2.5rem, 1.25rem) are my choice. [assumed]

## 7. Radius and shadow

Cards 2rem, small cards 1.25rem, controls 0.875rem, pills fully round. [confirmed] Shadows are soft, long and low-opacity; exact values were matched by eye. [assumed]

## 8. Animation inventory

| Animation | Trigger | Behaviour | Status |
|-----------|---------|-----------|--------|
| Preloader | page load | counter runs 000→100, pills rise in one by one, the curtain lifts | confirmed (recording) |
| Hero entrance | preloader end | lines slide up from a mask with 120 ms stagger; other items fade up with per-element delays (200–900 ms) | confirmed (`--d` delays in DOM) |
| Flip calendar | timer | top leaf rotates over the rings, uncovering the next word; block width follows the word | confirmed |
| Portrait colour | pointer over figure | colour version appears under the cursor | confirmed (recording) |
| Pull cord | drag or click | bead stretches, springs back, theme switches light/dark | confirmed |
| Door tour | scroll through pinned section | doors are introduced one at a time with a summary beside each, then all four show | confirmed (recording) |
| Door hover | pointer | door opens ajar, warm light spills, cursor label follows | confirmed |
| Door enter | click | door swings open, the camera pushes through into darkness, the room fades in | confirmed (recording) |
| Card stack | scroll | each card sticks; the next slides over it while the one below dims | confirmed |
| Odometer | scroll in My story | digits roll to the active chapter's year | confirmed |
| Ability card | pointer, drag, tap | tilt towards pointer, free rotation on drag, flip on tap, embers drifting behind | confirmed (recording) |
| Form steps | Next/Back | step slides, progress bar grows | confirmed |
| Easing | — | `cubic-bezier(.16,1,.3,1)` (soft), `(.22,1,.36,1)` (spring), `(.2,.8,.2,1)` (snap), `(.215,.61,.355,1)` (line) | confirmed (CSS variables) |

## 9. Interaction inventory

Hover lifts on nav items (2 px) and scale on pills (1.04) · magnetic-style spring on buttons (`data-h` attributes) · drag on cord and card · swipeable door row with dots on touch · keyboard: Escape closes overlays · focus-visible outlines · "Back to top" with scroll progress.

## 10. Responsive behaviour

- Under about 1100 px the nav becomes a Menu chip; the clock shortens to time and "10 Nov". [confirmed]
- On touch widths the doors become a horizontally swipeable, snapping row with "Swipe along the wall" and dots. [confirmed in DOM/CSS]
- Hover-only behaviour (door ajar, portrait colour) needs a touch equivalent. [assumed; implemented as tap]

## 11. Technology

- Hand-written HTML, CSS and vanilla JavaScript; no framework runtime detected. [confirmed]
- **Lenis** smooth scrolling (`html.lenis`). [confirmed]
- Two `<canvas>` elements (cord, story dials); the ability card loads separately. [confirmed]
- Hosted on Netlify, with a Netlify form for the questionnaire and optional Google Analytics behind the cookie banner. [confirmed]
- No GSAP, Framer Motion or Three.js globals were found on the home page. [confirmed for the home page]

## 12. Unverified assumptions

- Whether the ability card is WebGL or CSS 3D. I could not confirm it, so I built it in CSS 3D.
- Exact durations of the door-enter sequence (estimated from 30 fps frames: about 0.9 s swing and push, 0.45 s fade).
- Exact shadow values, and the pinned scroll length of the door tour.

---

# How the reference was adapted for Jubayer

## What changed, and why

| Reference | This site | Reason |
|-----------|-----------|--------|
| Five roles incl. photographer, graphic designer | Full-Stack Developer, Software Engineer, AI Automation Developer, CSE Undergraduate | Taken from the CV headline; the article switches between "a" and "an" |
| Doors: Web, App, UI/UX, Graphic | Full-Stack, AI Automation, PHP & MySQL, Research & ML | The four areas the CV and GitHub actually support |
| Looping screen recordings in device frames | Real screenshots crossfading in a monitor plus phone; file trees from the repo; preprint sheets; stage diagrams | Only authentic material. No invented screenshots |
| Five-step "Hire me" quiz with budgets | Three steps: topic, message, contact | No pricing exists to quote, and inventing one would be fabrication |
| Netlify form | `mailto:` by default, JSON POST if `VITE_FORM_ENDPOINT` is set | Works on any static host with no account |
| Cookie banner and analytics | None | The site sets no cookies, so a banner would be noise |
| Ability card with skill bars | Skill groups listed as text | Numeric skill ratings would be made up |
| Canvas rope | CSS cord on a damped spring | Same feel, far less code |
| Vanilla JS, iframes for rooms | React 18 + TypeScript + Vite, one SPA with two views | Reusable components and typed content files, which the brief asked for |

## Sitemap

```
/                     Home: hero → doors → my story → footer
/work/full-stack      Johan's Hub (case study), Adda (case study), Ki Hoto Jodi?
/work/ai-automation   Lead-to-meeting workflows (client work), AI Email Executive Agent (case study)
/work/php-mysql       EduSync, Shishu Bidya Niketon, WorkFlow
/work/research-ml     SotorkoBD, two TechRxiv preprints, Alzheimer's SSL, Gomoku
Overlays              Menu · Contact · Ability card · Case study sheet · Privacy & credits
```

## Stack and why

- **Vite + React 18 + TypeScript**: componentised, typed content in `src/data`, fast static build (about 71 KB of JavaScript gzipped).
- **Plain CSS with custom properties**: the reference's look depends on precise gradients, 3D transforms and masks, which are clearer in CSS than in utility classes. One token file drives both themes.
- **Lenis**: the same smooth-scroll library as the reference. Native `position: sticky` handles all pinning, so no ScrollTrigger is needed.
- **No GSAP, no Three.js**: every animation is a CSS transition or a small `requestAnimationFrame` loop (cord spring, card rotation, embers). The card is CSS 3D, which is lighter than loading a WebGL library for one object.
- **sharp + @imgly/background-removal-node** (dev only): build the 4K portrait, the transparent cut-out and optimised WebP screenshots. Background removal runs on your machine; the photo is not uploaded anywhere.

## Known differences from the reference

1. The portrait colour reveal uses your real colour photo; the reference swaps to a second outfit.
2. Device frames show screenshots rather than videos. Record short screen captures of your apps and they can be dropped in.
3. Adda is shown by its sign-in screen because everything else needs an account.
4. There is no scroll-driven door tour. The reference opens the doors one by one as you scroll; here the wall scrolls past normally and a door only opens, and shows its summary, while the pointer is on it (changed at the owner's request).
5. A "key rack" tech-stack section sits between the doors and the story. The reference has no equivalent.
