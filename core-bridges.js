(function(){
  "use strict";
  const svg=document.querySelector(".brain-art");
  const portals=document.querySelector(".portals");
  if(!svg||!portals)return;

  svg.querySelectorAll(".contours,.dust,.particles,.void,.rank-points,.cross-core-layer,.research-web-layer,.theory-reality-web,.layered-research-web").forEach(el=>el.remove());
  portals.innerHTML="";

  const defs=svg.querySelector("defs");
  const arrows=[
    ["lrBlue","#63bfe0"],["lrViolet","#a48af4"],["lrAmber","#d5aa78"],
    ["lrGreen","#b9c977"],["lrPink","#e98191"],["lrMagenta","#d28dac"],["lrCyan","#55c4ae"]
  ];
  if(defs)arrows.forEach(([id,color])=>{
    if(defs.querySelector(`#${id}`))return;
    defs.insertAdjacentHTML("beforeend",`<marker id="${id}" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="${color}" stroke="#08090c" stroke-width="1.2"/></marker>`);
  });

  const C={x:500,y:355};
  const nodes=[
    // WORLD / REQUIRED STATE
    {id:"state",layer:"state",label:"WORLD / STATE",sub:"CREST · CCOC · MLTR · MRM · theouni",x:500,y:355,color:"#a48af4",glyph:"Ω"},

    // ACCESS: what survives observation, what is identifiable, what can be reported, what to measure next
    {id:"observation",layer:"access",label:"OBS MAP",sub:"REC · V3 · TNOA",x:650,y:270,color:"#63bfe0",glyph:"◉"},
    {id:"identify",layer:"access",label:"IDENTIFY",sub:"Boundary",x:655,y:405,color:"#6eb7d2",glyph:"∅"},
    {id:"design",layer:"access",label:"DESIGN",sub:"MROD",x:520,y:505,color:"#78c8bd",glyph:"↻"},
    {id:"evidence",layer:"access",label:"EVIDENCE",sub:"CED",x:345,y:405,color:"#b59ce8",glyph:"⊢"},

    // DOMAIN THEORY: ecological objects closer to measurable processes
    {id:"interaction",layer:"domain",label:"INTERACTION / PAYOFF",sub:"SCH → BALANCE → BITA · PAYOFF",x:500,y:155,color:"#d28dac",glyph:"⋈"},
    {id:"ecogenetic",layer:"domain",label:"ECO-GENETIC",sub:"EGC → EGWE",x:270,y:465,color:"#cf9f72",glyph:"↯"},
    {id:"niche",layer:"domain",label:"NICHE / WORLDS",sub:"SDMR → ODSP → EOG",x:735,y:465,color:"#b9c977",glyph:"◇"},

    // CONTACT: methods that directly hand theory to natural/physical work
    {id:"fieldobs",layer:"contact",label:"FIELD OBS",sub:"PolliPi · InsePi",x:805,y:235,color:"#4fa8c9",glyph:"◎"},
    {id:"survey",layer:"contact",label:"SURVEY",sub:"ACSP · candidate patches ≠ occupancy",x:790,y:545,color:"#86b96f",glyph:"⌖"},
    {id:"naturalstate",layer:"contact",label:"NATURAL GATE",sub:"EGWEE · island / urban contexts",x:215,y:545,color:"#d5aa78",glyph:"○"},

    // REAL SYSTEMS
    {id:"flower",layer:"real",label:"FLOWER",sub:"hotarubukuro · FCP · Chun",x:500,y:58,color:"#e6b85c",glyph:"◐"},
    {id:"island",layer:"real",label:"ISLAND",sub:"island · izu-core · shimahotarubukuro",x:125,y:250,color:"#55c4ae",glyph:"⌁"},
    {id:"azami",layer:"real",label:"AZAMI",sub:"azami · EAzami · aza3",x:850,y:635,color:"#e98191",glyph:"✣"}
  ];
  const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));

  const rings=`
    <ellipse class="lr-ring lr-ring-access" cx="${C.x}" cy="${C.y}" rx="185" ry="165"/>
    <ellipse class="lr-ring lr-ring-domain" cx="${C.x}" cy="${C.y}" rx="275" ry="245"/>
    <ellipse class="lr-ring lr-ring-contact" cx="${C.x}" cy="${C.y}" rx="355" ry="300"/>
    <ellipse class="lr-ring lr-ring-real" cx="${C.x}" cy="${C.y}" rx="425" ry="335"/>
  `;
  const spokes=nodes.filter(n=>n.id!=="state").map(n=>`<line class="lr-spoke lr-spoke-${n.layer}" x1="${C.x}" y1="${C.y}" x2="${n.x}" y2="${n.y}"/>`).join("");
  const layerLabels=`
    <text class="lr-layer-label" x="690" y="210">ACCESS</text>
    <text class="lr-layer-label" x="765" y="375">DOMAIN THEORY</text>
    <text class="lr-layer-label" x="835" y="438">CONTACT</text>
    <text class="lr-layer-label lr-layer-real-label" x="890" y="505">REAL SYSTEMS</text>
  `;

  const edges=[
    // required distinctions vs evidence and observation
    {id:"state-evidence",from:"state",to:"evidence",label:"required state",color:"#a48af4",marker:"lrViolet"},
    {id:"state-identify",from:"state",to:"identify",label:"required ≠ identified",color:"#8e9fda",marker:"lrViolet",dash:"5 5"},
    {id:"obs-identify",from:"observation",to:"identify",label:"surviving distinctions",color:"#63bfe0",marker:"lrBlue"},
    {id:"identify-evidence",from:"identify",to:"evidence",label:"identified → reportable",color:"#a48af4",marker:"lrViolet"},
    {id:"identify-design",from:"identify",to:"design",label:"unresolved set",color:"#55c4ae",marker:"lrCyan"},
    {id:"design-observation",from:"design",to:"observation",label:"next observation",color:"#55c4ae",marker:"lrCyan",curve:-78,dash:"6 5"},

    // MRM-like required mechanism distinctions meet empirical identifiability here
    {id:"interaction-identify",from:"interaction",to:"identify",label:"specific ambiguity → boundary",color:"#d28dac",marker:"lrMagenta"},

    // proposed domain interface: relational state can condition payoff parameters, not yet a validation bridge
    {id:"eg-interaction",from:"ecogenetic",to:"interaction",label:"state → payoff  (proposed)",color:"#cf9f72",marker:"lrAmber",dash:"3 6",curve:72},

    // theory to contact
    {id:"obs-field",from:"observation",to:"fieldobs",label:"semantics → instrument",color:"#63bfe0",marker:"lrBlue"},
    {id:"eg-natural",from:"ecogenetic",to:"naturalstate",label:"state idea → natural gate",color:"#d5aa78",marker:"lrAmber"},
    {id:"natural-evidence",from:"naturalstate",to:"evidence",label:"adequacy → licensing",color:"#a48af4",marker:"lrViolet"},
    {id:"niche-survey",from:"niche",to:"survey",label:"worlds → candidate patches",color:"#b9c977",marker:"lrGreen"},
    {id:"design-survey",from:"design",to:"survey",label:"WHAT ↔ WHERE",color:"#55c4ae",marker:"lrCyan",both:true,curve:-30},

    // contact to real systems
    {id:"field-flower",from:"fieldobs",to:"flower",label:"visit observation",color:"#4fa8c9",marker:"lrBlue",both:true,curve:-55},
    {id:"natural-island",from:"naturalstate",to:"island",label:"context → state adequacy",color:"#55c4ae",marker:"lrCyan",both:true},
    {id:"survey-azami",from:"survey",to:"azami",label:"prioritize → field return",color:"#e98191",marker:"lrPink",both:true},

    // empirical substrate, not warning validation
    {id:"island-natural-note",from:"island",to:"naturalstate",label:"Honshu–Izu substrate",color:"#d5aa78",marker:"lrAmber",dash:"5 7",curve:30}
  ];

  function edgePath(e){
    const a=byId[e.from],b=byId[e.to];
    if(!e.curve)return`M${a.x} ${a.y} L${b.x} ${b.y}`;
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;
    const nx=-dy/len,ny=dx/len;
    return`M${a.x} ${a.y} Q${(mx+nx*e.curve).toFixed(1)} ${(my+ny*e.curve).toFixed(1)} ${b.x} ${b.y}`;
  }
  function edgeMid(e){
    const a=byId[e.from],b=byId[e.to];
    if(!e.curve)return{x:(a.x+b.x)/2,y:(a.y+b.y)/2};
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
    const q={x:mx+nx*e.curve,y:my+ny*e.curve};
    return{x:(a.x+2*q.x+b.x)/4,y:(a.y+2*q.y+b.y)/4};
  }
  const edgeMarkup=edges.map(e=>{
    const d=edgePath(e),m=edgeMid(e),width=Math.max(76,e.label.length*6.8+18);
    const markers=e.both?` marker-start="url(#${e.marker})" marker-end="url(#${e.marker})"`:` marker-end="url(#${e.marker})"`;
    const dash=e.dash?`stroke-dasharray:${e.dash};`:"";
    return `<g class="lr-edge-group" data-contact="${e.id}" style="--edge:${e.color};${dash}"><title>${e.label}</title><path class="lr-edge-halo" d="${d}"/><path class="lr-edge" d="${d}"${markers}/><rect class="lr-edge-label-bg" x="${(m.x-width/2).toFixed(1)}" y="${(m.y-10).toFixed(1)}" width="${width.toFixed(1)}" height="20"/><text class="lr-edge-label" x="${m.x.toFixed(1)}" y="${m.y.toFixed(1)}">${e.label}</text></g>`;
  }).join("");

  function nodeMarkup(n){
    const r=n.layer==="state"?35:n.layer==="real"?24:n.layer==="contact"?22:21;
    const dx=n.x-C.x,dy=n.y-C.y,mag=Math.hypot(dx,dy)||1;
    let lx=n.x+dx/mag*(r+20),ly=n.y+dy/mag*(r+20);
    if(n.id==="state"){lx=n.x;ly=n.y+58;}
    const anchor=n.id==="state"?"middle":dx>75?"start":dx<-75?"end":"middle";
    return `<g class="portal lr-node lr-node-${n.layer}" data-portal="${n.id}" tabindex="0" role="button" aria-label="${n.label}" style="--node:${n.color};color:${n.color}"><title>${n.label} · ${n.sub}</title><circle class="lr-node-halo" cx="${n.x}" cy="${n.y}" r="${r+8}"/><circle class="portal-node lr-node-core" cx="${n.x}" cy="${n.y}" r="${r}"/><text class="lr-node-glyph" x="${n.x}" y="${n.y+5}">${n.glyph}</text><text class="lr-node-label" x="${lx.toFixed(1)}" y="${(ly-2).toFixed(1)}" text-anchor="${anchor}">${n.label}</text><text class="lr-node-sub" x="${lx.toFixed(1)}" y="${(ly+11).toFixed(1)}" text-anchor="${anchor}">${n.sub}</text></g>`;
  }

  const ghost=`<g class="lr-ghost" aria-label="284b staging"><line x1="735" y1="465" x2="825" y2="410"/><circle cx="835" cy="404" r="10"/><text x="852" y="407">284b · staging from SDMR 2.8.4</text></g>`;
  const centreNote=`<text class="lr-centre-note" x="500" y="315">WORLD → STATE → ACCESS → DOMAIN → CONTACT → FIELD</text>`;
  const legend=`<g class="lr-legend"><text x="245" y="704">radius = distance to measurement, not importance</text><text x="610" y="704">dashed = proposed / bounded interface</text></g>`;

  portals.insertAdjacentHTML("beforebegin",`<g class="layered-research-web" aria-label="layered theory to reality spiderweb">${rings}<g class="lr-scaffold">${spokes}</g>${layerLabels}${centreNote}${edgeMarkup}${ghost}${legend}</g>`);
  portals.insertAdjacentHTML("beforeend",nodes.map(nodeMarkup).join(""));

  const desc=document.getElementById("brain-desc");
  if(desc)desc.textContent="中心にCRESTのworld/state theory、次に観測・同定・証拠・次観測、さらにeco-genetic / interaction-payoff / niche-world domain theory、外側にEGWEE・ACSP・PolliPi/InsePiというcontact layer、最外周に島・花・アザミのreal systemsを置く蜘蛛の巣。半径は理論の重要度ではなく現実の測定までの距離を示す。";
})();
