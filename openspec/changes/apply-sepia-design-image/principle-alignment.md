# Principle Alignment Audit

**Date:** 2026-06-26
**Companion to:** `audit.md` (which audits design-image alignment)
**Authority hierarchy (per user):**
1. **Page design** → design image (1:1 fidelity)
2. **Theme / animation / a11y / card style / non-page-design aspects** → principles below
3. **Conflicts** → image wins, but I flag them here

---

## Principle Inventory (User-Provided)

| # | Principle | Brief |
|---|---|---|
| P1 | Content > UI | UI never dominates; content is primary |
| P2 | Knowledge > Timeline | Avoid chronological thinking; promote evergreen |
| P3 | Digital Garden | Encourage exploration, not consumption |
| P4 | One visual language | All pages share one design language |
| P5 | Breathing space | Increase whitespace, reduce density |
| P6 | Calm | No visual noise, no heavy borders, no bright colors, no excessive icons |

**Reference sites:** lapis.cafe, veryjack.com
**Existing palette (preserved):** #F7F6F2 / #FAF9F5 / #333 / #666 / #C9A97E / #ECE7DD

---

## Phase 2 Concerns: Theme Polish (Spacing / Typography / Cards)

### Current state

`src/styles/tokens.scss` already has the warm sepia palette, status lifecycle colors, typography stacks, spacing scale (4px base), and radius/shadow/motion tokens. Card styles live across `tokens.scss` and `components.scss`.

### Principle alignment

| Principle | Compliance | Evidence |
|---|---|---|
| P5 (Breathing space) | **Partial** | Spacing scale exists (--space-1 through --space-16); but components may not be using it consistently |
| P6 (Calm — lighter cards) | **Action needed** | Need to audit card shadows, borders, status chip prominence |
| P4 (One visual language) | **Strong** | Tokens centralized in `tokens.scss`; components consume via CSS vars |
| Typography (large, elegant, generous) | **Action needed** | `typography.scss` exists; need to verify scale is generous enough |

### Required actions

- [ ] Audit card styles for shadow/border density; reduce where heavy
- [ ] Audit spacing usage across components; standardize on `--space-*` tokens
- [ ] Verify typography scale: body ≥16px, line-height ≥1.6
- [ ] Verify status chip is subtle (low-opacity variant for card contexts)

---

## Phase 3 Concerns: Home Page (CONFLICT — see below)

### Current state

`src/components/Home.tsx` composes Hero + Now + Featured + Projects in this order (default).
`Home/hero.md` provides CTA overrides.
`content/index.md` has `sectionOrder: [hero, now, featured, projects]`.

### Principle vs Image Conflict

**This is a major conflict. Flagging per user instruction.**

| Source | Says |
|---|---|
| **Principles** | "Home should fit within one screen. Hero only contains: Brand, Short positioning sentence, Current focus, Primary CTA, Secondary CTA. Nothing more. No article cards. No project cards. No statistics. No activity feeds. No timeline. Scrolling below Hero should immediately enter Knowledge." |
| **Design image** | Home shows: Hero with persona → Stats row (128笔记 / 24专题 / 36标签 / 18系列 / 320+链接) → 4 knowledge area cards (Android/AI/Automation/Reading) → Quote callout → Footer |

**Resolution per user rule:** Image wins. Home will include stats row + area cards + quote.

**Implication:** Home will NOT fit within one screen on most viewports. This conflicts with the "one screen" principle.

**Recommendation to user:** Confirm acceptance of multi-screen Home (image-faithful) or request a minimal Home (principle-aligned). **Default to image unless told otherwise.**

---

## Phase 4 Concerns: Knowledge Hub Refinement

### Current state

`src/components/Hub.tsx` + `hub/sections.tsx` render declarative sections (cards/list/compact-list/graph). Hub hero shows title + description + computed stats.
`content/Knowledge/Android/index.md` has 3 sections (精选文章, 最新笔记, 生长中).

### Principle alignment

| Principle | Compliance | Notes |
|---|---|---|
| P5 (Breathing space) | Strong | Sections are well-spaced |
| P6 (Calm — no unnecessary widgets) | Action needed | Current hub doesn't have widgets; verify |
| Section structure | **Partial** | Principles say: Featured, Growing, Evergreen, Latest (4 sections) |

### Required actions

