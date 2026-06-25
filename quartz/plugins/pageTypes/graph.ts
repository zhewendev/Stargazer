// GraphPageType — registers the `graph` pageType with the PageTypeDispatcher.

import { QuartzPageTypePlugin } from "../types"
import GraphPageBody from "../../components/pages/Graph"
import { getPageType } from "../../../src/lib/pageTypeRegistry"

const graphSpec = getPageType("graph")
if (!graphSpec) {
  throw new Error("[graph pageType] not found in PageType Registry (src/lib/pageTypeRegistry.ts)")
}

export const GraphPageType: QuartzPageTypePlugin = () => ({
  name: graphSpec.name,
  priority: graphSpec.priority,
  match: graphSpec.match,
  layout: graphSpec.layout,
  body: GraphPageBody,
})
