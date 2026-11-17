// Records a scroll-through video of the page: node e2e/record.mjs (server on :3000)
import { chromium } from "playwright";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: "e2e/shots/video", size: { width: 1280, height: 720 } } });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(3500);
await page.mouse.move(640, 400);
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 60) {
  await page.mouse.wheel(0, 60);
  await page.waitForTimeout(45);
  // Hover across the menu rows to show the cursor photo preview.
  const menu = await page.evaluate(() => { const r = document.querySelector("#menu ol")?.getBoundingClientRect(); return r ? [r.top, r.bottom] : null; });
  if (menu && menu[0] < 500 && menu[1] > 300) await page.mouse.move(500 + (y % 300), Math.min(Math.max(menu[0] + 80, 200), 600), { steps: 3 });
}
await page.waitForTimeout(1500);
await ctx.close(); await browser.close();
