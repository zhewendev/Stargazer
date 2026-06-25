// BrandFooter — personal-brand-themed footer.
//
// Per P8: renders copyright line, social links (GitHub, Email, RSS),
// and theme attribution. Injected into every pageType by config-loader.
//
// Social links are read from cfg.brand.social when available, with
// sensible defaults so the footer works without any configuration.

import type { QuartzComponent, QuartzComponentProps } from "../../quartz/components/types"
import { readFileSync } from "fs"
import { join } from "path"

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
  const socials = resolveSocials(cfg as any)
  const version = getQuartzVersion()

  return (
    <footer class="brand-footer">
      <div class="brand-footer-socials">
        {socials.map((s) => (
          <a
            key={s.key}
            class="brand-footer-social-link"
            href={s.href}
            aria-label={s.label}
            rel={s.key === "rss" ? "alternate" : s.key === "github" ? "me" : undefined}
          >
            <span class="brand-footer-social-icon" aria-hidden="true">{s.icon}</span>
            <span class="brand-footer-social-label">{s.label}</span>
          </a>
        ))}
      </div>
      <p class="brand-footer-credit">
        © {year} {author} · Created with{" "}
        <a href="https://quartz.jzhao.xyz/">Quartz{version ? ` v${version}` : ""}</a>
      </p>
    </footer>
  )
}

export default (() => BrandFooter) satisfies QuartzComponent
