(function () {
  "use strict";

  const data = window.WORLDLINES;
  const canvas = document.getElementById("worldCanvas");
  const ctx = canvas.getContext("2d");
  const detailPanel = document.getElementById("detailPanel");
  const nodeList = document.getElementById("nodeList");
  const searchInput = document.getElementById("searchInput");
  const copyUrl = document.getElementById("copyUrl");

  const state = {
    query: "",
    selected: null,
    story: null,
    bookRoute: "seven",
    hits: []
  };

  const byId = new Map(data.nodes.map((node) => [node.id, node]));

  const seriesGlyphs = {
    azami: "✣",
    flower: "◐",
    island: "⌁",
    observation: "◎",
    method: "∴",
    theory: "∞"
  };

  const axisGlyphs = {
    "空間": "⌖",
    "時間": "◷",
    "観測": "◉",
    "現実": "○",
    "パターン": "≋",
    "メカニズム": "∵",
    "方法": "⌁",
    "理論": "∞"
  };

  const statusLabels = {
    result: "cleared",
    bounded: "bounded",
    open: "open",
    stop: "stop"
  };

  const statusColors = {
    result: "#72d4a8",
    bounded: "#d9d0aa",
    open: "#737985",
    stop: "#ef798a"
  };

  const layout = {
    azami: [245, 130],
    EAzami: [420, 230],

    fcp: [570, 76],
    chun: [625, 178],
    hotarubukuro: [665, 270],

    island: [1080, 118],
    "izu-core": [910, 218],
    shimahotarubukuro: [770, 306],

    pollipi: [1090, 566],
    insepi: [930, 500],
    tnoa: [790, 408],

    bita: [300, 624],
    microdonta: [438, 590],
    eog: [555, 536],
    acsp: [636, 478],
    sdmr: [684, 414],

    crest: [116, 350],
    ccoc: [220, 274],
    mltr: [334, 326],
    mrm: [420, 394],
    ced: [505, 348],
    "eco-genetic-criticality": [350, 514],
    "eco-genetic-warning-extensions": [208, 514],
    theouni: [558, 302]
  };

  function nodeLabel(node) {
    return node.label || node.id;
  }

  function point(node) {
    const mapped = layout[node.id];
    if (mapped) return { x: mapped[0], y: mapped[1] };
    return { x: node.x * canvas.width, y: node.y * canvas.height };
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function compact(value, max = 88) {
    const cleaned = String(value)
      .replace(/^Chapter\s+\d+\s*[—–-]\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();
    const first = cleaned.split(/(?<=[。！？!?])\s*/)[0] || cleaned;
    return first.length > max ? `${first.slice(0, max - 1)}…` : first;
  }

  function searchable(node) {
    return [
      node.id,
      node.label,
      node.series,
      node.summary,
      node.ceiling,
      node.next,
      ...node.layers
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function isVisible(node) {
    const queryOn = !state.query || searchable(node).includes(state.query);
    const storyOn = !state.story || data.stories[state.story].nodes.includes(node.id);
    return queryOn && storyOn;
  }

  function setActivePath(id) {
    document.querySelectorAll("[data-series]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.series === id);
    });
    document.querySelectorAll("[data-portal]").forEach((portal) => {
      portal.classList.toggle("is-active", portal.dataset.portal === id);
    });
  }

  function renderSeriesFilters() {
    const host = document.getElementById("seriesFilter");
    host.innerHTML = "";

    Object.entries(data.series).forEach(([id, meta]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.series = id;
      button.textContent = seriesGlyphs[id] || "·";
      button.style.setProperty("--series-color", meta.color);
      button.setAttribute("aria-label", meta.label);
      button.title = meta.label;
      button.addEventListener("click", () => selectStory(id));
      host.appendChild(button);
    });

    const all = document.createElement("button");
    all.type = "button";
    all.dataset.series = "all";
    all.textContent = "·";
    all.setAttribute("aria-label", "all");
    all.title = "all";
    all.addEventListener("click", () => selectStory("all"));
    host.appendChild(all);
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

  function pseudo(index, salt) {
    const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
    return value - Math.floor(value);
  }

  function drawField() {
    ctx.save();
    ctx.fillStyle = "#06070a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 145; i += 1) {
      const x = pseudo(i, 2) * canvas.width;
      const y = pseudo(i, 7) * canvas.height;
      const radius = .35 + pseudo(i, 11) * .9;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(233,230,221,${.035 + pseudo(i, 17) * .08})`;
      ctx.fill();
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    for (let ring = 0; ring < 4; ring += 1) {
      ctx.beginPath();
      const points = 96;
      for (let i = 0; i <= points; i += 1) {
        const angle = (i / points) * Math.PI * 2;
        const base = 66 + ring * 28;
        const wave = Math.sin(angle * (3 + ring) + ring) * (7 + ring * 2);
        const x = cx + Math.cos(angle) * (base + wave);
        const y = cy + Math.sin(angle) * ((base + wave) * .72);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(217,208,170,${.055 - ring * .009})`;
      ctx.lineWidth = .7;
      ctx.stroke();
    }

    const branchCenters = [
      [245, 130, data.series.azami.color],
      [570, 76, data.series.flower.color],
      [1080, 118, data.series.island.color],
      [1090, 566, data.series.observation.color],
      [438, 590, data.series.method.color],
      [116, 350, data.series.theory.color]
    ];

    branchCenters.forEach(([x, y, color]) => {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 95);
      glow.addColorStop(0, `${color}16`);
      glow.addColorStop(1, `${color}00`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 95, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawEdge(edge) {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (!from || !to) return;

    const a = point(from);
    const b = point(to);
    const active = isVisible(from) && isVisible(to);
    const inStory = state.story &&
      data.stories[state.story].nodes.includes(from.id) &&
      data.stories[state.story].nodes.includes(to.id);
    const sameSeries = from.series === to.series;
    const color = sameSeries ? data.series[from.series].color : "#6a707a";
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    ctx.globalAlpha = active ? (inStory ? .95 : sameSeries ? .32 : .11) : .025;
    ctx.strokeStyle = color;
    ctx.lineWidth = inStory ? 1.5 : sameSeries ? .8 : .55;
    ctx.setLineDash(edge.type === "solid" ? [] : [3, 7]);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.bezierCurveTo(
      a.x + (centerX - a.x) * .38,
      a.y + (centerY - a.y) * .22,
      b.x + (centerX - b.x) * .38,
      b.y + (centerY - b.y) * .22,
      b.x,
      b.y
    );
    ctx.stroke();
    ctx.restore();
  }

  function drawNode(node, nodeWidth, nodeHeight) {
    const p = point(node);
    const x = p.x - nodeWidth / 2;
    const y = p.y - nodeHeight / 2;
    const visible = isVisible(node);
    const selected = state.selected === node.id;
    const storySelected = state.story && data.stories[state.story].nodes.includes(node.id);
    const color = data.series[node.series].color;

    ctx.save();
    ctx.globalAlpha = visible ? 1 : .035;

    if (selected || storySelected) {
      ctx.shadowColor = color;
      ctx.shadowBlur = selected ? 20 : 8;
    }

    roundedRect(ctx, x, y, nodeWidth, nodeHeight, nodeHeight / 2);
    ctx.fillStyle = selected ? color : "rgba(6,7,10,.9)";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = selected
      ? color
      : storySelected
        ? color
        : "rgba(233,230,221,.12)";
    ctx.lineWidth = selected ? 1.2 : .65;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + 9, y + 8, 2, 0, Math.PI * 2);
    ctx.fillStyle = statusColors[node.status] || "#737985";
    ctx.fill();

    ctx.fillStyle = selected ? "#08090c" : "#cbc8c0";
    ctx.font = `500 ${nodeLabel(node).length > 15 ? 8 : 9}px ui-monospace, SFMono-Regular, Consolas, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(nodeLabel(node), p.x, p.y + .5, nodeWidth - 16);
    ctx.restore();

    state.hits.push({
      id: node.id,
      x,
      y,
      w: nodeWidth,
      h: nodeHeight,
      visible
    });
  }

  function renderCanvas() {
    const nodeWidth = 102;
    const nodeHeight = 24;
    drawField();
    state.hits = [];
    data.edges.forEach(drawEdge);
    data.nodes.forEach((node) => drawNode(node, nodeWidth, nodeHeight));
  }

  function renderNodeList() {
    nodeList.innerHTML = "";

    data.nodes.filter(isVisible).forEach((node) => {
      const button = document.createElement("button");
      button.type = "button";
      button.style.setProperty("--node-color", data.series[node.series].color);
      button.textContent = nodeLabel(node);
      button.title = `${nodeLabel(node)} · ${statusLabels[node.status]}`;
      button.setAttribute("aria-label", button.title);
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
    const symbol = seriesGlyphs[node.series] || "·";

    detailPanel.style.setProperty("--series-color", meta.color);
    detailPanel.style.setProperty("--status-color", statusColors[node.status] || "#737985");
    detailPanel.innerHTML = `
      <div class="detail-content">
        <span class="path-symbol" aria-hidden="true">${symbol}</span>
        <h3>${escapeHtml(nodeLabel(node))}</h3>
        <span class="detail-status" aria-label="${escapeHtml(statusLabels[node.status])}" title="${escapeHtml(statusLabels[node.status])}"></span>
        <details class="detail-more">
          <summary aria-label="more">＋</summary>
          <p class="clue">${escapeHtml(compact(node.summary, 110))}</p>
          <p class="limit">${escapeHtml(node.ceiling)}</p>
          <p class="next">${escapeHtml(node.next)}</p>
        </details>
        <a class="detail-link" href="https://github.com/zuizui0223/${encodeURIComponent(node.id)}" target="_blank" rel="noreferrer" aria-label="source" title="source">↗</a>
      </div>`;

    renderCanvas();
  }

  function selectStory(id) {
    if (id === "all") {
      state.story = null;
      state.selected = null;
      setActivePath("all");
      detailPanel.innerHTML = `<div class="detail-empty"><span class="detail-orbit" aria-hidden="true"></span></div>`;
    } else {
      const story = data.stories[id];
      if (!story) return;

      state.story = id;
      state.selected = null;
      setActivePath(id);

      const first = byId.get(story.nodes[0]);
      const meta = data.series[first.series];
      detailPanel.style.setProperty("--series-color", meta.color);
      detailPanel.innerHTML = `
        <div class="detail-content">
          <span class="path-symbol" aria-hidden="true">${seriesGlyphs[id] || "·"}</span>
          <p class="path-code">${story.nodes.map((nodeId) => escapeHtml(nodeLabel(byId.get(nodeId)))).join(" → ")}</p>
        </div>`;
    }

    renderWorld();
  }

  function renderAxes() {
    const host = document.getElementById("axisGrid");

    host.innerHTML = data.axes.map((axis) => `
      <article class="axis-card" style="--axis-color:${axis.color}" title="${escapeHtml(axis.name)}">
        <span class="axis-glyph" aria-label="${escapeHtml(axis.name)}">${axisGlyphs[axis.name] || "·"}</span>
        <div class="axis-repos">
          ${axis.repos.map((repo) => `<button type="button" data-axis-repo="${escapeHtml(repo)}" aria-label="${escapeHtml(repo)}">${escapeHtml(repo)}</button>`).join("")}
        </div>
      </article>`).join("");

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
      const repo = book.repos[0];
      return `
        <button type="button" class="book-card" data-book-repo="${escapeHtml(repo)}" style="--book-color:${meta.color}" title="${escapeHtml(book.title)}">
          <span class="book-number">${escapeHtml(book.n)}</span>
          <strong>${escapeHtml(repo)}</strong>
        </button>`;
    }).join("");

    host.querySelectorAll("[data-book-repo]").forEach((button) => {
      button.addEventListener("click", () => {
        showView("world");
        selectStory("all");
        selectNode(button.dataset.bookRepo);
        document.getElementById("atlas").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
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

  function activatePortal(element) {
    const id = element.dataset.portal;
    showView("world");
    selectStory(id);
    document.getElementById("atlas").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    const hit = state.hits.find((item) =>
      item.visible &&
      x >= item.x &&
      x <= item.x + item.w &&
      y >= item.y &&
      y <= item.y + item.h
    );
    if (hit) selectNode(hit.id);
  });

  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    canvas.style.cursor = state.hits.some((item) =>
      item.visible &&
      x >= item.x &&
      x <= item.x + item.w &&
      y >= item.y &&
      y <= item.y + item.h
    ) ? "pointer" : "crosshair";
  });

  document.querySelectorAll(".view-tab").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  document.querySelectorAll("[data-book-route]").forEach((button) => {
    button.addEventListener("click", () => {
      state.bookRoute = button.dataset.bookRoute;
      document.querySelectorAll("[data-book-route]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderBooks();
    });
  });

  document.querySelectorAll("[data-portal]").forEach((portal) => {
    portal.addEventListener("click", () => activatePortal(portal));
    portal.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activatePortal(portal);
      }
    });
  });

  searchInput.addEventListener("input", () => {
    state.query = searchInput.value.trim().toLowerCase();
    state.story = null;
    state.selected = null;
    setActivePath("all");
    renderWorld();
  });

  if (copyUrl) {
    copyUrl.addEventListener("click", async () => {
      const url = window.location.href.split("#")[0];
      try {
        await navigator.clipboard.writeText(url);
      } catch (error) {
        const area = document.createElement("textarea");
        area.value = url;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
      }

      copyUrl.textContent = "✓";
      copyUrl.classList.add("is-copied");
      window.setTimeout(() => {
        copyUrl.textContent = "⧉";
        copyUrl.classList.remove("is-copied");
      }, 1200);
    });
  }

  document.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
    document.documentElement.style.setProperty("--my", `${event.clientY}px`);
    const glow = document.querySelector(".pointer-glow");
    if (glow) {
      glow.style.setProperty("--mx", `${event.clientX}px`);
      glow.style.setProperty("--my", `${event.clientY}px`);
    }
  }, { passive: true });

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
  setActivePath("all");
  renderWorld();
  renderAxes();
  renderBooks();
})();