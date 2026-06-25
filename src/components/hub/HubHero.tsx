// HubHero — knowledge portal (D27).
//
// Compact per user direction: 120–140px total. Carries:
//   - Hub title
//   - Hub description
// Auto-computed stats (笔记数 / 生长中 / 常青) move into the first hub section
// (compact-list) instead of living in the hero, to keep the hero strictly
// a "portal header".

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import { queryFolder } from "../../lib/contentQuery"
import { getHeroStyle } from "../heroStyles"

interface HubHeroProps {
  hubFile: QuartzPluginData
  allFiles: QuartzPluginData[]
}

interface HubStats {
  total: number
  growing: number
  evergreen: number
}

function computeStats(allFiles: QuartzPluginData[], hubScope: string): HubStats {
  const folderFiles = queryFolder(allFiles, hubScope)
  let growing = 0
  let evergreen = 0
  for (const file of folderFiles) {
    const status = file.frontmatter?.status as string | undefined
    if (status === "growing") growing++
    else if (status === "evergreen") evergreen++
  }
  return { total: folderFiles.length, growing, evergreen }
}

const HUB_HERO_HEIGHT = 130

export function HubHero({ hubFile, allFiles }: HubHeroProps) {
  const title = (hubFile.frontmatter?.title as string | undefined) ?? hubFile.slug
  const description = (hubFile.frontmatter?.description as string | undefined) ?? ""
  const heroStyle = (hubFile.frontmatter?.heroStyle as string | undefined) ?? "mountain"
  const StyleComponent = getHeroStyle(heroStyle)
  const seed = hubFile.slug ?? "hub"

  return (
    <section class="hero hub-hero" style={{ minHeight: `${HUB_HERO_HEIGHT}px` }}>
      <div class="hero-illustration hero-illustration-hub" aria-hidden="true">
        <StyleComponent
          palette={{
            accent: "var(--accent-primary)",
            text: "var(--text-primary)",
            muted: "var(--text-muted)",
            surface: "var(--surface-canvas)",
            surfaceElevated: "var(--surface-elevated)",
          }}
          seed={seed}
          height={HUB_HERO_HEIGHT}
        />
      </div>
      <div class="hero-content hero-content-hub">
        <h1 class="hero-title hero-title-hub">{title}</h1>
        {description && <p class="hero-subtitle hero-subtitle-hub">{description}</p>}
      </div>
    </section>
  )
}

// Re-export stats so the first hub section can render them.
export { computeStats }
export type { HubStats }