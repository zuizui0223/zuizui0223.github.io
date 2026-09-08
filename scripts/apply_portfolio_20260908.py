from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]

def read(path): return (ROOT/path).read_text(encoding='utf-8')
def write(path,text): (ROOT/path).write_text(text,encoding='utf-8')
def once(text,old,new,label):
    if new in text: return text
    if text.count(old)!=1: raise SystemExit(f'{label}: expected one match, got {text.count(old)}')
    return text.replace(old,new,1)

# Actual homepage load order: overlay must run before architecture/tower freeze;
# synthesis rune must run after tower state exists.
p='index.html';s=read(p)
s=once(s,'<script src="tower-data.js?v=20260906t1" defer></script>',
       '<script src="tower-data.js?v=20260906t1" defer></script>\n<script src="portfolio-20260908.js?v=20260908p1" defer></script>',p+' portfolio data')
s=once(s,'<script src="tower-echo-clue.js?v=20260907a1" defer></script>',
       '<script src="tower-echo-clue.js?v=20260907a1" defer></script>\n<script src="portfolio-thread.js?v=20260908p1" defer></script>',p+' synthesis layer')
write(p,s)

# Room vocabulary and evidence modes for the two new programmes.
p='rooms.js';s=read(p)
s=once(s,"'284b':'?'});","'284b':'?','TTF':'M','adaptive-gain':'T'});",p+' membership')
s=once(s," pollipi:['camera','花から、記録へ。'],",
       " TTF:['slices','同じ方法でも、標本配置が変われば？'],\n 'adaptive-gain':['branch','次を、結果を見てから選ぶ。'],\n pollipi:['camera','花から、記録へ。'],",p+' art')
s=once(s,"'natural-state':'必要状態 × 観測 × 未見の未来'};",
       "'natural-state':'必要状態 × 観測 × 未見の未来','transfer-geometry':'標本配置 × held-out transfer','geometry-boundary':'idealized calibration ≠ actual geometry','adaptive-routing':'途中結果 → 次の測定；固定bundleとの費用差'};",p+' conditions')
s=once(s,"const galleries=[['hotarubukuro','fcp','chun'],['azami','EAzami','aza3'],['island','izu-core','shimahotarubukuro'],['crest','theouni']];",
       "const galleries=[['hotarubukuro','fcp','chun'],['azami','EAzami','aza3'],['island','izu-core','shimahotarubukuro'],['crest','theouni'],['fcp','TTF'],['mrod','adaptive-gain']];",p+' galleries')
s=s.replace('zuizui / atlas','atlas')
s=s.replace('同じ塔の34の部屋。TMOP記号で比較する平面地図','同じ塔の${D.repos.length}の部屋。TMOP記号で比較する平面地図')
s=s.replace("version:'2026-09-06-rooms-1'","version:'2026-09-08-rooms-2'")
write(p,s)

