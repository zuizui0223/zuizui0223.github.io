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
  if(defs&&!defs.querySelector("#coreArrow")){
    defs.insertAdjacentHTML("beforeend",`<marker id="coreArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#d9d0aa"/></marker>`);
  }

  const existing=svg.querySelector(".cross-core-layer");
  if(existing)existing.remove();
  const particles=svg.querySelector(".particles");
  if(!particles)return;

  const routes=[
    {id:"flower-island",cls:"shared",d:"M500 294C520 272 548 284 560 320",symbol:"≈",x:532,y:286,title:"hotarubukuro ↔ izu-core · shared empirical substrate",markers:"both"},
    {id:"island-ecogenetic",cls:"shared",d:"M560 320C625 350 620 420 548 438",symbol:"≈",x:615,y:382,title:"izu-core ↔ EGWEE · shared Honshu–Izu substrate",markers:"both"},
    {id:"observation-ecogenetic",cls:"epistemic",d:"M566 408C566 424 558 435 548 438",symbol:"⇢",x:568,y:429,title:"TNOA → EGWEE · record semantics before state admission",markers:"end"},
    {id:"ecogenetic-theory",cls:"epistemic",d:"M548 438C520 472 470 466 445 410",symbol:"⇢",x:496,y:460,title:"EGWEE → CED · state adequacy before reportability",markers:"end"},
    {id:"interaction-method",cls:"abstraction",d:"M570 360C610 395 570 444 510 442",symbol:"⇢",x:575,y:413,title:"BITA → Boundary → MROD · mechanism set to identification and next measurement",markers:"end"},
    {id:"method-niche",cls:"complement",d:"M510 442C470 472 415 430 430 365",symbol:"⇄",x:462,y:449,title:"MROD ↔ ACSP · WHAT to measure / WHERE to look",markers:"both"},
    {id:"niche-azami",cls:"information",d:"M430 365C418 345 426 330 446 324",symbol:"⇄",x:424,y:343,title:"ACSP ↔ aza3 · search patch / biological sampling slot",markers:"both"}
  ];

  const markup=routes.map(r=>{
    const ms=r.markers==="both"?' marker-start="url(#coreArrow)" marker-end="url(#coreArrow)"':r.markers==="end"?' marker-end="url(#coreArrow)"':'';
    return `<g class="core-bridge-group" data-core-bridge="${r.id}"><title>${r.title}</title><path class="core-bridge ${r.cls}" d="${r.d}"${ms}/><path class="core-bridge-hit" d="${r.d}"/><text class="core-bridge-symbol" x="${r.x}" y="${r.y}">${r.symbol}</text></g>`;
  }).join("");
  const junctions=[[500,294],[560,320],[566,408],[548,438],[445,410],[570,360],[510,442],[430,365],[446,324]].map(([x,y])=>`<circle class="core-junction" cx="${x}" cy="${y}" r="2.5"/>`).join("");
  particles.insertAdjacentHTML("beforebegin",`<g class="cross-core-layer" aria-label="cross-core scientific bridges">${markup}${junctions}</g>`);

  const desc=document.getElementById("brain-desc");
  if(desc)desc.textContent="研究核を放射状に置き、花色↔島、生態遺伝↔島/観測/理論、相互作用→方法、方法↔ニッチ↔アザミの主要横断bridgeを内側の横線として示す研究宇宙。";
})();
