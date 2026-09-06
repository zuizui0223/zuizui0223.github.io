(function(){
  "use strict";
  const data=window.WORLDLINES;
  if(!data)return;
  const node=id=>data.nodes.find(n=>n.id===id);
  const patch=(id,values)=>{const n=node(id);if(n)Object.assign(n,values);return n};

  // Radius on the cover means distance to measurement, not importance.
  data.series.state={label:"世界・状態",color:"#a48af4",lane:"WORLD → REQUIRED STATE"};
  data.series.observation={...(data.series.observation||{}),label:"観測写像",color:"#63bfe0",lane:"MISSING SUPPORT / REFINEMENT / SEMANTICS"};
  data.series.identify={label:"同定境界",color:"#6eb7d2",lane:"WHAT IS IDENTIFIABLE?"};
  data.series.design={label:"次観測",color:"#78c8bd",lane:"WHAT TO MEASURE NEXT?"};
  data.series.evidence={label:"証拠・報告",color:"#b59ce8",lane:"REQUIRED → IDENTIFIED → REPORTABLE"};
  data.series.fieldobs={label:"訪花観察実装",color:"#4fa8c9",lane:"PRIMARY RECORD → PHYSICAL DIAGNOSIS"};
  data.series.naturalstate={label:"自然データ接点",color:"#d5aa78",lane:"STATE ADEQUACY → RESIDUAL CONTEXT"};
  data.series.survey={label:"調査接点",color:"#86b96f",lane:"WORLDS → CANDIDATE PATCHES → FIELD"};

  ["ccoc","mltr","mrm","crest","theouni"].forEach(id=>patch(id,{series:"state"}));
  ["rec","v3","tnoa"].forEach(id=>patch(id,{series:"observation"}));
  patch("boundary",{series:"identify"});
  patch("mrod",{series:"design"});
  patch("ced",{series:"evidence"});
  ["pollipi","insepi"].forEach(id=>patch(id,{series:"fieldobs"}));
  patch("egwee",{series:"naturalstate"});
  patch("acsp",{series:"survey"});
  ["sch","balance","bita","payoff"].forEach(id=>patch(id,{series:"interaction"}));
  ["eco-genetic-criticality","eco-genetic-warning-extensions"].forEach(id=>patch(id,{series:"ecogenetic"}));
  ["sdmr","odsp","eog"].forEach(id=>patch(id,{series:"niche"}));

  data.stories.state={
    label:"世界・状態",axiom:"状態 = 安全に忘れてよい区別",
    nodes:["ccoc","mltr","mrm","crest","theouni"],
    text:"CRESTがworld→required stateを統合する。CCOCはfuture、MLTRはhistory/semantic、MRMはmechanismの各 obstruction。観測できるかはまだ別問題。",
    displayPath:"CCOC / MLTR / MRM → CREST"
  };
  data.stories.observation={
    label:"観測写像",axiom:"record ≠ world",
    nodes:["rec","v3","tnoa"],
    text:"REC=missing support、V3=retained refinement、TNOA=semantic preservation。三者は兄弟操作で、固定された一本道ではない。",
    displayPath:"REC · V3 · TNOA"
  };
  data.stories.identify={
    label:"同定境界",axiom:"精密 ≠ 同定",
    nodes:["boundary"],
    text:"現在のobservation mapがどのworld/mechanism distinctionsを同じに見せるかを明示する。MRMのmechanism-relevant distinctionsとは『必要か』対『見分けられるか』の関係。",
    displayPath:"required distinctions → Boundary"
  };
  data.stories.design={
    label:"次観測",axiom:"当てるより、分ける",
    nodes:["mrod"],
    text:"Boundary後に残るcompatible mechanism/world setを一点化せず、どの次観測が最も有用に分けるかを選ぶ。",
    displayPath:"Boundary → MROD → new observation"
  };
  data.stories.evidence={
    label:"証拠・報告",axiom:"required ≠ identified ≠ reportable",
    nodes:["ced"],
    text:"CEDはCREST系と観測系の接合面。必要なstate distinctionがあるとして、現在のexperiment/recordがどこまでidentifyし、何を安全にreportできるかを問う。",
    displayPath:"CREST ⇄ CED ⇄ observation"
  };
  data.stories.fieldobs={
    label:"訪花観察実装",axiom:"実装 ≠ 理論",
    nodes:["pollipi","insepi"],
    text:"PolliPiはtarget-facingな比較可能primary record、InsePiはnuisance/observability/shared-optical failureの物理介入診断。",
    displayPath:"TNOA/REC → PolliPi / InsePi"
  };
  data.stories.naturalstate={
    label:"自然データ接点",axiom:"投影 ≠ 検証",
    nodes:["egwee"],
    text:"EGWEEはfuture-relevant-stateの発想を自然データへ投影するgate。島・都市などのcontext labelがstate conditioning後にも残差情報を持つかを問う。これはwarning statisticの自然検証ではない。",
    displayPath:"EGWE → EGWEE ⇄ island/urban contexts"
  };
  data.stories.niche={
    label:"ニッチ・世界",axiom:"niche ≠ flat map",
    nodes:["sdmr","odsp","eog"],
    text:"SDMR→ODSP→EOGは、environmental coordinate admission → multidimensional ecological state → compatible/reachable worlds。証拠の依存ではなく上流概念のepistemic sequence。",
    displayPath:"SDMR → ODSP → EOG"
  };
  data.stories.survey={
    label:"調査接点",axiom:"candidate patch ≠ occupancy",
    nodes:["acsp"],
    text:"ACSPはEOG/MROD側の上流情報をfieldへ返すWHEREレイヤー。候補patchをenrichするが、存在確率や『絶対見つかる場所』は返さない。",
    displayPath:"EOG / MROD → ACSP → field"
  };
  data.stories.interaction={
    ...(data.stories.interaction||{}),
    label:"相互作用・architecture",axiom:"conflict ≠ immediate differentiation",
    nodes:["sch","balance","bita","payoff"],
    text:"SCH→BALANCE→BITAでconflict→middle world→differentiation。PAYOFFはL,s,K等をpopulation game・space・timeへ運ぶabstraction。EG系との接続はrelational ecological stateがpayoff contextを条件づけるというproposed interfaceで、現時点ではvalidationではない。"
  };
  data.stories.ecogenetic={
    ...(data.stories.ecogenetic||{}),
    label:"生態遺伝状態",axiom:"same marginals ≠ same future",
    nodes:["eco-genetic-criticality","eco-genetic-warning-extensions"],
    text:"EGC→EGWEはinteraction/genetic relational stateとfuture function/warning validity。自然データはEGWEEへ分離し、島・都市はstate adequacyのcontextであってwarningの外部検証ではない。"
  };
  delete data.stories.method;
  delete data.stories.theory;

  const replacePairs=new Set([
    "pollipi|insepi","pollipi|v3","v3|rec","rec|tnoa","tnoa|rec","insepi|tnoa",
    "bita|boundary","boundary|mrod","eco-genetic-warning-extensions|egwee","izu-core|egwee","tnoa|egwee","egwee|ced",
    "mrod|acsp","eog|acsp","aza3|acsp","acsp|aza3","tnoa|pollipi","tnoa|insepi","rec|boundary","v3|boundary","tnoa|boundary","rec|pollipi",
    "crest|ced","mrm|boundary","boundary|ced","eco-genetic-warning-extensions|payoff"
  ]);
  data.edges=(data.edges||[]).filter(e=>!replacePairs.has(`${e.from}|${e.to}`));
  data.edges.push(
    {from:"pollipi",to:"insepi",type:"solid",relation:"handoff",label:"primary flower-visitor record → physical observer diagnosis"},

    {from:"rec",to:"boundary",type:"bridge",relation:"epistemic",label:"missing support → identification ceiling"},
    {from:"v3",to:"boundary",type:"bridge",relation:"epistemic",label:"retained side information → compatible-world refinement"},
    {from:"tnoa",to:"boundary",type:"bridge",relation:"epistemic",label:"preserved semantics → distinguishable observation states"},
    {from:"boundary",to:"mrod",type:"solid",relation:"handoff",label:"remaining equivalence set → next observation design"},

    {from:"crest",to:"ced",type:"solid",relation:"handoff",label:"required state → evidence licensing"},
    {from:"mrm",to:"boundary",type:"bridge",relation:"conceptual_interface",label:"mechanism distinction required by future response → is it identifiable?"},
    {from:"boundary",to:"ced",type:"bridge",relation:"conceptual_interface",label:"identified set → target/reportability audit"},

    {from:"tnoa",to:"pollipi",type:"bridge",relation:"information_flow",label:"target-facing process-preserving semantics → flower-visitor record"},
    {from:"tnoa",to:"insepi",type:"bridge",relation:"information_flow",label:"nuisance/observability distinctions → physical diagnosis"},
    {from:"rec",to:"pollipi",type:"bridge",relation:"epistemic",label:"prospective exposure/entry audit → same-system field test"},

    {from:"bita",to:"boundary",type:"bridge",relation:"abstraction",label:"specific mechanism-allocation ambiguity → general identification boundary"},
    {from:"eco-genetic-warning-extensions",to:"payoff",type:"bridge",relation:"proposed_interface",label:"relational future-relevant state → context-dependent architecture payoff (proposed; no validation transfer)"},

    {from:"eco-genetic-warning-extensions",to:"egwee",type:"bridge",relation:"empirical_projection",label:"future-relevant-state idea → natural-data adequacy gates; not warning validation"},
    {from:"izu-core",to:"egwee",type:"bridge",relation:"shared_substrate",label:"Honshu–Izu functional data · different frozen questions"},
    {from:"egwee",to:"ced",type:"bridge",relation:"epistemic",label:"empirical state/proxy adequacy → reportability licensing"},

    {from:"eog",to:"acsp",type:"solid",relation:"handoff",label:"compatible/reachable worlds → bounded candidate patches"},
    {from:"mrod",to:"acsp",type:"bridge",relation:"complement",label:"WHAT to measure ↔ WHERE to look"},
    {from:"aza3",to:"acsp",type:"bridge",relation:"information_flow",label:"biological sampling need → bounded search geography"},
    {from:"acsp",to:"aza3",type:"bridge",relation:"information_flow",label:"candidate patch → field verification / primary-data intake"}
  );

  data.graphMeta={...(data.graphMeta||{}),layeredArchitecture:{
    audit:"theory-reality-audit.json",
    surface:"WORLD → STATE → ACCESS → DOMAIN → CONTACT → FIELD",
    radiusMeaning:"distance to measurement, not scientific importance",
    observation:"REC · V3 · TNOA → Boundary → MROD",
    stateTheory:"CCOC / MLTR / MRM → CREST → CED",
    niche:"SDMR → ODSP → EOG → ACSP",
    staging:"284b remains a non-scientific staging ghost attached to SDMR v2.8.4 provenance",
    rule:"development history != conceptual hierarchy; projection != validation; candidate patch != occupancy"
  }};

  window.ZUIZUI_THEORY_REALITY={
    deep:["state"],
    access:["observation","identify","design","evidence"],
    domain:["interaction","ecogenetic","niche"],
    contact:["fieldobs","naturalstate","survey"],
    real:["flower","island","azami"]
  };

  const philosophy=document.querySelector(".philosophy-core p");
  if(philosophy)philosophy.innerHTML="理論世界と現実世界の、<br />接点を見つける。";
  const tail=document.querySelector(".philosophy-tail");
  if(tail)tail.textContent="抽象化　／　測る　／　戻す";
  const ending=document.querySelector(".ending small");
  if(ending)ending.textContent="接点の設計";
})();
