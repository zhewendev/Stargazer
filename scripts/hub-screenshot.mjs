// Hub screenshot for P5 — verify D27 separation.
import { chromium } from "playwright"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, "..", "screenshots")
const baseUrl = "http://localhost:8086"

const browser = await chromium.launch({ headless: true })
const viewports = [
  { name: "desktop-1440-hub", width: 1440, height: 900 },
  { name: "mobile-390-hub", width: 390, height: 844 },
]

for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  await page.goto(`${baseUrl}/Knowledge/Android/`, { waitUntil: "networkidle" })
  await page.waitForTimeout(400)
  const file = path.join(outDir, `${vp.name}.png`)
  await page.screenshot({ path: file, fullPage: true })
  console.log(`✓ ${file}`)
  await ctx.close()
}

await browser.close()