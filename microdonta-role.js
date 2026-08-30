(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  const ID = "microdonta";
  const node = data.nodes.find((item) => item.id === ID);
  if (!node) return;

  const role = {
    primary: "method",
    secondary: "theorem-backed",
    mark: "⊢",
    line: "原因を選べないとき、次の観測を選ぶ。",
    move: "N1–N4で observation class の structural non-identifiability を切り出し、RACHで compatible mechanisms を集合として保ち、validated NOV / RACH-SEQで次の観測順序を選ぶ。",
    keeps: "admissible causal set、mechanism-equivalence structure、not-estimable outcome、calibration condition、停止規則、観測順序。",
    refuses: "best-model rankingを原因同定とみなすこと、hidden truthを候補順位へ混ぜること、未校正proxyをchannel measurementへ昇格すること。"
  };

  Object.assign(node, {
    series: "method",
    status: "result",
    rolePrimary: role.primary,
    roleSecondary: role.secondary,
    pulse: role.line,
    thoughtMove: role.move,
    thoughtKeeps: role.keeps,
    thoughtRefuses: role.refuses,
    summary: "N1–N4は観測クラスの同定境界を保証する。その境界で一つの原因を選ばず、RACHは残る因果プログラム、縮約不能な同値構造、validated NOVとRACH-SEQによる次観測を返す。定理は主役を方法へ変える保証層。",
    ceiling: "admissible mechanismをtrue mechanismと呼ばず、synthetic selection benchmarkをfield causal validationへ移送しない。candidate outcome mapやproxy calibrationが不十分ならNOVはnot estimableのまま残す。",
    next: "凍結したMEE coreを保ち、独立系のevidence-aware bundleで観測契約とcalibration gateを満たしたときだけempirical bridgeを開く。",
    layers: ["method primary", "theorem spine", "admissible set", "next observation"]
  });

  data.microdontaRole = role;

  if (data.series.method) {
    data.series.method.lane = "ADMISSIBLE SET → NEXT OBSERVATION → WORLD SET → EXTERNAL GATE";
  }

  if (data.stories.method) {
    const existing = data.stories.method.nodes.filter((id) => id !== ID);
    data.stories.method.nodes = [ID, ...existing.filter((id) => ["eog", "acsp", "sdmr"].includes(id))];
    data.stories.method.text = "非同定を終点にせず、残存因果集合から次観測を選び、compatible worlds・外部gate・sealed endpointへ運ぶ。";
  }

  data.edges = data.edges.filter((edge) => !(edge.from === ID && edge.to === "ced"));
  data.edges.push({
    from: ID,
    to: "ced",
    type: "bridge",
    label: "mechanism information ↔ report license"
  });

  data.axes.forEach((axis) => {
    if (axis.name === "方法" && !axis.repos.includes(ID)) axis.repos.push(ID);
    if (axis.name === "理論") axis.repos = axis.repos.filter((repo) => repo !== ID);
  });

  if (data.books?.seven) {
    const book = data.books.seven.find((item) => item.repos?.[0] === ID);
    if (book) {
      Object.assign(book, {
        n: "M1",
        series: "method",
        title: `${ID} — ${role.line}`,
        note: "theorem-backed method: admissible set → next observation。",
        status: "1 repo = 1 chapter"
      });
    }
    let index = 1;
    data.books.seven.filter((item) => item.series === "method").forEach((item) => {
      item.n = `M${index++}`;
    });
  }

  if (data.books?.eight) {
    const book = data.books.eight.find((item) => item.repos?.[0] === ID);
    if (book) {
      book.series = "method";
      book.title = "When causes remain admissible, what should be observed next? — microdonta";
      book.note = "theorem boundary → operational observation choice。";
    }
  }

  window.ZUIZUI_THOUGHTS = window.ZUIZUI_THOUGHTS || {};
  window.ZUIZUI_THOUGHTS[ID] = {
    line: role.line,
    move: role.move,
    keeps: role.keeps,
    refuses: role.refuses
  };

  if (!document.querySelector('link[href="microdonta-role.css"]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "microdonta-role.css";
    document.head.appendChild(stylesheet);
  }

  const detail = document.getElementById("detailPanel");
  const nodeList = document.getElementById("nodeList");
  const bookGrid = document.getElementById("bookGrid");
  const searchInput = document.getElementById("searchInput");

  function firstText(button) {
    return button?.firstChild?.textContent?.trim() || button?.textContent?.trim() || "";
  }

  function enhanceNodeList() {
    nodeList?.querySelectorAll("button").forEach((button) => {
      if (firstText(button) !== ID) return;
      button.classList.add("is-method-theorem");
      button.title = `${ID} · method / theorem spine · ${role.line}`;
      button.setAttribute("aria-label", button.title);
    });
  }

  function enhanceDetail() {
    if (!detail) return;
    const heading = detail.querySelector("h3");
    if (heading?.textContent.trim() !== ID) return;

    const pulse = detail.querySelector(".detail-pulse");
    if (pulse) {
      pulse.textContent = role.line;
      const depth = `${role.move}／残す: ${role.keeps}／拒む: ${role.refuses}`;
      pulse.title = depth;
      pulse.setAttribute("aria-label", `${role.line} ${depth}`);
    }

    if (!detail.querySelector(".detail-method-role")) {
      const marker = document.createElement("a");
      marker.className = "detail-method-role";
      marker.href = "microdonta-role-audit.json";
      marker.textContent = role.mark;
      marker.title = "methodology primary · theorem-backed";
      marker.setAttribute("aria-label", marker.title);
      const status = detail.querySelector(".detail-status");
      if (status) status.after(marker);
      else heading.after(marker);
    }
  }

  function enhanceBooks() {
    bookGrid?.querySelectorAll('[data-book-repo="microdonta"]').forEach((card) => {
      card.classList.add("is-method-theorem");
      card.title = `${ID} · method / theorem spine · ${role.line}`;
    });
  }

  function enhanceAll() {
    enhanceNodeList();
    enhanceDetail();
    enhanceBooks();
  }

  if (nodeList) new MutationObserver(enhanceNodeList).observe(nodeList, { childList: true, subtree: true });
  if (detail) new MutationObserver(enhanceDetail).observe(detail, { childList: true, subtree: true });
  if (bookGrid) new MutationObserver(enhanceBooks).observe(bookGrid, { childList: true, subtree: true });

  enhanceAll();
  window.requestAnimationFrame(() => {
    searchInput?.dispatchEvent(new Event("input", { bubbles: true }));
    enhanceAll();
  });
})();
