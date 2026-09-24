/* Optional cross-floor reading cabinet. Nothing is drawn over the tower.
 * Walking a relationship neither reverses a scientific arrow nor promotes evidence. */
(() => {
'use strict';
const D=window.ZUIZUI_TOWER,H=D?.horizontal,$=id=>document.getElementById(id);
if(!H||!window.ZUIZUI_ROOMS)return;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=new Map(D.repos.map(r=>[r[0],r]));
const label=id=>D.aliases[id]||id.toUpperCase();
const mark={handoff:'↔',comparison:'◐',provenance:'⌁',design:'⌖',proposal:'⋯'};
const dialog=document.createElement('dialog');dialog.id='horizontalCabinet';
dialog.setAttribute('aria-labelledby','horizontalTitle');
dialog.innerHTML=`<header class="hc-head"><div><span>crossings</span><h2 id="horizontalTitle">横の回廊</h2></div><button id="horizontalClose" aria-label="回廊を閉じる">×</button></header><div class="hc-layout"><aside><label class="sr-only" for="horizontalSearch">研究を探す</label><input id="horizontalSearch" type="search" placeholder="研究を探す" autocomplete="off"><nav id="horizontalRepos" aria-label="研究の選択"></nav></aside><section id="horizontalReading" aria-live="polite"></section></div><footer class="hc-footer"><span>同じ塔の、別の入口。</span><button id="horizontalAudit">出典台帳 ↓</button></footer>`;
document.body.appendChild(dialog);
let selected='slk',filter='',origin=null;
function button(id,where,aria){const b=document.createElement('button');b.id=id;b.className='horizontal-trigger';b.textContent='↔';b.setAttribute('aria-label',aria);b.title='横の回廊';where.appendChild(b);b.addEventListener('click',open);return b;}
button('roomHorizontal',document.querySelector('.room-footnote'),'この研究の横のつながりを開く');
button('atlasHorizontal',document.querySelector('#roomMap .plan-tail'),'全研究の横の回廊を開く');
const book=$('bookContent');
function addBookEntry(){
 if(!book.children.length||book.querySelector('[data-horizontal]'))return;
 const row=document.createElement('div');row.className='hc-book-entry';
 const b=document.createElement('button');b.dataset.horizontal='';b.textContent='↔ 横の回廊';b.addEventListener('click',open);row.appendChild(b);book.appendChild(row);
}
new MutationObserver(addBookEntry).observe(book,{childList:true});
function renderRepos(){
 const oldScroll=$('horizontalRepos').scrollTop;
 $('horizontalRepos').innerHTML=D.repos.filter(r=>(r[0]+' '+r[2]+' '+H.roles[r[0]]).toLowerCase().includes(filter.toLowerCase())).map(r=>`<button data-hc-select="${esc(r[0])}" aria-current="${r[0]===selected}"><small>${D.floors[r[1]].roman}</small><span>${esc(label(r[0]))}</span>${H.inventory.new.includes(r[0])?'<i aria-label="新しい研究"></i>':''}</button>`).join('');
 $('horizontalRepos').scrollTop=oldScroll;
}
function render(){
 renderRepos();const r=byId.get(selected),links=H.links.filter(l=>l.from===selected||l.to===selected);
 const grouped=Object.keys(H.kinds).map(kind=>{
  const rows=links.filter(l=>l.kind===kind);if(!rows.length)return '';
  return `<section class="hc-group"><h3>${mark[kind]} ${H.kinds[kind]}</h3>${rows.map(l=>{
   const id=l.from===selected?l.to:l.from,s=H.sources[l.source];
   return `<article class="hc-link" data-hc-link="${esc(l.id)}" data-status="${l.status}"><div class="hc-link-head"><button data-hc-select="${esc(id)}" class="hc-neighbor">${esc(label(id))}</button><button data-hc-enter="${esc(id)}" aria-label="${esc(label(id))}の部屋に入る">↗</button></div><p>${esc(l.note)}</p><details><summary>${l.status==='proposed'?'接続案 · 条件と出典':'文書にある関係 · 条件と出典'}</summary><p>${esc(l.ceiling)}</p><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.repo)} / 原典 ↗</a><small>読解上の関係。因果・検証済みの依存を表さない。</small></details></article>`;
  }).join('')}</section>`;
 }).join('');
 $('horizontalReading').innerHTML=`<div class="hc-room-head"><small>${D.floors[r[1]].roman} / ${links.length} crossings${selected==='esdm'?' · 開発ブランチ':''}</small><h3>${esc(label(selected))}</h3><p>${esc(H.roles[selected])}</p><button class="hc-enter" data-hc-enter="${esc(selected)}">この部屋へ ↗</button></div>${grouped}`;
 $('horizontalReading').scrollTop=0;
}
function open(){
 origin=document.activeElement;
 selected=window.ZUIZUI_ROOMS.snapshot().room||selected;
 for(const id of ['notebook','roomMap'])if($(id).open)$(id).close();
 filter='';$('horizontalSearch').value='';render();
 if(!dialog.open)dialog.showModal();
 $('horizontalClose').focus({preventScroll:true});
}
function close(){dialog.close();if(origin?.isConnected&&origin.getClientRects().length)origin.focus({preventScroll:true});}
function enter(id){
 if(!byId.has(id))return;
 dialog.close();
 // Reuse the existing public room navigation click, including history/focus restoration.
 const b=document.createElement('button');b.hidden=true;b.dataset.room=id;document.body.appendChild(b);b.click();b.remove();
}
$('horizontalClose').onclick=close;
$('horizontalSearch').addEventListener('input',e=>{filter=e.target.value;renderRepos();});
dialog.addEventListener('click',e=>{
 const select=e.target.closest('[data-hc-select]'),go=e.target.closest('[data-hc-enter]');
 if(select){selected=select.dataset.hcSelect;render();return;}
 if(go)enter(go.dataset.hcEnter);
});
// Trap navigation keystrokes before the tower/room document handlers. Native dialog
// Escape/Tab behavior remains intact; text inputs and buttons keep their defaults.
window.addEventListener('keydown',e=>{if(dialog.open)e.stopPropagation();},true);
dialog.addEventListener('close',()=>{if(origin?.isConnected&&origin.getClientRects().length)origin.focus({preventScroll:true});});
$('horizontalAudit').onclick=()=>{
 const url=URL.createObjectURL(new Blob([JSON.stringify(H,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='horizontal-audit-2026-09-24.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
window.ZUIZUI_CROSSINGS=Object.freeze({snapshot:()=>({open:dialog.open,selected,relations:H.links.length,rooms:D.repos.length,scientificEffect:'none'})});
})();
