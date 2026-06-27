// ArticleMiniGraph — small scoped graph for article right sidebar.
//
// Shows the current article and its direct neighbors (depth=1).
// Uses ScopedGraph with reduced height (~200px).

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import type { QuartzComponent } from "../../quartz/components/types"
import { ScopedGraph } from "./ScopedGraph"

const ArticleMiniGraph: QuartzComponent = ({ fileData, allFiles }: {
  fileData: QuartzPluginData
  allFiles: QuartzPluginData[]
}) => {
  const slug = fileData.slug ?? ""
  if (!slug) return null

  return (
    <div class="article-mini-graph" aria-label="相关图谱">
      <h3 class="article-mini-graph-title">相关图谱</h3>
      <ScopedGraph
        title=""
        height={200}
        filter={{ tags: [] }}
        hubScope={slug.split("/").slice(0, -1).join("/") || undefined}
        allFiles={allFiles}
        fileData={fileData}
      />
    </div>
  )
}

export default (() => ArticleMiniGraph) satisfies () => QuartzComponent
