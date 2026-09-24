from pathlib import Path
import re,json
R=Path.cwd()
p=R/'portfolio-20260908.js';s=p.read_text()
a=s.index('      const individualRoute=');b=s.index('      const ringPts=',a)
s=s[:a]+'''      // Exterior connecting lines removed at the author's request (2026-09-24).
      // Research routes survive in the optional horizontal reading ledger only.
      const individualRoute=[],spatialRoute=[],individualReturn=[],spatialReturn=[];
'''+s[b:]
s=s.replace("mode:'bifurcate-reconverge',source:'payoff',individual:","mode:'bifurcate-reconverge',renderedRoutes:false,source:'payoff',individual:")
p.write_text(s)
p=R/'tower-architecture.js';s=p.read_text();s=s.replace('const v=anchors[j],p=portal(...v);',"const v=D.entrances?.[row[0]]||anchors[j];\n        if(!v)throw new Error('Missing entrance for '+row[0]);\n        const p=portal(...v);")
p.write_text(s)
p=R/'rooms.js';s=p.read_text()
s=s.replace("const repos=new Map(D.repos.map(r=>[r[0],r]));", "const canonical=id=>D.repositoryAliases?.[id]||id;\nconst repos=new Map(D.repos.map(r=>[r[0],r]));")
s=s.replace("const source=(id,path='')=>`https://github.com/zuizui0223/${encodeURIComponent(id)}${path?'/blob/main/'+path:''}`;", "const source=(id,path='')=>D.repositorySources?.[canonical(id)]?.url||`https://github.com/zuizui0223/${encodeURIComponent(canonical(id))}${path?'/blob/main/'+path:''}`;")
s=s.replace("'eco-genetic-criticality'","'egc'").replace("'eco-genetic-warning-extensions'","'egwe'")
s=s.replace("'adaptive-gain':'T'});", "'adaptive-gain':'T',...D.roomMembership});")
s=s.replace('const shortConditions={', 'Object.assign(art,D.roomArt||{});\nconst shortConditions={')
s=s.replace(".filter(x=>repos.has(x))", ".map(canonical).filter(x=>repos.has(x))")
s=s.replace("function navigate(id,historyMode='push'){", "function navigate(id,historyMode='push'){\n id=id?canonical(id):null;")
s=s.replace("navigate(repos.has(id)?id:null,'none');", "id=canonical(id);navigate(repos.has(id)?id:null,'none');")
s=s.replace('(rows.length>8?51:59)', '(Math.min(59,435/Math.max(1,rows.length-1)))')
s=s.replace("'architecture-game':'葛藤・回復・費用 → 構造の利得'", "'architecture-game':'SCH / BALANCE / PAYOFF → SLK；BITAは別軸'")
p.write_text(s)
p=R/'index.html';s=p.read_text()
s=s.replace('<script src="portfolio-20260908.js?v=20260908p1" defer></script>', '<script src="portfolio-20260908.js?v=20260924h1" defer></script>\n<script src="horizontal-data.js?v=20260924h1" defer></script>\n<script src="portfolio-current.js?v=20260924h1" defer></script>')
s=s.replace('<script src="rooms.js?v=20260907a1" defer></script>', '<script src="rooms.js?v=20260924h1" defer></script>\n<script src="horizontal.js?v=20260924h1" defer></script>')
s=s.replace('tower-architecture.js?v=20260907a1','tower-architecture.js?v=20260924h1')
s=s.replace('<link rel="stylesheet" href="origin.css?v=20260907o1">','<link rel="stylesheet" href="origin.css?v=20260907o1">\n<link rel="stylesheet" href="horizontal.css?v=20260924h1">')
p.write_text(s)
p=R/'tower-ontology-audit.json';o=json.loads(p.read_text());o['checked_at']='2026-09-24'
canon=lambda x:{'eco-genetic-criticality':'egc','eco-genetic-warning-extensions':'egwe'}.get(x,x)
def rename(x):
 if isinstance(x,str):return canon(x)
 if isinstance(x,list):return [rename(z)for z in x]
 if isinstance(x,dict):return {k:rename(v)for k,v in x.items()}
 return x
o=rename(o);o['inventory'].update(owner_total=41,research_programmes=40,note='40 research repositories plus the site; role audit 2026-09-24. Renames preserve identity. esdm programme is a pinned development branch, not merged main.')
for f,id in [(0,'iwe'),(2,'esdm'),(2,'Structural'),(4,'slk')]:
 o['floors'][f]['repositories'].append(id)
o['horizontal_registry']='horizontal-audit.json';o['display_contract']={'exterior_syndrome_routes':False,'horizontal_links':'optional, typed, bidirectionally navigable reading relations; not scientific evidence edges'}
p.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n')
for name in ['tower_contract.cjs','tower_browser_test.py','rooms_browser_test.py','architecture_browser_test.py','origin_browser_test.py']:
 p=R/'tests'/name;s=p.read_text()
 s=s.replace("vm.runInNewContext(fs.readFileSync('portfolio-20260908.js','utf8'),context);", "vm.runInNewContext(fs.readFileSync('portfolio-20260908.js','utf8'),context);\nvm.runInNewContext(fs.readFileSync('horizontal-data.js','utf8'),context);\nvm.runInNewContext(fs.readFileSync('portfolio-current.js','utf8'),context);")
 s=s.replace("'portfolio-20260908.js','tower-architecture.js'", "'portfolio-20260908.js','horizontal-data.js','portfolio-current.js','tower-architecture.js'")
 s=s.replace("'portfolio-20260908.js','portfolio-current.js'", "'portfolio-20260908.js','horizontal-data.js','portfolio-current.js'")
 s=re.sub(r'\b36\b','40',s)
 s=s.replace('ontology.inventory.owner_total,37','ontology.inventory.owner_total,41')
 s=s.replace("assert(model.faces.some(f=>f.synthesis==='syndrome-assembly'&&f.layer===4));", "assert.equal(model.syndromeAssembly.renderedRoutes,false);\nassert(!model.faces.some(f=>f.synthesis==='syndrome-assembly'&&f.layer===4));")
 p.write_text(s)
