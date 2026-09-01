(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  const ID = "microdonta";
  const MOTIF = "microdonta-constraint.svg";
  const node = data.nodes.find((item) => item.id === ID);
  if (!node) return;

  const role = {
    navigation: "method",
    character: "theory-method hinge",
    paperA: "channel-identifiability boundary theory",
    paperB: "RACH observation-selection methodology",
    mark: "⊢",
    formula: "Ω → G(Ω) → Aε → Q*",
    line: "測れない原因は、当てずに、制約で囲う。",
    move: "自然史・物理・生態知を、結果を見てからの説明ではなく pre-data constraint grammar G(θ) に翻訳する。シミュレーションは latent truth を生成せず、観測と両立する admissible set Aε を囲う。",
    keeps: "制約の provenance、inadmissible / incompatible / admissible / not-estimable の区別、bounded identified interval、残存因果集合、次観測の順序。",
    refuses: "生態学的もっともらしさを causal proof にすること、simulation fit を truth にすること、post-data constraint や未校正 proxy で測定不能を埋めること。"
  };

  Object.assign(node, {
    series: "method",
    status: "result",
    rolePrimary: role.character,
    roleNavigation: role.navigation,
    rolePaperA: role.paperA,
    rolePaperB: role.paperB,
    constraintTrace: role.formula,
    pulse: role.line,
    thoughtMove: role.move,
    thoughtKeeps: role.keeps,
    thoughtRefuses: role.refuses,
    summary: "Paper A は W=F×E と proxy calibration の下で、point / partial / non-identification の境界、identified interval、breakdown point を返す。Paper B は同じ思想を RACHへ運び、制約と観測に適合する因果世界を集合として残し、validated NOV / RACH-SEQ で次に測るものを選ぶ。",
    ceiling: "自然史・物理制約は pre-data かつ監査可能でなければならない。admissible mechanism は true mechanism ではなく、simulation fit は field causal validation ではない。proxy drift や predictive outcome map が未同定なら point estimate や NOV を製造しない。",
    next: "Paper A の bounded-drift boundary と Paper B の RACH method を別の主貢献として保ち、実データでは direct channel・安定校正 proxy・failure-aware observation bundle のいずれかを満たしたときだけ因果集合を縮める。",
    layers: ["theory-method hinge", "constraint grammar", "possible worlds", "identified interval", "next observation"]
  });

  data.microdontaRole = role;

  if (data.series.method) {
    data.series.method.lane = "CONSTRAINT → ADMISSIBLE SET → NEXT OBSERVATION → WORLD SET → GATE";
  }

  if (data.stories.method) {
    const existing = data.stories.method.nodes.filter((id) => id !== ID);
    data.stories.method.nodes = [ID, ...existing.filter((id) => ["eog", "acsp", "sdmr"].includes(id))];
    data.stories.method.text = "自然史と物理を答えではなく制約へ変え、残る世界を囲い、それらを最も分ける観測へ進む。";
  }

  const bitaEdge = data.edges.find((edge) => edge.from === "bita" && edge.to === ID);
  if (bitaEdge) bitaEdge.label = "identified set → constrained worlds";

  data.edges = data.edges.filter((edge) => !(edge.from === ID && edge.to === "ced"));
  data.edges.push({
    from: ID,
    to: "ced",
    type: "bridge",
    label: "mechanism information ↔ report license"
  });

  data.axes.forEach((axis) => {
    if ((axis.name === "方法" || axis.name === "理論") && !axis.repos.includes(ID)) axis.repos.push(ID);
  });

  if (data.books?.seven) {
    const book = data.books.seven.find((item) => item.repos?.[0] === ID);
    if (book) {
      Object.assign(book, {
        n: "M1",
        series: "method",
        title: `${ID} — ${role.line}`,
        note: "one repository, two governed papers: boundary theory ↔ observation-selection method。",
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
      book.title = "How can unmeasured causes be bounded without being invented? — microdonta";
      book.note = "constraint grammar → admissible set → next observation。";
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
  const axisGrid = document.getElementById("axisGrid");
  const searchInput = document.getElementById("searchInput");

  function firstText(button) {
    return button?.firstChild?.textContent?.trim() || button?.textContent?.trim() || "";
  }

  function enhanceNodeList() {
    nodeList?.querySelectorAll("button").forEach((button) => {
      if (firstText(button) !== ID) return;
      button.classList.add("is-method-theorem");
      button.title = `${ID} · theory / method hinge · ${role.line}`;
      button.setAttribute("aria-label", button.title);
    });
  }

  function enhanceDetail() {
    if (!detail) return;
    const heading = detail.querySelector("h3");
    if (heading?.textContent.trim() !== ID) return;

    detail.querySelector(".detail-content")?.classList.add("is-microdonta");

    const pulse = detail.querySelector(".detail-pulse");
    if (pulse) {
      if (pulse.textContent !== role.line) pulse.textContent = role.line;
      const depth = `${role.move}／残す: ${role.keeps}／拒む: ${role.refuses}`;
      pulse.title = depth;
      pulse.setAttribute("aria-label", `${role.line} ${depth}`);
    }

    if (!detail.querySelector(".detail-method-role")) {
      const marker = document.createElement("a");
      marker.className = "detail-method-role";
      marker.href = "microdonta-role-audit.json";
      marker.innerHTML = `<img src="${MOTIF}" alt="" />`;
      marker.title = "Paper A: theory · Paper B: method";
      marker.setAttribute("aria-label", marker.title);
      const status = detail.querySelector(".detail-status");
      if (status) status.after(marker);
      else heading.after(marker);
    }

    if (!detail.querySelector(".microdonta-trace")) {
      const trace = document.createElement("span");
      trace.className = "microdonta-trace";
      trace.textContent = role.formula;
      trace.title = "possible worlds → feasible worlds → observation-compatible worlds → next observation";
      trace.setAttribute("aria-label", trace.title);
      if (pulse) pulse.after(trace);
      else heading.after(trace);
    }
  }

  function enhanceBooks() {
    bookGrid?.querySelectorAll('[data-book-repo="microdonta"]').forEach((card) => {
      card.classList.add("is-method-theorem");
      card.title = `${ID} · theory / method hinge · ${role.line}`;
    });
  }

  function ensureTheoryAxisButton() {
    if (!axisGrid) return;
    const theoryCard = Array.from(axisGrid.querySelectorAll(".axis-card"))
      .find((card) => card.title === "理論");
    const host = theoryCard?.querySelector(".axis-repos");
    if (!host || host.querySelector('[data-axis-repo="microdonta"]')) return;

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.axisRepo = ID;
    button.textContent = ID;
    button.setAttribute("aria-label", `${ID} · boundary theory / method hinge`);
    button.addEventListener("click", () => {
      document.querySelector('[data-view="world"]')?.click();
      document.querySelector('[data-series="all"]')?.click();
      window.requestAnimationFrame(() => {
        Array.from(nodeList?.querySelectorAll("button") || [])
          .find((item) => firstText(item) === ID)?.click();
      });
    });
    host.appendChild(button);
  }

  function enhanceAll() {
    enhanceNodeList();
    enhanceDetail();
    enhanceBooks();
    ensureTheoryAxisButton();
  }

  if (nodeList) new MutationObserver(enhanceNodeList).observe(nodeList, { childList: true, subtree: true });
  if (detail) new MutationObserver(enhanceDetail).observe(detail, { childList: true, subtree: true });
  if (bookGrid) new MutationObserver(enhanceBooks).observe(bookGrid, { childList: true, subtree: true });
  if (axisGrid) new MutationObserver(ensureTheoryAxisButton).observe(axisGrid, { childList: true, subtree: true });

  enhanceAll();
  window.requestAnimationFrame(() => {
    searchInput?.dispatchEvent(new Event("input", { bubbles: true }));
    enhanceAll();
  });
})();