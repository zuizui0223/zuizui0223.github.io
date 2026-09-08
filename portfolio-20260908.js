/* 2026-09-08 portfolio overlay.
 * Loaded after tower-data.js and before the tower is frozen/rendered.
 * Adds two new research programmes and three source-backed interfaces.
 * Cross-repository syntheses below are explicitly NOT scientific edges. */
(() => {
  'use strict';
  const D=window.ZUIZUI_TOWER;
  if(!D||D.checkedAt==='2026-09-08')return;
  const ids=new Set(D.repos.map(r=>r[0]));
  if(!ids.has('TTF')) D.repos.push(['TTF',1,'移る構造','別種で学んだ形質遷移構造が、未見種へ移るかをheld-out speciesで問う。','record,represented,identified,method']);
  if(!ids.has('adaptive-gain')) D.repos.push(['adaptive-gain',2,'次を変える価値','途中の観測結果に応じて次の測定を変えることの有限構造的利得を問う。','possible,identified,action,theory']);
  D.aliases.TTF='TTF';
  D.aliases['adaptive-gain']='ADAPTIVE GAIN';
  const have=new Set(D.contacts.map(c=>c.id));
  const extra=[
    {id:'transfer-geometry',from:['fcp'],to:['TTF'],type:'heldout-transfer-method',status:'bounded',condition:'FCPの凍結された標本配置はTTFの意図されたgeometry qualification frameになり得るが、花色の経験的signalとTTF sharednessは相互に継承しない。'},
    {id:'geometry-boundary',from:['TTF'],to:['boundary'],type:'sampling-geometry-applicability',status:'bounded',condition:'idealized calibrationの通過はactual sampling geometryでの適用可能性を保証しない。Gate-I-Aのtype-I/power失敗を保持し、fresh geometryで次版を再検証する。'},
    {id:'adaptive-routing',from:['mrod','payoff','balance'],to:['adaptive-gain'],type:'finite-decision-abstraction',status:'established',condition:'結果依存の測定routingを有限決定構造として抽象化する。C_A/C_Fと取得費用の主張であり、生物学的報告や野外妥当性を自動的に許可しない。'}
  ];
  extra.forEach(c=>{if(!have.has(c.id))D.contacts.push(c);});
  const record=D.motifs.find(m=>m.id==='record');
  const answer=D.motifs.find(m=>m.id==='answer');
  for(const id of ['TTF','fcp'])if(!record.repos.includes(id))record.repos.push(id);
  for(const id of ['transfer-geometry','geometry-boundary'])if(!record.contacts.includes(id))record.contacts.push(id);
  for(const id of ['adaptive-gain','payoff','balance'])if(!answer.repos.includes(id))answer.repos.push(id);
  if(!answer.contacts.includes('adaptive-routing'))answer.contacts.push('adaptive-routing');
  D.syntheses=[
    {id:'state-resolution',kind:'portfolio-synthesis',scientific_edge:false,visual:true,glyph:'resolution-fracture',checkedAt:'2026-09-08',repos:['eco-genetic-warning-extensions','chun','acsp','sdmr','TTF','crest','boundary','mrod'],principle:'useful ecological state != convenient coarse summary',meaning:'独立した研究で、粗い警告・二値形質・単一survey selector・summary compression・idealized geometryだけでは問いに必要な差異を保持できない例が集まった。これは共通因果機構の証明ではなく、状態表現を疑う横断的設計原則。'},
    {id:'context-branching',kind:'portfolio-synthesis',scientific_edge:false,visual:false,glyph:'branch',checkedAt:'2026-09-08',repos:['balance','izu-core','eco-genetic-warning-extensions','eog','adaptive-gain','mrod'],principle:'response and information value depend on state, context and measurement path',meaning:'逆向きselectionでもsplitしない、構造診断を足すと予測が悪化する場合がある、adaptive treeの価値はscenarioに依存する。単一universal driverの新規edgeではない。'}
  ];
  D.sources.push(
    {repo:'adaptive-gain',path:'README.md',blob:'3a3d7deb2f041124bc0edc135e1c3cdef27f296c'},
    {repo:'TTF',path:'README.md',blob:'0ef751105d1a36000808be8e217f76fb81e6523e'}
  );
  D.checkedAt='2026-09-08';
  D.version='2026-09-08-tower-2';
})();
