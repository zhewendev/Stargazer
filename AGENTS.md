# Project

Stargazer

Personal Digital Garden

# Stack

Quartz 5
Github Pages
Obsidian

# Style

Lapis Cafe Inspired
VeryJack Inspired

# Principles

Knowledge First
Content First
Reading First

# Navigation

Knowledge
Projects
Now
About
Search
Graph

# Do Not

- Delete content
- Break backlinks
- Break graph
- Break search
- Rename files automatically

# Workflow

Analyze
Plan
Confirm
Implement

Never skip planning.

# Digital Garden Principles  
  
Content > UI  
  
Knowledge > Timeline  
  
Evergreen > Article  
  
Hub Pages Required  
  
Every major knowledge area must have a Hub page.  
  
Notes should be connected via WikiLinks whenever possible.  
  
Folder structure should never be the only navigation method.

# Long Term Maintainability

All homepage content must be data-driven.

No hardcoded article cards.

No hardcoded project cards.

No hardcoded knowledge areas.

Everything should come from frontmatter or content.

# Plugin Override Strategy

Third-party plugins (under `.quartz/plugins/`) must NEVER be modified directly in their source files. This ensures they can be updated independently without losing customizations.

## Allowed approaches

1. **Wrapper components** — Create a new component in `src/components/` that wraps or replaces the plugin's output. Example: `ScopedGraph.tsx` renders a scoped graph without modifying the `graph` plugin source.

2. **Config-level overrides** — Use `quartz.config.yaml` `layout.byPageType` to exclude/reposition plugin components per pageType.

3. **CSS overrides** — Add styles in `src/styles/` to override plugin component appearance.

4. **Build-time data injection** — If a plugin needs additional data, compute it in `src/lib/` modules and pass via component props rather than patching plugin internals.

## When source modification is unavoidable

If a plugin's behavior cannot be changed via wrappers or config:

1. Document the change in this file under "Plugin Source Modifications".
2. Keep changes minimal and clearly commented with the rationale.
3. Rebuild via `npm install && npx tsup` in the plugin directory.
4. Test both the modified behavior and that nothing else broke.

## Plugin Source Modifications (tracked)

| Plugin | File | Change | Reason | Date |
|--------|------|--------|--------|------|
| folder-page | `src/components/PageList.tsx` | Card-grid layout + status chips + backlinks/wikilinks slots | P9: replace list view with card grid; D42: populate graph metadata | 2025-01 |
| tag-page | `src/components/PageList.tsx` | Identical card-grid (shared implementation D33) | P9: consistent folder/tag card rendering | 2025-01 |