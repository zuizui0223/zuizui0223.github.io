(function(){
  "use strict";
  const stage=document.querySelector('.art-stage');
  const svg=document.querySelector('.brain-art');
  const portals=document.querySelector('.portals');
  if(!stage||!svg||!portals)return;

  svg.querySelectorAll('.theory-reality-web,.world-game-layer').forEach(el=>el.remove());
  portals.innerHTML='';

  const colors={blue:'#63bfe0',amber:'#e6b85c',green:'#b9c977',pink:'#e98191',magenta:'#d28dac',violet:'#a48af4',teal:'#55c4ae',brown:'#cf9f72',white:'#d9d0aa',gray:'#8a8e92'};
  const defs=svg.querySelector('defs');
  if(defs&&!defs.querySelector('#wgArrow')) defs.insertAdjacentHTML('beforeend',`<marker id="wgArrow" viewBox="0 0 12 12" refX="9.5" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="context-stroke" stroke="#08090c" stroke-width="1.2"/></marker>`);

  if(!stage.querySelector('.world-lens-switch')){
    const controls=document.createElement('div');
    controls.className='world-lens-switch';
    controls.innerHTML=`
      <button class="world-lens-btn is-active" data-world-lens="world" style="--lens:${colors.white}">Ω WORLD</button>
      <button class="world-lens-btn" data-world-lens="observe" style="--lens:${colors.blue}">◎ OBSERVE</button>
      <button class="world-lens-btn" data-world-lens="state" style="--lens:${colors.violet}">◇ STATE</button>
      <button class="world-lens-btn" data-world-lens="field" style="--lens:${colors.green}">⌖ FIELD</button>
      <button class="world-lens-btn" data-world-lens="evolve" style="--lens:${colors.magenta}">⋈ EVOLVE</button>`;
    stage.appendChild(controls);
  }
  if(!stage.querySelector('.world-notebook')){
    const nb=document.createElement('div');
    nb.className='world-notebook';
    nb.innerHTML='<strong>NOTEBOOK</strong><span>視点を変えると、同じrepoが別の世界関係を持つ。太線は成立済み、点線の ? は未閉合。</span>';
    stage.appendChild(nb);
  }
  const notebook=stage.querySelector('.world-notebook span');
  const say=t=>{if(notebook)notebook.textContent=t};

  const layouts={
    world:{
      question:'外側ほど世界の区別は多く、内側ほど観測・推論で圧縮される。MROD/ACSPは内側から外へ戻る出口。',
      rings:[
        {r:292,label:'Ω  POSSIBLE / LATENT WORLDS'},
        {r:235,label:'OBSERVABLE SUPPORT'},
        {r:180,label:'RETAINED RECORD'},
        {r:125,label:'IDENTIFIED / COMPATIBLE'},
        {r:73,label:'REPORTABLE TARGET'}
      ],
      nodes:[
        {id:'crest',x:340,y:140,label:'CREST',sub:'CCOC · MLTR · MRM',glyph:'◇',color:colors.violet,note:'CREST系は外側。まず「どの区別が本来必要か」を定義する。観測できるかは後段の別問題。'},
        {id:'rec',x:760,y:185,label:'REC',sub:'missing support',glyph:'∅',color:colors.blue,note:'RECはΩとrecordの境界。世界にあったがrowにならなかった区別を扱う。'},
        {id:'v3',x:808,y:330,label:'V3',sub:'retained refinement',glyph:'+',color:colors.teal,note:'V3は横方向のrefinement。すでに保持されたside/reference informationでcompatible worldsを縮める。'},
        {id:'tnoa',x:700,y:465,label:'TNOA',sub:'semantic preservation',glyph:'◎',color:colors.blue,note:'TNOAはrowが存在する世界で、target/nuisance/observability/unresolvedを潰さず残す。'},
        {id:'boundary',x:555,y:505,label:'Boundary',sub:'identification ceiling',glyph:'≈',color:colors.blue,note:'Boundaryは現在のobservation mapが作る観察同値類を露出させる。'},
        {id:'ced',x:455,y:430,label:'CED',sub:'evidence licensing',glyph:'□',color:colors.violet,note:'CEDはCRESTのrequired stateと観測証拠が交差する関門。required ≠ identified ≠ reportable。'},
        {id:'mrod',x:630,y:575,label:'MROD',sub:'active refinement',glyph:'⇢',color:colors.blue,note:'MRODは未識別世界を当てるのでなく、次の観測で同値類を割るため外側へ戻るportal。'},
        {id:'eog',x:245,y:440,label:'EOG',sub:'compatible worlds',glyph:'Ω',color:colors.green,note:'EOGは観測分布からpossible/reachable world setへ再展開する。内向き圧縮に対する逆向きのworld reconstruction。'},
        {id:'theouni',x:500,y:90,label:'theouni',sub:'map of maps',glyph:'?',color:colors.gray,note:'theouniは世界の中の一層ではなく、どの地図を使っているかを記録するmeta-observer。'}
      ],
      edges:[
        {from:'crest',to:'ced',label:'required → licensed',color:colors.violet},
        {from:'rec',to:'boundary',label:'missing support',color:colors.blue},
        {from:'v3',to:'boundary',label:'refine',color:colors.teal},
        {from:'tnoa',to:'boundary',label:'preserve',color:colors.blue},
        {from:'boundary',to:'mrod',label:'unresolved → next',color:colors.blue},
        {from:'eog',to:'mrod',label:'world disagreement',color:colors.green,locked:true,note:'候補世界の不一致をMRODの測定候補へ直接渡す一般adapterはまだ未閉合。'}
      ]
    },
    observe:{
      question:'REC/V3/TNOAは兄弟操作。Boundaryが現在の限界を測り、MRODが次観測を選び、PolliPi/InsePiが訪花観察へ物理化する。',
      nodes:[
        {id:'omega',x:500,y:92,label:'Ω WORLD',sub:'unseen distinctions',glyph:'Ω',color:colors.white,note:'観察不可能性は世界の属性ではなく、問いと観測写像に対して生じる。'},
        {id:'rec',x:270,y:235,label:'REC',sub:'no row / missing support',glyph:'∅',color:colors.blue,note:'最終データから消えた世界。external exposure/referenceがないとno eventと区別できない。'},
        {id:'v3',x:500,y:220,label:'V3',sub:'side-info refinement',glyph:'+',color:colors.teal,note:'保持済み情報でcompatible setを縮める。REC→TNOAの固定段階ではない。'},
        {id:'tnoa',x:730,y:235,label:'TNOA',sub:'T/N/O/C/U',glyph:'◎',color:colors.blue,note:'観測された証拠の意味的不識別性を保持する。noise対signalの二値化より広い。'},
        {id:'boundary',x:500,y:365,label:'Boundary',sub:'what is identifiable?',glyph:'≈',color:colors.violet,note:'今の観測mapでは何が同じに見えるか。'},
        {id:'mrod',x:500,y:500,label:'MROD',sub:'what next?',glyph:'⇢',color:colors.blue,note:'残ったmechanism/world ambiguityを最も分ける次観測を選ぶ。'},
        {id:'pollipi',x:350,y:620,label:'PolliPi',sub:'target-facing record',glyph:'●',color:colors.amber,note:'訪花観察ならどう実装するか。比較可能なprimary recordとtarget-facing candidate evidence。'},
        {id:'insepi',x:650,y:620,label:'InsePi',sub:'nuisance / observability',glyph:'◌',color:colors.pink,note:'観察可能世界の反対側。noise/observability/shared-optical failureを物理介入で診断する。'},
        {id:'ced',x:810,y:420,label:'CED',sub:'reportability gate',glyph:'□',color:colors.violet,note:'Boundaryが識別限界を問うのに対し、CEDは要求されたtarget/stateを証拠が報告してよいかを問う。'}
      ],
      edges:[
        {from:'omega',to:'rec',label:'entry loss',color:colors.blue},
        {from:'omega',to:'v3',label:'retained reference',color:colors.teal},
        {from:'omega',to:'tnoa',label:'entered evidence',color:colors.blue},
        {from:'rec',to:'boundary',label:'support ceiling',color:colors.blue},
        {from:'v3',to:'boundary',label:'refinement',color:colors.teal},
        {from:'tnoa',to:'boundary',label:'semantics',color:colors.blue},
        {from:'boundary',to:'mrod',label:'equivalence → design',color:colors.violet},
        {from:'mrod',to:'pollipi',label:'new target channel',color:colors.amber,locked:true,note:'MROD→PolliPiを閉じるには、MRODが選んだ観測を実際の訪花装置でprospectiveに取得してambiguity reductionをheld-out評価する。'},
        {from:'mrod',to:'insepi',label:'new diagnostic',color:colors.pink,locked:true,note:'MROD→InsePiを閉じるには、選択された観測/介入が物理observer failureを分けることをV13等で確認する。'},
        {from:'boundary',to:'ced',label:'identified? reportable?',color:colors.violet}
      ]
    },
    state:{
      question:'CREST系は「必要な区別」の宇宙。観測系は「見える区別」の宇宙。CEDで交差し、ここから自然データへ降ろす。',
      nodes:[
        {id:'ccoc',x:250,y:205,label:'CCOC',sub:'future grammar',glyph:'Γ',color:colors.violet,note:'未来に許される操作が増えると、今まで潰せた区別が必要になる。'},
        {id:'mltr',x:500,y:145,label:'MLTR',sub:'history / semantics',glyph:'H',color:colors.magenta,note:'同じ現在でも、異なる履歴が異なる意味を運ぶならhistoryを保持する。'},
        {id:'mrm',x:750,y:205,label:'MRM',sub:'mechanism response',glyph:'Θ',color:colors.blue,note:'同じvisible stateでもfuture responseが異なるmechanismはstate-relevantになりうる。'},
        {id:'crest',x:500,y:330,label:'CREST',sub:'least-information required state',glyph:'◇',color:colors.white,note:'future/history/mechanism/evidence responsibilitiesを満たす最小stateを統合する。'},
        {id:'boundary',x:270,y:455,label:'Boundary',sub:'current observation map',glyph:'≈',color:colors.blue,note:'CRESTが必要と言った区別を、今の観測mapがそもそも見分けられるか。'},
        {id:'ced',x:500,y:475,label:'CED',sub:'evidence / target license',glyph:'□',color:colors.violet,note:'CEDが二宇宙の交点。required stateをcurrent evidenceがidentify/reportできるか。'},
        {id:'mrod',x:730,y:455,label:'MROD',sub:'earn missing distinction',glyph:'⇢',color:colors.blue,note:'不足する区別を次観測で獲得する。'},
        {id:'egwee',x:500,y:620,label:'EGWEE',sub:'natural-data gate',glyph:'○',color:colors.brown,note:'candidate state/proxyが自然データでendpoint-relevant statusを本当に獲得するかを検査する現実接点。'}
      ],
      edges:[
        {from:'ccoc',to:'crest',label:'future obligation',color:colors.violet},
        {from:'mltr',to:'crest',label:'history obligation',color:colors.magenta},
        {from:'mrm',to:'crest',label:'mechanism obligation',color:colors.blue},
        {from:'crest',to:'ced',label:'required state',color:colors.white},
        {from:'boundary',to:'ced',label:'identified state',color:colors.blue},
        {from:'ced',to:'mrod',label:'unlicensed → measure',color:colors.violet},
        {from:'ced',to:'egwee',label:'project to natural data',color:colors.brown,locked:true,note:'CREST/CED→EGWEEを完全に閉じるには、required state・observation contract・held-out future endpointを同じnatural systemで同期する。'},
        {from:'mrm',to:'mrod',label:'ideal burden → practical design',color:colors.blue,locked:true,note:'MRMのresponse signature/probe costをMRODのadmissible region/candidate observationへ写す明示adapterは未実装。'}
      ]
    },
    field:{
      question:'SDMR→ODSP→EOGは世界表現を深くする上流。ACSPだけが候補patchとして現実へ戻る出口。ただし候補patch ≠ occupancy。',
      nodes:[
        {id:'records',x:120,y:350,label:'OCCURRENCE / SENSOR',sub:'public + primary records',glyph:'·',color:colors.gray,note:'出発点は観測記録。absenceやtrue useを勝手に付与しない。'},
        {id:'sdmr',x:285,y:260,label:'SDMR',sub:'admit coordinates',glyph:'1',color:colors.green,note:'どのenvironmental dimensionsをrepresentationに入れるかをsealed predictionで監査する。empirical promotionはnot supported。'},
        {id:'odsp',x:460,y:205,label:'ODSP',sub:'thicken state space',glyph:'2',color:colors.teal,note:'x-y地図が消すz/t等のadded-axis thicknessとtransferabilityを分ける。'},
        {id:'eog',x:635,y:260,label:'EOG',sub:'compatible / reachable worlds',glyph:'3',color:colors.blue,note:'local suitabilityを超えて、compatible worlds・reachability・realizabilityを保持する。'},
        {id:'acsp',x:805,y:350,label:'ACSP',sub:'candidate patches',glyph:'4',color:colors.amber,note:'validated Japanese-domainでは同面積randomよりheld-out occurrenceをenrichするcandidate patchを返す。occupancy probabilityやexact siteではない。'},
        {id:'fieldtruth',x:675,y:570,label:'FIELD RETURN',sub:'aza3 · surveys · sensors',glyph:'⌖',color:colors.pink,note:'ここで初めて新しいprimary evidenceに戻る。'},
        {id:'mrod',x:420,y:535,label:'MROD',sub:'WHAT to measure',glyph:'?',color:colors.violet,note:'ACSPがWHEREならMRODはWHAT。両方揃って調査設計になる。'},
        {id:'284b',x:285,y:420,label:'284b',sub:'SEALED · from 2.8.4',glyph:'?',color:colors.gray,note:'SDMR v2.8.4由来のstaging fragment。独立question/evidence contractがないためまだ宇宙に昇格しない。',sealed:true}
      ],
      edges:[
        {from:'records',to:'sdmr',label:'representation',color:colors.gray},
        {from:'sdmr',to:'odsp',label:'flattening → axes',color:colors.green},
        {from:'odsp',to:'eog',label:'state → worlds',color:colors.teal},
        {from:'eog',to:'acsp',label:'worlds → where',color:colors.blue},
        {from:'mrod',to:'acsp',label:'WHAT ↔ WHERE',color:colors.violet},
        {from:'acsp',to:'fieldtruth',label:'candidate ≠ certainty',color:colors.amber,locked:true,note:'prospective field closureにはeffort/detectability denominator付きの実調査が必要。ACSPの現在claimはenrichmentであり「絶対見つかる」ではない。'},
        {from:'sdmr',to:'284b',label:'from 2.8.4',color:colors.gray,locked:true,note:'284bは独立科学questionを宣言するまでlocked staging。'}
      ]
    },
    evolve:{
      question:'SCH→BALANCE→BITA→PAYOFFはarchitecture worlds。EGC/EGWEはrelational future-state worlds。両者の橋は「architectureがinteraction relational stateを作るか」で未閉合。',
      nodes:[
        {id:'sch',x:150,y:270,label:'SCH',sub:'shared-coordinate conflict',glyph:'S',color:colors.magenta,note:'二機能が一つのtrait coordinateを共有したときのconflict/compromise world。'},
        {id:'balance',x:335,y:210,label:'BALANCE',sub:'middle world',glyph:'B',color:colors.amber,note:'L>0だがdifferentiated architectureがまだpayしない中間world。'},
        {id:'bita',x:520,y:270,label:'BITA',sub:'differentiated world',glyph:'D',color:colors.pink,note:'追加trait dimensionがcompromise lossを回収しarchitecture costを上回るworld。'},
        {id:'payoff',x:690,y:200,label:'PAYOFF',sub:'architecture game',glyph:'Π',color:colors.violet,note:'SCH/BALANCE/BITAのpayoff objectをinvasion/fixation/space/timeへtransportする。'},
        {id:'egc',x:720,y:410,label:'EGC',sub:'eco-genetic criticality',glyph:'E',color:colors.brown,note:'interaction/genetic state separationとfragmentationをfinite modelで扱う。'},
        {id:'egwe',x:520,y:500,label:'EGWE',sub:'relational future state',glyph:'R',color:colors.brown,note:'coarse marginalsが同じでもcross-layer alignmentが違えばfuture transitionが違いうる。'},
        {id:'egwee',x:315,y:555,label:'EGWEE',sub:'natural-data gates',glyph:'○',color:colors.teal,note:'candidate stateが自然データでfuture endpointを予測するかを先に試す。'},
        {id:'island',x:115,y:500,label:'ISLAND / URBAN',sub:'contrasting routes',glyph:'⌁',color:colors.green,note:'urbanとislandは同じ原因ではなく、candidate stateへ収束するかを比較する異なるcausal routes。'}
      ],
      edges:[
        {from:'sch',to:'balance',label:'conflict exists',color:colors.magenta},
        {from:'balance',to:'bita',label:'crossing',color:colors.amber},
        {from:'bita',to:'payoff',label:'architecture payoff',color:colors.pink},
        {from:'payoff',to:'egc',label:'architecture → relational state ?',color:colors.violet,locked:true,note:'未閉合の重要伏線。共通系でarchitecture stateを操作/比較し、その後のinteraction architecture・genetic/trait alignment・future functionまで同期測定できれば開く。'},
        {from:'egc',to:'egwe',label:'state / warning extension',color:colors.brown},
        {from:'egwe',to:'egwee',label:'natural-data projection',color:colors.teal},
        {from:'egwee',to:'island',label:'state convergence test',color:colors.green},
        {from:'island',to:'egwe',label:'origin/history residual?',color:colors.green,locked:true,note:'island/urban originがcandidate stateを入れた後もheld-out future lossを予測するならstateは不完全。消えればtested-scale convergenceが閉じる。'}
      ]
    }
  };

  function nodeBy(layout,id){return layout.nodes.find(n=>n.id===id)}
  function edgePath(a,b){
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
    return {d:`M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`,mx,my};
  }
  function render(mode){
    const layout=layouts[mode]; if(!layout)return;
    svg.querySelectorAll('.world-game-layer').forEach(el=>el.remove());
    portals.innerHTML='';
    let background='';
    if(mode==='world'){
      background=layout.rings.map((r,i)=>`<circle class="wg-ring ${i===0||i===layout.rings.length-1?'is-key':''}" cx="500" cy="355" r="${r.r}"/><text class="wg-layer-label" x="500" y="${355-r.r+15}">${r.label}</text>`).join('');
    }else{
      background=`<line class="wg-axis" x1="95" y1="355" x2="905" y2="355"/><line class="wg-axis" x1="500" y1="70" x2="500" y2="650"/>`;
    }
    const edgeMarkup=layout.edges.map(e=>{
      const a=nodeBy(layout,e.from),b=nodeBy(layout,e.to); if(!a||!b)return'';
      const p=edgePath(a,b),w=Math.max(68,e.label.length*6.7+18),lock=e.locked?`<circle class="wg-lock" cx="${p.mx}" cy="${p.my-24}" r="10"/><text class="wg-lock-text" x="${p.mx}" y="${p.my-24}">?</text>`:'';
      const note=(e.note||`${e.from} → ${e.to}: ${e.label}`).replace(/"/g,'&quot;');
      return `<g class="wg-edge-group ${e.locked?'is-locked':''}" data-note="${note}" style="--edge:${e.color||colors.white}"><path class="wg-edge-halo" d="${p.d}"/><path class="wg-edge" d="${p.d}" marker-end="url(#wgArrow)"/><rect class="wg-edge-label-bg" x="${(p.mx-w/2).toFixed(1)}" y="${(p.my-10).toFixed(1)}" width="${w.toFixed(1)}" height="20"/><text class="wg-edge-label" x="${p.mx}" y="${p.my}">${e.label}</text>${lock}</g>`;
    }).join('');
    const nodeMarkup=layout.nodes.map(n=>{
      const note=(n.note||n.label).replace(/"/g,'&quot;');
      return `<g class="wg-node ${n.sealed?'wg-sealed':''}" data-note="${note}" tabindex="0" role="button" style="--node:${n.color||colors.white}"><circle class="wg-node-halo" cx="${n.x}" cy="${n.y}" r="30"/><circle class="wg-node-core" cx="${n.x}" cy="${n.y}" r="22"/><text class="wg-node-glyph" x="${n.x}" y="${n.y}">${n.glyph||'·'}</text><text class="wg-node-label" x="${n.x}" y="${n.y+43}">${n.label}</text><text class="wg-node-sub" x="${n.x}" y="${n.y+56}">${n.sub||''}</text></g>`;
    }).join('');
    const centre=`<circle class="wg-centre" cx="500" cy="355" r="48"/><text class="wg-centre-title" x="500" y="350">${mode.toUpperCase()}</text><text class="wg-centre-sub" x="500" y="369">change perspective</text>`;
    portals.insertAdjacentHTML('beforebegin',`<g class="world-game-layer" aria-label="research perspective ${mode}">${background}${edgeMarkup}${centre}${nodeMarkup}</g>`);
    say(layout.question);
    stage.querySelectorAll('.world-lens-btn').forEach(btn=>btn.classList.toggle('is-active',btn.dataset.worldLens===mode));
    svg.querySelectorAll('.wg-node,.wg-edge-group').forEach(el=>{
      const reveal=()=>say(el.dataset.note||layout.question);
      el.addEventListener('mouseenter',reveal);
      el.addEventListener('focus',reveal);
      el.addEventListener('click',reveal);
    });
  }

  stage.querySelectorAll('.world-lens-btn').forEach(btn=>btn.addEventListener('click',()=>render(btn.dataset.worldLens)));
  render('world');
})();
