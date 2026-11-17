// Viewport screenshots of each section: node e2e/shoot.mjs (server on :3000)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = process.env.OUT ?? "e2e/shots";
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
async function shoot(prefix, viewport, stops) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: Number(process.env.DPR ?? 1) });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  for (const [name, fn] of stops) {
    await page.evaluate(fn);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${OUT}/${prefix}-${name}.png` });
  }
  await page.close();
}
const at = (sel, frac = 0) => `(() => { const el = document.querySelector(${JSON.stringify(sel)}); window.scrollTo(0, el.offsetTop + el.offsetHeight * ${frac}); })()`;
const stops = [
  ["1-hero", "window.scrollTo(0,0)"],
  ["2-tagline", at("section[aria-label='Our promise']", 0.25)],
  ["3-menu", at("#menu", 0.08)],
  ["4-menu-more", at("#menu", 0.62)],
  ["5-night-a", at("#night", 0.02)],
  ["6-night-b", at("#night", 0.45)],
  ["7-story", at("#story", 0.05)],
  ["8-reviews", at("#reviews", 0.05)],
  ["9-visit", at("#visit", 0.05)],
  ["10-footer", "window.scrollTo(0, document.body.scrollHeight)"],
];
await shoot("desktop", { width: 1440, height: 900 }, stops);
await shoot("phone", { width: 390, height: 844 }, [stops[0], stops[2], stops[4], stops[6], stops[7], stops[9]]);
await browser.close();
