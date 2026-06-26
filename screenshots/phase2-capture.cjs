// Phase 2 screenshot script.
// Captures Home page at 1440 / 768 / 390 px viewports.
// Verifies theme polish (subtle StatusChip in cards, breathing space, calm density).

const { chromium } = require("playwright")
const fs = require("fs")
const path = require("path")

const OUT_DIR = path.join(process.cwd(), "screenshots", "phase2")
fs.mkdirSync(OUT_DIR, { recursive: true })

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900, dpr: 1 },
  { name: "tablet-768", width: 768, height: 1024, dpr: 1 },
  { name: "mobile-390", width: 390, height: 844, dpr: 2 },
]

const URL = "http://localhost:8080/"

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const results = []

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dpr,
    })
    const page = await context.newPage()

    const consoleErrors = []
    page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`))
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(`console: ${msg.text()}`)
    })

    const resp = await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 })
    const status = resp ? resp.status() : 0

    // Wait briefly for any post-load styling to settle.
    await page.waitForTimeout(500)

    const filePath = path.join(OUT_DIR, `home-${vp.name}.png`)
    await page.screenshot({
      path: filePath,
      fullPage: true,
      animations: "disabled",
    })

    // Capture structural assertions.
    const assertions = await page.evaluate(() => {
      const cardEls = document.querySelectorAll(".card, .featured-card, .hub-card")
      const statusChipsInCards = document.querySelectorAll(
        ".card .status-chip, .featured-card .status-chip, .hub-card .status-chip",
      )
      const brandHeader = document.querySelector(".brand-header")
      const heroTitle = document.querySelector(".hero-title")
      const bodyText = document.body
      const computedBody = window.getComputedStyle(document.body)
      const computedH1 = document.querySelector("h1")
        ? window.getComputedStyle(document.querySelector("h1"))
        : null

      // Measure subtle chip on first card if present
      let subtleChipSample = null
      if (statusChipsInCards.length > 0) {
        const cs = window.getComputedStyle(statusChipsInCards[0])
        subtleChipSample = {
          fontSize: cs.fontSize,
          padding: cs.padding,
          opacity: cs.opacity,
          background: cs.backgroundColor,
        }
      }

      return {
        cardCount: cardEls.length,
        statusChipInCardCount: statusChipsInCards.length,
        hasHeader: Boolean(brandHeader),
        hasHeroTitle: Boolean(heroTitle),
        bodyFontSize: computedBody.fontSize,
        bodyLineHeight: computedBody.lineHeight,
        bodyColor: computedBody.color,
        h1FontSize: computedH1 ? computedH1.fontSize : null,
        h1LineHeight: computedH1 ? computedH1.lineHeight : null,
        subtleChipSample,
        title: document.title,
      }
    })

    const stats = fs.statSync(filePath)
    results.push({
      viewport: vp.name,
      status,
      screenshot: filePath,
      bytes: stats.size,
      consoleErrors,
      assertions,
    })

    await context.close()
  }

  await browser.close()
  console.log(JSON.stringify(results, null, 2))
})().catch((err) => {
  console.error("FATAL:", err.message)
  process.exit(1)
})