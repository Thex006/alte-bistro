// Smoke test: run `npm run build && npm start` first, then `npm run test:e2e`.
// Set BASE_URL to test another host. Screenshots land in e2e/shots/ (gitignored).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const SHOTS = process.env.SHOTS !== "0";
mkdirSync("e2e/shots", { recursive: true });

let failures = 0;
const check = (ok, msg) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${msg}`);
  if (!ok) failures++;
};

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });

async function run(name, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(BASE, { waitUntil: "networkidle" });

  check((await page.locator("h1").count()) === 1, `${name}: exactly one h1`);
  const ctas = await page.locator('[data-cta="book"]').evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  check(ctas.length > 0 && ctas.every((h) => h?.startsWith("https://www.opentable.com/")), `${name}: ${ctas.length} Book a table links all go to OpenTable`);
  const visibleCta = await page.locator('[data-cta="book"]:visible').count();
  check(visibleCta > 0, `${name}: a Book a table button is visible on the first screen`);

  // Scroll through the page so lazy images and reveals fire.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += Math.round(viewport.height * 0.6)) {
    await page.mouse.wheel(0, Math.round(viewport.height * 0.6));
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(800);
  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.checkVisibility()).map((i) => i.src),
  );
  check(broken.length === 0, `${name}: no broken images ${broken.join(", ")}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(overflow <= 0, `${name}: no horizontal overflow (${overflow}px)`);
  const stickyCta = await page.locator('[data-cta="book"]:visible').count();
  check(stickyCta > 0, `${name}: Book a table still visible at the bottom of the page`);
  check(errors.length === 0, `${name}: no console errors ${errors.join(" | ")}`);
  await page.close();
}

await run("desktop", { width: 1440, height: 900 });
await run("phone", { width: 390, height: 844 });

const p = await browser.newPage();
const res = await p.goto(`${BASE}/this-page-does-not-exist`);
check(res?.status() === 404, "unknown route returns branded 404");
check((await p.locator("text=not on the floor plan").count()) === 1, "404 copy renders");
for (const path of ["/privacy", "/terms"]) {
  const r = await p.goto(BASE + path);
  check(r?.status() === 200, `${path} loads`);
}
await browser.close();

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
