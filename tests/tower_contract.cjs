'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{}};
vm.runInNewContext(fs.readFileSync('tower-data.js','utf8'),context);
const d=JSON.parse(JSON.stringify(context.window.ZUIZUI_TOWER));
const ontology=JSON.parse(fs.readFileSync('tower-ontology-audit.json','utf8'));
const closure=JSON.parse(fs.readFileSync('tower-closure-audit.json','utf8'));
assert.equal(ontology.schema,'zuizui.tower_ontology.v1');
assert.equal(ontology.inventory.owner_total,35);
assert.equal(ontology.inventory.research_programmes,34);
assert.deepEqual(ontology.inventory.staging_unclassified,[]);
assert.equal(ontology.floors.length,5);
assert(ontology.orthogonal_worlds.cross_estimand_relation_space.repositories.includes('284b'));
assert.equal(closure.schema,'zuizui.tower_closure.v1');
assert.equal(closure.visitor_state.scientific_effect,'none');
assert(closure.contacts.some(c=>c.id==='relation_space_to_cross_role_validation'&&c.status==='open'));
assert(closure.bounded_receipts.some(c=>c.id==='284b_layer1_feasibility'&&c.status==='bounded'));
const ids=new Set(d.repos.map(r=>r[0]));
assert.equal(ids.size,d.repos.length);
assert.equal(d.repos.length,34);
assert.equal(d.floors.length,5);
assert.equal(d.motifs.length,5);
assert.equal(d.contacts.length,17);
const contacts=new Set(d.contacts.map(c=>c.id));
assert.equal(contacts.size,d.contacts.length);
for(const r of d.repos)assert(r[1]>=0&&r[1]<5);
for(const c of d.contacts){
  for(const id of [...c.from,...c.to])assert(ids.has(id),id);
  assert(['established','bounded','proposed','open'].includes(c.status));
  assert(c.condition.length>0);
}
for(const m of d.motifs){
  assert(m.source&&m.path&&/^[a-f0-9]{40}$/.test(m.sourceBlob));
  assert(m.receipt.length>0);
  for(const id of m.repos)assert(ids.has(id));
  for(const id of m.contacts)assert(contacts.has(id));
}
assert.deepEqual(new Set(d.motifs.flatMap(m=>m.contacts)),contacts);
assert(d.repos.find(r=>r[0]==='284b')[4].includes('relation-check'));
assert.equal(d.contacts.find(c=>c.id==='state-payoff').status,'proposed');
assert.equal(d.contacts.find(c=>c.id==='field-return').status,'open');
assert(!fs.readFileSync('index.html','utf8').includes('src="world-game'));
console.log('Tower contract: 34 entrances, 5 motifs, 17 typed contacts, current ontology + closure ledgers; boundaries preserved.');
