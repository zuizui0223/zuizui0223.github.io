(function(){
  "use strict";
  const svg=document.querySelector(".brain-art");
  const portals=document.querySelector(".portals");
  if(!svg||!portals)return;

  const old=portals.querySelector('[data-cross-bridge="aza3-acsp"]');
  if(old)old.remove();

  if(!portals.querySelector('[data-portal="ecogenetic"]')){
    portals.insertAdjacentHTML("beforeend",`<g class="portal portal-ecogenetic" data-portal="ecogenetic" tabindex="0" role="button" aria-label="生態遺伝"><title>生態遺伝</title><path id="portal-ecogenetic" class="portal-line" d="M548 438C590 505 638 592 700 650"/><path class="portal-hit" d="M548 438C590 505 638 592 700 650"/><circle class="portal-node" cx="700" cy="650" r="18"/><text x="700" y="655">↯</text></g>`);
  }

  const defs=svg.querySelector("defs");
  if(defs&&!defs.querySelector("#coreArrowStrong")){
    defs.insertAdjacentHTML("beforeend",`<marker id="coreArrowStrong" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="#f0ead7" stroke="#08090c" stroke-width="1.2"/></marker>`);
  }

  const existing=svg.querySelector(".cross-core-layer");
  if(existing)existing.remove();

  // Outer-ring network: the bridges connect the visible cores directly rather than
  // disappearing into the central void. Paths stay outside the black centre.
  const routes=[
    {id:"flower-island",cls:"shared",d:"M538 78C625 34 758 47 826 118",label:"substrate",x:686,y:54,title:"hotarubukuro ↔ izu-core · shared empirical substrate",markers:"none"},
    {id:"island-ecogenetic",cls:"shared",d:"M850 144C930 274 905 525 718 638",label:"substrate",x:895,y:365,title:"izu-core ↔ EGWEE · shared Honshu–Izu substrate",markers:"none"},
    {id:"observation-ecogenetic",cls:"epistemic",d:"M838 600C806 630 760 650 720 650",label:"record → state",x:780,y:634,title:"TNOA → EGWEE · record semantics before state admission",markers:"end"},
    {id:"ecogenetic-theory",cls:"epistemic",d:"M682 652C568 704 315 694 183 604",label:"state → claim",x:432,y:681,title:"EGWEE → CED · state adequacy before reportability",markers:"end"},
    {id:"interaction-method",cls:"abstraction",d:"M900 374C862 515 720 642 520 657",label:"identify → design",x:742,y:588,title:"BITA → Boundary → MROD · mechanism set to identification and next measurement",markers:"end"},
    {id:"method-niche",cls:"complement",d:"M482 660C314 706 132 580 104 374",label:"WHAT ⇄ WHERE",x:257,y:625,title:"MROD ↔ ACSP · WHAT to measure / WHERE to look",markers:"both"},
    {id:"niche-azami",cls:"information",d:"M88 338C89 246 119 177 174 143",label:"search ⇄ field",x:111,y:236,title:"ACSP ↔ aza3 · search patch / biological sampling slot",markers:"both"}
  ];

  const labelMarkup=r=>{
    const width=Math.max(76,r.label.length*8.2+20);
    const x=(r.x-width/2).toFixed(1);
    return `<rect class="core-bridge-label-bg" x="${x}" y="${(r.y-13).toFixed(1)}" width="${width.toFixed(1)}" height="26"/><text class="core-bridge-label" x="${r.x}" y="${r.y}">${r.label}</text>`;
  };

  const markup=routes.map(r=>{
    const ms=r.markers==="both"?' marker-start="url(#coreArrowStrong)" marker-end="url(#coreArrowStrong)"':r.markers==="end"?' marker-end="url(#coreArrowStrong)"':'';
    return `<g class="core-bridge-group" data-core-bridge="${r.id}"><title>${r.title}</title><path class="core-bridge-halo" d="${r.d}"/><path class="core-bridge ${r.cls}" d="${r.d}"${ms}/><path class="core-bridge-hit" d="${r.d}"/>${labelMarkup(r)}</g>`;
  }).join("");

  const junctions=[[538,78],[826,118],[850,144],[718,638],[838,600],[720,650],[682,652],[183,604],[900,374],[520,657],[482,660],[104,374],[88,338],[174,143]]
    .map(([x,y])=>`<circle class="core-junction" cx="${x}" cy="${y}" r="4"/>`).join("");

  portals.insertAdjacentHTML("beforebegin",`<g class="cross-core-layer" aria-label="cross-core scientific bridges">${markup}${junctions}</g>`);

  const desc=document.getElementById("brain-desc");
  if(desc)desc.textContent="研究核を放射状に置き、外周の太い横断線で花色↔島↔生態遺伝、観測→生態遺伝→理論、相互作用→方法↔ニッチ↔アザミを直接つないだ研究宇宙。";
})();
