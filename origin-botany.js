/* Botanical details for the existing cloche. Original illustrative geometry,
 * informed by the cited morphology in ORIGIN_BOTANY.md; not a specimen model.
 * Calyx lobes and reflexed intersinus appendages are separate organs.
 * Leaves are simple, alternate, irregularly toothed and change shape up-stem. */
(() => {
  'use strict';
  const TAU=Math.PI*2, add=(a,b)=>a.map((x,i)=>x+b[i]);
  const sub=(a,b)=>a.map((x,i)=>x-b[i]),mul=(a,k)=>a.map(x=>x*k);
  const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>mul(a,1/(Math.hypot(...a)||1)),mix=(a,b,t)=>add(mul(a,1-t),mul(b,t));
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const cubic=(a,b,c,d,t)=>add(add(mul(a,(1-t)**3),mul(b,3*(1-t)**2*t)),add(mul(c,3*(1-t)*t*t),mul(d,t**3)));
  const freeze=o=>{if(o&&typeof o==='object'&&!Object.isFrozen(o)){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
  function build({origin,down,side,other}){
    const surfaces=[],details=[],leaves=[],sepals=[],appendages=[];
    function face(points,color,role,n){
      surfaces.push({points,color,role,normal:n||norm(cross(sub(points[1],points[0]),sub(points[2],points[0])))});
    }
    function stroke(points,color,width,role,n=null){details.push({points,color,width,role,normal:n});}
    function tube(points,r,col,role){
      const rings=points.map((p,i)=>{
        const ax=norm(sub(points[Math.min(i+1,points.length-1)],points[Math.max(0,i-1)]));
        const u=norm(cross(ax,Math.abs(ax[1])>.94?[1,0,0]:[0,1,0])),v=norm(cross(ax,u));
        return Array.from({length:6},(_,j)=>add(p,add(mul(u,r*Math.cos(j*TAU/6)),mul(v,r*Math.sin(j*TAU/6)))));
      });
      for(let i=1;i<rings.length;i++)for(let j=0;j<6;j++)face([rings[i-1][j],rings[i-1][(j+1)%6],rings[i][(j+1)%6],rings[i][j]],col,role);
    }
    const stemAt=t=>cubic([-9,5,1],[-17,57,2],[5,102,-5],[5,133,0],t);
    function foliage(spec,index){
      const {node,base,tip,width,cordate,teeth,twist}=spec,axis=norm(sub(tip,base));
      const desired=norm([Math.sin(twist)*.38,.48,Math.cos(twist)]);
      const lateral=norm(cross(desired,axis)),normal=norm(cross(axis,lateral));
      const control1=add(mix(node,base,.36),[0,1.2,0]),control2=add(mix(node,base,.76),[0,1.1,0]);
      const petiole=Array.from({length:13},(_,j)=>cubic(node,control1,control2,base,j/12));
      tube(petiole,index<2?.42:.32,[110,137,82],'petiole');
      // Low narrow wings taper into the lamina; upper leaves have short petioles.
      for(let j=2;j<12;j++){
        const t=j/12,u=(j+1)/12,w0=.18+.45*t,w1=.18+.45*u;
        face([add(petiole[j],mul(lateral,-w0)),add(petiole[j],mul(lateral,w0)),add(petiole[j+1],mul(lateral,w1)),add(petiole[j+1],mul(lateral,-w1))],[102,132,77],'petiole-wing',normal);
      }
      function halfWidth(t,sgn){
        if(t<=0||t>=1)return 0;
        const outline=Math.pow(Math.sin(Math.PI*Math.pow(t,cordate?.57:.77)),.87)*Math.pow(1-t,.20);
        const phase=(t-.07)*teeth,cycle=Math.floor(phase),f=phase-cycle;
        const tooth=f<.73?f/.73:(1-f)/.27;
        const amplitude=.065+.035*Math.sin(cycle*2.17+index*.8+sgn*.55);
        const serration=(t>.07&&t<.91)?amplitude*tooth*Math.pow(Math.sin(Math.PI*t),.6):0;
        return width*(outline+serration)*(1+sgn*.026*Math.sin(5*t+index));
      }
      function point(t,v,lift=0){
        const bulge=Math.sin(Math.PI*t),center=mix(base,tip,t),sgn=v<0?-1:1;
        const basalLobe=cordate*Math.exp(-(((t-.07)/.065)**2))*Math.abs(v)**1.3;
        const fold=width*.065*bulge*(1-Math.abs(v))-.07*width*bulge*v*v;
        const curve=2.0*bulge-2.0*t*t;
        const puckering=.16*Math.sin((t*teeth-1)*TAU)*bulge*Math.abs(v);
        return add(add(add(center,mul(axis,-basalLobe)),mul(lateral,halfWidth(t,sgn)*v)),mul(normal,curve+fold+puckering+lift));
      }
      const N=84,vs=[-1,-.66,-.32,0,.32,.66,1];
      for(let i=0;i<N;i++)for(let j=0;j<vs.length-1;j++){
        const t=i/N,u=(i+1)/N,v=vs[j],q=vs[j+1];
        // Matte blade, gently folded around its midrib; not parallel dark stripes.
        const tone=.11+.065*Math.sin(index*1.8)+.07*(v+q)/2;
        const col=mix([69,104,62],[108,140,81],tone+.19*Math.sin(Math.PI*t));
        face([point(t,v),point(u,v),point(u,q),point(t,q)],col,'leaf',normal);
      }
      stroke(Array.from({length:33},(_,j)=>point(j/32,0,.18)),'#acb77cb5',.30,'midrib',normal);
      // Pinnate secondaries turn towards the margin; faint branches make a net,
      // rather than a row of straight stripes or a monocot's parallel venation.
      for(let k=0;k<7;k++)for(const sgn of[-1,1]){
        const t0=.09+k*.105,dt=.16-k*.009;
        const points=Array.from({length:13},(_,j)=>{const q=j/12;return point(t0+dt*(q*.64+q*q*.36),sgn*.96*q,.20);});
        stroke(points,'#a2b57870',.18,'secondary-vein',normal);
        for(const split of[.48,.72]){
          const at=t0+dt*(split*.64+split*split*.36);
          const branch=Array.from({length:7},(_,j)=>{const q=j/6;return point(at+.105*q,sgn*(split*.96+(.98-split*.96)*q*.78),.19);});
          stroke(branch,'#9fb47a40',.105,'veinlet',normal);
        }
      }
      // Sparse short pubescence, only drawn when it resolves at the display size.
      for(let k=0;k<26;k++){
        const t=.09+(k*.61803398875%1)*.78,sgn=k%2?1:-1,p=point(t,sgn,.06);
        stroke([p,add(p,add(mul(lateral,sgn*.42),mul(normal,.20)))],'#c7cf9a65',.13,'hair',normal);
      }
      leaves.push({id:'leaf-'+index,node,base,tip,form:cordate>1?'cordate-ovate':index===4?'upper-lanceolate':'ovate-acuminate',teethPerSide:teeth,petioleLength:Math.hypot(...sub(base,node))});
    }
    [
      {node:stemAt(.035),base:[-20,14,8],tip:[-44,26,9],width:9.9,cordate:3.2,teeth:8,twist:.12},
      {node:stemAt(.11),base:[1,19,7],tip:[29,31,12],width:12.2,cordate:4.0,teeth:9,twist:-.18},
      {node:stemAt(.32),base:[-21,53,1],tip:[-44,72,4],width:10.9,cordate:.7,teeth:9,twist:-.13},
      {node:stemAt(.54),base:[4,80,-1],tip:[39,92,5],width:10.7,cordate:.35,teeth:10,twist:.13},
      {node:stemAt(.81),base:[-1,113,-2],tip:[-24,130,-3],width:5.3,cordate:0,teeth:7,twist:-.22}
    ].forEach(foliage);
    const radial=a=>add(mul(side,Math.cos(a)),mul(other,Math.sin(a)));
    const tangent=a=>add(mul(side,-Math.sin(a)),mul(other,Math.cos(a)));
    const at=(s,r,a)=>add(add(origin,mul(down,s)),mul(radial(a),r));
    // Short green receptacle and connected calyx cup hide the pin-like join.
    const rings=[[-3.1,.95],[-1.5,1.9],[0,2.55],[1.7,3.55],[3.4,4.85]];
    for(let i=0;i<rings.length-1;i++)for(let j=0;j<40;j++){
      const a=j*TAU/40,b=(j+1)*TAU/40,[s,r]=rings[i],[t,q]=rings[i+1];
      face([at(s,r,a),at(t,q,a),at(t,q,b),at(s,r,b)],[102,136,78],'calyx-cup',radial((a+b)/2));
    }
    for(let k=0;k<5;k++){
      const angle=k*TAU/5+.28,rad=radial(angle),tan=tangent(angle),len=13.8*(1+.055*Math.sin(k*1.71));
      function sepalPoint(t,v,lift=0){
        const s=2.8+len*t;
        const rr=2+11.8*Math.pow(Math.sin(Math.min(1,(s/40)/.82)*Math.PI/2),.9)+.65+1.7*t*t;
        const w=2.20*Math.pow(1-t,.86)*(1+.20*Math.sin(Math.PI*t));
        return add(add(at(s,rr,angle),mul(tan,w*v)),mul(rad,.36*Math.sin(Math.PI*t)*(1-Math.abs(v))+lift));
      }
      const steps=24;
      for(let i=0;i<steps;i++)for(const sgn of[-1,1]){
        const t=i/steps,u=(i+1)/steps;
        face([sepalPoint(t,0),sepalPoint(u,0),sepalPoint(u,sgn),sepalPoint(t,sgn)],sgn<0?[91,130,72]:[114,148,85],'sepal',rad);
      }
      stroke(Array.from({length:25},(_,j)=>sepalPoint(j/24,0,.12)),'#bdc58c88',.20,'sepal-rib',rad);
      for(let j=1;j<14;j++)for(const sgn of[-1,1]){
        const p=sepalPoint(j/15,sgn);
        stroke([p,add(p,add(mul(tan,sgn*.35),mul(rad,.19)))],'#d0d4a475',.12,'hair',rad);
      }
      sepals.push({id:k,angle,base:sepalPoint(0,0),tip:sepalPoint(1,0)});
      // Each separate small appendage starts in a sinus BETWEEN two long lobes,
      // then folds backwards towards the flower stalk (opposite corolla axis).
      const a=angle+Math.PI/5,rn=radial(a),tn=tangent(a);
      const c0=at(2.9,4.55,a),c1=at(5.0,6.8,a),c2=at(-.4,8.4,a),c3=at(-1.2,6.9,a);
      function appendagePoint(t,v,lift=0){
        const p=cubic(c0,c1,c2,c3,t),width=1.90*Math.pow(1-t,.72)*(1+.50*Math.sin(Math.PI*t));
        return add(add(p,mul(tn,width*v)),mul(rn,.24*Math.sin(Math.PI*t)*(1-Math.abs(v))+lift));
      }
      for(let i=0;i<24;i++)for(const sgn of[-1,1]){
        const t=i/24,u=(i+1)/24;
        face([appendagePoint(t,0),appendagePoint(u,0),appendagePoint(u,sgn),appendagePoint(t,sgn)],sgn<0?[117,149,88]:[96,133,75],'calyx-appendage');
      }
      stroke(Array.from({length:21},(_,j)=>appendagePoint(j/20,0,.1)),'#c4ce9482',.18,'appendage-rib',rn);
      appendages.push({id:k,angle:a,base:c0,tip:c3,reflexed:dot(sub(c3,c0),down)<0});
    }
    // The same five-lobed green envelope is present around the existing bud.
    for(let k=0;k<5;k++){
      const a=k*TAU/5+.20,rn=[Math.cos(a),0,Math.sin(a)],tn=[-Math.sin(a),0,Math.cos(a)];
      const pos=(t,v)=>add(add([-26,112.5-10.0*t,-9],mul(rn,.9+2.65*Math.sin(Math.PI*t*.85))),mul(tn,.9*(1-t)*v));
      for(let j=0;j<14;j++)for(const sgn of[-1,1])face([pos(j/14,0),pos((j+1)/14,0),pos((j+1)/14,sgn),pos(j/14,sgn)],[100,132,79],'bud-sepal',rn);
    }
    // A few stem hairs make the texture coherent; never a glitter effect.
    for(let i=0;i<60;i++){
      const t=.03+i*.015,p=stemAt(t),a=i*2.39996323;
      const r=norm([Math.cos(a),.12,Math.sin(a)]),q=add(p,mul(r,.98));
      stroke([q,add(q,add(mul(r,.45),[0,.24,0]))],'#bec99160',.12,'hair',r);
    }
    const valid=surfaces.every(f=>f.points.every(p=>p.every(Number.isFinite)));
    if(!valid||sepals.length!==5||appendages.some(a=>!a.reflexed))throw new Error('Invalid cloche botanical geometry');
    return freeze({surfaces,details,anatomy:{leaves,sepals,appendages,budSepals:5,description:'stylized Campanula punctata; qualitative morphology, not measured specimen'}});
  }
  window.ZUIZUI_ORIGIN_BOTANY=Object.freeze({build,version:'2026-09-07-botany-1'});
})();
