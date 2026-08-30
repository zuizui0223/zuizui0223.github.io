(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  const ID = "interaction";
  const COLOR = "#d28dac";
  const GLYPH = "⋈";
  const SCH_REF = "codex/shared-cue-hypothesis-migration";
  const SCH_PR = "https://github.com/zuizui0223/sch/pull/1";

  data.series[ID] = {
    label: "相互作用",
    color: COLOR,
    lane: "SHARED CUE → ESCAPE → ALLOCATION"
  };

  const sch = {
    id: "sch",
    series: ID,
    x: .13,
    y: .90,
    status: "open",
    layers: ["shared cue", "one trait", "signal conflict", "systematic screen"],
    pulse: "共有された合図では、魅力は味方だけに届かない。",
    thoughtMove: "一つの attraction/display coordinate A を、pollinator benefit と antagonist cost が同時に読む conflict coordinate として扱う。",
    thoughtKeeps: "同じ A 上の利益と損失、compromise・specialization・polymorphism・population change・branching・cue modularization を別の進化的終点として残す。",
    thoughtRefuses: "pollinator attraction を純利益とみなすこと、また sparse evidence や NOT_EVALUABLE を shared-cue conflict の不在へ変換すること。",
    summary: "一つの共有 cue A に pollinator benefit M_A と antagonist cost G_A を同じ座標で置く。active PR は 868 件の凍結 systematic-screening universe を持ち、strict linked experiment・地理・same-code receiver evidence を別ゲートで進めている。",
    ceiling: "一形質 evidence を BITA の A×D evidence と混同せず、未完 screening を systematic-review completion や meta-analytic effect と呼ばない。DIRECT_L4 / private-cue origin は現状 NOT_EVALUABLE。",
    next: "凍結 868 cohort の screening と geography / receiver-assemblage coding を完了し、same-code experiment と historical transition gate を閉じる。",
    scientificRef: SCH_REF,
    sourceUrl: SCH_PR
  };

  if (!data.nodes.some((node) => node.id === "sch")) data.nodes.push(sch);
  else Object.assign(data.nodes.find((node) => node.id === "sch"), sch);

  const bita = data.nodes.find((node) => node.id === "bita");
  if (bita) {
    Object.assign(bita, {
      series: ID,
      pulse: "逃げ道が開いても、何が開けたかは一つに定まらない。",
      thoughtMove: "one-trait conflict に defence coordinate D を加え、outcome-level escape sign と、その sign を生む relief / interference / joint-cost allocation を分ける。",
      thoughtKeeps: "A×D total interaction が持つ escape-sign information と、rho / iota / kappa の compatible allocation set を同時に残す。",
      thoughtRefuses: "total interaction の符号を full mechanism explanation とみなすこと、また residual を差し引きだけで kappa と命名すること。",
      summary: "SCH の一形質 conflict に antagonist-reducing trait D を加える。A×D total interaction は条件を満たせば escape の符号を決められるが、同じ total surface だけでは relief・pollinator interference・remaining joint channel の配分は一点同定できない。",
      ceiling: "route recurrence を prevalence や total A×D interaction と読まず、outcome-level escape と mechanism allocation を混同しない。現在の screened systems は robust positive empirical escape も full allocation もまだ閉じていない。",
      next: "common-outcome A×D evidence を増やし、selective crossed consumer interventions と independent joint-cost assay で mechanism allocation を閉じる。",
      layers: ["second coordinate", "escape sign", "identified set", "mechanism allocation"]
    });
  }

  data.stories[ID] = {
    label: "相互作用",
    axiom: "合図 ≠ 一方通行",
    nodes: ["sch", "bita"],
    text: "一つの shared cue が利益と損失を同じ軸に重ねる。第二の defence coordinate は escape を可能にしうるが、escape の有無と、その機構配分は別の問い。"
  };

  if (data.stories.method) {
    data.stories.method.nodes = data.stories.method.nodes.filter((id) => id !== "bita");
    data.stories.method.text = "残る causal worlds を保ち、次観測・world set・external gate・sealed answer check へ進む。";
  }

  data.edges = data.edges.filter((edge) => !(edge.from === "sch" && edge.to === "bita"));
  data.edges.push({ from: "sch", to: "bita", type: "solid", label: "shared cue → second-coordinate escape" });

  data.axes.forEach((axis) => {
    if ((axis.name === "パターン" || axis.name === "メカニズム") && !axis.repos.includes("sch")) {
      axis.repos.push("sch");
    }
  });

  if (data.books?.seven) {
    const books = data.books.seven;
    const bitaBook = books.find((book) => book.repos?.[0] === "bita");
    if (bitaBook) {
      Object.assign(bitaBook, {
        n: "B2",
        series: ID,
        title: `bita — ${bita?.pulse || "escape sign ≠ mechanism allocation"}`,
        note: "second coordinate: escape sign と mechanism allocation を分ける。",
        status: "1 repo = 1 chapter"
      });
      if (!books.some((book) => book.repos?.[0] === "sch")) {
        books.splice(books.indexOf(bitaBook), 0, {
          n: "B1",
          title: `sch — ${sch.pulse}`,
          chapters: 1,
          series: ID,
          repos: ["sch"],
          note: "one shared cue 上の mutualist–antagonist conflict。",
          status: "active PR ref"
        });
      }
    }
    let m = 1;
    books.filter((book) => book.series === "method").forEach((book) => { book.n = `M${m++}`; });
  }

  if (data.books?.eight) {
    const books = data.books.eight;
    const bitaIndex = books.findIndex((book) => book.repos?.[0] === "bita");
    if (bitaIndex >= 0) {
      books[bitaIndex].series = ID;
      books[bitaIndex].title = "Does a second trait create escape, and can its cause be allocated? — bita";
      books[bitaIndex].note = "escape sign ≠ mechanism allocation。";
      if (!books.some((book) => book.repos?.[0] === "sch")) {
        books.splice(bitaIndex, 0, {
          n: "",
          title: "When does attraction become a conflict? — sch",
          chapters: 1,
          series: ID,
          repos: ["sch"],
          note: "one shared cue。",
          status: "question route"
        });
      }
    }
    books.forEach((book, index) => { book.n = String(index + 1); });
  }

  const motifBook = (repo, line) => {
    Object.values(data.books || {}).flat().filter((book) => book.repos?.[0] === repo).forEach((book) => {
      book.title = `${repo} — ${line}`;
    });
  };
  motifBook("sch", sch.pulse);
  if (bita) motifBook("bita", bita.pulse);

  window.ZUIZUI_THOUGHTS = window.ZUIZUI_THOUGHTS || {};
  window.ZUIZUI_THOUGHTS.sch = {
    line: sch.pulse,
    move: sch.thoughtMove,
    keeps: sch.thoughtKeeps,
    refuses: sch.thoughtRefuses
  };
  if (bita) {
    window.ZUIZUI_THOUGHTS.bita = {
      line: bita.pulse,
      move: bita.thoughtMove,
      keeps: bita.thoughtKeeps,
      refuses: bita.thoughtRefuses
    };
  }

  if (!document.querySelector('link[href="interaction-series.css"]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "interaction-series.css";
    document.head.appendChild(stylesheet);
  }

  const brainDesc = document.getElementById("brain-desc");
  if (brainDesc) brainDesc.textContent = "研究系列と横断系列が中心の空洞へ流れ込む抽象図。";

  const portals = document.querySelector(".portals");
  if (portals && !portals.querySelector('[data-portal="interaction"]')) {
    portals.insertAdjacentHTML("beforeend", `
      <g class="portal portal-interaction" data-portal="interaction" tabindex="0" role="button" aria-label="相互作用">
        <title>相互作用</title>
        <path id="portal-interaction" class="portal-line" d="M552 370C666 356 794 350 918 362" />
        <path class="portal-hit" d="M552 370C666 356 794 350 918 362" />
        <circle class="portal-node" cx="918" cy="362" r="18" /><text x="918" y="367">${GLYPH}</text>
      </g>`);
    document.querySelector(".particles")?.insertAdjacentHTML("beforeend", `<circle r="2.2"><animateMotion dur="11s" begin="-3s" repeatCount="indefinite"><mpath href="#portal-interaction" /></animateMotion></circle>`);
  }

  const axiomRing = document.querySelector(".axiom-ring");
  if (axiomRing && !axiomRing.querySelector('[data-axiom-series="interaction"]')) {
    axiomRing.insertAdjacentHTML("beforeend", `<button type="button" data-axiom-series="interaction" style="--axiom-color:${COLOR}"><i>${GLYPH}</i><span>合図 ≠ 一方通行</span></button>`);
  }

  const seriesFilter = document.getElementById("seriesFilter");
  const detail = document.getElementById("detailPanel");

  function syncRenderedGlyphs() {
    const button = seriesFilter?.querySelector('[data-series="interaction"]');
    if (button) {
      button.textContent = GLYPH;
      button.title = "相互作用";
      button.setAttribute("aria-label", "相互作用");
    }

    const active = document.querySelector('[data-series="interaction"].is-active');
    if (active) {
      const symbol = detail?.querySelector(".path-symbol");
      if (symbol) symbol.textContent = GLYPH;
    }

    const heading = detail?.querySelector("h3");
    if (heading?.textContent.trim() === "sch") {
      const source = detail.querySelector(".detail-link");
      if (source) {
        source.href = SCH_PR;
        source.title = `active PR #1 · ${SCH_REF}`;
        source.setAttribute("aria-label", source.title);
      }
    }
  }

  function syncPerspectiveIntersection() {
    const mode = document.body.dataset.perspective || "all";
    const related = mode === "coordinate" || mode === "boundary";
    document.querySelectorAll('[data-portal="interaction"], [data-axiom-series="interaction"]').forEach((element) => {
      element.classList.toggle("is-perspective-related", related);
      element.classList.toggle("is-perspective-dim", mode !== "all" && !related);
    });
  }

  if (seriesFilter) new MutationObserver(syncRenderedGlyphs).observe(seriesFilter, { childList: true, subtree: true });
  if (detail) new MutationObserver(syncRenderedGlyphs).observe(detail, { childList: true, subtree: true });
  new MutationObserver(syncPerspectiveIntersection).observe(document.body, { attributes: true, attributeFilter: ["data-perspective"] });

  syncRenderedGlyphs();
  syncPerspectiveIntersection();
})();
