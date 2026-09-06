(function(){
  "use strict";
  const svg=document.querySelector(".brain-art");
  const portals=document.querySelector(".portals");
  if(!svg||!portals)return;

  svg.querySelectorAll(".contours,.dust,.particles,.void,.rank-points,.cross-core-layer,.research-web-layer,.theory-reality-web").forEach(el=>el.remove());
  portals.innerHTML="";

  const defs=svg.querySelector("defs");
  const arrows=[
    ["contactArrowBlue","#63bfe0"],["contactArrowAmber","#d5aa78"],["contactArrowGreen","#b9c977"],
    ["contactArrowPink","#e98191"],["contactArrowMagenta","#d28dac"],["contactArrowViolet","#a48af4"]
  ];
  if(defs)arrows.forEach(([id,color])=>{
    if(defs.querySelector(`#${id}`))return;
    defs.insertAdjacentHTML("beforeend",`<marker id="${id}" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="${color}" stroke="#08090c" stroke-width="1.2"/></marker>`);
  });

  const C={x:500,y:355};
  const outer=[
    {id:"flower",label:"FLOWER",sub:"hotarubukuro · FCP · Chun",x:500,y:55,color:"#e6b85c",glyph:"◐"},
    {id:"fieldobs",label:"FIELD OBS",sub:"PolliPi · InsePi",x:805,y:235,color:"#4fa8c9",glyph:"◎"},
    {id:"azami",label:"AZAMI",sub:"azami · EAzami · aza3",x:690,y:610,color:"#e98191",glyph:"✣"},
    {id:"naturalstate",label:"NATURAL STATE",sub:"EGWEE",x:310,y:610,color:"#d5aa78",glyph:"○"},
    {id:"island",label:"ISLAND",sub:"island · izu-core · shima",x:195,y:235,color:"#55c4ae",glyph:"⌁"}
  ];
  const inner=[
    {id:"interaction",label:"INTERACTION",sub:"SCH · BALANCE · BITA · PAYOFF",x:500,y:165,color:"#d28dac",glyph:"⋈"},
    {id:"observation",label:"OBSERVABILITY",sub:"REC · V3 · TNOA · Boundary · MROD",x:665,y:300,color:"#63bfe0",glyph:"∅"},
    {id:"niche",label:"NICHE / WORLD",sub:"SDMR · ODSP · EOG · ACSP",x:600,y:490,color:"#b9c977",glyph:"◇"},
    {id:"ecogenetic",label:"ECO-GENETIC",sub:"EGC · EGWE",x:400,y:490,color:"#cf9f72",glyph:"↯"},
    {id:"theory",label:"STATE / REPORT",sub:"CCOC · MLTR · MRM · CREST · CED",x:335,y:300,color:"#a48af4",glyph:"∞"}
  ];
  const all=[...outer,...inner];
  const byId=Object.fromEntries(all.map(n=>[n.id,n]));

  const path=nodelist=>nodelist.map((n,i)=>`${i===0?"M":"L"}${n.x} ${n.y}`).join(" ")+" Z";
  const outerPath=path(outer),innerPath=path(inner);
  const mid=outer.map((o,i)=>({x:(o.x+inner[i].x)/2,y:(o.y+inner[i].y)/2}));
  const midPath=path(mid);
  const spokes=outer.map((o,i)=>`<path class="tr-spoke" d="M${C.x} ${C.y} L${inner[i].x} ${inner[i].y} L${o.x} ${o.y}"/>`).join("");

  const scaffold=`<g class="tr-scaffold"><path class="tr-ring tr-ring-outer" d="${outerPath}"/><path class="tr-ring tr-ring-mid" d="${midPath}"/><path class="tr-ring tr-ring-inner" d="${innerPath}"/>${spokes}</g>`;

  const contacts=[
    {id:"obs-field",from:"observation",to:"fieldobs",label:"theory → application",color:"#63bfe0",marker:"contactArrowBlue",both:true},
    {id:"rec-field",from:"observation",to:"fieldobs",label:"H6 field gate",color:"#4fa8c9",marker:"contactArrowBlue",offset:18},
    {id:"eg-natural",from:"ecogenetic",to:"naturalstate",label:"projection ≠ validation",color:"#d5aa78",marker:"contactArrowAmber",both:true},
    {id:"state-natural",from:"theory",to:"naturalstate",label:"adequacy → report",color:"#a48af4",marker:"contactArrowViolet"},
    {id:"niche-azami",from:"niche",to:"azami",label:"survey ↔ field",color:"#b9c977",marker:"contactArrowGreen",both:true},
    {id:"interaction-observation",from:"interaction",to:"observation",label:"specific → general",color:"#d28dac",marker:"contactArrowMagenta"},
    {id:"obs-niche",from:"observation",to:"niche",label:"WHAT ↔ WHERE",color:"#55c4ae",marker:"contactArrowGreen",both:true},
    {id:"flower-island",from:"flower",to:"island",label:"shared system",color:"#e6b85c",marker:"contactArrowAmber",both:true,outer:true},
    {id:"island-natural",from:"island",to:"naturalstate",label:"shared data",color:"#55c4ae",marker:"contactArrowGreen",both:true,outer:true}
  ];

  function contactMarkup(c){
    const a=byId[c.from],b=byId[c.to];
    let ax=a.x,ay=a.y,bx=b.x,by=b.y;
    const dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,off=c.offset||0;
    ax+=nx*off; ay+=ny*off; bx+=nx*off; by+=ny*off;
    const mx=(ax+bx)/2,my=(ay+by)/2;
    const width=Math.max(78,c.label.length*7.5+20);
    const markers=c.both?` marker-start="url(#${c.marker})" marker-end="url(#${c.marker})"`:` marker-end="url(#${c.marker})"`;
    return `<g class="tr-contact-group" data-contact="${c.id}" style="--contact:${c.color}"><title>${c.label}</title><path class="tr-contact-halo" d="M${ax.toFixed(1)} ${ay.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}"/><path class="tr-contact" d="M${ax.toFixed(1)} ${ay.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}"${markers}/><rect class="tr-contact-label-bg" x="${(mx-width/2).toFixed(1)}" y="${(my-11).toFixed(1)}" width="${width.toFixed(1)}" height="22"/><text class="tr-contact-label" x="${mx.toFixed(1)}" y="${my.toFixed(1)}">${c.label}</text></g>`;
  }
  const contactLayer=contacts.map(contactMarkup).join("");

  function nodeMarkup(n,kind){
    const dx=n.x-C.x,dy=n.y-C.y,mag=Math.hypot(dx,dy)||1;
    const labelDistance=kind==="outer"?53:44;
    const lx=n.x+dx/mag*labelDistance,ly=n.y+dy/mag*labelDistance;
    const anchor=dx>70?"start":dx<-70?"end":"middle";
    return `<g class="portal tr-node tr-node-${kind}" data-portal="${n.id}" tabindex="0" role="button" aria-label="${n.label}" style="--node:${n.color};color:${n.color}"><title>${n.label} · ${n.sub}</title><circle class="tr-node-halo" cx="${n.x}" cy="${n.y}" r="${kind==="outer"?31:27}"/><circle class="portal-node tr-node-core" cx="${n.x}" cy="${n.y}" r="${kind==="outer"?23:20}"/><text class="tr-node-glyph" x="${n.x}" y="${n.y+5}">${n.glyph}</text><text class="tr-node-label" x="${lx.toFixed(1)}" y="${(ly-2).toFixed(1)}" text-anchor="${anchor}">${n.label}</text><text class="tr-node-sub" x="${lx.toFixed(1)}" y="${(ly+12).toFixed(1)}" text-anchor="${anchor}">${n.sub}</text></g>`;
  }

  const centre=`<g class="tr-centre"><circle class="tr-centre-halo" cx="${C.x}" cy="${C.y}" r="66"/><circle class="tr-centre-core" cx="${C.x}" cy="${C.y}" r="52"/><text class="tr-centre-title" x="${C.x}" y="${C.y-8}">CONTACT</text><text class="tr-centre-sub" x="${C.x}" y="${C.y+11}">THEORY ⇄ REALITY</text><text class="tr-centre-mini" x="${C.x}" y="${C.y+27}">33 repos</text></g>`;
  const labels=`<text class="tr-layer-label tr-layer-theory" x="500" y="132">THEORY WORLDS</text><text class="tr-layer-label tr-layer-reality" x="500" y="700">REAL WORLDS</text>`;
  const legend=`<g class="tr-legend"><line class="tr-spoke" x1="365" y1="715" x2="402" y2="715"/><text x="410" y="719">web = portfolio structure</text><line class="tr-contact tr-legend-contact" x1="570" y1="715" x2="607" y2="715"/><text x="615" y="719">thick = theory-real contact</text></g>`;

  portals.insertAdjacentHTML("beforebegin",`<g class="theory-reality-web" aria-label="theory reality research web">${scaffold}${centre}${contactLayer}${labels}${legend}</g>`);
  portals.insertAdjacentHTML("beforeend",outer.map(n=>nodeMarkup(n,"outer")).join("")+inner.map(n=>nodeMarkup(n,"inner")).join(""));

  const desc=document.getElementById("brain-desc");
  if(desc)desc.textContent="外側にreal biological/data/physical worlds、内側にtheory worldsを置き、太い糸だけを理論と現実のscientific contactとして示す蜘蛛の巣。観測理論はREC/V3/TNOAからBoundary/MRODへ、PolliPi/InsePiは訪花観察への物理実装として外側に置く。";
})();
