(function () {
  "use strict";

  const modes = {
    all: {
      formula: "Ω ≠ O ≠ S ≠ R",
      whisper: "同じ世界、別の状態。",
      core: "答えの所有ではなく、<br />忘却の責任。",
      title: "世界・観測・状態・報告を分ける",
      color: "#d9d0aa",
      series: []
    },
    coordinate: {
      glyph: "⌖",
      formula: "Ω × V → Xᵥ",
      whisper: "原因より、座標。",
      core: "原因より、<br />座標。",
      title: "同じ世界を別の座標で見る",
      color: "#e6b85c",
      series: ["azami", "flower", "island"]
    },
    boundary: {
      glyph: "∅",
      formula: "U ≠ 0",
      whisper: "答えより、境界。",
      core: "答えより、<br />境界。",
      title: "未決定・反証・不成立を残す",
      color: "#63bfe0",
      series: ["observation", "method"]
    },
    forgetting: {
      glyph: "≈",
      formula: "S(C) = Ω / ∼C",
      whisper: "分類より、忘却。",
      core: "分類より、<br />忘却。",
      title: "何を同じとしてよいかを定める",
      color: "#a48af4",
      series: ["theory"]
    }
  };

  const order = ["all", "coordinate", "boundary", "forgetting"];
  const identity = document.querySelector(".identity-card");
  const philosophyName = identity?.querySelector(".philosophy-name");
  const dialog = document.getElementById("philosophyDialog");
  const shell = dialog?.querySelector(".philosophy-shell");
  const core = shell?.querySelector(".philosophy-core");
  const coreCopy = core?.querySelector("p");
  const coreTitle = core?.querySelector("strong");

  if (!identity || !philosophyName || !shell || !core || !coreCopy || !coreTitle) return;

  if (!document.querySelector('link[href="perspective.css"]')) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "perspective.css";
    document.head.appendChild(style);
  }

  const equation = document.createElement("button");
  equation.type = "button";
  equation.className = "perspective-equation";
  equation.setAttribute("aria-label", "視点を切り替える");
  equation.innerHTML = '<span class="perspective-equation-text"></span><i aria-hidden="true">↻</i>';

  const whisper = document.createElement("span");
  whisper.className = "perspective-whisper";
  whisper.setAttribute("aria-live", "polite");

  philosophyName.insertAdjacentElement("afterend", equation);
  equation.insertAdjacentElement("afterend", whisper);

  const formula = document.createElement("span");
  formula.className = "perspective-formula";
  formula.setAttribute("aria-hidden", "true");
  coreTitle.insertAdjacentElement("afterend", formula);

  const switcher = document.createElement("div");
  switcher.className = "perspective-switch";
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", "viewpoint");
  switcher.innerHTML = [
    '<button type="button" data-perspective-mode="coordinate" aria-label="座標" title="原因より、座標。">⌖</button>',
    '<button type="button" data-perspective-mode="boundary" aria-label="境界" title="答えより、境界。">∅</button>',
    '<button type="button" data-perspective-mode="forgetting" aria-label="忘却" title="分類より、忘却。">≈</button>',
    '<button type="button" data-perspective-mode="all" aria-label="全体" title="同じ世界、別の状態。">·</button>'
  ].join("");
  shell.appendChild(switcher);

  const audit = document.createElement("a");
  audit.className = "perspective-audit";
  audit.href = "viewpoint-audit.json";
  audit.textContent = "⌖3";
  audit.title = "viewpoint provenance";
  audit.setAttribute("aria-label", "viewpoint provenance");
  shell.appendChild(audit);

  let current = "all";

  function applyMode(id) {
    if (!modes[id]) return;
    current = id;
    const mode = modes[id];

    document.body.dataset.perspective = id;
    document.documentElement.style.setProperty("--perspective-color", mode.color);

    const equationText = equation.querySelector(".perspective-equation-text");
    if (equationText) equationText.textContent = mode.formula;
    equation.title = mode.title;
    equation.setAttribute("aria-label", `${mode.title}。クリックで視点を切り替える`);
    whisper.textContent = mode.whisper;
    formula.textContent = mode.formula;
    formula.title = mode.title;
    coreCopy.innerHTML = mode.core;

    switcher.querySelectorAll("[data-perspective-mode]").forEach((button) => {
      const active = button.dataset.perspectiveMode === current;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-portal]").forEach((portal) => {
      const related = mode.series.includes(portal.dataset.portal);
      portal.classList.toggle("is-perspective-related", related);
      portal.classList.toggle("is-perspective-dim", current !== "all" && !related);
    });

    document.querySelectorAll("[data-axiom-series]").forEach((button) => {
      const related = mode.series.includes(button.dataset.axiomSeries);
      button.classList.toggle("is-perspective-related", related);
      button.classList.toggle("is-perspective-dim", current !== "all" && !related);
    });
  }

  function rotate(step = 1) {
    const index = order.indexOf(current);
    const next = order[(index + step + order.length) % order.length];
    applyMode(next);
  }

  equation.addEventListener("click", () => rotate(1));

  equation.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      rotate(1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      rotate(-1);
    }
  });

  switcher.querySelectorAll("[data-perspective-mode]").forEach((button) => {
    button.addEventListener("click", () => applyMode(button.dataset.perspectiveMode));
  });

  switcher.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      rotate(1);
      switcher.querySelector(`[data-perspective-mode="${current}"]`)?.focus();
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      rotate(-1);
      switcher.querySelector(`[data-perspective-mode="${current}"]`)?.focus();
    }
  });

  applyMode("all");
})();
