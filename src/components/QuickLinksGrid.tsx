// QuickLinksGrid — 4-column link grid for About page.
//
// Renders quickLinks from frontmatter: { [category]: [{ label, href }] }

import type { QuartzComponent, QuartzComponentConstructor } from "../quartz/plugins/types"
import type { QuartzPluginData } from "../quartz/plugins/vfile"

interface QuickLink {
  label: string
  href: string
}

function isQuickLinksMap(val: unknown): val is Record<string, QuickLink[]> {
  if (typeof val !== "object" || val === null || Array.isArray(val)) return false
  return Object.values(val as Record<string, unknown>).every(
    (v) =>
      Array.isArray(v) &&
      v.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as Record<string, unknown>).label === "string" &&
          typeof (item as Record<string, unknown>).href === "string",
      ),
  )
}

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://")
}

const QuickLinksGrid: QuartzComponent = ({ fileData }: { fileData: QuartzPluginData }) => {
  const fm = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const raw = fm.quickLinks
  if (!isQuickLinksMap(raw)) return null

  const categories = Object.entries(raw)
  if (categories.length === 0) return null

  return (
    <div class="about-quick-links">
      <h2 class="about-quick-links-title">快速导航</h2>
      <div class="about-quick-links-grid">
        {categories.map(([category, links]) => (
          <div key={category} class="about-quick-links-column">
            <h3 class="about-quick-links-category">{category}</h3>
            <ul class="about-quick-links-list">
              {links.map((link, idx) => (
                <li key={`${category}-${idx}`}>
                  <a
                    class="about-quick-links-link"
                    href={link.href}
                    rel={isExternal(link.href) ? "noopener noreferrer" : undefined}
                    target={isExternal(link.href) ? "_blank" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default (() => QuickLinksGrid) satisfies QuartzComponentConstructor