# Add one physical threshold to the archive and one to the oculus.
p='tower-architecture.js';s=read(p)
old="register(1,[[-133,151,-50,-Math.PI/2,19,36,palette.clayLight,'slot'],[-33,151,-101,Math.PI,20,36,palette.clayLight,'slot'],[52,151,-101,Math.PI,20,36,palette.clayLight,'slot'],[94,151,-34,Math.PI/2,22,39,palette.chalk,'slot'],[25,151,66,0,24,39,palette.chalk,'slot']]);"
new="register(1,[[-133,151,-50,-Math.PI/2,19,36,palette.clayLight,'slot'],[-33,151,-101,Math.PI,20,36,palette.clayLight,'slot'],[52,151,-101,Math.PI,20,36,palette.clayLight,'slot'],[94,151,-34,Math.PI/2,22,39,palette.chalk,'slot'],[25,151,66,0,24,39,palette.chalk,'slot'],[-96,151,73,0,20,34,palette.chalk,'slot']]);"
s=once(s,old,new,p+' TTF threshold')
old="register(2,[[135,296,-25,Math.PI/2,20,28,palette.chalk,'slot'],[122,296,61,.90,20,28,palette.chalk,'slot'],[59,296,108,.10,20,28,palette.clayLight,'slot'],[-9,296,101,-.5,21,29,palette.chalk,'slot'],[-88,300,16,-Math.PI/2,20,34,palette.chalk,'slot'],[-67,296,-27,-Math.PI/2,20,28,palette.jade,'slot'],[15,296,-116,Math.PI,21,29,palette.chalk,'slot']]);"
new="register(2,[[135,296,-25,Math.PI/2,20,28,palette.chalk,'slot'],[122,296,61,.90,20,28,palette.chalk,'slot'],[59,296,108,.10,20,28,palette.clayLight,'slot'],[-9,296,101,-.5,21,29,palette.chalk,'slot'],[-88,300,16,-Math.PI/2,20,34,palette.chalk,'slot'],[-67,296,-27,-Math.PI/2,20,28,palette.jade,'slot'],[15,296,-116,Math.PI,21,29,palette.chalk,'slot'],[76,296,-103,Math.PI,20,29,palette.clayLight,'slot']]);"
s=once(s,old,new,p+' adaptive threshold')
s=s.replace("version:'2026-09-07-asymmetric-1'","version:'2026-09-08-asymmetric-2'")
write(p,s)

# Current ontology is the authoritative live inventory, not the archived maps.
p='tower-ontology-audit.json';o=json.loads(read(p));o['checked_at']='2026-09-08'
o['inventory']['owner_total']=37;o['inventory']['research_programmes']=36
o['inventory']['note']='36 research programmes plus the homepage meta-registry. TTF and adaptive-gain were added 2026-09-07/08; active or placed does not mean empirically validated.'
for floor,repo in [(1,'TTF'),(2,'adaptive-gain')]:
    xs=o['floors'][floor]['repositories']
    if repo not in xs: xs.append(repo)
o['orthogonal_worlds']['transferable_transition_geometry']={
  'repositories':['fcp','TTF','boundary'],
  'topology':'frozen empirical sampling frame -> held-out-species transfer test -> geometry applicability boundary',
  'meaning':'sharedness is out-of-species transferability; idealized qualification does not license an arbitrary empirical sampling geometry',
  'claim_ceiling':'FCP empirical colour structure, TTF transferability and a sampling-geometry qualification are separate claims.'}
o['orthogonal_worlds']['adaptive_measurement_routing']={
  'repositories':['mrod','adaptive-gain','payoff','balance'],
  'topology':'candidate observations and outcomes -> branch-contingent acquisition -> guaranteed target resolution cost',
  'meaning':'adaptive-gain abstracts the finite routing/cost structure exposed across existing programmes',
  'claim_ceiling':'finite deterministic target resolution is not field validation or a biological reporting licence.'}
o['portfolio_syntheses']=[
 {'id':'state_resolution','scientific_edge':False,'repositories':['eco-genetic-warning-extensions','chun','acsp','sdmr','TTF','crest','boundary','mrod'],'principle':'useful ecological state != convenient coarse summary'},
 {'id':'context_branching','scientific_edge':False,'repositories':['balance','izu-core','eco-genetic-warning-extensions','eog','adaptive-gain','mrod'],'principle':'response and information value depend on state, context and measurement path'}]
existing={c.get('type') for c in o['current_cross_world_contacts']}
for c in [
 {'from':['fcp'],'to':['TTF'],'status':'bounded','type':'heldout_transfer_method'},
 {'from':['TTF'],'to':['boundary'],'status':'bounded','type':'sampling_geometry_applicability'},
 {'from':['mrod','payoff','balance'],'to':['adaptive-gain'],'status':'established','type':'finite_adaptive_abstraction'}]:
    if c['type'] not in existing:o['current_cross_world_contacts'].append(c)
write(p,json.dumps(o,ensure_ascii=False,indent=2)+'\n')

