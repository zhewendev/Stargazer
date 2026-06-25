// Drawer interaction test — clicks the drawer trigger and screenshots the open state.

import { chromium } from "playwright"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, "..", "screenshots")
const baseUrl = "http://localhost:8083"

const browser = await chromium.launch({ headless: true })

const tests = [
  { name: "desktop-1440-drawer-open", width: 1440, height: 900 },
  { name: "mobile-390-drawer-open", width: 390, height: 844 },
]

for (const t of tests) {
  const ctx = await browser.newContext({ viewport: { width: t.width, height: t.height } })
  const page = await ctx.newPage()
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" })
  await page.waitForTimeout(400)
  await page.click(".drawer-trigger")
  await page.waitForTimeout(500)
  // Type in search to verify filter behavior
  if (t.name.includes("desktop")) {
    await page.fill(".drawer-search-input", "android")
    await page.waitForTimeout(300)
  }
  const file = path.join(outDir, `${t.name}.png`)
  await page.screenshot({ path: file, fullPage: false })
  console.log(`✓ ${file}`)
  await ctx.close()
}

await browser.close()