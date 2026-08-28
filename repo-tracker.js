(function () {
  "use strict";

  const data = window.WORLDLINES;
  const detail = document.getElementById("detailPanel");
  const nodeList = document.getElementById("nodeList");
  if (!data || !detail || !nodeList) return;

  const OWNER = "zuizui0223";
  const LIST_CACHE_KEY = "zuizui.repo-motion.v1";
  const README_CACHE_KEY = "zuizui.repo-readme-audit.v1";
  const DETAIL_CACHE_PREFIX = "zuizui.repo-detail.v1.";
  const LIST_CACHE_MS = 15 * 60 * 1000;
  const README_CACHE_MS = 6 * 60 * 60 * 1000;
  const DETAIL_CACHE_MS = 15 * 60 * 1000;

  const statusLabels = {
    result: "closed",
    bounded: "bounded",
    open: "sealed",
    stop: "retired"
  };

  const labelOf = (node) => node.label || node.id;
  const repoMotion = new Map();
  const repoDetails = new Map();
  const readmeChecks = new Map();
  let repositoryAudit = null;
  let motionLoaded = false;
  let readmeAuditLoaded = false;
  let motionPromise = null;
  let readmeAuditPromise = null;

  injectStyle();

  function injectStyle() {
    if (document.getElementById("repoTrackerStyle")) return;
    const style = document.createElement("style");
    style.id = "repoTrackerStyle";
    style.textContent = `
      .repo-motion {
        position: absolute;
        top: .28rem;
        right: .3rem;
        width: 4px;
        height: 4px;
        border: 1px solid rgba(233,230,221,.18);
        border-radius: 50%;
        opacity: .25;
        pointer-events: none;
      }
      .repo-motion.is-recent {
        border-color: var(--node-color);
        background: var(--node-color);
        opacity: .82;
        box-shadow: 0 0 9px color-mix(in srgb, var(--node-color) 48%, transparent);
        animation: repoPulse 3.2s ease-in-out infinite;
      }
      .repo-motion.is-hot { animation-duration: 1.9s; }
      .repo-motion.is-unavailable { border-style: dotted; opacity: .38; }
      .repo-motion.has-drift {
        width: 6px;
        height: 6px;
        border-color: #ef798a;
        border-radius: 0;
        background: transparent;
        opacity: .95;
        box-shadow: 0 0 10px rgba(239,121,138,.3);
        transform: rotate(45deg);
        animation: none;
      }
      .repo-sync-indicator {
        display: inline-block;
        width: 7px;
        height: 7px;
        margin: 0 0 .82rem .55rem;
        border: 1px solid var(--series-color);
        border-radius: 50%;
        opacity: .28;
        vertical-align: middle;
        text-decoration: none;
      }
      .repo-sync-indicator.is-recent {
        opacity: .82;
        box-shadow: 0 0 10px color-mix(in srgb, var(--series-color) 42%, transparent);
        animation: repoPulse 3.2s ease-in-out infinite;
      }
      .repo-sync-indicator.is-unavailable { border-style: dotted; opacity: .32; }
      .repo-sync-indicator.has-drift {
        border-color: #ef798a;
        border-radius: 0;
        opacity: 1;
        transform: rotate(45deg);
        animation: none;
      }
      .portal.has-recent .portal-node { animation: repoPortalPulse 4.2s ease-in-out infinite; }
      .portal.has-hot .portal-node { animation-duration: 2.4s; }
      .portal.has-drift .portal-node { stroke: #ef798a; stroke-dasharray: 2 3; }
      .series-filter button.has-recent { opacity: .9; }
      .series-filter button.has-drift { border-style: dashed; border-color: #ef798a; }
      .philosophy-audit.is-live { color: #626873; }
      .philosophy-audit.has-drift { color: #a86670; }
      @keyframes repoPulse {
        0%,100% { opacity: .28; transform: scale(.82); }
        50% { opacity: 1; transform: scale(1.18); }
      }
      @keyframes repoPortalPulse {
        0%,100% { transform: scale(1); }
        50% { transform: scale(1.09); }
      }
      @media (prefers-reduced-motion: reduce) {
        .repo-motion,
        .repo-sync-indicator,
        .portal.has-recent .portal-node { animation: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function cacheRead(key, ttl) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.savedAt || Date.now() - parsed.savedAt > ttl) return null;
      return parsed.value;
    } catch (error) {
      return null;
    }
  }

  function cacheWrite(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value }));
    } catch (error) {
      // Tracking is optional; storage failure must not break the calling card.
    }
  }

  async function fetchJSON(url) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 9000);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      window.clearTimeout(timer);
    }
  }

  function ageClass(dateValue) {
    if (!dateValue) return "quiet";
    const age = Math.max(0, (Date.now() - new Date(dateValue).getTime()) / 86400000);
    if (age <= 1) return "hot";
    if (age <= 7) return "recent";
    return "quiet";
  }

  function shortDate(dateValue) {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  }

  function normalizedMessage(value) {
    return String(value || "").split("\n")[0].trim();
  }

  function auditEntry(repo) {
    return repositoryAudit?.active?.find((item) => item.repo === repo) || null;
  }

  async function loadRepositoryAudit() {
    if (repositoryAudit) return repositoryAudit;
    try {
      const response = await fetch("repo-audit.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      repositoryAudit = await response.json();
    } catch (error) {
      repositoryAudit = { active: [] };
    }
    return repositoryAudit;
  }

  function ingestMotion(records) {
    repoMotion.clear();
    records.forEach((repo) => {
      repoMotion.set(repo.name, {
        repo: repo.name,
        defaultBranch: repo.default_branch || "main",
        pushedAt: repo.pushed_at || repo.updated_at || null,
        updatedAt: repo.updated_at || null,
        url: repo.html_url || `https://github.com/${OWNER}/${repo.name}`,
        activity: ageClass(repo.pushed_at || repo.updated_at)
      });
    });
    motionLoaded = true;
    applyTracking();
  }

  async function loadRepositoryMotion(force = false) {
    if (motionPromise && !force) return motionPromise;
    motionPromise = (async () => {
      if (!force) {
        const cached = cacheRead(LIST_CACHE_KEY, LIST_CACHE_MS);
        if (Array.isArray(cached)) {
          ingestMotion(cached);
          return cached;
        }
      }

      try {
        const raw = await fetchJSON(`https://api.github.com/users/${OWNER}/repos?per_page=100&type=owner&sort=updated`);
        const records = raw
          .filter((repo) => repo.owner?.login === OWNER && !repo.fork)
          .map((repo) => ({
            name: repo.name,
            default_branch: repo.default_branch,
            pushed_at: repo.pushed_at,
            updated_at: repo.updated_at,
            html_url: repo.html_url,
            owner: { login: repo.owner?.login },
            fork: repo.fork
          }));
        cacheWrite(LIST_CACHE_KEY, records);
        ingestMotion(records);
        return records;
      } catch (error) {
        motionLoaded = true;
        applyTracking();
        return [];
      } finally {
        motionPromise = null;
      }
    })();
    return motionPromise;
  }

  async function mapLimit(items, limit, worker) {
    const results = new Array(items.length);
    let cursor = 0;

    async function runner() {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        try {
          results[index] = await worker(items[index], index);
        } catch (error) {
          results[index] = null;
        }
      }
    }

    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runner));
    return results;
  }

  function ingestReadmeChecks(records) {
    readmeChecks.clear();
    records.filter(Boolean).forEach((item) => readmeChecks.set(item.repo, item));
    readmeAuditLoaded = true;
    applyTracking();
  }

  async function auditAllReadmes(force = false) {
    if (readmeAuditPromise && !force) return readmeAuditPromise;
    readmeAuditPromise = (async () => {
      await Promise.all([loadRepositoryAudit(), loadRepositoryMotion()]);

      if (!force) {
        const cached = cacheRead(README_CACHE_KEY, README_CACHE_MS);
        if (Array.isArray(cached)) {
          ingestReadmeChecks(cached);
          return cached;
        }
      }

      const active = repositoryAudit?.active || [];
      const records = await mapLimit(active, 4, async (entry) => {
        const meta = repoMotion.get(entry.repo);
        const branch = meta?.defaultBranch || "main";
        const url = `https://api.github.com/repos/${OWNER}/${encodeURIComponent(entry.repo)}/readme?ref=${encodeURIComponent(branch)}`;
        try {
          const readme = await fetchJSON(url);
          return {
            repo: entry.repo,
            readmeSha: readme.sha || null,
            auditedReadmeSha: entry.readme_blob || null,
            drift: Boolean(readme.sha && entry.readme_blob && readme.sha !== entry.readme_blob),
            checkedAt: new Date().toISOString()
          };
        } catch (error) {
          return {
            repo: entry.repo,
            readmeSha: null,
            auditedReadmeSha: entry.readme_blob || null,
            drift: false,
            unavailable: true,
            checkedAt: new Date().toISOString()
          };
        }
      });

      cacheWrite(README_CACHE_KEY, records);
      ingestReadmeChecks(records);
      return records;
    })().finally(() => {
      readmeAuditPromise = null;
    });
    return readmeAuditPromise;
  }

  async function loadRepoDetail(repo) {
    if (repoDetails.has(repo)) return repoDetails.get(repo);

    const cached = cacheRead(`${DETAIL_CACHE_PREFIX}${repo}`, DETAIL_CACHE_MS);
    if (cached) {
      repoDetails.set(repo, cached);
      return cached;
    }

    await Promise.all([loadRepositoryAudit(), loadRepositoryMotion()]);
    const motion = repoMotion.get(repo);
    const branch = motion?.defaultBranch || "main";
    const readmeKnown = readmeChecks.get(repo);

    const [commitResult, readmeResult] = await Promise.allSettled([
      fetchJSON(`https://api.github.com/repos/${OWNER}/${encodeURIComponent(repo)}/commits/${encodeURIComponent(branch)}`),
      readmeKnown
        ? Promise.resolve({ sha: readmeKnown.readmeSha })
        : fetchJSON(`https://api.github.com/repos/${OWNER}/${encodeURIComponent(repo)}/readme?ref=${encodeURIComponent(branch)}`)
    ]);

    const commit = commitResult.status === "fulfilled" ? commitResult.value : null;
    const readme = readmeResult.status === "fulfilled" ? readmeResult.value : null;
    const audit = auditEntry(repo);
    const readmeSha = readme?.sha || readmeKnown?.readmeSha || null;
    const readmeUnavailable = Boolean(readmeKnown?.unavailable || readmeResult.status !== "fulfilled");
    const drift = Boolean(readmeSha && audit?.readme_blob && readmeSha !== audit.readme_blob);

    const result = {
      repo,
      branch,
      headSha: commit?.sha || null,
      headDate: commit?.commit?.committer?.date || commit?.commit?.author?.date || motion?.pushedAt || null,
      headMessage: normalizedMessage(commit?.commit?.message),
      commitUrl: commit?.html_url || motion?.url || `https://github.com/${OWNER}/${repo}`,
      readmeSha,
      readmeUnavailable,
      drift,
      activity: ageClass(commit?.commit?.committer?.date || commit?.commit?.author?.date || motion?.pushedAt),
      checkedAt: new Date().toISOString()
    };

    repoDetails.set(repo, result);
    readmeChecks.set(repo, {
      repo,
      readmeSha,
      auditedReadmeSha: audit?.readme_blob || null,
      drift,
      unavailable: readmeUnavailable,
      checkedAt: result.checkedAt
    });
    cacheWrite(`${DETAIL_CACHE_PREFIX}${repo}`, result);
    applyTracking();
    return result;
  }

  function trackingTitle(node) {
    const full = repoDetails.get(node.id);
    const motion = repoMotion.get(node.id);
    const readme = readmeChecks.get(node.id);
    const date = shortDate(full?.headDate || motion?.pushedAt);
    const message = full?.headMessage || "";
    const parts = [labelOf(node), statusLabels[node.status] || node.status];
    if (date) parts.push(date);
    if (message) parts.push(message);
    if (readme?.drift || full?.drift) parts.push("README ≠ audit");
    return parts.join(" · ");
  }

  function applyMarker(button, node) {
    const motion = repoMotion.get(node.id);
    const full = repoDetails.get(node.id);
    const readme = readmeChecks.get(node.id);
    const activity = full?.activity || motion?.activity || "quiet";
    const drift = Boolean(readme?.drift || full?.drift);
    const unavailable = Boolean(readme?.unavailable || full?.readmeUnavailable);

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

    const title = trackingTitle(node);
    button.title = title;
    button.setAttribute("aria-label", title);
  }

  function enhanceNodeList() {
    nodeList.querySelectorAll("button").forEach((button) => {
      const buttonLabel = button.firstChild?.textContent?.trim() || button.textContent.trim();
      const node = data.nodes.find((item) => labelOf(item) === buttonLabel);
      if (!node) return;
      applyMarker(button, node);
    });
  }

  function enhanceDetail() {
    const heading = detail.querySelector("h3");
    if (!heading) return;

    const node = data.nodes.find((item) => labelOf(item) === heading.textContent.trim());
    if (!node) return;

    const motion = repoMotion.get(node.id);
    const full = repoDetails.get(node.id);
    const readme = readmeChecks.get(node.id);
    const activity = full?.activity || motion?.activity || "quiet";
    const drift = Boolean(full?.drift || readme?.drift);
    const unavailable = Boolean(full?.readmeUnavailable || readme?.unavailable);
    let indicator = detail.querySelector(".repo-sync-indicator");

    if (!indicator) {
      indicator = document.createElement("a");
      indicator.className = "repo-sync-indicator";
      indicator.target = "_blank";
      indicator.rel = "noreferrer";
      const statusDot = detail.querySelector(".detail-status");
      if (statusDot) statusDot.after(indicator);
      else heading.after(indicator);
    }

    indicator.classList.toggle("is-recent", activity === "recent" || activity === "hot");
    indicator.classList.toggle("has-drift", drift);
    indicator.classList.toggle("is-unavailable", unavailable);
    indicator.href = full?.commitUrl || motion?.url || `https://github.com/${OWNER}/${node.id}`;
    indicator.title = trackingTitle(node);
    indicator.setAttribute("aria-label", indicator.title);

    if (!repoDetails.has(node.id) && !indicator.dataset.loading) {
      indicator.dataset.loading = "true";
      loadRepoDetail(node.id).finally(() => {
        indicator.removeAttribute("data-loading");
        enhanceDetail();
      });
    }
  }

  function applySeriesTracking() {
    Object.keys(data.series).forEach((series) => {
      const records = data.nodes
        .filter((node) => node.series === series)
        .map((node) => ({
          motion: repoMotion.get(node.id),
          detail: repoDetails.get(node.id),
          readme: readmeChecks.get(node.id)
        }));
      const hot = records.some((item) => (item.detail?.activity || item.motion?.activity) === "hot");
      const recent = hot || records.some((item) => (item.detail?.activity || item.motion?.activity) === "recent");
      const drift = records.some((item) => item.detail?.drift || item.readme?.drift);

      document.querySelectorAll(`[data-series="${series}"], [data-portal="${series}"]`).forEach((element) => {
        element.classList.toggle("has-hot", hot);
        element.classList.toggle("has-recent", recent);
        element.classList.toggle("has-drift", drift);
      });
    });
  }

  function applyAuditSummary() {
    const element = document.querySelector(".philosophy-audit");
    if (!element) return;

    const activeCount = repositoryAudit?.active?.length || data.nodes.length;
    const recentCount = data.nodes.filter((node) => {
      const activity = repoDetails.get(node.id)?.activity || repoMotion.get(node.id)?.activity;
      return activity === "hot" || activity === "recent";
    }).length;
    const driftCount = data.nodes.filter((node) => repoDetails.get(node.id)?.drift || readmeChecks.get(node.id)?.drift).length;
    const unavailableCount = data.nodes.filter((node) => repoDetails.get(node.id)?.readmeUnavailable || readmeChecks.get(node.id)?.unavailable).length;

    element.classList.toggle("is-live", motionLoaded);
    element.classList.toggle("has-drift", driftCount > 0);
    element.textContent = readmeAuditLoaded
      ? `${activeCount} · ↻${recentCount} · Δ${driftCount}${unavailableCount ? ` · ?${unavailableCount}` : ""}`
      : `${activeCount} · ↻${recentCount}`;
    element.href = "repo-audit.json";
    element.title = readmeAuditLoaded
      ? `${activeCount} tracked · ${recentCount} recent · ${driftCount} README drift · ${unavailableCount} unavailable`
      : `${activeCount} tracked · ${recentCount} recent · README audit opens with philosophy`;
    element.setAttribute("aria-label", element.title);
  }

  function applyTracking() {
    enhanceNodeList();
    enhanceDetail();
    applySeriesTracking();
    applyAuditSummary();
  }

  document.querySelectorAll("[data-philosophy]").forEach((trigger) => {
    trigger.addEventListener("click", () => auditAllReadmes());
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") auditAllReadmes();
    });
  });

  new MutationObserver(enhanceDetail).observe(detail, { childList: true, subtree: true });
  new MutationObserver(enhanceNodeList).observe(nodeList, { childList: true, subtree: true });

  loadRepositoryAudit().then(applyTracking);
  loadRepositoryMotion();
  enhanceDetail();
  enhanceNodeList();
})();