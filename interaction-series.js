(function () {
  "use strict";
  const data = window.WORLDLINES;
  if (!data) return;

  const ID = "interaction";
  const COLOR = "#d28dac";
  const GLYPH = "⋈";
  const unique = (items) => [...new Set(items)];
  const upsert = (id, values) => {
    let target = data.nodes.find((node) => node.id === id);
    if (!target) {
      target = { id, x: .5, y: .5, layers: [] };
      data.nodes.push(target);
    }
    Object.assign(target, values);
    return target;
  };

  data.series[ID] = {
    label: "相互作用",
    color: COLOR,
    lane: "SHARED COORDINATE → MIDDLE WORLD → DIFFERENTIATED COORDINATES"
  };

  const sch = upsert("sch", {
    series: ID,
    x: .13,
    y: .90,
    status: "bounded",
    layers: ["chapter 1", "shared coordinate", "functional conflict", "compromise surface", "causal analyzer"],
    pulse: "一つの形質座標に二つの機能を押し込めると、妥協が生まれる。",
    thoughtMove: "二つの fitness-relevant functions が一つの phenotypic coordinate を共有するとき、state-specific optima と combined compromise を分けて causal conflict geometry を復元する。",
    thoughtKeeps: "state-specific functional optima、combined optimum、fitness-scale conflict load L、negative controls。",
    thoughtRefuses: "multifunctionality を conflict と同一視すること、state-specific optimum を pure-function optimum と呼ぶこと、SCHだけで differentiation を結論すること。",
    summary: "Chapter 1 / shared-coordinate world。real-world multifunctionality と case-level compromise は回収済みで、state-specific causal compromise analyzer も準備済み。完全 causal compromise experiment はまだ未実行。",
    ceiling: "完全 causal experiment 前に pure-function optima・historical modularization・trait differentiation を確定しない。",
    next: "qualified causal compromise receipt と共通 fitness scale 上の conflict load L を BALANCE へ渡す。"
  });
  delete sch.scientificRef;
  delete sch.sourceUrl;

  const balance = upsert("balance", {
    label: "BALANCE",
    series: ID,
    x: .18,
    y: .955,
    status: "bounded",
    layers: ["chapter 2", "middle world", "architecture reserve", "domain depth", "topology", "hysteresis"],
    pulse: "葛藤があっても、分化が得とは限らない。",
    thoughtMove: "SCH-facing conflict L>0 と BITA-facing architecture margin Φ=sL-K<0 を同時に満たす regime を独立 object として扱い、その位置・深さ・幅・連結性・持続性を測る。",
    thoughtKeeps: "L、R=sL、K、Φ、reserve ρ、position ξ、depth d_B、direct ΔW、bridge residual、switching-cost hysteresis。",
    thoughtRefuses: "BALANCEを単なる不等式のつなぎとみなすこと、低位gateからhistorical splittingやmacroevolutionary reversibilityを読むこと。",
    summary: "Chapter 2 / middle world。shared-axis conflict は実在するが differentiated architecture はまだ割に合わない領域を所有する。6つの理論命題と回帰テストがあり、matched SCH/BITA worldlines による自然データempirical gateは未完。",
    ceiling: "理論・実装結果を自然界での middle-world prevalence、historical transition、true parallel-world shiftへ昇格しない。",
    next: "matched context × common fitness scale で L>0 と ΔW<0 を直接回収し、可能なら s,K 分解・環境経路・hysteresis を段階的に検証する。"
  });

  const bita = upsert("bita", {
    series: ID,
    status: "result",
    layers: ["chapter 3", "differentiated coordinates", "architecture gain", "partial decoupling", "identified set", "mechanism allocation"],
    pulse: "分化は、回収できる妥協損失が追加コストを上回るときに得になる。",
    thoughtMove: "shared architecture を含む拡張 phenotype space で recoverable compromise loss R と追加 architecture cost K を分け、Δ_arch=R-K の符号と mechanism allocation を別々に識別する。",
    thoughtKeeps: "R≥0、Δ_arch=R-K、quadratic R=sL、Φ=0 critical interface、Φ>0 differentiated world、A×D interaction と compatible mechanism set。",
    thoughtRefuses: "positive A×D interaction を historical splitting や complete functional independence と呼ぶこと、total effect の符号だけで mechanism allocation を一点化すること。",
    summary: "Chapter 3 / differentiated-coordinate world。追加軸が shared compromise の回収可能損失をどこまで解放し、いつ追加コストを上回るかを定式化する。floral worked case では total interaction と mechanism allocation を分離する。",
    ceiling: "trait-axis separationを完全独立・歴史的分化・自然界での普遍的優越へ読み替えない。",
    next: "submission metadataを閉じ、追加介入は mechanism-identification extensionとして扱う。"
  });

  data.stories[ID] = {
    label: "相互作用",
    axiom: "葛藤 ≠ 即分化",
    nodes: ["sch", "balance", "bita"],
    text: "同じ座標で妥協する世界 → 葛藤があっても分化がまだ割に合わない middle world → 分化が得になる世界。",
    displayPath: "SCH → BALANCE → BITA"
  };

  data.edges = (data.edges || []).filter((edge) => !(
    (edge.from === "sch" && edge.to === "bita") ||
    (edge.from === "sch" && edge.to === "balance") ||
    (edge.from === "balance" && edge.to === "bita")
  ));
  data.edges.push(
    { from: "sch", to: "balance", type: "solid", relation: "handoff", label: "causal compromise / conflict load → middle-world domain" },
    { from: "balance", to: "bita", type: "solid", relation: "handoff", label: "architecture reserve / critical crossing → differentiated world" }
  );

  (data.axes || []).forEach((axis) => {
    if (["パターン", "メカニズム"].includes(axis.name)) {
      ["sch", "balance"].forEach((id) => {
        if (!axis.repos.includes(id)) axis.repos.push(id);
      });
    }
  });

  ["seven", "eight"].forEach((route) => {
    const books = data.books?.[route];
    if (!books) return;
    const bitaIndex = books.findIndex((book) => book.repos?.[0] === "bita");
    if (bitaIndex >= 0) Object.assign(books[bitaIndex], { series: ID, title: `BITA — ${bita.pulse}`, note: "Chapter 3 · differentiated architecture", status: "result" });

    if (!books.some((book) => book.repos?.[0] === "sch")) {
      const insertion = bitaIndex >= 0 ? bitaIndex : books.length;
      books.splice(insertion, 0, { n: "B1", title: `SCH — ${sch.pulse}`, chapters: 1, series: ID, repos: ["sch"], note: "Chapter 1 · shared-coordinate compromise", status: "bounded" });
    }
    if (!books.some((book) => book.repos?.[0] === "balance")) {
      const schIndex = books.findIndex((book) => book.repos?.[0] === "sch");
      books.splice(schIndex >= 0 ? schIndex + 1 : books.length, 0, { n: "B2", title: `BALANCE — ${balance.pulse}`, chapters: 1, series: ID, repos: ["balance"], note: "Chapter 2 · middle world", status: "bounded" });
    }

    if (route === "seven") {
      const labels = { sch: "B1", balance: "B2", bita: "B3" };
      books.forEach((book) => {
        const repo = book.repos?.[0];
        if (labels[repo]) book.n = labels[repo];
      });
    } else {
      books.forEach((book, index) => { book.n = String(index + 1); });
    }
  });

  window.ZUIZUI_THOUGHTS = window.ZUIZUI_THOUGHTS || {};
  [sch, balance, bita].forEach((item) => {
    window.ZUIZUI_THOUGHTS[item.id] = {
      line: item.pulse,
      move: item.thoughtMove,
      keeps: item.thoughtKeeps,
      refuses: item.thoughtRefuses
    };
  });

  const portals = document.querySelector(".portals");
  if (portals && !portals.querySelector('[data-portal="interaction"]')) {
    portals.insertAdjacentHTML("beforeend", `<g class="portal portal-interaction" data-portal="interaction" tabindex="0" role="button" aria-label="相互作用"><title>相互作用</title><path id="portal-interaction" class="portal-line" d="M552 370C666 356 794 350 918 362" /><path class="portal-hit" d="M552 370C666 356 794 350 918 362" /><circle class="portal-node" cx="918" cy="362" r="18" /><text x="918" y="367">${GLYPH}</text></g>`);
  }

  const axiomRing = document.querySelector(".axiom-ring");
  if (axiomRing && !axiomRing.querySelector('[data-axiom-series="interaction"]')) {
    axiomRing.insertAdjacentHTML("beforeend", `<button type="button" data-axiom-series="interaction" style="--axiom-color:${COLOR}"><i>${GLYPH}</i><span>葛藤 ≠ 即分化</span></button>`);
  }
})();
