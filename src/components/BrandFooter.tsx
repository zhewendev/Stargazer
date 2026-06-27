// BrandFooter — 4-column footer per design.
//
// Columns: 探索 · 花园 · 联系 · 关于
// Bottom: brand name + motto + copyright + last updated

import type { QuartzComponent, QuartzComponentProps } from "../../quartz/components/types"
import type { GlobalConfiguration } from "../../quartz/cfg"
import { getNavItems } from "../lib/navigation"

interface SocialLink {
  key: string
  label: string
  href: string
  icon: string
}

interface BrandConfig {
  name?: string
  motto?: string
  social?: Record<string, string>
  lastUpdated?: string
}

const DEFAULT_SOCIALS: SocialLink[] = [
  { key: "github", label: "GitHub", href: "https://github.com/zhewendev", icon: "⌘" },
  { key: "email", label: "Email", href: "mailto:zhewendev@gmail.com", icon: "✉" },
  { key: "rss", label: "RSS 订阅", href: "/index.xml", icon: "⊿" },
]

function resolveSocials(cfg: GlobalConfiguration): SocialLink[] {
  const brand = (cfg as Record<string, unknown>)?.brand as BrandConfig | undefined
  const social = brand?.social
  if (!social) return DEFAULT_SOCIALS
  return DEFAULT_SOCIALS.map((s) => ({
    ...s,
    href: social[s.key] ?? s.href,
  }))
}

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://")
}

const GARDEN_LINKS = [
  { label: "随机游走", href: "#" },
  { label: "最新动态", href: "#" },
  { label: "归档", href: "#" },
]

const ABOUT_LINKS = [
  { label: "关于花园", href: "/about" },
  { label: "说明文档", href: "#" },
  { label: "开源地址", href: "https://github.com/zhewendev/Stargazer" },
]

const BrandFooter: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  const year = new Date().getFullYear()
  const brand = (cfg as Record<string, unknown>)?.brand as BrandConfig | undefined
  const author = brand?.name ?? "温哲"
  const motto = brand?.motto ?? "Growing slowly, learning publicly."
  const socials = resolveSocials(cfg)

  // Compute base path prefix from cfg.baseUrl for GitHub Pages (e.g. "/Stargazer")
  const basePath: string = (() => {
    try {
      if (!cfg.baseUrl) return ""
      const url = new URL(`https://${cfg.baseUrl}`)
      return url.pathname.replace(/\/$/, "")
    } catch { return "" }
  })()

  // Explore column: top-level nav items
  const exploreItems = getNavItems()

  return (
    <footer class="brand-footer">
      <div class="brand-footer-grid">
        {/* Column 1: 探索 */}
        <section class="brand-footer-section">
          <h3 class="brand-footer-heading">探索</h3>
          <ul class="brand-footer-list">
            {exploreItems.map((item) => (
              <li key={item.id}>
                <a class="brand-footer-link" href={basePath + item.href}>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Column 2: 花园 (titles only, no links yet) */}
        <section class="brand-footer-section">
          <h3 class="brand-footer-heading">花园</h3>
          <ul class="brand-footer-list">
            {GARDEN_LINKS.map((link) => (
              <li key={link.label}>
                <span class="brand-footer-text" aria-disabled="true">{link.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Column 3: 联系 */}
        <section class="brand-footer-section">
          <h3 class="brand-footer-heading">联系</h3>
          <ul class="brand-footer-list">
            {socials.map((s) => (
              <li key={s.key}>
                <a
                  class="brand-footer-link"
                  href={s.href}
                  aria-label={s.label}
                  rel={
                    s.key === "rss"
                      ? "alternate"
                      : s.key === "github"
                        ? "me"
                        : isExternal(s.href)
                          ? "noopener noreferrer"
                          : undefined
                  }
                  target={isExternal(s.href) ? "_blank" : undefined}
                >
                  <span class="brand-footer-link-icon" aria-hidden="true">{s.icon}</span>
                  <span>{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Column 4: 关于 */}
        <section class="brand-footer-section">
          <h3 class="brand-footer-heading">关于</h3>
          <ul class="brand-footer-list">
            {ABOUT_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  class="brand-footer-link"
                  href={link.href}
                  rel={isExternal(link.href) ? "noopener noreferrer" : undefined}
                  target={isExternal(link.href) ? "_blank" : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <hr class="brand-footer-rule" />

      <div class="brand-footer-bottom">
        <div class="brand-footer-brand">
          <span class="brand-footer-brand-name">{author}</span>
          <span class="brand-footer-brand-suffix">Stargazer Digital Garden</span>
        </div>
        <p class="brand-footer-motto">{motto}</p>
        <p class="brand-footer-credit">
          © {year} {author} · 最后更新 {brand?.lastUpdated ?? new Date().toISOString().slice(0, 10)}
        </p>
      </div>
    </footer>
  )
}

export default (() => BrandFooter) satisfies QuartzComponent
