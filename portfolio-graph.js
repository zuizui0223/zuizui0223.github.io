(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  data.graphMeta = {
    version: "2026-09-03-canonical-v1",
    audit: "portfolio-graph-audit.json",
    relationTypes: ["handoff", "epistemic", "abstraction", "provenance", "complement", "component", "information_flow"],
    rule: "connection is typed; connection never transfers evidence ownership"
  };

  data.series.azami = { ...data.series.azami, label: "アザミ", lane: "PRESENT → HISTORY → OWN DATA" };
  data.series.flower = { ...data.series.flower, label: "花色変異", lane: "SPACE ↔ EVOLUTIONARY TIME · FOCAL ORIGIN" };
  data.series.island = { ...data.series.island, label: "島", lane: "WHEN/WHERE → CONDITIONAL WHY → FOCAL PHENOTYPE" };
  data.series.observation = { ...data.series.observation, label: "観測", lane: "RECORD → PHYSICAL DIAGNOSIS · ENTRY → SEMANTICS" };
  data.series.interaction = { ...data.series.interaction, label: "相互作用", lane: "SHARED CUE → SECOND COORDINATE" };
  data.series.niche = { ...data.series.niche, label: "ニッチ→観測", lane: "REPRESENT ⇢ THICKEN ⇢ REALIZE ⇢ OBSERVE" };
  data.series.method = { ...data.series.method, label: "方法", lane: "IDENTIFICATION BOUNDARY ⇢ NEXT OBSERVATION" };
  data.series.theory = { ...data.series.theory, label: "理論", lane: "FUTURE / HISTORY / MECHANISM → STATE → EVIDENCE" };
  data.series.ecogenetic = { label: "生態遺伝", color: "#cf9f72", lane: "CRITICALITY → STATE / WARNING VALIDITY" };

  const node = (id) => data.nodes.find((item) => item.id === id);
  const patch = (id, values) => { const target = node(id); if (target) Object.assign(target, values); };

  patch("azami", { status: "bounded" });
  patch("EAzami", { status: "result" });
  patch("aza3", { status: "open" });
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
    summary: "V13 が現在の科学主線。frozen PolliPi/InsePi observers を物理カメラ系で placebo / event-restore / observability-restore / shared-restore に介入し、新しい recording days × physical scenes へ診断構造が移るかを blinded held-out で判定する。V14/V15 の target–nuisance/observability は別 side line で、TNOA の方法抽象化の provenance。",
    ceiling: "V13を自然訪花精度・species accuracy・occupancy validityへ昇格せず、V14/V15を現在のInsePi主線と混同しない。",
    next: "凍結済み V13 physical intervention experiment を実行し、A/B/C/D outcome を再調整せず受け取る。",
    layers: ["physical intervention", "observer diagnosis", "blinded heldout", "V13"]
  });
  patch("tnoa", { status: "result" });
  patch("rec", { status: "open" });
  patch("sch", { status: "open" });
  patch("bita", { status: "result" });
  patch("boundary", { status: "bounded" });
  patch("mrod", { status: "bounded" });
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

  data.nodes = data.nodes.filter((item) => item.id !== "microdonta");

  data.stories.azami = {
    label: "アザミ", axiom: "差 ≠ 平均",
    nodes: ["azami", "EAzami", "aza3"],
    text: "現在を見る → 公共データで歴史を絞る → 同一個体の自前証拠で残った歴史を分ける。"
  };
  data.stories.flower = {
    label: "花色変異", axiom: "同色 ≠ 同状態",
    nodes: ["fcp", "chun", "hotarubukuro"],
    text: "FCP は空間、Chun は進化時間の相補的な腕。hotarubukuro は一つの focal system / origin anchor であり第三章依存ではない。"
  };
  data.stories.island = {
    label: "島", axiom: "島 ≠ 一つの応答",
    nodes: ["island", "izu-core", "shimahotarubukuro"],
    text: "WHEN/WHERE の比較 → 成立後の conditional response WHY → 一系統内で実際に分化した phenotype axes。"
  };
  data.stories.observation = {
    label: "観測", axiom: "記録 ≠ 世界",
    nodes: ["pollipi", "insepi", "rec", "tnoa"],
    text: "PolliPi→InsePi は物理観測系の主線。TNOA は後段方法論抽象化。科学情報は REC→record→TNOA、研究開発史は TNOA→REC。"
  };
  data.stories.interaction = {
    label: "相互作用", axiom: "合図 ≠ 一方通行",
    nodes: ["sch", "bita"],
    text: "一つの共有 cue が利益と敵対コストを同時に動かす問題から、第二形質 D が escape / allocation をどう変えるかへ。"
  };
  data.stories.niche = {
    label: "ニッチ→観測", axiom: "niche ≠ 地図",
    nodes: ["sdmr", "odsp", "eog", "acsp"],
    text: "何を representation に残す？ ⇢ 平面化で何が隠れる？ ⇢ どこまで実現可能？ ⇢ どこを見る？　これは epistemic sequence でありデータ依存pipelineではない。"
  };
  data.stories.method = {
    label: "方法", axiom: "精密 ≠ 同定",
    nodes: ["bita", "boundary", "mrod"],
    text: "具体的 identified set → 一般的 identification boundary ⇢ 残る機構集合を最も分ける次観測。"
  };
  data.stories.theory = {
    label: "理論", axiom: "状態 = 安全な忘却",
    nodes: ["ccoc", "mltr", "mrm", "crest", "ced", "theouni"],
    text: "CCOC / MLTR / MRM は future / history / mechanism の並列 companion。CREST が必要状態を統合し、CED が evidence licensing を問う。theouni は外側の meta-theory / admission / registry。"
  };
  data.stories.ecogenetic = {
    label: "生態遺伝", axiom: "先行 ≠ 予測",
    nodes: ["eco-genetic-criticality", "eco-genetic-warning-extensions"],
    text: "有限mechanistic parent → loss-generating state / warning validity / natural state-sufficiency extension。理論companion列ではなく独立したモデル・実証系列。"
  };

  data.edges = [
    { from: "azami", to: "EAzami", type: "handoff", label: "present phenotype → evolutionary history" },
    { from: "EAzami", to: "aza3", type: "handoff", label: "compatible histories → own-data discrimination" },

    { from: "island", to: "izu-core", type: "handoff", label: "WHEN/WHERE → conditional response WHY" },
    { from: "izu-core", to: "shimahotarubukuro", type: "handoff", label: "response geometry → focal phenotype axes" },

    { from: "sch", to: "bita", type: "handoff", label: "shared cue → second-coordinate escape" },
    { from: "eco-genetic-criticality", to: "eco-genetic-warning-extensions", type: "handoff", label: "mechanistic parent → state/warning extension" },

    { from: "sdmr", to: "odsp", type: "epistemic", label: "representation ⇢ added axes" },
    { from: "odsp", to: "eog", type: "epistemic", label: "geometry ⇢ realizability" },
    { from: "eog", to: "acsp", type: "epistemic", label: "worlds ⇢ survey candidates" },

    { from: "fcp", to: "chun", type: "complement", label: "space ↔ evolutionary time" },
    { from: "hotarubukuro", to: "fcp", type: "provenance", label: "focal origin → spatial arm" },
    { from: "hotarubukuro", to: "chun", type: "provenance", label: "focal origin → temporal arm" },

    { from: "pollipi", to: "insepi", type: "handoff", label: "primary record → physical observer diagnosis" },
    { from: "insepi", to: "tnoa", type: "provenance", label: "later sensing side-line → methods abstraction", curveOffset: -13 },
    { from: "rec", to: "tnoa", type: "information_flow", label: "record entry → post-entry semantics", curveOffset: 12 },
    { from: "tnoa", to: "rec", type: "provenance", label: "Paper 1 → upstream Paper 2", curveOffset: -12 },

    { from: "bita", to: "boundary", type: "abstraction", label: "specific identified set → general identification boundary" },
    { from: "boundary", to: "mrod", type: "epistemic", label: "identification boundary ⇢ observation design" },

    { from: "ccoc", to: "crest", type: "component", label: "future obligation → required state" },
    { from: "mltr", to: "crest", type: "component", label: "history obligation → required state" },
    { from: "mrm", to: "crest", type: "component", label: "mechanism obligation → required state" },
    { from: "crest", to: "ced", type: "handoff", label: "required distinctions → evidence licensing" }
  ];

  (data.books?.seven || []).forEach((book) => {
    const id = book.repos?.[0];
    if (["eco-genetic-criticality", "eco-genetic-warning-extensions"].includes(id)) book.series = "ecogenetic";
  });
  (data.books?.eight || []).forEach((book) => {
    const id = book.repos?.[0];
    if (["eco-genetic-criticality", "eco-genetic-warning-extensions"].includes(id)) book.series = "ecogenetic";
  });

  (data.axes || []).forEach((axis) => {
    axis.repos = [...new Set((axis.repos || []).filter((id) => id !== "microdonta"))];
  });

  window.ZUIZUI_GRAPH = data.graphMeta;
})();