p='tower-closure-audit.json';o=json.loads(read(p));o['checked_at']='2026-09-08'
if not any(c['id']=='ttf_to_fresh_geometry' for c in o['contacts']):
    o['contacts'].append({'id':'ttf_to_fresh_geometry','from':['TTF'],'to':['fresh external sampling geometry'],'status':'open','question':'Can a prospective applicability rule retain calibration and power under a fresh empirical geometry?','closure_condition':'Version the minimum held-out-species/applicability rule before outcomes, freeze a genuinely fresh external geometry, and pass both type-I and power bounds without retuning on failed Gate-I-A.'})
receipts={r['id'] for r in o['bounded_receipts']}
extras=[
 {'id':'adaptive_gain_finite_theory','status':'established','receipt':'Finite deterministic theory proves C_A<=C_F, characterizes strict adaptive gain and sharp unit-cost extrema; it explicitly does not claim field empirical validation.'},
 {'id':'ttf_gate_i_a_geometry','status':'bounded','receipt':'TTF v0.2 passed idealized high-precision gates, but frozen Gate-I-A actual animal geometry failed at shared=0 A=3 (rejection 0.110; Wilson upper 0.1405) and full-shared A=2 (power 0.392; Wilson lower 0.3502). Gate I therefore remains failed.'},
 {'id':'egwe_last_refuge_holdout','status':'bounded','receipt':'Prospectively frozen 12,000-trajectory finite-model holdout confirmed continuous last-refuge reserve as an early discriminator (mean AUC 0.92734) and added ranking beyond co-timed max-q; no natural-universal warning claim.'},
 {'id':'chun_linoideae_state_resolution','status':'bounded','receipt':'One Linoideae radiation showed 54/54 conditional hue tests p=0.0001 while binary WHITE/NONWHITE organization was not robust; this supports finer state-space organization, not a shared pigment or pollinator mechanism.'},
 {'id':'acsp_channel_complementarity','status':'bounded','receipt':'Development-only 96-pair comparison did not nominate environment over nearest-known, while overlap diagnostics retained environment-only and nearest-only novel clusters. No fitted blend or unbudgeted union is authorized.'}
]
for r in extras:
    if r['id'] not in receipts:o['bounded_receipts'].append(r)
write(p,json.dumps(o,ensure_ascii=False,indent=2)+'\n')

# Contract test sees the overlay before deep-freeze.
p='tests/tower_contract.cjs';s=read(p)
s=once(s,"vm.runInNewContext(fs.readFileSync('tower-data.js','utf8'),context);","vm.runInNewContext(fs.readFileSync('tower-data.js','utf8'),context);\nvm.runInNewContext(fs.readFileSync('portfolio-20260908.js','utf8'),context);",p+' load overlay')
s=s.replace("assert.equal(ontology.inventory.owner_total,35);","assert.equal(ontology.inventory.owner_total,37);")
s=s.replace("assert.equal(ontology.inventory.research_programmes,34);","assert.equal(ontology.inventory.research_programmes,36);")
s=s.replace("assert.equal(d.repos.length,34);","assert.equal(d.repos.length,36);")
s=s.replace("assert.equal(d.contacts.length,17);","assert.equal(d.contacts.length,20);")
s=s.replace("assert(d.repos.find(r=>r[0]==='284b')[4].includes('relation-check'));","assert(d.repos.find(r=>r[0]==='284b')[4].includes('relation-check'));\nassert.equal(d.repos.find(r=>r[0]==='TTF')[1],1);\nassert.equal(d.repos.find(r=>r[0]==='adaptive-gain')[1],2);\nassert.equal(d.syntheses.length,2);\nassert(d.syntheses.every(s=>s.scientific_edge===false));")
s=s.replace("console.log('Tower contract: 34 entrances, 5 motifs, 17 typed contacts, 5 cross-floor rune recurrences; no invented edges.');","console.log('Tower contract: 36 entrances, 5 motifs, 20 typed contacts, 5 cross-floor runes + non-edge synthesis recurrence; no invented scientific edges.');")
write(p,s)

