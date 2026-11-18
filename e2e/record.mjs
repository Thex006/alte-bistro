// Records a scroll-through video of the page: node e2e/record.mjs (server on :3000)
import { chromium } from "playwright";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const DIR = process.env.OUT ?? "e2e/shots/video";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: DIR, size: { width: 1440, height: 900 } } });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(4200);
const h = await page.evaluate(() => document.documentElement.scrollHeight);
let t = 0;
for (let y = 0; y < h; y += 50) {
  await page.mouse.wheel(0, 50);
  // Sweep the cursor in a slow loop so the 3D tilt and floating food react.
  t += 0.08;
  await page.mouse.move(720 + Math.cos(t) * 420, 450 + Math.sin(t * 1.3) * 220, { steps: 2 });
  await page.waitForTimeout(40);
}
await page.waitForTimeout(1500);
await ctx.close();
await browser.close();
