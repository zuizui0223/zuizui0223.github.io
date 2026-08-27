(function () {
  "use strict";

  const data = window.WORLDLINES;
  const canvas = document.getElementById("worldCanvas");
  const ctx = canvas.getContext("2d");
  const detailPanel = document.getElementById("detailPanel");
  const nodeList = document.getElementById("nodeList");
  const searchInput = document.getElementById("searchInput");
  const state = {
    enabledSeries: new Set(Object.keys(data.series)),
    query: "",
    selected: null,
    story: null,
    bookRoute: "seven",
    hits: []
  };

  const byId = new Map(data.nodes.map((node) => [node.id, node]));
  const statusLabels = {
    result: "CONCLUSION CORE",
    bounded: "BOUNDED RESULT",
    open: "ACTIVE / OPEN",
    stop: "STOP / FALSIFICATION"
  };

  function nodeLabel(node) { return node.label || node.id; }
  function searchable(node) {
    return [node.id, node.label, node.series, node.summary, node.ceiling, node.next, ...node.layers]
      .filter(Boolean).join(" ").toLowerCase();
  }

  function isVisible(node) {
    const seriesOn = state.enabledSeries.has(node.series);
    const queryOn = !state.query || searchable(node).includes(state.query);
    const storyOn = !state.story || data.stories[state.story].nodes.includes(node.id);
    return seriesOn && queryOn && storyOn;
  }

  function renderSeriesFilters() {
    const host = document.getElementById("seriesFilter");
    host.innerHTML = "";
    Object.entries(data.series).forEach(([id, meta]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = meta.label;
      button.style.setProperty("--series-color", meta.color);
      button.setAttribute("aria-pressed", "true");
      button.addEventListener("click", () => {
        if (state.enabledSeries.has(id)) state.enabledSeries.delete(id);
        else state.enabledSeries.add(id);
        button.classList.toggle("is-muted", !state.enabledSeries.has(id));
        button.setAttribute("aria-pressed", String(state.enabledSeries.has(id)));
        renderWorld();
      });
      host.appendChild(button);
    });
  }

  function roundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function drawEdge(edge, nodeW, nodeH) {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (!from || !to) return;
    const active = isVisible(from) && isVisible(to);
    const inStory = state.story && data.stories[state.story].nodes.includes(from.id) && data.stories[state.story].nodes.includes(to.id);
    const x1 = from.x * canvas.width;
    const y1 = from.y * canvas.height;
    const x2 = to.x * canvas.width;
    const y2 = to.y * canvas.height;
    const dx = x2 - x1;
    const curve = Math.max(26, Math.min(84, Math.abs(dx) * .2));

    ctx.save();
    ctx.globalAlpha = active ? (inStory ? .95 : .36) : .045;
    ctx.strokeStyle = inStory ? "#f1d274" : "#728092";
    ctx.lineWidth = inStory ? 2 : 1;
    ctx.setLineDash(edge.type === "solid" ? [] : [6, 7]);
    ctx.beginPath();
    ctx.moveTo(x1, y1 + nodeH / 2);
    ctx.bezierCurveTo(x1 + curve, y1 + nodeH / 2, x2 - curve, y2 - nodeH / 2, x2, y2 - nodeH / 2);
    ctx.stroke();

    if (inStory) {
      ctx.setLineDash([]);
      ctx.fillStyle = "#f1d274";
      ctx.font = "11px ui-monospace, Consolas, monospace";
      ctx.textAlign = "center";
      ctx.fillText(edge.label, (x1 + x2) / 2, (y1 + y2) / 2 - 5);
    }
    ctx.restore();
  }

  function drawLane(index, id, meta) {
    const y = data.nodes.find((n) => n.series === id).y * canvas.height;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.055)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(34, y);
    ctx.lineTo(canvas.width - 34, y);
    ctx.stroke();
    ctx.fillStyle = meta.color;
    ctx.globalAlpha = .85;
    ctx.font = "10px ui-monospace, Consolas, monospace";
    ctx.textAlign = "left";
    ctx.fillText(`${String(index + 1).padStart(2, "0")}  ${meta.lane}`, 34, y - 45);
    ctx.restore();
  }

  function drawNode(node, nodeW, nodeH) {
    const x = node.x * canvas.width - nodeW / 2;
    const y = node.y * canvas.height - nodeH / 2;
    const visible = isVisible(node);
    const selected = state.selected === node.id;
    const storySelected = state.story && data.stories[state.story].nodes.includes(node.id);
    const color = data.series[node.series].color;

    ctx.save();
    ctx.globalAlpha = visible ? 1 : .08;
    if (selected || storySelected) {
      ctx.shadowColor = color;
      ctx.shadowBlur = selected ? 22 : 12;
    }
    roundedRect(ctx, x, y, nodeW, nodeH, 9);
    ctx.fillStyle = selected ? color : "#151e2b";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = selected ? color : (storySelected ? color : "rgba(255,255,255,.18)");
    ctx.lineWidth = selected ? 2 : 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + 12, y + 12, 3.2, 0, Math.PI * 2);
    if (node.status === "stop") ctx.fillStyle = "#ef798a";
    else if (node.status === "result") ctx.fillStyle = "#72d4a8";
    else if (node.status === "bounded") ctx.fillStyle = color;
    else ctx.fillStyle = "#7d8998";
    ctx.fill();

    ctx.fillStyle = selected ? "#10151f" : "#f3f0e8";
    ctx.font = `600 ${nodeLabel(node).length > 16 ? 11 : 13}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(nodeLabel(node), x + nodeW / 2, y + nodeH / 2 + 1, nodeW - 16);
    ctx.restore();

    state.hits.push({ id: node.id, x, y, w: nodeW, h: nodeH, visible });
  }

  function renderCanvas() {
    const nodeW = 126;
    const nodeH = 38;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.hits = [];
    Object.entries(data.series).forEach(([id, meta], index) => drawLane(index, id, meta));
    data.edges.forEach((edge) => drawEdge(edge, nodeW, nodeH));
    data.nodes.forEach((node) => drawNode(node, nodeW, nodeH));
  }

  function renderNodeList() {
    nodeList.innerHTML = "";
    data.nodes.filter(isVisible).forEach((node) => {
      const button = document.createElement("button");
      button.type = "button";
      button.style.setProperty("--node-color", data.series[node.series].color);
      button.innerHTML = `<span>${nodeLabel(node)}</span><small>${data.series[node.series].label}</small>`;
      button.addEventListener("click", () => selectNode(node.id));
      nodeList.appendChild(button);
    });
  }

  function renderWorld() {
    renderCanvas();
    renderNodeList();
  }

  function selectNode(id) {
    const node = byId.get(id);
    if (!node) return;
    state.selected = id;
    const meta = data.series[node.series];
    detailPanel.style.setProperty("--series-color", meta.color);
    detailPanel.innerHTML = `
      <div class="detail-content">
        <div class="detail-kicker">${meta.label.toUpperCase()} WORLDLINE</div>
        <h3>${nodeLabel(node)}</h3>
        <span class="detail-status">${statusLabels[node.status]}</span>
        <h4>LAYER</h4>
        <div class="detail-layers">${node.layers.map((layer) => `<span>${layer}</span>`).join("")}</div>
        <h4>CURRENT RESULT / ROLE</h4>
        <p>${node.summary}</p>
        <h4>CLAIM CEILING</h4>
        <p>${node.ceiling}</p>
        <h4>NEXT BRIDGE</h4>
        <p>${node.next}</p>
        <a class="detail-link" href="https://github.com/zuizui0223/${node.id}" target="_blank" rel="noreferrer">所有元リポジトリを開く ↗</a>
      </div>`;
    renderCanvas();
  }

  function selectStory(id) {
    document.querySelectorAll("[data-story]").forEach((button) => button.classList.remove("is-active"));
    if (id === "all") {
      state.story = null;
      state.selected = null;
      detailPanel.innerHTML = `<div class="detail-empty"><span class="detail-orbit" aria-hidden="true"></span><p>ノードを選ぶと、役割・現在の結論・claim ceiling・次の接続を表示します。</p></div>`;
    } else {
      state.story = id;
      document.querySelector(`[data-story="${id}"]`).classList.add("is-active");
      const story = data.stories[id];
      const color = data.series[byId.get(story.nodes[0]).series].color;
      detailPanel.style.setProperty("--series-color", color);
      detailPanel.innerHTML = `
        <div class="detail-content">
          <div class="detail-kicker">SELECTED WORLDLINE</div>
          <h3>${story.label}</h3>
          <div class="detail-layers">${story.nodes.map((node) => `<span>${nodeLabel(byId.get(node))}</span>`).join("")}</div>
          <h4>HOW TO READ</h4>
          <p>${story.text}</p>
          <h4>ORDER</h4>
          <p>${story.nodes.map((node) => nodeLabel(byId.get(node))).join(" → ")}</p>
        </div>`;
    }
    renderWorld();
  }

  function renderAxes() {
    const host = document.getElementById("axisGrid");
    const pairs = [...new Set(data.axes.map((axis) => axis.pair))];
    host.innerHTML = pairs.map((pair) => {
      const axes = data.axes.filter((axis) => axis.pair === pair);
      return `<section class="axis-pair">
        <div class="axis-pair-header">${pair}</div>
        ${axes.map((axis, index) => `<article class="axis-card" data-index="${String(data.axes.indexOf(axis) + 1).padStart(2, "0")}" style="--axis-color:${axis.color}">
          <h3>${axis.name}</h3>
          <p>${axis.question}</p>
          <div class="axis-repos">${axis.repos.map((repo) => `<button type="button" data-axis-repo="${repo}">${repo}</button>`).join("")}</div>
        </article>`).join("")}
      </section>`;
    }).join("");
    host.querySelectorAll("[data-axis-repo]").forEach((button) => {
      button.addEventListener("click", () => {
        showView("world");
        selectStory("all");
        selectNode(button.dataset.axisRepo);
      });
    });
  }

  function renderBooks() {
    const host = document.getElementById("bookGrid");
    host.innerHTML = data.books[state.bookRoute].map((book) => {
      const meta = data.series[book.series];
      return `<article class="book-card" style="--book-color:${meta.color}">
        <span class="book-number">BOOK ${book.n} · ${book.chapters} CHAPTERS</span>
        <h3>${book.title}</h3>
        <p>${book.note}</p>
        <div class="book-meta">${book.repos.map((repo) => `<span>${repo}</span>`).join("")}</div>
        <div class="book-status">${book.status}</div>
      </article>`;
    }).join("");
  }

  function showView(view) {
    document.querySelectorAll(".view-tab").forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".view-panel").forEach((panel) => {
      const active = panel.id === `${view}View`;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (view === "world") renderWorld();
  }

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    const hit = state.hits.find((item) => item.visible && x >= item.x && x <= item.x + item.w && y >= item.y && y <= item.y + item.h);
    if (hit) selectNode(hit.id);
  });

  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    canvas.style.cursor = state.hits.some((item) => item.visible && x >= item.x && x <= item.x + item.w && y >= item.y && y <= item.y + item.h) ? "pointer" : "default";
  });

  document.querySelectorAll(".view-tab").forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
  document.querySelectorAll("[data-story]").forEach((button) => button.addEventListener("click", () => selectStory(button.dataset.story)));
  document.querySelectorAll("[data-book-route]").forEach((button) => button.addEventListener("click", () => {
    state.bookRoute = button.dataset.bookRoute;
    document.querySelectorAll("[data-book-route]").forEach((item) => item.classList.toggle("is-active", item === button));
    renderBooks();
  }));

  searchInput.addEventListener("input", () => {
    state.query = searchInput.value.trim().toLowerCase();
    state.story = null;
    document.querySelectorAll("[data-story]").forEach((button) => button.classList.remove("is-active"));
    renderWorld();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== searchInput) {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === "Escape") {
      searchInput.value = "";
      state.query = "";
      selectStory("all");
    }
  });

  renderSeriesFilters();
  renderWorld();
  renderAxes();
  renderBooks();
})();
