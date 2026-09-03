(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  const OLD = "microdonta";

  const boundary = {
    id: "boundary",
    series: "theory",
    x: .30,
    y: .70,
    status: "bounded",
    layers: ["identification boundary", "mechanistic evidence", "partial identification", "calibration"],
    pulse: "機構に近い証拠ほど、機構を一つにするとは限らない。",
    thoughtMove: "biological/mechanistic proximity と identification strength を別軸に置き、現在の observation map が原理的に識別できる機構差だけを残す。",
    thoughtKeeps: "net-only equivalence、k-channel residual dimension、calibration-transport family、breakdown factor、channel/calibration anchor。",
    thoughtRefuses: "機構に近い測定を自動的に強い機構同定とみなすこと、unbounded calibration transport を point estimate で埋めること。",
    summary: "旧 microdonta の Paper A を独立化した同定境界の理論。機構への生物学的近さと識別力を分離し、point / partial / non-identification、calibration transport、breakdown factor と anchor design を扱う。",
    ceiling: "同定可能性の理論境界を自然界で特定機構が真である証拠へ読み替えない。",
    next: "識別不能な残差を一点化せず、必要な channel anchor・calibration anchor・joint-set reporting を明示する。"
  };

  const mrod = {
    id: "mrod",
    series: "method",
    x: .43,
    y: .70,
    status: "bounded",
    layers: ["admissible region", "mechanism ambiguity", "observation information", "sequential design"],
    pulse: "見えない原因を当てず、残る原因を分ける観測を選ぶ。",
    thoughtMove: "機構・パラメータ・生態制約・観測役割を先に宣言し、観測と両立する admissible mechanism region を集合として残して、その集合を最も分ける次観測を選ぶ。",
    thoughtKeeps: "A_epsilon、mechanism entropy/resolvability、equivalence/replaceability、V(Q)=I(S;Q|A_epsilon)/K、sequential stopping rule。",
    thoughtRefuses: "modal mechanism を true cause とみなすこと、hidden truth を選択前に覗くこと、予測できない candidate に外部 prior を代入して validated information value と呼ぶこと。",
    summary: "旧 microdonta の Methods paper を独立化した Mechanism-Resolving Observation Design。勝者を選ぶのでなく admissible mechanism region を保ち、検証可能な candidate observation の情報価値を逐次再計算して次の測定を選ぶ。",
    ceiling: "frozen controlled benchmark の成功を自然系の causal truth や全 observation-design 法への普遍的優越へ移送しない。",
    next: "宣言済み observation map と evidence-role discipline を保った独立 natural-system bridge で、set-preserving observation design を検証する。"
  };

  data.nodes = data.nodes.filter((node) => node.id !== OLD && node.id !== "boundary" && node.id !== "mrod");
  data.nodes.push(boundary, mrod);

  data.edges = data.edges.filter((edge) => edge.from !== OLD && edge.to !== OLD && !(edge.from === "boundary" && edge.to === "mrod"));
  data.edges.push(
    { from: "bita", to: "boundary", type: "bridge", label: "specific identified set → general identification boundary" },
    { from: "boundary", to: "mrod", type: "solid", label: "identification boundary → observation design" },
    { from: "mrod", to: "ced", type: "bridge", label: "mechanism information ↔ report license" }
  );

  if (data.stories?.method) {
    const retained = (data.stories.method.nodes || []).filter((id) => id !== OLD && id !== "mrod");
    data.stories.method.nodes = ["mrod", ...retained];
    data.stories.method.text = "残る機構を一点化せず、どの次観測が曖昧さを最も減らすかを選ぶ。";
  }

  if (data.stories?.theory) {
    const retained = (data.stories.theory.nodes || []).filter((id) => id !== OLD && id !== "boundary");
    const cedIndex = retained.indexOf("ced");
    if (cedIndex >= 0) retained.splice(cedIndex, 0, "boundary");
    else retained.push("boundary");
    data.stories.theory.nodes = retained;
  }

  (data.axes || []).forEach((axis) => {
    axis.repos = (axis.repos || []).filter((id) => id !== OLD && id !== "boundary" && id !== "mrod");
    if (axis.name === "方法") axis.repos.push("mrod");
    if (axis.name === "理論") axis.repos.push("boundary");
    if (axis.name === "メカニズム") axis.repos.push("boundary", "mrod");
  });

  const patchBooks = (route) => {
    const books = data.books?.[route];
    if (!books) return;
    let insertAt = books.findIndex((book) => book.repos?.[0] === OLD);
    if (insertAt < 0) insertAt = books.findIndex((book) => book.repos?.[0] === "ced");
    if (insertAt < 0) insertAt = books.length;

    const retained = books.filter((book) => ![OLD, "boundary", "mrod"].includes(book.repos?.[0]));
    insertAt = Math.min(insertAt, retained.length);
    retained.splice(insertAt, 0,
      {
        n: route === "seven" ? "T?" : "",
        title: `boundary — ${boundary.pulse}`,
        chapters: 1,
        series: "theory",
        repos: ["boundary"],
        note: "mechanistic proximity ≠ identification strength",
        status: "1 repo = 1 chapter"
      },
      {
        n: route === "seven" ? "M1" : "",
        title: `mrod — ${mrod.pulse}`,
        chapters: 1,
        series: "method",
        repos: ["mrod"],
        note: "admissible region → next observation",
        status: "1 repo = 1 chapter"
      }
    );
    if (route === "eight") retained.forEach((book, index) => { book.n = String(index + 1); });
    data.books[route] = retained;
  };

  patchBooks("seven");
  patchBooks("eight");

  window.ZUIZUI_THOUGHTS = window.ZUIZUI_THOUGHTS || {};
  delete window.ZUIZUI_THOUGHTS[OLD];
  window.ZUIZUI_THOUGHTS.boundary = {
    line: boundary.pulse,
    move: boundary.thoughtMove,
    keeps: boundary.thoughtKeeps,
    refuses: boundary.thoughtRefuses
  };
  window.ZUIZUI_THOUGHTS.mrod = {
    line: mrod.pulse,
    move: mrod.thoughtMove,
    keeps: mrod.thoughtKeeps,
    refuses: mrod.thoughtRefuses
  };

  // TNOA / REC: development lineage and scientific information flow point in opposite directions.
  const tnoa = data.nodes.find((node) => node.id === "tnoa");
  const rec = {
    id: "rec",
    label: "REC",
    series: "observation",
    x: .69,
    y: .84,
    status: "open",
    layers: ["record entry", "exposure universe", "censoring", "shadow set", "field validation"],
    pulse: "記録されなかったことは、起きなかったことではない。",
    thoughtMove: "非検出を定義する前に gate-independent exposure universe Ω を定義し、acquisition・gate・archive entry のどこで exposure/event が usable record にならなかったかを分離する。",
    thoughtKeeps: "master exposure ledger、pre-gate evidence、record-entry state K、reference-observable shadow set、reference-unresolved set、upstream loss と downstream coarsening の分解。",
    thoughtRefuses: "event log 自体を denominator にすること、no record を no event / biological baseline とみなすこと、独立 reference なしに shadow composition を同定すること。",
    summary: "TNOA の upstream counterpart である active Paper 2。TNOA が entered record の意味を扱うのに対し、REC は Ω→acquisition→gate→entry の選択を監査し、何が record に入らなかったかと、その ecological consequence を独立 reference design で問う。",
    ceiling: "tested record に見えない世界を fundamentally unknowable world と呼ばず、design/exploration 段階を field-validated claim に昇格しない。REC の開発で TNOA Paper-1 frozen results を変更しない。",
    next: "gate-independent exposure denominator と probability-sampled independent truth を持つ prospective field system で H1–H6 を凍結し、record-entry loss と TNOA semantic coarsening を同じ held-out evidence 上で分解する。"
  };

  data.nodes = data.nodes.filter((node) => node.id !== "rec");
  data.nodes.push(rec);

  if (tnoa) {
    tnoa.status = "result";
    tnoa.recordBoundary = "post-entry semantics";
    tnoa.recRelation = "REC owns upstream record-entry selection; TNOA owns post-entry semantics";
    tnoa.summary = "記録に入った後の process-preserving observation interface。B/T/N/U と T/C/N/O/A− を分離し、低 target support・nuisance・observability を biological absence へ潰さない。closed-world MEE Paper 1 は科学的に閉じ、forward field validation / record-entry generalization は REC が別所有する。";
    tnoa.next = "Paper 1 は frozen のまま提出へ。field では REC が upstream record-entry loss を監査し、必要な場合だけ downstream TNOA coarsening と二段階分解する。";
  }

  if (data.series?.observation) {
    data.series.observation.lane = "RECORD → EVIDENCE → SEMANTICS → RECORD-ENTRY SHADOW";
  }

  if (data.stories?.observation) {
    const lineage = ["pollipi", "insepi", "tnoa", "rec"];
    data.stories.observation.nodes = lineage.filter((id) => data.nodes.some((node) => node.id === id));
    data.stories.observation.axiom = "記録 ≠ 世界";
    data.stories.observation.text = "研究系譜は TNOA → REC。科学的な情報生成は Ω → REC → entered record → TNOA。前者は Paper 1 から Paper 2 への発展、後者は pre-entry selection から post-entry semantics への流れ。";
    data.stories.observation.displayPath = "pollipi → insepi → TNOA → REC  ／  Ω → REC → record → TNOA";
  }

  data.edges = data.edges.filter((edge) => !(edge.from === "rec" || edge.to === "rec"));
  data.edges.push(
    { from: "pollipi", to: "rec", type: "bridge", label: "primary record contract → exposure / entry audit" },
    { from: "rec", to: "tnoa", type: "solid", label: "record-entry selection → post-entry semantics" }
  );

  (data.axes || []).forEach((axis) => {
    axis.repos = (axis.repos || []).filter((id) => id !== "rec");
    if (["観測", "現実", "方法"].includes(axis.name)) axis.repos.push("rec");
  });

  const patchRecBook = (route) => {
    const books = data.books?.[route];
    if (!books) return;
    const retained = books.filter((book) => book.repos?.[0] !== "rec");
    let insertAt = retained.findIndex((book) => book.repos?.[0] === "tnoa");
    insertAt = insertAt >= 0 ? insertAt + 1 : retained.length;
    retained.splice(insertAt, 0, {
      n: route === "seven" ? "O4" : "",
      title: `REC — ${rec.pulse}`,
      chapters: 1,
      series: "observation",
      repos: ["rec"],
      note: "pre-entry exposure / gate / record-entry selection; TNOA is post-entry semantics",
      status: "active Paper 2"
    });
    if (route === "seven") {
      let index = 1;
      retained.filter((book) => book.series === "observation").forEach((book) => { book.n = `O${index++}`; });
    } else {
      retained.forEach((book, index) => { book.n = String(index + 1); });
    }
    data.books[route] = retained;
  };

  patchRecBook("seven");
  patchRecBook("eight");

  window.ZUIZUI_THOUGHTS.rec = {
    line: rec.pulse,
    move: rec.thoughtMove,
    keeps: rec.thoughtKeeps,
    refuses: rec.thoughtRefuses
  };

  // Azami Chapter 3: own-data discrimination after the completed public-data Chapter 2.
  const eazami = data.nodes.find((node) => node.id === "EAzami");
  const aza3 = {
    id: "aza3",
    series: "azami",
    x: .43,
    y: .31,
    status: "open",
    layers: ["chapter 3", "own data", "ancestry", "phenotype", "cytotype", "history discrimination"],
    pulse: "残った歴史は、同じ個体に結びついた証拠で分ける。",
    thoughtMove: "EAzami が公共データの同定限界で残した competing histories を、same-individual ancestry・phenotype・cytotype と、別途認可された function / fitness evidence で判別する。",
    thoughtKeeps: "immutable individual identity、voucher / diagnostic image、same-library Japan-wide RAD-seq topology/network sensitivity、phenotype state、cytotype、authorization provenance、未判別の歴史集合。",
    thoughtRefuses: "公共データ Chapter 2 を将来自前データで retroactive confirmation と呼ぶこと、RAD-seq一本を無条件の species tree と呼ぶこと、未認可の field/tissue/function evidence を存在するものとして扱うこと。",
    summary: "EAzami Chapter 2 の public-data ceiling から始まる own-data Chapter 3。最初の成果は日本全体の same-library RAD-seq topology/network sensitivity で、各ゲノム記録を同一個体の表現型・cytotype・voucher/画像・認可記録へ結び、残る歴史仮説を判別する。",
    ceiling: "own biological data は現在0。field/tissue authorization、definitive Japan-wide species-tree claim、機構・fitness の確定はいずれも未認可であり、open gate を result に昇格しない。",
    next: "優先順位付き sampling discriminator に従って同一個体 intake を埋め、系統/ネットワーク感度で公共データ由来の competing histories を最初に分ける。"
  };

  data.nodes = data.nodes.filter((node) => node.id !== "aza3");
  data.nodes.push(aza3);

  if (eazami) {
    eazami.status = "result";
    eazami.next = "aza3 へ。公共データで残った histories を own Japan-wide ancestry × phenotype × cytotype の same-individual design で判別する。";
  }

  if (data.series?.azami) {
    data.series.azami.lane = "PHENOTYPE → EVOLUTIONARY HISTORY → OWN-DATA DISCRIMINATION";
  }

  if (data.stories?.azami) {
    data.stories.azami.nodes = ["azami", "EAzami", "aza3"];
    data.stories.azami.text = "現在の表現型 breadth を置き、公共データで進化史の下限と曖昧さを分離し、残った histories だけを自前の同一個体データで判別する。";
  }

  data.edges = data.edges.filter((edge) => edge.from !== "aza3" && edge.to !== "aza3");
  data.edges.push({ from: "EAzami", to: "aza3", type: "solid", label: "public-history ceiling → own-data discrimination" });

  (data.axes || []).forEach((axis) => {
    axis.repos = (axis.repos || []).filter((id) => id !== "aza3");
    if (["時間", "現実", "メカニズム"].includes(axis.name)) axis.repos.push("aza3");
  });

  const patchAza3Book = (route) => {
    const books = data.books?.[route];
    if (!books) return;
    const retained = books.filter((book) => book.repos?.[0] !== "aza3");
    let insertAt = retained.findIndex((book) => book.repos?.[0] === "EAzami");
    insertAt = insertAt >= 0 ? insertAt + 1 : retained.length;
    retained.splice(insertAt, 0, {
      n: route === "seven" ? "A3" : "",
      title: `aza3 — ${aza3.pulse}`,
      chapters: 1,
      series: "azami",
      repos: ["aza3"],
      note: "own-data discrimination after public-data Chapter 2",
      status: "open"
    });
    if (route === "seven") {
      let index = 1;
      retained.filter((book) => book.series === "azami").forEach((book) => { book.n = `A${index++}`; });
    } else {
      retained.forEach((book, index) => { book.n = String(index + 1); });
    }
    data.books[route] = retained;
  };

  patchAza3Book("seven");
  patchAza3Book("eight");

  window.ZUIZUI_THOUGHTS.aza3 = {
    line: aza3.pulse,
    move: aza3.thoughtMove,
    keeps: aza3.thoughtKeeps,
    refuses: aza3.thoughtRefuses
  };

  window.ZUIZUI_REPOSITORY_CLASSIFICATION = {
    scientificActive: 29,
    metaRegistry: ["zuizui0223.github.io"],
    staging: ["284b"],
    stagingRule: "repository existence without an independent scientific contract is not an open scientific fragment"
  };
})();