- [ ] Update `content/Knowledge/Android/index.md` sections to match: Featured, Growing, Evergreen, Latest
- [ ] Same for `content/Knowledge/AI/index.md` and other knowledge hubs
- [ ] Verify learning timeline (from image) is added where appropriate (5-section image version)

**Note:** Image's hub has 5 sections (学习地图 / 知识讲解 / 核心专题 / 推荐阅读 / 图谱视图); principles suggest 4. Image wins → 5 sections.

---

## Phase 5 Concerns: Article Refinement

### Current state

Article layout uses Quartz's default `content` pageType with:
- `Breadcrumbs` (beforeBody)
- `article-title`, `note-properties`, `content-meta` (beforeBody)
- TOC (right)
- Backlinks (right)
- `MetadataPanel` (right) — when configured
- `MarkdownContent` (default body)

`quartz.config.yaml` `layout.byPageType.content.right` currently has `[TOC, Backlinks]`.

### Principle alignment

| Principle | Compliance | Notes |
|---|---|---|
| P1 (Content > UI) | Strong | Body is centered; meta in side rail |
| Reading first | Strong | No heavy decorations on body |
| Metadata second | Action needed | MetadataPanel exists; needs right-slot wiring |
| Graph third | Action needed | Mini graph needs to be in sidebar |
| Backlinks | Action needed | Already in right slot |
| Previous/Next | Action needed | Not currently present |

### Required actions

- [ ] Wire `ArticleSidebar` (TOC + MetadataPanel + mini graph + backlinks + prev/next) into `layout.byPageType.content.right`
- [ ] Verify sidebar order: 目录 → 本文信息 → 知识连接 → 上一篇/下一篇

---

## Phase 6 Concerns: Project → Topic Rename

### Current state

- `BrandHeader.tsx`: nav has `{ key: "projects", label: "项目", href: "/projects" }`
- `DrawerNav.tsx`: same
- `content/Projects/index.md` exists
- `quartz.config.yaml`: no explicit reference, uses folder routing

### Principle alignment

| Principle | Compliance | Notes |
|---|---|---|
| "Topics are long-term knowledge collections, not software projects" | Action needed | Rename "项目" → "专题"; folder stays `Projects/` (folder names are not surfaced) |
| Image uses "专题" | Aligned with image | Image uses "专题" |

### Required actions

