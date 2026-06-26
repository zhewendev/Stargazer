// DrawerNav — brand navigation drawer.
//
// Per design.md D13 (≠ Explorer), D14 (top-level hubs only, scales to 1000+ notes),
// D16 (filter-first, manual navigation on selection), D17 (5 nav items, Knowledge
// expands into hubs).
//
// State managed via body class `drawer-open` and a small inline script registered
// via afterDOMLoaded. Search filters visible items; Enter navigates to focused
// result (or first match); ESC closes; scrim click closes.
//
// Hub enumeration: src/lib/pageTypeRegistry.getHubs() — pageType-driven, not
// path-driven. Adding a new `type: hub` page anywhere in `content/` makes it
// appear in the Knowledge drawer automatically.

import type { QuartzComponent, QuartzComponentProps } from "../../quartz/components/types"
import { getNavItems } from "../lib/navigation"
import { getHubs, type HubEntry } from "../lib/pageTypeRegistry"

const DrawerNav: QuartzComponent = ({ cfg, allFiles }: QuartzComponentProps) => {
  // Knowledge drawer: all hubs from the pageTypeRegistry, minus any whose
  // folder matches a top-level nav item (Projects, Resources). Case-insensitive
  // comparison because filesystem folder names and NAV_ITEMS href segments
  // may differ in case. Future hubs appear automatically — no Drawer code
  // changes needed.
  const topLevelFolders = new Set(
    getNavItems()
      .map((item) => item.href.replace(/^\//, "").toLowerCase())
      .filter((seg) => seg.length > 0),
  )
  const hubs: HubEntry[] = getHubs(allFiles, cfg)
    .filter((hub) => !topLevelFolders.has(hub.folder.toLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title, "zh"))
  const brand = (cfg as any).brand ?? {}
  const brandName = brand.name ?? cfg.pageTitle

  // Compute base path prefix from cfg.baseUrl for GitHub Pages (e.g. "/Stargazer")
  const basePath: string = (() => {
    try {
      if (!(cfg as any).baseUrl) return ""
      const url = new URL(`https://${(cfg as any).baseUrl}`)
      return url.pathname.replace(/\/$/, "")
    } catch { return "" }
  })()

  return (
    <>
      <div class="drawer-scrim" data-drawer-scrim aria-hidden="true" />
      <aside
        id="nav-drawer"
        class="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="导航"
        aria-hidden="true"
      >
        <div class="drawer-header">
          <span class="drawer-brand">{brandName}</span>
          <button
            type="button"
            class="drawer-close"
            aria-label="关闭导航"
          >
            ✕
          </button>
        </div>

        <div class="drawer-search">
          <input
            type="search"
            class="drawer-search-input"
            placeholder="搜索导航…"
            aria-label="搜索导航"
            data-drawer-search
          />
        </div>

        <nav class="drawer-tree" aria-label="抽屉导航" data-drawer-tree>
          {getNavItems().map((item) => {
            if (item.id === "knowledge" && item.expandable) {
              return (
                <div key={item.id} class="drawer-item drawer-item-expandable" data-nav-key={item.id}>
                  <a class="drawer-item-row" href={basePath + item.href}>
                    <span class="drawer-item-label">{item.title}</span>
                    <span class="drawer-item-count">{hubs.length}</span>
                    <span class="drawer-item-chevron" aria-hidden="true">▾</span>
                  </a>
                  {hubs.length > 0 && (
                    <ul class="drawer-item-children">
                      {hubs.map((hub) => (
                        <li key={hub.folder}>
                          <a
                            class="drawer-hub-row"
                            href={basePath + hub.href}
                            data-nav-key={hub.href}
                          >
                            <span class="drawer-hub-label">{hub.title}</span>
                            <span class="drawer-hub-count">({hub.childCount})</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            }
            return (
              <div key={item.id} class="drawer-item" data-nav-key={item.id}>
                <a class="drawer-item-row" href={basePath + item.href}>
                  <span class="drawer-item-label">{item.title}</span>
                </a>
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

// ── Client-side state machine ───────────────────────────────────
DrawerNav.afterDOMLoaded = `
(() => {
  const body = document.body;
  const drawer = document.getElementById("nav-drawer");
  const scrim = document.querySelector("[data-drawer-scrim]");
  const search = document.querySelector("[data-drawer-search]");
  const tree = document.querySelector("[data-drawer-tree]");
  const trigger = document.querySelector(".drawer-trigger");
  const closeBtn = document.querySelector(".drawer-close");
  if (!drawer || !tree) return;

  let lastFocused = null;

  function open() {
    body.classList.add("drawer-open");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    scrim && scrim.classList.add("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    lastFocused = document.activeElement;
    setTimeout(() => search && search.focus(), 50);
  }

  function close() {
    body.classList.remove("drawer-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    scrim && scrim.classList.remove("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    if (search) search.value = "";
    filter("");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function isOpen() {
    return drawer.classList.contains("is-open");
  }

  function filter(q) {
    const needle = q.trim().toLowerCase();
    const items = tree.querySelectorAll("[data-nav-key]");
    items.forEach((el) => {
      const key = (el.getAttribute("data-nav-key") || "").toLowerCase();
      const label = (el.textContent || "").toLowerCase();
      const match = !needle || key.includes(needle) || label.includes(needle);
      el.style.display = match ? "" : "none";
    });
  }

  function visibleItems() {
    return Array.from(tree.querySelectorAll("[data-nav-key]")).filter(
      (el) => el.style.display !== "none",
    );
  }

  function focusedResult() {
    const f = tree.querySelector("[data-nav-focused='true']");
    return f;
  }

  function focusItem(item) {
    tree.querySelectorAll("[data-nav-focused='true']").forEach((el) =>
      el.removeAttribute("data-nav-focused"),
    );
    if (item) item.setAttribute("data-nav-focused", "true");
  }

  function navigateFromFocused() {
    const focused = focusedResult() || visibleItems()[0];
    if (!focused) return;
    const link = focused.querySelector("a") || focused.closest("a");
    if (link) link.click();
  }

  // ── Trigger buttons ───────────────────────────────────────────
  if (trigger) trigger.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (scrim) scrim.addEventListener("click", close);

  // ── Search input ─────────────────────────────────────────────
  if (search) {
    search.addEventListener("input", (e) => filter(e.target.value));
    search.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "Enter") {
        e.preventDefault();
        navigateFromFocused();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const items = visibleItems();
        if (items.length === 0) return;
        const currentIdx = items.findIndex(
          (el) => el === focusedResult(),
        );
        const nextIdx =
          e.key === "ArrowDown"
            ? Math.min(items.length - 1, currentIdx + 1)
            : Math.max(0, currentIdx - 1);
        focusItem(items[nextIdx]);
        items[nextIdx].scrollIntoView({ block: "nearest" });
      }
    });
  }

  // ── Global ESC + click-outside ───────────────────────────────
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      close();
    }
  });

  // ── SPA navigation: close drawer on any nav event ────────────
  document.addEventListener("nav", () => {
    if (isOpen()) close();
  });
})();
`

export default (() => DrawerNav) satisfies QuartzComponent