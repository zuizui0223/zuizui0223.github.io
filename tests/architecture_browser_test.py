"""Geometric and interaction checks; contact sheets are for visual review.
No numeric assertion here constitutes a judgment of beauty. Serve the real HTML
and assets over loopback, rather than silently excluding an enhancement layer.
"""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import math
from pathlib import Path
import threading
import runpy
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'test-results'/'architecture'
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--chromium');ap.add_argument('--inline',action='store_true',help='Use local inline assets where loopback browser navigation is disallowed');args=ap.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
    thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    base=f'http://127.0.0.1:{server.server_port}'
    inline=runpy.run_path(str(ROOT/'tests'/'rooms_browser_test.py'))['inline_site']
    def load(page):
        if args.inline: page.set_content(inline())
        else: page.goto(base)
    checks=[];errors=[];missing=[]
    def check(name,ok):
        assert ok,name
        checks.append(name)
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox'])
            page=browser.new_page(viewport={'width':1440,'height':1050},reduced_motion='reduce')
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
            load(page);page.wait_for_function('window.ZUIZUI_ROOMS && window.ZUIZUI_TOWER_STATE')
            page.wait_for_timeout(120)
            data=page.evaluate('JSON.stringify(ZUIZUI_TOWER)')
            sn=lambda:page.evaluate('ZUIZUI_TOWER_STATE.snapshot()')
            positions=[x['point'] for x in sn()['positions']]
            stages=sn()['stages']
            check('five different architectural programmes',len({s['form'] for s in stages})==5)
            check('independent geometry spans for every floor',len({s['count'] for s in stages})==5)
            check('all 36 scientific entrances retained',sn()['repoCount']==36)
            page.screenshot(path=str(OUT/'front.png'))
            views=[]
            for i in range(4):
                if i:
                    for _ in range(5): page.locator('#turnRight').click()
                    page.wait_for_timeout(40)
                views.append({x['id'] for x in sn()['positions'] if x['visible']})
                page.screenshot(path=str(OUT/f'view-{i+1}.png'))
            check('quarter-turns reveal different entrances',len({tuple(sorted(v)) for v in views})==4)
            check('rotation never moves an entrance in world space',[x['point'] for x in sn()['positions']]==positions)
            # Genuine pointer interactions are covered separately by rooms_browser_test.
            # Here rotate through the public controls to audit every exterior entrance.
            all_revealed=set()
            for floor in range(5):
                page.locator(f'#floorRail [data-floor="{floor}"]').click()
                page.wait_for_function('(f)=>ZUIZUI_TOWER_STATE.snapshot().currentFloor===f',arg=floor)
                for j in range(32):
                    all_revealed.update(x['id'] for x in sn()['positions'] if x['visible'])
                    page.keyboard.press('ArrowRight');page.keyboard.press('ArrowRight')
                    page.wait_for_function('Math.abs(ZUIZUI_TOWER_STATE.snapshot().yaw-ZUIZUI_TOWER_STATE.snapshot().targetYaw)<.001')
                page.screenshot(path=str(OUT/f'floor-{floor+1}.png'))
            wanted={r[0] for r in json.loads(data)['repos']}
            print('Unrevealed:',sorted(wanted-all_revealed),flush=True)
            check('every exterior doorway has an unobstructed camera angle',all_revealed==wanted)
            # Five source-backed perspective discoveries, through actual camera controls.
            for i,m in enumerate(json.loads(data)['motifs']):
                page.locator(f'#floorRail [data-floor="{i}"]').click()
                page.wait_for_function('(i)=>ZUIZUI_TOWER_STATE.snapshot().currentFloor===i',arg=i)
                delta=(m['angle']-sn()['targetYaw']+math.pi)%(2*math.pi)-math.pi
                for _ in range(abs(round(delta/.1))):page.keyboard.press('ArrowRight' if delta>0 else 'ArrowLeft')
                page.wait_for_timeout(40)
                check(f'{m["id"]}: physical perspective puzzle remains solvable',sn()['alignment']['ready'])
                page.locator('#seal').click()
                check(f'{m["id"]}: discovery recorded without changing evidence',m['id'] in sn()['visited'] and page.evaluate('JSON.stringify(ZUIZUI_TOWER)')==data)
            page.locator('#returnButton').click();page.wait_for_timeout(60)
            check('five discoveries still return to the field',sn()['returned'] and sn()['currentFloor']==0)
            for i,r in enumerate(['hotarubukuro','rec','boundary','crest','payoff']):
                page.locator('#mapButton').click();page.locator(f'[data-map-room="{r}"]').click()
                page.wait_for_timeout(50);page.screenshot(path=str(OUT/f'chamber-{i+1}.png'))
                check(f'{r}: interior matches exterior spatial language',page.evaluate('ZUIZUI_ROOMS.snapshot().chamber')==stages[i]['id'])
                page.locator('#roomBack').click()
            page.keyboard.press('Home');page.wait_for_timeout(50)
            for width,height in [(320,700),(390,844),(768,1024)]:
                device=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<760,has_touch=width<760,reduced_motion='reduce')
                device.on('pageerror',lambda e:errors.append(str(e)))
                load(device);device.wait_for_function('window.ZUIZUI_ROOMS');device.wait_for_timeout(60)
                check(f'{width}: no viewport overflow',device.evaluate('document.documentElement.scrollWidth<=innerWidth'))
                device.screenshot(path=str(OUT/f'viewport-{width}.png'))
                device.close()
            check('scientific ledger remains byte-identical in memory',page.evaluate('JSON.stringify(ZUIZUI_TOWER)')==data)
            check('no JavaScript runtime errors',not errors)
            check('all referenced local assets included' if args.inline else 'all homepage assets load over HTTP',not missing)
            browser.close()
    finally:
        server.shutdown();server.server_close()
    report={'passed':len(checks),'checks':checks,'runtime_errors':errors,'asset_failures':missing,'mode':'inline' if args.inline else 'http','scope':'Chromium visual and interaction checks. Visual contact sheets require human judgment; no claim of aesthetic validation or physical-device testing.'}
    (OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
