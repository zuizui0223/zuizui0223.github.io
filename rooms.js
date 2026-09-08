/* Rooms of one tower. Navigation never changes the direction or status of a claim.
 * Additive enhancement: the original tower, audits and archive remain intact. */
(() => {
'use strict';
const D=window.ZUIZUI_TOWER, $=id=>document.getElementById(id);
if(!D||!$('scene'))return;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), TAU=2*Math.PI;
const repos=new Map(D.repos.map(r=>[r[0],r]));
const short=id=>({'hotarubukuro':'HOTARU','shimahotarubukuro':'SHIMA-HO','eco-genetic-criticality':'EGC','eco-genetic-warning-extensions':'EGWE'}[id]||id.toUpperCase());
const source=(id,path='')=>`https://github.com/zuizui0223/${encodeURIComponent(id)}${path?'/blob/main/'+path:''}`;
// Frozen display snapshot, not an assertion that membership cannot later change.
const membership=Object.freeze({hotarubukuro:'O',azami:'O',bita:'TO',island:'O',mrod:'TM',pollipi:'MP',insepi:'TMP',acsp:'MO','eco-genetic-criticality':'T',ccoc:'T','izu-core':'TO','eco-genetic-warning-extensions':'T',mltr:'T',ced:'TM',mrm:'T',shimahotarubukuro:'P',fcp:'O',eog:'TMO',odsp:'TMO',EAzami:'O',chun:'O',sdmr:'TMO',crest:'T',theouni:'T',tnoa:'TM',aza3:'P',sch:'TOP',boundary:'TM',rec:'MOP',egwee:'MO',balance:'TOP',v3:'TM',payoff:'T','284b':'?','TTF':'M','adaptive-gain':'T'});
const alphabet=Object.freeze({T:{name:'理論',en:'Theory',path:'M6 25L16 5L26 25ZM11 21L16 11L21 21'},M:{name:'方法',en:'Method',path:'M4 13L13 4L22 13L13 22ZM10 19L19 10L28 19L19 28Z'},O:{name:'公開データ',en:'Open data',path:'M5 5H27V27H5ZM10 11H12M20 11H22M10 21H12M20 21H22'},P:{name:'一次データ',en:'Primary data',path:'M16 28V12M16 20C4 20 5 7 5 7C17 7 16 20 16 20M16 14C27 14 27 3 27 3C17 3 16 14 16 14'}});
function glyph(t,cls=''){return alphabet[t]?`<svg class="r-glyph ${cls}" viewBox="0 0 32 32" aria-hidden="true"><path d="${alphabet[t].path}"/></svg>`:'<span class="r-unknown" aria-hidden="true">?</span>';}
function glyphs(id){return [...(membership[id]||'?')].map(t=>glyph(t)).join('');}
// Art direction is a visual metaphor, not a new scientific result.
const art={
 hotarubukuro:['garden','離れた花、同じ色。'],fcp:['tiles','色の下に、空間。'],chun:['rings','今の色に、長い時間。'],azami:['thistle','いま見える形。'],EAzami:['branch','似た形、違う来歴。'],aza3:['specimens','三つの証拠を、同じ場所で。'],island:['islands','海は隔てる。何を？'],'izu-core':['islands','島の間に、関係。'],shimahotarubukuro:['garden','ここで採る、ひとつの花。'],
 TTF:['slices','同じ方法でも、標本配置が変われば？'],
 'adaptive-gain':['branch','次を、結果を見てから選ぶ。'],
 pollipi:['camera','花から、記録へ。'],insepi:['camera','花ではなく、見る側を疑う。'],rec:['missing','空白も、世界の一部。'],v3:['prism','もう一つの参照。'],tnoa:['tablets','まとめる前に、残す。'],boundary:['twins','同じ影は、同じ物ではない。'],mrod:['prism','次は、どちらから見る？'],sdmr:['axes','どの軸を、持ち込む？'],odsp:['slices','一枚では、見えない。'],eog:['portals','届くことと、生きられること。'],'284b':['relation','違う答えを、同じ機会へ。'],acsp:['survey','ここを探す。いるとは限らない。'],
 ccoc:['branch','つないだ先で、違いが出る。'],mltr:['rings','道のりを、忘れていい？'],mrm:['twins','触れ方が、機構を分ける。'],crest:['crystal','残すべき、最小の区別。'],ced:['balance','言葉の重さを、証拠で支える。'],theouni:['tablets','違う理論に、通じる文法。'],sch:['balance','ひとつの形を、分け合う。'],balance:['balance','分かれない、という形。'],bita:['branch','分かれて、取り戻す。'],payoff:['game','その形は、残れるか。'],'eco-genetic-criticality':['network','数ではなく、つながり。'],'eco-genetic-warning-extensions':['network','未来へ残る、関係。'],egwee:['relation','自然が、答えを問い返す。']};
const shortConditions={
 'observation-map':'残した区別 → 識別できる区別','next-observation':'両立集合 → 次の測定','state-obligation':'未来・履歴・機構 → 必要状態','evidence-license':'必要状態 × 観測 → 報告',
 'niche-worlds':'座標 → 多次元状態 → 両立世界','relation-space':'別々の答え → 共通の生物学的機会','field-return':'候補地 × 対照地 × 検出努力','architecture-game':'葛藤・回復・費用 → 構造の利得','warning-projection':'自然での状態照合 ≠ 警告の検証',
 'state-payoff':'関係状態 → 利得座標：同一系で照合','architecture-state':'構造 → 関係 → 未来：同一系で測る','island-urban':'状態を揃えた後、起源は残る？','mrm-mrod':'応答署名 × 候補測定 × 費用','ced-mrod':'対象と機構を、同じ観測契約へ','eog-mrod':'世界の不一致 → 観測の分割','same-system':'同一装置 × 独立真値 × 未見採点','natural-state':'必要状態 × 観測 × 未見の未来','transfer-geometry':'標本配置 × held-out transfer','geometry-boundary':'idealized calibration ≠ actual geometry','adaptive-routing':'途中結果 → 次の測定；固定bundleとの費用差'};
const statusGlyph={established:'—',bounded:'≈',proposed:'⋯',open:'⋯',navigation:'⌁'};
const statusText={established:'概念接点',bounded:'限定した接点',proposed:'接続仮説',open:'未閉合',navigation:'館内の回廊'};
const galleries=[['hotarubukuro','fcp','chun'],['azami','EAzami','aza3'],['island','izu-core','shimahotarubukuro'],['crest','theouni'],['fcp','TTF'],['mrod','adaptive-gain']];
const state={room:null,yaw:.64,target:.64,pitch:.49,frame:0,drag:null,suppress:0,scroll:0,focus:null,mapFocus:null,filter:null,bookOrigin:null};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let visited=new Set(),decoded=new Set(),gateSeen=new Set(),positions=[],faces=[],doors=[],camera={w:1,h:1,scale:1,x:0,y:0},yawByRoom=new Map();
try{const s=JSON.parse(localStorage.getItem('zuizui.rooms.v1')||'{}');visited=new Set((Array.isArray(s.visited)?s.visited:[]).filter(x=>repos.has(x)));decoded=new Set((Array.isArray(s.decoded)?s.decoded:[]).filter(x=>alphabet[x]));}catch(_){/* Private browsing is playable. */}
const persist=()=>{try{localStorage.setItem('zuizui.rooms.v1',JSON.stringify({visited:[...visited],decoded:[...decoded]}));}catch(_){}};
const announce=s=>{$('live').textContent=s;};
function exits(id){
 const out=[];
 for(const c of D.contacts){
  const forward=c.from.includes(id),reverse=c.to.includes(id);
  if(!forward&&!reverse)continue;
  for(const target of forward?c.to:c.from)if(target!==id&&repos.has(target))out.push({key:c.id+':'+target,target,contact:c,reverse:!forward,status:c.status});
 }
 // These are explicitly labelled navigation, NOT new scientific arrows.
 for(const group of galleries)if(group.includes(id))for(const target of group)if(target!==id&&!out.some(x=>x.target===target))out.push({key:'gallery:'+target,target,status:'navigation',reverse:false});
 out.push({key:'tower',target:null,status:'navigation',reverse:false});return out;
}
const shell=document.createElement('section');shell.id='roomWorld';shell.hidden=true;shell.setAttribute('aria-label','塔の部屋');
shell.innerHTML=`<canvas id="roomCanvas" aria-label="立体の研究室。左右に回すと別の出口が見えます。" role="img"></canvas><div class="room-heading"><button id="roomBack" aria-label="塔へ戻る">↟</button><div><span id="roomFloor"></span><h1 id="roomTitle" tabindex="-1"></h1></div></div><div id="roomDoors" aria-label="部屋の出口"></div><div id="roomInscriptions" aria-label="この部屋のTMOP記号"></div><button id="roomRelic" aria-label="部屋の手掛かりと出典を読む">◈</button><div class="room-bottom"><button id="roomLeft" aria-label="室内を左へ回す">↶</button><span id="roomCompass" aria-hidden="true"></span><button id="roomRight" aria-label="室内を右へ回す">↷</button></div><div class="room-footnote"><span id="roomCounter"></span><button id="roomPlan" aria-label="館内の平面地図を開く">⌗</button></div>`;
document.body.appendChild(shell);
const cv=$('roomCanvas'),ctx=cv.getContext('2d');if(!ctx){shell.remove();return;}
const plan=document.createElement('dialog');plan.id='roomMap';plan.setAttribute('aria-labelledby','planTitle');
plan.innerHTML=`<div class="plan-head"><div><span class="r-eyebrow">atlas</span><h2 id="planTitle">⌗</h2></div><div id="planFilters"></div><button id="planClose" aria-label="地図を畳む">×</button></div><div id="planPaper"></div><div class="plan-tail"><span id="planLocation">⌁</span><button id="planKey" aria-label="記号の意味を調べる">△ ◇ ▦ ♧</button></div>`;
document.body.appendChild(plan);
const mapButton=document.createElement('button');mapButton.id='mapButton';mapButton.className='icon-button';mapButton.innerHTML='⌗';mapButton.setAttribute('aria-label','同じ塔の平面地図を開く');$('bookButton').before(mapButton);
// Obvious but small arch silhouettes replace the old invisible 40px hit targets.
document.querySelectorAll('.doorway').forEach(b=>{const id=b.dataset.repo;b.innerHTML=`<span class="entrance-rune">${glyph((membership[id]||'?')[0])}</span>`;b.setAttribute('aria-label',`${short(id)}の部屋へ入る`);});
function freezeScroll(){state.scroll=scrollY;document.body.classList.add('inside-room');document.body.style.top=-state.scroll+'px';$('ascent').inert=true;}
function restoreScroll(){document.body.classList.remove('inside-room');document.body.style.top='';$('ascent').inert=false;scrollTo({top:state.scroll,behavior:'instant'});}
function closeBook(){if($('notebook').open)$('notebook').close();}
function navigate(id,historyMode='push'){
 if(id&&!repos.has(id))return;
 closeBook();if(plan.open)plan.close();
 if(state.room)yawByRoom.set(state.room,state.yaw);
 if(id){if(!state.room){state.focus=document.activeElement;freezeScroll();}state.room=id;visited.add(id);persist();shell.hidden=false;state.yaw=state.target=yawByRoom.get(id)??.64;state.pitch=.49;buildRoom();$('roomTitle').focus({preventScroll:true});announce(`${short(id)}の部屋。左右に視点を変えると、別の出口が見えます。`);}
 else{const had=!!state.room;state.room=null;shell.hidden=true;if(had){restoreScroll();if(state.focus?.isConnected)state.focus.focus({preventScroll:true});}announce('塔へ戻りました。');}
 if(historyMode==='push')history.pushState({room:id},'',id?'#room='+encodeURIComponent(id):'#tower');
 requestDraw();
}
function route(){let id=null;try{if(location.hash.startsWith('#room='))id=decodeURIComponent(location.hash.slice(6));}catch(_){}navigate(repos.has(id)?id:null,'none');}
addEventListener('popstate',route);
function wallPoint(side,t,y=0){const r=176;return [[t,y,-r],[r,y,t],[-t,y,r],[-r,y,-t]][side];}
const inward=[[0,0,1],[-1,0,0],[0,0,-1],[1,0,0]];
function addFace(v,n,color,tag='solid'){faces.push({v,n,color,tag});}
function box(x,y,z,w,h,d,color,tag='solid'){
 const a=x-w/2,b=x+w/2,c=z-d/2,e=z+d/2,t=y+h;
 addFace([[a,t,c],[b,t,c],[b,t,e],[a,t,e]],[0,1,0],color,tag);
 addFace([[a,y,e],[b,y,e],[b,t,e],[a,t,e]],[0,0,1],color,tag);
 addFace([[b,y,c],[a,y,c],[a,t,c],[b,t,c]],[0,0,-1],color,tag);
 addFace([[b,y,e],[b,y,c],[b,t,c],[b,t,e]],[1,0,0],color,tag);
 addFace([[a,y,c],[a,y,e],[a,t,e],[a,t,c]],[-1,0,0],color,tag);
}
function prism(x,y,z,r,h,col){const ps=Array.from({length:4},(_,i)=>[x+r*Math.cos(i*Math.PI/2),y,z+r*Math.sin(i*Math.PI/2)]);for(let i=0;i<4;i++){const j=(i+1)%4;addFace([ps[i],ps[j],[x,y+h,z]],[Math.cos((i+.5)*Math.PI/2),.5,Math.sin((i+.5)*Math.PI/2)],col,'relic');}}
function flower(x,z,h=38,spike=false){box(x,8,z,3,h,3,'#768b76','relic');for(let i=0;i<(spike?8:4);i++){const a=i*TAU/(spike?8:4);box(x+Math.cos(a)*9,8+h,z+Math.sin(a)*9,spike?4:11,spike?15:7,spike?4:11,spike?'#b495ba':'#c5b6ae','relic');}}
function buildRelic(kind,col){
 box(0,0,0,106,7,106,'#525c63','relic');box(0,7,0,88,5,88,col,'relic');
 switch(kind){
 case'garden':case'thistle':for(const [x,z,h]of[[-28,-22,44],[25,-15,62],[-12,23,30]])flower(x,z,h,kind==='thistle');break;
 case'islands':for(const[x,z,h]of[[-27,-24,14],[26,-10,22],[-10,30,9]]){box(x,12,z,29,h,27,'#91aaa0','relic');flower(x,z,h+20);}break;
 case'missing':case'tiles':case'survey':for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++){if(kind==='missing'&&x===0&&z===0)continue;box(x*26,12,z*26,22,kind==='survey'?3:9+8*(x+1),22,(x+z)%2?'#97b4a3':'#c1b89c','relic');}break;
 case'camera':box(0,17,0,42,32,26,'#899da6','relic');box(0,20,20,22,22,16,'#3a4853','relic');box(0,24,30,12,12,4,'#b7cec9','relic');for(const s of[-1,1])box(s*18,12,0,4,11,4,'#c8b695','relic');break;
 case'tablets':case'specimens':for(let j=-1;j<=1;j++){box(j*27,12,0,20,34+(j+1)*12,13,col,'relic');prism(j*27,49+(j+1)*12,0,7,12,'#ead7ab');}break;
 case'twins':box(-25,12,0,29,63,29,col,'relic');box(24,12,0,29,28,29,col,'relic');box(24,40,0,12,35,12,'#e0ca9c','relic');break;
 case'axes':case'slices':for(let i=0;i<3;i++)box(0,17+i*22,0,74-i*10,3,74-i*10,i===1?'#b2c1d0':col,'relic');box(0,12,0,3,84,3,'#e3cfab','relic');break;
 case'portals':for(let i=-1;i<=1;i++){box(i*30-9,12,i*15,4,49,6,col,'relic');box(i*30+9,12,i*15,4,49,6,col,'relic');box(i*30,61,i*15,22,4,6,col,'relic');}break;
 case'relation':box(-27,12,0,29,48,29,col,'relic');prism(27,12,0,23,57,'#d5c49d');box(0,37,0,36,4,6,'#e6cf99','relic');break;
 case'balance':box(0,12,0,5,65,5,'#c7b996','relic');box(0,71,0,79,4,6,'#c7b996','relic');box(-32,30,0,3,41,3,col,'relic');box(32,30,0,3,41,3,col,'relic');box(-32,25,0,26,5,26,col,'relic');box(32,25,0,26,5,26,col,'relic');break;
 case'game':for(const[x,z]of[[-26,-26],[26,-26],[0,28]]){box(x,12,z,20,7,20,col,'relic');prism(x,19,z,12,26,'#dbc696');}break;
 case'network':for(const[x,z,h]of[[-28,-25,40],[26,-15,58],[-10,26,27],[30,29,18]]){box(x,12,z,4,h,4,col,'relic');prism(x,h+12,z,9,16,'#d9bf98');}break;
 case'rings':for(let i=0;i<5;i++){box(-32+i*15,12,0,8,18+i*12,52-i*7,col,'relic');}break;
 case'branch':box(0,12,0,7,28,7,col,'relic');for(const s of[-1,1]){box(s*17,38,0,38,5,7,col,'relic');box(s*34,38,0,7,31,7,col,'relic');prism(s*34,69,0,12,19,'#dfc99c');}break;
 default:prism(0,15,0,34,90,col);prism(0,44,0,17,37,'#ead6b3');
 }
}
// Five chamber plans echo the outer building without rewriting a repository's role.
function stonePolygon(poly,y,h,col,tag='solid'){
 addFace(poly.map(([x,z])=>[x,y+h,z]),[0,1,0],col,tag);
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1;
  addFace([[a[0],y,a[1]],[b[0],y,b[1]],[b[0],y+h,b[1]],[a[0],y+h,a[1]]],[dz/l,0,-dx/l],col,tag);
 }
}
function roundStone(x,y,z,r,h,col,rz=r,n=40){stonePolygon(Array.from({length:n},(_,i)=>[x+r*Math.cos(i*TAU/n),z+rz*Math.sin(i*TAU/n)]),y,h,col);}
function chamberArc(x,y,z,r,ri,h,a,b,col,n=32){
 for(let i=0;i<n;i++){
  const t=a+(b-a)*i/n,u=a+(b-a)*(i+1)/n,m=(t+u)/2,q=(rr,t,dy)=>[x+rr*Math.cos(t),y+dy,z+rr*Math.sin(t)];
  addFace([q(ri,t,h),q(r,t,h),q(r,u,h),q(ri,u,h)],[0,1,0],col);
  addFace([q(r,t,0),q(r,u,0),q(r,u,h),q(r,t,h)],[Math.cos(m),0,Math.sin(m)],col);
  addFace([q(ri,u,0),q(ri,t,0),q(ri,t,h),q(ri,u,h)],[-Math.cos(m),0,-Math.sin(m)],col);
 }
}
function chamberRing(o,r,ri,d,col,angle=0){
 const q=(rr,t,z)=>[o[0]+rr*Math.cos(t)*Math.cos(angle)+z*Math.sin(angle),o[1]+rr*Math.sin(t),o[2]-rr*Math.cos(t)*Math.sin(angle)+z*Math.cos(angle)];
 for(let i=0;i<48;i++){
  const t=i*TAU/48,u=(i+1)*TAU/48,m=(t+u)/2;
  for(const z of[-d/2,d/2])addFace([q(ri,t,z),q(r,t,z),q(r,u,z),q(ri,u,z)],[Math.sin(angle)*Math.sign(z),0,Math.cos(angle)*Math.sign(z)],col);
  addFace([q(r,t,-d/2),q(r,u,-d/2),q(r,u,d/2),q(r,t,d/2)],[Math.cos(m)*Math.cos(angle),Math.sin(m),-Math.cos(m)*Math.sin(angle)],col);
 }
}
function cypress(x,z,h){
 box(x,5,z,3,h*.3,3,'#ac9165');
 const n=8,r=h*.17,pts=Array.from({length:n},(_,i)=>[x+r*Math.cos(i*TAU/n),h*.48,z+r*Math.sin(i*TAU/n)]);
 for(let i=0;i<n;i++){const j=(i+1)%n,a=(i+.5)*TAU/n;
  addFace([[x,10,z],pts[j],pts[i]],[Math.cos(a),.2,Math.sin(a)],'#3a6053');
  addFace([pts[i],pts[j],[x,h,z]],[Math.cos(a),.2,Math.sin(a)],'#537965');
 }
}
function walkway(end,col){
 const L=Math.hypot(end[0],end[2]),nx=-end[2]/L*15,nz=end[0]/L*15;
 stonePolygon([[nx,nz],[end[0]+nx,end[2]+nz],[end[0]-nx,end[2]-nz],[-nx,-nz]].reverse(),-5,10,col);
}
function chamberFloor(f,col){
 const P=window.ZUIZUI_ARCHITECTURE.palette;
 const oct=[[-196,-122],[-122,-196],[126,-196],[196,-126],[196,121],[121,196],[-123,196],[-196,126]];
 if(f===0){
  stonePolygon(oct,-22,14,P.ink);stonePolygon(oct.map(([x,z])=>[x*.96,z*.96]),-8,13,P.chalk);
  chamberArc(101,5,92,69,34,1,-.6,3.9,P.water);chamberArc(101,5,92,74,69,6,-.6,3.9,P.light);
  box(-108,5,-94,77,5,51,P.jade);cypress(-128,-109,109);cypress(-94,-89,68);
  box(-63,5,114,111,7,21,P.clayLight);
 }else if(f===1){
  stonePolygon(oct,-20,15,P.clay);stonePolygon(oct.map(([x,z])=>[x*.94,z*.94]),-5,10,P.clayLight);
  box(95,5,-126,12,142,13,P.chalk);box(141,5,-106,12,112,13,P.chalk);
  for(let i=0;i<7;i++)box(-140+i*10,5,-144,4,73+(i%2)*19,8,P.clay);
  box(-110,80,-144,66,6,11,P.chalk);
 }else if(f===2){
  roundStone(0,-18,0,212,17,P.jadeDark);roundStone(0,-1,0,201,6,P.chalk);
  chamberArc(0,5,0,207,196,35,3.26,5.92,P.jade);
  chamberArc(0,5,0,206,199,11,.15,2.55,P.light);
  chamberRing([27,116,-117],68,51,12,P.light,.08);
  box(27,5,-117,18,44,26,P.clayLight);
 }else if(f===3){
  roundStone(0,-12,0,80,17,P.chalk,66,20);
  for(const [x,z,h]of[[-130,-74,121],[-84,-127,147],[123,68,79]]){
   box(x,5,z,12,h,45,P.chalk);box(x,h+5,z,17,4,49,P.light);
  }
  box(-111,5,-83,7,101,16,P.jade);
 }else{
  stonePolygon([[-199,-61],[-148,-156],[26,-200],[186,-68],[200,118],[29,193],[-175,102]],-19,15,P.jade);
  roundStone(0,-4,0,199,9,P.chalk,185);
  for(const[x,z,h]of[[-125,-91,128],[71,-139,150],[118,99,78]])box(x,5,z,7,h,7,P.jadeDark);
  chamberArc(0,139,-19,160,157,4,3.03,5.36,P.brass,40);
  chamberRing([-94,130,-83],41,38,3,P.brass,-.45);
  chamberRing([-94,130,-83],25,23,3,P.brass,1.12);
  box(-94,5,-83,5,88,5,P.brass);
 }
}
function buildRoom(){
 const r=repos.get(state.room),col=window.ZUIZUI_ARCHITECTURE.stages[r[1]].color;faces=[];doors=exits(state.room);$('roomDoors').replaceChildren();
 $('roomFloor').textContent=D.floors[r[1]].roman;$('roomTitle').textContent=short(state.room);$('roomCounter').textContent=String(visited.size).padStart(2,'0')+' / '+D.repos.length;
 $('roomInscriptions').innerHTML=[...(membership[state.room]||'?')].map(t=>`<button data-rune="${t}" aria-label="${alphabet[t]?alphabet[t].name+'（'+t+'）の記号を調べる':'分類未監査'}">${glyph(t)}<span>${decoded.has(t)?t:'·'}</span></button>`).join('');
 chamberFloor(r[1],col);
 // Thresholds are distributed in one fixed room; camera rotation reveals backs.
 const bySide=[[],[],[],[]];doors.forEach((d,i)=>{d.side=i%4;bySide[d.side].push(d);});
 for(let side=0;side<4;side++){
  const list=bySide[side];list.forEach((d,i)=>{d.t=(i-(list.length-1)/2)*Math.min(88,266/Math.max(1,list.length));d.point=wallPoint(side,d.t,46);d.normal=inward[side];});
  // Narrow pillars/frame walls avoid painting a solid wall behind an open door.
  if(r[1]===2||r[1]===3||r[1]===4)continue;
  const wallHeight=r[1]===0?33:132;
  const slots=list.map(d=>d.t).sort((a,b)=>a-b);let a=-182;
  for(const t of[...slots.map(x=>x-27),182]){if(t>a){const p=wallPoint(side,(a+t)/2,5);box(p[0],p[1],p[2],side%2?11:t-a,wallHeight,side%2?t-a:11,col,'wall:'+side);}a=t+54;}
  const p=wallPoint(side,0,wallHeight+5);box(p[0],p[1],p[2],side%2?10:372,9,side%2?372:10,col,'wall:'+side);
 }
 doors.forEach(d=>{
  const b=document.createElement('button');b.className='room-door '+d.status;b.dataset.exit=d.key;b.dataset.target=d.target||'';
  b.setAttribute('aria-label',d.target?`${short(d.target)}への${statusText[d.status]}${d.reverse?'（元の関係を逆にたどる）':''}`:'塔へ戻る');
  b.innerHTML=`<span class="door-sigil">${d.target?glyph((membership[d.target]||'?')[0]):'↟'}</span><span class="door-name">${d.target?esc(short(d.target)):'↟'}</span><small>${d.reverse?'←':d.status==='navigation'?'⌁':statusGlyph[d.status]}</small>`;
  b.onclick=()=>{if(performance.now()<state.suppress)return;useExit(d);};$('roomDoors').appendChild(b);d.button=b;
 });
 if(r[1]===3)for(const d of doors)walkway(d.point,col);
 buildRelic(art[state.room][0],col);resize();
}
function project(p){const[x,y,z]=p,c=Math.cos(state.yaw),s=Math.sin(state.yaw),cp=Math.cos(state.pitch),sp=Math.sin(state.pitch),z1=x*s+z*c;return{x:camera.x+(x*c-z*s)*camera.scale,y:camera.y+(-(y-34)*cp+z1*sp)*camera.scale,d:y*sp+z1*cp};}
function facing(n){return n[0]*Math.sin(state.yaw)*Math.cos(state.pitch)+n[1]*Math.sin(state.pitch)+n[2]*Math.cos(state.yaw)*Math.cos(state.pitch);}
function shade(hex,n){const k=clamp(.75+n[1]*.15-n[0]*.12+n[2]*.08,.38,1.06);return'#'+hex.slice(1).match(/../g).map(x=>Math.round(parseInt(x,16)*k).toString(16).padStart(2,'0')).join('');}
function poly(ps,fill,stroke){ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.6;ctx.stroke();}}
function line(ps,color,width=1,dash=[]){ctx.beginPath();ps.map(project).forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
function inPoly(p,ps){let inside=false;for(let i=0,j=ps.length-1;i<ps.length;j=i++){const a=ps[i],b=ps[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inside=!inside;}return inside;}
function draw(){
 if(!state.room)return;ctx.clearRect(0,0,camera.w,camera.h);
 const col=D.floors[repos.get(state.room)[1]].color;
 const shadow=project([0,-35,0]);const g=ctx.createRadialGradient(shadow.x,shadow.y,0,shadow.x,shadow.y,270*camera.scale);g.addColorStop(0,col+'20');g.addColorStop(1,'#08090c00');ctx.fillStyle=g;ctx.fillRect(0,0,camera.w,camera.h);
 const visible=[];
 for(const f of faces){if(f.tag.startsWith('wall:')&&facing(inward[+f.tag.slice(5)])<.12)continue;if(facing(f.n)<=.01)continue;const ps=f.v.map(project);visible.push({f,ps,d:ps.reduce((s,p)=>s+p.d,0)/ps.length});}
 visible.sort((a,b)=>a.d-b.d);for(const p of visible)poly(p.ps,shade(p.f.color,p.f.n),shade(p.f.color,p.f.n));
 // A quiet floor engraving: evidence languages, not numerical confidence scores.
 for(let i=-3;i<=3;i++){if(Math.abs(i)<2){line([[-164,5.5,i*43],[-60,5.5,i*43]],'#263b3b19');line([[60,5.5,i*43],[164,5.5,i*43]],'#263b3b19');line([[i*43,5.5,-164],[i*43,5.5,-60]],'#263b3b19');line([[i*43,5.5,60],[i*43,5.5,164]],'#263b3b19');}else{line([[-164,5.5,i*43],[164,5.5,i*43]],'#263b3b19');line([[i*43,5.5,-164],[i*43,5.5,164]],'#263b3b19');}}
 positions=[];
 for(const d of doors){const p=project(d.point),visibleSide=facing(d.normal)>.20;
  const occluded=visible.some(v=>v.f.tag==='relic'&&v.d>p.d+5&&inPoly(p,v.ps));
  const on=visibleSide&&!occluded&&p.x>25&&p.x<camera.w-25&&p.y>105&&p.y<camera.h-100;
  d.button.hidden=!on;d.button.tabIndex=on?0:-1;
  // Project the actual doorway plane. Its silhouette narrows and tilts with the wall.
  const tangent=[d.normal[2],0,-d.normal[0]],corner=(u,v)=>project(d.point.map((x,i)=>x+tangent[i]*u+(i===1?v:0)));
  const tl=corner(-19,27),tr=corner(19,27),bl=corner(-19,-27),bw=54,bh=54*1.42;
  d.button.style.left=tl.x+'px';d.button.style.top=tl.y+'px';d.button.style.margin='0';d.button.style.transformOrigin='0 0';
  d.button.style.transform=`matrix(${(tr.x-tl.x)/bw},${(tr.y-tl.y)/bw},${(bl.x-tl.x)/bh},${(bl.y-tl.y)/bh},0,0)`;
  d.button.style.setProperty('--door-size',bw+'px');
  positions.push({key:d.key,target:d.target,status:d.status,reverse:d.reverse,point:[...d.point],x:p.x,y:p.y,visible:on});
  if(on){const base=wallPoint(d.side,d.t,6);const inner=base.map((v,i)=>v+d.normal[i]*34);const mid=[inner[0]*.4,6,inner[2]*.4];line([base,inner,mid],d.status==='open'||d.status==='proposed'?'#685f577a':'#5558546a',1.1,d.status==='open'||d.status==='proposed'?[4,6]:[]);}
 }
 const relic=project([0,109,0]);$('roomRelic').style.left=relic.x+'px';$('roomRelic').style.top=relic.y+'px';
 $('roomCompass').innerHTML=Array.from({length:4},(_,i)=>`<i class="${Math.round((((state.yaw%TAU)+TAU)%TAU)/(Math.PI/2))%4===i?'current':''}"></i>`).join('');
}
function requestDraw(){if(state.frame||document.hidden||!state.room)return;state.frame=requestAnimationFrame(tick);}
function tick(){state.frame=0;const gap=state.target-state.yaw;state.yaw+=gap*(reduced.matches?1:.19);if(Math.abs(gap)<.001)state.yaw=state.target;draw();if(Math.abs(state.yaw-state.target)>.001)requestDraw();}
function resize(){camera.w=innerWidth;camera.h=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);cv.width=Math.round(camera.w*dpr);cv.height=Math.round(camera.h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);camera.scale=Math.min((camera.w-48)/540,(camera.h-235)/365,1.72);camera.x=camera.w/2;camera.y=camera.h*.55;if(state.room)draw();requestDraw();}
function turn(n){state.target+=n;requestDraw();}
function note(html){const b=$('notebook');if(!b.open)state.bookOrigin=document.activeElement;$('bookContent').innerHTML=html;b.classList.add('glyph-notebook');if(!b.open)b.showModal();b.scrollTop=0;}
function detail(content){return `<details class="r-details"><summary>出典・条件</summary>${content}</details>`;}
function cards(rows){return `<div class="r-room-list">${rows.map(r=>`<button data-room="${r[0]}" aria-label="${short(r[0])}の部屋へ">${glyphs(r[0])}<strong>${esc(short(r[0]))}</strong><span>${visited.has(r[0])?'•':'◦'}</span></button>`).join('')}</div>`;}
function help(){note(`<h2 id="bookTitle">↔　◈　⌗</h2><div class="r-note-actions"><span>回す</span><span>調べる</span><span>地図を開く</span></div>${detail('<p>塔：縦スクロールで登る。横ドラッグで回す。部屋：横ドラッグまたは左右キーで回す。上下キーは室内の俯角。Escで塔へ。手帳や地図のEscは、その紙だけを閉じます。</p><p>扉は触れると入れます。格子戸は接続条件を読み、先の部屋を覗けます。覗いても科学的に未閉合のままです。</p>')}`);}
function journal(){
 note(`<span class="r-eyebrow">field notes / ${visited.size} : ${D.repos.length}</span><h2 id="bookTitle">四つのことば</h2><div class="r-alphabet">${Object.keys(alphabet).map(t=>`<button data-rune="${t}" aria-label="${alphabet[t].name}の記号を解く">${glyph(t)}<small>${decoded.has(t)?alphabet[t].name:'· · ·'}</small></button>`).join('')}</div><div class="r-note-actions"><button data-plan>⌗ 地図</button><button data-directory>⌕ 部屋</button></div><div class="r-seal-strip">${D.motifs.map(m=>`<button data-old-motif="${m.id}" aria-label="${D.floors[m.floor].name}の塔の手掛かり">${m.glyph}</button>`).join('')}</div>${detail('<p>記号はTMOPの証拠モード。理論・方法・公開データ・一次データ。上下関係や実証の強さではありません。</p><p>部屋の探索、記号の解読、科学的な検証は別です。</p><a href="tmop-audit.json">分類の台帳 ↗</a> · <a href="TOWER_AUDIT.md">塔の出典 ↗</a>')}`);
}
function directory(){note(`<h2 id="bookTitle">入口</h2><input id="roomSearch" class="repo-search" aria-label="部屋を検索" type="search" placeholder="⌕" autocomplete="off"><div id="roomSearchResults">${cards(D.repos)}</div>`);$('roomSearch').addEventListener('input',e=>{$('roomSearchResults').innerHTML=cards(D.repos.filter(r=>(r.join(' ')+' '+short(r[0])).toLowerCase().includes(e.target.value.toLowerCase())));});}
function rune(t){
 if(!alphabet[t]){note(`<h2 id="bookTitle">?</h2><p>284bのTMOP分類は、まだ台帳にありません。</p>${detail('<a href="tmop-audit.json">分類の台帳 ↗</a>')}`);return;}
 const examples=D.repos.filter(r=>(membership[r[0]]||'').includes(t));
 note(`<div class="r-rune-large">${glyph(t)}</div><h2 id="bookTitle">${decoded.has(t)?alphabet[t].name:'この印のある部屋'}</h2>${cards(examples.slice(0,3))}<div class="r-guess" data-symbol="${t}">${Object.keys(alphabet).map(k=>`<button data-answer="${k}" data-symbol="${t}"${decoded.has(t)&&k===t?' class="correct"':''}>${alphabet[k].name}</button>`).join('')}</div><p id="runeReply" class="r-rune-reply" aria-live="polite">${decoded.has(t)?t+' · '+alphabet[t].en:'· · ·'}</p>${detail('<p>三つの部屋を比較して、共通する証拠の扱いを探します。一つの部屋に、複数の記号があってもかまいません。</p><a href="tmop-audit.json">分類の台帳 ↗</a>')}`);
}
function relic(){if(!state.room)return;const r=repos.get(state.room);const path=state.room==='284b'?'docs/product_b_eog_sdmr_relation_space_alignment.md':'';
 note(`<div class="r-relic-glyphs">${glyphs(state.room)}</div><h2 id="bookTitle">${esc(short(state.room))}</h2><p class="r-riddle">${art[state.room][1]}</p><div class="r-note-actions"><button data-plan>⌗ 地図</button><button data-exits>⇢ 出口</button></div>${detail(`<p>${esc(r[3])}</p><p>${esc(r[4])}</p><a href="${source(state.room,path)}" target="_blank" rel="noopener noreferrer">原典 ↗</a>`)}`);
}
function threshold(d){
 gateSeen.add(state.room+':'+d.key);const c=d.contact;
 const route=c?`${c.from.map(short).join(' · ')} → ${c.to.map(short).join(' · ')}`:'同じ研究系列の回廊';
 note(`<span class="r-eyebrow">${statusText[d.status]}${d.reverse?' / 逆にたどる':''}</span><h2 id="bookTitle">${esc(short(d.target))}</h2><div class="r-threshold ${d.status}">${statusGlyph[d.status]}</div><p class="r-riddle">${esc(c?(shortConditions[c.id]||c.condition):'同じ系列。科学的な依存を意味しない。')}</p><div class="r-note-actions"><button data-peek="${d.target}">${d.status==='open'||d.status==='proposed'?'先の部屋を覗く':'部屋へ進む'} ↗</button><button data-note-close>↩</button></div>${detail(`<p>${esc(route)}</p>${c?'<p>'+esc(c.condition)+'</p>':''}<p>逆に歩いても、関係の向きや証拠の状態は変わりません。</p><a href="TOWER_AUDIT.md">接点の出典 ↗</a>`)}`);
}
function useExit(d){if(!d.target){navigate(null);return;}if(d.status==='established'&&!d.reverse){navigate(d.target);return;}threshold(d);}
function exitList(){if(!state.room){openPlan();return;}note(`<h2 id="bookTitle">${short(state.room)} / 出口</h2><div class="r-exit-list">${doors.map(d=>`<button data-select-exit="${d.key}"><span>${statusGlyph[d.status]}</span><strong>${d.target?short(d.target):'塔'}</strong><small>${d.reverse?'←':d.status==='navigation'?'⌁':'→'}</small></button>`).join('')}</div>`);}
function drawMap(){
 const focus=state.mapFocus||state.room,filter=state.filter;const points=new Map();
 let svg=`<svg viewBox="0 0 1060 590" role="img" aria-labelledby="atlasGraphicTitle"><title id="atlasGraphicTitle">同じ塔の${D.repos.length}の部屋。TMOP記号で比較する平面地図</title><defs><filter id="planGlow"><feGaussianBlur stdDeviation="4"/></filter></defs>`;
 D.floors.forEach((f,j)=>{const rows=D.repos.filter(r=>r[1]===j),x=22+j*209;svg+=`<rect class="plan-floor" x="${x}" y="38" width="181" height="532" rx="72"/><text class="plan-roman" x="${x+90}" y="69">${f.roman}</text>`;rows.forEach((r,i)=>points.set(r[0],{x:x+90,y:105+i*(rows.length>8?51:59)}));});
 // Only the focused room's scientific contacts are drawn, preserving the original direction.
 if(focus)for(const c of D.contacts){if(!c.from.includes(focus)&&!c.to.includes(focus))continue;for(const a of c.from)for(const b of c.to){if(a!==focus&&b!==focus)continue;const p=points.get(a),q=points.get(b);if(!p||!q)continue;const dash=c.status==='open'||c.status==='proposed'?'7 8':c.status==='bounded'?'2 5':'';svg+=`<path class="plan-edge" data-contact="${c.id}" d="M${p.x} ${p.y} Q${(p.x+q.x)/2} ${Math.min(p.y,q.y)-35} ${q.x} ${q.y}"${dash?` stroke-dasharray="${dash}"`:''}/><circle cx="${q.x}" cy="${q.y}" r="3" class="plan-edge-end"/>`;}}
 for(const r of D.repos){const p=points.get(r[0]),dim=filter&&!(membership[r[0]]||'').includes(filter);svg+=`<g class="plan-node ${visited.has(r[0])?'visited':''} ${r[0]===focus?'current':''} ${dim?'dim':''}" data-map-room="${r[0]}" role="button" tabindex="0" aria-label="${short(r[0])}の部屋へ。${membership[r[0]]}"><title>${r[2]}</title><rect x="${p.x-65}" y="${p.y-22}" width="130" height="44" rx="4"/><text x="${p.x}" y="${p.y-1}" class="plan-name">${esc(short(r[0]))}</text><g transform="translate(${p.x-((membership[r[0]]||'?').length)*6},${p.y+4})">${[...(membership[r[0]]||'?')].map((t,i)=>alphabet[t]?`<path transform="translate(${i*12},0) scale(.29)" d="${alphabet[t].path}"/>`:'<text x="5" y="9">?</text>').join('')}</g></g>`;}
 svg+='</svg>';$('planPaper').innerHTML=svg;$('planLocation').textContent=focus?short(focus):'⌁';
 $('planFilters').innerHTML=Object.keys(alphabet).map(t=>`<button data-filter="${t}" class="${filter===t?'active':''}" aria-pressed="${filter===t}" aria-label="${alphabet[t].name}の部屋を強調">${glyph(t)}<small>${decoded.has(t)?t:'·'}</small></button>`).join('');
}
let planFocus=null;
function openPlan(){planFocus=document.activeElement;closeBook();state.mapFocus=state.room;drawMap();if(!plan.open)plan.showModal();}
function closePlan(){plan.close();if(planFocus?.isConnected)planFocus.focus({preventScroll:true});}
$('planClose').onclick=closePlan;$('planKey').onclick=()=>{closePlan();journal();};mapButton.onclick=openPlan;$('roomPlan').onclick=openPlan;
plan.addEventListener('click',e=>{const f=e.target.closest('[data-filter]');if(f){state.filter=state.filter===f.dataset.filter?null:f.dataset.filter;drawMap();return;}const n=e.target.closest('[data-map-room]');if(n)navigate(n.dataset.mapRoom);});
plan.addEventListener('keydown',e=>{const n=e.target.closest('[data-map-room]');if(n&&['Enter',' '].includes(e.key)){e.preventDefault();navigate(n.dataset.mapRoom);}});
plan.addEventListener('mouseover',e=>{const n=e.target.closest('[data-map-room]');if(n)$('planLocation').textContent=short(n.dataset.mapRoom)+' · '+repos.get(n.dataset.mapRoom)[2];});
$('roomBack').onclick=()=>navigate(null);$('roomLeft').onclick=()=>turn(-Math.PI/4);$('roomRight').onclick=()=>turn(Math.PI/4);$('roomRelic').onclick=relic;
// Capture enhancements before the legacy handlers: rooms replace note-only doors.
document.addEventListener('click',e=>{
 const b=e.target.closest('button,a');if(!b)return;let action=null;
 if(b.matches('.doorway[data-repo]'))action=()=>navigate(b.dataset.repo);
 else if(b.id==='bookButton')action=journal;
 else if(b.id==='helpButton')action=help;
 else if(b.id==='philosophyButton')action=journal;
 else if(b.id==='skipNotebook')action=directory;
 else if(b.matches('a[href="archive.html#atlas"],a[href="https://zuizui0223.github.io/archive.html#atlas"]'))action=openPlan;
 else if(b.dataset.book==='repos')action=directory;
 else if(b.dataset.book==='contacts')action=exitList;
 else if(b.dataset.book==='index')action=journal;
 else if(b.dataset.room)action=()=>navigate(b.dataset.room);
 else if(b.dataset.rune)action=()=>rune(b.dataset.rune);
 else if(b.hasAttribute('data-directory'))action=directory;
 else if(b.hasAttribute('data-plan'))action=openPlan;
 else if(b.hasAttribute('data-exits'))action=exitList;
 else if(b.hasAttribute('data-note-close'))action=closeBook;
 else if(b.dataset.peek)action=()=>navigate(b.dataset.peek);
 else if(b.dataset.selectExit){const d=doors.find(d=>d.key===b.dataset.selectExit);if(d)action=()=>useExit(d);}
 else if(b.dataset.answer)action=()=>{const good=b.dataset.answer===b.dataset.symbol;$('runeReply').textContent=good?b.dataset.symbol+' · '+alphabet[b.dataset.symbol].en:'もう一度、部屋の共通点を見る。';b.classList.toggle('correct',good);if(good){decoded.add(b.dataset.symbol);persist();if(state.room)$('roomInscriptions').querySelectorAll(`[data-rune="${b.dataset.symbol}"] span`).forEach(s=>s.textContent=b.dataset.symbol);}};
 else if(b.matches('#bookContent [data-repo]'))action=()=>navigate(b.dataset.repo);
 else if(b.dataset.oldMotif)action=()=>{const m=D.motifs.find(x=>x.id===b.dataset.oldMotif);note(`<h2 id="bookTitle">${m.glyph}</h2><p>${esc(m.title)}</p><button data-tower-floor="${m.floor}">塔で探す ↟</button>${detail(`<p>${esc(m.text)}</p><p>${esc(m.receipt)}</p><a href="${source(m.source,m.path)}" target="_blank" rel="noopener noreferrer">原典 ↗</a>`)}`);};
 else if(b.dataset.towerFloor!==undefined)action=()=>{navigate(null);document.querySelector(`#floorRail [data-floor="${b.dataset.towerFloor}"]`).click();};
 else if(state.room&&b.id==='homeLink')action=()=>navigate(null);
 if(action){e.preventDefault();e.stopImmediatePropagation();action();}
},true);
$('notebook').addEventListener('close',()=>{$('notebook').classList.remove('glyph-notebook');if(state.bookOrigin?.isConnected)state.bookOrigin.focus({preventScroll:true});state.bookOrigin=null;});
cv.addEventListener('pointerdown',e=>{if(e.button!==0||!e.isPrimary)return;state.drag={id:e.pointerId,x:e.clientX,y:e.clientY,yaw:state.target};cv.setPointerCapture(e.pointerId);});
cv.addEventListener('pointermove',e=>{const d=state.drag;if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x;if(Math.abs(dx)>5){state.suppress=performance.now()+300;state.target=d.yaw+dx*.010;requestDraw();}});
const end=e=>{if(state.drag?.id!==e.pointerId)return;if(cv.hasPointerCapture(e.pointerId))cv.releasePointerCapture(e.pointerId);state.drag=null;};
cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
document.addEventListener('keydown',e=>{if(!state.room||plan.open||$('notebook').open||e.altKey||e.ctrlKey||e.metaKey)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Escape'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();if(e.key==='Escape'||e.key==='Home')navigate(null);else if(e.key==='ArrowLeft')turn(-.2);else if(e.key==='ArrowRight')turn(.2);else if(e.key==='ArrowUp'||e.key==='ArrowDown'){state.pitch=clamp(state.pitch+(e.key==='ArrowUp'?.06:-.06),.32,.75);requestDraw();}}},true);
addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',requestDraw);reduced.addEventListener('change',requestDraw);
// Inspection is read-only. No setter can unlock or promote a scientific claim.
window.ZUIZUI_ROOMS=Object.freeze({snapshot:()=>({room:state.room,yaw:state.yaw,targetYaw:state.target,pitch:state.pitch,visited:[...visited],decoded:[...decoded],positions:positions.map(p=>({...p,point:[...p.point]})),membership:{...membership},chamber:state.room?window.ZUIZUI_ARCHITECTURE.stages[repos.get(state.room)[1]].id:null,mapOpen:plan.open,science:JSON.stringify(D.contacts)}),version:'2026-09-08-rooms-2'});
if(location.hash.startsWith('#room='))route();
})();
