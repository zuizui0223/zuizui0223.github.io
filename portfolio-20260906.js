(function(){
"use strict";
const data=window.WORLDLINES;if(!data)return;
const find=id=>data.nodes.find(x=>x.id===id);
const upsert=(id,v)=>{let x=find(id);if(!x){x={id,...v};data.nodes.push(x)}else Object.assign(x,v);return x};
const uniq=a=>[...new Set(a)];

const balance=find("balance");if(balance){delete balance.scientificRef;delete balance.sourceUrl;
  balance.summary="Chapter 2 / middle world。PR #2 は main に merge 済み。L>0 だが differentiated architecture の net margin はまだ負。";
}

const v3=upsert("v3",{label:"V3",series:"observation",x:.61,y:.72,status:"bounded",
 layers:["reference-guided refinement","set-valued inference","reversible decomposition","observation method","ecosystem system"],
 pulse:"参照情報は、引き算の許可ではなく compatible set を縮める根拠になる。",
 summary:"PolliPi 由来だが独立した general observation-method line。valid reference refinement は compatible target set を縮め、deterministic coarsening は拡げる。physical reference の informativeness は domain ごとに別検証が必要。",
 ceiling:"新しい物理ドメインで reference が informative / causal と、calibration と structural assumptions なしに主張しない。",
 next:"frozen physical-reference domain で calibration と external validation を行う。",
 systemRole:"record/measurement · reference-guided information refinement"});
const payoff=upsert("payoff",{label:"PAYOFF",series:"interaction",x:.34,y:.94,status:"result",
 layers:["evolutionary game","replicator dynamics","architecture invasion","frequency dependence","network modularization","ecosystem system"],
 pulse:"static architecture advantage ≠ invasion success.",
 summary:"SCH–BALANCE–BITA の L, R=sL, K, Φ を population-game level へ持ち上げる。η<0 は coexistence、η>0 は coordination barrier を作り得て、static Φ の符号だけでは invasion outcome が決まらない。",
 ceiling:"自然データで η / reciprocal invasion thresholds を推定する前に natural frequency dependence、historical switching、field ESS を確定しない。",
 next:"matched architecture fitness data が得られる系で reciprocal thresholds / frequency feedback を検証する。",
 systemRole:"state/evolution · population-game abstraction over SCH/BALANCE/BITA"});

data.stories.interaction={...(data.stories.interaction||{}),label:"相互作用",axiom:"葛藤 ≠ 即分化",
 nodes:["sch","balance","bita","payoff"],
 text:"shared-coordinate compromise → persistent middle world → differentiated architecture。PAYOFF は三世界の payoff objects を population game に持ち上げる abstraction であり、第4章ではない。",
 displayPath:"SCH → BALANCE → BITA  ⋯  PAYOFF"};
data.stories.observation={...(data.stories.observation||{}),
 nodes:["pollipi","insepi","v3","rec","tnoa"],
 text:"physical record / diagnosis と、reference refinement → record entry → post-entry semantics を別の typed relations として保つ。",
 displayPath:"PolliPi → InsePi · PolliPi ⋯ V3 ⇢ REC → TNOA"};

const pairs=new Set(["pollipi|v3","v3|rec","sch|payoff","balance|payoff","bita|payoff"]);
data.edges=(data.edges||[]).filter(e=>!pairs.has(`${e.from}|${e.to}`));
data.edges.push(
 {from:"pollipi",to:"v3",type:"dotted",relation:"provenance",label:"PolliPi V3 lineage → general reference-refinement method"},
 {from:"v3",to:"rec",type:"dashed",relation:"epistemic",label:"retained reference information → record-entry support selection"},
 {from:"sch",to:"payoff",type:"dotted",relation:"abstraction",label:"conflict load L → architecture game payoff"},
 {from:"balance",to:"payoff",type:"dotted",relation:"abstraction",label:"middle-world margin Φ → invasion game"},
 {from:"bita",to:"payoff",type:"dotted",relation:"abstraction",label:"R,K architecture gain → population-game layer"}
);
if(data.stories?.ecosystem){
 data.stories.ecosystem.nodes=uniq([...(data.stories.ecosystem.nodes||[]),"v3","payoff"]);
 data.stories.ecosystem.text="33 active scientific repositories を一つの ecological research system に置く。series ownership と evidence-mode overlap を混同しない。";
}
(data.axes||[]).forEach(a=>{
 if(["観測","方法","理論"].includes(a.name)&&!a.repos.includes("v3"))a.repos.push("v3");
 if(["パターン","メカニズム","理論"].includes(a.name)&&!a.repos.includes("payoff"))a.repos.push("payoff");
});
const addBook=(books,book,after)=>{if(!books||books.some(x=>x.repos?.[0]===book.repos[0]))return;
 const i=books.findIndex(x=>x.repos?.[0]===after);if(i>=0)books.splice(i+1,0,book);else books.push(book)};
addBook(data.books?.seven,{n:"O5",title:"V3 — reference-guided refinement",chapters:1,series:"observation",repos:["v3"],note:"reference information / compatible-set refinement",status:"bounded"},"insepi");
addBook(data.books?.seven,{n:"BG",title:"PAYOFF — architecture game",chapters:1,series:"interaction",repos:["payoff"],note:"cross-chapter game abstraction · not Chapter 4",status:"result"},"bita");
addBook(data.books?.eight,{n:"",title:"V3 — reference-guided refinement",chapters:1,series:"observation",repos:["v3"],note:"what can side information refine?",status:"bounded"},"insepi");
addBook(data.books?.eight,{n:"",title:"PAYOFF — architecture game",chapters:1,series:"interaction",repos:["payoff"],note:"static advantage versus invasion success",status:"result"},"bita");
(data.books?.eight||[]).forEach((b,i)=>b.n=String(i+1));

data.graphMeta={...(data.graphMeta||{}),version:"2026-09-06-evidence-partition-v1",
 portfolioRefresh:{activeScientificRepositories:33,ownerRepositories:35,newRepositories:["v3","payoff"],staging:["284b"],
 interactionProgramme:"SCH → BALANCE → BITA · PAYOFF abstraction",observationExtension:"PolliPi ⋯ V3 ⇢ REC → TNOA",
 evidencePartition:"T ∩ M ∩ P ∩ O",firewall:"shared evidence mode != scientific dependency; connection != ownership"}};
window.ZUIZUI_THOUGHTS=window.ZUIZUI_THOUGHTS||{};
window.ZUIZUI_THOUGHTS.v3={line:v3.pulse,move:v3.summary,keeps:"compatible sets / reference provenance / reversible decomposition",refuses:v3.ceiling};
window.ZUIZUI_THOUGHTS.payoff={line:payoff.pulse,move:payoff.summary,keeps:"Φ, η, invasion surfaces, coexistence/coordination",refuses:payoff.ceiling};
const auditLink=document.querySelector(".philosophy-audit");if(auditLink){auditLink.textContent="33 · static";auditLink.title="33 active scientific repositories · 1 staging repository"}
const brain=document.getElementById("brain-desc");if(brain)brain.textContent="33のactive scientific repositoriesを一つの生態系として配置し、typed relationsと数理・方法・公開データ・own/new dataの重なりを別レンズで示す研究地図。";

const tabs=document.querySelector(".view-tabs");
if(tabs&&!tabs.querySelector('[data-view="evidence"]')){const b=document.createElement("button");b.className="view-tab";b.type="button";b.role="tab";b.dataset.view="evidence";b.setAttribute("aria-selected","false");b.setAttribute("aria-label","evidence composition");b.title="evidence overlap";b.textContent="∩";tabs.appendChild(b)}
const atlas=document.getElementById("atlas");let panel=document.getElementById("evidenceView");
if(atlas&&!panel){panel=document.createElement("div");panel.id="evidenceView";panel.className="view-panel";panel.role="tabpanel";panel.hidden=true;
 panel.innerHTML=`<section class="evidence-partition-shell" aria-labelledby="evidencePartitionTitle">
 <header class="evidence-partition-head"><div><span class="evidence-kicker">EVIDENCE COMPOSITION · 33 ACTIVE</span><h2 id="evidencePartitionTitle">重なる研究モード</h2>
 <p>理論 / 方法 / 公開データ / own-new data を一意分類せず、重なったまま置く。楕円面積は explained variance や価値を表さない。</p></div>
 <a class="evidence-audit-link" href="evidence-partition-audit.json">audit ↗</a></header>
 <div id="evidenceLegend" class="evidence-legend"></div><div class="evidence-partition-layout"><div class="evidence-venn-wrap">
 <svg id="evidencePartitionSvg" class="evidence-venn" viewBox="0 0 920 560" role="img" aria-label="overlapping evidence and inference modes"></svg></div>
 <aside id="evidencePartitionDetail" class="evidence-partition-detail" aria-live="polite"></aside></div>
 <div class="evidence-strict-note"><strong>実データなし</strong><span>T のうち P / O に重ならない領域。現在は <code>T only</code> 8本 + <code>T∩M</code> 5本。</span></div>
 <div id="evidenceIntersectionGrid" class="evidence-intersection-grid"></div></section>`;atlas.appendChild(panel)}

const esc=x=>String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const colors={T:"#a48af4",M:"#7cb7d6",P:"#e6b85c",O:"#e98191"};
const centers={T:[175,155],P:[170,440],O:[748,438],TM:[445,120],TP:[270,285],MP:[540,328],TMP:[430,240],TPO:[405,385],MO:[720,225],TMO:[585,180],MPO:[635,390]};
let partition=null;
const keyLabel=k=>k.split("").map(x=>partition.categories[x].label).join(" ∩ ");
const offset=i=>{if(!i)return[0,0];const a=i*2.399963229728653,r=11+11*Math.sqrt(i);return[Math.cos(a)*r,Math.sin(a)*r]};
function detailRepo(repo){const e=partition.entries.find(x=>x.repo===repo),h=document.getElementById("evidencePartitionDetail");if(!e||!h)return;
 const badges=e.key.split("").map(k=>`<span class="evidence-badge" style="--mode-color:${colors[k]}">${k} · ${esc(partition.categories[k].label)}</span>`).join("");
 h.innerHTML=`<span class="evidence-detail-key">${esc(e.key)}</span><h3>${esc(e.repo)}</h3><div class="evidence-detail-badges">${badges}</div><p>${esc(e.rationale)}</p><small>${esc(e.status)}</small><a href="https://github.com/zuizui0223/${encodeURIComponent(e.repo)}" target="_blank" rel="noreferrer">source ↗</a>`;
 document.querySelectorAll("[data-evidence-repo]").forEach(x=>x.classList.toggle("is-selected",x.dataset.evidenceRepo===repo))}
function renderPartition(){
 const legend=document.getElementById("evidenceLegend"),svg=document.getElementById("evidencePartitionSvg"),grid=document.getElementById("evidenceIntersectionGrid"),det=document.getElementById("evidencePartitionDetail");if(!legend||!svg||!grid||!det)return;
 legend.innerHTML=["T","M","P","O"].map(k=>`<span style="--mode-color:${colors[k]}"><i></i><b>${k}</b> ${esc(partition.categories[k].label)} <em>${partition.categories[k].count}</em></span>`).join("");
 const E=[["T",340,220,290,175,-9],["M",570,220,270,165,8],["P",350,355,285,170,8],["O",585,365,260,165,-7]];
 const shapes=E.map(([k,cx,cy,rx,ry,rot])=>`<g class="evidence-set"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" style="--mode-color:${colors[k]}"/><text x="${cx}" y="${cy-ry+30}" class="evidence-set-label" style="--mode-color:${colors[k]}">${k} · ${esc(partition.categories[k].label)} · ${partition.categories[k].count}</text></g>`).join("");
 const groups={};partition.entries.forEach(e=>(groups[e.key]??=[]).push(e));const pts=[];
 Object.entries(groups).forEach(([k,es])=>es.forEach((e,i)=>{const [dx,dy]=offset(i),[cx,cy]=centers[k]||[460,280],x=cx+dx,y=cy+dy;
  const sat=e.key.split("").map((m,j)=>{const a=2*Math.PI*j/e.key.length-Math.PI/2;return`<circle cx="${(x+Math.cos(a)*8.5).toFixed(1)}" cy="${(y+Math.sin(a)*8.5).toFixed(1)}" r="2.2" fill="${colors[m]}"/>`}).join("");
  pts.push(`<g class="evidence-point" data-evidence-repo="${esc(e.repo)}" tabindex="0" role="button"><title>${esc(e.repo)} · ${esc(keyLabel(k))}</title><circle class="evidence-point-core" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.2"/>${sat}</g>`)}));
 svg.innerHTML=shapes+`<g>${pts.join("")}</g>`;
 svg.querySelectorAll("[data-evidence-repo]").forEach(el=>{const f=()=>detailRepo(el.dataset.evidenceRepo);el.onclick=f;el.onkeydown=ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();f()}}});
 grid.innerHTML=partition.intersections.map(g=>`<article class="evidence-intersection-card"><header><code>${esc(g.key)}</code><span>${g.count}</span></header><p>${esc(keyLabel(g.key))}</p><div>${g.repos.map(r=>`<button type="button" data-evidence-repo="${esc(r)}">${esc(r)}</button>`).join("")}</div></article>`).join("");
 grid.querySelectorAll("[data-evidence-repo]").forEach(b=>b.onclick=()=>detailRepo(b.dataset.evidenceRepo));
 det.innerHTML=`<span class="evidence-detail-key">T ∩ M ∩ P ∩ O</span><h3>33 scientific repositories</h3><p>点は exact membership ごとに配置。楕円は模式図で、厳密な集合は cards と audit JSON が source of truth。</p><small>35 total · 1 meta · 1 staging</small>`;
}
fetch("evidence-partition-audit.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error(`audit ${r.status}`);return r.json()}).then(a=>{
 const map={theory_simulation:"T",methods:"M",public_data:"P",own_new_data:"O"},cats={};Object.entries(a.categories).forEach(([n,m])=>cats[map[n]]={label:m.label,count:a.set_counts[n]});
 partition={categories:cats,intersections:a.exact_intersections,entries:a.entries.map(e=>({repo:e.repo,key:e.exact_key,rationale:e.rationale,status:e.status}))};renderPartition()
}).catch(err=>{const h=document.getElementById("evidencePartitionDetail");if(h)h.innerHTML=`<h3>evidence audit unavailable</h3><p>${esc(err.message)}</p>`});
})();
