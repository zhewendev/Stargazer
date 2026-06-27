// BrandHeader — personal-brand-focused top navigation.
//
// Per design.md D15 (brand emphasis) and D17 (navigation contract).
// Renders: ☰ trigger (tablet/mobile only) · brand lockup · 5 nav links · 🔎
// The header does NOT render the page title (that's article-title's job).
// All nav data comes from src/lib/navigation.ts — no local copy.

import type { QuartzComponent, QuartzComponentProps } from "../../quartz/components/types"
import { resolveRelative, FullSlug } from "../../quartz/util/path"
import { getNavItems } from "../lib/navigation"

const BrandHeader: QuartzComponent = ({ cfg, fileData }: QuartzComponentProps) => {
  const brand = (cfg as Record<string, unknown>)?.brand as Record<string, string> | undefined ?? {}
  const brandName = brand?.name ?? cfg.pageTitle
  const tagline = brand?.tagline ?? "Digital Garden"
  const logo = brand?.logo ?? "✦"
  const homeHref = resolveRelative(fileData.slug as FullSlug, "index" as FullSlug)

  // Compute base path prefix from cfg.baseUrl for GitHub Pages (e.g. "/Stargazer")
  const basePath: string = (() => {
    try {
      if (!cfg.baseUrl) return ""
      const url = new URL(`https://${cfg.baseUrl}`)
      return url.pathname.replace(/\/$/, "")
    } catch { return "" }
  })()

  return (
    <header class="brand-header">
      <div class="brand-header-left">
        <button
          type="button"
          class="drawer-trigger"
          aria-label="打开导航"
          aria-controls="nav-drawer"
          aria-expanded="false"
        >
          ☰
        </button>
        <a href={homeHref} class="brand-header-brand">
          <span class="brand-header-brand-icon" aria-hidden="true">{logo}</span>
          <span class="brand-header-brand-name">{brandName}</span>
          <span class="brand-header-brand-divider">·</span>
          <span class="brand-header-brand-tagline">{tagline}</span>
        </a>
      </div>

      <nav class="brand-header-nav" aria-label="主要导航">
        {getNavItems().map((item) => (
          <a key={item.id} class="brand-header-nav-link" href={basePath + item.href}>
            {item.title}
          </a>
        ))}
      </nav>

      <div class="brand-header-right">
        <button
          type="button"
          class="search-trigger"
          aria-label="搜索"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>
    </header>
  )
}

export default (() => BrandHeader) satisfies QuartzComponent