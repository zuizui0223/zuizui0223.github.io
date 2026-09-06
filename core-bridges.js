(function(){
  "use strict";
  const svg=document.querySelector(".brain-art");
  const portals=document.querySelector(".portals");
  if(!svg||!portals)return;

  svg.querySelectorAll(".contours,.dust,.particles,.void,.rank-points,.cross-core-layer,.research-web-layer").forEach(el=>el.remove());
  portals.innerHTML="";

  const defs=svg.querySelector("defs");
  const arrowDefs=[
    ["webArrowShared","#e6b85c"],
    ["webArrowEpistemic","#63bfe0"],
    ["webArrowAbstraction","#d28dac"],
    ["webArrowComplement","#55c4ae"],
    ["webArrowInformation","#e98191"]
  ];
  if(defs){
    arrowDefs.forEach(([id,color])=>{
      if(defs.querySelector(`#${id}`))return;
      defs.insertAdjacentHTML("beforeend",`<marker id="${id}" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="${color}" stroke="#08090c" stroke-width="1.2"/></marker>`);
    });
  }

  const C={x:500,y:360};
  const nodes=[
    {id:"flower",label:"FLOWER",glyph:"◐",x:500,y:74,color:"#e6b85c"},
    {id:"island",label:"ISLAND",glyph:"⌁",x:725,y:132,color:"#55c4ae"},
    {id:"ecogenetic",label:"ECO-GENETIC",glyph:"↯",x:850,y:285,color:"#cf9f72"},
    {id:"observation",label:"OBSERVATION",glyph:"◎",x:820,y:490,color:"#63bfe0"},
    {id:"method",label:"METHOD",glyph:"∴",x:625,y:620,color:"#7cb7d6"},
    {id:"niche",label:"NICHE",glyph:"◇",x:375,y:620,color:"#b9c977"},
    {id:"azami",label:"AZAMI",glyph:"✣",x:180,y:490,color:"#e98191"},
    {id:"theory",label:"THEORY",glyph:"∞",x:150,y:285,color:"#a48af4"},
    {id:"interaction",label:"INTERACTION",glyph:"⋈",x:275,y:132,color:"#d28dac"}
  ];
  const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));

  const scaled=(n,s)=>({x:C.x+(n.x-C.x)*s,y:C.y+(n.y-C.y)*s});
  const ringPath=s=>nodes.map((n,i)=>{const p=scaled(n,s);return`${i===0?"M":"L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`}).join("")+"Z";
  const rings=[.38,.60,.82,1].map((s,i)=>`<path class="web-ring web-ring-${i+1}" d="${ringPath(s)}"/>`).join("");
  const spokes=nodes.map(n=>{
    const p=scaled(n,.18);
    return `<line class="web-spoke" x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${n.x}" y2="${n.y}"/>`;
  }).join("");

  const bridges=[
    {id:"flower-island",from:"flower",to:"island",kind:"shared",label:"same substrate",bend:.78,markers:"both"},
    {id:"island-ecogenetic",from:"island",to:"ecogenetic",kind:"shared",label:"same substrate",bend:.74,markers:"both"},
    {id:"observation-ecogenetic",from:"observation",to:"ecogenetic",kind:"epistemic",label:"record → state",bend:.74,markers:"end"},
    {id:"ecogenetic-theory",from:"ecogenetic",to:"theory",kind:"epistemic",label:"state → claim",bend:.48,markers:"end",lift:-88},
    {id:"interaction-method",from:"interaction",to:"method",kind:"abstraction",label:"identify → design",bend:.50,markers:"end",lift:82},
    {id:"method-niche",from:"method",to:"niche",kind:"complement",label:"WHAT ↔ WHERE",bend:.76,markers:"both"},
    {id:"niche-azami",from:"niche",to:"azami",kind:"information",label:"search ↔ field",bend:.74,markers:"both"}
  ];

  const kindMeta={
    shared:{color:"#e6b85c",marker:"webArrowShared",dash:"6 6"},
    epistemic:{color:"#63bfe0",marker:"webArrowEpistemic",dash:"none"},
    abstraction:{color:"#d28dac",marker:"webArrowAbstraction",dash:"7 5"},
    complement:{color:"#55c4ae",marker:"webArrowComplement",dash:"none"},
    information:{color:"#e98191",marker:"webArrowInformation",dash:"none"}
  };

  const bridgeMarkup=bridges.map(b=>{
    const a=byId[b.from],z=byId[b.to],m=kindMeta[b.kind];
    const mx=(a.x+z.x)/2,my=(a.y+z.y)/2;
    const qx=C.x+(mx-C.x)*b.bend;
    const qy=C.y+(my-C.y)*b.bend+(b.lift||0);
    const d=`M${a.x} ${a.y} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${z.x} ${z.y}`;
    const lm={x:(a.x+2*qx+z.x)/4,y:(a.y+2*qy+z.y)/4};
    const width=Math.max(74,b.label.length*7.4+20);
    const markers=b.markers==="both"?` marker-start="url(#${m.marker})" marker-end="url(#${m.marker})"`:b.markers==="end"?` marker-end="url(#${m.marker})"`:"";
    return `<g class="web-bridge-group" data-core-bridge="${b.id}" style="--bridge:${m.color};--bridge-dash:${m.dash}"><title>${b.from} ${b.label} ${b.to}</title><path class="web-bridge-halo" d="${d}"/><path class="web-bridge" d="${d}"${markers}/><rect class="web-bridge-label-bg" x="${(lm.x-width/2).toFixed(1)}" y="${(lm.y-12).toFixed(1)}" width="${width.toFixed(1)}" height="24"/><text class="web-bridge-label" x="${lm.x.toFixed(1)}" y="${lm.y.toFixed(1)}">${b.label}</text></g>`;
  }).join("");

  const nodeMarkup=nodes.map(n=>{
    const dx=n.x-C.x,dy=n.y-C.y;
    const mag=Math.hypot(dx,dy)||1;
    const lx=n.x+dx/mag*43,ly=n.y+dy/mag*43;
    const anchor=dx>65?"start":dx<-65?"end":"middle";
    return `<g class="portal web-core portal-${n.id}" data-portal="${n.id}" tabindex="0" role="button" aria-label="${n.label}" style="--core:${n.color};color:${n.color}"><title>${n.label}</title><circle class="web-core-halo" cx="${n.x}" cy="${n.y}" r="33"/><circle class="portal-node web-core-node" cx="${n.x}" cy="${n.y}" r="25"/><text class="web-core-glyph" x="${n.x}" y="${n.y+5}">${n.glyph}</text><text class="web-core-label" x="${lx.toFixed(1)}" y="${(ly+4).toFixed(1)}" text-anchor="${anchor}">${n.label}</text></g>`;
  }).join("");

  const legend=`<g class="web-legend"><line x1="365" y1="690" x2="405" y2="690" class="web-spoke"/><text x="412" y="694">system web</text><line x1="520" y1="690" x2="560" y2="690" class="web-bridge legend-bridge"/><text x="568" y="694">scientific bridge</text></g>`;

  portals.insertAdjacentHTML("beforebegin",`<g class="research-web-layer" aria-label="research spiderweb"><g class="web-scaffold">${rings}${spokes}</g><circle class="web-centre-halo" cx="${C.x}" cy="${C.y}" r="74"/><circle class="web-centre" cx="${C.x}" cy="${C.y}" r="58"/><text class="web-centre-title" x="${C.x}" y="${C.y-4}">RESEARCH</text><text class="web-centre-sub" x="${C.x}" y="${C.y+15}">33 REPOS</text>${bridgeMarkup}${legend}</g>`);
  portals.insertAdjacentHTML("beforeend",nodeMarkup);

  const desc=document.getElementById("brain-desc");
  if(desc)desc.textContent="9つの研究核を蜘蛛の巣の外周に固定し、細い同心網とスポークで共通研究システムを、太い色付きリンクで実際の横断科学関係を示す。";
})();
