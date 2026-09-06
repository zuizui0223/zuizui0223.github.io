"""Tower-core regression. Rooms have their own full-index regression suite.
The geometry module and visual stylesheet are included; no room interception is
loaded in this focused suite. Use rooms_browser_test and architecture_browser_test
for the actual combined page. No browser policy changes or remote requests.
"""
from pathlib import Path
import argparse,json,math,re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT.parent/'test-results'
OUT.mkdir(exist_ok=True)

def inline_site():
    html=(ROOT/'index.html').read_text()
    html=re.sub(r'<link\s+rel="stylesheet"\s+href="[^"]+"\s*/?>','',html)
    html=re.sub(r'<script\s+src="[^"]+"[^>]*>\s*</script>','',html)
    html=html.replace('</head>',''.join('<style>'+(ROOT/n).read_text()+'</style>' for n in ('tower.css','architecture.css'))+'</head>')
    scripts=('tower-data.js','tower-architecture.js','tower.js','tower-echo-data.js','tower-perspective-clue.js','tower-echo-clue.js')
    return html.replace('</body>',''.join('<script>'+(ROOT/n).read_text()+'</script>' for n in scripts)+'</body>')

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--chromium',default=None);args=parser.parse_args()
    results=[];errors=[]
    def check(name,value):
        assert value,name
        results.append(name)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
        page.on('pageerror',lambda err:errors.append(str(err)))
        page.set_content(inline_site());page.wait_for_timeout(150)
        data=page.evaluate('ZUIZUI_TOWER');snap=lambda:page.evaluate('ZUIZUI_TOWER_STATE.snapshot()');before=snap()
        check('34 unique repository doorways',len(data['repos'])==34==len({r[0] for r in data['repos']}))
        check('five motifs; all have sources and closure receipts',len(data['motifs'])==5 and all(m['sourceBlob'] and m['receipt'] for m in data['motifs']))
        check('all typed contacts covered by motifs',{c['id'] for c in data['contacts']}=={c for m in data['motifs'] for c in m['contacts']})
        check('five cross-floor recurrences are immutable clue data',page.evaluate('Object.isFrozen(ZUIZUI_TOWER_ECHOES)&&ZUIZUI_TOWER_ECHOES.length===5'))
        check('cross-floor rune canvas is mounted without labels',page.locator('#crossFloorEchoes').count()==1 and page.locator('#crossFloorEchoes').get_attribute('aria-hidden')=='true')
        check('284b is a relation-space programme, not empty staging',next(r for r in data['repos'] if r[0]=='284b')[4].endswith('relation-check'))
        check('scientific metadata deep-frozen',page.evaluate('Object.isFrozen(ZUIZUI_TOWER)&&ZUIZUI_TOWER.contacts.every(Object.isFrozen)'))
        page.locator('#turnRight').click();page.wait_for_timeout(60);after=snap()
        check('rotation changes projected positions',before['positions'][0]['screen']!=after['positions'][0]['screen'])
        check('rotation preserves every world-space position',[r['point'] for r in before['positions']]==[r['point'] for r in after['positions']])
        check('rotation does not rewrite research data',page.evaluate('ZUIZUI_TOWER')==data)
        page.locator('#bookButton').click();page.locator('[data-motif="return"]').click();page.locator('[data-read="return"]').click()
        check('reading without play does not mark a puzzle solved',snap()['visited']==[])
        check('ACSP disclaimer is available in the notebook','保証' in page.locator('#bookContent').inner_text())
        page.keyboard.press('Escape')
        check('Escape closes the notebook',not page.locator('#notebook').evaluate('(e)=>e.open'))
        check('focus returns to the notebook opener',page.evaluate('document.activeElement.id')=='bookButton')
        for i,m in enumerate(data['motifs']):
            page.locator('#floorRail [data-floor="%s"]'%i).click()
            page.wait_for_function('(i)=>ZUIZUI_TOWER_STATE.snapshot().currentFloor===i',arg=i)
            delta=(m['angle']-snap()['targetYaw']+math.pi)%(2*math.pi)-math.pi
            for _ in range(abs(round(delta/.1))):page.keyboard.press('ArrowRight' if delta>0 else 'ArrowLeft')
            page.wait_for_timeout(80);s=snap()
            check(f'floor {i+1}: alignment is geometrically reachable',s['alignment']['ready'])
            check(f'floor {i+1}: seal stays on screen',80<s['alignment']['y']<915)
            page.locator('#seal').click();page.wait_for_timeout(60)
            check(f'floor {i+1}: click records discovery',m['id'] in snap()['visited'])
        check('five discoveries reveal field-return control',page.locator('#returnButton').is_visible())
        check('all scientific statuses unchanged after completion',page.evaluate('ZUIZUI_TOWER')==data)
        check('cross-floor clue layer survives a full ascent',page.locator('#crossFloorEchoes').get_attribute('data-echoes')=='5')
        page.screenshot(path=str(OUT/'five-discoveries.png'))
        page.locator('#returnButton').click();page.wait_for_timeout(100)
        check('ending returns to the field instead of claiming all proofs',snap()['returned'] and snap()['currentFloor']==0)
        page.locator('#bookButton').click();page.locator('[data-book="repos"]').first.click()
        check('all 34 research entries accessible without puzzles',page.locator('#repoResults button').count()==34)
        page.locator('#repoSearch').fill('284b')
        check('repository search filters correctly',page.locator('#repoResults button').count()==1)
        page.locator('#repoResults button').click()
        check('284b links to its actual defining document',page.locator('a',has_text='原典').get_attribute('href').endswith('product_b_eog_sdmr_relation_space_alignment.md'))
        page.screenshot(path=str(OUT/'notebook-284b.png'));page.keyboard.press('Escape')
        for width,height in [(320,700),(390,844),(768,1024),(1440,1000)]:
            device=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<760,has_touch=width<760,reduced_motion='reduce')
            device.on('pageerror',lambda err:errors.append(str(err)))
            device.set_content(inline_site());device.wait_for_timeout(80)
            check(f'{width}x{height}: no horizontal overflow',device.evaluate('document.documentElement.scrollWidth<=innerWidth'))
            check(f'{width}x{height}: repository count stable',device.evaluate('ZUIZUI_TOWER_STATE.snapshot().repoCount')==34)
            if width==390:
                session=device.context.new_cdp_session(device);original=device.evaluate('ZUIZUI_TOWER_STATE.snapshot().targetYaw')
                session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':170,'y':430}]})
                for x in [185,210,235,260]:
                    session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':430}]});device.wait_for_timeout(20)
                session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});device.wait_for_timeout(100)
                check('mobile horizontal swipe rotates the same tower',abs(device.evaluate('ZUIZUI_TOWER_STATE.snapshot().targetYaw')-original)>.2)
                device.screenshot(path=str(OUT/'mobile-rotated.png'))
            device.close()
        check('no JavaScript runtime errors',not errors);browser.close()
    report={'passed':len(results),'checks':results,'runtime_errors':errors,'scope':'Tower-core local Chromium regression. Full combined-page regression lives in the rooms and architecture suites. No aesthetic or scientific validation.'}
    (OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
