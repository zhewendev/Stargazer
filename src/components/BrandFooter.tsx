// BrandFooter — second navigation entrance for the Digital Garden.
//
// Per the navigation architecture refactor: footer is NOT a copy of the
// header. Four zones:
//
//   1. Explore  — top-level nav items except About (Knowledge, Projects,
//                 Resources, Graph), consumed from src/lib/navigation.ts
//   2. Connect  — social links (GitHub, RSS, Email) — separate lifecycle
//                 from nav, kept as a local DEFAULT_SOCIALS constant
//   3. About    — ↑ Top action
//   4. Motto    — cfg.brand.motto + copyright + Built with Quartz
//
// Social links are read from cfg.brand.social when available, with
// sensible defaults so the footer works without any configuration.

import type { QuartzComponent, QuartzComponentProps } from "../../quartz/components/types"
import { readFileSync } from "fs"
import { join } from "path"
import { getNavItems } from "../lib/navigation"

interface SocialLink {
  key: string
  label: string
  href: string
  icon: string
}

const DEFAULT_SOCIALS: SocialLink[] = [
  { key: "github", label: "GitHub", href: "https://github.com/zhewendev", icon: "⌘" },
  { key: "email", label: "Email", href: "mailto:zhewendev@gmail.com", icon: "✉" },
  { key: "rss", label: "RSS", href: "/index.xml", icon: "⊿" },
]

function resolveSocials(cfg: any): SocialLink[] {
  const social = cfg?.brand?.social as Record<string, string> | undefined
  if (!social) return DEFAULT_SOCIALS
  return DEFAULT_SOCIALS.map((s) => ({
    ...s,
    href: social[s.key] ?? s.href,
  }))
}

function getQuartzVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8"))
    return pkg?.version ?? ""
  } catch { return "" }
}

const BrandFooter: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  const year = new Date().getFullYear()
  const brand = (cfg as any)?.brand ?? {}
  const author = brand.name ?? "温哲"
  const motto = brand.motto ?? "Growing slowly, learning publicly."
  const socials = resolveSocials(cfg as any)
  const version = getQuartzVersion()

  // Compute base path prefix from cfg.baseUrl for GitHub Pages (e.g. "/Stargazer")
  const basePath: string = (() => {
    try {
      if (!(cfg as any).baseUrl) return ""
      const url = new URL(`https://${(cfg as any).baseUrl}`)
      return url.pathname.replace(/\/$/, "")
    } catch { return "" }
  })()

  // Explore column: top-level nav minus About (About lives in its own column).
  const exploreItems = getNavItems().filter((item) => item.id !== "about")

  return (
    <footer class="brand-footer">
      <div class="brand-footer-grid">
        <section class="brand-footer-section">
          <h3 class="brand-footer-heading">Explore</h3>
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

        <section class="brand-footer-section">
          <h3 class="brand-footer-heading">Connect</h3>
          <ul class="brand-footer-list">
            {socials.map((s) => (
              <li key={s.key}>
                <a
                  class="brand-footer-link"
                  href={s.href}
                  aria-label={s.label}
                  rel={s.key === "rss" ? "alternate" : s.key === "github" ? "me" : undefined}
                >
                  <span class="brand-footer-link-icon" aria-hidden="true">{s.icon}</span>
                  <span>{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section class="brand-footer-section">
          <h3 class="brand-footer-heading">About</h3>
          <ul class="brand-footer-list">
            <li>
              <a class="brand-footer-link" href="#" aria-label="回到顶部">
                ↑ Top
              </a>
            </li>
          </ul>
        </section>
      </div>

      <hr class="brand-footer-rule" />

      <p class="brand-footer-motto">{motto}</p>

      <p class="brand-footer-credit">
        © {year} {author} · Built with{" "}
        <a href="https://quartz.jzhao.xyz/">Quartz{version ? ` v${version}` : ""}</a>
      </p>
    </footer>
  )
}

export default (() => BrandFooter) satisfies QuartzComponent
