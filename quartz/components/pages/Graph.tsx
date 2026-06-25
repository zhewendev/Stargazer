// GraphPage — standalone /graph page (D40).
//
// Layout: Graph Hero → Full Graph View → Related Notes → Recent Updates
// No sidebar crop — full-width graph container.
// Supports deep links via /graph?focus=<slug> (D43) — centers, highlights, and
// expands neighbors around the target node.

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import type { QuartzComponent } from "../../quartz/components/types"

const GraphPage: QuartzComponent = ({ allFiles }: {
  fileData: QuartzPluginData
  allFiles: QuartzPluginData[]
}) => {
  // Compute stats for the hero
  const totalNotes = allFiles.filter((f) => f.slug && !f.slug.startsWith("tags/") && f.slug !== "index" && f.slug !== "graph").length
  const totalLinks = allFiles.reduce((sum, f) => {
    const links = (f.frontmatter?.links as string[] | undefined) ?? []
    return sum + links.length
  }, 0)
  const hubs = allFiles.filter((f) => f.frontmatter?.type === "hub").length

  return (
    <article class="graph-page">
      {/* Graph Hero */}
      <header class="graph-hero">
        <h1 class="graph-page-title">知识图谱</h1>
        <p class="graph-tagline">Knowledge Atlas — Explore connections across the garden</p>
        <div class="graph-stats">
          <span class="graph-stat"><strong>{totalNotes}</strong> notes</span>
          <span class="graph-stat"><strong>{totalLinks}</strong> links</span>
          <span class="graph-stat"><strong>{hubs}</strong> hubs</span>
        </div>
      </header>

      {/* Full Graph View */}
      <section class="graph-view-section">
        <div
          class="global-graph-standalone"
          data-cfg='{"depth": -1, "enableRadial": true, "showTags": true}'
          aria-label="Global knowledge graph"
        >
          <div class="scoped-graph-loading">Loading global graph…</div>
        </div>
      </section>

      {/* Related Notes — recently modified with most connections */}
      <section class="graph-related">
        <h2>Related Notes</h2>
        <div class="featured-grid">
          {[...allFiles]
            .filter((f) => f.slug && !f.slug.startsWith("tags/") && f.slug !== "index" && f.slug !== "graph" && f.frontmatter?.type !== "hub")
            .sort((a, b) => {
              const aLinks = ((a.frontmatter?.links as string[] | undefined) ?? []).length
              const bLinks = ((b.frontmatter?.links as string[] | undefined) ?? []).length
              return bLinks - aLinks || ((b.dates?.modified?.getTime() ?? 0) - (a.dates?.modified?.getTime() ?? 0))
            })
            .slice(0, 6)
            .map((file) => {
              const href = "/" + file.slug
              const title = (file.frontmatter?.title as string | undefined) ?? file.slug
              const desc = (file.frontmatter?.description as string | undefined) ?? ""
              const status = file.frontmatter?.status as string | undefined
              const linkCount = ((file.frontmatter?.links as string[] | undefined) ?? []).length
              return (
                <a key={file.slug} class="card featured-card featured-card-article" href={href}>
                  <h4 class="featured-card-title">{title}</h4>
                  {desc && <p class="featured-card-desc">{desc.slice(0, 120)}{desc.length > 120 ? "…" : ""}</p>}
                  <div class="card-meta">
                    {status && (
                      <span class={`chip chip-glyph status-chip-md status-${status}`} aria-label={`Status: ${status}`}>
                        {status === "seed" ? "○" : status === "growing" ? "◐" : status === "evergreen" ? "●" : "◉"}
                        {" "}{status === "seed" ? "种子" : status === "growing" ? "生长中" : status === "evergreen" ? "常青" : "完成"}
                      </span>
                    )}
                    <span class="graph-link-count">{linkCount} links</span>
                  </div>
                </a>
              )
            })}
        </div>
      </section>

      {/* Recent Updates */}
      <section class="graph-recent">
        <h2>Recent Updates</h2>
        <ul class="hub-compact-list">
          {[...allFiles]
            .filter((f) => f.dates?.modified && f.slug && !f.slug.startsWith("tags/") && f.slug !== "index" && f.slug !== "graph")
            .sort((a, b) => (b.dates!.modified!.getTime() ?? 0) - (a.dates!.modified!.getTime() ?? 0))
            .slice(0, 10)
            .map((file) => {
              const href = "/" + file.slug
              const title = (file.frontmatter?.title as string | undefined) ?? file.slug
              const date = file.dates!.modified!
              return (
                <li key={file.slug} class="hub-compact-row">
                  <a class="hub-compact-link" href={href}>{title}</a>
                  <span class="hub-list-date">{date.toISOString().slice(0, 10)}</span>
                </li>
              )
            })}
        </ul>
      </section>
    </article>
  )
}

