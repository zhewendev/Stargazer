// Home Hero — brand entry, restrained illustration (D23-D25, D27).
//
// Per D24 hierarchy (primary identity → domain → form):
//   1. 温哲 (cfg.brand.name)         — primary identifier (h1)
//   2. Stargazer · Digital Garden     — brand context (small line above h1)
//   3. Android × AI × Automation      — domain (subtitle)
// Home/hero.md can override subtitle/tagline for richer copy and add CTAs.

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import type { GlobalConfiguration } from "../../../quartz/cfg"
import { getHeroStyle } from "../heroStyles"

interface HeroProps {
  cfg: GlobalConfiguration
  fileData: QuartzPluginData
  allFiles: QuartzPluginData[]
}

interface HeroFrontmatter {
  subtitle?: string
  tagline?: string
  ctas?: Array<{ label: string; url: string; variant?: "primary" | "secondary" }>
}

function findHeroFile(allFiles: QuartzPluginData[]): QuartzPluginData | undefined {
  return allFiles.find(
    (f) =>
      f.slug === "home/hero" || (f.slug ?? "").endsWith("/home/hero"),
  )
}

const HERO_HEIGHT = 260

export function Hero({ cfg, fileData, allFiles }: HeroProps) {
  // Brand identity (per D24 hierarchy).
  const brand = (cfg as Record<string, unknown>)?.brand as Record<string, string> | undefined ?? {}
  const brandName = brand?.name ?? cfg.pageTitle
  const brandProject = brand?.project ?? ""
  const brandForm = brand?.form ?? ""
  const brandContext = [brandProject, brandForm].filter(Boolean).join(" · ")
  const brandDomain = brand?.domain ?? ""

  // Compute base path prefix from cfg.baseUrl for GitHub Pages (e.g. "/Stargazer")
  const basePath: string = (() => {
    try {
      if (!cfg.baseUrl) return ""
      const url = new URL(`https://${cfg.baseUrl}`)
      return url.pathname.replace(/\/$/, "")
    } catch { return "" }
  })()

  // Optional richer overrides from Home/hero.md.
  const heroFile = findHeroFile(allFiles)
  const fm = (heroFile?.frontmatter ?? {}) as HeroFrontmatter
  const subtitle = fm.subtitle ?? brandDomain
  const tagline = fm.tagline ?? ""
  const ctas = Array.isArray(fm.ctas) ? fm.ctas : []

  const heroStyle = (fileData.frontmatter?.heroStyle as string | undefined) ?? "mountain"
  const StyleComponent = getHeroStyle(heroStyle)
  const seed = (fileData.slug as string | undefined) ?? "home"

  return (
    <section class="hero hero-home" style={{ minHeight: `${HERO_HEIGHT}px` }}>
      <div class="hero-illustration" aria-hidden="true">
        <StyleComponent
          palette={{
            accent: "var(--accent-primary)",
            text: "var(--text-primary)",
            muted: "var(--text-muted)",
            surface: "var(--surface-canvas)",
            surfaceElevated: "var(--surface-elevated)",
          }}
          seed={seed}
          height={HERO_HEIGHT}
        />
      </div>
      <div class="hero-content">
        {brandContext && <p class="hero-brand-context">{brandContext}</p>}
        <h1 class="hero-title">{brandName}</h1>
        {subtitle && <p class="hero-subtitle">{subtitle}</p>}
        {tagline && <p class="hero-tagline">{tagline}</p>}
        {ctas.length > 0 && (
          <div class="hero-cta">
            {ctas.map((cta, i) => (
              <a
                key={i}
                href={basePath + cta.url}
                class={`btn btn-${cta.variant ?? (i === 0 ? "primary" : "secondary")}`}
              >
                {cta.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}