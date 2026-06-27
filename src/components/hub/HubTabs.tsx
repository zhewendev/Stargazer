// HubTabs — accessible tab navigation for Hub/Topic pages.
//
// Renders tab bar + tab panels with client-side switching.
// Supports role="tablist" / role="tab" / role="tabpanel" + keyboard nav.

import type { QuartzComponent } from "../../../quartz/components/types"

export interface TabSpec {
  id: string
  label: string
}

interface HubTabsProps {
  tabs: TabSpec[]
  activeIndex?: number
  children: (string | JSX.Element)[]
}

const HubTabs: QuartzComponent = ({ tabs, activeIndex = 0, children }: HubTabsProps) => {
  if (tabs.length === 0) return null

  const panels = Array.isArray(children) ? children : [children]

  return (
    <div class="hub-tabs" data-script="hub-tabs">
      <div
        class="hub-tabs-bar"
        role="tablist"
        aria-label="页面导航"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            role="tab"
            class={`hub-tabs-tab ${i === activeIndex ? "is-active" : ""}`}
            aria-selected={i === activeIndex ? "true" : "false"}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={i === activeIndex ? 0 : -1}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div class="hub-tabs-panels">
        {tabs.map((tab, i) => (
          <div
            key={tab.id}
            role="tabpanel"
            class={`hub-tabs-panel ${i === activeIndex ? "is-active" : ""}`}
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={i !== activeIndex}
          >
            {panels[i] ?? null}
          </div>
        ))}
      </div>
    </div>
  )
}

HubTabs.afterDOMLoaded = `
(function() {
  const container = document.querySelector('[data-script="hub-tabs"]');
  if (!container) return;

  const tabs = container.querySelectorAll('[role="tab"]');
  const panels = container.querySelectorAll('[role="tabpanel"]');
  if (tabs.length === 0) return;

  function activateTab(index) {
    tabs.forEach((tab, i) => {
      tab.classList.toggle("is-active", i === index);
      tab.setAttribute("aria-selected", i === index ? "true" : "false");
      tab.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      panel.classList.toggle("is-active", i === index);
      panel.hidden = i !== index;
    });
    tabs[index]?.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activateTab(i));
    tab.addEventListener("keydown", (e) => {
      let next = i;
      if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else return;
      e.preventDefault();
      activateTab(next);
    });
  });
})();
`

export default (() => HubTabs) satisfies () => QuartzComponent
