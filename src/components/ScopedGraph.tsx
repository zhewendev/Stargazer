// ScopedGraph — renders a D3 force graph limited to a scoped set of slugs
// with status-based node radii (D39).
//
// Used by Hub pages' type: graph sections. At build time, reads querySection()
// results, serializes allowed slugs + status→radius multipliers into data-cfg,
// and the afterDOMLoaded script intersects the global contentIndex with scope.
//
// Per D44: does NOT modify the third-party graph plugin source. It's a
// standalone component with its own rendering script.

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import type { QuartzComponent } from "../../quartz/components/types"
import { querySection, type SectionFilter } from "../lib/contentQuery"

// Status → radius multiplier (D39)
const STATUS_RADIUS: Record<string, number> = {
  hub: 1.8,
  evergreen: 1.4,
  growing: 1.2,
  seed: 1.0,
  complete: 1.0,
}

export interface ScopedGraphProps {
  title: string
  height?: number
  filter?: SectionFilter
  match?: "any" | "all"
  hubScope?: string
  allFiles: QuartzPluginData[]
  showFullGraphLink?: boolean
}

function ScopedGraphComponent({
  spec,
  allFiles,
  hubScope,
}: {
  spec: { title: string; height?: number; filter?: SectionFilter; match?: "any" | "all"; scope?: string }
  allFiles: QuartzPluginData[]
  hubScope?: string
}) {
  const height = spec.height ?? 320
  const filter = spec.filter
  const match = spec.match

  const items = querySection(
    allFiles,
    { ...filter, match: match ?? filter?.match },
    { hubScope: spec.scope ?? hubScope, limit: 200 },
  )

  const statusMap: Record<string, number> = {}
  const scopeSlugs: string[] = []

  if (hubScope) {
    const hubIndex = allFiles.find((f) => f.slug === hubScope || f.slug === `${hubScope}/index`)
    if (hubIndex && hubIndex.slug) {
      scopeSlugs.push(hubIndex.slug)
      statusMap[hubIndex.slug] = STATUS_RADIUS.hub
    }
  }

  for (const file of items) {
    if (file.slug) {
      scopeSlugs.push(file.slug)
      const status = (file.frontmatter?.status as string | undefined) ?? "seed"
      statusMap[file.slug] = STATUS_RADIUS[status] ?? 1.0
    }
  }

  const config = JSON.stringify({
    scope: scopeSlugs,
    statusMap,
  })

  return (
    <div class="hub-section">
      <h3 class="hub-section-title">
        {spec.title}
        <a class="hub-graph-full-link" href="/graph">完整图谱 →</a>
      </h3>
      <div
        class="scoped-graph-container"
        data-cfg={config}
        style={{
          height: `${height}px`,
          background: "var(--surface-elevated)",
          borderRadius: "var(--radius-md)",
          position: "relative",
          overflow: "hidden",
        }}
        aria-label={`Scoped knowledge graph: ${spec.title}`}
      >
        <div class="scoped-graph-loading">Loading graph…</div>
      </div>
    </div>
  )
}

