(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  const node = (id) => data.nodes.find((item) => item.id === id);
  const patch = (id, values) => {
    const target = node(id);
    if (target) Object.assign(target, values);
    return target;
  };
  const unique = (items) => [...new Set(items)];

  // 2026-09-05 canonical interaction programme: SCH -> BALANCE -> BITA.
  data.series.interaction = {
    ...(data.series.interaction || {}),
    label: "相互作用",
    lane: "SHARED COORDINATE → MIDDLE WORLD → DIFFERENTIATED COORDINATES"
  };

  const sch = patch("sch", {
    series: "interaction",
    status: "bounded",
    layers: ["chapter 1", "shared coordinate", "functional conflict", "compromise surface", "causal analyzer"],
    pulse: "一つの形質座標に二つの機能を押し込めると、妥協が生まれる。",
    thoughtMove: "二つの fitness-relevant functions が一つの phenotypic coordinate z を共有するとき、state-specific optima と combined compromise を分けて causal conflict geometry を復元する。",
    thoughtKeeps: "z_P*、z_G*、z_C*、fitness-scale conflict load L、state-specific と pure-function reference の区別、negative controls。",
    thoughtRefuses: "multifunctionality を conflict と同一視すること、state-specific optimum を自動的に pure-function optimum と呼ぶこと、SCHだけで differentiation を結論すること。",
    summary: "Chapter 1 / shared-coordinate world。real-world multifunctionality と case-level compromise は回収済みで、state-specific causal compromise analyzer も準備済み。決定的な完全 causal compromise experiment はまだ未実行。",
    ceiling: "完全 causal experiment 前に pure-function optima・historical modularization・trait differentiation を確定しない。",
    next: "conflict-active context を事前資格化し、同一 fitness scale の causal compromise receipt と L を BALANCE へ渡す。"
  });
  if (sch) {
    delete sch.scientificRef;
    delete sch.sourceUrl;
  }

  let balance = node("balance");
  const balancePatch = {
    label: "BALANCE",
    series: "interaction",
    x: .18,
    y: .955,
    status: "bounded",
    layers: ["chapter 2", "middle world", "architecture reserve", "domain depth", "topology", "hysteresis"],
    pulse: "葛藤があっても、分化が得とは限らない。",
    thoughtMove: "SCH-facing conflict L>0 と BITA-facing architecture margin Φ=sL-K<0 を同時に満たす sandwiched ecological regime を独立の scientific object として扱い、その位置・深さ・幅・連結性・持続性を測る。",
    thoughtKeeps: "L、R=sL、K、Φ=R-K、reserve ρ=K-R、position ξ=L/(L+ρ)、depth d_B=min(L,ρ)、direct ΔW、bridge residual、switching-cost hysteresis。",
    thoughtRefuses: "BALANCEを単なる不等式のつなぎとみなすこと、低位gateからhistorical splittingやmacroevolutionary reversibilityを読むこと、direct/decomposed mismatchを平均で消すこと。",
    summary: "Chapter 2 / middle world。shared-axis conflict は実在するが differentiated architecture はまだ割に合わない領域を所有する。6つの理論命題と回帰テストがあり、matched SCH/BITA worldlines による自然データempirical gateは未完。",
    ceiling: "理論・実装結果を自然界での middle-world prevalence、historical transition、true parallel-world shiftへ昇格しない。",
    next: "matched context × common fitness scale で L>0 と ΔW<0 を直接回収し、可能なら s,K 分解・環境経路・hysteresis を段階的に検証する。"
  };
  if (!balance) {
    balance = { id: "balance", ...balancePatch };
    data.nodes.push(balance);
  } else {
    Object.assign(balance, balancePatch);
  }

  const bita = patch("bita", {
    series: "interaction",
    status: "result",
    layers: ["chapter 3", "differentiated coordinates", "architecture gain", "partial decoupling", "identified set", "mechanism allocation"],
    pulse: "分化は、回収できる妥協損失が追加コストを上回るときに得になる。",
    thoughtMove: "shared architecture を含む拡張 phenotype space で recoverable compromise loss R と追加 architecture cost K を分け、Δ_arch=R-K の符号と differentiated-world mechanism allocation を別々に識別する。",
    thoughtKeeps: "R≥0、Δ_arch=R-K、quadratic R=sL、Φ=0 critical interface、Φ>0 differentiated world、A×D interaction と compatible mechanism set。",
    thoughtRefuses: "positive A×D interaction を historical splitting や complete functional independence と呼ぶこと、total effect の符号だけで mechanism allocation を一点化すること。",
    summary: "Chapter 3 / differentiated-coordinate world。追加軸が shared compromise の回収可能損失をどこまで解放し、いつ追加コストを上回るかを定式化する。floral worked case では total interaction と mechanism allocation を分離する。",
    ceiling: "trait-axis separationを完全独立・歴史的分化・自然界での普遍的優越へ読み替えない。",
    next: "submission metadataを閉じ、crossed interventions / independent channel assays は mechanism-identification extensionとして扱う。"
  });

  data.stories.interaction = {
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

  // Current 2026-09-05 README-level scientific state changes.
  patch("EAzami", {
    status: "result",
    pulse: "分化は繰り返した。しかし、同じ粗い歴史環境が繰り返し原因だったとは言えない。",
    summary: "Azami Chapter 2 / evolutionary time。public data は capitulum traits の反復分化と不均等な evolutionary depth を強く支持する一方、tested BIOCLIM と global eustatic sea-level の recurring trigger は age・palaeolocation・background uncertainty gates を越えなかった。",
    ceiling: "適応・自然選択・独立起源・収斂・正確なtransition age・local land bridge・共通environmental triggerを確定しない。negative trigger resultをhistorical environmentの無関係へ変換しない。",
    next: "V6 JEB submission package と author metadata を閉じる。Chapter 3 own-data evidence はこのpublic-data paperのsubmission gateに要求しない。"
  });

  const odsp = patch("odsp", {
    status: "result",
    layers: ["chapter 2", "multidimensional niche geometry", "vertical", "temporal", "state prediction", "heldout transfer", "trust layer"],
    pulse: "厚みがあることと、その編成が外へ移ることは別の性質だ。",
    thoughtMove: "S(x,y,z,t,...) の added-axis thickness、identity-resolved organization、full ecological-state probability、held-out transferability を分けて測る。",
    thoughtKeeps: "Bat vertical thickness、Serengeti temporal partition、BOP_RODENT state prediction、continuous/circular/joint state density、conformal/novelty trust diagnostics。",
    thoughtRefuses: "thicknessをtransferabilityと同一視すること、camera timeをtrue activity timeへ昇格すること、平均改善でall-group generalizationを救済すること、N2 terminal receiptを自動的にN3 state artifactへ昇格すること。",
    summary: "Chapter 2 — HOW THICK is it? Batは約4.02 effective vertical statesだがheld-out個体へ組織が一般化せず、Serengetiは約5.15/6 temporal states・species-time partition p=0.005・3/3 held-out fold gain>0。BOP_RODENTは27/30個体でlog-score改善したが厳格判定はmixed。N2 empirical chainはscientifically closed。",
    ceiling: "完成済みendpointを再調整せず、positive temporal transferをcompetitionやtrue activity partitionへ、mixed predictionをgeneral promotionへ読み替えない。",
    next: "closed N2 resultをmanuscriptへ固定し、EOG/ACSPへは自動state promotionせず epistemic sequence の境界を保つ。"
  });

  // Ecosystem-wide view: 31 active scientific repositories.
  if (data.stories?.ecosystem) {
    const current = data.stories.ecosystem.nodes || [];
    const withoutBalance = current.filter((id) => id !== "balance");
    const schIndex = withoutBalance.indexOf("sch");
    if (schIndex >= 0) withoutBalance.splice(schIndex + 1, 0, "balance");
    else withoutBalance.push("balance");
    data.stories.ecosystem.nodes = unique(withoutBalance);
    data.stories.ecosystem.text = "31 active scientific repositories を一つの ecological research system に置く。各編は独立した所有単位のまま、variation・state・record・identification・next observation・field return を受け渡す。";
    data.stories.ecosystem.displayPath = "VARIATION ⇄ STATE ⇄ RECORD ⇄ IDENTIFY ⇄ DESIGN ⇄ FIELD ⇄ UPDATE";
  }

  if (sch) sch.systemRole = "variation/state · shared-coordinate conflict and compromise";
  if (balance) balance.systemRole = "state · middle-world architecture reserve / persistence";
  if (bita) bita.systemRole = "state/identification · differentiated architecture and mechanism allocation";
  if (odsp) odsp.systemRole = "state · multidimensional niche geometry and state prediction";

  [sch, balance, bita, odsp].filter(Boolean).forEach((item) => {
    if (!item.systemRole) return;
    item.layers = unique([...(item.layers || []), "ecosystem system", item.systemRole]);
  });

  (data.axes || []).forEach((axis) => {
    if (["パターン", "メカニズム", "方法", "理論"].includes(axis.name) && !axis.repos.includes("balance")) {
      axis.repos.push("balance");
    }
  });

  ["seven", "eight"].forEach((route) => {
    const books = data.books?.[route];
    if (!books) return;

    const schBook = books.find((book) => book.repos?.[0] === "sch");
    const bitaBook = books.find((book) => book.repos?.[0] === "bita");
    if (schBook) Object.assign(schBook, { title: "SCH — shared-coordinate compromise", series: "interaction", note: "Chapter 1 · conflict / compromise", status: "bounded" });
    if (bitaBook) Object.assign(bitaBook, { title: "BITA — differentiated-coordinate architecture", series: "interaction", note: "Chapter 3 · architecture gain / mechanism", status: "result" });

    let balanceBook = books.find((book) => book.repos?.[0] === "balance");
    if (!balanceBook) {
      balanceBook = { n: "B2", title: "BALANCE — middle world", chapters: 1, series: "interaction", repos: ["balance"], note: "Chapter 2 · conflict persists before differentiation pays", status: "bounded" };
      const schIndex = books.findIndex((book) => book.repos?.[0] === "sch");
      const bitaIndex = books.findIndex((book) => book.repos?.[0] === "bita");
      if (schIndex >= 0) books.splice(schIndex + 1, 0, balanceBook);
      else if (bitaIndex >= 0) books.splice(bitaIndex, 0, balanceBook);
      else books.push(balanceBook);
    }

    if (route === "seven") {
      const s = books.find((book) => book.repos?.[0] === "sch");
      const m = books.find((book) => book.repos?.[0] === "balance");
      const b = books.find((book) => book.repos?.[0] === "bita");
      if (s) s.n = "B1";
      if (m) m.n = "B2";
      if (b) b.n = "B3";
    } else {
      books.forEach((book, index) => { book.n = String(index + 1); });
    }

    const odspBook = books.find((book) => book.repos?.[0] === "odsp");
    if (odspBook) {
      odspBook.note = "N2 closed · thickness / transfer / state prediction remain distinct";
      odspBook.status = "result";
    }
  });

  data.graphMeta = {
    ...(data.graphMeta || {}),
    version: "2026-09-05-portfolio-latest-v1",
    portfolioRefresh: {
      activeScientificRepositories: 31,
      newRepository: "balance",
      interactionProgramme: "SCH → BALANCE → BITA",
      changedCanonicalStates: ["SCH open→bounded/main", "BITA Chapter 2→3", "ODSP open→result", "EAzami V6 conclusion refresh"],
      firewall: "repository motion != claim revision; shared substrate != shared conclusion; connection != ownership"
    }
  };

  window.ZUIZUI_THOUGHTS = window.ZUIZUI_THOUGHTS || {};
  ["sch", "balance", "bita", "EAzami", "odsp"].forEach((id) => {
    const current = node(id);
    if (!current) return;
    window.ZUIZUI_THOUGHTS[id] = {
      line: current.pulse || "",
      move: current.thoughtMove || current.summary || "",
      keeps: current.thoughtKeeps || current.summary || "",
      refuses: current.thoughtRefuses || current.ceiling || ""
    };
  });

  const axiom = document.querySelector('[data-axiom-series="interaction"] span');
  if (axiom) axiom.textContent = "葛藤 ≠ 即分化";

  const brainDesc = document.getElementById("brain-desc");
  if (brainDesc) {
    brainDesc.textContent = "31のactive scientific repositoriesを一つの生態系として配置し、SCH→BALANCE→BITAの三世界、状態・記録・同定・次観測・field returnの横断関係を型付きで示す研究地図。";
  }

  const auditLink = document.querySelector(".philosophy-audit");
  if (auditLink) {
    auditLink.textContent = "31 · static";
    auditLink.title = "31 active scientific repositories · 1 staging repository";
  }
})();
