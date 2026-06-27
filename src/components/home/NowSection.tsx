// NowSection — lists files under content/Now/.
//
// Data source: content/Now/*.md. Each file is a card with title (frontmatter
// or filename), description (frontmatter.description), and icon (frontmatter.icon).
//
// Per home-page.md requirement.

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import { queryFolder } from "../../lib/contentQuery"
import { SectionShell } from "./SectionShell"
import { resolveRelative, FullSlug } from "../../../quartz/util/path"

interface NowSectionProps {
  allFiles: QuartzPluginData[]
}

function displayTitle(file: QuartzPluginData): string {
  const fmTitle = file.frontmatter?.title as string | undefined
  if (fmTitle) return fmTitle
  // Fall back to filename without extension
  const slug = file.slug ?? ""
  const base = slug.split("/").pop() ?? slug
  return base
}

export function NowSection({ allFiles }: NowSectionProps) {
  const tracks = queryFolder(allFiles, "now")

  if (tracks.length === 0) {
    return (
      <SectionShell title="现在在做">
        <div class="now-grid">
          <article class="now-card">
            <div class="now-card-icon" aria-hidden="true">·</div>
            <div>
              <h3 class="now-card-title">尚未添加</h3>
              <p class="now-card-desc">在 content/Now/ 下添加笔记即可在此显示。</p>
            </div>
          </article>
        </div>
      </SectionShell>
    )
  }
  return (
    <SectionShell title="现在在做" moreHref={resolveRelative("index" as FullSlug, "Now/index" as FullSlug)}>
      <div class="now-grid">
        {tracks.map((track) => {
          const href = resolveRelative("index" as FullSlug, track.slug as FullSlug)
          const title = displayTitle(track)
          const desc = (track.frontmatter?.description as string | undefined) ?? ""
          const icon = (track.frontmatter?.icon as string | undefined) ?? "·"
          return (
            <a key={track.slug} class="now-card" href={href}>
              <div class="now-card-icon" aria-hidden="true">{icon}</div>
              <div>
                <h3 class="now-card-title">{title}</h3>
                {desc && <p class="now-card-desc">{desc}</p>}
              </div>
            </a>
          )
        })}
      </div>
    </SectionShell>
  )
}
