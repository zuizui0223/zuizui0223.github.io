(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  const ORIGIN_ID = "hotarubukuro";
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
        <path class="origin-petal" d="M482 366C487 356 494 357 502 364C510 357 517 356 522 366C519 380 512 388 502 389C492 388 485 380 482 366Z" />
        <path class="origin-fold" d="M490 368C495 372 499 374 502 364C505 374 509 372 514 368" />
        <path class="origin-stem" d="M502 389C501 396 499 401 496 405" />
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
        pulse.textContent = origin.line;
        const depth = `${origin.move}／残す: ${origin.keeps}／拒む: ${origin.refuses}`;
        pulse.title = depth;
        pulse.setAttribute("aria-label", `${origin.line} ${depth}`);
      }

      if (!detail.querySelector(".detail-origin")) {
        const mark = document.createElement("a");
        mark.className = "detail-origin";
        mark.href = "origin-audit.json";
        mark.textContent = "↺";
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
      path.textContent = origin.displayPath;
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

    ctx.setLineDash([]);
    ctx.globalAlpha = visible ? .66 : .07;
    ctx.fillStyle = "#e6b85c";
    ctx.font = "9px ui-monospace, SFMono-Regular, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("↺", originPoint.x + 63, originPoint.y - 15);
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