# Alte Bistro (agency demo)

Upscale fusion bistro site, Budapest VII. Next.js 15 App Router, React 19, TypeScript, Tailwind v4, Framer Motion, Lucide, Lenis. Localhost only, no paid services, no database.

## Graph first
Before reading code broadly, read `graphify-out/GRAPH_REPORT.md` (build it with `pip install graphifyy` then `graphify update .`). Never commit `graphify-out/`.

## Where things live
- `lib/site.ts`: every fact (address, hours, prices, OpenTable URL, sample reviews). Change content here, not in components.
- `lib/open-status.ts`: live "open now" logic in Budapest time (unit tested in `tests/`).
- `components/`: one file per section (hero, tagline-reveal, menu-section, night-chapters, story-bento, reviews-bento, visit-section, site-footer, site-nav, mobile-book-bar).
- `public/images/`: the client's own photographs only. The hero shows `chef-plating.jpg` with a CSS compositor drift (`.hero-drift`); a video baked with ffmpeg zoompan stuttered. Set `HERO_VIDEO` in `components/hero.tsx` when real footage arrives.

## Rules
- Skills in `.claude/skills/` apply: landing-page-design and figma-designer (elayadesign/ai-design-skills, mandatory), design-taste-frontend, impeccable, typeui-minimal, writing-guidelines, playwright-cli and the addyosmani agent skills.
- Brief overrides skill defaults: editorial serif (Bodoni Moda) for display with Geist for text, Lucide icons, palette charcoal #131209, burnt orange #E8622A, bone #EFE8DC. Every section stays dark; orange is an accent only (words, prices, lines, CTA, outline frames, the intro curtain). Thierry rejected full orange and bone sections on 2026-11-17. No 3D in this version.
- Only the client's photographs. No stock. Reviews are samples and must stay labelled as such until real ones arrive.
- Copy: sentence case, no hyphens in copy, no exclamation marks, no invented facts.
- Motion: ease `cubic-bezier(0.22,1,0.36,1)`, transform, opacity and clip-path, reveal once. Motion is NOT switched off for prefers-reduced-motion: Thierry's Windows has Animation effects off and he wants the motion visible (decided 2026-11-17). Reusable pieces live in `components/motion/` (split-reveal, framed, marquee, magnetic, scroll-progress).
- Photo framing: use `components/motion/framed.tsx`. Arch (from the cellar vaults) on a few chosen photos only (menu sticky, cellar chapter, plantain plate); straight rect frames in varied ratios everywhere else. Every frame gets the same thin ember outline offset 8px. No tilted cursor cards.
- Image sharpness: photos are 16:9, so a taller frame crops the middle. `sizes` must be widened by the crop factor (`sizesFor` in framed.tsx) and quality is 90 (`images.qualities` in next.config.ts).
- The opening curtain in the hero is ember orange (Thierry asked for it back 2026-11-18); every section after it stays dark.
- Photos are Real-ESRGAN x4 upscales of the client's 1024px originals, colour graded (saturation, contrast, warm cast) and exported at 2560px. Keep originals out of the repo.
- Scroll-linked useTransform ranges must stay inside 0..1 or framer's compositor animation throws and blanks the page.
- One primary action: Book a table (OpenTable). It must stay visible on every screen.

## Checks
`npm run typecheck`, `npm test` (vitest), then `npm run build && npm start` and `npm run test:e2e` (Playwright smoke: CTAs, images, 390px overflow, 404, legal pages). `node e2e/shoot.mjs` writes screenshots to `e2e/shots/`.
