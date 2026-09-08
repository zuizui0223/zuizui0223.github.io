/* A silent visual recurrence for portfolio-level synthesis.
 * It draws no scientific edge and never mutates the tower ledger. */
(() => {
  'use strict';
  const D=window.ZUIZUI_TOWER,S=window.ZUIZUI_TOWER_STATE,scene=document.getElementById('scene');
  const syn=D?.syntheses?.find(s=>s.id==='state-resolution'&&s.visual);
  if(!D||!S||!scene||!syn)return;
  const ids=new Set(syn.repos);
  const c=document.createElement('canvas');
  c.id='portfolioSynthesis';c.dataset.synthesis=syn.id;c.setAttribute('aria-hidden','true');
  c.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;';
  scene.appendChild(c);const x=c.getContext('2d');if(!x){c.remove();return;}
  let w=0,h=0,dpr=1;
  function resize(){const nw=innerWidth,nh=innerHeight,nd=Math.min(devicePixelRatio||1,2);if(nw===w&&nh===h&&nd===dpr)return;w=nw;h=nh;dpr=nd;c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);x.setTransform(dpr,0,0,dpr,0,0);}
  function rune(cx,cy){
    x.save();x.translate(cx,cy);x.lineCap='round';
    x.strokeStyle='rgba(231,207,157,.20)';x.lineWidth=1;x.beginPath();x.arc(0,0,8,0,Math.PI*2);x.stroke();
    x.strokeStyle='rgba(238,216,169,.68)';x.lineWidth=1.15;
    x.beginPath();x.moveTo(-4,-2.6);x.lineTo(4,-2.6);x.moveTo(-4,2.6);x.lineTo(4,2.6);x.moveTo(-2.8,5);x.lineTo(2.8,-5);x.stroke();
    x.restore();
  }
  function draw(){
    resize();x.clearRect(0,0,w,h);const s=S.snapshot();
    for(const p of s.positions){if(!ids.has(p.id)||!p.visible||!p.screen)continue;const dx=p.id==='chun'?-12:12,dy=-13;rune(Math.max(11,Math.min(w-11,p.screen.x+dx)),Math.max(87,Math.min(h-87,p.screen.y+dy)));}
  }
  document.addEventListener('zuizui:tower-frame',draw);addEventListener('resize',draw,{passive:true});requestAnimationFrame(draw);
})();
