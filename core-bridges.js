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
  if(defs&&!defs.querySelector("#webArrow")){
    defs.insertAdjacentHTML("beforeend",`<marker id="webArrow" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="#f3eedf" stroke="#08090c" stroke-width="1.2"/></marker>`);
  }

  svg.querySelector(".cross-core-layer")?.remove();

  const C={x:500,y:365};
  const cores=[
    {id:"flower",label:"花色",x:520,y:76},
    {id:"island",label:"島",x:844,y:126},
    {id:"interaction",label:"相互作用",x:918,y:362},
    {id:"observation",label:"観測",x:855,y:596},
    {id:"ecogenetic",label:"生態遺伝",x:700,y:650},
    {id:"method",label:"方法",x:500,y:657},
    {id:"theory",label:"理論",x:165,y:594},
    {id:"niche",label:"ニッチ",x:88,y:356},
    {id:"azami",label:"アザミ",x:179,y:126}
  ];
  const byId=Object.fromEntries(cores.map(c=>[c.id,c]));
  const pointAt=(p,s)=>({x:C.x+(p.x-C.x)*s,y:C.y+(p.y-C.y)*s});
  const poly=(pts)=>pts.map((p,i)=>`${i?"L":"M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("")+"Z";

  // Spiderweb scaffold: outer frame + three concentric polygon rings + radial spokes.
  const outer=poly(cores);
  const ringScales=[.76,.54,.32];
  const rings=ringScales.map((s,i)=>`<path class="web-ring web-ring-${i+1}" d="${poly(cores.map(p=>pointAt(p,s)))}"/>`).join("");
  const innerScale=.32;
  const spokes=cores.map(p=>{
    const q=pointAt(p,innerScale);
    return `<path class="web-spoke" data-web-core="${p.id}" d="M${p.x} ${p.y}L${q.x.toFixed(1)} ${q.y.toFixed(1)}"/>`;
  }).join("");
  const frame=`<path class="web-frame" d="${outer}"/>`;

  // Core labels sit just outside the web vertices. Keep the glyph portals as the interactive nodes.
  const labelOffsets={
    flower:[0,-31], island:[28,-9], interaction:[39,4], observation:[29,21], ecogenetic:[24,29],
    method:[0,36], theory:[-28,24], niche:[-34,3], azami:[-28,-14]
  };
  const coreLabels=cores.map(c=>{
    const [dx,dy]=labelOffsets[c.id]||[0,0];
    return `<text class="web-core-label web-core-label-${c.id}" x="${c.x+dx}" y="${c.y+dy}">${c.label}</text>`;
  }).join("");

  const curves={
    "flower-island":`M${byId.flower.x} ${byId.flower.y}Q680 25 ${byId.island.x} ${byId.island.y}`,
    "island-ecogenetic":`M${byId.island.x} ${byId.island.y}Q930 390 ${byId.ecogenetic.x} ${byId.ecogenetic.y}`,
    "observation-ecogenetic":`M${byId.observation.x} ${byId.observation.y}Q790 650 ${byId.ecogenetic.x} ${byId.ecogenetic.y}`,
    "ecogenetic-theory":`M${byId.ecogenetic.x} ${byId.ecogenetic.y}Q445 735 ${byId.theory.x} ${byId.theory.y}`,
    "interaction-method":`M${byId.interaction.x} ${byId.interaction.y}Q845 625 ${byId.method.x} ${byId.method.y}`,
    "method-niche":`M${byId.method.x} ${byId.method.y}Q225 720 ${byId.niche.x} ${byId.niche.y}`,
    "niche-azami":`M${byId.niche.x} ${byId.niche.y}Q78 210 ${byId.azami.x} ${byId.azami.y}`
  };

  const links=[
    {id:"flower-island",a:"flower",b:"island",type:"shared",tag:"same system",title:"hotarubukuro ↔ izu-core · shared empirical substrate",arrow:"none",tx:682,ty:43},
    {id:"island-ecogenetic",a:"island",b:"ecogenetic",type:"shared",tag:"same data",title:"izu-core ↔ EGWEE · shared Honshu–Izu substrate",arrow:"none",tx:902,ty:385},
    {id:"observation-ecogenetic",a:"observation",b:"ecogenetic",type:"epistemic",tag:"record → state",title:"TNOA → EGWEE · record semantics before state admission",arrow:"end",tx:782,ty:627},
    {id:"ecogenetic-theory",a:"ecogenetic",b:"theory",type:"epistemic",tag:"state → claim",title:"EGWEE → CED · state adequacy before reportability",arrow:"end",tx:432,ty:694},
    {id:"interaction-method",a:"interaction",b:"method",type:"abstraction",tag:"identify → design",title:"BITA → Boundary → MROD · mechanism set to identification and next measurement",arrow:"end",tx:743,ty:603},
    {id:"method-niche",a:"method",b:"niche",type:"complement",tag:"WHAT ⇄ WHERE",title:"MROD ↔ ACSP · WHAT to measure / WHERE to look",arrow:"both",tx:264,ty:650},
    {id:"niche-azami",a:"niche",b:"azami",type:"information",tag:"search ⇄ field",title:"ACSP ↔ aza3 · search patch / biological sampling slot",arrow:"both",tx:103,ty:235}
  ];

  const linkMarkup=links.map(l=>{
    const marker=l.arrow==="both"?' marker-start="url(#webArrow)" marker-end="url(#webArrow)"':l.arrow==="end"?' marker-end="url(#webArrow)"':'';
    const width=Math.max(72,l.tag.length*8+18);
    return `<g class="web-link-group web-link-${l.type}" data-core-bridge="${l.id}" data-core-a="${l.a}" data-core-b="${l.b}"><title>${l.title}</title><path class="web-link-halo" d="${curves[l.id]}"/><path class="web-link" d="${curves[l.id]}"${marker}/><path class="web-link-hit" d="${curves[l.id]}"/><rect class="web-link-label-bg" x="${(l.tx-width/2).toFixed(1)}" y="${(l.ty-12).toFixed(1)}" width="${width}" height="24"/><text class="web-link-label" x="${l.tx}" y="${l.ty}">${l.tag}</text></g>`;
  }).join("");

  // A small central polygon keeps the void legible while preserving the web metaphor.
  const inner=poly(cores.map(p=>pointAt(p,.22)));
  const centre=`<path class="web-inner-boundary" d="${inner}"/>`;

  portals.insertAdjacentHTML("beforebegin",`<g class="cross-core-layer spiderweb-layer" aria-label="spiderweb research network"><g class="web-scaffold">${frame}${rings}${spokes}${centre}</g><g class="web-scientific-links">${linkMarkup}</g><g class="web-core-labels">${coreLabels}</g></g>`);

  // Hovering a core makes only its scientific cross-links glow; the scaffold stays visible.
  cores.forEach(c=>{
    const portal=portals.querySelector(`[data-portal="${c.id}"]`);
    if(!portal)return;
    const on=()=>svg.querySelectorAll(`.web-link-group[data-core-a="${c.id}"],.web-link-group[data-core-b="${c.id}"]`).forEach(x=>x.classList.add("is-related"));
    const off=()=>svg.querySelectorAll(".web-link-group.is-related").forEach(x=>x.classList.remove("is-related"));
    portal.addEventListener("mouseenter",on); portal.addEventListener("mouseleave",off);
    portal.addEventListener("focus",on); portal.addEventListener("blur",off);
  });

  const desc=document.getElementById("brain-desc");
  if(desc)desc.textContent="九つの研究核を蜘蛛の巣の外周頂点に置き、同心リングとスポークで一つの研究網を作り、その上に実際の横断科学関係を太いリンクとして重ねた研究宇宙。";
})();
