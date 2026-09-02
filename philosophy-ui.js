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

  const audit = document.querySelector(".philosophy-audit");
  if (audit) {
    audit.textContent = "28 · static";
    audit.title = "28 active repositories";
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
})();
