// P4 screenshot — captures article page (note header + metadata panel)
import { chromium } from "playwright"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, "..", "screenshots")
const baseUrl = "http://localhost:8084"

const browser = await chromium.launch({ headless: true })
const viewports = [
  { name: "desktop-1440-article", width: 1440, height: 900 },
  { name: "tablet-768-article", width: 768, height: 1024 },
  { name: "mobile-390-article", width: 390, height: 844 },
]

const articleUrl = `${baseUrl}/Knowledge/Android/${encodeURIComponent("启动流程")}`

for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  await page.goto(articleUrl, { waitUntil: "networkidle" })
  await page.waitForTimeout(400)
  const file = path.join(outDir, `${vp.name}.png`)
  await page.screenshot({ path: file, fullPage: true })
  console.log(`✓ ${file}`)
  await ctx.close()
}

await browser.close()