/* 2026-09-08 portfolio overlay.
 * Loaded after tower-data.js and before the tower is frozen/rendered.
 * Adds two new research programmes and three source-backed interfaces.
 * Cross-repository syntheses below are explicitly NOT scientific edges.
 *
 * The state-resolution recurrence also installs a presentation-only architecture
 * hook before tower-architecture.js is assigned. The hook adds real 3D fragments
 * to floors II-IV; it never changes repository roles, typed contacts or evidence.
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
    mode:'architectural-perspective',
    floor:3,
    angle:3.80,
    pitch:.42,
    tolerance:.055,
    stages:Object.freeze([1,2,3]),
    reading:'II: fracture / III: displaced planes / IV: two beams plus a depth-folded slash'
  });
  D.syntheses=[
    {id:'state-resolution',kind:'portfolio-synthesis',scientific_edge:false,visual:resolutionVisual,glyph:'resolution-fracture',checkedAt:'2026-09-08',repos:['eco-genetic-warning-extensions','chun','acsp','sdmr','TTF','crest','boundary','mrod'],principle:'useful ecological state != convenient coarse summary',meaning:'独立した研究で、粗い警告・二値形質・単一survey selector・summary compression・idealized geometryだけでは問いに必要な差異を保持できない例が集まった。これは共通因果機構の証明ではなく、状態表現を疑う横断的設計原則。'},
    {id:'context-branching',kind:'portfolio-synthesis',scientific_edge:false,visual:false,glyph:'branch',checkedAt:'2026-09-08',repos:['balance','izu-core','eco-genetic-warning-extensions','eog','adaptive-gain','mrod'],principle:'response and information value depend on state, context and measurement path',meaning:'逆向きselectionでもsplitしない、構造診断を足すと予測が悪化する場合がある、adaptive treeの価値はscenarioに依存する。単一universal driverの新規edgeではない。'}
  ];
  D.sources.push(
    {repo:'adaptive-gain',path:'README.md',blob:'3a3d7deb2f041124bc0edc135e1c3cdef27f296c'},
    {repo:'TTF',path:'README.md',blob:'0ef751105d1a36000808be8e217f76fb81e6523e'}
  );

  const deepFreeze=o=>{if(o&&typeof o==='object'&&!Object.isFrozen(o)){Object.values(o).forEach(deepFreeze);Object.freeze(o);}return o;};
  const sub=(a,b)=>a.map((x,i)=>x-b[i]),add=(a,b)=>a.map((x,i)=>x+b[i]),mul=(a,k)=>a.map(x=>x*k);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>mul(a,1/(Math.hypot(...a)||1));
  function augmentArchitecture(model){
    if(model.resolutionFracture)return model;
    const P=model.palette,a=resolutionVisual.angle,pitch=resolutionVisual.pitch;
    const extraFaces=[],extraDecor=[];
    const shade=(hex,n,boost=1)=>{
      const light=Math.max(.38,Math.min(1.12,(.72+.24*n[1]-.19*n[0]+.12*n[2])*boost));
      return '#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*light)).toString(16).padStart(2,'0')).join('');
    };
    const face=(points,normal,color,layer)=>extraFaces.push({
      points,normal,fill:shade(color,normal),layer,role:'clue',
      synthesis:'state-resolution'
    });
    const rot=(p,t,o=[0,0,0])=>[o[0]+p[0]*Math.cos(t)+p[2]*Math.sin(t),o[1]+p[1],o[2]-p[0]*Math.sin(t)+p[2]*Math.cos(t)];
    function box(x,y,z,w,h,d,col,layer){
      const aa=x-w/2,b=x+w/2,c=z-d/2,e=z+d/2,t=y+h;
      face([[aa,t,c],[b,t,c],[b,t,e],[aa,t,e]],[0,1,0],col,layer);
      face([[aa,y,e],[b,y,e],[b,t,e],[aa,t,e]],[0,0,1],col,layer);
      face([[b,y,c],[aa,y,c],[aa,t,c],[b,t,c]],[0,0,-1],col,layer);
      face([[b,y,e],[b,y,c],[b,t,c],[b,t,e]],[1,0,0],col,layer);
      face([[aa,y,c],[aa,y,e],[aa,t,e],[aa,t,c]],[-1,0,0],col,layer);
    }
    function rotatedBox(o,t,w,h,d,col,layer){
      const begin=extraFaces.length;box(0,0,0,w,h,d,col,layer);
      for(let i=begin;i<extraFaces.length;i++){
        const f=extraFaces[i];
        f.points=f.points.map(p=>rot(p,t,o));
        f.normal=rot(f.normal,t);
        f.fill=shade(col,f.normal);
      }
    }
    function polyFace(points,col,layer){
      const n=norm(cross(sub(points[1],points[0]),sub(points[2],points[0])));
      face(points,n,col,layer);
    }
    function beamBetween(p,q,w,d,col,layer){
      const axis=norm(sub(q,p));
      const ref=Math.abs(axis[1])<.88?[0,1,0]:[0,0,1];
      const u=norm(cross(axis,ref)),v=norm(cross(axis,u));
      const ring=o=>[
        add(add(o,mul(u,-w/2)),mul(v,-d/2)),
        add(add(o,mul(u,w/2)),mul(v,-d/2)),
        add(add(o,mul(u,w/2)),mul(v,d/2)),
        add(add(o,mul(u,-w/2)),mul(v,d/2))
      ];
      const A=ring(p),B=ring(q);
      polyFace([A[0],A[1],B[1],B[0]],col,layer);
      polyFace([A[1],A[2],B[2],B[1]],col,layer);
      polyFace([A[2],A[3],B[3],B[2]],col,layer);
      polyFace([A[3],A[0],B[0],B[3]],col,layer);
      polyFace([A[3],A[2],A[1],A[0]],col,layer);
      polyFace([B[0],B[1],B[2],B[3]],col,layer);
    }

    // II: the recurrence first appears only as a broken seam in the archive wall.
    const archiveCrack=[
      [-43,178,-78],[-27,189,-80],[-34,201,-76],[-9,214,-79],[7,229,-76]
    ];
    for(let i=1;i<archiveCrack.length;i++)beamBetween(archiveCrack[i-1],archiveCrack[i],3.2,2.2,P.jadeDark,1);

    // III: two planes repeat the motif but disagree in depth and height.
    rotatedBox([-22,337,43],a,91,5,10,P.jade,2);
    rotatedBox([18,378,19],a,86,5,10,P.clayLight,2);

    // IV: two structural beams and one depth-folded brace become ≠ only in
    // the declared camera projection. The brace is genuinely kinked in 3D.
    const center=[18,502,-4],ex=[Math.cos(a),0,-Math.sin(a)],ez=[Math.sin(a),0,Math.cos(a)];
    const barLine=(dy,w)=>[
      add(add(center,mul(ex,-w/2)),[0,dy,0]),
      add(add(center,mul(ex,w/2)),[0,dy,0])
    ];
    const bars=[barLine(-20,104),barLine(20,104)];
    rotatedBox(add(center,[0,-22.5,0]),a,104,5,9,P.jadeDark,3);
    rotatedBox(add(center,[0,17.5,0]),a,104,5,9,P.jadeDark,3);
    const cp=Math.cos(pitch),sp=Math.sin(pitch),slash=[];
    for(let i=0;i<=12;i++){
      const t=-1+2*i/12,sx=t*39,depth=20*Math.sin(t*Math.PI);
      const dy=(depth*sp+.84*sx)/cp;
      slash.push(add(add(add(center,mul(ex,sx)),mul(ez,depth)),[0,dy,0]));
    }
    for(let i=1;i<slash.length;i++)beamBetween(slash[i-1],slash[i],4.2,4.2,P.clay,3);

    const resolutionFracture=deepFreeze({
      id:'state-resolution',
      scientific_edge:false,
      mode:'architectural-perspective',
      angle:a,
      pitch,
      floor:3,
      archiveCrack,
      displacedPlanes:[
        {center:[-22,337,43],angle:a,width:91},
        {center:[18,378,19],angle:a,width:86}
      ],
      completion:{center,bars,slash}
    });
    return Object.freeze({
      ...model,
      faces:Object.freeze([...model.faces,...extraFaces]),
      decor:Object.freeze([...model.decor,...extraDecor]),
      resolutionFracture
    });
  }
  function installArchitectureHook(){
    if(Object.prototype.hasOwnProperty.call(window,'ZUIZUI_ARCHITECTURE'))return;
    let value;
    Object.defineProperty(window,'ZUIZUI_ARCHITECTURE',{
      configurable:true,enumerable:true,
      get(){return value;},
      set(base){
        if(!base||typeof base.build!=='function'){value=base;return;}
        const originalBuild=base.build;
        const wrapped=Object.freeze({
          ...base,
          build(data){return augmentArchitecture(originalBuild(data));},
          version:(base.version||'architecture')+'+resolution-perspective-1'
        });
        value=wrapped;
        Object.defineProperty(window,'ZUIZUI_ARCHITECTURE',{
          value:wrapped,writable:false,enumerable:true,configurable:false
        });
      }
    });
  }
  installArchitectureHook();

  D.checkedAt='2026-09-08';
  D.version='2026-09-08-tower-3';
})();
