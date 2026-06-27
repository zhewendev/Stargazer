// Navigation — single source of truth for all nav surfaces.
//
// Consumed by:
//   - BrandHeader (top-level links, desktop)
//   - DrawerNav   (top-level links, expandable Knowledge children)
//   - BrandFooter (Explore column)
//
// Future consumers: Breadcrumb, Sitemap, RSS. Add the field to NavItem first,
// then read from this file — never duplicate the list elsewhere.

export interface NavItem {
  id: string
  title: string
  href: string
  icon?: string
  expandable?: boolean
  children?: NavItem[]
  hidden?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { id: "knowledge", title: "知识库", href: "/knowledge", expandable: true },
  { id: "topics", title: "专题", href: "/topics", expandable: true },
  { id: "resources", title: "资源", href: "/resources" },
  { id: "graph", title: "图谱", href: "/graph" },
  { id: "about", title: "关于", href: "/about" },
]

/** Top-level nav items with `hidden` filtered out. */
export function getNavItems(): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.hidden)
}
