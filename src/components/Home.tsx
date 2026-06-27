// Home — pageBody for the root index page.
//
// Fully data-driven per P2 constraint 1: no hardcoded hero copy.
// Composes Hero + KnowledgeAreas + LatestEssays + Quote from
// frontmatter and allFiles.

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import type { GlobalConfiguration } from "../../quartz/cfg"
import type { QuartzComponent } from "../../quartz/components/types"
import { Hero } from "./home/Hero"
import { KnowledgeAreasSection } from "./home/KnowledgeAreasSection"
import { LatestEssaysSection } from "./home/LatestEssaysSection"
import { QuoteSection } from "./home/QuoteSection"

type Order = "hero" | "knowledge-areas" | "latest" | "quote"
const DEFAULT_ORDER: Order[] = ["hero", "knowledge-areas", "latest", "quote"]

function resolveOrder(fileData: QuartzPluginData): Order[] {
  const order = fileData.frontmatter?.sectionOrder as Order[] | undefined
  if (Array.isArray(order) && order.every((o) => DEFAULT_ORDER.includes(o))) {
    return order
  }
  return DEFAULT_ORDER
}

const Home: QuartzComponent = ({ cfg, fileData, allFiles }: {
  cfg: GlobalConfiguration
  fileData: QuartzPluginData
  allFiles: QuartzPluginData[]
}) => {
  const order = resolveOrder(fileData)

  return (
    <article class="home-page">
      {order.map((section) => {
        switch (section) {
          case "hero":
            return <Hero key="hero" cfg={cfg} fileData={fileData} allFiles={allFiles} />
          case "knowledge-areas":
            return <KnowledgeAreasSection key="knowledge-areas" allFiles={allFiles} />
          case "latest":
            return <LatestEssaysSection key="latest" allFiles={allFiles} />
          case "quote":
            return <QuoteSection key="quote" cfg={cfg} fileData={fileData} />
        }
      })}
    </article>
  )
}

export default (() => Home) satisfies () => QuartzComponent
