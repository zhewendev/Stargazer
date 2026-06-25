// HubPageType — registers the `hub` pageType with the PageTypeDispatcher.
//
// Per design.md D11.

import { QuartzPageTypePlugin } from "../types"
import HubPageBody from "../../components/pages/Hub"
import { getPageType } from "../../../src/lib/pageTypeRegistry"

const hubSpec = getPageType("hub")
if (!hubSpec) {
  throw new Error("[hub pageType] not found in PageType Registry (src/lib/pageTypeRegistry.ts)")
}

export const HubPageType: QuartzPageTypePlugin = () => ({
  name: hubSpec.name,
  priority: hubSpec.priority,
  match: hubSpec.match,
  layout: hubSpec.layout,
  body: HubPageBody,
})
