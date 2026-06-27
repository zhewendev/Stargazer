// HubHeader — title + description + stats for Knowledge Hub pages.
//
// Replaces the generic HubHero for hub pages with a richer header
// that includes the stats row.

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import { HubStats } from "./HubStats"

interface HubHeaderProps {
  hubFile: QuartzPluginData
  allFiles: QuartzPluginData[]
}

export function HubHeader({ hubFile, allFiles }: HubHeaderProps) {
  const fm = (hubFile.frontmatter ?? {}) as Record<string, unknown>
  const title = (fm.title as string) ?? (hubFile.slug ?? "").split("/").pop() ?? ""
  const description = (fm.description as string) ?? ""

  return (
    <div class="hub-header">
      <h1 class="hub-header-title">{title}</h1>
      {description && <p class="hub-header-desc">{description}</p>}
      <HubStats hubFile={hubFile} allFiles={allFiles} />
    </div>
  )
}