// The inline script — loaded after DOM ready on every page that has a scoped graph.
// This is attached to the component so Quartz includes it in the page resources.
const scopedGraphScript = `
(function() {
  function loadScript(src) {
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) return Promise.resolve();
    return new Promise(function(resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.crossOrigin = "anonymous";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function initScopedGraphs() {
    var d3 = window.d3, PIXI = window.PIXI;
    if (!d3 || !PIXI) return;
    var containers = document.querySelectorAll(".scoped-graph-container");
    for (var i = 0; i < containers.length; i++) {
      if (!containers[i].dataset.initialized) {
        containers[i].dataset.initialized = "true";
        renderOne(containers[i], d3, PIXI);
      }
    }
  }

  function renderOne(container, d3, PIXI) {
    var cfg;
    try { cfg = JSON.parse(container.dataset.cfg || "{}"); } catch(e) { return; }

    var scopeSlugs = cfg.scope || [];
    var statusMap = cfg.statusMap || {};
    if (scopeSlugs.length === 0) {
      container.querySelector(".scoped-graph-loading").textContent = "No notes in this section.";
      return;
    }

    var width = container.offsetWidth;
    var height = container.offsetHeight || 320;
    var loading = container.querySelector(".scoped-graph-loading");

    function rc(val, fb) {
      if (!val) return fb;
      var el = document.createElement("div");
      el.style.color = val; el.style.position = "absolute"; el.style.visibility = "hidden";
      document.body.appendChild(el);
      var r = getComputedStyle(el).color; el.remove();
      return r || fb;
    }

    fetchData.then(function(dataRaw) {
      if (loading) loading.remove();

      var allowed = new Set(scopeSlugs);
      // One-hop expansion: collect all links from scoped nodes
      var neighbors = new Set();
      for (var slug in dataRaw) {
        if (!allowed.has(slug)) continue;
        var d = dataRaw[slug];
        (d.links || []).forEach(function(t) { if (!allowed.has(t)) neighbors.add(t); });
      }
      neighbors.forEach(function(n) { allowed.add(n); });

      var allLinks = [], allNodesSet = new Set(), linkCounts = {};
      for (var slug in dataRaw) {
        if (!allowed.has(slug)) continue;
        allNodesSet.add(slug);
        var out = dataRaw[slug].links || [];
        for (var j = 0; j < out.length; j++) {
          if (allowed.has(out[j])) {
            allLinks.push({ source: slug, target: out[j] });
            allNodesSet.add(out[j]);
            linkCounts[slug] = (linkCounts[slug]||0)+1;
            linkCounts[out[j]] = (linkCounts[out[j]]||0)+1;
          }
        }
      }

      if (allNodesSet.size === 0) {
        container.textContent = "No connected notes.";
        container.style.display = "flex"; container.style.alignItems = "center";
        container.style.justifyContent = "center"; container.style.color = "var(--text-muted)";
        container.style.fontSize = "0.875rem";
        return;
      }

      function nodeRadius(slug, lc) {
        var base = 2 + Math.sqrt(Math.max(lc, 1));
        return base * (statusMap[slug] || 1.0);
      }

      var nodes = [], nodeMap = new Map();
      allNodesSet.forEach(function(slug) {
        var det = dataRaw[slug] || {};
        var lc = linkCounts[slug] || 0;
        var r = nodeRadius(slug, lc);
        var n = { id: slug, text: det.title || slug, radius: r,
          isHub: (statusMap[slug]||0) >= 1.8,
          x: Math.random()*width - width/2, y: Math.random()*height - height/2, vx:0, vy:0 };
        nodes.push(n); nodeMap.set(slug, n);
      });

      var gLinks = [];
      for (var i = 0; i < allLinks.length; i++) {
        var s = nodeMap.get(allLinks[i].source), t = nodeMap.get(allLinks[i].target);
        if (s && t) gLinks.push({ source: s, target: t });
      }

      var sty = getComputedStyle(document.documentElement);
      var accent = rc(sty.getPropertyValue("--secondary").trim(), "#c9a97e");
      var gray = rc(sty.getPropertyValue("--gray").trim(), "#6c6c6c");
      var lgray = rc(sty.getPropertyValue("--lightgray").trim(), "#d4d4d4");
      var dark = rc(sty.getPropertyValue("--dark").trim(), "#1a1a1a");
      var bodyFont = sty.getPropertyValue("--bodyFont").trim() || "Inter, sans-serif";

      var app = new PIXI.Application();
      app.init({ width: width, height: height, antialias: true, backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1, autoDensity: true, eventMode: "static" });
      container.appendChild(app.canvas);

      var stage = new PIXI.Container();
      app.stage.addChild(stage);
      var linkC = new PIXI.Container(), nodeC = new PIXI.Container(), labelC = new PIXI.Container();
      stage.addChild(linkC); stage.addChild(nodeC); stage.addChild(labelC);

      var nData = [], lData = [], hoveredId = null;

      for (var i = 0; i < nodes.length; i++) {
        var nd = nodes[i];
        var col = nd.isHub ? accent : gray;
        var lbl = new PIXI.Text({ text: nd.text, style: { fontSize: 10, fill: dark, fontFamily: bodyFont },
          resolution: window.devicePixelRatio * 2 });
        lbl.anchor.set(0.5, 1.2); lbl.alpha = 0; labelC.addChild(lbl);
        var g = new PIXI.Graphics(); g.circle(0, 0, nd.radius); g.fill({ color: col });
        g.eventMode = "static"; g.cursor = "pointer";
        (function(n, gfx, lb) {
          gfx.on("pointerover", function() {
            hoveredId = n.id; lb.alpha = 1; hiNeigh(); draw();
          });
          gfx.on("pointerleave", function() {
            hoveredId = null; lb.alpha = 0; clrHi(); draw();
          });
          gfx.on("click", function() { window.location.href = "/" + n.id; });
        })(nd, g, lbl);
        nodeC.addChild(g);
        nData.push({ sim: nd, gfx: g, label: lbl, active: false });
      }

      for (var i = 0; i < gLinks.length; i++) {
        var g = new PIXI.Graphics(); g.eventMode = "none"; linkC.addChild(g);
        lData.push({ sim: gLinks[i], gfx: g, color: lgray, alpha: 1, active: false });
      }

      function hiNeigh() {
        var nb = new Set([hoveredId]);
        for (var i = 0; i < lData.length; i++) {
          var ld = lData[i].sim;
          if (ld.source.id === hoveredId || ld.target.id === hoveredId) {
            nb.add(ld.source.id); nb.add(ld.target.id); lData[i].active = true;
          } else { lData[i].active = false; }
        }
        for (var i = 0; i < nData.length; i++) nData[i].active = nb.has(nData[i].sim.id);
      }
      function clrHi() {
        for (var i = 0; i < lData.length; i++) lData[i].active = false;
        for (var i = 0; i < nData.length; i++) nData[i].active = false;
      }
      function draw() {
        for (var i = 0; i < nData.length; i++)
          nData[i].gfx.alpha = hoveredId ? (nData[i].active ? 1 : 0.2) : 1;
        for (var i = 0; i < lData.length; i++) {
          lData[i].alpha = hoveredId ? (lData[i].active ? 1 : 0.15) : 1;
          lData[i].color = lData[i].active ? gray : lgray;
        }
      }

      var sim = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-80))
        .force("center", d3.forceCenter().strength(0.3))
        .force("link", d3.forceLink(gLinks).distance(30))
        .force("collide", d3.forceCollide(function(d){ return d.radius + 2; }).iterations(3));

      var stop = false;
      function animate() {
        if (stop) return;
        for (var i = 0; i < nData.length; i++) {
          var s = nData[i].sim;
          if (s.x != null) { nData[i].gfx.position.set(s.x+width/2, s.y+height/2);
            nData[i].label.position.set(s.x+width/2, s.y+height/2); }
        }
        for (var i = 0; i < lData.length; i++) {
          var s = lData[i].sim;
          if (s.source.x != null) {
            lData[i].gfx.clear();
            lData[i].gfx.moveTo(s.source.x+width/2, s.source.y+height/2);
            lData[i].gfx.lineTo(s.target.x+width/2, s.target.y+height/2);
            lData[i].gfx.stroke({ alpha: lData[i].alpha, width: 1, color: lData[i].color });
          }
        }
        requestAnimationFrame(animate);
      }
      sim.on("tick", function(){}); sim.restart(); animate();

      function cleanup() { stop = true; sim.stop(); try { app.destroy(true); } catch(e){} }
      document.addEventListener("prenav", cleanup, { once: true });
    }).catch(function() {
      if (loading) loading.textContent = "Could not load graph data.";
    });
  }

  // Init on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      Promise.all([
        loadScript("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"),
        loadScript("https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.js"),
      ]).then(initScopedGraphs);
    });
  } else {
    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.js"),
    ]).then(initScopedGraphs);
  }

  document.addEventListener("nav", function() {
    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.js"),
    ]).then(initScopedGraphs);
  });
})();
`

export const ScopedGraph: QuartzComponent = (() => {
  const Comp: QuartzComponent = (props: any) => {
    return ScopedGraphComponent({
      spec: props.spec || { title: "Graph" },
      allFiles: props.allFiles || [],
      hubScope: props.hubScope,
    })
  }
  Comp.afterDOMLoaded = scopedGraphScript
  return Comp
})()

export default ScopedGraph
