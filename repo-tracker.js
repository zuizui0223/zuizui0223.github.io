(function () {
  "use strict";

  const data = window.WORLDLINES;
  const detail = document.getElementById("detailPanel");
  const nodeList = document.getElementById("nodeList");
  if (!data || !detail || !nodeList) return;

  const OWNER = "zuizui0223";
  const LIST_KEY = "zuizui.repo-motion.v2";
  const README_KEY = "zuizui.repo-readme-audit.v2";
  const DETAIL_PREFIX = "zuizui.repo-detail.v2.";
  const LIST_TTL = 15 * 60 * 1000;
  const README_TTL = 6 * 60 * 60 * 1000;
  const DETAIL_TTL = 15 * 60 * 1000;

  const statusLabels = { result: "closed", bounded: "bounded", open: "open", stop: "retired" };
  const labelOf = (node) => node.label || node.id;

  const motion = new Map();
  const details = new Map();
  const readmes = new Map();
  let audit = null;
  let motionLoaded = false;
  let readmeLoaded = false;
  let motionPromise = null;
  let readmePromise = null;

  injectStyle();

  function injectStyle() {
    if (document.getElementById("repoTrackerStyle")) return;
    const style = document.createElement("style");
    style.id = "repoTrackerStyle";
    style.textContent = `
      .repo-motion{position:absolute;top:.28rem;right:.3rem;width:4px;height:4px;border:1px solid rgba(233,230,221,.18);border-radius:50%;opacity:.25;pointer-events:none}
      .repo-motion.is-recent{border-color:var(--node-color);background:var(--node-color);opacity:.82;box-shadow:0 0 9px color-mix(in srgb,var(--node-color) 48%,transparent);animation:repoPulse 3.2s ease-in-out infinite}
      .repo-motion.is-hot{animation-duration:1.9s}
      .repo-motion.is-unavailable{border-style:dotted;opacity:.38}
      .repo-motion.has-drift{width:6px;height:6px;border-color:#ef798a;border-radius:0;background:transparent;opacity:.95;box-shadow:0 0 10px rgba(239,121,138,.3);transform:rotate(45deg);animation:none}
      .repo-sync-indicator{display:inline-block;width:7px;height:7px;margin:0 0 .82rem .55rem;border:1px solid var(--series-color);border-radius:50%;opacity:.28;vertical-align:middle;text-decoration:none}
      .repo-sync-indicator.is-recent{opacity:.82;box-shadow:0 0 10px color-mix(in srgb,var(--series-color) 42%,transparent);animation:repoPulse 3.2s ease-in-out infinite}
      .repo-sync-indicator.is-unavailable{border-style:dotted;opacity:.32}
      .repo-sync-indicator.has-drift{border-color:#ef798a;border-radius:0;opacity:1;transform:rotate(45deg);animation:none}
      .portal.has-recent .portal-node{animation:repoPortalPulse 4.2s ease-in-out infinite}
      .portal.has-hot .portal-node{animation-duration:2.4s}
      .portal.has-drift .portal-node{stroke:#ef798a;stroke-dasharray:2 3}
      .series-filter button.has-recent{opacity:.9}
      .series-filter button.has-drift{border-style:dashed;border-color:#ef798a}
      .philosophy-audit.is-live{color:#626873}.philosophy-audit.has-drift{color:#a86670}
      @keyframes repoPulse{0%,100%{opacity:.28;transform:scale(.82)}50%{opacity:1;transform:scale(1.18)}}
      @keyframes repoPortalPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.09)}}
      @media(prefers-reduced-motion:reduce){.repo-motion,.repo-sync-indicator,.portal.has-recent .portal-node{animation:none}}
    `;
    document.head.appendChild(style);
  }

  function cacheRead(key, ttl) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.savedAt || Date.now() - parsed.savedAt > ttl) return null;
      return parsed.value;
    } catch (_) { return null; }
  }

  function cacheWrite(key, value) {
    try { localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value })); } catch (_) {}
  }

  async function fetchJSON(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally { clearTimeout(timer); }
  }

  function ageClass(value) {
    if (!value) return "quiet";
    const age = Math.max(0, (Date.now() - new Date(value).getTime()) / 86400000);
    if (age <= 1) return "hot";
    if (age <= 7) return "recent";
    return "quiet";
  }

  function shortDate(value) {
    if (!value) return "";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  }

  function auditEntry(repo) { return audit?.active?.find((item) => item.repo === repo) || null; }
  function scientificRef(repo) { return auditEntry(repo)?.scientific_ref || motion.get(repo)?.defaultBranch || "main"; }
  function firstLine(value) { return String(value || "").split("\n")[0].trim(); }

  async function loadAudit() {
    if (audit) return audit;
    try {
      const response = await fetch("repo-audit.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      audit = await response.json();
    } catch (_) { audit = { active: [] }; }
    return audit;
  }

  function ingestMotion(records) {
    motion.clear();
    records.forEach((repo) => motion.set(repo.name, {
      defaultBranch: repo.default_branch || "main",
      pushedAt: repo.pushed_at || repo.updated_at || null,
      url: repo.html_url || `https://github.com/${OWNER}/${repo.name}`,
      activity: ageClass(repo.pushed_at || repo.updated_at)
    }));
    motionLoaded = true;
    apply();
  }

  async function loadMotion(force = false) {
    if (motionPromise && !force) return motionPromise;
    motionPromise = (async () => {
      if (!force) {
        const cached = cacheRead(LIST_KEY, LIST_TTL);
        if (Array.isArray(cached)) { ingestMotion(cached); return cached; }
      }
      try {
        const raw = await fetchJSON(`https://api.github.com/users/${OWNER}/repos?per_page=100&type=owner&sort=updated`);
        const records = raw.filter((repo) => repo.owner?.login === OWNER && !repo.fork).map((repo) => ({
          name: repo.name, default_branch: repo.default_branch, pushed_at: repo.pushed_at, updated_at: repo.updated_at, html_url: repo.html_url
        }));
        cacheWrite(LIST_KEY, records);
        ingestMotion(records);
        return records;
      } catch (_) { motionLoaded = true; apply(); return []; }
      finally { motionPromise = null; }
    })();
    return motionPromise;
  }

  async function mapLimit(items, limit, worker) {
    const out = new Array(items.length);
    let cursor = 0;
    async function runner() {
      while (cursor < items.length) {
        const index = cursor++;
        try { out[index] = await worker(items[index]); } catch (_) { out[index] = null; }
      }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runner));
    return out;
  }

  function ingestReadmes(records) {
    readmes.clear();
    records.filter(Boolean).forEach((item) => readmes.set(item.repo, item));
    readmeLoaded = true;
    apply();
  }

  async function auditReadmes(force = false) {
    if (readmePromise && !force) return readmePromise;
    readmePromise = (async () => {
      await Promise.all([loadAudit(), loadMotion()]);
      if (!force) {
        const cached = cacheRead(README_KEY, README_TTL);
        if (Array.isArray(cached)) { ingestReadmes(cached); return cached; }
      }
      const records = await mapLimit(audit?.active || [], 4, async (entry) => {
        const ref = entry.scientific_ref || motion.get(entry.repo)?.defaultBranch || "main";
        try {
          const readme = await fetchJSON(`https://api.github.com/repos/${OWNER}/${encodeURIComponent(entry.repo)}/readme?ref=${encodeURIComponent(ref)}`);
          return {
            repo: entry.repo, ref, readmeSha: readme.sha || null, auditedReadmeSha: entry.readme_blob || null,
            drift: Boolean(readme.sha && entry.readme_blob && readme.sha !== entry.readme_blob), checkedAt: new Date().toISOString()
          };
        } catch (_) {
          return { repo: entry.repo, ref, readmeSha: null, auditedReadmeSha: entry.readme_blob || null, drift: false, unavailable: true, checkedAt: new Date().toISOString() };
        }
      });
      cacheWrite(README_KEY, records);
      ingestReadmes(records);
      return records;
    })().finally(() => { readmePromise = null; });
    return readmePromise;
  }

  async function loadDetail(repo) {
    if (details.has(repo)) return details.get(repo);
    const cached = cacheRead(`${DETAIL_PREFIX}${repo}`, DETAIL_TTL);
    if (cached) { details.set(repo, cached); return cached; }

    await Promise.all([loadAudit(), loadMotion()]);
    const ref = scientificRef(repo);
    const known = readmes.get(repo);
    const [commitResult, readmeResult] = await Promise.allSettled([
      fetchJSON(`https://api.github.com/repos/${OWNER}/${encodeURIComponent(repo)}/commits/${encodeURIComponent(ref)}`),
      known ? Promise.resolve({ sha: known.readmeSha }) : fetchJSON(`https://api.github.com/repos/${OWNER}/${encodeURIComponent(repo)}/readme?ref=${encodeURIComponent(ref)}`)
    ]);

    const commit = commitResult.status === "fulfilled" ? commitResult.value : null;
    const readme = readmeResult.status === "fulfilled" ? readmeResult.value : null;
    const entry = auditEntry(repo);
    const readmeSha = readme?.sha || known?.readmeSha || null;
    const unavailable = Boolean(known?.unavailable || readmeResult.status !== "fulfilled");
    const drift = Boolean(readmeSha && entry?.readme_blob && readmeSha !== entry.readme_blob);
    const headDate = commit?.commit?.committer?.date || commit?.commit?.author?.date || motion.get(repo)?.pushedAt || null;

    const result = {
      repo, ref, headSha: commit?.sha || null, headDate, headMessage: firstLine(commit?.commit?.message),
      commitUrl: commit?.html_url || motion.get(repo)?.url || `https://github.com/${OWNER}/${repo}`,
      readmeSha, unavailable, drift, activity: ageClass(headDate), checkedAt: new Date().toISOString()
    };
    details.set(repo, result);
    readmes.set(repo, { repo, ref, readmeSha, auditedReadmeSha: entry?.readme_blob || null, unavailable, drift, checkedAt: result.checkedAt });
    cacheWrite(`${DETAIL_PREFIX}${repo}`, result);
    apply();
    return result;
  }

  function titleFor(node) {
    const full = details.get(node.id);
    const movement = motion.get(node.id);
    const readme = readmes.get(node.id);
    const ref = full?.ref || scientificRef(node.id);
    const parts = [labelOf(node), statusLabels[node.status] || node.status];
    const date = shortDate(full?.headDate || movement?.pushedAt);
    if (date) parts.push(date);
    if (ref && ref !== movement?.defaultBranch) parts.push(`@${ref}`);
    if (full?.headMessage) parts.push(full.headMessage);
    if (full?.drift || readme?.drift) parts.push("README ≠ audit");
    return parts.join(" · ");
  }

  function markerFor(button, node) {
    const movement = motion.get(node.id);
    const full = details.get(node.id);
    const readme = readmes.get(node.id);
    const activity = full?.activity || movement?.activity || "quiet";
    const drift = Boolean(full?.drift || readme?.drift);
    const unavailable = Boolean(full?.unavailable || readme?.unavailable);
    let marker = button.querySelector(".repo-motion");
    if (!marker) {
      marker = document.createElement("i");
      marker.className = "repo-motion";
      marker.setAttribute("aria-hidden", "true");
      button.appendChild(marker);
    }
    marker.classList.toggle("is-recent", activity === "recent" || activity === "hot");
    marker.classList.toggle("is-hot", activity === "hot");
    marker.classList.toggle("has-drift", drift);
    marker.classList.toggle("is-unavailable", unavailable);
    button.title = titleFor(node);
    button.setAttribute("aria-label", button.title);
  }

  function enhanceNodeList() {
    nodeList.querySelectorAll("button").forEach((button) => {
      const text = button.firstChild?.textContent?.trim() || button.textContent.trim();
      const node = data.nodes.find((item) => labelOf(item) === text);
      if (node) markerFor(button, node);
    });
  }

  function enhanceDetail() {
    const heading = detail.querySelector("h3");
    if (!heading) return;
    const node = data.nodes.find((item) => labelOf(item) === heading.textContent.trim());
    if (!node) return;
    const movement = motion.get(node.id);
    const full = details.get(node.id);
    const readme = readmes.get(node.id);
    const activity = full?.activity || movement?.activity || "quiet";
    const drift = Boolean(full?.drift || readme?.drift);
    const unavailable = Boolean(full?.unavailable || readme?.unavailable);

    let indicator = detail.querySelector(".repo-sync-indicator");
    if (!indicator) {
      indicator = document.createElement("a");
      indicator.className = "repo-sync-indicator";
      indicator.target = "_blank";
      indicator.rel = "noreferrer";
      (detail.querySelector(".detail-status") || heading).after(indicator);
    }
    indicator.classList.toggle("is-recent", activity === "recent" || activity === "hot");
    indicator.classList.toggle("has-drift", drift);
    indicator.classList.toggle("is-unavailable", unavailable);
    indicator.href = full?.commitUrl || movement?.url || `https://github.com/${OWNER}/${node.id}`;
    indicator.title = titleFor(node);
    indicator.setAttribute("aria-label", indicator.title);

    if (!details.has(node.id) && !indicator.dataset.loading) {
      indicator.dataset.loading = "true";
      loadDetail(node.id).finally(() => { delete indicator.dataset.loading; enhanceDetail(); });
    }
  }

  function enhanceSeries() {
    Object.keys(data.series).forEach((series) => {
      const records = data.nodes.filter((node) => node.series === series).map((node) => ({ m: motion.get(node.id), d: details.get(node.id), r: readmes.get(node.id) }));
      const hot = records.some((item) => (item.d?.activity || item.m?.activity) === "hot");
      const recent = hot || records.some((item) => (item.d?.activity || item.m?.activity) === "recent");
      const drift = records.some((item) => item.d?.drift || item.r?.drift);
      document.querySelectorAll(`[data-series="${series}"], [data-portal="${series}"]`).forEach((element) => {
        element.classList.toggle("has-hot", hot);
        element.classList.toggle("has-recent", recent);
        element.classList.toggle("has-drift", drift);
      });
    });
  }

  function enhanceAuditSummary() {
    const element = document.querySelector(".philosophy-audit");
    if (!element) return;
    const activeCount = audit?.active?.length || data.nodes.length;
    const recentCount = data.nodes.filter((node) => ["hot", "recent"].includes(details.get(node.id)?.activity || motion.get(node.id)?.activity)).length;
    const driftCount = data.nodes.filter((node) => details.get(node.id)?.drift || readmes.get(node.id)?.drift).length;
    const unavailableCount = data.nodes.filter((node) => details.get(node.id)?.unavailable || readmes.get(node.id)?.unavailable).length;
    element.classList.toggle("is-live", motionLoaded);
    element.classList.toggle("has-drift", driftCount > 0);
    element.textContent = readmeLoaded ? `${activeCount} · ↻${recentCount} · Δ${driftCount}${unavailableCount ? ` · ?${unavailableCount}` : ""}` : `${activeCount} · ↻${recentCount}`;
    element.href = "repo-audit.json";
    element.title = readmeLoaded ? `${activeCount} tracked · ${recentCount} recent · ${driftCount} README drift · ${unavailableCount} unavailable` : `${activeCount} tracked · ${recentCount} recent · claim audit on open`;
    element.setAttribute("aria-label", element.title);
  }

  function apply() {
    enhanceNodeList();
    enhanceDetail();
    enhanceSeries();
    enhanceAuditSummary();
  }

  document.querySelectorAll("[data-philosophy]").forEach((trigger) => {
    trigger.addEventListener("click", () => auditReadmes());
    trigger.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") auditReadmes(); });
  });

  new MutationObserver(enhanceDetail).observe(detail, { childList: true, subtree: true });
  new MutationObserver(enhanceNodeList).observe(nodeList, { childList: true, subtree: true });

  loadAudit().then(apply);
  loadMotion();
  apply();
})();
