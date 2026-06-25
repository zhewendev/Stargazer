// Scoped graph inline script — renders a D3 force graph limited to a scoped
// set of slugs with status-based node radii.
//
// Per D44: this is a standalone script, not a modification of the third-party
// graph plugin. It reuses the same fetchData global (contentIndex.json) but
// applies its own scoping, radius, and coloring logic.

(function () {
  function loadScript(src) {
    var existing = document.querySelector('script[src="' + src + '"]')
    if (existing) return Promise.resolve()
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script")
      script.src = src
      script.crossOrigin = "anonymous"
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  Promise.all([
    loadScript("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"),
    loadScript("https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.js"),
  ])
    .then(function () {
      initScopedGraphs()
    })
    .catch(function (err) {
      console.error("[ScopedGraph] Failed to load libraries:", err)
      var containers = document.querySelectorAll(".scoped-graph-container")
      for (var i = 0; i < containers.length; i++) {
        containers[i].textContent = "Graph could not load."
        containers[i].style.display = "flex"
        containers[i].style.alignItems = "center"
        containers[i].style.justifyContent = "center"
        containers[i].style.color = "var(--gray)"
        containers[i].style.fontSize = "0.9rem"
      }
    })

  function initScopedGraphs() {
    var d3 = window.d3
    var PIXI = window.PIXI
    if (!d3 || !PIXI) {
      console.error("[ScopedGraph] Libraries not loaded")
      return
    }

    var containers = document.querySelectorAll(".scoped-graph-container")
    for (var ci = 0; ci < containers.length; ci++) {
      renderScopedGraph(containers[ci], d3, PIXI)
    }
  }

  function renderScopedGraph(container, d3, PIXI) {
    var config
    try {
      config = JSON.parse(container.dataset.cfg || "{}")
    } catch {
      container.textContent = "Invalid graph config"
      return
    }

    var scopeSlugs = config.scope || []
    var neighborSlugs = config.neighbors || []
    var statusMap = config.statusMap || {}
    var depth = config.depth || 1

    // Remove loading indicator
    var loadingEl = container.querySelector(".scoped-graph-loading")
    if (loadingEl) loadingEl.remove()

    var width = container.offsetWidth
    var height = container.offsetHeight || 320

    // CSS color resolution for PixiJS
    function resolveColor(value, fallback) {
      if (!value) return fallback
      var el = document.createElement("div")
      el.style.color = value
      el.style.position = "absolute"
      el.style.visibility = "hidden"
      document.body.appendChild(el)
      var resolved = getComputedStyle(el).color
      el.remove()
      return resolved || fallback
    }

    // Build the scoped node set
    async function buildAndRender() {
      var dataRaw
      try {
        dataRaw = await fetchData
      } catch (err) {
        container.textContent = "Could not load graph data."
        return
      }

      // Create a set of allowed slugs (scope + one-hop neighbors)
      var allowedSlugs = new Set(scopeSlugs)
      var isHubNode = new Set()
      var nodeStatuses = {}

      for (var i = 0; i < scopeSlugs.length; i++) {
        allowedSlugs.add(scopeSlugs[i])
        nodeStatuses[scopeSlugs[i]] = "scoped"
      }
      for (var i = 0; i < neighborSlugs.length; i++) {
        allowedSlugs.add(neighborSlugs[i])
      }

      // Build edges from contentIndex
      var allLinks = []
      var allNodes = new Set()

      for (var slug in dataRaw) {
        if (!allowedSlugs.has(slug)) continue
        allNodes.add(slug)
        var details = dataRaw[slug]
        var outgoing = details.links || []
        for (var j = 0; j < outgoing.length; j++) {
          var target = outgoing[j]
          if (allowedSlugs.has(target)) {
            allLinks.push({ source: slug, target: target })
            allNodes.add(target)
          }
        }
      }

      if (allNodes.size === 0) {
        container.textContent = "No connected notes in this section."
        container.style.display = "flex"
        container.style.alignItems = "center"
        container.style.justifyContent = "center"
        container.style.color = "var(--text-muted)"
        container.style.fontSize = "0.875rem"
        return
      }

      // Compute node radius with status multiplier (D39)
      function nodeRadius(slug, linkCount) {
        var base = 2 + Math.sqrt(linkCount)
        var multiplier = statusMap[slug] || 1.0
        return base * multiplier
      }

      // Count links per node
      var linkCounts = {}
      for (var i = 0; i < allLinks.length; i++) {
        var l = allLinks[i]
        var src = typeof l.source === "string" ? l.source : l.source
        var tgt = typeof l.target === "string" ? l.target : l.target
        linkCounts[src] = (linkCounts[src] || 0) + 1
        linkCounts[tgt] = (linkCounts[tgt] || 0) + 1
      }

      // Create node objects
      var nodes = []
      var nodeMap = new Map()
      allNodes.forEach(function (slug) {
        var details = dataRaw[slug] || {}
        var title = details.title || slug
        var lc = linkCounts[slug] || 0
        var r = nodeRadius(slug, lc)
        var node = {
          id: slug,
          text: title,
          radius: r,
          isHub: statusMap[slug] >= 1.8,
          status: details.status || "seed",
          x: Math.random() * width - width / 2,
          y: Math.random() * height - height / 2,
          vx: 0,
          vy: 0,
        }
        nodes.push(node)
        nodeMap.set(slug, node)
      })

      // Create link objects
      var graphLinks = []
      for (var i = 0; i < allLinks.length; i++) {
        var src = nodeMap.get(allLinks[i].source)
        var tgt = nodeMap.get(allLinks[i].target)
        if (src && tgt) {
          graphLinks.push({ source: src, target: tgt })
        }
      }

      // Resolve CSS colors
      var styles = getComputedStyle(document.documentElement)
      var accent = resolveColor(styles.getPropertyValue("--secondary").trim(), "#c9a97e")
      var tertiary = resolveColor(styles.getPropertyValue("--tertiary").trim(), "#84a59d")
      var gray = resolveColor(styles.getPropertyValue("--gray").trim(), "#6c6c6c")
      var lightgray = resolveColor(styles.getPropertyValue("--lightgray").trim(), "#d4d4d4")
      var dark = resolveColor(styles.getPropertyValue("--dark").trim(), "#1a1a1a")
      var bodyFont = styles.getPropertyValue("--bodyFont").trim() || "Inter, sans-serif"

      // PixiJS application
      var app = new PIXI.Application()
      app.init({
        width: width,
        height: height,
        antialias: true,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        eventMode: "static",
      })
      container.appendChild(app.canvas)

      var stage = new PIXI.Container()
      app.stage.addChild(stage)

      // D3 force simulation
      var simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-80))
        .force("center", d3.forceCenter().strength(0.3))
        .force("link", d3.forceLink(graphLinks).distance(30))
        .force(
          "collide",
          d3.forceCollide(function (d) {
            return d.radius + 2
          }).iterations(3),
        )

      // Containers
      var linkContainer = new PIXI.Container()
      var nodesContainer = new PIXI.Container()
      var labelsContainer = new PIXI.Container()
      stage.addChild(linkContainer)
      stage.addChild(nodesContainer)
      stage.addChild(labelsContainer)

      var nodeRenderData = []
      var linkRenderData = []
      var hoveredNodeId = null

      // Render nodes
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i]
        var color = node.isHub ? accent : gray

        var label = new PIXI.Text({
          text: node.text,
          style: {
            fontSize: 10,
            fill: dark,
            fontFamily: bodyFont,
          },
          resolution: window.devicePixelRatio * 2,
        })
        label.anchor.set(0.5, 1.2)
        label.alpha = 0
        labelsContainer.addChild(label)

        var gfx = new PIXI.Graphics()
        gfx.circle(0, 0, node.radius)
        gfx.fill({ color: color })

        gfx.eventMode = "static"
        gfx.cursor = "pointer"

        (function (n, g, lbl) {
          g.on("pointerover", function () {
            hoveredNodeId = n.id
            lbl.alpha = 1
            highlightNeighbors()
            renderPixiState()
          })
          g.on("pointerleave", function () {
            hoveredNodeId = null
            lbl.alpha = 0
            clearHighlights()
            renderPixiState()
          })
          g.on("click", function () {
            window.location.href = "/" + n.id
          })
        })(node, gfx, label)

        nodesContainer.addChild(gfx)
        nodeRenderData.push({
          simulationData: node,
          gfx: gfx,
          label: label,
          color: color,
          active: false,
        })
      }

      // Render links
      for (var i = 0; i < graphLinks.length; i++) {
        var link = graphLinks[i]
        var gfx = new PIXI.Graphics()
        gfx.eventMode = "none"
        linkContainer.addChild(gfx)
        linkRenderData.push({
          simulationData: link,
          gfx: gfx,
          color: lightgray,
          alpha: 1,
          active: false,
        })
      }

      function highlightNeighbors() {
        var neighbours = new Set([hoveredNodeId])
        for (var i = 0; i < linkRenderData.length; i++) {
          var ld = linkRenderData[i].simulationData
          if (ld.source.id === hoveredNodeId || ld.target.id === hoveredNodeId) {
            neighbours.add(ld.source.id)
            neighbours.add(ld.target.id)
            linkRenderData[i].active = true
          } else {
            linkRenderData[i].active = false
          }
        }
        for (var i = 0; i < nodeRenderData.length; i++) {
          nodeRenderData[i].active = neighbours.has(nodeRenderData[i].simulationData.id)
        }
      }

      function clearHighlights() {
        for (var i = 0; i < linkRenderData.length; i++) {
          linkRenderData[i].active = false
        }
        for (var i = 0; i < nodeRenderData.length; i++) {
          nodeRenderData[i].active = false
        }
      }

      function renderPixiState() {
        for (var i = 0; i < nodeRenderData.length; i++) {
          var nd = nodeRenderData[i]
          nd.gfx.alpha = hoveredNodeId !== null ? (nd.active ? 1 : 0.2) : 1
        }
        for (var i = 0; i < linkRenderData.length; i++) {
          var ld = linkRenderData[i]
          ld.alpha = hoveredNodeId !== null ? (ld.active ? 1 : 0.15) : 1
          ld.color = ld.active ? gray : lightgray
        }
      }

      // Animation loop
      var stopAnimation = false
      function animate() {
        if (stopAnimation) return
        for (var i = 0; i < nodeRenderData.length; i++) {
          var n = nodeRenderData[i]
          var sd = n.simulationData
          if (sd.x != null && sd.y != null) {
            n.gfx.position.set(sd.x + width / 2, sd.y + height / 2)
            n.label.position.set(sd.x + width / 2, sd.y + height / 2)
          }
        }
        for (var i = 0; i < linkRenderData.length; i++) {
          var ld = linkRenderData[i]
          var sd = ld.simulationData
          var sx = sd.source.x,
            sy = sd.source.y,
            tx = sd.target.x,
            ty = sd.target.y
          if (sx != null && sy != null && tx != null && ty != null) {
            ld.gfx.clear()
            ld.gfx.moveTo(sx + width / 2, sy + height / 2)
            ld.gfx.lineTo(tx + width / 2, ty + height / 2)
            ld.gfx.stroke({ alpha: ld.alpha, width: 1, color: ld.color })
          }
        }
        requestAnimationFrame(animate)
      }

      simulation.on("tick", function () {})
      simulation.restart()
      animate()

      // Cleanup on SPA navigation
      function cleanup() {
        stopAnimation = true
        simulation.stop()
        try {
          app.destroy(true)
        } catch (_) {}
      }

      document.addEventListener("prenav", cleanup, { once: true })
      document.addEventListener("nav", function reinit() {
        var newContainers = document.querySelectorAll(".scoped-graph-container")
        for (var i = 0; i < newContainers.length; i++) {
          if (newContainers[i] !== container && !newContainers[i].dataset.initialized) {
            newContainers[i].dataset.initialized = "true"
            renderScopedGraph(newContainers[i], d3, PIXI)
          }
        }
      })
    }

    buildAndRender()
  }
})()
