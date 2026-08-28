(function () {
  "use strict";

  const data = window.WORLDLINES;
  const canvas = document.getElementById("worldCanvas");
  const ctx = canvas.getContext("2d");
  const detailPanel = document.getElementById("detailPanel");
  const nodeList = document.getElementById("nodeList");
  const searchInput = document.getElementById("searchInput");
  const state = { enabledSeries: new Set(Object.keys(data.series)), query: "", selected: null, story: null, bookRoute: "seven", hits: [] };
  const byId = new Map(data.nodes.map((node) => [node.id, node]));
  const statusLabels = { result: "CLEARED", bounded: "BOUND", open: "OPEN", stop: "STOP" };

  function nodeLabel(node) { return node.label || node.id; }
  function searchable(node) { return [node.id, node.label, node.series, node.summary, node.ceiling, node.next, ...node.layers].filter(Boolean).join(" ").toLowerCase(); }
  function isVisible(node) { return state.enabledSeries.has(node.series) && (!state.query || searchable(node).includes(state.query)) && (!state.story || data.stories[state.story].nodes.includes(node.id)); }

  function renderSeriesFilters() {
    const host = document.getElementById("seriesFilter"); host.innerHTML = "";
    Object.entries(data.series).forEach(([id, meta]) => {
      const b = document.createElement("button"); b.type = "button"; b.textContent = meta.label; b.style.setProperty("--series-color", meta.color); b.setAttribute("aria-pressed", "true");
      b.addEventListener("click", () => { state.enabledSeries.has(id) ? state.enabledSeries.delete(id) : state.enabledSeries.add(id); b.classList.toggle("is-muted", !state.enabledSeries.has(id)); b.setAttribute("aria-pressed", String(state.enabledSeries.has(id))); renderWorld(); });
      host.appendChild(b);
    });
  }

  function roundedRect(c, x, y, w, h, r) { const q = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + q, y); c.arcTo(x + w, y, x + w, y + h, q); c.arcTo(x + w, y + h, x, y + h, q); c.arcTo(x, y + h, x, y, q); c.arcTo(x, y, x + w, y, q); c.closePath(); }

  function drawEdge(edge, nodeW, nodeH) {
    const from = byId.get(edge.from), to = byId.get(edge.to); if (!from || !to) return;
    const active = isVisible(from) && isVisible(to); const inStory = state.story && data.stories[state.story].nodes.includes(from.id) && data.stories[state.story].nodes.includes(to.id);
    const x1 = from.x * canvas.width, y1 = from.y * canvas.height, x2 = to.x * canvas.width, y2 = to.y * canvas.height; const curve = Math.max(26, Math.min(84, Math.abs(x2 - x1) * .2));
    ctx.save(); ctx.globalAlpha = active ? (inStory ? .95 : .25) : .025; ctx.strokeStyle = inStory ? "#e8dfb5" : "#56606d"; ctx.lineWidth = inStory ? 1.5 : .8; ctx.setLineDash(edge.type === "solid" ? [] : [3, 8]);
    ctx.beginPath(); ctx.moveTo(x1, y1 + nodeH / 2); ctx.bezierCurveTo(x1 + curve, y1 + nodeH / 2, x2 - curve, y2 - nodeH / 2, x2, y2 - nodeH / 2); ctx.stroke(); ctx.restore();
  }

  function drawLane(index, id, meta) {
    const first = data.nodes.find((n) => n.series === id); if (!first) return; const y = first.y * canvas.height;
    ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.025)"; ctx.beginPath(); ctx.moveTo(34, y); ctx.lineTo(canvas.width - 34, y); ctx.stroke(); ctx.fillStyle = meta.color; ctx.globalAlpha = .65; ctx.font = "9px ui-monospace, Consolas, monospace"; ctx.fillText(`${String(index + 1).padStart(2, "0")} ${meta.label}`, 34, y - 44); ctx.restore();
  }

  function drawNode(node, nodeW, nodeH) {
    const x = node.x * canvas.width - nodeW / 2, y = node.y * canvas.height - nodeH / 2, visible = isVisible(node), selected = state.selected === node.id, storySelected = state.story && data.stories[state.story].nodes.includes(node.id), color = data.series[node.series].color;
    ctx.save(); ctx.globalAlpha = visible ? 1 : .04; if (selected || storySelected) { ctx.shadowColor = color; ctx.shadowBlur = selected ? 28 : 10; }
    roundedRect(ctx, x, y, nodeW, nodeH, 14); ctx.fillStyle = selected ? color : "rgba(7,9,13,.9)"; ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = selected ? color : (storySelected ? color : "rgba(255,255,255,.12)"); ctx.lineWidth = selected ? 1.5 : .8; ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 12, y + 12, 2.5, 0, Math.PI * 2); ctx.fillStyle = node.status === "stop" ? "#ef798a" : node.status === "result" ? "#72d4a8" : node.status === "bounded" ? color : "#68717c"; ctx.fill();
    ctx.fillStyle = selected ? "#090b0f" : "#ece9df"; ctx.font = `500 ${nodeLabel(node).length > 16 ? 10 : 12}px ui-monospace, monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(nodeLabel(node), x + nodeW / 2, y + nodeH / 2 + 1, nodeW - 18); ctx.restore();
    state.hits.push({ id: node.id, x, y, w: nodeW, h: nodeH, visible });
  }

  function renderCanvas() { const nodeW = 124, nodeH = 34; ctx.clearRect(0, 0, canvas.width, canvas.height); state.hits = []; Object.entries(data.series).forEach(([id, meta], i) => drawLane(i, id, meta)); data.edges.forEach((e) => drawEdge(e, nodeW, nodeH)); data.nodes.forEach((n) => drawNode(n, nodeW, nodeH)); }
  function renderNodeList() { nodeList.innerHTML = ""; data.nodes.filter(isVisible).forEach((node) => { const b = document.createElement("button"); b.type = "button"; b.style.setProperty("--node-color", data.series[node.series].color); b.innerHTML = `<span>${nodeLabel(node)}</span><small>${statusLabels[node.status]}</small>`; b.addEventListener("click", () => selectNode(node.id)); nodeList.appendChild(b); }); }
  function renderWorld() { renderCanvas(); renderNodeList(); }

  function selectNode(id) {
    const node = byId.get(id); if (!node) return; state.selected = id; const meta = data.series[node.series]; detailPanel.style.setProperty("--series-color", meta.color);
    detailPanel.innerHTML = `<div class="detail-content"><div class="detail-kicker">FRAGMENT / ${meta.label}</div><h3>${nodeLabel(node)}</h3><span class="detail-status">${statusLabels[node.status]}</span><div class="detail-layers">${node.layers.slice(0,3).map((x) => `<span>${x}</span>`).join("")}</div><h4>CLUE</h4><p>${node.summary}</p><h4>LIMIT</h4><p>${node.ceiling}</p><h4>NEXT</h4><p>${node.next}</p><a class="detail-link" href="https://github.com/zuizui0223/${node.id}" target="_blank" rel="noreferrer">SOURCE ↗</a></div>`;
    renderCanvas();
  }

  function selectStory(id) {
    document.querySelectorAll("[data-story]").forEach((b) => b.classList.remove("is-active"));
    if (id === "all") { state.story = null; state.selected = null; detailPanel.innerHTML = `<div class="detail-empty"><span class="detail-orbit" aria-hidden="true"></span><p>触れて。</p></div>`; }
    else { state.story = id; document.querySelector(`[data-story="${id}"]`).classList.add("is-active"); const story = data.stories[id], color = data.series[byId.get(story.nodes[0]).series].color; detailPanel.style.setProperty("--series-color", color); detailPanel.innerHTML = `<div class="detail-content"><div class="detail-kicker">PATH</div><h3>${story.label}</h3><p class="path-code">${story.nodes.map((n) => nodeLabel(byId.get(n))).join(" → ")}</p></div>`; }
    renderWorld();
  }

  function renderAxes() {
    const host = document.getElementById("axisGrid"), pairs = [...new Set(data.axes.map((a) => a.pair))];
    host.innerHTML = pairs.map((pair) => `<section class="axis-pair"><div class="axis-pair-header">${pair}</div>${data.axes.filter((a) => a.pair === pair).map((axis) => `<article class="axis-card" style="--axis-color:${axis.color}"><h3>${axis.name}</h3><div class="axis-repos">${axis.repos.map((r) => `<button type="button" data-axis-repo="${r}">${r}</button>`).join("")}</div></article>`).join("")}</section>`).join("");
    host.querySelectorAll("[data-axis-repo]").forEach((b) => b.addEventListener("click", () => { showView("world"); selectStory("all"); selectNode(b.dataset.axisRepo); }));
  }

  function renderBooks() {
    const host = document.getElementById("bookGrid"); host.innerHTML = data.books[state.bookRoute].map((book) => { const meta = data.series[book.series]; return `<article class="book-card" style="--book-color:${meta.color}"><span class="book-number">${book.n}</span><h3>${book.title}</h3><div class="book-meta">${book.repos.map((r) => `<span>${r}</span>`).join("")}</div></article>`; }).join("");
  }

  function showView(view) { document.querySelectorAll(".view-tab").forEach((b) => { const a = b.dataset.view === view; b.classList.toggle("is-active", a); b.setAttribute("aria-selected", String(a)); }); document.querySelectorAll(".view-panel").forEach((p) => { const a = p.id === `${view}View`; p.hidden = !a; p.classList.toggle("is-active", a); }); if (view === "world") renderWorld(); }

  canvas.addEventListener("click", (event) => { const rect = canvas.getBoundingClientRect(), sx = canvas.width / rect.width, sy = canvas.height / rect.height, x = (event.clientX - rect.left) * sx, y = (event.clientY - rect.top) * sy; const hit = state.hits.find((h) => h.visible && x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h); if (hit) selectNode(hit.id); });
  canvas.addEventListener("mousemove", (event) => { const rect = canvas.getBoundingClientRect(), sx = canvas.width / rect.width, sy = canvas.height / rect.height, x = (event.clientX - rect.left) * sx, y = (event.clientY - rect.top) * sy; canvas.style.cursor = state.hits.some((h) => h.visible && x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) ? "pointer" : "crosshair"; });
  document.querySelectorAll(".view-tab").forEach((b) => b.addEventListener("click", () => showView(b.dataset.view)));
  document.querySelectorAll("[data-story]").forEach((b) => b.addEventListener("click", () => selectStory(b.dataset.story)));
  document.querySelectorAll("[data-book-route]").forEach((b) => b.addEventListener("click", () => { state.bookRoute = b.dataset.bookRoute; document.querySelectorAll("[data-book-route]").forEach((x) => x.classList.toggle("is-active", x === b)); renderBooks(); }));
  searchInput.addEventListener("input", () => { state.query = searchInput.value.trim().toLowerCase(); state.story = null; document.querySelectorAll("[data-story]").forEach((b) => b.classList.remove("is-active")); renderWorld(); });
  document.addEventListener("keydown", (event) => { if (event.key === "/" && document.activeElement !== searchInput) { event.preventDefault(); searchInput.focus(); } if (event.key === "Escape") { searchInput.value = ""; state.query = ""; selectStory("all"); } });

  renderSeriesFilters(); renderWorld(); renderAxes(); renderBooks();
})();