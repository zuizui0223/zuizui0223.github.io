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
  const model=window.ZUIZUI_ARCHITECTURE.build(D);
  const {faces,repoPoints,sightPairs}=model;
  const heights=model.stages.map(f=>f.height);
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
  function covered(p,surfaces) {
    for(const {face,ps} of surfaces) {
      if(face.role==='clue')continue;
      const a=ps[0];
      for(let i=1;i<ps.length-1;i++){
        const b=ps[i],c=ps[i+1],det=(b.y-c.y)*(a.x-c.x)+(c.x-b.x)*(a.y-c.y);
        if(Math.abs(det)<1e-8)continue;
        const u=((b.y-c.y)*(p.x-c.x)+(c.x-b.x)*(p.y-c.y))/det;
        const v=((c.y-a.y)*(p.x-c.x)+(a.x-c.x)*(p.y-c.y))/det,w=1-u-v;
        if(u>=0&&v>=0&&w>=0&&u*a.d+v*b.d+w*c.d>p.d+2)return true;
      }
    }
    return false;
  }
  function draw(now) {
    ctx.clearRect(0,0,W,H);
    const blend=clamp(progress/.12,0,1),f=clamp((progress-.12)/.83,0,1)*4;
    currentFloor=Math.round(f);
    const baseScale=Math.min(H*(W<760?.78:.79)/850,W*.88/570);
    scale=baseScale*(1+blend*(W<760?.38:.55));
    cx=W*(W<760?.49:lerp(.62,.52,blend));cy=H*lerp(W<760?.52:.49,.55,blend);
    const lo=Math.floor(f),hi=Math.min(4,lo+1);
    focusY=lerp(344,lerp(heights[lo],heights[hi],f-lo)+52,blend);
    document.body.dataset.floor=model.stages[currentFloor].id;
    document.body.classList.toggle('is-climbing',progress>.035);
    // Quiet ground rings and a cast shadow, no ornamental scientific edges.
    const shadow=project([0,-60,0]);
    const g=ctx.createRadialGradient(shadow.x,shadow.y,10,shadow.x,shadow.y,240*scale);
    g.addColorStop(0,'#00000070');g.addColorStop(1,'#00000000');ctx.fillStyle=g;
    ctx.beginPath();ctx.ellipse(shadow.x,shadow.y,250*scale,80*scale,0,0,TAU);ctx.fill();
    
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
    for(const {face,ps} of visible) polygon(ps,face.fill,face.fill);
    // The model's restrained metal inlays remain in world coordinates.
    for(const d of model.decor)line3(d.points,d.color,d.width,d.dash);
    // Brass identifiers remain small. Their names appear only on request.
    for(const o of repoPoints) {
      const p=project(o.point);o.screen=p;
      const on=facing(o.normal)>.15&&p.x>20&&p.x<W-20&&p.y>85&&p.y<H-85&&!covered(p,visible);
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
    document.dispatchEvent(new Event('zuizui:tower-frame'));
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
  window.ZUIZUI_TOWER_STATE=Object.freeze({snapshot:()=>({yaw,targetYaw,pitch,progress,currentFloor,visited:[...visited],returned,alignment:alignment(),faceCount:faces.length,repoCount:repoPoints.length,architectureVersion:model?window.ZUIZUI_ARCHITECTURE.version:null,stages:model.spans,positions:repoPoints.map(o=>({id:o.row[0],point:[...o.point],screen:o.screen,visible:o.button.getAttribute('aria-hidden')==='false'}))})});
})();
