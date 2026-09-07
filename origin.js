/* The origin is a botanical emblem, not an experiment or a new scientific edge.
 * Its stem, leaves and downward-facing corolla have fixed 3D coordinates.
 * The camera follows the tower; the glass is a restrained illustrative composite.
 * No animation runs while the page is idle. No images, fonts or network are needed. */
(() => {
  'use strict';
  const canvas=document.getElementById('originFlower');
  const button=document.getElementById('originButton');
  if(!canvas||!button)return;
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const TAU=Math.PI*2, clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const add=(a,b)=>a.map((v,i)=>v+b[i]);
  const sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const mul=(a,n)=>a.map(v=>v*n);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>mul(a,1/(Math.hypot(...a)||1));
  const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
  const surfaces=[],marks=[];
  let w=1,h=1,scale=1,yaw=0,highlight=false,scheduled=0,frames=0;
  const pitch=.18,cp=Math.cos(pitch),sp=Math.sin(pitch);
  const origin=[20,143,7],down=norm([.16,-1,.07]);
  const side=norm(cross(down,[0,0,1])),other=norm(cross(side,down));
  function face(points,color,role){
    surfaces.push({points,color,role,normal:norm(cross(sub(points[1],points[0]),sub(points[2],points[0])))});
  }
  function basis(axis){const u=norm(cross(axis,Math.abs(axis[1])>.95?[1,0,0]:[0,1,0]));return [u,norm(cross(axis,u))];}
  function tube(points,r,color,role='stem'){
    const rings=points.map((p,i)=>{
      const ax=norm(sub(points[Math.min(points.length-1,i+1)],points[Math.max(0,i-1)]));
      const [u,v]=basis(ax);
      return Array.from({length:8},(_,j)=>add(p,add(mul(u,r*Math.cos(j*TAU/8)),mul(v,r*Math.sin(j*TAU/8)))));
    });
    for(let i=1;i<rings.length;i++)for(let j=0;j<8;j++){
      const k=(j+1)%8;face([rings[i-1][j],rings[i-1][k],rings[i][k],rings[i][j]],color,role);
    }
  }
  function bezier(a,b,c,d,n=25){return Array.from({length:n+1},(_,i)=>{
    const t=i/n,s=1-t;return a.map((v,j)=>s*s*s*v+3*s*s*t*b[j]+3*s*t*t*c[j]+t*t*t*d[j]);
  });}
  const stem=bezier([-9,5,1],[-17,57,2],[5,102,-5],[5,133,0]);
  tube(stem,.95,[101,131,81]);
  tube(bezier([5,133,0],[5,157,0],[22,156,5],origin,20),.72,[129,148,92]);
  tube(bezier([-3,94,0],[-17,96,-8],[-22,115,-9],[-26,113,-9],18),.48,[112,137,83]);
  // A closed bud belongs to the same stem; there is only one open flower.
  for(let j=0;j<14;j++){
    const a=j*TAU/14,b=(j+1)*TAU/14;
    face([[-26,113,-9],[-26+3.1*Math.cos(a),105,-9+3.1*Math.sin(a)],[-26+3.1*Math.cos(b),105,-9+3.1*Math.sin(b)]],[177,157,173],'bud');
    face([[-26+3.1*Math.cos(a),105,-9+3.1*Math.sin(a)],[-27,100,-9],[-26+3.1*Math.cos(b),105,-9+3.1*Math.sin(b)]],[149,129,155],'bud');
  }
  function bell(t,a,inner=false){
    const r=(2.0+11.8*Math.pow(Math.sin(Math.min(1,t/.82)*Math.PI/2),.9))*(inner?.945:1);
    const scallop=Math.pow(Math.max(0,(t-.79)/.21),1.5);
    const length=40*t+3.5*scallop*Math.cos(5*a);
    const radius=r*(1+.045*scallop*Math.cos(5*a));
    return add(add(origin,mul(down,length)),add(mul(side,radius*Math.cos(a)),mul(other,radius*Math.sin(a))));
  }
  const N=60,R=26;
  for(let i=0;i<R;i++)for(let j=0;j<N;j++){
    const t=i/R,u=(i+1)/R,a=j*TAU/N,b=(j+1)*TAU/N;
    const blush=.5+.5*Math.cos(a+1.4),base=mix([228,219,219],[189,150,179],.28*blush+.19*t);
    face([bell(t,a),bell(t,b),bell(u,b),bell(u,a)],base,'corolla');
    if(t>.72)face([bell(t,b,true),bell(t,a,true),bell(u,a,true),bell(u,b,true)],mix([223,202,211],[159,107,147],.20*blush),'inner');
    if(i===R-1)face([bell(u,a),bell(u,b),bell(u,b,true),bell(u,a,true)],[235,222,225],'rim');
  }
  for(let k=0;k<72;k++){
    const t=.48+.49*((k*.61803398875)%1),a=k*2.3999632297,p=bell(t,a);
    marks.push({point:p,normal:norm(add(mul(side,Math.cos(a)),mul(other,Math.sin(a)))),size:.27+(k%3)*.11});
  }
  const botany=window.ZUIZUI_ORIGIN_BOTANY.build({origin,down,side,other});
  surfaces.push(...botany.surfaces);
  surfaces.forEach(f=>{f.points.forEach(Object.freeze);Object.freeze(f.points);Object.freeze(f.normal);Object.freeze(f.color);Object.freeze(f);});
  Object.freeze(surfaces);
  function project(p){
    const c=Math.cos(yaw),s=Math.sin(yaw),z=p[0]*s+p[2]*c;
    return {x:w*.5+(p[0]*c-p[2]*s)*scale,y:h*.88+(-p[1]*cp+z*sp)*scale,d:p[1]*sp+z*cp};
  }
  function normalDepth(n){return n[0]*Math.sin(yaw)*cp+n[1]*sp+n[2]*Math.cos(yaw)*cp;}
  function polygon(points,fill){
    ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=.35;ctx.stroke();
  }
  function ellipse(cx,cy,rx,ry,fill,stroke){ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,TAU);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.7;ctx.stroke();}}
  function pedestal(){
    const p=project([0,0,0]),r=64*scale,e=11.5*scale;
    const shade=ctx.createLinearGradient(p.x-r,0,p.x+r,0);
    shade.addColorStop(0,'#273e3b');shade.addColorStop(.32,'#59665a');shade.addColorStop(.67,'#344c47');shade.addColorStop(1,'#142c2b');
    ctx.beginPath();ctx.ellipse(p.x,p.y+11*scale,r,e,0,0,Math.PI);ctx.lineTo(p.x-r,p.y);
    ctx.ellipse(p.x,p.y,r,e,0,Math.PI,TAU);ctx.closePath();ctx.fillStyle=shade;ctx.fill();
    ellipse(p.x,p.y+11*scale,r,e,null,'#b3a27b69');
    ellipse(p.x,p.y,r,e,'#324b43','#d1b68a95');
    ellipse(p.x,p.y-1*scale,59*scale,10.6*scale,'#253a33','#b9ab8b60');
    const soil=project([-9,3,1]);ellipse(soil.x,soil.y,17*scale,3.5*scale,'#3a4131',null);
    for(let i=0;i<16;i++){
      const a=i*2.39996,r0=4+(i%5)*2,p0=project([-9+Math.cos(a)*r0,3,1+Math.sin(a)*r0]);
      ellipse(p0.x,p0.y,(.4+i%3*.3)*scale,.35*scale,'#80905b',null);
    }
  }
  function glassPath(){
    const base=project([0,3,0]),roof=project([0,182,0]),shoulder=project([0,128,0]);
    const r=53*scale;
    ctx.beginPath();ctx.moveTo(base.x-r,base.y);
    ctx.lineTo(base.x-r,shoulder.y);
    ctx.bezierCurveTo(base.x-r,roof.y+22*scale,base.x-29*scale,roof.y,base.x,roof.y);
    ctx.bezierCurveTo(base.x+29*scale,roof.y,base.x+r,roof.y+22*scale,base.x+r,shoulder.y);
    ctx.lineTo(base.x+r,base.y);
    ctx.ellipse(base.x,base.y,r,9.5*scale,0,0,Math.PI);ctx.closePath();
    return {base,roof,shoulder,r};
  }
  function glass(front){
    const {base,roof,shoulder,r}=glassPath();
    const g=ctx.createLinearGradient(base.x-r,0,base.x+r,0);
    if(front){
      g.addColorStop(0,'#d9f4e72a');g.addColorStop(.06,'#d9f4e704');g.addColorStop(.35,'#d9f4e700');g.addColorStop(.86,'#effaf00c');g.addColorStop(1,'#d2efe53b');
    }else{g.addColorStop(0,'#84b2a60a');g.addColorStop(.5,'#a3bbaa02');g.addColorStop(1,'#9ccfc210');}
    ctx.fillStyle=g;ctx.fill();
    if(!front){ellipse(base.x,base.y,r,9.5*scale,null,'#d1e8d632');return;}
    ctx.save();glassPath();ctx.clip();
    const shine=ctx.createLinearGradient(0,roof.y,0,base.y);
    shine.addColorStop(0,'#fff7df00');shine.addColorStop(.22,highlight?'#fff9eac9':'#fff9ea94');shine.addColorStop(.62,'#e9f8e238');shine.addColorStop(1,'#e9f8e200');
    ctx.strokeStyle=shine;ctx.lineWidth=1.3*scale;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(base.x-r+6*scale,base.y-10*scale);ctx.lineTo(base.x-r+6*scale,shoulder.y+2*scale);
    ctx.bezierCurveTo(base.x-r+6*scale,roof.y+28*scale,base.x-37*scale,roof.y+11*scale,base.x-25*scale,roof.y+7*scale);ctx.stroke();
    ctx.strokeStyle='#e8f8e744';ctx.lineWidth=.7*scale;ctx.beginPath();ctx.moveTo(base.x+r-4*scale,base.y-14*scale);ctx.lineTo(base.x+r-4*scale,shoulder.y-3*scale);ctx.stroke();
    ctx.strokeStyle='#e0eddd30';ctx.lineWidth=3.2*scale;ctx.beginPath();ctx.moveTo(base.x+r-12*scale,shoulder.y+35*scale);ctx.lineTo(base.x+r-12*scale,shoulder.y-3*scale);ctx.stroke();
    ctx.restore();
    glassPath();ctx.strokeStyle='#daeddb54';ctx.lineWidth=.65*scale;ctx.stroke();
    ellipse(base.x,base.y+1.8*scale,r+1.4*scale,10*scale,null,'#eddfb06b');
    const knob=project([0,188,0]);
    const sphere=ctx.createRadialGradient(knob.x-1.5*scale,knob.y-2*scale,.2*scale,knob.x,knob.y,5*scale);
    sphere.addColorStop(0,'#edf4dbad');sphere.addColorStop(.42,'#c9dfcc26');sphere.addColorStop(1,'#d2e8d345');
    ellipse(knob.x,knob.y,4.5*scale,5*scale,sphere,'#d5e3c45b');
    ellipse(knob.x,knob.y+5*scale,3.3*scale,1*scale,null,'#dcd5ab6b');
  }
  function draw(){
    scheduled=0;
    if(getComputedStyle(button).visibility==='hidden')return;
    const rect=canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
    w=rect.width;h=rect.height;scale=h/235;
    const dpr=Math.min(devicePixelRatio||1,2);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const s=window.ZUIZUI_TOWER_STATE?.snapshot();
    yaw=(s?.yaw??.72)-.72;
    const p=project([0,16,0]),glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,h*.48);
    glow.addColorStop(0,highlight?'#c7b88113':'#c7b8810b');glow.addColorStop(.46,'#b7c7a706');glow.addColorStop(1,'#b7c7a700');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    const shadow=project([0,-14,0]);ellipse(shadow.x,shadow.y+3*scale,71*scale,7*scale,'#06141244',null);
    pedestal();glass(false);
    const projected=surfaces.map(f=>({f,points:f.points.map(project)}));
    projected.forEach(v=>v.depth=v.points.reduce((sum,p)=>sum+p.d,0)/v.points.length);
    // Depth-sorted botanical strokes, not veins drawn through the far side of a leaf.
    for(const d of botany.details){
      if(d.normal&&normalDepth(d.normal)<.04)continue;
      if(d.role==='hair'&&scale<1.15)continue;
      for(let i=1;i<d.points.length;i++){
        const pts=[project(d.points[i-1]),project(d.points[i])];
        projected.push({detail:d,points:pts,depth:(pts[0].d+pts[1].d)/2+.015});
      }
    }
    projected.sort((a,b)=>a.depth-b.depth);
    for(const {f,detail,points}of projected){
      if(detail){
        ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);ctx.lineTo(points[1].x,points[1].y);
        ctx.strokeStyle=detail.color;ctx.lineWidth=Math.max(.16,detail.width*scale);ctx.lineCap='round';ctx.stroke();continue;
      }
      const light=clamp(.85+.16*f.normal[1]-.17*f.normal[0]+.1*f.normal[2],.61,1.09);
      polygon(points,`rgb(${f.color.map(v=>Math.round(clamp(v*light,0,255))).join(',')})`);
    }
    for(const m of marks){if(normalDepth(m.normal)<.23)continue;const p=project(m.point);ellipse(p.x,p.y,m.size*scale,m.size*.65*scale,'#90527866',null);}
    glass(true);frames++;
  }
  function request(){if(!scheduled&&!document.hidden)scheduled=requestAnimationFrame(draw);}
  // data-room on the real button delegates to the existing room navigator.
  button.addEventListener('pointerenter',()=>{highlight=true;request();});
  button.addEventListener('pointerleave',()=>{highlight=false;request();});
  button.addEventListener('focus',()=>{highlight=true;request();});
  button.addEventListener('blur',()=>{highlight=false;request();});
  document.addEventListener('zuizui:tower-frame',request);
  document.addEventListener('visibilitychange',request);
  addEventListener('resize',request,{passive:true});
  if(typeof ResizeObserver==='function')new ResizeObserver(request).observe(canvas);
  // Remove the remaining decorative name in the once-created foldout, not source URLs.
  const atlas=document.querySelector('#roomMap .r-eyebrow');if(atlas)atlas.textContent='atlas';
  window.ZUIZUI_ORIGIN=Object.freeze({version:'2026-09-07-cloche-botany-2',snapshot:()=>({repository:'hotarubukuro',openFlowers:1,corollaLobes:5,yaw,frames,geometryFrozen:Object.isFrozen(surfaces),faces:surfaces.length,botany:botany.anatomy,botanyFrozen:Object.isFrozen(botany)})});
  request();
})();
