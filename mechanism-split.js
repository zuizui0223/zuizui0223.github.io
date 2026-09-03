(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  const upsert = (id, patch) => {
    let target = data.nodes.find((node) => node.id === id);
    if (!target) {
      target = { id, x: .5, y: .5, layers: [] };
      data.nodes.push(target);
    }
    Object.assign(target, patch);
    return target;
  };

  data.nodes = data.nodes.filter((node) => node.id !== "microdonta");

  data.series.azami = { ...data.series.azami, label: "アザミ", lane: "PRESENT → HISTORY → OWN DATA" };
  data.series.flower = { ...data.series.flower, label: "花色変異", lane: "SPACE ↔ EVOLUTIONARY TIME · FOCAL ORIGIN" };
  data.series.island = { ...data.series.island, label: "島", lane: "WHEN/WHERE → CONDITIONAL WHY → FOCAL PHENOTYPE" };
  data.series.observation = { ...data.series.observation, label: "観測", lane: "RECORD → PHYSICAL DIAGNOSIS · ENTRY → SEMANTICS" };
  data.series.interaction = { ...(data.series.interaction || {}), label: "相互作用", color: data.series.interaction?.color || "#d08b70", lane: "SHARED CUE → SECOND COORDINATE" };
  data.series.niche = { ...(data.series.niche || {}), label: "ニッチ→観測", color: data.series.niche?.color || "#b9c977", lane: "REPRESENT ⇢ THICKEN ⇢ REALIZE ⇢ OBSERVE" };
  data.series.method = { ...data.series.method, label: "方法", lane: "IDENTIFICATION BOUNDARY ⇢ NEXT OBSERVATION" };
  data.series.theory = { ...data.series.theory, label: "理論", lane: "FUTURE / HISTORY / MECHANISM → STATE → EVIDENCE" };
  data.series.ecogenetic = { label: "生態遺伝", color: "#cf9f72", lane: "CRITICALITY → STATE / WARNING VALIDITY" };

  upsert("boundary", {
    series: "theory", x: .30, y: .70, status: "bounded",
    layers: ["identification boundary", "mechanistic evidence", "partial identification", "calibration"],
    pulse: "機構に近い証拠ほど、機構を一つにするとは限らない。",
    thoughtMove: "mechanistic proximity と identification strength を別軸に置き、現在の observation map が原理的に識別できる機構差だけを残す。",
    thoughtKeeps: "net-only equivalence、residual dimension、calibration transport、breakdown factor、channel/calibration anchors。",
    thoughtRefuses: "機構に近い測定を自動的に強い機構同定とみなすこと。",
    summary: "BITAの具体的identified-set問題から抽象化された一般的同定境界。point / partial / non-identification と calibration transport を分ける。",
    ceiling: "同定可能性の境界を、自然界で特定機構が真である証拠へ読み替えない。",
    next: "残る機構集合を一点化せず、必要なanchorとjoint-set reportingを明示する。"
  });

  upsert("mrod", {
    series: "method", x: .43, y: .70, status: "bounded",
    layers: ["admissible region", "mechanism ambiguity", "observation information", "sequential design"],
    pulse: "見えない原因を当てず、残る原因を分ける観測を選ぶ。",
    thoughtMove: "観測と制約に両立する admissible mechanism region を集合として残し、その集合を最も分ける次観測を選ぶ。",
    thoughtKeeps: "A_epsilon、mechanism entropy/resolvability、V(Q)=I(S;Q|A_epsilon)/K、sequential stopping。",
    thoughtRefuses: "modal mechanismをtrue causeとみなすこと、選択前にhidden truthを見ること。",
    summary: "Mechanism-Resolving Observation Design。identification boundaryの後に残る機構曖昧さへ、情報価値で次観測を選ぶ。",
    ceiling: "controlled benchmarkの成功を自然系のcausal truthや全design法への普遍的優越へ移送しない。",
    next: "独立natural-system bridgeでset-preserving observation designを検証する。"
  });

  upsert("rec", {
    label: "REC", series: "observation", x: .69, y: .84, status: "open",
    layers: ["record entry", "exposure universe", "censoring", "shadow set", "field validation"],
    pulse: "記録されなかったことは、起きなかったことではない。",
    thoughtMove: "gate-independent exposure universe Ω を先に定義し、acquisition・gate・archive entry のどこで exposure/event が usable record にならなかったかを分離する。",
    thoughtKeeps: "master exposure ledger、pre-gate evidence、record-entry state、independent shadow truth、upstream lossとdownstream coarseningの分解。",
    thoughtRefuses: "event log自体をdenominatorにすること、no recordをno eventとみなすこと。",
    summary: "TNOAのupstream counterpart。recordに入る前の exposure / gate / archive selection と ecological consequence を独立reference designで問う。",
    ceiling: "design/exploration段階をfield-validated claimに昇格せず、TNOA Paper 1をretroactiveに変更しない。",
    next: "prospective field systemでrecord-entry lossとTNOA semantic coarseningを同じheld-out evidence上で分解する。"
  });

  upsert("aza3", {
    series: "azami", x: .43, y: .31, status: "open",
    layers: ["chapter 3", "own data", "ancestry", "phenotype", "cytotype", "history discrimination"],
    pulse: "残った歴史は、同じ個体に結びついた証拠で分ける。",
    thoughtMove: "EAzamiが公共データの同定限界で残した competing histories を same-individual ancestry・phenotype・cytotype と別途認可された function / fitness evidence で判別する。",
    thoughtKeeps: "immutable individual identity、voucher/image、same-library RAD-seq sensitivity、phenotype、cytotype、authorization provenance。",
    thoughtRefuses: "将来自前データを公共データChapter 2のretroactive confirmationと呼ぶこと。",
    summary: "Azami Chapter 3。公共データで残った進化史候補を、自前の同一個体証拠で判別する。",
    ceiling: "own biological dataがない段階でspecies tree・causal history・fitness結論を確定しない。",
    next: "sampling prioritiesに沿ってsame-individual ancestry×phenotype×cytotype dataを取得する。"
  });

  const patch = (id, values) => { const target = data.nodes.find((node) => node.id === id); if (target) Object.assign(target, values); };
  patch("azami", { status: "bounded" });
  patch("EAzami", { status: "result" });
  patch("fcp", { status: "bounded" });
  patch("chun", { status: "result" });
  patch("hotarubukuro", { status: "result" });
  patch("island", { status: "result" });
  patch("izu-core", { status: "result" });
  patch("shimahotarubukuro", { status: "result" });
  patch("pollipi", { status: "bounded" });
  patch("insepi", {
    status: "open",
    pulse: "観測者の失敗を、介入で分ける。",
    summary: "V13が現在の科学主線。frozen PolliPi/InsePi observersを物理カメラ系で介入し、新しい recording days × physical scenes へ診断構造が移るかを blinded held-out で判定する。V14/V15は別side lineで、TNOAの方法抽象化のprovenance。",
    ceiling: "V13を自然訪花精度・species accuracy・occupancy validityへ昇格せず、V14/V15を現在主線と混同しない。",
    next: "凍結済みV13 physical intervention experimentを実行し、A/B/C/D outcomeを再調整せず受け取る。",
    layers: ["physical intervention", "observer diagnosis", "blinded heldout", "V13"]
  });
  patch("tnoa", { status: "result" });
  patch("sch", { status: "open" });
  patch("bita", { status: "result" });
  patch("sdmr", { status: "result" });
  patch("odsp", { status: "open" });
  patch("eog", { status: "open" });
  patch("acsp", { status: "result" });
  patch("crest", { status: "result" });
  patch("ccoc", { status: "result" });
  patch("mltr", { status: "result" });
  patch("mrm", { status: "result" });
  patch("ced", { status: "result" });
  patch("eco-genetic-criticality", { series: "ecogenetic", status: "result" });
  patch("eco-genetic-warning-extensions", { series: "ecogenetic", status: "result" });
  patch("theouni", { status: "bounded" });

  data.stories.azami = { label: "アザミ", axiom: "差 ≠ 平均", nodes: ["azami", "EAzami", "aza3"], text: "現在を見る → 歴史を絞る → 自分の個体で分ける。" };
  data.stories.flower = { label: "花色変異", axiom: "同色 ≠ 同状態", nodes: ["fcp", "chun", "hotarubukuro"], text: "FCPは空間、Chunは進化時間の相補的な腕。hotarubukuroはfocal/origin anchorであり第三章依存ではない。" };
  data.stories.island = { label: "島", axiom: "島 ≠ 一つの応答", nodes: ["island", "izu-core", "shimahotarubukuro"], text: "WHEN/WHERE → conditional response WHY → focal phenotype axes。" };
  data.stories.observation = { label: "観測", axiom: "記録 ≠ 世界", nodes: ["pollipi", "insepi", "tnoa", "rec"], text: "PolliPi→InsePiは物理主線。InsePi→TNOAは方法抽象化provenance。研究系譜はTNOA→REC、科学情報はREC→record→TNOA。" };
  data.stories.interaction = { label: "相互作用", axiom: "合図 ≠ 一方通行", nodes: ["sch", "bita"], text: "shared cue → second-coordinate escape / allocation。" };
  data.stories.niche = { label: "ニッチ→観測", axiom: "niche ≠ 地図", nodes: ["sdmr", "odsp", "eog", "acsp"], text: "REPRESENT ⇢ THICKEN ⇢ REALIZE ⇢ OBSERVE。epistemic sequenceでありsoftware/data dependencyではない。" };
  data.stories.method = { label: "方法", axiom: "精密 ≠ 同定", nodes: ["bita", "boundary", "mrod"], text: "specific identified set → general boundary ⇢ next observation。" };
  data.stories.theory = { label: "理論", axiom: "状態 = 安全な忘却", nodes: ["ccoc", "mltr", "mrm", "crest", "ced", "theouni"], text: "CCOC / MLTR / MRM は並列companion。CRESTがrequired stateを統合し、CEDがevidence licensingを問う。theouniはmeta-layer。" };
  data.stories.ecogenetic = { label: "生態遺伝", axiom: "先行 ≠ 予測", nodes: ["eco-genetic-criticality", "eco-genetic-warning-extensions"], text: "mechanistic parent → state / warning / natural-data extension。" };

  data.edges = [
    { from: "azami", to: "EAzami", type: "solid", relation: "handoff", label: "present phenotype → evolutionary history" },
    { from: "EAzami", to: "aza3", type: "solid", relation: "handoff", label: "compatible histories → own-data discrimination" },
    { from: "island", to: "izu-core", type: "solid", relation: "handoff", label: "WHEN/WHERE → conditional response WHY" },
    { from: "izu-core", to: "shimahotarubukuro", type: "solid", relation: "handoff", label: "response geometry → focal phenotype axes" },
    { from: "sch", to: "bita", type: "solid", relation: "handoff", label: "shared cue → second-coordinate escape" },
    { from: "eco-genetic-criticality", to: "eco-genetic-warning-extensions", type: "solid", relation: "handoff", label: "mechanistic parent → state/warning extension" },

    { from: "sdmr", to: "odsp", type: "bridge", relation: "epistemic", label: "representation ⇢ added axes" },
    { from: "odsp", to: "eog", type: "bridge", relation: "epistemic", label: "geometry ⇢ realizability" },
    { from: "eog", to: "acsp", type: "bridge", relation: "epistemic", label: "worlds ⇢ survey candidates" },

    { from: "fcp", to: "chun", type: "bridge", relation: "complement", label: "space ↔ evolutionary time" },
    { from: "hotarubukuro", to: "fcp", type: "bridge", relation: "provenance", label: "focal origin → spatial arm" },
    { from: "hotarubukuro", to: "chun", type: "bridge", relation: "provenance", label: "focal origin → temporal arm" },

    { from: "pollipi", to: "insepi", type: "solid", relation: "handoff", label: "primary record → physical observer diagnosis" },
    { from: "insepi", to: "tnoa", type: "bridge", relation: "provenance", label: "later sensing side-line → methods abstraction" },
    { from: "rec", to: "tnoa", type: "solid", relation: "information_flow", label: "record entry → post-entry semantics" },

    { from: "bita", to: "boundary", type: "bridge", relation: "abstraction", label: "specific identified set → general identification boundary" },
    { from: "boundary", to: "mrod", type: "bridge", relation: "epistemic", label: "identification boundary ⇢ observation design" },

    { from: "ccoc", to: "crest", type: "bridge", relation: "component", label: "future obligation → required state" },
    { from: "mltr", to: "crest", type: "bridge", relation: "component", label: "history obligation → required state" },
    { from: "mrm", to: "crest", type: "bridge", relation: "component", label: "mechanism obligation → required state" },
    { from: "crest", to: "ced", type: "solid", relation: "handoff", label: "required distinctions → evidence licensing" }
  ];

  data.graphMeta = {
    version: "2026-09-03-canonical-v1",
    audit: "portfolio-graph-audit.json",
    relationTypes: ["handoff", "epistemic", "abstraction", "provenance", "complement", "component", "information_flow"],
    rule: "connection is typed; connection never transfers evidence ownership"
  };

  (data.axes || []).forEach((axis) => {
    axis.repos = [...new Set((axis.repos || []).filter((id) => id !== "microdonta"))];
    const add = (...ids) => ids.forEach((id) => { if (!axis.repos.includes(id)) axis.repos.push(id); });
    if (axis.name === "メカニズム") add("boundary", "mrod", "aza3");
    if (axis.name === "方法") add("mrod", "rec");
    if (axis.name === "理論") add("boundary");
    if (axis.name === "観測") add("rec");
    if (axis.name === "現実") add("rec", "aza3");
    if (axis.name === "時間") add("aza3", "odsp");
  });

  const ensureBook = (route, id, series, title, note) => {
    const books = data.books?.[route];
    if (!books) return;
    const existing = books.find((book) => book.repos?.[0] === id);
    if (existing) {
      existing.series = series;
      existing.title = title;
      existing.note = note;
      return;
    }
    books.push({ n: route === "seven" ? "·" : String(books.length + 1), title, chapters: 1, series, repos: [id], note, status: "1 repo = 1 scientific fragment" });
  };

  ["seven", "eight"].forEach((route) => {
    if (!data.books?.[route]) return;
    data.books[route] = data.books[route].filter((book) => book.repos?.[0] !== "microdonta");
    ensureBook(route, "boundary", "theory", "boundary — identification boundary", "specific evidence proximity ≠ identification strength");
    ensureBook(route, "mrod", "method", "mrod — next observation", "admissible region → discriminating observation");
    ensureBook(route, "rec", "observation", "REC — record-entry censoring", "pre-entry selection; TNOA is post-entry semantics");
    ensureBook(route, "aza3", "azami", "aza3 — own-data discrimination", "EAzami ceiling → same-individual evidence");
    const ecg = data.books[route].find((book) => book.repos?.[0] === "eco-genetic-criticality");
    const egw = data.books[route].find((book) => book.repos?.[0] === "eco-genetic-warning-extensions");
    if (ecg) ecg.series = "ecogenetic";
    if (egw) egw.series = "ecogenetic";
    if (route === "eight") data.books[route].forEach((book, index) => { book.n = String(index + 1); });
  });

  window.ZUIZUI_THOUGHTS = window.ZUIZUI_THOUGHTS || {};
  delete window.ZUIZUI_THOUGHTS.microdonta;
  ["boundary", "mrod", "rec", "aza3", "insepi"].forEach((id) => {
    const n = data.nodes.find((node) => node.id === id);
    if (!n) return;
    window.ZUIZUI_THOUGHTS[id] = { line: n.pulse || "", move: n.thoughtMove || n.summary || "", keeps: n.thoughtKeeps || "", refuses: n.thoughtRefuses || n.ceiling || "" };
  });

  window.ZUIZUI_GRAPH = data.graphMeta;
})();
