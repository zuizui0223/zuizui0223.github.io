"""Regression for the origin cloche and minimal identity, on the actual HTML.
The botanical sculpture is an illustration, not an anatomical or scientific model.
Run: python tests/origin_browser_test.py [--chromium /usr/bin/chromium]
"""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import runpy
from pathlib import Path
import threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'test-results'/'origin'
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):
        pass

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--chromium',default=None)
    parser.add_argument('--inline',action='store_true',help='Use current local assets without loopback navigation')
    args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    checks,errors,failures=[],[],[]
    def check(name,value):
        assert value,name
        checks.append(name)
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox'])
            page=browser.new_page(viewport={'width':1440,'height':1050},reduced_motion='reduce')
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('response',lambda r:failures.append(r.url) if r.status>=400 else None)
            base=f'http://127.0.0.1:{server.server_port}/'
            inline=runpy.run_path(str(ROOT/'tests'/'rooms_browser_test.py'))['inline_site']
            def load(target):
                if args.inline: target.set_content(inline())
                else: target.goto(base)
            load(page)
            page.wait_for_function('window.ZUIZUI_ORIGIN && ZUIZUI_ORIGIN.snapshot().frames>0')
            data=page.evaluate('JSON.stringify(ZUIZUI_TOWER)')
            sn=lambda:page.evaluate('ZUIZUI_ORIGIN.snapshot()')
            check('browser title contains only the retained identity',page.title()=='PhD in zuizui')
            check('hero identity is exactly PhD in zuizui',page.locator('.signature').inner_text().strip()=='PhD in zuizui')
            check('no standalone wordmark remains',page.locator('#homeLink').inner_text()=='')
            check('no personal-name label remains on the homepage','zhang' not in page.locator('body').inner_text().lower() and '脳' not in page.locator('.signature').inner_text())
            check('zuizui occurs only in the retained phrase on the initial screen',page.locator('body').inner_text().lower().count('zuizui')==1)
            check('one glass botanical emblem is mounted',page.locator('#originFlower').count()==1)
            check('the illustrated bellflower has five corolla lobes',sn()['openFlowers']==1 and sn()['corollaLobes']==5)
            check('the sculpture geometry is frozen',sn()['geometryFrozen'])
            check('origin is a link to an existing research room',page.locator('#originButton').get_attribute('data-room')=='hotarubukuro')
            check('origin is keyboard and screen-reader accessible',page.locator('#originButton').get_attribute('aria-label').startswith('原点のホタルブクロ'))
            page.screenshot(path=str(OUT/'homepage.png'))
            page.locator('.origin-shrine').screenshot(path=str(OUT/'flower.png'))
            angle=sn()['yaw']
            page.locator('#turnRight').click()
            page.wait_for_function('(a)=>ZUIZUI_ORIGIN.snapshot().yaw!==a',arg=angle)
            check('the flower viewpoint follows rotation of the same tower',abs(sn()['yaw']-angle)>.1)
            page.wait_for_timeout(160)
            frames=sn()['frames'];page.wait_for_timeout(350)
            check('there is no continuous idle animation',sn()['frames']==frames)
            page.locator('#originButton').click()
            check('touching the flower enters the original bellflower room',page.evaluate('ZUIZUI_ROOMS.snapshot().room')=='hotarubukuro')
            check('entering the origin does not solve a scientific puzzle',page.evaluate('ZUIZUI_TOWER_STATE.snapshot().visited.length')==0)
            page.keyboard.press('Escape')
            check('leaving the room returns to the tower',page.evaluate('ZUIZUI_ROOMS.snapshot().room') is None)
            check('keyboard focus returns to the origin button',page.evaluate('document.activeElement.id')=='originButton')
            page.keyboard.press('Enter')
            check('Enter can open the origin without pointer interaction',page.evaluate('ZUIZUI_ROOMS.snapshot().room')=='hotarubukuro')
            page.keyboard.press('Escape')
            page.locator('#philosophyButton').click()
            check('the retained title still opens the notebook',page.locator('#notebook').evaluate('(e)=>e.open'))
            check('notebook header no longer repeats the name',page.locator('.book-kicker').inner_text()=='field notes')
            page.keyboard.press('Escape')
            page.locator('#mapButton').click()
            check('foldout header is also name-free',page.locator('#roomMap .r-eyebrow').inner_text().lower()=='atlas')
            check('all 34 room entries remain accessible',page.locator('[data-map-room]').count()==34)
            page.keyboard.press('Escape')
            page.locator('#floorRail [data-floor="2"]').click()
            page.wait_for_function('ZUIZUI_TOWER_STATE.snapshot().currentFloor===2')
            check('the emblem yields to the architecture while climbing',not page.locator('#originButton').is_visible())
            page.keyboard.press('Home')
            page.wait_for_function('ZUIZUI_TOWER_STATE.snapshot().progress===0')
            check('returning to the overview restores the emblem',page.locator('#originButton').is_visible())
            check('no research classifications or evidence statuses changed',page.evaluate('JSON.stringify(ZUIZUI_TOWER)')==data)
            for width,height in [(320,700),(390,844),(768,1024),(1920,1080)]:
                device=browser.new_page(viewport={'width':width,'height':height},has_touch=width<760,is_mobile=width<760,reduced_motion='reduce')
                device.on('pageerror',lambda e:errors.append(str(e)))
                load(device);device.wait_for_function('window.ZUIZUI_ORIGIN && ZUIZUI_ORIGIN.snapshot().frames>0')
                check(f'{width}: no horizontal overflow',device.evaluate('document.documentElement.scrollWidth<=innerWidth'))
                bounds=device.locator('.origin-shrine').bounding_box()
                check(f'{width}: emblem and title fit the viewport',bounds['x']>=0 and bounds['x']+bounds['width']<=width and bounds['y']+bounds['height']<height-80)
                check(f'{width}: retained title is legible and not clipped',device.locator('#philosophyButton').evaluate('(e)=>e.scrollWidth<=e.clientWidth'))
                if width==390:
                    device.screenshot(path=str(OUT/'mobile.png'))
                    device.locator('#originButton').tap()
                    check('mobile tap opens the original research room',device.evaluate('ZUIZUI_ROOMS.snapshot().room')=='hotarubukuro')
                device.close()
            check('no browser runtime errors',not errors)
            check('all current inline assets loaded' if args.inline else 'every referenced homepage asset loaded over HTTP',not failures)
            browser.close()
    finally:
        server.shutdown();server.server_close()
    report={'passed':len(checks),'checks':checks,'runtime_errors':errors,'asset_failures':failures,'mode':'inline' if args.inline else 'http','scope':'Current homepage assets in Chromium. Inline mode does not verify HTTP delivery. Viewport/touch emulation is not physical-device or aesthetic validation.'}
    (OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()
