(function () {
  "use strict";

  const data = window.WORLDLINES;
  if (!data) return;

  const ID = "niche";
  const COLOR = "#b9c977";
  const GLYPH = "◇";
  const CHAPTERS = ["sdmr", "odsp", "eog", "acsp"];

  data.series[ID] = {
    label: "ニッチ→観測",
    color: COLOR,
    lane: "REPRESENT → THICKEN → REALIZE → OBSERVE"
  };

  function upsert(id, patch) {
    const node = data.nodes.find((item) => item.id === id);
    if (node) Object.assign(node, patch);
    else data.nodes.push({ id, ...patch });
  }

  upsert("sdmr", {
    series: ID,
    status: "result",
    x: .42,
    y: .61,
    pulse: "環境は、入れただけでは niche にならない。",
    thoughtMove: "環境候補・選択戦略・複雑度を sealed evidence の外で凍結し、niche representation に残す環境情報へ out-of-sample の資格を要求する。",
    thoughtKeeps: "candidate universe、predictive admission、not-promoted empirical result、Product-B block。",
    thoughtRefuses: "生態学的にもっともらしい変数を、独立予測を通さず driver や universal niche dimension と呼ぶこと。",
    summary: "Chapter 1 — WHAT belongs in the niche? Predictor universe と選択法を sealed answer-check の外で固定する。known-truth lane は支持されたが、fresh empirical Product A は empirical_confirmation_not_supported で not_promoted、universal-driver Product B は blocked。",
    ceiling: "GBIF presenceを確率1、未記録をabsence、known-truth supportを empirical promotion としない。fresh non-support 後に taxa・M・seed・threshold・candidate library を変えて救済しない。",
    next: "Product A は scientific hard stop 済み。結果をそのまま manuscript として閉じ、Product B は unblock しない。",
    layers: ["chapter 1", "environment", "representation", "sealed evidence"]
  });

  upsert("odsp", {
    series: ID,
    status: "open",
    x: .47,
    y: .70,
    pulse: "地図は、niche を薄くする。",
    thoughtMove: "S(x,y) へ潰された support を S(x,y,z,t,...) として開き、水平位置を知った後に残る vertical / temporal information を niche thickness として測る。",
    thoughtKeeps: "H(Z|X,Y)、H(T|X,Y)、H(Z,T|X,Y)、source precision、effort / detectability semantics。",
    thoughtRefuses: "同じ水平面積を同じ ecological state-space capacity とみなすこと、raw opportunistic record count を unbiased use probability とみなすこと。",
    summary: "Chapter 2 — HOW THICK is it? 平面 S(x,y) が隠す z・t などの追加軸を conditional information と effective state count で測る。旧 ODSP の spatial-patch/topology programme は EOG に移管済みで、現在の ODSP は multidimensional niche geometry。",
    ceiling: "時刻・高さ・深さを source precision 以上に補完せず、upload time を biological time にせず、記録密度を effort/detectability 補正なしに biological use としない。",
    next: "known-truth projection-loss validation から、time / vertical coverage を持つ独立 empirical applications と habitat-complexity comparison へ進む。",
    layers: ["chapter 2", "geometry", "z/t", "projection loss"]
  });

  upsert("eog", {
    series: ID,
    status: "open",
    pulse: "住める場所と、辿り着ける場所は違う。",
    thoughtMove: "local possibility、reachability、distributional realizability、historical truth を分け、positive evidence と両立する transition worlds を残したまま forward projection する。",
    thoughtKeeps: "exact update/falsification identity、possible / robust / unresolved states、label-invariant predictive summary。",
    thoughtRefuses: "local suitability を実現分布と同一視すること、compatible world を true history と呼ぶこと、二つの favorable endpoint から universal superiority を主張すること。",
    summary: "Chapter 3 — WHERE can it become real? 宣言された local support を、source・transition・reachability を持つ複数の distribution worlds へ通す。exact identity は更新に残し、予測には symmetric world-set summary を使う。fresh favorable endpoint は現在2系で、第三の heterogeneous endpoint が paper-level closure gate。",
    ceiling: "真の移動史・唯一 world・一般的 SDM 優越を同定しない。STOP / non-estimable candidate を adverse prediction と読み替えず、第三 endpoint 後に第四 dataset を探さない。",
    next: "事前凍結した第三 heterogeneous endpoint を一度だけ終端判定し、outcome に関係なく cross-ecosystem synthesis を閉じる。",
    layers: ["chapter 3", "world set", "reachability", "forecast"]
  });

  upsert("acsp", {
    series: ID,
    status: "result",
    pulse: "予測の終点は、次の観測の入口になる。",
    thoughtMove: "occurrence-conditioned support envelope を、field actionそのものではなく、次に調べることを正当化できる bounded candidate patches へ変換する。",
    thoughtKeeps: "validated Japanese 2.5% robust-support patches、10 km held-out enrichment、failed country generalization、provider-supply abstention。",
    thoughtRefuses: "candidate patch を occupancy probability・exact occupied site・route optimum・global product と呼ぶこと。",
    summary: "Chapter 4 — WHERE can we justify looking next? 日本12地域では frozen 2.5% robust-support tier が held-out occurrences を濃縮する candidate patches を返す。country-framed extension は二度の preregistered gate を通らず、global promotion は行わない。",
    ceiling: "survey budget・route・travel mode・field days・exact occupancy は所有しない。正の平均 lift だけで failed promotion gate を覆さない。",
    next: "日本版を境界付きの survey-candidate product として閉じる。別地理への展開は新しい prospective contract と独立 cohort から始める。",
    layers: ["chapter 4", "survey action", "candidate patch", "heldout"]
  });

  data.stories[ID] = {
    label: "ニッチ→観測",
    axiom: "niche ≠ 地図",
    nodes: CHAPTERS.slice(),
    text: "何を残す？ → 何が隠れる？ → どこまで届く？ → どこを見る？"
  };

  const methodStory = data.stories.method;
  if (methodStory) {
    let methodNodes = (methodStory.nodes || []).filter((id) => !CHAPTERS.includes(id));
    Object.defineProperty(methodStory, "nodes", {
      configurable: true,
      enumerable: true,
      get() { return methodNodes; },
      set(value) {
        methodNodes = Array.isArray(value) ? value.filter((id) => !CHAPTERS.includes(id)) : [];
      }
    });
    methodStory.text = "測れない原因を制約で囲い、残る因果世界を分ける次観測を選ぶ。";
  }

  data.edges = data.edges.filter((edge) => {
    if (CHAPTERS.includes(edge.from) && CHAPTERS.includes(edge.to)) return false;
    if (edge.from === "microdonta" && edge.to === "eog") return false;
    return true;
  });
  data.edges.push(
    { from: "sdmr", to: "odsp", type: "solid", label: "representation → added axes" },
    { from: "odsp", to: "eog", type: "solid", label: "geometry → realizability" },
    { from: "eog", to: "acsp", type: "solid", label: "worlds → survey candidates" },
    { from: "microdonta", to: "eog", type: "bridge", label: "causal worlds ↔ distribution worlds" }
  );

  data.axes.forEach((axis) => {
    if ((axis.name === "空間" || axis.name === "時間" || axis.name === "パターン") && !axis.repos.includes("odsp")) axis.repos.push("odsp");
    if (axis.name === "方法") CHAPTERS.forEach((repo) => { if (!axis.repos.includes(repo)) axis.repos.push(repo); });
  });

  const chapterBook = {
    sdmr: { n: "N1", title: "WHAT belongs in the niche? — sdmr", note: "environment → admitted representation" },
    odsp: { n: "N2", title: "HOW THICK is it? — odsp", note: "x-y → x-y-z-t" },
    eog: { n: "N3", title: "WHERE can it become real? — eog", note: "local possibility → reachable worlds" },
    acsp: { n: "N4", title: "WHERE can we justify looking next? — acsp", note: "world/support → bounded survey candidates" }
  };

  if (data.books?.seven) {
    const books = data.books.seven;
    const existingByRepo = new Map(books.map((book) => [book.repos?.[0], book]));
    const programme = CHAPTERS.map((repo) => {
      const base = existingByRepo.get(repo) || { chapters: 1, repos: [repo], status: "1 repo = 1 chapter" };
      return Object.assign(base, chapterBook[repo], { series: ID, repos: [repo] });
    });
    const retained = books.filter((book) => !CHAPTERS.includes(book.repos?.[0]));
    const methodIndex = retained.findIndex((book) => book.repos?.[0] === "microdonta");
    retained.splice(methodIndex >= 0 ? methodIndex : retained.length, 0, ...programme);
    data.books.seven = retained;
  }

  if (data.books?.eight) {
    const books = data.books.eight.filter((book) => !CHAPTERS.includes(book.repos?.[0]));
    const methodIndex = books.findIndex((book) => book.repos?.[0] === "microdonta");
    const programme = CHAPTERS.map((repo) => ({
      n: "",
      title: chapterBook[repo].title,
      chapters: 1,
      series: ID,
      repos: [repo],
      note: chapterBook[repo].note,
      status: "question route"
    }));
    books.splice(methodIndex >= 0 ? methodIndex : books.length, 0, ...programme);
    books.forEach((book, index) => { book.n = String(index + 1); });
    data.books.eight = books;
  }

  window.ZUIZUI_THOUGHTS = window.ZUIZUI_THOUGHTS || {};
  CHAPTERS.forEach((repo) => {
    const node = data.nodes.find((item) => item.id === repo);
    window.ZUIZUI_THOUGHTS[repo] = {
      line: node.pulse,
      move: node.thoughtMove,
      keeps: node.thoughtKeeps,
      refuses: node.thoughtRefuses
    };
  });

  if (!document.querySelector('link[href="niche-program.css"]') && !document.querySelector('link[href^="niche-program.css?"]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "niche-program.css";
    document.head.appendChild(stylesheet);
  }

  const portals = document.querySelector(".portals");
  if (portals && !portals.querySelector('[data-portal="niche"]')) {
    portals.insertAdjacentHTML("beforeend", `
      <g class="portal portal-niche" data-portal="niche" tabindex="0" role="button" aria-label="ニッチから観測へ">
        <title>ニッチ → 観測</title>
        <path id="portal-niche" class="portal-line" d="M449 369C345 357 216 350 88 356" />
        <path class="portal-hit" d="M449 369C345 357 216 350 88 356" />
        <circle class="portal-node" cx="88" cy="356" r="18" /><text x="88" y="361">${GLYPH}</text>
        <g class="niche-mini-spine" aria-hidden="true">
          <circle cx="150" cy="354" r="2.1"/><circle cx="205" cy="357" r="2.1"/><circle cx="260" cy="359" r="2.1"/><circle cx="315" cy="362" r="2.1"/>
        </g>
      </g>`);
    document.querySelector(".particles")?.insertAdjacentHTML("beforeend", `<circle r="2.2"><animateMotion dur="12s" begin="-5s" repeatCount="indefinite"><mpath href="#portal-niche" /></animateMotion></circle>`);
  }

  const axiomRing = document.querySelector(".axiom-ring");
  if (axiomRing && !axiomRing.querySelector('[data-axiom-series="niche"]')) {
    axiomRing.insertAdjacentHTML("beforeend", `<button type="button" data-axiom-series="niche" style="--axiom-color:${COLOR}"><i>${GLYPH}</i><span>niche ≠ 地図</span></button>`);
  }

  const seriesFilter = document.getElementById("seriesFilter");
  const detail = document.getElementById("detailPanel");

  function syncRenderedGlyphs() {
    const button = seriesFilter?.querySelector('[data-series="niche"]');
    if (button) {
      if (button.textContent !== GLYPH) button.textContent = GLYPH;
      button.title = "ニッチ → 観測";
      button.setAttribute("aria-label", "ニッチから観測へ");
    }
    const active = document.querySelector('[data-series="niche"].is-active');
    if (active) {
      const symbol = detail?.querySelector(".path-symbol");
      if (symbol && symbol.textContent !== GLYPH) symbol.textContent = GLYPH;
    }
  }

  function enhanceProgrammeDetail() {
    syncRenderedGlyphs();
    if (!detail) return;
    const path = detail.querySelector(".path-code");
    const active = document.querySelector('[data-series="niche"].is-active');
    if (path && active) {
      const desiredPath = "sdmr → odsp → eog → acsp";
      if (path.textContent !== desiredPath) path.textContent = desiredPath;
      if (!detail.querySelector(".niche-question-spine")) {
        const spine = document.createElement("span");
        spine.className = "niche-question-spine";
        spine.textContent = "WHAT → THICK → REALIZE → LOOK";
        spine.title = "chapter order is epistemic, not a strict software dependency";
        path.before(spine);
      }
    }
  }

  function syncPerspective() {
    const mode = document.body.dataset.perspective || "all";
    const related = mode === "coordinate" || mode === "boundary";
    document.querySelectorAll('[data-portal="niche"], [data-axiom-series="niche"]').forEach((element) => {
      element.classList.toggle("is-perspective-related", related);
      element.classList.toggle("is-perspective-dim", mode !== "all" && !related);
    });
  }

  if (detail) new MutationObserver(enhanceProgrammeDetail).observe(detail, { childList: true, subtree: true });
  new MutationObserver(syncPerspective).observe(document.body, { attributes: true, attributeFilter: ["data-perspective"] });

  window.setTimeout(() => {
    syncRenderedGlyphs();
    enhanceProgrammeDetail();
    syncPerspective();
  }, 0);
})();
