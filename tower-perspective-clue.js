/* Perspective-only clue layer.
 * It reads the tower's public read-only projection state and never mutates science,
 * world coordinates, discoveries, or camera state. */
(() => {
  'use strict';
  const D=window.ZUIZUI_TOWER, S=window.ZUIZUI_TOWER_STATE;
  const scene=document.getElementById('scene');
  if(!D||!S||!scene)return;
  const c=document.createElement('canvas');
  c.setAttribute('aria-hidden','true');
  c.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;';
  scene.appendChild(c);
  const x=c.getContext('2d');
  if(!x){c.remove();return;}
  let w=0,h=0,dpr=1;
  function resize(){
    const nw=innerWidth,nh=innerHeight,nd=Math.min(devicePixelRatio||1,2);
    if(nw===w&&nh===h&&nd===dpr)return;
    w=nw;h=nh;dpr=nd;c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);x.setTransform(dpr,0,0,dpr,0,0);
  }
  function segment(p,q,bed,color,dash,ready){
    x.save();x.lineCap='round';x.setLineDash(dash);
    x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.strokeStyle=bed;x.lineWidth=ready?7:6;x.stroke();
    x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.strokeStyle=color;x.lineWidth=ready?2.2:1.25;x.stroke();
    x.setLineDash([]);
    const dx=q.x-p.x,dy=q.y-p.y,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
    for(const t of [.18,.42,.66,.9]){
      const px=p.x+dx*t,py=p.y+dy*t,r=ready?4:3;
      x.beginPath();x.moveTo(px-nx*r,py-ny*r);x.lineTo(px+nx*r,py+ny*r);x.strokeStyle=bed;x.lineWidth=ready?1.6:1.15;x.stroke();
    }
    x.restore();
  }
  function loop(){
    resize();x.clearRect(0,0,w,h);
    const s=S.snapshot(),al=s.alignment,f=s.currentFloor,m=D.motifs[f];
    if(al&&m&&al.y>78&&al.y<h-82){
      const span=Math.max(32,Math.min(58,w*.045));
      const theta=(s.yaw-m.angle)*.32;
      const ux=Math.cos(theta),uy=Math.sin(theta)*.48;
      const a={x:al.a.x-ux*span,y:al.a.y-uy*span},b={x:al.b.x+ux*span,y:al.b.y+uy*span};
      const dash=(m.status==='open'||m.status==='proposed')?[5,7]:[];
      const bed=D.floors[f].color+'dd';
      const color=al.ready?'rgba(239,211,159,.92)':'rgba(232,213,177,.32)';
      segment(a,al.a,bed,color,dash,al.ready);segment(al.b,b,bed,color,dash,al.ready);
      if(al.ready){x.beginPath();x.arc(al.x,al.y,2.3,0,Math.PI*2);x.fillStyle='rgba(239,211,159,.9)';x.fill();}
    }
  }
  document.addEventListener('zuizui:tower-frame',loop);
  requestAnimationFrame(loop);
})();
