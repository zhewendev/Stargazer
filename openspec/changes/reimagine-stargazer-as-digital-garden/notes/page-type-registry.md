# PageType Registry — Design Note

> Reference for P2 implementation. Captures the Quartz pageType architecture,
> the two new pageTypes we're introducing (`home`, `hub`), their matchers,
> dispatch ordering, file touchpoints, and integration considerations.

## 1. How Quartz Dispatches a Page to a PageType

```
content/foo.md
   ↓
parsed fileData { slug, frontmatter, … }
   ↓
PageTypeDispatcher.emit()   ← quartz/plugins/pageTypes/dispatcher.ts
   ↓
for each pageType in cfg.plugins.pageTypes:
   if pageType.match(fileData):  ← matcher decides
       render with pageType.body + layout.byPageType[pageType.layout]
       break
```

**Key files:**
- `quartz/plugins/pageTypes/dispatcher.ts` — walks pageTypes, calls each `match()`
- `quartz/plugins/pageTypes/index.ts` — re-exports pageTypes for registration
- `quartz/plugins/emitters/<name>.ts` — registers a pageType (one emitter per pageType)
- `quartz/cfg.ts` — defines `FullPageLayout` shape and `byPageType` config

**A pageType emitter declares:**
```ts
{
  name: "home",
  layout: "home",                  // ← key into layout.byPageType
  body: (() => <HomePage … />),    // ← JSX rendered as pageBody
  match: (fileData) => boolean,    // ← returns true if this pageType wins
  order?: number,                  // ← lower wins ties (optional)
  frame?: string,                  // ← optional CSS frame id
}
```

## 2. Built-in PageTypes Already in Quartz 5

Looking at `quartz/plugins/pageTypes/index.ts` and the default config:

| PageType | Match | Layout | Notes |
|---|---|---|---|
| `404` | `slug === "404"` | — | Hardcoded, unconditional |
| `content` | every other page | `content` | The default Quartz reader |

There is **no** dedicated `home` or `hub` pageType in core. The `content` pageType handles everything by default.

## 3. New PageTypes: `home` and `hub`

### `home`

```ts
// quartz/plugins/emitters/home.ts
{
  name: "home",
  layout: "home",
  body: () => <HomePage />,            // ← imports from src/components/home/Home.tsx
  match: (fileData) =>
    fileData.slug === "index" &&
    fileData.frontmatter?.type === "home",
}
```

**Why explicit `type: home` frontmatter match?** The root `index.md` slug is special — Quartz treats it as the canonical home. Without the `type: home` gate, any folder's `index.md` would also match (folder indices have `slug: "Knowledge/Android/index"` or similar, not `"index"`, so the slug check actually suffices alone — but the frontmatter gate is safer for future slug changes).

### `hub`

```ts
// quartz/plugins/emitters/hub.ts
{
  name: "hub",
  layout: "hub",
  body: () => <HubPage />,
  match: (fileData) =>
    fileData.frontmatter?.type === "hub" &&
    isFolderPath(fileData.slug ?? ""),
}
```

**Why folder-path check?** A regular note with `type: hub` in frontmatter (unusual) should not trigger Hub rendering. The folder check ensures only `*/index.md` files with `type: hub` match.

## 4. Dispatch Order

Both new pageTypes must register **before** the default `content` pageType so they win when applicable. In `quartz/plugins/pageTypes/index.ts`, the order is:

```ts
export const PageTypeRegistry: QuartzPageTypePlugin[] = [
  // existing
  FourOhFour,
  ContentPage,

  // new — order matters, declared first so they match before ContentPage
  HomePageType,
  HubPageType,
]
```

The dispatcher iterates in array order and uses the **first match**. Since `ContentPage.match()` is a fallback (`return true`), placing our types first ensures they win when applicable.

## 5. Layout Composition (per pageType)

Each new pageType gets its own entry in `quartz.config.yaml`:

```yaml
layout:
  byPageType:
    "404":
      positions: { beforeBody: [], left: [], right: [] }
    "content": {}
    "home":
      positions:
        beforeBody: []
        left: []
        right: []
      # Home has full width: no sidebars, no TOC, no backlinks
    "hub":
      positions:
        beforeBody: [Breadcrumbs]
        left: [Explorer]               # desktop-only
        right: [TOC, Backlinks]
    "folder": {}
    "tag": {}
    "canvas": {}
    "bases": {}
```

Plus the `header` slot must include `BrandHeader` (and `DrawerNav` on mobile) — see P3 for the actual wiring.

## 6. File Touchpoints for P2

```
NEW FILES
─────────
quartz/components/pages/Home.tsx        # pageBody component for home
quartz/components/pages/Hub.tsx         # pageBody component for hub
quartz/plugins/emitters/home.ts         # registers home pageType
quartz/plugins/emitters/hub.ts          # registers hub pageType

MODIFIED FILES
──────────────
quartz/plugins/emitters/index.ts        # export new emitters
quartz/plugins/pageTypes/index.ts       # register new pageTypes (before ContentPage)
quartz/plugins/types.ts                 # (no change expected — types already exist)
quartz.config.yaml                      # add layout.byPageType.home + layout.byPageType.hub
```

## 7. Frontmatter Validation (P2 task 2.6)

The validation hook is **not** a pageType-level concern; it runs at content-parse time. Two options:

**A. Custom transformer plugin** (recommended — matches Quartz plugin patterns):
```ts
// quartz/plugins/transformers/frontmatter.ts
export const FrontmatterValidator: QuartzTransformerPlugin = {
  name: "FrontmatterValidator",
  textTransform(_ctx, src) { /* parse + validate YAML */ },
  // throw on invalid frontmatter to fail the build
}
```

**B. Inline check in emitter** — simpler but mixes concerns.

Use **A**. Throw with a clear file-path-anchored message:
```
ERROR  content/Knowledge/Android/foo.md
       Note has `featured: true` but no `featuredType`.
       Add one of: featuredType: article | project | note
```

## 8. Integration Considerations

1. **Slug `index` collision risk** — if someone has both `content/index.md` with `type: home` AND a folder with an `index.md` declaring `type: hub`, the slug check `slug === "index"` only fires for the root. Folder indices slugify to `Knowledge/Android/index`, not `index`. Safe.

2. **Default `content` pageType fallback** — if neither `home` nor `hub` matches (e.g., a regular note with no special frontmatter), `ContentPage` renders. Existing reading experience preserved.

3. **SPA transitions** — Quartz's SPA needs to swap `pageBody` between pageTypes. The dispatcher already handles this; no special wiring needed.

4. **404 page** — explicit pageType, doesn't go through our matchers. No changes needed.

5. **First-build verification** — after wiring emitters, run `npx quartz build`. If both `home` and `hub` pageTypes register without throwing, the system is correctly extended. Then update `content/index.md` with `type: home` and confirm the home page renders our JSX instead of the default content layout.

## 9. Open Considerations

- **Folder-page cohabitation** — should a folder's `index.md` without `type: hub` still render with the default folder-page? **Yes** — `ContentPage` handles it.
- **Tag-page cohabitation** — same answer for `tag-page` plugin. Tag pages render with `ContentPage` unless we add a `tag` pageType (out of scope for P2).
- **What if `type: home` is set on a non-root index?** The slug check catches it (slug would not be `"index"`). Build continues normally.
- **Hub with no sections** — handled by `hub-page.md` spec scenario: empty body + warning.
