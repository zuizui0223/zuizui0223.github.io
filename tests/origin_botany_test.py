"""Botanical illustration regression, not scientific or anatomical validation.
Uses all current homepage assets; --inline is available for sandbox previews.
Existing origin, architecture and room workflow checks remain unchanged.
"""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import math
from pathlib import Path
import runpy
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'test-results' / 'origin-botany'

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--chromium', default=None)
    ap.add_argument('--inline', action='store_true')
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    inline = runpy.run_path(str(ROOT / 'tests/rooms_browser_test.py'))['inline_site']
    checks, errors, failures = [], [], []
    def check(name, passed):
        assert passed, name
        checks.append(name)
    def load(page):
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('response', lambda r: failures.append(r.url) if r.status >= 400 else None)
        if args.inline:
            page.set_content(inline())
        else:
            page.goto(f'http://127.0.0.1:{server.server_port}/')
        page.wait_for_function('window.ZUIZUI_ORIGIN && ZUIZUI_ORIGIN.snapshot().frames > 0')
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path=args.chromium, headless=True, args=['--no-sandbox'])
            page = browser.new_page(viewport={'width':1440,'height':1050}, device_scale_factor=2, reduced_motion='reduce')
            load(page)
            snap = lambda: page.evaluate('ZUIZUI_ORIGIN.snapshot()')
            original = snap()
            data = page.evaluate('JSON.stringify(ZUIZUI_TOWER)')
            a = original['botany']
            check('five independent long calyx lobes', len(a['sepals']) == 5)
            check('five separate reflexed sinus appendages', len(a['appendages']) == 5 and all(x['reflexed'] for x in a['appendages']))
            check('appendages alternate between the main sepals', all(abs((b['angle']-s['angle'])-math.pi/5)<1e-8 for s,b in zip(a['sepals'],a['appendages'])))
            down = [0.16,-1,0.07]
            check('long sepals follow the corolla direction', all(sum((s['tip'][i]-s['base'][i])*down[i] for i in range(3))>0 for s in a['sepals']))
            check('short appendages fold towards the pedicel', all(sum((s['tip'][i]-s['base'][i])*down[i] for i in range(3))<0 for s in a['appendages']))
            check('five leaves attach at distinct ascending nodes', len(a['leaves'])==5 and [x['node'][1] for x in a['leaves']]==sorted({x['node'][1] for x in a['leaves']}))
            check('lower leaves and upper leaf have different outlines', a['leaves'][0]['form']=='cordate-ovate' and a['leaves'][4]['form']=='upper-lanceolate')
            check('upper leaf has shorter petiole than lower leaves', a['leaves'][4]['petioleLength'] < min(x['petioleLength'] for x in a['leaves'][:2]))
            check('existing closed bud receives a green calyx', a['budSepals']==5)
            check('one open flower and its five corolla lobes are retained', original['openFlowers']==1 and original['corollaLobes']==5)
            mesh = page.evaluate("""() => {
                const norm=a=>a.map(x=>x/Math.hypot(...a)),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
                const down=norm([.16,-1,.07]),side=norm(cross(down,[0,0,1])),other=norm(cross(side,down));
                const m=ZUIZUI_ORIGIN_BOTANY.build({origin:[20,143,7],down,side,other});
                return {frozen:Object.isFrozen(m)&&Object.isFrozen(m.surfaces)&&m.surfaces.every(Object.isFrozen),
                  finite:[...m.surfaces,...m.details].every(f=>f.points.every(p=>p.every(Number.isFinite))),
                  roles:[...new Set(m.surfaces.map(s=>s.role))],details:[...new Set(m.details.map(d=>d.role))],
                  inside:m.surfaces.every(f=>f.points.every(p=>Math.hypot(p[0],p[2])<52 && p[1]>2 && p[1]<158))};
            }""")
            check('complete botanical mesh and strokes contain finite vertices', mesh['finite'])
            check('calyx, lamina and winged petioles exist as geometry', {'sepal','calyx-appendage','calyx-cup','leaf','petiole-wing','bud-sepal'} <= set(mesh['roles']))
            check('midrib, branched veins and hairs are generated', {'midrib','secondary-vein','veinlet','hair'} <= set(mesh['details']))
            check('botanical geometry stays within the glass envelope', mesh['inside'])
            check('botanical geometry and anatomy are deeply frozen', original['botanyFrozen'] and mesh['frozen'])
            check('only the retained identity appears in the hero', page.locator('.signature').inner_text().strip()=='PhD in zuizui')
            page.screenshot(path=str(OUT/'homepage.png'))
            page.locator('.origin-shrine').screenshot(path=str(OUT/'flower-detail.png'))
            for i in range(4):
                for _ in range(5):
                    page.locator('#turnRight').click()
                page.wait_for_timeout(100)
                check(f'angle {i+1}: fixed morphology survives rotation', snap()['botany']==a)
                page.locator('.origin-shrine').screenshot(path=str(OUT/f'angle-{i+1}.png'))
            check('all scientific contacts and statuses are unchanged', page.evaluate('JSON.stringify(ZUIZUI_TOWER)')==data)
            page.wait_for_timeout(200)
            frames=snap()['frames'];page.wait_for_timeout(350)
            check('detail rendering stops at rest', snap()['frames']==frames)
            page.locator('#originButton').click()
            check('the flower still opens its existing research room', page.evaluate('ZUIZUI_ROOMS.snapshot().room')=='hotarubukuro')
            page.keyboard.press('Escape')
            check('keyboard focus returns to the origin', page.evaluate('document.activeElement.id')=='originButton')
            for width,height in [(320,700),(390,844),(768,1024)]:
                mobile = browser.new_page(viewport={'width':width,'height':height},is_mobile=width<760,has_touch=width<760,reduced_motion='reduce')
                load(mobile)
                check(f'{width}: page does not overflow horizontally', mobile.evaluate('document.documentElement.scrollWidth<=innerWidth'))
                check(f'{width}: origin canvas is visible', mobile.locator('#originFlower').is_visible())
                if width==390:
                    mobile.screenshot(path=str(OUT/'mobile.png'))
                    mobile.locator('#originButton').tap()
                    check('mobile tap still enters the origin room', mobile.evaluate('ZUIZUI_ROOMS.snapshot().room')=='hotarubukuro')
                mobile.close()
            check('no JavaScript runtime errors', not errors)
            check('all referenced assets loaded', not failures)
            browser.close()
    finally:
        server.shutdown();server.server_close()
    report={'passed':len(checks),'checks':checks,'errors':errors,'asset_failures':failures,'mode':'inline' if args.inline else 'http',
            'scope':'Illustrative geometry and current-page Chromium interaction. Not anatomical validation, a scanned specimen, or physical-device testing.'}
    (OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()
