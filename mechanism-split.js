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
})();
