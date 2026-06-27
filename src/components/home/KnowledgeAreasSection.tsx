// KnowledgeAreasSection — 5 area cards on Home, one per Knowledge hub.
//
// Data-driven: enumerates all `type: hub` pages under Knowledge/ and renders
// a card with title, description, and child count.

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import { getHubs } from "../../lib/pageTypeRegistry"
import { SectionShell } from "./SectionShell"
import { resolveRelative, FullSlug } from "../../../quartz/util/path"

interface KnowledgeAreasSectionProps {
  allFiles: QuartzPluginData[]
}

export function KnowledgeAreasSection({ allFiles }: KnowledgeAreasSectionProps) {
  const hubs = getHubs(allFiles)
    .filter((hub) => hub.folder.startsWith("Knowledge/"))
    .sort((a, b) => b.childCount - a.childCount)

  if (hubs.length === 0) return null

  return (
    <SectionShell title="探索知识领域">
      <div class="knowledge-areas-grid">
        {hubs.map((hub) => {
          const href = resolveRelative("index" as FullSlug, (hub.folder + "/index") as FullSlug)
          return (
            <a key={hub.folder} class="knowledge-area-card" href={href}>
            <h3 class="knowledge-area-title">{hub.title}</h3>
            {hub.description && (
              <p class="knowledge-area-desc">{hub.description}</p>
            )}
            <span class="knowledge-area-count">{hub.childCount} 笔记</span>
          </a>
          )
        })}
      </div>
    </SectionShell>
  )
}