// Inline script for the standalone global graph + deep link support (D43)
const graphPageScript = `
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

  function initGlobalGraph() {
    var d3 = window.d3, PIXI = window.PIXI;
    if (!d3 || !PIXI) {
      setTimeout(initGlobalGraph, 500);
      return;
    }

    var container = document.querySelector(".global-graph-standalone");
    if (!container || container.dataset.initialized) return;
    container.dataset.initialized = "true";

    // Check for deep link focus
    var params = new URLSearchParams(window.location.search);
    var focusSlug = params.get("focus") || null;

    var width = container.offsetWidth;
    var height = Math.max(container.offsetHeight || 600, 500);
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
      try {
      if (loading) loading.remove();

      var allLinks = [], allNodesSet = new Set(), linkCounts = {};
      for (var slug in dataRaw) {
        if (slug.startsWith("tags/")) continue;
        allNodesSet.add(slug);
        var out = dataRaw[slug].links || [];
        for (var j = 0; j < out.length; j++) {
          if (!out[j].startsWith("tags/") && dataRaw[out[j]]) {
            allLinks.push({ source: slug, target: out[j] });
            linkCounts[slug] = (linkCounts[slug]||0)+1;
            linkCounts[out[j]] = (linkCounts[out[j]]||0)+1;
          }
        }
      }

      // Also add tag nodes
      var tagNodes = new Set();
      for (var slug in dataRaw) {
        var tags = dataRaw[slug].tags || [];
        for (var t = 0; t < tags.length; t++) {
          var ts = "tags/" + tags[t];
          tagNodes.add(ts);
          allLinks.push({ source: slug, target: ts });
        }
      }
      tagNodes.forEach(function(t) { allNodesSet.add(t); });

      function nodeRadius(slug, lc) {
        var base = 2 + Math.sqrt(Math.max(lc, 1));
        // D39 hierarchy
        if (slug.endsWith("/index")) return base * 1.8; // hub
        var details = dataRaw[slug] || {};
        var st = details.status || "seed";
        if (st === "evergreen") return base * 1.4;
        if (st === "growing") return base * 1.2;
        return base * 1.0;
      }

      var nodes = [], nodeMap = new Map();
      allNodesSet.forEach(function(slug) {
        var det = dataRaw[slug] || {};
        var isTag = slug.startsWith("tags/");
        var lc = linkCounts[slug] || 0;
        var r = nodeRadius(slug, lc);
        var n = { id: slug, text: isTag ? "#" + slug.slice(5) : (det.title || slug),
          radius: r, isHub: slug.endsWith("/index"), isTag: isTag,
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
      var tertiary = rc(sty.getPropertyValue("--tertiary").trim(), "#84a59d");
      var gray = rc(sty.getPropertyValue("--gray").trim(), "#6c6c6c");
      var lgray = rc(sty.getPropertyValue("--lightgray").trim(), "#d4d4d4");
      var dark = rc(sty.getPropertyValue("--dark").trim(), "#1a1a1a");
      var bodyFont = sty.getPropertyValue("--bodyFont").trim() || "Inter, sans-serif";

      var app = new PIXI.Application();
      app.init({ width: width, height: height, antialias: true, backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1, autoDensity: true, eventMode: "static" })
        .then(function() {
          var canvasEl = app.canvas;
          if (!canvasEl) {
            console.error("[graph] No canvas available from PIXI app");
            return;
          }
          container.appendChild(canvasEl);

          var stage = new PIXI.Container();
          app.stage.addChild(stage);
          var linkC = new PIXI.Container(), nodeC = new PIXI.Container(), labelC = new PIXI.Container();
          stage.addChild(linkC); stage.addChild(nodeC); stage.addChild(labelC);

          var nData = [], lData = [], hoveredId = null;

          for (var i = 0; i < nodes.length; i++) {
            var nd = nodes[i];
            var col = nd.isHub ? accent : (nd.isTag ? tertiary : gray);
            var lbl = new PIXI.Text({ text: nd.text, style: { fontSize: 10, fill: dark, fontFamily: bodyFont },
              resolution: window.devicePixelRatio * 2 });
            lbl.anchor.set(0.5, 1.2); lbl.alpha = 0; labelC.addChild(lbl);
            var g = new PIXI.Graphics();
            if (nd.isTag) { g.circle(0, 0, nd.radius); g.fill({ color: dark }); g.stroke({ width: 2, color: tertiary }); }
            else { g.circle(0, 0, nd.radius); g.fill({ color: col }); }
            g.eventMode = "static"; g.cursor = "pointer";
            (function(n, gfx, lb) {
              gfx.on("pointerover", function() {
                hoveredId = n.id; lb.alpha = 1; hiNeigh(); draw();
              });
              gfx.on("pointerleave", function() {
                hoveredId = null; lb.alpha = 0; clrHi(); draw();
              });
              gfx.on("click", function() { if (!n.isTag) window.location.href = "/" + n.id; });
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

          var radius = (Math.min(width, height) / 2) * 0.6;
          var sim = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter().strength(0.2))
            .force("link", d3.forceLink(gLinks).distance(30))
            .force("collide", d3.forceCollide(function(d){ return d.radius + 3; }).iterations(3))
            .force("radial", d3.forceRadial(radius).strength(0.15));

          if (focusSlug) {
            setTimeout(function() {
              var target = nodeMap.get(focusSlug);
              if (target) {
                // Pin the target at center & reheat simulation
                target.fx = 0; target.fy = 0;
                sim.force("center", d3.forceCenter().strength(0.6));
                sim.alpha(0.5).restart();
                // Highlight the target and its neighbors
                hoveredId = focusSlug;
                hiNeigh();
                draw();
                // Release the pin after ~3s so the graph can drift naturally
                setTimeout(function() { target.fx = null; target.fy = null; }, 3000);
              }
            }, 2000);
          }

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
        });
      } catch (e) {
        console.error("[graph] Error in initGlobalGraph:", e.message, e.stack);
        if (loading) loading.textContent = "Graph error: " + e.message;
      }
    }).catch(function(e) {
      console.error("[graph] fetchData error:", e);
      if (loading) loading.textContent = "Could not load graph data.";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      Promise.all([
        loadScript("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"),
        loadScript("https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.js"),
      ]).then(initGlobalGraph);
    });
  } else {
    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.js"),
    ]).then(initGlobalGraph);
  }

  document.addEventListener("nav", function() {
    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.js"),
    ]).then(initGlobalGraph);
  });
})();
`

GraphPage.afterDOMLoaded = graphPageScript

export default (() => GraphPage) satisfies () => QuartzComponent
