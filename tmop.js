(function(){
"use strict";
const oldTab=document.querySelector('[data-view="evidence"]');if(oldTab)oldTab.remove();
const oldPanel=document.getElementById("evidenceView");if(oldPanel)oldPanel.remove();
const tabs=document.querySelector(".view-tabs");
if(!tabs)return;
let tab=tabs.querySelector('[data-view="tmop"]');
if(!tab){tab=document.createElement("button");tab.className="view-tab tmop-tab";tab.type="button";tab.role="tab";tab.dataset.view="tmop";tab.setAttribute("aria-selected","false");tab.setAttribute("aria-label","TMOP");tab.title="TMOP";tab.textContent="TMOP";tabs.appendChild(tab)}
const atlas=document.getElementById("atlas");if(!atlas)return;
let panel=document.getElementById("tmopView");
if(!panel){panel=document.createElement("div");panel.id="tmopView";panel.className="view-panel";panel.role="tabpanel";panel.hidden=true;panel.innerHTML=`
<section class="evidence-partition-shell tmop-shell" aria-labelledby="tmopTitle">
<header class="evidence-partition-head tmop-head"><div><span class="evidence-kicker">33 ACTIVE</span><h2 id="tmopTitle">TMOP</h2></div><a class="evidence-audit-link" href="tmop-audit.json">audit ↗</a></header>
<div id="tmopLegend" class="evidence-legend tmop-legend"></div>
<div class="evidence-partition-layout"><div class="evidence-venn-wrap"><svg id="tmopSvg" class="evidence-venn" viewBox="0 0 920 560" role="img" aria-label="TMOP world"></svg></div><aside id="tmopDetail" class="evidence-partition-detail tmop-detail" aria-live="polite"></aside></div>
<div id="tmopGrid" class="evidence-intersection-grid tmop-grid"></div>
</section>`;atlas.appendChild(panel)}
const style=document.createElement("style");style.textContent=`
.view-tab.tmop-tab{font-size:8px;letter-spacing:.04em;padding-inline:5px}
.tmop-head{align-items:center}.tmop-head h2{font-size:clamp(28px,5vw,58px);letter-spacing:.16em;margin:0}.tmop-head .evidence-kicker{opacity:.55}.tmop-legend span{font-size:12px}.tmop-detail p,.tmop-detail small,.tmop-grid p,.evidence-strict-note{display:none!important}.tmop-detail{min-height:150px}.tmop-detail h3{margin:.35rem 0}.tmop-grid .evidence-intersection-card{padding:.65rem}.tmop-grid .evidence-intersection-card header{margin-bottom:.4rem}.tmop-shell .evidence-set-label{font-weight:700;letter-spacing:.08em}
`;document.head.appendChild(style);
const colors={T:"#a48af4",M:"#7cb7d6",O:"#e6b85c",P:"#e98191"};
const centers={T:[175,155],O:[170,440],P:[748,438],TM:[445,120],TO:[270,285],MO:[540,328],TMO:[430,240],TOP:[405,385],MP:[720,225],TMP:[585,180],MOP:[635,390]};
const ellipses=[["T",340,220,290,175,-9],["M",570,220,270,165,8],["O",350,355,285,170,8],["P",585,365,260,165,-7]];
const esc=x=>String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const offset=i=>{if(!i)return[0,0];const a=i*2.399963229728653,r=11+11*Math.sqrt(i);return[Math.cos(a)*r,Math.sin(a)*r]};
let audit=null;
function selectRepo(repo){const key=audit.entries[repo],d=document.getElementById("tmopDetail");if(!key||!d)return;d.innerHTML=`<span class="evidence-detail-key">${esc(key)}</span><h3>${esc(repo)}</h3><a href="https://github.com/zuizui0223/${encodeURIComponent(repo)}" target="_blank" rel="noreferrer">source ↗</a>`;document.querySelectorAll("[data-tmop-repo]").forEach(x=>x.classList.toggle("is-selected",x.dataset.tmopRepo===repo))}
function render(){const legend=document.getElementById("tmopLegend"),svg=document.getElementById("tmopSvg"),grid=document.getElementById("tmopGrid"),detail=document.getElementById("tmopDetail");if(!legend||!svg||!grid||!detail)return;
 legend.innerHTML=["T","M","O","P"].map(k=>`<span style="--mode-color:${colors[k]}"><i></i><b>${k}</b> ${audit.categories[k].label} <em>${audit.categories[k].count}</em></span>`).join("");
 const shapes=ellipses.map(([k,cx,cy,rx,ry,rot])=>`<g class="evidence-set"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" style="--mode-color:${colors[k]}"/><text x="${cx}" y="${cy-ry+30}" class="evidence-set-label" style="--mode-color:${colors[k]}">${k} · ${audit.categories[k].count}</text></g>`).join("");
 const points=[];audit.intersections.forEach(g=>g.repos.forEach((repo,i)=>{const [dx,dy]=offset(i),[cx,cy]=centers[g.key]||[460,280],x=cx+dx,y=cy+dy;const dots=g.key.split("").map((m,j)=>{const a=2*Math.PI*j/g.key.length-Math.PI/2;return`<circle cx="${(x+Math.cos(a)*8.5).toFixed(1)}" cy="${(y+Math.sin(a)*8.5).toFixed(1)}" r="2.2" fill="${colors[m]}"/>`}).join("");points.push(`<g class="evidence-point" data-tmop-repo="${esc(repo)}" tabindex="0" role="button"><title>${esc(repo)} · ${g.key}</title><circle class="evidence-point-core" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.2"/>${dots}</g>`)}));
 svg.innerHTML=shapes+`<g>${points.join("")}</g>`;svg.querySelectorAll("[data-tmop-repo]").forEach(el=>{const f=()=>selectRepo(el.dataset.tmopRepo);el.onclick=f;el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();f()}}});
 grid.innerHTML=audit.intersections.map(g=>`<article class="evidence-intersection-card"><header><code>${g.key}</code><span>${g.repos.length}</span></header><div>${g.repos.map(r=>`<button type="button" data-tmop-repo="${esc(r)}">${esc(r)}</button>`).join("")}</div></article>`).join("");grid.querySelectorAll("[data-tmop-repo]").forEach(b=>b.onclick=()=>selectRepo(b.dataset.tmopRepo));
 detail.innerHTML=`<span class="evidence-detail-key">T M O P</span><h3>33 repos</h3>`;
}
fetch("tmop-audit.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(x=>{audit=x;render()}).catch(()=>{});
})();
