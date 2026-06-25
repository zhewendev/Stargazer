// Home — pageBody for the root index page.
//
// Fully data-driven per P2 constraint 1: no hardcoded hero copy, featured notes,
// projects, or knowledge areas. Composes Hero + Now + Featured + Projects from
// frontmatter and allFiles.

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import type { GlobalConfiguration } from "../../quartz/cfg"
import type { QuartzComponent } from "../../quartz/components/types"
import { Hero } from "./home/Hero"
import { NowSection } from "./home/NowSection"
import { FeaturedSection } from "./home/FeaturedSection"
import { ProjectsSection } from "./home/ProjectsSection"

type Order = "hero" | "now" | "featured" | "projects"
const DEFAULT_ORDER: Order[] = ["hero", "now", "featured", "projects"]

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
          case "now":
            return <NowSection key="now" allFiles={allFiles} />
          case "featured":
            return <FeaturedSection key="featured" allFiles={allFiles} />
          case "projects":
            return <ProjectsSection key="projects" allFiles={allFiles} />
        }
      })}
    </article>
  )
}

export default (() => Home) satisfies () => QuartzComponent
