/* A small, dependency-free orthographic 3D renderer.
 * All vertices live in one immutable world. Camera changes never alter evidence.
 * No WebGL/CDN, analytics, external font, or network request is required. */
(() => {
  'use strict';
  const D = window.ZUIZUI_TOWER;
  if (!D) return;
  const $ = id => document.getElementById(id);
  const canvas = $('tower'), ctx = canvas.getContext('2d');
  if (!ctx) { $('bookButton').onclick = () => location.assign('archive.html#atlas'); return; }
  const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
  const lerp = (a,b,t) => a+(b-a)*t;
  const TAU = Math.PI*2;
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const url = (repo,path='') => `https://github.com/zuizui0223/${encodeURIComponent(repo)}${path?'/blob/main/'+path:''}`;
  const label = id => D.aliases[id] || (id.length<10?id.toUpperCase():id);
  const deepFreeze = o => { Object.values(o).forEach(v=>{if(v && typeof v==='object') deepFreeze(v);}); return Object.freeze(o); };
  deepFreeze(D);
  const byId = new Map(D.repos.map(r=>[r[0],r]));
  const contactById = new Map(D.contacts.map(r=>[r.id,r]));
  const statusName = {established:'確認済みの概念接点',bounded:'限定した接点',proposed:'接続仮説',open:'未閉合'};
  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = reducedQuery.matches;
  let W=1,H=1,dpr=1,scale=1,cx=0,cy=0,focusY=270;
  let yaw=.72,targetYaw=.72,pitch=.42,targetPitch=.42,progress=0,targetProgress=0;
  let currentFloor=0,frame=0,drag=null,lastFocus=null,hovered=null,bookMode='index';
  let rippleUntil=0,returned=false,visited=new Set(),suppressClickUntil=0;
  const storageKey='zuizui.tower.discoveries.v1';
  try { const saved=JSON.parse(localStorage.getItem(storageKey)||'[]'); if(Array.isArray(saved)) visited=new Set(saved.filter(x=>D.motifs.some(m=>m.id===x))); } catch (_) { /* privacy mode still permits play */ }
  const faces=[], repoPoints=[], sightPairs=[];
  const offsets=[[-10,8],[8,0],[-6,-4],[7,3],[0,0]];
  const halves=[143,132,121,110,99];
  const heights=[0,136,272,408,544];
  const rgb = hex => hex.replace('#','').match(/.{2}/g).map(s=>parseInt(s,16));
  function material(hex,n,boost=1) {
    const light=clamp((.66+.20*n[1]-.12*n[0]+.10*n[2])*boost,.35,1.14);
    return `rgb(${rgb(hex).map(v=>Math.round(clamp(v*light,0,255))).join(',')})`;
  }
  function face(points,normal,color,layer=-1,boost=1) { faces.push({points,normal,fill:material(color,normal,boost),layer}); }
  function box(x,y,z,w,h,d,color,layer=-1) {
    const a=x-w/2,b=x+w/2,c=z-d/2,e=z+d/2,t=y+h;
    face([[a,t,c],[b,t,c],[b,t,e],[a,t,e]],[0,1,0],color,layer);
    face([[a,y,e],[b,y,e],[b,t,e],[a,t,e]],[0,0,1],color,layer);
    face([[b,y,c],[a,y,c],[a,t,c],[b,t,c]],[0,0,-1],color,layer);
    face([[b,y,e],[b,y,c],[b,t,c],[b,t,e]],[1,0,0],color,layer);
    face([[a,y,c],[a,y,e],[a,t,e],[a,t,c]],[-1,0,0],color,layer);
  }
  function rotatePoint(p,a,origin=[0,0,0]) { const c=Math.cos(a),s=Math.sin(a); return [origin[0]+p[0]*c+p[2]*s,origin[1]+p[1],origin[2]-p[0]*s+p[2]*c]; }
  function arch(origin,a,color,layer) {
    const t = p=>rotatePoint(p,a,origin);
    const n = v=>rotatePoint(v,a);
    function part(x,y,z,w,h,d) {
      const verts=[[x-w/2,y,z-d/2],[x+w/2,y,z-d/2],[x+w/2,y,z+d/2],[x-w/2,y,z+d/2]];
      face(verts.map(p=>t([p[0],y+h,p[2]])),[0,1,0],color,layer);
      for(let i=0;i<4;i++) {
        const j=(i+1)%4;
        const ns=[[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]][i];
        face([t(verts[i]),t(verts[j]),t([verts[j][0],y+h,verts[j][2]]),t([verts[i][0],y+h,verts[i][2]])],n(ns),color,layer);
      }
    }
    part(-15,0,0,6,28,9); part(15,0,0,6,28,9);
    const inner=12,outer=18,steps=10;
    for(let j=0;j<steps;j++) {
      const a0=j*Math.PI/steps,a1=(j+1)*Math.PI/steps;
      const q=(r,a,z)=>t([r*Math.cos(a),28+r*Math.sin(a),z]);
      for(const z of [-4.5,4.5]) face([q(inner,a0,z),q(outer,a0,z),q(outer,a1,z),q(inner,a1,z)],n([0,0,Math.sign(z)]),color,layer);
      const am=(a0+a1)/2;
      face([q(outer,a0,-4.5),q(outer,a1,-4.5),q(outer,a1,4.5),q(outer,a0,4.5)],n([Math.cos(am),Math.sin(am),0]),color,layer);
      face([q(inner,a1,-4.5),q(inner,a0,-4.5),q(inner,a0,4.5),q(inner,a1,4.5)],n([-Math.cos(am),-Math.sin(am),0]),color,layer,.7);
    }
  }
  function perimeter(t,r) {
    const k=Math.floor(t)%4,f=t-Math.floor(t);
    return [
      {x:lerp(-r,r,f),z:r,n:[0,0,1],a:0},
      {x:r,z:lerp(r,-r,f),n:[1,0,0],a:Math.PI/2},
      {x:lerp(r,-r,f),z:-r,n:[0,0,-1],a:Math.PI},
      {x:-r,z:lerp(-r,r,f),n:[-1,0,0],a:-Math.PI/2}
    ][k];
  }
  // A single connected building, built once. The central void is never filled.
  box(0,-54,0,385,23,345,'#313b40');
  box(0,-31,0,342,17,308,'#5b7771');
  box(0,-14,0,310,14,280,'#8aa596');
  for(let f=0;f<5;f++) {
    const y=heights[f],r=halves[f],[ox,oz]=offsets[f],col=D.floors[f].color,hole=34;
    box(ox-r/2-hole/2,y,oz,r-hole,13,r*2,col,f);
    box(ox+r/2+hole/2,y,oz,r-hole,13,r*2,col,f);
    box(ox,y,oz-r/2-hole/2,hole*2,13,r-hole,col,f);
    box(ox,y,oz+r/2+hole/2,hole*2,13,r-hole,col,f);
    // Double cornice and open, load-bearing columns connect the terraces.
    for(const s of [-1,1]) {
      box(ox+s*(r-3),y+13,oz,6,5,r*2,col,f);
      box(ox,y,oz+s*(r-3),r*2,5,6,col,f);
    }
    if(f<4) for(const sx of [-1,1]) for(const sz of [-1,1]) {
      box(sx*43,y+13,sz*43,13,123,13,col,f);
      box(sx*43,y+114,sz*43,22,10,22,col,f);
      box(sx*43,y+18,sz*43,21,9,21,col,f);
    }
    const rows=D.repos.filter(r=>r[1]===f);
    rows.forEach((row,j)=>{
      const p=perimeter((j+.42)/rows.length*4,r-24);
      const origin=[ox+p.x,y+18,oz+p.z];
      arch(origin,p.a,col,f);
      const marker=rotatePoint([0,34,6],p.a,origin);
      repoPoints.push({row,point:marker,normal:p.n,layer:f,button:null,screen:null});
    });
    // Two fragments are separated along a camera ray at the solution angle.
    const m=D.motifs[f],a=m.angle,pc=.42,k=55;
    const center=[ox+Math.sin(a)*(r-17),y+73,oz+Math.cos(a)*(r-17)];
    const ray=[Math.sin(a)*Math.cos(pc)*k,Math.sin(pc)*k,Math.cos(a)*Math.cos(pc)*k];
    const pair=[-1,1].map(s=>center.map((v,i)=>v+s*ray[i]/2));
    pair.forEach(p=>{
      box(p[0],y+18,p[2],5,p[1]-y-18,5,col,f);
      box(p[0],p[1]-4,p[2],12,3,12,'#c4ab79',f);
    });
    sightPairs.push(pair);
  }
  // Spiral exterior stairs: the steps are actual 3D solids, not a skewed SVG.
  for(let f=0;f<4;f++) {
    const a=f*Math.PI/2,lo=halves[f],hi=halves[f+1],N=25;
    for(let j=0;j<N;j++) {
      const t=j/(N-1),p=rotatePoint([lerp(lo+9,hi-1,t),heights[f]+18+136*t,lerp(lo-35,-hi+28,t)],a);
      const w=(f%2)?10:27,d=(f%2)?27:10;
      box(p[0],p[1]-6,p[2],w,6,d,D.floors[f].color,f);
    }
    // A continuous slender stringer makes ascent visually readable.
    const s=rotatePoint([lo+9,heights[f]+13,lo-35],a),e=rotatePoint([hi-1,heights[f+1]+12,-hi+28],a);
    const width=10,normal=rotatePoint([1,0,0],a);
    const v=rotatePoint([width/2,0,0],a);
    face([[s[0]-v[0],s[1],s[2]-v[2]],[e[0]-v[0],e[1],e[2]-v[2]],[e[0]-v[0],e[1]-13,e[2]-v[2]],[s[0]-v[0],s[1]-13,s[2]-v[2]]],normal.map(n=>-n),'#667779',f);
    face([[s[0]+v[0],s[1],s[2]+v[2]],[e[0]+v[0],e[1],e[2]+v[2]],[e[0]+v[0],e[1]-13,e[2]+v[2]],[s[0]+v[0],s[1]-13,s[2]+v[2]]],normal,'#889893',f);
  }
  // Open observatory at the crown, with a five-sided seed rather than a throne.
  for(const x of [-38,38]) for(const z of [-38,38]) box(x,562,z,10,65,10,'#c8bbab',4);
  box(0,627,0,95,9,95,'#d6c7af',4);
  box(0,636,0,71,6,71,'#d6c7af',4);
  box(0,642,0,38,6,38,'#b89b70',4);
  // Small botanical forms root the architecture in a physical field.
  for(const [x,z,h] of [[-141,114,18],[-126,130,12],[139,-130,20],[125,-146,13],[-143,-126,15]]) {
    box(x,0,z,3,h,3,'#758b68',0);
    box(x,h,z,9,4,9,'#d0a7a5',0);
  }
  function project(p) {
    const [x,y,z]=p,c=Math.cos(yaw),s=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
    const x1=x*c-z*s,z1=x*s+z*c;
    return {x:cx+x1*scale,y:cy+(-(y-focusY)*cp+z1*sp)*scale,d:y*sp+z1*cp};
  }
  function facing(n) { return n[0]*Math.sin(yaw)*Math.cos(pitch)+n[1]*Math.sin(pitch)+n[2]*Math.cos(yaw)*Math.cos(pitch); }
  function polygon(points,fill,stroke=null) {
    ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.5;ctx.stroke();}
  }
  function line3(points,color,width=1,dash=[]) {
    ctx.beginPath(); points.map(project).forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);
  }
  function circle3(r,y,color,width=1) {
    const pts=Array.from({length:97},(_,i)=>[r*Math.cos(i*TAU/96),y,r*Math.sin(i*TAU/96)]);line3(pts,color,width);
  }
  function alignment(f=currentFloor) {
    const [a,b]=sightPairs[f].map(project);
    return {a,b,x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:Math.hypot(a.x-b.x,a.y-b.y),ready:Math.hypot(a.x-b.x,a.y-b.y)<=Math.max(10,10*scale)};
  }
  function drawFragment(p,left,color,r) {
    ctx.beginPath();ctx.arc(p.x,p.y,r,left?Math.PI/2:-Math.PI/2,left?Math.PI*1.5:Math.PI/2);
    ctx.strokeStyle=color;ctx.lineWidth=1.8;ctx.stroke();
    ctx.beginPath();ctx.moveTo(p.x,p.y-r);ctx.lineTo(p.x+(left?-r*.68:r*.68),p.y);ctx.lineTo(p.x,p.y+r);ctx.stroke();
    ctx.beginPath();ctx.arc(p.x,p.y,2,0,TAU);ctx.fillStyle=color;ctx.fill();
  }
  function setupDom() {
    repoPoints.forEach(o=>{
      const b=document.createElement('button');b.className='doorway';b.type='button';b.dataset.repo=o.row[0];
      b.setAttribute('aria-label',`${label(o.row[0])} — ${o.row[2]}`);
      b.addEventListener('click',()=>openRepo(o.row[0]));
      b.addEventListener('pointerenter',()=>{hovered=o;placeLabel(o);});b.addEventListener('pointerleave',()=>{hovered=null;$('hoverLabel').classList.remove('is-visible');});
      b.addEventListener('focus',()=>{hovered=o;placeLabel(o);});b.addEventListener('blur',()=>{hovered=null;$('hoverLabel').classList.remove('is-visible');});
      $('doorways').appendChild(b);o.button=b;
    });
    D.floors.forEach((f,i)=>{
      const b=document.createElement('button');b.textContent=f.roman;b.type='button';b.dataset.floor=i;b.setAttribute('aria-label',`${f.roman} ${f.name}へ登る`);b.onclick=()=>goFloor(i);$('floorRail').appendChild(b);
      const dot=document.createElement('i');dot.setAttribute('aria-hidden','true');$('discoveries').appendChild(dot);
    });
    updateDiscovery();
  }
  function placeLabel(o) {
    if(!o.screen)return;
    const el=$('hoverLabel');el.textContent=label(o.row[0]);el.classList.add('is-visible');
    el.style.left=clamp(o.screen.x+20,8,W-el.offsetWidth-12)+'px';el.style.top=clamp(o.screen.y-31,80,H-90)+'px';
  }
  function draw(now) {
    ctx.clearRect(0,0,W,H);
    const blend=clamp(progress/.12,0,1),f=clamp((progress-.12)/.83,0,1)*4;
    currentFloor=Math.round(f);
    const baseScale=Math.min(H*(W<760?.81:.75)/780,W*.86/560);
    scale=baseScale*(1+blend*(W<760?.38:.55));
    cx=W*(W<760?.47:lerp(.605,.52,blend));cy=H*lerp(W<760?.51:.49,.55,blend);
    focusY=lerp(306,f*136+52,blend);
    document.body.classList.toggle('is-climbing',progress>.035);
    // Quiet ground rings and a cast shadow, no ornamental scientific edges.
    const shadow=project([0,-60,0]);
    const g=ctx.createRadialGradient(shadow.x,shadow.y,10,shadow.x,shadow.y,240*scale);
    g.addColorStop(0,'#00000070');g.addColorStop(1,'#00000000');ctx.fillStyle=g;
    ctx.beginPath();ctx.ellipse(shadow.x,shadow.y,250*scale,80*scale,0,0,TAU);ctx.fill();
    circle3(228,-54,'#738e8732');circle3(243,-54,'#738e8717');
    const cameraNormal=[Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)];
    const visible=[];
    for(const face of faces) {
      const dot=face.normal.reduce((s,n,i)=>s+n*cameraNormal[i],0);
      if(dot<=.001)continue;
      const ps=face.points.map(project);
      if(ps.every(p=>p.y<-100)||ps.every(p=>p.y>H+100))continue;
      visible.push({face,ps,depth:ps.reduce((s,p)=>s+p.d,0)/ps.length});
    }
    visible.sort((a,b)=>a.depth-b.depth);
    for(const {face,ps} of visible) polygon(ps,face.fill,'#0b0e1212');
    // Brass identifiers remain small. Their names appear only on request.
    for(const o of repoPoints) {
      const p=project(o.point);o.screen=p;
      const on=facing(o.normal)>.15&&p.y>85&&p.y<H-85;
      const active=on&&(progress<.035||o.layer===currentFloor);
      o.button.setAttribute('aria-hidden',!active);o.button.tabIndex=active?0:-1;
      o.button.style.left=p.x+'px';o.button.style.top=p.y+'px';
      if(on){ctx.beginPath();ctx.arc(p.x,p.y,1.7,0,TAU);ctx.fillStyle='#e8cca1';ctx.fill();}
    }
    // A solved motif reveals a contact path; a proposed bridge keeps its gap.
    for(let f0=0;f0<5;f0++) {
      const m=D.motifs[f0],al=alignment(f0),found=visited.has(m.id),active=f0===currentFloor;
      if(!active&&!found)continue;
      const opacity=active?1:.40,r=Math.max(7,10*scale);
      ctx.save();ctx.globalAlpha=opacity;
      if(found) {
        const pair=sightPairs[f0],col=D.floors[f0].color;
        line3([pair[0],[pair[0][0],heights[f0]+20,pair[0][2]],[0,heights[f0]+20,0]],col+'99',1.4,m.status==='open'||m.status==='proposed'?[5,7]:[]);
      }
      drawFragment(al.a,true,found?'#f3dba7':'#ddc695',r);drawFragment(al.b,false,found?'#f3dba7':'#ddc695',r);
      if(al.ready&&active) {
        ctx.beginPath();ctx.arc(al.x,al.y,r+7,0,TAU);ctx.strokeStyle='#ead5a150';ctx.lineWidth=1;ctx.stroke();
      }
      ctx.restore();
    }
    // A faceted seed above the roof. It is the same object in every perspective.
    const crown=[[0,685,0],[17,665,0],[0,665,17],[-17,665,0],[0,665,-17],[0,651,0]];
    for(let i=1;i<=4;i++){const j=i===4?1:i+1;line3([crown[0],crown[i],crown[j],crown[0]],visited.size===5?'#efd5a5b0':'#c2ab825a',1);line3([crown[i],crown[5]],'#b89d704a',.8);}
    if(visited.size===5) {
      circle3(228,-52,'#d6bc8799',1.3);
      for(let f0=0;f0<4;f0++) line3([[0,heights[f0]+25,0],[0,heights[f0+1]+25,0]],'#e9cd9560',1,[2,7]);
    }
    if(now<rippleUntil&&!reduced){const al=alignment();ctx.beginPath();ctx.arc(al.x,al.y,25+(1-(rippleUntil-now)/850)*45,0,TAU);ctx.strokeStyle=`rgba(235,209,164,${Math.max(0,(rippleUntil-now)/1400)})`;ctx.stroke();}
    const al=alignment();
    $('seal').style.left=al.x+'px';$('seal').style.top=al.y+'px';
    $('seal').classList.toggle('is-ready',al.ready&&!visited.has(D.motifs[currentFloor].id));
    $('seal').classList.toggle('is-found',visited.has(D.motifs[currentFloor].id));
    $('seal').querySelector('span').textContent=visited.has(D.motifs[currentFloor].id)?D.motifs[currentFloor].glyph:'◌';
    $('seal').setAttribute('aria-label',`${D.floors[currentFloor].roman}層の印を${visited.has(D.motifs[currentFloor].id)?'読む':'確かめる'}`);
    $('seal').style.visibility=(al.y>80&&al.y<H-85)?'visible':'hidden';
    $('floorMark').textContent=D.floors[currentFloor].roman;
    [...$('floorRail').children].forEach((b,i)=>b.setAttribute('aria-current',i===currentFloor));
    $('returnButton').hidden=visited.size!==5||returned;
    if(hovered)placeLabel(hovered);
  }
  function tick(now) {
    frame=0;
    const ease=reduced?1:.16;
    yaw=lerp(yaw,targetYaw,ease);pitch=lerp(pitch,targetPitch,ease);progress=lerp(progress,targetProgress,ease);
    const moving=Math.abs(yaw-targetYaw)+Math.abs(pitch-targetPitch)+Math.abs(progress-targetProgress)>.0004;
    if(!moving){yaw=targetYaw;pitch=targetPitch;progress=targetProgress;}
    draw(now);
    if(moving||(!reduced&&now<rippleUntil))requestDraw();
  }
  function requestDraw(){if(!frame&&!document.hidden)frame=requestAnimationFrame(tick);}
  function resize(){W=innerWidth;H=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);readScroll();requestDraw();}
  function readScroll(){const max=$('ascent').offsetHeight-H;targetProgress=clamp(scrollY/Math.max(1,max),0,1);if(targetProgress>.01)$('gesture').classList.add('faded');requestDraw();}
  function goFloor(i){if($('notebook').open)$('notebook').close();const p=.12+.83*clamp(i,0,4)/4;scrollTo({top:p*($('ascent').offsetHeight-H),behavior:reduced?'instant':'smooth'});$('gesture').classList.add('faded');}
  function turn(d){targetYaw+=d;$('gesture').classList.add('faded');requestDraw();}
  function updateDiscovery(){
    [...$('discoveries').children].forEach((d,i)=>d.classList.toggle('found',visited.has(D.motifs[i].id)));
    [...$('floorRail').children].forEach((d,i)=>d.classList.toggle('is-found',visited.has(D.motifs[i].id)));
    $('discoveries').setAttribute('aria-label',`${visited.size} / ${D.motifs.length} の接点を発見`);
    $('bookDot').hidden=visited.size===0;
  }
  function activateSeal(){
    const m=D.motifs[currentFloor];
    if(visited.has(m.id)){openMotif(m.id);return;}
    if(!alignment().ready){$('seal').classList.remove('is-miss');void $('seal').offsetWidth;$('seal').classList.add('is-miss');announce('二つの印はまだ離れています。視点を左右に回してください。');return;}
    visited.add(m.id);try{localStorage.setItem(storageKey,JSON.stringify([...visited]));}catch(_){}
    updateDiscovery();rippleUntil=performance.now()+850;announce(`${D.floors[currentFloor].name}の接点を発見。${visited.size} / 5。科学的な証拠の状態は変わりません。`);requestDraw();
  }
  function announce(text){$('live').textContent=text;}
  function showBook(html,mode='index') {
    bookMode=mode;$('bookContent').innerHTML=html;
    if(!$('notebook').open){lastFocus=document.activeElement;$('notebook').showModal();}
    $('notebook').scrollTop=0;
  }
  function tabs(){return '<div class="book-tabs"><button data-book="index">手帳</button><button data-book="repos">研究一覧</button><button data-book="contacts">接点</button></div>';}
  function repoButtons(rows){return '<div class="repo-list">'+rows.map(r=>`<button data-repo="${esc(r[0])}"><strong>${esc(label(r[0]))}</strong><small>${esc(r[2])}</small></button>`).join('')+'</div>';}
  function badge(status){return `<span class="state-badge ${esc(status)}">${esc(statusName[status]||status)}</span>`;}
  function openIndex() {
    const html=tabs()+`<h2 id="bookTitle">${returned?'また、世界へ。':'五つの言葉'}</h2><div class="motif-row">`+D.motifs.map((m,i)=>`<button data-motif="${m.id}" class="${visited.has(m.id)?'found':''}" aria-label="${D.floors[i].name}の手掛かり"><span>${visited.has(m.id)?m.glyph:'◌'}</span><small>${D.floors[i].roman}</small></button>`).join('')+`</div><p>塔は一つ。見える接点が、角度によって変わる。</p><p>発見 ${visited.size} / 5。研究と出典は、探索せずに開くこともできます。</p><div class="link-row"><button data-book="repos">研究一覧</button><button data-book="rules">世界の読み方</button><a href="archive.html#atlas">以前の地図（旧分類） ↗</a></div>`;
    showBook(html);
  }
  function openRepos(){showBook(tabs()+`<h2 id="bookTitle">入口</h2><label class="sr-only" for="repoSearch">研究名または役割を検索</label><input class="repo-search" id="repoSearch" type="search" placeholder="研究を探す" autocomplete="off"><div id="repoResults">${repoButtons(D.repos)}</div><p>${D.repos.length}の研究。284bは関係空間による照合の開発系として含めています。</p>`,'repos');$('repoSearch').oninput=e=>{$('repoResults').innerHTML=repoButtons(D.repos.filter(r=>r.slice(0,4).join(' ').toLowerCase().includes(e.target.value.toLowerCase())));};}
  function openRepo(id){const r=byId.get(id);if(!r)return;
    const contactRows=D.contacts.filter(c=>c.from.includes(id)||c.to.includes(id));
    const source=id==='284b'?url(id,'docs/product_b_eog_sdmr_relation_space_alignment.md'):url(id);
    showBook(tabs()+`<div class="book-symbol">${D.floors[r[1]].glyph}</div><h2 id="bookTitle">${esc(label(id))}</h2><p>${esc(r[3])}</p><div class="loci">${esc(r[4].split(',').join(' · '))}</div><div class="link-row"><a href="${source}" target="_blank" rel="noopener noreferrer">原典 ↗</a><button data-floor="${r[1]}">${D.floors[r[1]].roman} の入口へ</button></div>${contactRows.length?'<h3>この入口を通る接点</h3>'+contactRows.map(contactHtml).join(''):''}`,'repo');
  }
  function contactHtml(c){return `<section class="contact"><h3>${esc(c.from.map(label).join(' · '))} ${c.status==='open'||c.status==='proposed'?'⇢':'→'} ${esc(c.to.map(label).join(' · '))}</h3>${badge(c.status)} <code>${esc(c.type)}</code><p>${esc(c.condition)}</p></section>`;}
  function openContacts(){showBook(tabs()+`<h2 id="bookTitle">橋と、まだ渡れない橋</h2><p>実線は確認された関係。破線は仮説または未閉合。どちらも、見つけただけでは証拠になりません。</p>`+D.contacts.map(contactHtml).join('')+`<div class="link-row"><button data-book="audit">台帳を書き出す ↓</button><a href="TOWER_AUDIT.md">配置と出典 ↗</a></div>`,'contacts');}
  function openMotif(id){const m=D.motifs.find(x=>x.id===id);if(!m)return;
    if(!visited.has(id)){
      showBook(tabs()+`<div class="book-symbol">◌</div><h2 id="bookTitle">${D.floors[m.floor].roman}</h2><p>離れた二つの印。同じ輪郭。</p><div class="link-row"><button data-floor="${m.floor}">塔で探す</button><button data-read="${m.id}">探索せず接点を読む</button></div>`,'hint');return;
    }readMotif(m);
  }
  function readMotif(m){showBook(tabs()+`<div class="book-symbol">${m.glyph}</div><h2 id="bookTitle">${esc(m.title)}</h2><div class="route">${esc(m.route)}</div>${badge(m.status)}<p>${esc(m.text)}</p><div class="receipt"><p>${esc(m.receipt)}</p></div><div class="link-row"><a href="${url(m.source,m.path)}" target="_blank" rel="noopener noreferrer">原典 ↗</a><button data-floor="${m.floor}">塔へ戻る</button></div>`+repoButtons(m.repos.map(id=>byId.get(id)))+m.contacts.map(id=>contactHtml(contactById.get(id))).join(''),'motif');}
  function openRules(){showBook(tabs()+`<h2 id="bookTitle">世界の外と、内</h2><div class="route">Ω ─ Oᵥ → Yᵥ<br>Ω ─ qᶜ → 必要な状態<br>観測と契約 ─ CED → 報告できる対象</div><div class="rules">`+D.rules.map(r=>`<p>${esc(r)}</p>`).join('')+`</div><div class="receipt"><p>観測で届かないことと、現在の測定では見分けられないことは別です。この塔の視点操作は、既に台帳にある関係を見つける仕掛けであり、新しい科学的観測の代わりではありません。</p></div><div class="link-row"><button data-book="audit">出典付き台帳 ↓</button><a href="TOWER_AUDIT.md">精査記録 ↗</a></div>`,'rules');}
  function downloadAudit(){const a=document.createElement('a');const blob=new Blob([JSON.stringify(D,null,2)],{type:'application/json'});const objectURL=URL.createObjectURL(blob);a.href=objectURL;a.download='zuizui-tower-audit-2026-09-06.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(objectURL),1000);}
  function openHelp(){showBook(`<h2 id="bookTitle">手を動かす</h2><div class="route">↔　左右にドラッグ：塔を回す<br>⌄　縦にスクロール：塔を登る<br>◌　二つの印が重なったら、触れる</div><p>キーボード：← → で回転、↑ ↓ で階層移動、Enterで印を確かめる。Homeで全景。Escで手帳を閉じる。</p><p>画面下の ↶ ↷ でも回せます。スマートフォンでは縦スワイプで登り、横スワイプで回します。</p><div class="link-row"><button data-book="repos">ゲームをせずに研究を読む</button><button data-book="index">手帳へ</button></div>`,'help');}
  $('bookContent').addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.repo)openRepo(b.dataset.repo);
    else if(b.dataset.motif)openMotif(b.dataset.motif);
    else if(b.dataset.read)readMotif(D.motifs.find(m=>m.id===b.dataset.read));
    else if(b.dataset.floor!==undefined)goFloor(Number(b.dataset.floor));
    else if(b.dataset.book)({index:openIndex,repos:openRepos,contacts:openContacts,rules:openRules,audit:downloadAudit}[b.dataset.book]||openIndex)();
  });
  $('bookButton').onclick=openIndex;$('helpButton').onclick=openHelp;$('philosophyButton').onclick=openRules;
  $('closeBook').onclick=()=>$('notebook').close();$('notebook').addEventListener('close',()=>{if(lastFocus&&lastFocus.isConnected)lastFocus.focus({preventScroll:true});});
  $('notebook').addEventListener('click',e=>{if(e.target===$('notebook')){const r=$('notebook').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('notebook').close();}});
  $('skipNotebook').onclick=e=>{e.preventDefault();openRepos();};
  $('homeLink').onclick=e=>{e.preventDefault();scrollTo({top:0,behavior:reduced?'instant':'smooth'});};
  $('turnLeft').onclick=()=>turn(-Math.PI/10);$('turnRight').onclick=()=>turn(Math.PI/10);$('seal').onclick=activateSeal;
  $('returnButton').onclick=()=>{returned=true;targetPitch=.42;scrollTo({top:.12*($('ascent').offsetHeight-H),behavior:reduced?'instant':'smooth'});announce('現地へ戻りました。問いは観測へ、観測はまた世界の区別へ。未閉合の科学的接点は未閉合のままです。');requestDraw();};
  $('scene').addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0||e.target.closest('.floor-rail,.view-controls,.return-button,.signature'))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,baseYaw:targetYaw,basePitch:targetPitch,moved:false};$('gesture').classList.add('faded');});
  $('scene').addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!drag.moved&&Math.abs(dx)>6&&Math.abs(dx)>Math.abs(dy)*.8){drag.moved=true;try{canvas.setPointerCapture(e.pointerId);}catch(_){}}
    if(drag.moved){suppressClickUntil=performance.now()+350;targetYaw=drag.baseYaw+dx*.008;/* vertical gestures remain native scrolling on touch */if(e.pointerType==='mouse')targetPitch=clamp(drag.basePitch-dy*.001,.30,.58);requestDraw();}
  });
  const endDrag=e=>{if(drag&&e.pointerId===drag.id){try{if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);}catch(_){}drag=null;}};
  $('scene').addEventListener('pointerup',endDrag);$('scene').addEventListener('pointercancel',endDrag);
  $('scene').addEventListener('click',e=>{if(performance.now()<suppressClickUntil&&e.target.closest('.doorway,.seal')){e.preventDefault();e.stopImmediatePropagation();}},true);
  document.addEventListener('keydown',e=>{
    if($('notebook').open||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    if(e.key==='ArrowLeft'){e.preventDefault();turn(-.10);}
    if(e.key==='ArrowRight'){e.preventDefault();turn(.10);}
    if(e.key==='ArrowUp'){e.preventDefault();goFloor(currentFloor+1);}
    if(e.key==='ArrowDown'){e.preventDefault();goFloor(currentFloor-1);}
    if(e.key==='Home'){e.preventDefault();scrollTo({top:0,behavior:reduced?'instant':'smooth'});}
    if(e.key==='End'){e.preventDefault();goFloor(4);}
    if(e.key==='Enter'&&(e.target===document.body||e.target===canvas)){e.preventDefault();activateSeal();}
  });
  addEventListener('scroll',readScroll,{passive:true});addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)requestDraw();});
  reducedQuery.addEventListener('change',e=>{reduced=e.matches;requestDraw();});
  setupDom();resize();
  // Read-only inspection used by regression tests, not a route that unlocks science.
  window.ZUIZUI_TOWER_STATE=Object.freeze({snapshot:()=>({yaw,targetYaw,pitch,progress,currentFloor,visited:[...visited],returned,alignment:alignment(),faceCount:faces.length,repoCount:repoPoints.length,positions:repoPoints.map(o=>({id:o.row[0],point:[...o.point],screen:o.screen,visible:o.button.getAttribute('aria-hidden')==='false'}))})});
})();
