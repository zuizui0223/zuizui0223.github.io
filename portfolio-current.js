/* Current inventory and reading layer. Runs before the model/data freeze.
 * Canonical repository names are identity repairs, not new research results. */
(() => {
'use strict';
const D=window.ZUIZUI_TOWER,H=window.ZUIZUI_HORIZONTAL;
if(!D||!H)throw new Error('Current portfolio requires the tower and audited horizontal data');
const aliases=H.inventory.renamed,canonical=id=>aliases[id]||id;
D.repositoryAliases={...aliases};
D.repos.forEach(r=>r[0]=canonical(r[0]));
for(const c of D.contacts){c.from=c.from.map(canonical);c.to=c.to.map(canonical);}
for(const m of D.motifs)m.repos=m.repos.map(canonical);
for(const s of D.syntheses)s.repos=s.repos.map(canonical);
D.aliases.egc='EGC';D.aliases.egwe='EGWE';
const additions=[
 ['iwe',0,'出会いの季節','field,represented,empirical'],
 ['esdm',2,'状態を生む過程','possible,latent,generative,development'],
 ['Structural',2,'参照のあとに残るもの','possible,reference,empirical'],
 ['slk',4,'価値から実現へ','evolving,architecture,theory']
];
for(const[id,floor,name,locus]of additions){
 if(!D.repos.some(r=>r[0]===id))D.repos.push([id,floor,name,H.roles[id],locus]);
 D.aliases[id]=id==='Structural'?'STRUCTURAL':id.toUpperCase();
}
D.repos.forEach(r=>{if(H.roles[r[0]])r[3]=H.roles[r[0]];});
D.roomMembership={slk:'T',esdm:'TM',iwe:'MO',Structural:'MO'};
D.roomArt={
 slk:['game','割に合う。それで、実現する？'],
 esdm:['network','生きている状態と、記録された状態。'],
 iwe:['rings','出会う季節。同じ利益とは限らない。'],
 Structural:['relation','参照を足したあと、何が残る？'],
 bita:['portals','入口が閉じたら、別の道へ。']
};
D.repositorySources={esdm:H.sources.esdm};
D.entrances={
 iwe:[168,0,80,Math.PI/2,20,30,'#83988a','arch'],
 esdm:[151,296,27,Math.PI/2,18,28,'#ddd6c0','slot'],
 Structural:[-66,296,65,-Math.PI/2,18,28,'#5e8377','slot'],
 slk:[52,598,40,0,18,26,'#d99c77','slot']
};
D.horizontal=H;
D.inventory={...H.inventory};
D.contactRevisions=[];
function revise(id,change,reason){
 const c=D.contacts.find(c=>c.id===id);if(!c)throw new Error('Missing contact '+id);
 D.contactRevisions.push({id,previous:{...c,from:[...c.from],to:[...c.to]},reason,checkedAt:H.checkedAt});
 Object.assign(c,change);
}
// Correct obsolete ownership without silently rewriting the historical source file.
revise('architecture-game',{
 from:['sch','balance','payoff'],to:['slk'],
 condition:'SCHの対立識別・BALANCEの妥協領域・PAYOFFの数学をSLKのR/K/Phiと進化的実現へ渡す。BITAの機構識別は横の別軸。理論の接点であって自然系の因果閉合ではない。'
},'Current SLK/BALANCE/BITA positioning supersedes the earlier BITA recovery-ownership reading.');
revise('architecture-state',{
 from:['slk','payoff'],
 condition:'同一系で、構造の変更→相互作用の状態→未来機能を別途測定・介入する必要がある。BITAは機構識別の別軸。未閉合の提案を実証済みにしない。'
},'Current architecture-value ownership belongs to SLK; the mechanism test remains open.');
const future=D.motifs.find(m=>m.id==='future');
if(!future.repos.includes('slk'))future.repos.push('slk');
future.route='SCH · BALANCE · PAYOFF → SLK ↔ BITA / EGWE / EGWEE';
future.text='構造の価値、機構の識別、未来関連の状態は別の問い。横の回廊で、共有する対象と残る条件を照合する。';
const syn=D.syntheses.find(s=>s.id==='syndrome-assembly');
syn.visual={...syn.visual,renderedRoutes:false,upstream:['sch','balance','slk','payoff'],orthogonal:['bita']};
syn.meaning='構造価値と進化的実現はSLK、機構識別はBITAの別軸。個体系・空間転移・syndrome形成は照合すべき研究課題であり、同一の因果鎖の証明ではない。';
syn.repos.push('slk');
D.checkedAt=H.checkedAt;D.version='2026-09-24-horizontal-1';
})();