- [ ] `BrandHeader.tsx`: change label "项目" → "专题"
- [ ] `DrawerNav.tsx`: same
- [ ] `content/Projects/index.md`: update title from "项目" to "专题" (or whatever title)
- [ ] Verify nav order per image: 知识库 / 专题 / 资源 / 图谱 / 关于 (5 items, "专题" is item #2)

---

## Phase 7 Concerns: About Page (POSSIBLE CONFLICT)

### Current state

`content/About.md` has prose: 关于我 / 关于这座花园 / 花园原则 / 联系 sections.

### Principle vs Image

| Source | Says |
|---|---|
| **Principles** | Remove: learning history, timeline, career story, long autobiography. Include: who I am, current interests, writing philosophy, digital garden philosophy, tool stack, contact (GitHub, RSS). |
| **Design image** | About温哲 with: bio + philosophy principles (Seed/Growing/Evergreen/Complete) + quick links grid (探索/花园/联系/关于 categories) + contact section |

**Resolution per user rule:** Image wins. About page will have full bio + 4 principles + 4-column quick links + contact.

**Implication:** About may feel "resume-like" if bio is too long. Mitigation per principles (which apply to non-page-design): keep bio concise, focus on philosophy and tool stack.

**Recommendation:** Verify About content (in `content/About.md`) is principle-aligned (concise bio, no career timeline). The LAYOUT comes from the image; the COPY comes from principles.

---

## Phase 8 Concerns: Footer Refinement

### Current state

`src/components/BrandFooter.tsx`: single row with socials (GitHub/Email/RSS) + credit line.
Image: 4-column footer (探索/花园/联系/关于) + mountain motif.

### Principle alignment

| Principle | Compliance | Notes |
|---|---|---|
| Always visible | Action needed | Verify footer is on every pageType |
| Contains nav (Knowledge/Topics/About/Search/RSS/GitHub) | Aligned with image | 4-column footer covers nav |
| Back to Top | **PRINCIPLE WINS** | Image doesn't show; principles add it |
| Small copyright | Aligned | Both have copyright |

### Required actions

- [ ] Implement 4-column footer (per image)
- [ ] Add "Back to Top" anchor link (per principles — principle wins for non-page-design)
- [ ] Verify footer renders on all pageTypes (home, hub, content, graph, about, tag, folder)

---

## Phase 9 Concerns: Mobile (375 / 390 / 430)

### Current state

`DrawerNav` exists (slide-out mobile menu). BrandHeader has drawer trigger.

### Principle alignment

| Principle | Compliance | Notes |
|---|---|---|
| Mobile first | Action needed | Verify all pages work at 375/390/430 |
| Drawer | Strong | Already exists |
| Footer collapse | Action needed | 4-column → single column at mobile |
| Cards single column | Action needed | Verify |

### Required actions

- [ ] Test all page types at 375px, 390px, 430px (use `run` skill)
- [ ] Verify 4-column footer collapses gracefully
- [ ] Verify all card grids collapse to single column
- [ ] Verify touch targets ≥44×44px (already in Phase 2 theme polish)

---

## Phase 10 Concerns: Accessibility (NEW — Principle-only)

### Current state

To be audited. Likely gaps in:
- ARIA labels (some components have them, others don't)
- Keyboard navigation (drawer has it; verify others)
- Focus rings (need to verify visibility)
- Reduced motion support (`prefers-reduced-motion` already in `tokens.scss`)
- Color contrast (palette is AA-compliant by design; verify edge cases)

### Required actions

- [ ] Audit all interactive elements for keyboard accessibility
- [ ] Add visible focus rings (consistent across components)
- [ ] Verify AA contrast for all text-on-background combinations
- [ ] Add `prefers-reduced-motion` guards for any animations
- [ ] Audit ARIA labels on all custom components

---

## Phase 11 Concerns: Animation (NEW — Principle-only)

### Current state

`tokens.scss` has `--motion-fast: 160ms`, `--motion-base: 280ms`, `--motion-slow: 480ms`. Existing transitions exist in components.

### Principle alignment

| Principle | Compliance | Notes |
|---|---|---|
| Subtle only | Action needed | Audit existing animations |
| Fade / Opacity / TranslateY only | Action needed | Verify no scale, no bounce |
| No flashy transitions | Action needed | Verify |

### Required actions

- [ ] Audit all CSS transitions and animations
- [ ] Replace any scale/bounce with fade/opacity/translateY
- [ ] Ensure all animations respect `prefers-reduced-motion`

---

## Conflict Summary (Page Design Authority)

| Conflict | Image says | Principles say | Winner | Notes |
|---|---|---|---|---|
| **Home content density** | Stats row + 4 area cards + quote + footer | One screen: hero + 5 knowledge hub preview cards only | **Image** | User confirms multi-screen Home |
| **Hub sections** | 5 sections (timeline + 4 content) | 4 sections (Featured/Growing/Evergreen/Latest) | **Image** | Add timeline where appropriate |
| **About content depth** | Full bio + 4 principles + 4-col links + contact | Concise: who I am, interests, philosophy, tool stack | **Image (layout)** / **Principles (copy)** | Verify `About.md` copy is concise |
| **Footer nav** | 4 columns: 探索/花园/联系/关于 | Nav: Knowledge/Topics/About/Search/RSS/GitHub + Back to Top | **Image (columns)** / **Principles (Back to Top)** | Both additively |
| **Animation** | Not specified | Subtle: fade/opacity/translateY only | **Principles** | Non-page-design |
| **Mobile breakpoints** | 375px only | 375 / 390 / 430 | **Principles** | Non-page-design |
| **Accessibility** | Not specified | AA, keyboard, focus, ARIA, reduced-motion | **Principles** | Non-page-design |
| **Card lightness** | Cards visible in image | Reduce shadow/border, increase spacing | **Principles** | Card style (not page design) |

---

## Conclusion

The two-track approach resolves cleanly:
- **Page layout/design** follows the image (image wins in 4 conflicts)
- **Non-page-design aspects** follow principles (principles win in 4 areas)

The most significant conflict is **Home content density**. The image has a richer home (stats + cards + quote); the principles want a minimal one-screen home. Per user rule, image wins. User has been informed.

**No code yet.** Awaiting audit approval before Phase 2.