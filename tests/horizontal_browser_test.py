"""Full current-page cross-floor navigation; no scientific results are calculated."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import argparse,json,runpy,threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'test-results'/'horizontal'
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--chromium');ap.add_argument('--inline',action='store_true');args=ap.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
    threading.Thread(target=srv.serve_forever,daemon=True).start()
    inline=runpy.run_path(str(ROOT/'tests/rooms_browser_test.py'))['inline_site']
    def load(p,hash=''):
        if args.inline:
            p.set_content(inline())
            if hash:p.evaluate('(h)=>{location.hash=h;dispatchEvent(new PopStateEvent("popstate"))}',hash)
        else:p.goto(f'http://127.0.0.1:{srv.server_port}/'+hash)
        p.wait_for_function('window.ZUIZUI_CROSSINGS && window.ZUIZUI_ORIGIN')
    checks=[];errors=[];bad=[]
    def check(name,ok):
        assert ok,name
        checks.append(name)
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox'])
            p=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
            p.on('pageerror',lambda e:errors.append(str(e)))
            p.on('response',lambda r:bad.append(r.url) if r.status>=400 else None)
            load(p);p.wait_for_timeout(100)
            ledger=p.evaluate('JSON.stringify(ZUIZUI_TOWER.contacts)')
            data=p.evaluate('ZUIZUI_TOWER.horizontal')
            check('41 repositories = 40 research rooms plus site',data['inventory']['owner_total']==41 and p.locator('.doorway').count()==40)
            check('only PhD in zuizui remains as visible identity',p.locator('.signature').inner_text().strip()=='PhD in zuizui')
            p.screenshot(path=str(OUT/'homepage.png'))
            p.locator('#bookButton').click();p.locator('[data-horizontal]').click()
            check('notebook opens optional cross-floor cabinet',p.locator('#horizontalCabinet').evaluate('(d)=>d.open'))
            check('all 40 programmes represented in cabinet',p.locator('#horizontalRepos button').count()==40)
            before=p.evaluate('ZUIZUI_TOWER_STATE.snapshot().targetYaw')
            p.keyboard.press('ArrowRight')
            check('cabinet keys do not rotate the tower',p.evaluate('ZUIZUI_TOWER_STATE.snapshot().targetYaw')==before)
            for r in p.evaluate('ZUIZUI_TOWER.repos.map(r=>r[0])'):
                p.locator(f'#horizontalRepos [data-hc-select="{r}"]').click()
                check(r+': typed sourced neighbor available',p.locator('#horizontalReading [data-hc-link]').count()>0 and p.locator('#horizontalReading a').count()>0)
            for a,b in [('slk','balance'),('Structural','TTF'),('chun','fcp'),('esdm','odsp'),('iwe','sch')]:
                p.locator(f'#horizontalRepos [data-hc-select="{a}"]').click()
                p.locator(f'#horizontalReading [data-hc-select="{b}"]').click()
                check(a+' ↔ '+b+': reverse reading retains relation',p.locator(f'#horizontalReading [data-hc-select="{a}"]').count()==1)
            p.locator('#horizontalRepos [data-hc-select="esdm"]').click()
            check('ESDM identified as development branch', '開発ブランチ' in p.locator('.hc-room-head').inner_text())
            check('all ESDM interfaces remain explicitly proposed', p.locator('#horizontalReading .hc-link:not([data-status="proposed"])').count()==0)
            href=p.locator('#horizontalReading a').first.get_attribute('href')
            check('ESDM source points to audited branch commit', 'e9d25912b7662d397c15b10f1851e1cc0108d8ea' in href)
            p.locator('#horizontalRepos [data-hc-select="slk"]').click()
            p.screenshot(path=str(OUT/'slk-crossings.png'))
            p.locator('#horizontalReading .hc-enter').click()
            check('cabinet enters actual SLK room',p.evaluate('ZUIZUI_ROOMS.snapshot().room')=='slk' and not p.locator('#horizontalCabinet').evaluate('(d)=>d.open'))
            p.locator('#roomHorizontal').click()
            check('room opens its own neighborhood',p.evaluate('ZUIZUI_CROSSINGS.snapshot().selected')=='slk')
            p.keyboard.press('Escape')
            check('Escape closes only the cabinet',p.evaluate('ZUIZUI_ROOMS.snapshot().room')=='slk')
            p.locator('#roomBack').click();p.locator('#mapButton').click();p.locator('#atlasHorizontal').click()
            check('atlas opens same cabinet, not a different map',p.locator('#horizontalCabinet').evaluate('(d)=>d.open') and not p.locator('#roomMap').evaluate('(d)=>d.open'))
            p.locator('#horizontalSearch').fill('断片化')
            check('search works with role text',0<p.locator('#horizontalRepos button').count()<40)
            p.locator('#horizontalClose').click()
            check('exploration does not promote or rewrite evidence',p.evaluate('JSON.stringify(ZUIZUI_TOWER.contacts)')==ledger)
            for old,new in data['inventory']['renamed'].items():
                q=browser.new_page(reduced_motion='reduce');load(q,'#room='+old)
                check(old+': legacy hash opens canonical room',q.evaluate('ZUIZUI_ROOMS.snapshot().room')==new);q.close()
            for w,h in [(320,700),(390,844),(768,1024)]:
                q=browser.new_page(viewport={'width':w,'height':h},is_mobile=w<760,has_touch=w<760,reduced_motion='reduce');q.on('pageerror',lambda e:errors.append(str(e)))
                load(q);q.locator('#bookButton').click();q.locator('[data-horizontal]').click()
                check(f'{w}: cabinet fits viewport',q.evaluate('document.documentElement.scrollWidth<=innerWidth') and q.locator('#horizontalCabinet').evaluate('(e)=>e.getBoundingClientRect().right<=innerWidth'))
                q.locator('#horizontalRepos [data-hc-select="Structural"]').click();q.locator('#horizontalReading .hc-enter').click()
                check(f'{w}: cross-floor entry is usable',q.evaluate('ZUIZUI_ROOMS.snapshot().room')=='Structural')
                if w==390:q.locator('#roomHorizontal').click();q.screenshot(path=str(OUT/'mobile-crossings.png'))
                q.close()
            check('no runtime errors',not errors);check('all current assets inlined (HTTP not tested)' if args.inline else 'all local HTTP assets load',not bad)
            browser.close()
    finally:srv.shutdown();srv.server_close()
    report={'passed':len(checks),'checks':checks,'runtime_errors':errors,'asset_failures':bad,'mode':'inline' if args.inline else 'local HTTP','scope':'Navigation/geometry/integrity tests in Chromium, not ecological validation or physical-device tests.'}
    (OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
