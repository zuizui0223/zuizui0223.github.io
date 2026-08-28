(function () {
  "use strict";

  const data = window.WORLDLINES;
  const dialog = document.getElementById("philosophyDialog");
  const detail = document.getElementById("detailPanel");
  const nodeList = document.getElementById("nodeList");
  if (!data) return;

  const statusLabels = { result: "closed", bounded: "bounded", open: "sealed", stop: "retired" };
  const labelOf = (node) => node.label || node.id;

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

  function enhanceDetail() {
    if (!detail) return;
    const heading = detail.querySelector("h3");
    const path = detail.querySelector(".path-code");

    if (heading) {
      const node = data.nodes.find((item) => labelOf(item) === heading.textContent.trim());
      if (node) {
        const status = detail.querySelector(".detail-status");
        if (status) {
          const label = statusLabels[node.status] || node.status;
          status.title = label;
          status.setAttribute("aria-label", label);
        }
        if (!detail.querySelector(".detail-pulse")) {
          const pulse = document.createElement("p");
          pulse.className = "detail-pulse";
          pulse.textContent = node.pulse;
          const more = detail.querySelector(".detail-more");
          if (more) more.before(pulse);
          else heading.after(pulse);
        }
      }
    }

    if (path && !detail.querySelector(".path-axiom")) {
      const active = document.querySelector("[data-series].is-active")?.dataset.series;
      const story = active && data.stories[active];
      if (story?.axiom) {
        const axiom = document.createElement("p");
        axiom.className = "path-axiom";
        axiom.textContent = story.axiom;
        path.before(axiom);
      }
    }
  }

  function enhanceNodeList() {
    if (!nodeList) return;
    nodeList.querySelectorAll("button").forEach((button) => {
      const node = data.nodes.find((item) => labelOf(item) === button.textContent.trim());
      if (!node) return;
      const label = `${labelOf(node)} · ${node.pulse} · ${statusLabels[node.status] || node.status}`;
      button.title = label;
      button.setAttribute("aria-label", label);
    });
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
      const target = document.querySelector(`[data-series="${button.dataset.axiomSeries}"]`);
      if (target) target.click();
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
    dialog.addEventListener("click", (event) => { if (event.target === dialog) closeDialog(); });
  }

  new MutationObserver(enhanceDetail).observe(detail, { childList: true, subtree: true });
  new MutationObserver(enhanceNodeList).observe(nodeList, { childList: true, subtree: true });
  enhanceDetail();
  enhanceNodeList();
})();
