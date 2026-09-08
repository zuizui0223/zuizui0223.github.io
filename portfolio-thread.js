/* Silent perspective feedback for a portfolio-level synthesis.
 * The ≠-like reading is made by physical tower geometry on floors II-IV.
 * This layer draws no symbol and no scientific edge; it only gives a faint
 * atmospheric response when the floor-IV construction is viewed from the
 * registered angle. Visitor discovery never mutates the scientific ledger. */
(() => {
  'use strict';
  const D=window.ZUIZUI_TOWER,S=window.ZUIZUI_TOWER_STATE,scene=document.getElementById('scene');
  const syn=D?.syntheses?.find(s=>s.id==='state-resolution'&&s.visual?.mode==='architectural-perspective');
  if(!D||!S||!scene||!syn)return;
  const V=syn.visual,TAU=Math.PI*2,key='zuizui.portfolio.perspective.v1';
  let found=false;
  try{found=localStorage.getItem(key)==='1';}catch(_){}
  const c=document.createElement('canvas');
  c.id='portfolioSynthesis';c.dataset.synthesis=syn.id;c.setAttribute('aria-hidden','true');
  c.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:3;pointer-events:none;';
  scene.appendChild(c);const x=c.getContext('2d');if(!x){c.remove();return;}
  let w=0,h=0,dpr=1,ready=false,near=false,last={angle:Infinity,pitch:Infinity,floor:-1};
  const wrap=a=>((a+Math.PI)%TAU+TAU)%TAU-Math.PI;
  function resize(){
    const nw=innerWidth,nh=innerHeight,nd=Math.min(devicePixelRatio||1,2);
    if(nw===w&&nh===h&&nd===dpr)return;
    w=nw;h=nh;dpr=nd;c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);
    x.setTransform(dpr,0,0,dpr,0,0);
  }
  function draw(){
    resize();x.clearRect(0,0,w,h);
    const s=S.snapshot(),da=Math.abs(wrap(s.yaw-V.angle)),dp=Math.abs(s.pitch-V.pitch);
    last={angle:da,pitch:dp,floor:s.currentFloor};
    near=s.currentFloor===V.floor&&da<.22&&dp<.18;
    ready=s.currentFloor===V.floor&&da<=V.tolerance&&dp<.105;
    document.body.dataset.resolutionView=ready?'aligned':near?'near':'away';
    if(ready&&!found){
      found=true;
      try{localStorage.setItem(key,'1');}catch(_){}
      document.dispatchEvent(new CustomEvent('zuizui:portfolio-perspective',{detail:{id:syn.id,scientificEdge:false}}));
    }
    if(!near)return;
    const closeness=Math.max(0,1-da/.22)*Math.max(0,1-dp/.18);
    const cx=w*.51,cy=h*.52,r=Math.min(w,h)*(ready?.16:.11);
    const g=x.createRadialGradient(cx,cy,0,cx,cy,r);
    g.addColorStop(0,`rgba(234,213,169,${(ready?.075:.020)*closeness})`);
    g.addColorStop(.46,`rgba(111,145,128,${(ready?.030:.010)*closeness})`);
    g.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle=g;x.fillRect(cx-r,cy-r,r*2,r*2);
    if(ready){
      x.save();x.globalAlpha=.18;x.strokeStyle='rgba(239,219,177,.55)';x.lineWidth=.7;
      for(let i=0;i<5;i++){
        const a=.9+i*1.07,rr=r*(.40+.09*(i%2));
        x.beginPath();x.arc(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,1.2,0,TAU);x.stroke();
      }
      x.restore();
    }
  }
  document.addEventListener('zuizui:tower-frame',draw);
  addEventListener('resize',draw,{passive:true});
  window.ZUIZUI_PORTFOLIO_THREAD=Object.freeze({
    snapshot:()=>({id:syn.id,found,ready,near,...last,scientificEdge:false}),
    version:'2026-09-08-architectural-perspective-1'
  });
  requestAnimationFrame(draw);
})();
