(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  const ALL = [
    "hotarubukuro", "fcp", "chun",
    "azami", "EAzami", "aza3",
    "island", "izu-core", "shimahotarubukuro",
    "sch", "bita",
    "pollipi", "insepi", "rec", "tnoa",
    "sdmr", "odsp", "eog", "acsp",
    "boundary", "mrod",
    "eco-genetic-criticality", "eco-genetic-warning-extensions", "egwee",
    "ccoc", "mltr", "mrm", "crest", "ced", "theouni"
  ];

  const roles = {
    hotarubukuro: "variation · focal empirical origin",
    fcp: "variation · geographic-space trait state",
    chun: "variation · evolutionary-time trait state",
    azami: "variation · present phenotype",
    EAzami: "history · public-data narrowing",
    aza3: "field return · own-data discrimination",
    island: "context · macroecological island comparison",
    "izu-core": "state · interaction-response architecture",
    shimahotarubukuro: "variation · focal island phenotype",
    sch: "interaction · shared-cue problem",
    bita: "identification · specific mechanism set",
    pollipi: "record · physical ecological sensing",
    insepi: "record · observer-system diagnosis",
    rec: "record · pre-entry censoring",
    tnoa: "record · post-entry semantics",
    sdmr: "state · environmental-coordinate admission",
    odsp: "state · multidimensional niche geometry",
    eog: "world · realizability / reachability",
    acsp: "next observation · WHERE to look",
    boundary: "identification · what can be distinguished",
    mrod: "next observation · WHAT to measure",
    "eco-genetic-criticality": "state · mechanistic eco-genetic separation",
    "eco-genetic-warning-extensions": "state · future relevance / warning validity",
    egwee: "measurement · state/proxy admission",
    ccoc: "theory · future sufficiency",
    mltr: "theory · historical / semantic sufficiency",
    mrm: "theory · mechanism-retention sufficiency",
    crest: "theory · required-state synthesis",
    ced: "evidence · reportability licensing",
    theouni: "meta · programme admission / provenance grammar"
  };

  data.series.ecosystem = {
    label: "生態系",
    color: "#c9c8bf",
    lane: "VARIATION ⇄ STATE ⇄ RECORD ⇄ INFERENCE ⇄ NEXT OBSERVATION ⇄ FIELD RETURN"
  };

  data.stories.ecosystem = {
    label: "生態系",
    axiom: "接続 ≠ 所有",
    nodes: ALL.slice(),
    text: "すべてのリポを一つの ecological research system に置く。各編は独立した所有単位のまま、状態・記録・同定・次観測・現地回収を受け渡す。",
    displayPath: "VARIATION ⇄ STATE ⇄ RECORD ⇄ IDENTIFY ⇄ DESIGN ⇄ FIELD ⇄ UPDATE"
  };

  data.nodes.forEach((node) => {
    if (!roles[node.id]) return;
    node.systemRole = roles[node.id];
    node.layers = [...new Set([...(node.layers || []), "ecosystem system", roles[node.id]])];
  });

  const bridgePairs = new Set([
    "hotarubukuro|izu-core",
    "izu-core|egwee",
    "tnoa|egwee",
    "egwee|ced",
    "mrod|acsp"
  ]);

  data.edges = (data.edges || []).filter((edge) => !bridgePairs.has(`${edge.from}|${edge.to}`));
  data.edges.push(
    {
      from: "hotarubukuro",
      to: "izu-core",
      type: "bridge",
      relation: "shared_substrate",
      label: "Campanula punctata / Izu pollination system · shared empirical substrate"
    },
    {
      from: "izu-core",
      to: "egwee",
      type: "bridge",
      relation: "shared_substrate",
      label: "Hiraiwa-Ushimaru Honshu-Izu data · different frozen questions"
    },
    {
      from: "tnoa",
      to: "egwee",
      type: "bridge",
      relation: "epistemic",
      label: "entered-record semantics ⇢ state/proxy admission"
    },
    {
      from: "egwee",
      to: "ced",
      type: "bridge",
      relation: "epistemic",
      label: "measurement adequacy ⇢ evidence/reportability licensing"
    },
    {
      from: "mrod",
      to: "acsp",
      type: "bridge",
      relation: "complement",
      label: "WHAT to measure ↔ WHERE to look"
    }
  );

  data.graphMeta = {
    ...(data.graphMeta || {}),
    ecosystemSystem: {
      version: "research-ecosystem-system-v1",
      audit: "ecosystem-system-audit.json",
      surface: "VARIATION <-> STATE <-> RECORD <-> INFERENCE <-> NEXT OBSERVATION <-> FIELD RETURN",
      rule: "connection != ownership",
      cycle: [
        "variation",
        "state representation",
        "record semantics",
        "measurement admission",
        "identification/reportability",
        "next observation",
        "field return",
        "revision with provenance"
      ]
    }
  };

  const brainDesc = document.getElementById("brain-desc");
  if (brainDesc) {
    brainDesc.textContent = "30の科学リポジトリを一つの生態系システムとして配置し、変異・状態・記録・同定・次観測・現地回収が編をまたいで循環する研究地図。";
  }
})();
