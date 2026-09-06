/* One asymmetric building, five spatial languages. Geometry is presentation,
 * never evidence. Every surface and doorway is built once in world space. */
(() => {
  'use strict';
  const TAU=Math.PI*2;
  const palette=Object.freeze({chalk:'#ddd6c0',light:'#ede5ce',clay:'#b87358',clayLight:'#d99c77',jade:'#5e8377',jadeDark:'#294c49',water:'#477e7c',stone:'#83988a',ink:'#253d3c',brass:'#bd975f'});
  const stages=Object.freeze([
    Object.freeze({id:'garden',name:'水庭',height:0,color:palette.stone,form:'asymmetric stepped garden and water court'}),
    Object.freeze({id:'archive',name:'記録の壁',height:145,color:palette.clay,form:'massive cut wall, screen and recessed loggia'}),
    Object.freeze({id:'oculus',name:'可能性の環',height:293,color:palette.chalk,form:'crescent terrace and displaced circular aperture'}),
    Object.freeze({id:'fork',name:'分かれる回廊',height:436,color:palette.light,form:'unequal forked cantilevers and freestanding fins'}),
    Object.freeze({id:'observatory',name:'風の観測室',height:588,color:palette.jade,form:'offset copper-roof pavilion and brass instrument'})
  ]);
  const deepFreeze=o=>{if(o&&typeof o==='object'&&!Object.isFrozen(o)){Object.values(o).forEach(deepFreeze);Object.freeze(o);}return o;};
  function build(D){
    const faces=[],repoPoints=[],sightPairs=[],decor=[],spans=[];
    let layer=0,role='architecture';
    const shade=(hex,n,boost=1)=>{
      const light=Math.max(.38,Math.min(1.15,(.72+.24*n[1]-.19*n[0]+.12*n[2])*boost));
      return '#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*light)).toString(16).padStart(2,'0')).join('');
    };
    const face=(points,normal,color,boost=1)=>faces.push({points,normal,fill:shade(color,normal,boost),layer,role});
    function box(x,y,z,w,h,d,col){
      const a=x-w/2,b=x+w/2,c=z-d/2,e=z+d/2,t=y+h;
      face([[a,t,c],[b,t,c],[b,t,e],[a,t,e]],[0,1,0],col);
      face([[a,y,e],[b,y,e],[b,t,e],[a,t,e]],[0,0,1],col);
      face([[b,y,c],[a,y,c],[a,t,c],[b,t,c]],[0,0,-1],col);
      face([[b,y,e],[b,y,c],[b,t,c],[b,t,e]],[1,0,0],col);
      face([[a,y,c],[a,y,e],[a,t,e],[a,t,c]],[-1,0,0],col);
    }
    const rot=(p,a,o=[0,0,0])=>[o[0]+p[0]*Math.cos(a)+p[2]*Math.sin(a),o[1]+p[1],o[2]-p[0]*Math.sin(a)+p[2]*Math.cos(a)];
    function rotatedBox(o,a,w,h,d,col){
      const begin=faces.length;box(0,0,0,w,h,d,col);
      for(let i=begin;i<faces.length;i++){const f=faces[i];f.points=f.points.map(p=>rot(p,a,o));f.normal=rot(f.normal,a);f.fill=shade(col,f.normal);}
    }
    function extrude(poly,y,h,col){
      face(poly.map(([x,z])=>[x,y+h,z]),[0,1,0],col);
      for(let i=0;i<poly.length;i++){
        const a=poly[i],b=poly[(i+1)%poly.length],dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz)||1;
        face([[a[0],y,a[1]],[b[0],y,b[1]],[b[0],y+h,b[1]],[a[0],y+h,a[1]]],[dz/L,0,-dx/L],col);
      }
    }
    function disc(x,y,z,r,h,col,n=32,rz=r){extrude(Array.from({length:n},(_,i)=>[x+r*Math.cos(i*TAU/n),z+rz*Math.sin(i*TAU/n)]),y,h,col);}
    function arc(x,y,z,r,inner,h,start,end,col,n=36){
      for(let i=0;i<n;i++){
        const a=start+(end-start)*i/n,b=start+(end-start)*(i+1)/n,m=(a+b)/2;
        const p=(r,a,dy)=>[x+r*Math.cos(a),y+dy,z+r*Math.sin(a)];
        face([p(inner,a,h),p(r,a,h),p(r,b,h),p(inner,b,h)],[0,1,0],col);
        face([p(r,a,0),p(r,b,0),p(r,b,h),p(r,a,h)],[Math.cos(m),0,Math.sin(m)],col);
        face([p(inner,b,0),p(inner,a,0),p(inner,a,h),p(inner,b,h)],[-Math.cos(m),0,-Math.sin(m)],col,.84);
        if(i===0)face([p(inner,a,0),p(r,a,0),p(r,a,h),p(inner,a,h)],[Math.sin(a),0,-Math.cos(a)],col);
        if(i===n-1)face([p(r,b,0),p(inner,b,0),p(inner,b,h),p(r,b,h)],[-Math.sin(b),0,Math.cos(b)],col);
      }
    }
    function ring(o,r,inner,d,col,a=0,start=0,end=TAU,n=48){
      const at=(rr,t,z)=>rot([rr*Math.cos(t),rr*Math.sin(t),z],a,o);
      for(let i=0;i<n;i++){
        const t=start+(end-start)*i/n,u=start+(end-start)*(i+1)/n,m=(t+u)/2;
        for(const z of[-d/2,d/2])face([at(inner,t,z),at(r,t,z),at(r,u,z),at(inner,u,z)],rot([0,0,Math.sign(z)],a),col);
        face([at(r,t,-d/2),at(r,u,-d/2),at(r,u,d/2),at(r,t,d/2)],rot([Math.cos(m),Math.sin(m),0],a),col);
        face([at(inner,u,-d/2),at(inner,t,-d/2),at(inner,t,d/2),at(inner,u,d/2)],rot([-Math.cos(m),-Math.sin(m),0],a),col,.82);
      }
    }
    function line(points,color,width=1,dash=[]){decor.push({points,color,width,dash,layer});}
    function lineArc(x,y,z,r,a,b,col,width=1,n=44){line(Array.from({length:n+1},(_,i)=>[x+r*Math.cos(a+(b-a)*i/n),y,z+r*Math.sin(a+(b-a)*i/n)]),col,width);}
    function tree(x,y,z,h=54,r=12){
      disc(x,y,z,r*1.25,3,palette.jadeDark,12);box(x,y,z,3,h*.3,3,palette.brass);
      const base=y+h*.15,mid=y+h*.57;
      const pts=Array.from({length:9},(_,i)=>[x+r*Math.cos(i*TAU/9),mid,z+r*Math.sin(i*TAU/9)]);
      for(let i=0;i<9;i++){
        const j=(i+1)%9,t=(i+.5)*TAU/9,n=[Math.cos(t),.18,Math.sin(t)];
        face([[x,base,z],pts[j],pts[i]],n,palette.jadeDark);
        face([pts[i],pts[j],[x,y+h,z]],n,palette.jade);
      }
    }
    function stairs(p,q,w,col,n=24){
      const dx=q[0]-p[0],dz=q[2]-p[2],len=Math.hypot(dx,dz),a=Math.atan2(dx,dz),step=len/n;
      for(let i=0;i<n;i++){
        const t=(i+.5)/n,y=p[1]+(q[1]-p[1])*t;
        rotatedBox([p[0]+dx*t,y-7,p[2]+dz*t],a,w,7,step+1,col);
      }
      // Side stringer is an actual thin solid face, not an inferred contact.
      const nx=Math.cos(a)*w/2,nz=-Math.sin(a)*w/2;
      for(const s of[-1,1])face([[p[0]+s*nx,p[1]-8,p[2]+s*nz],[q[0]+s*nx,q[1]-8,q[2]+s*nz],[q[0]+s*nx,q[1]-13,q[2]+s*nz],[p[0]+s*nx,p[1]-13,p[2]+s*nz]],[s*Math.cos(a),0,-s*Math.sin(a)],col);
    }
    function portal(x,y,z,a,w=24,h=38,col=palette.chalk,shape='slot'){
      const oldRole=role;role='entrance';
      const o=[x,y,z],begin=faces.length;
      box(-w/2,0,0,5,h,8,col);box(w/2,0,0,5,h,8,col);
      if(shape==='arch'){
        const y0=h-w/2; faces.splice(begin);box(-w/2,0,0,5,y0,8,col);box(w/2,0,0,5,y0,8,col);
        ring([0,y0,0],w/2+2.5,w/2-2.5,8,col,0,0,Math.PI,18);
      }else box(0,h-4,0,w+5,5,8,col);
      // Dark inset is a real plane, so its front/back direction follows the model.
      face([[-w/2+2,1,-1],[w/2-2,1,-1],[w/2-2,h-5,-1],[-w/2+2,h-5,-1]],[0,0,1],palette.ink);
      for(let i=begin;i<faces.length;i++){const f=faces[i];f.points=f.points.map(p=>rot(p,a,o));f.normal=rot(f.normal,a);}
      role=oldRole;
      return {point:rot([0,h*.5,5],a,o),normal:rot([0,0,1],a)};
    }
    const register=(f,anchors)=>{
      const rows=D.repos.filter(r=>r[1]===f);
      rows.forEach((row,j)=>{
        const v=anchors[j],p=portal(...v);
        repoPoints.push({row,point:p.point,normal:p.normal,layer:f,button:null,screen:null});
      });
    };
    function endStage(start){spans.push({id:stages[layer].id,start,count:faces.length-start,form:stages[layer].form});}
    // I / A broad garden, water on one side, a grove on the other.
    let start=faces.length;
    const shore=[[-211,-89],[-169,-157],[84,-150],[194,-63],[197,94],[114,154],[-121,165],[-218,53]];
    extrude(shore,-53,23,palette.ink);
    extrude(shore.map(([x,z])=>[x*.95,z*.93]),-30,18,palette.stone);
    extrude([[-180,-111],[102,-116],[158,-39],[158,88],[82,120],[-166,120],[-188,65]],-12,12,palette.chalk);
    box(-46,0,-20,200,14,150,palette.stone);
    box(-72,14,-48,150,13,113,palette.light);
    box(-103,14,34,53,5,35,palette.jade);
    tree(-116,19,33,59,11);tree(-92,19,38,34,8);
    box(44,14,20,22,3,70,palette.water);
    box(59,14,20,5,5,70,palette.light);
    arc(92,.5,65,68,30,2,-.7,3.6,palette.water,36);
    arc(92,0,65,73,68,7,-.7,3.6,palette.chalk,36);
    arc(92,0,65,30,25,7,-.7,3.6,palette.chalk,22);
    stairs([170,0,26],[100,14,26],23,palette.light,8);
    arc(-85,16,-31,90,82,27,2.7,5.15,palette.clay,24);
    for(const [x,z,h,r]of[[-135,53,79,14],[-157,26,52,11],[-110,76,38,9],[-119,-103,58,11]])tree(x,18,z,h,r);
    box(58,0,-105,84,10,29,palette.clayLight);
    for(let i=0;i<6;i++)stairs([63+i*13,2,-80],[63+i*13,25,-60],8,palette.light,5);
    register(0,[[-118,27,-90,Math.PI,22,30,palette.clayLight,'slot'],[-45,27,-109,Math.PI,23,31,palette.chalk,'slot'],[19,27,-99,Math.PI,22,34,palette.chalk,'slot'],[117,0,-56,Math.PI/2,24,34,palette.stone,'arch'],[155,0,12,Math.PI/2,22,33,palette.stone,'arch'],[18,14,51,0,24,37,palette.chalk,'arch'],[-50,14,72,0,22,35,palette.chalk,'arch'],[-139,0,109,0,21,34,palette.clayLight,'slot'],[-186,0,-15,-Math.PI/2,24,34,palette.stone,'slot']]);
    endStage(start);
    // The retained spine is deliberately narrow and displaced, not four repeated columns.
    role='spine';box(-39,27,-27,31,274,35,palette.chalk);box(-50,301,-27,11,287,35,palette.chalk);box(-27,301,-27,11,287,35,palette.chalk);box(-35,35,-49,12,548,7,palette.clay);role='architecture';
    stairs([167,8,-33],[167,85,-116],27,palette.chalk,16);
    box(156,83,-125,47,8,36,palette.chalk);
    stairs([153,91,-127],[38,148,-127],27,palette.clayLight,18);
    box(38,139,-113,29,12,40,palette.clayLight);
    // II / Thick archive wall. The back is a screen; the front is one large cut arch.
    layer=1;start=faces.length;
    extrude([[-133,-100],[66,-116],[101,-56],[90,77],[-48,99],[-151,19]],139,12,palette.clayLight);
    box(-90,151,-21,39,109,129,palette.clay);
    box(-89,260,-21,46,9,138,palette.clayLight);
    // One singular monumental vault, in contrast with the low garden.
    rotatedBox([-14,151,47],0,21,51,30,palette.clay);
    rotatedBox([64,151,47],0,21,51,30,palette.clay);
    ring([25,202,47],49,29,30,palette.clayLight,0,0,Math.PI,30);
    box(25,251,47,105,12,35,palette.clayLight);
    // Rear perforated wall: voids, not rectangles painted onto a box.
    box(-7,151,-86,122,16,13,palette.clay);
    box(-7,227,-86,122,19,13,palette.clayLight);
    for(let i=0;i<6;i++)box(-66+i*24,167,-86,8,60,13,palette.clay);
    box(-7,192,-86,122,6,13,palette.clayLight);
    box(-124,151,27,25,8,94,palette.chalk);tree(-126,160,5,38,7);
    register(1,[[-133,151,-50,-Math.PI/2,19,36,palette.clayLight,'slot'],[-33,151,-101,Math.PI,20,36,palette.clayLight,'slot'],[52,151,-101,Math.PI,20,36,palette.clayLight,'slot'],[94,151,-34,Math.PI/2,22,39,palette.chalk,'slot'],[25,151,66,0,24,39,palette.chalk,'slot']]);
    endStage(start);
    stairs([-122,153,-82],[-122,298,58],22,palette.chalk,27);
    box(-108,288,58,53,11,25,palette.chalk);
    // III / An open crescent, with a large off-centre oculus and a narrow rear stair.
    layer=2;start=faces.length;
    arc(34,284,-7,131,73,12,-.40,4.70,palette.chalk,46);
    arc(34,296,-7,131,127,8,.03,3.92,palette.light,38);
    box(-29,288,-37,62,8,71,palette.light);
    box(32,293,-74,66,8,46,palette.chalk);
    // The circle is physically thin. A quarter turn reveals its edge and the passage behind it.
    ring([51,354,-52],63,45,17,palette.light,.18);
    rotatedBox([51,297,-52],.18,20,11,27,palette.clayLight);
    arc(34,296,-7,102,99,48,3.12,4.28,palette.jade,20);
    for(const a of[.27,.74,1.23,2.70]){
      const x=34+125*Math.cos(a),z=-7+125*Math.sin(a);box(x,304,z,2,14,2,palette.brass);
    }
    lineArc(34,318,-7,125,.18,2.88,palette.brass,1.1);
    register(2,[[135,296,-25,Math.PI/2,20,28,palette.chalk,'slot'],[122,296,61,.90,20,28,palette.chalk,'slot'],[59,296,108,.10,20,28,palette.clayLight,'slot'],[-9,296,101,-.5,21,29,palette.chalk,'slot'],[-88,300,16,-Math.PI/2,20,34,palette.chalk,'slot'],[-67,296,-27,-Math.PI/2,20,28,palette.jade,'slot'],[15,296,-116,Math.PI,21,29,palette.chalk,'slot']]);
    endStage(start);
    // A winding stair on the far side is invisible from one face, revealed from another.
    for(let i=0;i<29;i++){
      const a=2.0+i*.07,y=306+i*(136/28);rotatedBox([-36+81*Math.cos(a),y,-19+81*Math.sin(a)],-a,14,5,26,palette.chalk);
    }
    // IV / Two unequal forks. No enclosing plate: the air between them is the room.
    layer=3;start=faces.length;
    rotatedBox([-15,430,-20],-.47,244,12,44,palette.light);
    rotatedBox([14,430,34],.68,161,12,36,palette.chalk);
    box(-38,422,-23,61,9,77,palette.clayLight);
    for(const[x,z,w,h,a]of[[-95,-53,48,88,-.47],[-61,-107,52,108,-.47],[69,57,40,63,.68]]){
      rotatedBox([x,442,z],a,w,h,9,palette.chalk);
      rotatedBox([x,442+h,z],a,w+6,4,12,palette.light);
    }
    // A slit and a solid blade occupy different planes; never camera-facing billboards.
    rotatedBox([-45,442,-83],-.47,12,79,24,palette.jade);
    register(3,[[-120,442,-65,-Math.PI/2,21,32,palette.chalk,'slot'],[-81,442,0,0,21,34,palette.chalk,'slot'],[16,442,8,0,21,34,palette.clayLight,'slot'],[99,442,31,Math.PI/2,21,33,palette.chalk,'slot'],[59,442,83,0,20,32,palette.chalk,'slot'],[4,442,-81,Math.PI,21,33,palette.jade,'slot']]);
    line([[-118,455,-16],[-21,455,33],[42,455,4]],palette.brass,1.0);
    endStage(start);
    stairs([99,446,34],[50,598,-51],20,palette.clayLight,30);
    box(98,436,33,27,10,29,palette.chalk);box(49,588,-43,26,10,30,palette.jade);
    // V / A wind pavilion, roof and lens deliberately offset from one another.
    layer=4;start=faces.length;
    extrude([[-101,-57],[-38,-85],[70,-38],[98,27],[16,81],[-95,45]],581,12,palette.jade);
    extrude([[-88,-45],[-36,-70],[51,-32],[66,19],[5,60],[-80,36]],593,5,palette.chalk);
    for(const [x,z]of[[-66,-28],[0,-28],[-66,26],[0,26]])box(x,598,z,6,59,6,palette.jadeDark);
    // Copper roof: two unequal pitches, readable as a gable from one side and a broad plane from the other.
    const roof=[[-87,654,-41],[17,654,-41],[-11,687,-41],[-87,654,42],[17,654,42],[-11,687,42]];
    face([roof[0],roof[2],roof[5],roof[3]],[-.4,.92,0],palette.clayLight);
    face([roof[2],roof[1],roof[4],roof[5]],[.77,.64,0],palette.clay);
    face([roof[0],roof[1],roof[2]],[0,0,-1],palette.clay);
    face([roof[3],roof[5],roof[4]],[0,0,1],palette.clayLight);
    box(-12,684,0,4,5,89,palette.brass);
    box(53,596,-33,9,103,9,palette.chalk);
    ring([53,711,-33],31,28,3,palette.brass,-.53);
    ring([53,711,-33],18,16,3,palette.brass,Math.PI/2-.53);
    disc(53,709,-33,5,6,palette.light,12);
    box(47,598,49,38,6,28,palette.clayLight);
    register(4,[[-83,598,-49,Math.PI,18,26,palette.chalk,'slot'],[-29,598,-70,Math.PI,18,26,palette.jade,'slot'],[40,598,-53,Math.PI,18,26,palette.chalk,'slot'],[78,594,6,Math.PI/2,18,26,palette.jade,'slot'],[18,598,55,0,18,26,palette.chalk,'slot'],[-39,598,53,0,18,26,palette.chalk,'slot'],[-94,594,8,-Math.PI/2,18,26,palette.jade,'slot']]);
    endStage(start);
    // Original five puzzles retain the source motif IDs and solution angles.
    for(let f=0;f<5;f++){
      layer=f;role='clue';const m=D.motifs[f],a=m.angle,pc=.42,k=49,r=[176,131,152,145,119][f],cy=stages[f].height+66;
      const center=[[22,66,106],[41,211,10],[20,359,100],[25,502,8],[-40,654,30]][f];
      const ray=[Math.sin(a)*Math.cos(pc)*k,Math.sin(pc)*k,Math.cos(a)*Math.cos(pc)*k];
      const pair=[-1,1].map(s=>center.map((v,i)=>v+s*ray[i]/2));
      pair.forEach(p=>{box(p[0],stages[f].height+8,p[2],2.4,p[1]-stages[f].height-8,2.4,palette.brass);disc(p[0],p[1]-2,p[2],4.4,2,palette.light,12);});
      sightPairs.push(pair);
    }
    const finite=faces.every(f=>f.points.every(p=>p.every(Number.isFinite))&&f.normal.every(Number.isFinite));
    if(!finite||repoPoints.length!==D.repos.length)throw new Error('Invalid architectural model');
    deepFreeze(faces);deepFreeze(sightPairs);deepFreeze(decor);
    // Repo records gain mutable UI references later; their coordinates do not.
    repoPoints.forEach(p=>{Object.freeze(p.point);Object.freeze(p.normal);});
    return {faces,repoPoints,sightPairs,decor,stages,spans:deepFreeze(spans),palette};
  }
  window.ZUIZUI_ARCHITECTURE=Object.freeze({build,stages,palette,version:'2026-09-07-asymmetric-1'});
})();
