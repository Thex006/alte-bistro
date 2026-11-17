# Alte Bistro

Concept website for Alte Bistro, an upscale, moody fusion bistro at Kazinczy utca 14, 1075 Budapest. West African heat meets Central European comfort. Built as an agency demo; it runs on your own computer.

## Run it (Windows, Git Bash)

Run these one at a time:

```bash
git clone https://github.com/Thex006/alte-bistro.git
cd alte-bistro
npm install
npm run build
npm start
```

Then open http://localhost:3000

## What is on the page
Parallax hero film, word by word tagline reveal, signature menu with live photo panel, a pinned "one night" photo scroll, story and review bento grids, opening hours with a live "open now" line in Budapest time, and a Book a table button on every screen that goes to OpenTable.

## Before launch
- Put the real OpenTable link in `lib/site.ts` (`OPENTABLE_URL`).
- Replace the sample reviews in `lib/site.ts` with real, attributed reviews.
- Swap `public/video/hero.mp4` and `hero.webm` for real kitchen footage.
- A full resolution suya skewers photo would replace `public/images/suya-skewers.jpg` (cut from the collage).
