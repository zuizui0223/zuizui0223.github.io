(function () {
  "use strict";
  const data = window.WORLDLINES;
  if (!data) return;

  const ID = "niche";
  const COLOR = "#b9c977";
  const GLYPH = "◇";
  const CHAPTERS = ["sdmr", "odsp", "eog", "acsp"];

  data.series[ID] = { label: "ニッチ→観測", color: COLOR, lane: "REPRESENT → THICKEN → REALIZE → OBSERVE" };

  function upsert(id, patch) {
    const node = data.nodes.find((item) => item.id === id);
    if (node) Object.assign(node, patch); else data.nodes.push({ id, ...patch });
  }

  upsert("sdmr", {
    series: ID, status: "result", x: .42, y: .61,
    pulse: "環境は、入れただけでは niche にならない。",
    thoughtMove: "環境候補・選択戦略・複雑度を sealed evidence の外で凍結し、niche representation に残す環境情報へ out-of-sample の資格を要求する。",
    thoughtKeeps: "candidate universe、predictive admission、not-promoted empirical result、Product-B block。",
    thoughtRefuses: "生態学的にもっともらしい変数を、独立予測を通さず universal driver と呼ぶこと。",
    summary: "Chapter 1 — WHAT belongs in the niche? known-truth lane は支持されたが、fresh empirical Product A は not_promoted、Product B は blocked。",
    ceiling: "known-truth supportを empirical promotion とせず、fresh non-support 後に設計を変えて救済しない。",
    next: "Product A は hard stop 済み。結果を manuscript として閉じ、Product B は unblock しない。",
    layers: ["chapter 1", "environment", "representation", "sealed evidence"]
  });

  upsert("odsp", {
    series: ID, status: "open", x: .47, y: .70,
    pulse: "地図は、niche を薄くする。",
    thoughtMove: "S(x,y) を S(x,y,z,t,...) として開き、水平位置を知った後に残る vertical / temporal information を niche thickness として測る。",
    thoughtKeeps: "H(Z|X,Y)、H(T|X,Y)、H(Z,T|X,Y)、source precision、effort/detectability semantics。",
    thoughtRefuses: "同じ水平面積を同じ ecological state-space capacity とみなすこと、raw record count を unbiased use probability とみなすこと。",
    summary: "Chapter 2 — HOW THICK is it? 平面 S(x,y) が隠す z・t の追加軸を conditional information と effective state count で測る。旧 spatial-patch/topology ownership は EOG に残る。",
    ceiling: "時刻・高さ・深さを source precision 以上に補完しない。",
    next: "known-truth projection-loss validation から独立 empirical applications と habitat-complexity comparison へ進む。",
    layers: ["chapter 2", "geometry", "z/t", "projection loss"]
  });

  upsert("eog", {
    series: ID, status: "open",
    pulse: "住める場所と、辿り着ける場所は違う。",
    thoughtMove: "local possibility、reachability、distributional realizability、historical truth を分け、compatible transition worlds を残したまま forward projection する。",
    thoughtKeeps: "exact update/falsification identity、possible / robust / unresolved states、label-invariant predictive summary。",
    thoughtRefuses: "local suitability を realized distribution と同一視すること、compatible world を true history と呼ぶこと。",
    summary: "Chapter 3 — WHERE can it become real? local support を source・transition・reachability を持つ distribution worlds へ通す。第三 heterogeneous endpoint が paper-level closure gate。",
    ceiling: "真の移動史・唯一 world・一般的 SDM 優越を同定しない。",
    next: "第三 heterogeneous endpoint を一度だけ終端判定し、outcome に関係なく synthesis を閉じる。",
    layers: ["chapter 3", "world set", "reachability", "forecast"]
  });

  upsert("acsp", {
    series: ID, status: "result",
    pulse: "予測の終点は、次の観測の入口になる。",
    thoughtMove: "support envelope を、次に調べることを正当化できる bounded candidate patches へ変換する。",
    thoughtKeeps: "validated Japanese 2.5% robust-support patches、held-out enrichment、failed country generalization。",
    thoughtRefuses: "candidate patch を occupancy probability・exact occupied site・route optimum・global product と呼ぶこと。",
    summary: "Chapter 4 — WHERE can we justify looking next? 日本12地域の 2.5% robust-support tier は candidate patches を返すが、country extension は promotion gate を通らない。",
    ceiling: "survey budget・route・exact occupancy は所有しない。",
    next: "日本版を境界付き product として閉じ、別地理は新しい prospective contract から始める。",
    layers: ["chapter 4", "survey action", "candidate patch", "heldout"]
  });

  data.stories[ID] = {
    label: "ニッチ→観測",
    axiom: "niche ≠ 地図",
    nodes: CHAPTERS.slice(),
    text: "何を残す？ → 何が隠れる？ → どこまで届く？ → どこを見る？"
  };

  if (data.stories?.method) {
    data.stories.method.nodes = (data.stories.method.nodes || []).filter((id) => !CHAPTERS.includes(id));
  }

  data.edges = data.edges.filter((edge) => !(CHAPTERS.includes(edge.from) && CHAPTERS.includes(edge.to)));
  data.edges.push(
    { from: "sdmr", to: "odsp", type: "solid", label: "representation → added axes" },
    { from: "odsp", to: "eog", type: "solid", label: "geometry → realizability" },
    { from: "eog", to: "acsp", type: "solid", label: "worlds → survey candidates" }
  );

  (data.axes || []).forEach((axis) => {
    if ((axis.name === "空間" || axis.name === "時間" || axis.name === "パターン") && !axis.repos.includes("odsp")) axis.repos.push("odsp");
    if (axis.name === "方法") CHAPTERS.forEach((repo) => { if (!axis.repos.includes(repo)) axis.repos.push(repo); });
  });

  const chapterBook = {
    sdmr: ["N1", "WHAT belongs in the niche? — sdmr"],
    odsp: ["N2", "HOW THICK is it? — odsp"],
    eog: ["N3", "WHERE can it become real? — eog"],
    acsp: ["N4", "WHERE can we justify looking next? — acsp"]
  };

  ["seven", "eight"].forEach((route) => {
    const books = data.books?.[route];
    if (!books) return;
    const retained = books.filter((book) => !CHAPTERS.includes(book.repos?.[0]));
    const insertAt = Math.max(0, retained.findIndex((book) => book.repos?.[0] === "microdonta"));
    const cards = CHAPTERS.map((repo) => ({
      n: route === "seven" ? chapterBook[repo][0] : "",
      title: chapterBook[repo][1],
      chapters: 1,
      series: ID,
      repos: [repo],
      note: data.nodes.find((node) => node.id === repo)?.pulse || "",
      status: "1 repo = 1 chapter"
    }));
    retained.splice(insertAt >= 0 ? insertAt : retained.length, 0, ...cards);
    if (route === "eight") retained.forEach((book, index) => { book.n = String(index + 1); });
    data.books[route] = retained;
  });

  window.ZUIZUI_THOUGHTS = window.ZUIZUI_THOUGHTS || {};
  CHAPTERS.forEach((repo) => {
    const node = data.nodes.find((item) => item.id === repo);
    window.ZUIZUI_THOUGHTS[repo] = { line: node.pulse, move: node.thoughtMove, keeps: node.thoughtKeeps, refuses: node.thoughtRefuses };
  });

  const portals = document.querySelector(".portals");
  if (portals && !portals.querySelector('[data-portal="niche"]')) {
    portals.insertAdjacentHTML("beforeend", `<g class="portal portal-niche" data-portal="niche" tabindex="0" role="button" aria-label="ニッチから観測へ"><title>ニッチ → 観測</title><path id="portal-niche" class="portal-line" d="M449 369C345 357 216 350 88 356" /><path class="portal-hit" d="M449 369C345 357 216 350 88 356" /><circle class="portal-node" cx="88" cy="356" r="18" /><text x="88" y="361">${GLYPH}</text></g>`);
  }

  const axiomRing = document.querySelector(".axiom-ring");
  if (axiomRing && !axiomRing.querySelector('[data-axiom-series="niche"]')) {
    axiomRing.insertAdjacentHTML("beforeend", `<button type="button" data-axiom-series="niche" style="--axiom-color:${COLOR}"><i>${GLYPH}</i><span>niche ≠ 地図</span></button>`);
  }
})();
