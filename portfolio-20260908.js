/* 2026-09-08 portfolio overlay, extended with the 2026-09-09 syndrome synthesis.
 * Loaded after tower-data.js and before the tower is frozen/rendered.
 * Adds two research programmes and source-backed interfaces.
 * Cross-repository syntheses below are explicitly NOT scientific edges.
 *
 * Presentation-only architecture hooks add real 3D fragments. They never change
 * repository roles, typed contacts, evidence status, or the claim ledger.
 */
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

  const resolutionVisual=Object.freeze({
    mode:'architectural-perspective',floor:3,angle:3.80,pitch:.42,tolerance:.055,
    stages:Object.freeze([1,2,3]),
    reading:'II: fracture / III: displaced planes / IV: two beams plus a depth-folded slash'
  });
  const syndromeVisual=Object.freeze({
    mode:'bifurcate-reconverge',
    source:'payoff',
    upstream:Object.freeze(['sch','balance','bita','payoff']),
    individual:Object.freeze(['hotarubukuro','shimahotarubukuro','izu-core','island']),
    spatial:Object.freeze(['TTF']),
    reconvergence:'syndrome-assembly/disassembly',
    endpoints:Object.freeze(['pollination-syndrome','selfing-syndrome','island-syndrome']),
    reading:'PAYOFF splits to concrete individual systems and a transferable-turnover spatial projection, then reconverges as a syndrome assembly/disassembly question'
  });
  D.syntheses=[
    {id:'state-resolution',kind:'portfolio-synthesis',scientific_edge:false,visual:resolutionVisual,glyph:'resolution-fracture',checkedAt:'2026-09-08',repos:['eco-genetic-warning-extensions','chun','acsp','sdmr','TTF','crest','boundary','mrod'],principle:'useful ecological state != convenient coarse summary',meaning:'独立した研究で、粗い警告・二値形質・単一survey selector・summary compression・idealized geometryだけでは問いに必要な差異を保持できない例が集まった。これは共通因果機構の証明ではなく、状態表現を疑う横断的設計原則。'},
    {id:'context-branching',kind:'portfolio-synthesis',scientific_edge:false,visual:false,glyph:'branch',checkedAt:'2026-09-08',repos:['balance','izu-core','eco-genetic-warning-extensions','eog','adaptive-gain','mrod'],principle:'response and information value depend on state, context and measurement path',meaning:'逆向きselectionでもsplitしない、構造診断を足すと予測が悪化する場合がある、adaptive treeの価値はscenarioに依存する。単一universal driverの新規edgeではない。'},
    {id:'syndrome-assembly',kind:'portfolio-synthesis',scientific_edge:false,visual:syndromeVisual,glyph:'bifurcate-reconverge',checkedAt:'2026-09-09',repos:['sch','balance','bita','payoff','hotarubukuro','shimahotarubukuro','izu-core','island','TTF'],principle:'architecture alternatives can be interrogated within concrete systems and across transferable turnover, then reconverged as syndrome assembly/disassembly hypotheses',meaning:'SCH→BALANCE/BITA→PAYOFFのarchitecture reasoningの下流を、個体系とspatial transferの二つの読み方に分ける。個体系はCampanulaなどの直接表現型・生態実証、spatial側はTTFのout-of-species turnover transferability。両者をpollination/selfing/island syndromeのassembly/disassemblyへ再合流させるが、PAYOFF→TTFの正式写像やsyndrome因果を証明したという意味ではない。'}
  ];
  D.sources.push(
    {repo:'adaptive-gain',path:'README.md',blob:'3a3d7deb2f041124bc0edc135e1c3cdef27f296c'},
    {repo:'TTF',path:'README.md',blob:'0ef751105d1a36000808be8e217f76fb81e6523e'},
    {repo:'shimahotarubukuro',path:'README.md',blob:'24135526e16b459b223ad9315254d8879bf8cb07'}
  );

  const deepFreeze=o=>{if(o&&typeof o==='object'&&!Object.isFrozen(o)){Object.values(o).forEach(deepFreeze);Object.freeze(o);}return o;};
  const sub=(a,b)=>a.map((x,i)=>x-b[i]),add=(a,b)=>a.map((x,i)=>x+b[i]),mul=(a,k)=>a.map(x=>x*k);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>mul(a,1/(Math.hypot(...a)||1));
  const average=pts=>pts[0].map((_,i)=>pts.reduce((s,p)=>s+p[i],0)/pts.length);
  function augmentArchitecture(model){
    if(model.resolutionFracture&&model.syndromeAssembly)return model;
    const P=model.palette,a=resolutionVisual.angle,pitch=resolutionVisual.pitch;
    const extraFaces=[],extraDecor=[];
    const shade=(hex,n,boost=1)=>{
      const light=Math.max(.38,Math.min(1.12,(.72+.24*n[1]-.19*n[0]+.12*n[2])*boost));
      return '#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*light)).toString(16).padStart(2,'0')).join('');
    };
    const face=(points,normal,color,layer,synthesis='state-resolution')=>extraFaces.push({
      points,normal,fill:shade(color,normal),layer,role:'clue',synthesis
    });
    const rot=(p,t,o=[0,0,0])=>[o[0]+p[0]*Math.cos(t)+p[2]*Math.sin(t),o[1]+p[1],o[2]-p[0]*Math.sin(t)+p[2]*Math.cos(t)];
    function box(x,y,z,w,h,d,col,layer,synthesis='state-resolution'){
      const aa=x-w/2,b=x+w/2,c=z-d/2,e=z+d/2,t=y+h;
      face([[aa,t,c],[b,t,c],[b,t,e],[aa,t,e]],[0,1,0],col,layer,synthesis);
      face([[aa,y,e],[b,y,e],[b,t,e],[aa,t,e]],[0,0,1],col,layer,synthesis);
      face([[b,y,c],[aa,y,c],[aa,t,c],[b,t,c]],[0,0,-1],col,layer,synthesis);
      face([[b,y,e],[b,y,c],[b,t,c],[b,t,e]],[1,0,0],col,layer,synthesis);
      face([[aa,y,c],[aa,y,e],[aa,t,e],[aa,t,c]],[-1,0,0],col,layer,synthesis);
    }
    function rotatedBox(o,t,w,h,d,col,layer,synthesis='state-resolution'){
      const begin=extraFaces.length;box(0,0,0,w,h,d,col,layer,synthesis);
      for(let i=begin;i<extraFaces.length;i++){
        const f=extraFaces[i];f.points=f.points.map(p=>rot(p,t,o));f.normal=rot(f.normal,t);f.fill=shade(col,f.normal);
      }
    }
    function polyFace(points,col,layer,synthesis='state-resolution'){
      const n=norm(cross(sub(points[1],points[0]),sub(points[2],points[0])));face(points,n,col,layer,synthesis);
    }
    function beamBetween(p,q,w,d,col,layer,synthesis='state-resolution'){
      const axis=norm(sub(q,p)),ref=Math.abs(axis[1])<.88?[0,1,0]:[0,0,1];
      const u=norm(cross(axis,ref)),v=norm(cross(axis,u));
      const ring=o=>[
        add(add(o,mul(u,-w/2)),mul(v,-d/2)),add(add(o,mul(u,w/2)),mul(v,-d/2)),
        add(add(o,mul(u,w/2)),mul(v,d/2)),add(add(o,mul(u,-w/2)),mul(v,d/2))
      ];
      const A=ring(p),B=ring(q);
      polyFace([A[0],A[1],B[1],B[0]],col,layer,synthesis);polyFace([A[1],A[2],B[2],B[1]],col,layer,synthesis);
      polyFace([A[2],A[3],B[3],B[2]],col,layer,synthesis);polyFace([A[3],A[0],B[0],B[3]],col,layer,synthesis);
      polyFace([A[3],A[2],A[1],A[0]],col,layer,synthesis);polyFace([B[0],B[1],B[2],B[3]],col,layer,synthesis);
    }
    const route=(points,w,d,col,layer,synthesis)=>{for(let i=1;i<points.length;i++)beamBetween(points[i-1],points[i],w,d,col,layer,synthesis);};

    // State-resolution perspective recurrence: II fracture -> III displacement -> IV ≠.
    const archiveCrack=[[-43,178,-78],[-27,189,-80],[-34,201,-76],[-9,214,-79],[7,229,-76]];
    for(let i=1;i<archiveCrack.length;i++)beamBetween(archiveCrack[i-1],archiveCrack[i],3.2,2.2,P.jadeDark,1);
    rotatedBox([-22,337,43],a,91,5,10,P.jade,2);rotatedBox([18,378,19],a,86,5,10,P.clayLight,2);
    const center=[18,502,-4],ex=[Math.cos(a),0,-Math.sin(a)],ez=[Math.sin(a),0,Math.cos(a)];
    const barLine=(dy,w)=>[add(add(center,mul(ex,-w/2)),[0,dy,0]),add(add(center,mul(ex,w/2)),[0,dy,0])];
    const bars=[barLine(-20,104),barLine(20,104)];
    rotatedBox(add(center,[0,-22.5,0]),a,104,5,9,P.jadeDark,3);rotatedBox(add(center,[0,17.5,0]),a,104,5,9,P.jadeDark,3);
    const cp=Math.cos(pitch),sp=Math.sin(pitch),slash=[];
    for(let i=0;i<=12;i++){
      const t=-1+2*i/12,sx=t*39,depth=20*Math.sin(t*Math.PI),dy=(depth*sp+.84*sx)/cp;
      slash.push(add(add(add(center,mul(ex,sx)),mul(ez,depth)),[0,dy,0]));
    }
    for(let i=1;i<slash.length;i++)beamBetween(slash[i-1],slash[i],4.2,4.2,P.clay,3);
    const resolutionFracture=deepFreeze({id:'state-resolution',scientific_edge:false,mode:'architectural-perspective',angle:a,pitch,floor:3,archiveCrack,displacedPlanes:[{center:[-22,337,43],angle:a,width:91},{center:[18,378,19],angle:a,width:86}],completion:{center,bars,slash}});

    // Syndrome synthesis: a physical bifurcation from the PAYOFF terrace.
    // It is a reading route, not a typed scientific dependency.
    const pointOf=id=>model.repoPoints.find(o=>o.row[0]===id)?.point;
    const payoffPoint=pointOf('payoff'),ttfPoint=pointOf('TTF');
    const campPoints=['hotarubukuro','shimahotarubukuro'].map(pointOf).filter(Boolean);
    let syndromeAssembly=null;
    if(payoffPoint&&ttfPoint&&campPoints.length===2){
      const sid='syndrome-assembly',campHub=average(campPoints),topHub=[132,635,25],court=[78,48,150];
      const individualRoute=[payoffPoint,topHub,[42,585,139],[-93,510,181],[-188,398,145],[-226,274,82],[-215,148,-8],campHub];
      const spatialRoute=[payoffPoint,topHub,[195,570,86],[236,457,22],[224,343,-78],[164,248,-126],[ttfPoint[0]+38,ttfPoint[1]+48,ttfPoint[2]+28],ttfPoint];
      const individualReturn=[campHub,[-112,72,118],[-20,58,164],court];
      const spatialReturn=[ttfPoint,[18,137,145],[58,82,176],court];
      route(individualRoute,4.2,4.2,P.jade,4,sid);route(spatialRoute,4.2,4.2,P.brass,4,sid);
      route(individualReturn,3.7,3.7,P.jade,0,sid);route(spatialReturn,3.7,3.7,P.brass,0,sid);
      const ringPts=Array.from({length:9},(_,i)=>[court[0]+29*Math.cos(i*Math.PI/4),court[1],court[2]+29*Math.sin(i*Math.PI/4)]);
      for(let i=1;i<ringPts.length;i++)beamBetween(ringPts[i-1],ringPts[i],3.2,3.2,P.chalk,0,sid);
      function gate(o,ang,w,h,col,kind){
        const l=rot([-w/2,0,0],ang,o),r=rot([w/2,0,0],ang,o),top=[o[0],o[1]+h,o[2]];
        rotatedBox(l,ang,4,h,5,col,0,sid);rotatedBox(r,ang,4,h,5,col,0,sid);rotatedBox([top[0],top[1]-4,top[2]],ang,w+4,4,5,col,0,sid);
        return {kind,center:o,angle:ang,width:w,height:h};
      }
      const endpoints=[
        gate([113,34,190],.10,34,34,P.jade,'pollination-syndrome'),
        gate([47,34,181],-1.05,22,29,P.chalk,'selfing-syndrome'),
        gate([45,34,121],-2.05,30,26,P.clayLight,'island-syndrome')
      ];
      syndromeAssembly=deepFreeze({id:sid,scientific_edge:false,mode:'bifurcate-reconverge',source:'payoff',individual:{representative:campPoints,route:individualRoute,return:individualReturn},spatial:{repository:'TTF',point:ttfPoint,route:spatialRoute,return:spatialReturn},court,endpoints});
    }

    return Object.freeze({...model,faces:Object.freeze([...model.faces,...extraFaces]),decor:Object.freeze([...model.decor,...extraDecor]),resolutionFracture,syndromeAssembly});
  }
  function installArchitectureHook(){
    if(Object.prototype.hasOwnProperty.call(window,'ZUIZUI_ARCHITECTURE'))return;
    let value;
    Object.defineProperty(window,'ZUIZUI_ARCHITECTURE',{
      configurable:true,enumerable:true,get(){return value;},
      set(base){
        if(!base||typeof base.build!=='function'){value=base;return;}
        const originalBuild=base.build;
        const wrapped=Object.freeze({...base,build(data){return augmentArchitecture(originalBuild(data));},version:(base.version||'architecture')+'+resolution-perspective-1+syndrome-bifurcation-1'});
        value=wrapped;Object.defineProperty(window,'ZUIZUI_ARCHITECTURE',{value:wrapped,writable:false,enumerable:true,configurable:false});
      }
    });
  }
  installArchitectureHook();
  D.checkedAt='2026-09-08';D.synthesisAt='2026-09-09';D.version='2026-09-09-tower-4';
})();
