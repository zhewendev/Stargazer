// SectionShell — reusable wrapper for Home sections.
// Renders a labeled section with optional "更多" link.

import { JSX } from "preact"

interface SectionShellProps {
  title: string
  moreHref?: string
  moreLabel?: string
  children: JSX.Element | JSX.Element[]
}

export function SectionShell({
  title,
  moreHref,
  moreLabel = "更多 →",
  children,
}: SectionShellProps) {
  return (
    <section class="section-shell">
      <header class="section-shell-header">
        <h2 class="section-shell-title">{title}</h2>
        {moreHref && (
          <a class="section-shell-more" href={moreHref}>
            {moreLabel}
          </a>
        )}
      </header>
      <div class="section-shell-body">{children}</div>
    </section>
  )
}
