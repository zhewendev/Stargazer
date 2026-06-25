// HomePageType — registers the `home` pageType with the PageTypeDispatcher.
//
// Per design.md D11: matcher is read from src/lib/pageTypeRegistry.ts.
// Per page-type-registry.md notes: pageTypes must register before the
// default `content` pageType so they win when applicable.

import { QuartzPageTypePlugin } from "../types"
import HomePageBody from "../../components/pages/Home"
import { getPageType } from "../../../src/lib/pageTypeRegistry"

const homeSpec = getPageType("home")
if (!homeSpec) {
  throw new Error("[home pageType] not found in PageType Registry (src/lib/pageTypeRegistry.ts)")
}

export const HomePageType: QuartzPageTypePlugin = () => ({
  name: homeSpec.name,
  priority: homeSpec.priority,
  match: homeSpec.match,
  layout: homeSpec.layout,
  body: HomePageBody,
})