p='tests/tower_browser_test.py';s=read(p)
s=s.replace("scripts=('tower-data.js','tower-architecture.js','tower.js','tower-echo-data.js','tower-perspective-clue.js','tower-echo-clue.js')","scripts=('tower-data.js','portfolio-20260908.js','tower-architecture.js','tower.js','tower-echo-data.js','tower-perspective-clue.js','tower-echo-clue.js','portfolio-thread.js')")
s=s.replace("check('34 unique repository doorways',len(data['repos'])==34==len({r[0] for r in data['repos']}))","check('36 unique repository doorways',len(data['repos'])==36==len({r[0] for r in data['repos']}))")
s=s.replace("==34)","==36)")
s=s.replace("34 research","36 research")
s=once(s,"check('cross-floor rune canvas is mounted without labels',page.locator('#crossFloorEchoes').count()==1 and page.locator('#crossFloorEchoes').get_attribute('aria-hidden')=='true')","check('cross-floor rune canvas is mounted without labels',page.locator('#crossFloorEchoes').count()==1 and page.locator('#crossFloorEchoes').get_attribute('aria-hidden')=='true')\n        check('portfolio synthesis recurrence is explicitly non-edge',page.locator('#portfolioSynthesis').count()==1 and all(x['scientific_edge'] is False for x in data['syntheses']))",p+' synthesis check')
write(p,s)

p='tests/rooms_browser_test.py';s=read(p)
s=s.replace("check('34 source-backed rooms and four TMOP glyphs', len(data['repos']) == 34 and len(snap()['membership']) == 34)","check('36 source-backed rooms and four TMOP glyphs', len(data['repos']) == 36 and len(snap()['membership']) == 36)")
s=s.replace("check('flat map contains all 34 rooms', page.locator('[data-map-room]').count() == 34)","check('flat map contains all 36 rooms', page.locator('[data-map-room]').count() == 36)")
write(p,s)

p='tests/architecture_browser_test.py';s=read(p)
s=s.replace("check('all 34 scientific entrances retained',sn()['repoCount']==34)","check('all 36 scientific entrances retained',sn()['repoCount']==36)")
write(p,s)

p='tests/origin_browser_test.py';s=read(p)
s=s.replace("check('all 34 room entries remain accessible',page.locator('[data-map-room]').count()==34)","check('all 36 room entries remain accessible',page.locator('[data-map-room]').count()==36)")
write(p,s)

# Syntax checks for the new current layers.
p='.github/workflows/site-qa.yml';s=read(p)
s=once(s,'          node --check tower-data.js\n','          node --check tower-data.js\n          node --check portfolio-20260908.js\n          node --check portfolio-thread.js\n',p+' syntax')
write(p,s)

# Add an explicit current note without rewriting historical audit narratives.
p='TOWER_AUDIT.md';s=read(p)
marker='## 2026-09-08 inventory and synthesis overlay'
if marker not in s:
    s+='''\n\n## 2026-09-08 inventory and synthesis overlay\n\nThe current owner inventory is 37 repositories: 36 research rooms plus this site as meta-registry. `TTF` enters floor II (record/observation contract) and `adaptive-gain` enters floor III (possible-world measurement design). The earlier 34-room counts above are historical snapshots and are superseded for the current live tower by `tower-ontology-audit.json` and `portfolio-synthesis-2026-09-08.json`.\n\nThree current typed interfaces are added: FCP -> TTF is bounded held-out-transfer/geometry qualification; TTF -> Boundary is a bounded applicability boundary; MROD/PAYOFF/BALANCE -> adaptive-gain is an established abstraction of finite decision routing, not claim inheritance.\n\nThe repeated resolution-fracture rune is a portfolio synthesis only. Its ledger sets `scientific_edge=false`: seeing the same design warning at EGWE, CHUN, ACSP, SDMR, TTF, CREST, Boundary and MROD does not assert a shared mechanism.\n'''
write(p,s)

print('Applied 2026-09-08 portfolio overlay: 36 rooms / 20 typed contacts / 2 non-edge syntheses.')
