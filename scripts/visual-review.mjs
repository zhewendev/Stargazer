// Visual review — P1 Foundation
// Captures 6 screenshots: 3 viewports × 2 pages (/ and /graph).

import { chromium } from "playwright"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, "..", "screenshots")
const baseUrl = "http://localhost:8086"

const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
]

const pages = [
  { name: "home", path: "/" },
  { name: "graph", path: "/graph" },
]

const browser = await chromium.launch({ headless: true })

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

  for (const p of pages) {
    const url = baseUrl + p.path
    console.log(`  → ${vp.name} × ${p.name}: ${url}`)
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 15000 })
    if (!response || !response.ok()) {
      console.error(`    ✗ HTTP ${response?.status() ?? "?"}`)
      continue
    }
    await page.waitForTimeout(500)
    const file = path.join(outDir, `${vp.name}-${p.name}.png`)
    await page.screenshot({ path: file, fullPage: true })
    const { size } = await import("node:fs").then((m) => m.promises.stat(file))
    console.log(`    ✓ ${file} (${size} bytes)`)
  }

  await context.close()
}

await browser.close()
console.log("Done.")
