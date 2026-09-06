(function(){
  "use strict";
  const data=window.WORLDLINES;
  if(!data)return;
  const node=id=>data.nodes.find(n=>n.id===id);
  const patch=(id,values)=>{const n=node(id);if(n)Object.assign(n,values);return n};

  data.series.observation={...(data.series.observation||{}),label:"観測可能性",color:"#63bfe0",lane:"MISSING SUPPORT / REFINEMENT / SEMANTICS → IDENTIFY → DESIGN"};
  data.series.fieldobs={label:"訪花観察実装",color:"#4fa8c9",lane:"PRIMARY RECORD → PHYSICAL DIAGNOSIS"};
  data.series.naturalstate={label:"自然データ接点",color:"#d5aa78",lane:"MEASURE → PRESERVE → RESIDUAL → IDENTIFY"};

  ["rec","v3","tnoa","boundary","mrod"].forEach(id=>patch(id,{series:"observation"}));
  ["pollipi","insepi"].forEach(id=>patch(id,{series:"fieldobs"}));
  patch("egwee",{series:"naturalstate"});

  data.stories.observation={
    label:"観測可能性",axiom:"観測 ≠ 世界",
    nodes:["rec","v3","tnoa","boundary","mrod"],
    text:"REC / V3 / TNOA は観測写像の別々の情報操作。Boundary が残る observational equivalence を監査し、MROD が次の観測でそれを割る。",
    displayPath:"REC · V3 · TNOA → Boundary → MROD"
  };
  data.stories.fieldobs={
    label:"訪花観察実装",axiom:"実装 ≠ 理論",
    nodes:["pollipi","insepi"],
    text:"PolliPi は比較可能なprimary flower-visitor record、InsePi は nuisance / observability / shared-optical failure の物理介入診断。",
    displayPath:"PolliPi → InsePi"
  };
  data.stories.naturalstate={
    label:"自然データ接点",axiom:"投影 ≠ 検証",
    nodes:["egwee"],
    text:"future-relevant state の発想を自然データで測定・表現・残差のgateとして試す独立empirical interface。",
    displayPath:"THEORY ⇄ EGWEE ⇄ NATURAL DATA"
  };
  delete data.stories.method;

  const replacePairs=new Set([
    "pollipi|insepi","pollipi|v3","v3|rec","rec|tnoa","tnoa|rec","insepi|tnoa",
    "bita|boundary","boundary|mrod","eco-genetic-warning-extensions|egwee","izu-core|egwee","tnoa|egwee","egwee|ced",
    "mrod|acsp","aza3|acsp","acsp|aza3","tnoa|pollipi","tnoa|insepi","rec|boundary","v3|boundary","tnoa|boundary","rec|pollipi"
  ]);
  data.edges=(data.edges||[]).filter(e=>!replacePairs.has(`${e.from}|${e.to}`));
  data.edges.push(
    {from:"pollipi",to:"insepi",type:"solid",relation:"handoff",label:"primary flower-visitor record → physical observer diagnosis"},
    {from:"rec",to:"boundary",type:"bridge",relation:"epistemic",label:"non-entered support → identification ceiling"},
    {from:"v3",to:"boundary",type:"bridge",relation:"epistemic",label:"retained side information → compatible-world refinement"},
    {from:"tnoa",to:"boundary",type:"bridge",relation:"epistemic",label:"preserved semantics → distinguishable observation states"},
    {from:"boundary",to:"mrod",type:"solid",relation:"handoff",label:"remaining equivalence set → next observation design"},
    {from:"tnoa",to:"pollipi",type:"bridge",relation:"information_flow",label:"target-facing process-preserving semantics → flower-visitor record"},
    {from:"tnoa",to:"insepi",type:"bridge",relation:"information_flow",label:"nuisance/observability distinctions → physical diagnosis"},
    {from:"rec",to:"pollipi",type:"bridge",relation:"epistemic",label:"prospective exposure/entry audit → same-system field test"},
    {from:"bita",to:"boundary",type:"bridge",relation:"abstraction",label:"specific mechanism-allocation ambiguity → general identification boundary"},
    {from:"mrod",to:"acsp",type:"bridge",relation:"complement",label:"WHAT to measure ↔ WHERE to look"},
    {from:"aza3",to:"acsp",type:"bridge",relation:"information_flow",label:"biological sampling need → bounded search geography"},
    {from:"acsp",to:"aza3",type:"bridge",relation:"information_flow",label:"candidate patch → field verification / primary-data intake"},
    {from:"eco-genetic-warning-extensions",to:"egwee",type:"bridge",relation:"epistemic",label:"future-relevant-state idea → natural-data adequacy gates (projection, not validation)"},
    {from:"izu-core",to:"egwee",type:"bridge",relation:"shared_substrate",label:"Honshu–Izu functional data · different frozen questions"},
    {from:"egwee",to:"ced",type:"bridge",relation:"epistemic",label:"empirical state/proxy adequacy → reportability licensing"}
  );

  data.graphMeta={...(data.graphMeta||{}),theoryRealityInterface:{
    audit:"theory-reality-audit.json",
    surface:"THEORY WORLDS ⇄ CONTACT ⇄ REAL WORLDS",
    observationTheory:"REC · V3 · TNOA → Boundary → MROD",
    physicalApplication:"PolliPi / InsePi",
    rule:"developmental ancestry != conceptual hierarchy; empirical projection != validation"
  }};

  window.ZUIZUI_THEORY_REALITY={
    theory:["observation","theory","interaction","niche","ecogenetic"],
    reality:["fieldobs","naturalstate","flower","island","azami"]
  };

  const philosophy=document.querySelector(".philosophy-core p");
  if(philosophy)philosophy.innerHTML="理論世界と現実世界の、<br />接点を見つける。";
  const tail=document.querySelector(".philosophy-tail");
  if(tail)tail.textContent="抽象化　／　測る　／　戻す";
  const ending=document.querySelector(".ending small");
  if(ending)ending.textContent="接点の設計";
})();
