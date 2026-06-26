// Phase 1 (Navigation) — capture header, drawer, and footer at three
// breakpoints, plus assert that the nav surface is fully consistent.
//
// Asserts:
//   1. BrandHeader has 5 nav links (Knowledge, Projects, Resources, Graph, About).
//   2. BrandFooter "Explore" column has the same 4 items (minus About).
//   3. Drawer top-level mirrors the header 5 items.
//   4. Drawer Knowledge expandable lists hubs discovered by getHubs().
//   5. Desktop (>= 1200px) hides the .drawer-trigger; tablet/mobile show it.

const { chromium } = require("playwright")
const fs = require("fs")
const path = require("path")

const URL = process.env.URL || "http://localhost:8080/"
const OUT = path.resolve(__dirname, "../screenshots/phase1-navigation")
fs.mkdirSync(OUT, { recursive: true })

const EXPECTED_HEADER_NAV = ["Knowledge", "Projects", "Resources", "Graph", "About"]
const EXPECTED_FOOTER_EXPLORE = ["Knowledge", "Projects", "Resources", "Graph"]
const EXPECTED_DRAWER_TOP = ["knowledge", "projects", "resources", "graph", "about"]
const EXPECTED_DRAWER_HUBS = [
  "生活与效率",
  "阅读与思考",
  "自动化与工具",
  "AI 探索",
  "Android 知识库",
]

async function snapshot(page, viewport, fileSuffix) {
  await page.setViewportSize(viewport)
  await page.goto(URL, { waitUntil: "networkidle" })
  // Give SPA nav and client scripts a moment to settle.
  await page.waitForTimeout(400)

  // Header (full width).
  const header = await page.locator(".brand-header").first()
  await header.screenshot({ path: path.join(OUT, `header-${fileSuffix}.png`) })

  // Open the drawer on tablet/mobile (desktop has no trigger).
  if (viewport.width < 1200) {
    await page.locator(".drawer-trigger").click()
    await page.waitForTimeout(250)
  }
  const drawer = await page.locator("#nav-drawer").first()
  await drawer.screenshot({ path: path.join(OUT, `drawer-${fileSuffix}.png`) })
  if (viewport.width < 1200) {
    // Close drawer for footer capture.
    await page.locator(".drawer-close").click()
    await page.waitForTimeout(200)
  }

  // Footer (full width).
  const footer = await page.locator(".brand-footer").first()
  await footer.screenshot({ path: path.join(OUT, `footer-${fileSuffix}.png`) })

  // Full page.
  await page.screenshot({
    path: path.join(OUT, `home-${fileSuffix}.png`),
    fullPage: true,
  })
}

