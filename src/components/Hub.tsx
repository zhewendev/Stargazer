// Hub — pageBody for folder index pages with `type: hub`.
//
// Per P2 constraint 2: generic, driven entirely by `type: hub` + `sections: []`.
// No hardcoded knowledge of what a Hub contains. Iterates the sections DSL and
// delegates rendering to HubSectionDispatcher.

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import type { QuartzComponent } from "../../quartz/components/types"
import { HubHero } from "./hub/HubHero"
import {
  HubSectionDispatcher,
  type HubSectionSpec,
} from "./hub/sections"

const ALLOWED_TYPES: HubSectionSpec["type"][] = ["cards", "list", "compact-list", "graph"]

function validateSections(raw: unknown): HubSectionSpec[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((s: any, idx: number): HubSectionSpec[] => {
    if (!s || typeof s !== "object") return []
    if (typeof s.title !== "string") return []
    if (!ALLOWED_TYPES.includes(s.type)) {
      console.warn(
        `[hub] section #${idx} has invalid type: ${s.type}; allowed: ${ALLOWED_TYPES.join(", ")}`,
      )
      return []
    }
    return [{
      title: s.title,
      type: s.type,
      filter: s.filter,
      match: s.match,
      limit: s.limit,
      height: s.height,
      scope: s.scope,
    }]
  })
}

const Hub: QuartzComponent = ({ fileData, allFiles }: {
  fileData: QuartzPluginData
  allFiles: QuartzPluginData[]
}) => {
  const type = fileData.frontmatter?.type as string | undefined
  if (type !== "hub") {
    // Defensive: shouldn't reach here because matcher filters, but keep guard.
    return null
  }

  const sections = validateSections(fileData.frontmatter?.sections)
  const hubHeroDisabled = fileData.frontmatter?.hubHero === false
  const hubScope = (fileData.slug ?? "").replace(/\/index$/, "")

  if (sections.length === 0) {
    console.warn(
      `[hub] ${fileData.slug} has no sections; add a 'sections' array to its index.md`,
    )
  }

  return (
    <article class="hub-page">
      {!hubHeroDisabled && <HubHero hubFile={fileData} allFiles={allFiles} hubScope={hubScope} />}
      <div class="hub-sections">
        {sections.map((spec, i) => (
          <HubSectionDispatcher
            key={`${spec.type}-${i}`}
            spec={spec}
            allFiles={allFiles}
            hubScope={hubScope}
          />
        ))}
      </div>
    </article>
  )
}

export default (() => Hub) satisfies () => QuartzComponent
