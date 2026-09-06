/* Silent cross-floor clue layer. It only repeats already-declared typed contacts. */
(() => {
  'use strict';
  const D=window.ZUIZUI_TOWER,S=window.ZUIZUI_TOWER_STATE,E=window.ZUIZUI_TOWER_ECHOES||[];
  const scene=document.getElementById('scene');
  if(!D||!S||!scene||!E.length)return;
  const contacts=new Map(D.contacts.map(c=>[c.id,c]));
  const repoFloor=new Map(D.repos.map(r=>[r[0],r[1]]));
  const c=document.createElement('canvas');
  c.id='crossFloorEchoes';c.dataset.echoes=String(E.length);c.setAttribute('aria-hidden','true');
  c.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;';scene.appendChild(c);
  const x=c.getContext('2d');if(!x){c.remove();return;}
  let w=0,h=0,dpr=1;
  function resize(){const nw=innerWidth,nh=innerHeight,nd=Math.min(devicePixelRatio||1,2);if(nw===w&&nh===h&&nd===dpr)return;w=nw;h=nh;dpr=nd;c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);x.setTransform(dpr,0,0,dpr,0,0);}
  function path(points){x.beginPath();points.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();}
  function rune(kind,cx,cy,status,floor){
    const broken=status==='open'||status==='proposed',col=D.floors[floor]?.color||'#cabd9f';
    x.save();x.translate(cx,cy);x.lineCap='round';x.lineJoin='round';x.lineWidth=1.25;x.setLineDash(broken?[2.4,3.1]:[]);
    x.strokeStyle=col+'72';x.beginPath();x.arc(0,0,8.5,0,Math.PI*2);x.stroke();
    x.strokeStyle=broken?'rgba(239,218,177,.48)':'rgba(239,218,177,.80)';
    if(kind==='split'){x.beginPath();x.arc(0,0,5.2,-Math.PI*.42,Math.PI*.42);x.stroke();x.beginPath();x.arc(0,0,5.2,Math.PI*.58,Math.PI*1.42);x.stroke();path([[0,-5.5],[0,5.5]]);}
    else if(kind==='gate'){path([[0,-6],[5,0],[0,6],[-5,0],[0,-6]]);path([[-2.2,-2.5],[-2.2,2.5],[2.2,2.5],[2.2,-2.5]]);}
    else if(kind==='fork'){path([[0,6],[0,0],[-5,-5]]);path([[0,0],[5,-5]]);x.beginPath();x.arc(0,0,1.5,0,Math.PI*2);x.stroke();}
    else if(kind==='return'){x.beginPath();x.arc(0,0,5.1,-Math.PI*.1,Math.PI*1.15);x.stroke();path([[-5.2,-1],[-5.2,4],[-1,4]]);}
    else if(kind==='mirror'){path([[-6,0],[-1,-5],[-1,5],[-6,0]]);path([[6,0],[1,-5],[1,5],[6,0]]);}
    x.restore();
  }
  function loop(){
    resize();x.clearRect(0,0,w,h);const s=S.snapshot();
    if(s.visited?.length){const visited=new Set(s.visited),positions=new Map(s.positions.map(p=>[p.id,p])),offsets=[[-15,-13],[15,-13],[-15,13],[15,13],[0,-18]];
      E.forEach((e,i)=>{if(!visited.has(e.unlock))return;const contact=contacts.get(e.contact);if(!contact)return;
        for(const id of [e.from,e.to]){const p=positions.get(id);if(!p?.visible||!p.screen)continue;const [dx,dy]=offsets[i%offsets.length];rune(e.rune,Math.max(11,Math.min(w-11,p.screen.x+dx)),Math.max(88,Math.min(h-88,p.screen.y+dy)),contact.status,repoFloor.get(id));}
      });
    }
  }
  document.addEventListener('zuizui:tower-frame',loop);
  requestAnimationFrame(loop);
})();
