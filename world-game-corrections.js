(function(){
  "use strict";
  const svg=document.querySelector('.brain-art');
  const stage=document.querySelector('.art-stage');
  if(!svg||!stage)return;

  const philosophy=document.querySelector('.philosophy-core p');
  if(philosophy) philosophy.innerHTML='理論世界と現実世界の、<br />接点を見つける。';
  const ending=document.querySelector('.ending small');
  if(ending) ending.textContent='接点と忘却の責任';
  const audit=document.querySelector('.philosophy-audit');
  if(audit){audit.textContent='33 · static';audit.title='33 active scientific repositories · 1 meta · 1 staging';}

  function addLock(target,x,y){
    target.classList.add('is-locked');
    if(!target.querySelector('.wg-lock')) target.insertAdjacentHTML('beforeend',`<circle class="wg-lock" cx="${x}" cy="${y}" r="10"/><text class="wg-lock-text" x="${x}" y="${y}">?</text>`);
  }

  function patchEvolve(){
    const active=stage.querySelector('.world-lens-btn.is-active');
    if(!active||active.dataset.worldLens!=='evolve')return;
    const groups=[...svg.querySelectorAll('.wg-edge-group')];
    const target=groups.find(g=>g.querySelector('.wg-edge-label')?.textContent==='architecture → relational state ?');
    if(!target)return;
    const x1=520,y1=500,x2=690,y2=200,mx=(x1+x2)/2,my=(y1+y2)/2;
    const d=`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
    target.querySelectorAll('.wg-edge-halo,.wg-edge').forEach(p=>p.setAttribute('d',d));
    const label=target.querySelector('.wg-edge-label');
    if(label){label.textContent='state → payoff  (proposed)';label.setAttribute('x',mx);label.setAttribute('y',my);}
    const bg=target.querySelector('.wg-edge-label-bg');
    if(bg){bg.setAttribute('x',mx-82);bg.setAttribute('y',my-10);bg.setAttribute('width',164);}
    const lock=target.querySelector('.wg-lock');
    const lockText=target.querySelector('.wg-lock-text');
    if(lock){lock.setAttribute('cx',mx);lock.setAttribute('cy',my-24);}
    if(lockText){lockText.setAttribute('x',mx);lockText.setAttribute('y',my-24);}
    target.dataset.note='現在安全な向きは EGWE relational state → PAYOFF context：state が e を条件づけ L(e), s(e), K(e), φ(e), η(e) を変えうる、という proposed interface。逆向き architecture → relational eco-genetic state は、共通系で architecture → interaction/alignment → future function を同期測定するまでLOCKED。';
  }

  function patchState(){
    const active=stage.querySelector('.world-lens-btn.is-active');
    if(!active||active.dataset.worldLens!=='state')return;
    const groups=[...svg.querySelectorAll('.wg-edge-group')];
    const target=groups.find(g=>g.querySelector('.wg-edge-label')?.textContent==='unlicensed → measure');
    if(!target)return;
    const label=target.querySelector('.wg-edge-label');
    if(label)label.textContent='target design ≠ mechanism design';
    const bg=target.querySelector('.wg-edge-label-bg');
    if(bg){const x=Number(label?.getAttribute('x')||615),y=Number(label?.getAttribute('y')||465);bg.setAttribute('x',x-101);bg.setAttribute('y',y-10);bg.setAttribute('width',202);addLock(target,x,y-24);}
    target.dataset.note='CEDとMRODは近いが自動handoffではない。CEDはtarget/reportをrisk-limitedに解くexperiment design、MRODは残るmechanism ambiguityを分けるobservation design。両者を閉じるには、CEDのtarget-safe unresolved classesとMRODのadmissible mechanism regionを同一candidate-observation contractで結ぶadapterが必要。';
  }

  function patchAll(){patchEvolve();patchState();}
  const observer=new MutationObserver(()=>patchAll());
  observer.observe(svg,{childList:true,subtree:true});
  stage.querySelectorAll('.world-lens-btn').forEach(btn=>btn.addEventListener('click',()=>queueMicrotask(patchAll)));
  patchAll();
})();
