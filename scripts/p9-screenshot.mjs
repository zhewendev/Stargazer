// P9 screenshots — folder + tag card grids.
import { chromium } from "playwright"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, "..", "screenshots")
const baseUrl = "http://localhost:8088"

const browser = await chromium.launch({ headless: true })

const tests = [
  { name: "desktop-1440-folder", width: 1440, height: 900, url: "/Knowledge/" },
  { name: "desktop-1440-tag", width: 1440, height: 900, url: "/tags/android/" },
  { name: "mobile-390-folder", width: 390, height: 844, url: "/Knowledge/" },
  { name: "mobile-390-tag", width: 390, height: 844, url: "/tags/android/" },
]

for (const t of tests) {
  const ctx = await browser.newContext({ viewport: { width: t.width, height: t.height } })
  const page = await ctx.newPage()
  const target = baseUrl + t.url
  console.log(`→ ${t.name}: ${target}`)
  await page.goto(target, { waitUntil: "networkidle" })
  await page.waitForTimeout(400)
  const file = path.join(outDir, `${t.name}.png`)
  await page.screenshot({ path: file, fullPage: true })
  console.log(`  ✓ ${file}`)
  await ctx.close()
}

await browser.close()