(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  const ORIGIN_ID = "hotarubukuro";
  const MOTIF = "hotarubukuro-motif.svg";
  const originNode = data.nodes.find((node) => node.id === ORIGIN_ID);
  if (!originNode) return;

  const origin = {
    repo: ORIGIN_ID,
    kind: "portfolio_provenance",
    line: "一つの花色多型を畳めなかったことが、すべての座標を開いた。",
    move: "原点の多型を単一原因へ閉じず、空間・進化時間・表現型解像度・生態文脈・観測・同定の問いへ分岐させ、得た座標を同じ系へ戻す。",
    keeps: "未解決な原点と、原点から枝分かれした問いが再び原点を解像する循環。",
    refuses: "hotarubukuro を後発の実証例または花色シリーズの第三章としてだけ扱うこと。",
    rule: "origin order != analytical chapter order",
    displayPath: "hotarubukuro ↻ fcp → chun → hotarubukuro"
  };

  Object.assign(originNode, {
    origin: true,
    originKind: origin.kind,
    originNote: origin.rule,
    pulse: origin.line,
    thoughtMove: origin.move,
    thoughtKeeps: origin.keeps,
    thoughtRefuses: origin.refuses
  });

  data.portfolioOrigin = origin;

  if (data.stories && data.stories.flower) {
    Object.assign(data.stories.flower, {
      origin: ORIGIN_ID,
      originRule: origin.rule,
      displayPath: origin.displayPath,
      text: "hotarubukuro は時間的・思想的な原点。fcp → chun → hotarubukuro は、その原点から生まれた問いを分析順に再構成し、再び原点へ戻す経路。"
    });
  }

  data.edges = data.edges.filter((edge) => !(edge.from === "fcp" && edge.to === ORIGIN_ID));
  if (!data.edges.some((edge) => edge.from === ORIGIN_ID && edge.to === "fcp")) {
    data.edges.push({
      from: ORIGIN_ID,
      to: "fcp",
      type: "origin",
      label: "origin -> spatial question"
    });
  }

  Object.values(data.books || {}).flat().forEach((book) => {
    if (book.repos && book.repos[0] === ORIGIN_ID) {
      book.title = `${ORIGIN_ID} — ${origin.line}`;
    }
  });

  if (!document.querySelector('link[href="origin.css"]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "origin.css";
    document.head.appendChild(stylesheet);
  }

  const canvas = document.getElementById("worldCanvas");
  const nodeList = document.getElementById("nodeList");
  const detail = document.getElementById("detailPanel");
  const bookGrid = document.getElementById("bookGrid");
  const searchInput = document.getElementById("searchInput");
  const originPoint = { x: 665, y: 270 };
  let drawQueued = false;

  function firstText(button) {
    return button && button.firstChild ? button.firstChild.textContent.trim() : "";
  }

  function addOriginSeed() {
    const voidGroup = document.querySelector(".void");
    if (!voidGroup || voidGroup.querySelector(".origin-seed")) return;

    voidGroup.insertAdjacentHTML("beforeend", `
      <g class="origin-seed" aria-hidden="true">
        <image class="origin-bell" href="${MOTIF}" x="476" y="337" width="52" height="68" preserveAspectRatio="xMidYMid meet" />
      </g>`);

    document.querySelector(".portal-flower")?.classList.add("has-origin");
  }

  function enhanceNodeList() {
    if (!nodeList) return;
    nodeList.querySelectorAll("button").forEach((button) => {
      if (firstText(button) !== ORIGIN_ID) return;
      button.classList.add("is-origin");
      button.title = `${ORIGIN_ID} · origin / return · ${origin.line}`;
      button.setAttribute("aria-label", button.title);
    });
  }

  function enhanceDetail() {
    if (!detail) return;

    const heading = detail.querySelector("h3");
    if (heading && heading.textContent.trim() === ORIGIN_ID) {
      const pulse = detail.querySelector(".detail-pulse");
      if (pulse) {
        if (pulse.textContent !== origin.line) pulse.textContent = origin.line;
        const depth = `${origin.move}／残す: ${origin.keeps}／拒む: ${origin.refuses}`;
        pulse.title = depth;
        pulse.setAttribute("aria-label", `${origin.line} ${depth}`);
      }

      if (!detail.querySelector(".detail-origin")) {
        const mark = document.createElement("a");
        mark.className = "detail-origin";
        mark.href = "origin-audit.json";
        mark.innerHTML = `<img src="${MOTIF}" alt="" />`;
        mark.title = "origin != chapter order";
        mark.setAttribute("aria-label", "hotarubukuro is the portfolio origin and return point");
        const status = detail.querySelector(".detail-status");
        if (status) status.after(mark);
        else heading.after(mark);
      }
    }

    const path = detail.querySelector(".path-code");
    const activeSeries = document.querySelector("[data-series].is-active")?.dataset.series;
    if (path && activeSeries === "flower") {
      if (path.textContent !== origin.displayPath) path.textContent = origin.displayPath;
      path.classList.add("origin-loop");

      if (!detail.querySelector(".origin-path-note")) {
        const note = document.createElement("span");
        note.className = "origin-path-note";
        note.textContent = "原点 ≠ 章順";
        note.title = "hotarubukuro is the biographical and epistemic origin; the displayed chapter order is analytical";
        path.before(note);
      }
    }
  }

  function enhanceBooks() {
    if (!bookGrid) return;
    bookGrid.querySelectorAll('[data-book-repo="hotarubukuro"]').forEach((card) => {
      card.classList.add("is-origin-fragment");
      card.title = `${ORIGIN_ID} · origin / return · ${origin.line}`;
    });
  }

  function originIsVisible() {
    if (!nodeList) return true;
    return Array.from(nodeList.querySelectorAll("button")).some((button) => firstText(button) === ORIGIN_ID);
  }

  function drawBellMotif(context, x, y, scale) {
    context.save();
    context.translate(x, y);
    context.rotate(-0.08);
    context.scale(scale, scale);
    context.fillStyle = "#e6b85c";
    context.strokeStyle = "#e6b85c";
    context.lineCap = "round";
    context.lineJoin = "round";

    context.globalAlpha = .72;
    context.lineWidth = 1.35;
    context.beginPath();
    context.moveTo(6, -14);
    context.bezierCurveTo(5, -9, 2, -4, 0, 0);
    context.stroke();

    context.globalAlpha = .48;
    context.lineWidth = .9;
    context.beginPath();
    context.moveTo(0, -1);
    context.bezierCurveTo(-3, -3, -5, -2, -7, 0);
    context.moveTo(0, -1);
    context.bezierCurveTo(3, -2, 5, 0, 6, 2);
    context.stroke();

    context.globalAlpha = .9;
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(0, -1);
    context.bezierCurveTo(-7, -1, -10, 5, -9, 12);
    context.bezierCurveTo(-8, 18, -11, 21, -14, 24);
    context.bezierCurveTo(-9, 22, -5, 23, -2, 27);
    context.bezierCurveTo(0, 23, 3, 23, 6, 27);
    context.bezierCurveTo(9, 23, 13, 23, 17, 25);
    context.bezierCurveTo(13, 21, 11, 17, 12, 12);
    context.bezierCurveTo(13, 5, 8, 0, 0, -1);
    context.closePath();
    context.stroke();

    context.globalAlpha = .52;
    [[-4, 13, 1.1], [2, 17, 1], [7, 12, .8]].forEach(([cx, cy, radius]) => {
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.fill();
    });
    context.restore();
  }

  function drawOriginHalo() {
    drawQueued = false;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const visible = originIsVisible();

    ctx.save();
    ctx.globalAlpha = visible ? .72 : .08;
    ctx.strokeStyle = "#e6b85c";
    ctx.lineWidth = .8;
    ctx.setLineDash([2, 5]);
    ctx.shadowColor = "#e6b85c";
    ctx.shadowBlur = visible ? 7 : 0;
    ctx.beginPath();
    ctx.ellipse(originPoint.x, originPoint.y, 64, 22, -.04, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.globalAlpha = visible ? .34 : .04;
    ctx.beginPath();
    ctx.ellipse(originPoint.x, originPoint.y, 72, 28, .05, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = visible ? .9 : .08;
    ctx.shadowColor = "#e6b85c";
    ctx.shadowBlur = visible ? 5 : 0;
    drawBellMotif(ctx, originPoint.x + 61, originPoint.y - 26, .55);
    ctx.restore();
  }

  function scheduleOriginHalo() {
    if (drawQueued) return;
    drawQueued = true;
    window.requestAnimationFrame(drawOriginHalo);
  }

  function enhanceAll() {
    addOriginSeed();
    enhanceNodeList();
    enhanceDetail();
    enhanceBooks();
    scheduleOriginHalo();
  }

  if (nodeList) new MutationObserver(enhanceAll).observe(nodeList, { childList: true, subtree: true });
  if (detail) new MutationObserver(enhanceDetail).observe(detail, { childList: true, subtree: true });
  if (bookGrid) new MutationObserver(enhanceBooks).observe(bookGrid, { childList: true, subtree: true });

  searchInput?.addEventListener("input", scheduleOriginHalo);
  canvas?.addEventListener("click", scheduleOriginHalo);
  window.addEventListener("resize", scheduleOriginHalo, { passive: true });

  enhanceAll();

  window.requestAnimationFrame(() => {
    searchInput?.dispatchEvent(new Event("input", { bubbles: true }));
    enhanceAll();
  });
})();