async function assertNav(page) {
  // 1. Header nav links
  const headerLinks = await page.locator(".brand-header-nav-link").allTextContents()
  console.log(`  Header nav: ${JSON.stringify(headerLinks)}`)
  if (JSON.stringify(headerLinks) !== JSON.stringify(EXPECTED_HEADER_NAV)) {
    throw new Error(
      `Header nav mismatch.\n  expected: ${JSON.stringify(EXPECTED_HEADER_NAV)}\n  got:      ${JSON.stringify(headerLinks)}`,
    )
  }

  // 2. Footer Explore links
  const exploreLinks = await page
    .locator(".brand-footer-section")
    .first()
    .locator(".brand-footer-link")
    .allTextContents()
  console.log(`  Footer Explore: ${JSON.stringify(exploreLinks)}`)
  if (JSON.stringify(exploreLinks) !== JSON.stringify(EXPECTED_FOOTER_EXPLORE)) {
    throw new Error(
      `Footer Explore mismatch.\n  expected: ${JSON.stringify(EXPECTED_FOOTER_EXPLORE)}\n  got:      ${JSON.stringify(exploreLinks)}`,
    )
  }

  // 3. Drawer top-level (labels map to keys; check both data-nav-key and label)
  const drawerKeys = await page.locator("[data-nav-tree] > [data-nav-key]").count()
  // Workaround: use any-level [data-nav-key] but exclude child hubs by depth.
  // The hub children are inside .drawer-item-children; top-level items are direct children of .drawer-tree.
  const topLevel = await page.locator(".drawer-tree > .drawer-item").count()
  const topKeys = []
  const topLabels = []
  const items = page.locator(".drawer-tree > .drawer-item")
  for (let i = 0; i < topLevel; i++) {
    const el = items.nth(i)
    topKeys.push(await el.getAttribute("data-nav-key"))
    topLabels.push(await el.locator(".drawer-item-label").textContent())
  }
  console.log(`  Drawer top-level: ${JSON.stringify({ topKeys, topLabels })}`)
  if (JSON.stringify(topKeys) !== JSON.stringify(EXPECTED_DRAWER_TOP)) {
    throw new Error(
      `Drawer top-level mismatch.\n  expected: ${JSON.stringify(EXPECTED_DRAWER_TOP)}\n  got:      ${JSON.stringify(topKeys)}`,
    )
  }
  if (JSON.stringify(topLabels) !== JSON.stringify(EXPECTED_HEADER_NAV)) {
    throw new Error(
      `Drawer top-level labels mismatch.\n  expected: ${JSON.stringify(EXPECTED_HEADER_NAV)}\n  got:      ${JSON.stringify(topLabels)}`,
    )
  }

  // 4. Drawer hub children
  const hubLabels = await page.locator(".drawer-hub-row .drawer-hub-label").allTextContents()
  console.log(`  Drawer hubs: ${JSON.stringify(hubLabels)}`)
  if (JSON.stringify(hubLabels) !== JSON.stringify(EXPECTED_DRAWER_HUBS)) {
    throw new Error(
      `Drawer hubs mismatch.\n  expected: ${JSON.stringify(EXPECTED_DRAWER_HUBS)}\n  got:      ${JSON.stringify(hubLabels)}`,
    )
  }
}

async function assertDesktopHidesHamburger(page) {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(URL, { waitUntil: "networkidle" })
  await page.waitForTimeout(300)
  const trigger = page.locator(".drawer-trigger").first()
  const visible = await trigger.isVisible()
  console.log(`  Desktop drawer-trigger visible: ${visible}`)
  if (visible) {
    throw new Error("Desktop drawer-trigger should be hidden (>= 1200px)")
  }
}

async function assertTabletShowsHamburger(page) {
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.goto(URL, { waitUntil: "networkidle" })
  await page.waitForTimeout(300)
  const trigger = page.locator(".drawer-trigger").first()
  const visible = await trigger.isVisible()
  console.log(`  Tablet drawer-trigger visible: ${visible}`)
  if (!visible) {
    throw new Error("Tablet drawer-trigger should be visible (< 1200px)")
  }
}

;(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  // Run assertions on the desktop viewport first (most data visible).
  console.log("== Nav consistency assertions ==")
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(URL, { waitUntil: "networkidle" })
  await page.waitForTimeout(400)
  // Open the drawer so its children render in the DOM (it's already in HTML, but this ensures layout).
  await assertNav(page)

  console.log("== Desktop hamburger visibility ==")
  await assertDesktopHidesHamburger(page)

  console.log("== Tablet hamburger visibility ==")
  await assertTabletShowsHamburger(page)

  // Capture screenshots at all three breakpoints.
  console.log("== Screenshots ==")
  await snapshot(page, { width: 1440, height: 900 }, "desktop-1440")
  await snapshot(page, { width: 768, height: 1024 }, "tablet-768")
  await snapshot(page, { width: 390, height: 844 }, "mobile-390")

  await browser.close()
  console.log("OK — all assertions passed, screenshots in", OUT)
})().catch((err) => {
  console.error("FAIL:", err.message)
  process.exit(1)
})
