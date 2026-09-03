(function () {
  "use strict";

  const data = window.WORLDLINES;
  const dialog = document.getElementById("philosophyDialog");
  if (!data) return;

  function openDialog() {
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("philosophy-open");
  }

  function closeDialog() {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    document.body.classList.remove("philosophy-open");
  }

  const observationAxiom = document.querySelector('[data-axiom-series="observation"] span');
  if (observationAxiom) observationAxiom.textContent = "記録 ≠ 世界";

  const audit = document.querySelector(".philosophy-audit");
  if (audit) {
    audit.textContent = "28 · static";
    audit.title = "28 active repositories";
  }

  document.querySelectorAll("[data-philosophy]").forEach((trigger) => {
    trigger.addEventListener("click", openDialog);
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDialog();
      }
    });
  });

  document.querySelectorAll("[data-axiom-series]").forEach((button) => {
    button.addEventListener("click", () => {
      closeDialog();
      document.querySelector(`[data-series="${button.dataset.axiomSeries}"]`)?.click();
      document.getElementById("atlas")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelector(".philosophy-close")?.addEventListener("click", (event) => {
    if (!(dialog && typeof dialog.showModal === "function")) {
      event.preventDefault();
      closeDialog();
    }
  });

  if (dialog) {
    dialog.addEventListener("close", () => document.body.classList.remove("philosophy-open"));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
    });
  }

  function patchObservationPath() {
    const observationActive = document.querySelector('[data-series="observation"].is-active');
    const path = document.querySelector("#detailPanel .path-code");
    if (!observationActive || !path) return;
    path.textContent = "pollipi → insepi → TNOA → REC  ／  Ω → REC → record → TNOA";
    path.title = "left: research development lineage; right: scientific information flow";
    path.setAttribute("aria-label", "Research lineage: pollipi to insepi to TNOA to REC. Scientific information flow: exposure universe to REC to entered record to TNOA.");
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.('[data-series="observation"], [data-portal="observation"]');
    if (trigger) window.requestAnimationFrame(patchObservationPath);
  });

  if (!document.querySelector('link[href^="phd-path.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "phd-path.css?v=20260903g";
    document.head.appendChild(link);
  }

  const shell = dialog?.querySelector(".philosophy-shell");
  if (shell && !shell.querySelector(".phd-path")) {
    const nav = document.createElement("nav");
    nav.className = "phd-path";
    nav.setAttribute("aria-label", "PhD in zuizui thought path");
    nav.innerHTML = `
      <button type="button" data-phd-repo="hotarubukuro" title="差を一つの原因へ畳めなかった原点">原点</button>
      <button type="button" data-phd-repo="rec" title="REC / TNOA: 記録 ≠ 世界">記録</button>
      <button type="button" data-phd-repo="boundary" title="決められることと決められないことの境界">境界</button>
      <button type="button" data-phd-repo="mrod" title="残る差を分ける次の観測">次観測</button>
      <button type="button" data-phd-repo="crest" title="必要な差だけ残す安全な忘却">忘却</button>
      <button type="button" data-phd-repo="theouni" title="証拠の住所ごと次の問いへ渡す">渡す</button>`;
    shell.appendChild(nav);

    const note = document.createElement("div");
    note.className = "phd-path-note";
    note.innerHTML = '<a href="phd-path-audit.json" title="portfolio thought path audit">差を消さない → 世界にしない → 分ける → 忘れる → 渡す</a>';
    shell.appendChild(note);
  }

  function openRepository(repoId) {
    const node = data.nodes.find((item) => item.id === repoId);
    if (!node) return;
    closeDialog();
    document.querySelector('[data-view="world"]')?.click();
    document.querySelector('[data-series="all"]')?.click();
    window.requestAnimationFrame(() => {
      const label = (node.label || node.id).trim().toLowerCase();
      const button = Array.from(document.querySelectorAll("#nodeList button"))
        .find((item) => item.textContent.trim().toLowerCase() === label);
      button?.click();
      document.getElementById("atlas")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  dialog?.querySelectorAll("[data-phd-repo]").forEach((button) => {
    button.addEventListener("click", () => openRepository(button.dataset.phdRepo));
  });
})();
