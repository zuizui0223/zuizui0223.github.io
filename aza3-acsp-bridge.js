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

  data.series.azami = {
    ...data.series.azami,
    lane: "PRESENT → HISTORY → OWN DATA ⇄ SEARCH"
  };
  data.series.niche = {
    ...data.series.niche,
    lane: "REPRESENT ⇢ THICKEN ⇢ REALIZE ⇢ OBSERVE ⇄ OWN DATA"
  };

  const aza3 = node("aza3");
  if (aza3) {
    patch("aza3", {
      layers: unique([...(aza3.layers || []), "sampling slot", "ACSP bridge", "field verification", "private exact site"]),
      summary: "Azami Chapter 3。EAzamiが公共データの同定限界で残した competing histories を、自前の同一個体証拠で判別する。必要な biological sampling slot は aza3 が先に固定し、ACSP はその slot を bounded candidate patch へ翻訳する。",
      ceiling: "own biological dataがない段階でspecies tree・causal history・fitness結論を確定しない。ACSP candidate patchをoccupancyやexact sampling siteとみなさない。",
      next: "13 frozen sampling slots → pinned ACSP candidate patches → field verification → private exact-site freeze → same-individual ancestry×phenotype×cytotype intake。"
    });
  }

  const acsp = node("acsp");
  if (acsp) {
    patch("acsp", {
      layers: unique([...(acsp.layers || []), "prospective field bridge", "aza3 sampling slot"]),
      thoughtMove: "support envelope を bounded candidate patches へ変換し、別の生物学的programmeが事前定義した sampling need に対して『どこを探すか』だけを返す。aza3ではtaxon/contrast/slotをaza3が固定した後にACSPを使う。",
      thoughtKeeps: "validated Japanese robust-support patches、held-out enrichment、failed country generalization、predeclared structural selector、candidate-patch handoff。",
      thoughtRefuses: "candidate patch を occupancy probability・exact occupied site・route optimum・global product と呼ぶこと。taxon、biological priority、collection authorizationをACSPが決めること。",
      summary: "Chapter 4 — WHERE can we justify looking next? 日本版の bounded candidate-patch method を閉じた上で、aza3が事前定義した biological sampling slot を prospective search patch へ翻訳する operational bridge を持つ。",
      ceiling: "candidate patch ≠ occupancy ≠ exact site。何を採るかはaza3、どこを探すかはACSP、現地確認とexact-site/collection decisionは再びaza3側が所有する。",
      next: "aza3 sampling slot → pinned ACSP selector → candidate patch → field verification → private exact-site freeze → aza3 individual intake。"
    });
  }

  if (data.stories?.azami) {
    data.stories.azami.nodes = unique(["azami", "EAzami", "aza3", "acsp"]);
    data.stories.azami.text = "現在を見る → 歴史を絞る → 何を採る？ ⇄ どこを探す？";
    data.stories.azami.displayPath = "azami → EAzami → aza3 ⇄ ACSP";
  }

  if (data.stories?.niche) {
    data.stories.niche.nodes = unique(["sdmr", "odsp", "eog", "acsp", "aza3"]);
    data.stories.niche.text = "何を残す？ → 何が隠れる？ → どこまで届く？ → どこを見る？ ⇄ 何を分ける？";
    data.stories.niche.displayPath = "SDMR ⇢ ODSP ⇢ EOG ⇢ ACSP ⇄ aza3";
  }

  data.edges = (data.edges || []).filter((edge) => !(
    (edge.from === "aza3" && edge.to === "acsp") ||
    (edge.from === "acsp" && edge.to === "aza3")
  ));
  data.edges.push(
    {
      from: "aza3",
      to: "acsp",
      type: "bridge",
      relation: "information_flow",
      label: "declared biological sampling slot → bounded search patch"
    },
    {
      from: "acsp",
      to: "aza3",
      type: "bridge",
      relation: "information_flow",
      label: "candidate patch → field verification / private exact site"
    }
  );

  data.graphMeta = {
    ...(data.graphMeta || {}),
    version: "2026-09-04-aza3-acsp-bridge-v1",
    bridgeAudit: "aza3-acsp-field-bridge-audit.json",
    operationalBridge: {
      id: "aza3-acsp",
      surface: "WHAT to sample ⇄ WHERE to look",
      request: "aza3 biological sampling slot → ACSP",
      return: "ACSP candidate patch → aza3 field verification / private exact site",
      firewall: "biological priority != search geography; candidate patch != occupancy != exact site"
    }
  };

  window.ZUIZUI_THOUGHTS = window.ZUIZUI_THOUGHTS || {};
  ["aza3", "acsp"].forEach((id) => {
    const current = node(id);
    if (!current) return;
    window.ZUIZUI_THOUGHTS[id] = {
      line: current.pulse || "",
      move: current.thoughtMove || current.summary || "",
      keeps: current.thoughtKeeps || "",
      refuses: current.thoughtRefuses || current.ceiling || ""
    };
  });

  const portals = document.querySelector(".portals");
  if (portals && !portals.querySelector('[data-cross-bridge="aza3-acsp"]')) {
    portals.insertAdjacentHTML(
      "beforeend",
      `<g class="portal portal-niche" data-cross-bridge="aza3-acsp" aria-hidden="true" style="pointer-events:none;opacity:.46"><title>aza3 ⇄ ACSP · sampling slot ⇄ search patch</title><path class="portal-line" d="M179 145C154 202 122 278 97 338" /><text x="127" y="246" style="font-size:12px;opacity:.65">⇄</text></g>`
    );
  }

  const brainDesc = document.getElementById("brain-desc");
  if (brainDesc) {
    brainDesc.textContent = "研究系列と横断系列が中心の空洞へ流れ、aza3のsampling needとACSPのsurvey searchが往復する抽象図。";
  }
})();
