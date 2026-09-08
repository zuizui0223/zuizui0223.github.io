"""Exercise the actual, locally inlined homepage, including all room enhancements.
No network requests or browser-policy modifications. Use --chromium for a local
executable, or let Playwright use its installed Chromium. Art is illustrative;
these tests verify navigation and claim preservation, not scientific findings.
"""
from pathlib import Path
import argparse
import json
import re
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'test-results' / 'rooms'

def inline_site() -> str:
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    def asset(url):
        name = url.split('?', 1)[0]
        path = (ROOT / name).resolve()
        if not path.is_relative_to(ROOT) or '://' in name:
            raise ValueError(f'Unexpected nonlocal asset: {url}')
        return path.read_text(encoding='utf-8')
    html = re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>',
                  lambda m: '<style>' + asset(m[1]) + '</style>', html)
    scripts = []
    def collect(m):
        scripts.append(asset(m[1]))
        return ''
    html = re.sub(r'<script\s+src="([^"]+)"[^>]*>\s*</script>', collect, html)
    html = re.sub(r'<link[^>]*rel="(?:alternate )?icon"[^>]*>', '', html)
    return html.replace('</body>', ''.join('<script>' + s + '</script>' for s in scripts) + '</body>')

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--chromium', default=None)
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    checks, errors = [], []
    def check(name, value):
        assert value, name
        checks.append(name)
        print('PASS', name, flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=args.chromium, headless=True, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width':1440,'height':1000}, reduced_motion='reduce')
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.set_content(inline_site())
        page.wait_for_timeout(100)
        snap = lambda: page.evaluate('ZUIZUI_ROOMS.snapshot()')
        data = page.evaluate('ZUIZUI_TOWER')
        science = snap()['science']
        check('36 source-backed rooms and four TMOP glyphs', len(data['repos']) == 36 and len(snap()['membership']) == 36)
        check('284b classification is explicitly unaudited, not guessed', snap()['membership']['284b'] == '?')
        page.locator('.doorway[aria-hidden="false"]').first.click()
        check('tower doorway enters a room instead of a note', bool(snap()['room']) and not page.locator('#notebook').evaluate('(e)=>e.open'))
        check('tower is inert behind a room', page.locator('#ascent').evaluate('(e)=>e.inert'))
        page.keyboard.press('Escape')
        check('Escape returns to the same tower', snap()['room'] is None and not page.locator('#ascent').evaluate('(e)=>e.inert'))
        # The flat map is a full, non-puzzle-dependent navigation alternative.
        page.locator('#mapButton').click()
        check('flat map contains all 36 rooms', page.locator('[data-map-room]').count() == 36)
        check('map is an in-document dialog', snap()['mapOpen'] and page.url.startswith('about:blank'))
        page.locator('[data-filter="P"]').click()
        check('P filter highlights audited primary-data rooms only', page.locator('.plan-node:not(.dim)').count() == 7)
        page.locator('[data-filter="P"]').click()
        page.locator('[data-map-room="boundary"]').click()
        page.wait_for_timeout(40)
        check('map room entry keeps the same document', snap()['room'] == 'boundary' and page.url.endswith('#room=boundary'))
        before = snap()
        page.locator('#roomRight').click(); page.wait_for_function('Math.abs(ZUIZUI_ROOMS.snapshot().yaw-ZUIZUI_ROOMS.snapshot().targetYaw)<.001')
        after = snap()
        check('rotation reveals a different exit set', {x['key'] for x in before['positions'] if x['visible']} != {x['key'] for x in after['positions'] if x['visible']})
        check('rotation preserves immutable exit positions', [x['point'] for x in before['positions']] == [x['point'] for x in after['positions']])
        check('reverse traversal retains original scientific direction', any(x['reverse'] for x in after['positions']))
        # Every room and every door must be reachable without modifying game state.
        for row in data['repos']:
            result = page.evaluate("""async id => {
                document.getElementById('roomPlan').click();
                document.querySelector('[data-map-room="'+id+'"]').dispatchEvent(new MouseEvent('click',{bubbles:true}));
                const next=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
                await next();
                const wanted=ZUIZUI_ROOMS.snapshot().positions.map(x=>x.key),seen=new Set();
                for(let i=0;i<4;i++){
                    ZUIZUI_ROOMS.snapshot().positions.filter(x=>x.visible).forEach(x=>seen.add(x.key));
                    document.getElementById('roomRight').click();document.getElementById('roomRight').click();
                    await next();
                }
                return {all:wanted.every(x=>seen.has(x)),hiddenSafe:!document.querySelector('.room-door[hidden]:not([tabindex="-1"])')};
            }""", row[0])
            check(f'{row[0]}: every exit is revealed by a physical camera angle', result['all'])
            check(f'{row[0]}: hidden exits cannot take pointer focus', result['hiddenSafe'])
        check('a complete room tour does not mutate any scientific contact', snap()['science'] == science and page.evaluate('ZUIZUI_TOWER') == data)
        page.locator('#roomPlan').click(); page.locator('[data-map-room="mrod"]').click(); page.wait_for_timeout(30)
        for _ in range(8):
            button = page.locator('[data-exit="same-system:pollipi"]')
            if button.is_visible(): break
            page.locator('#roomRight').click();page.wait_for_timeout(30)
        button.click()
        check('unclosed bridge opens a threshold, not a validated passage', page.locator('#bookContent').inner_text().startswith('未閉合'))
        page.locator('details').click()
        check('threshold retains its independent-truth closure condition', '独立' in page.locator('#bookContent').inner_text())
        page.locator('[data-peek="pollipi"]').click();page.wait_for_timeout(30)
        check('peeking enters a connected room but never promotes science', snap()['room'] == 'pollipi' and snap()['science'] == science)
        page.evaluate('history.back()'); page.wait_for_timeout(70)
        check('browser Back returns to the preceding room', snap()['room'] == 'mrod')
        page.locator('#bookButton').click()
        check('default notebook stays short', len(page.locator('#bookContent').inner_text()) < 220)
        page.locator('[data-rune="T"]').first.click()
        page.locator('[data-answer="P"]').click()
        check('wrong glyph guess is not accepted', 'T' not in snap()['decoded'])
        page.locator('[data-answer="T"]').click()
        check('glyph meaning can be decoded from room examples', 'T' in snap()['decoded'])
        check('decoding a glyph cannot promote a scientific claim', snap()['science'] == science)
        page.keyboard.press('Escape')
        check('notebook closes back into the room', snap()['room'] == 'mrod' and not page.locator('#notebook').evaluate('(e)=>e.open'))
        page.locator('#roomPlan').click(); page.locator('[data-map-room="acsp"]').click()
        page.locator('#roomRelic').click()
        check('ACSP riddle never promises detection', 'いるとは限らない' in page.locator('#bookContent').inner_text())
        page.keyboard.press('Escape')
        page.locator('#roomPlan').click();page.locator('[data-map-room="boundary"]').click()
        page.screenshot(path=str(OUT/'boundary-room.png'))
        page.locator('#roomRight').click();page.wait_for_timeout(30)
        page.screenshot(path=str(OUT/'boundary-other-angle.png'))
        page.locator('#roomPlan').click();page.screenshot(path=str(OUT/'flat-atlas.png'));page.keyboard.press('Escape')
        check('Esc folds only the map and preserves the room', snap()['room']=='boundary' and not snap()['mapOpen'])
        page.locator('#roomBack').click()
        check('return restores page scrolling', page.evaluate('getComputedStyle(document.body).position') != 'fixed')
        for width,height in [(320,700),(390,844),(768,1024),(1440,1000)]:
            device = browser.new_page(viewport={'width':width,'height':height},is_mobile=width<760,has_touch=width<760,reduced_motion='reduce')
            device.on('pageerror',lambda e:errors.append(str(e)))
            device.set_content(inline_site());device.wait_for_timeout(60)
            device.locator('#mapButton').click();device.locator('[data-map-room="boundary"]').click();device.wait_for_timeout(40)
            check(f'{width}: no room horizontal overflow', device.evaluate('document.documentElement.scrollWidth <= innerWidth'))
            check(f'{width}: reachable visible exit', device.locator('.room-door:not([hidden])').count() > 0)
            device.locator('#roomPlan').click()
            check(f'{width}: planar map scroll is internal', device.evaluate('document.documentElement.scrollWidth<=innerWidth') and device.locator('[data-map-room]').count()==36)
            device.keyboard.press('Escape')
            if width==390:
                session=device.context.new_cdp_session(device)
                before=device.evaluate('ZUIZUI_ROOMS.snapshot().targetYaw')
                session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':95,'y':575}]})
                for x in [115,140,165,190]:
                    session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':575}]});device.wait_for_timeout(20)
                session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});device.wait_for_timeout(50)
                check('mobile horizontal swipe rotates inside the same room', abs(device.evaluate('ZUIZUI_ROOMS.snapshot().targetYaw')-before)>.2)
                device.screenshot(path=str(OUT/'mobile-room.png'))
            device.close()
        check('no runtime errors in room, atlas, glyph or touch interactions', not errors)
        browser.close()
    report={'passed':len(checks),'checks':checks,'runtime_errors':errors,'scope':'Current homepage in local Chromium; not physical iPhone testing or scientific validation.'}
    (OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__ == '__main__':
    main()
