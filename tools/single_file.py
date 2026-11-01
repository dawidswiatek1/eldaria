#!/usr/bin/env python3
"""Cała gra w jednym pliku HTML (do pobrania na telefon i otwarcia w Chrome, bez serwera i bez aplikacji).

Skrypty z index.html są wklejane po kolei w <script>, a każdy obrazek i czcionka z assets/ (pełne ścieżki
„assets/….png/.webp/.woff2” w kodzie i stylach) – jako data: URI. Wynik: Eldaria.html (domyślnie w bieżącym
katalogu albo w ścieżce podanej jako argument).

Otwarta z pobranych plików strona bywa w Chrome „bez pochodzenia” (content://) – wtedy localStorage rzuca błąd.
Na początku pliku jest więc zastępczy localStorage w pamięci (gra działa, ale postęp znika po zamknięciu),
a ekran tytułowy prosi o zapisanie kodu zapisu („Zapis”). Gdzie localStorage działa, nic się nie zmienia.

    python3 tools/single_file.py [wynik.html]
"""
import base64, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIME = {'png': 'image/png', 'webp': 'image/webp', 'woff2': 'font/woff2'}
ASSET = re.compile(r'assets/[A-Za-z0-9_./-]+?\.(png|webp|woff2)')

SHIM = """<script>/* plik z dysku bez dostępu do localStorage: zapis w pamięci (tools/single_file.py) */
(function(){try{var t='__eldaria_t';localStorage.setItem(t,'1');localStorage.removeItem(t)}catch(e){var m={};
var st={getItem:function(k){return Object.prototype.hasOwnProperty.call(m,k)?m[k]:null},setItem:function(k,v){m[k]=String(v)},
removeItem:function(k){delete m[k]},clear:function(){m={}},key:function(i){return Object.keys(m)[i]||null},get length(){return Object.keys(m).length}};
try{Object.defineProperty(window,'localStorage',{value:st,configurable:true})}catch(e2){}window.__noStore=1}})();</script>
"""
NOTE = """<script>if(window.__noStore)loadMsg='Chrome nie pozwala zapisać postępu gry otwartej w ten sposób. Przed wyjściem użyj „Zapis”: zapisz grę do pliku albo skopiuj kod – następnym razem wczytasz ją tym samym przyciskiem.';</script>
"""


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else 'Eldaria.html'
    cache, used = {}, {}

    def data_uri(m):
        p = m.group(0)
        f = os.path.join(ROOT, p)
        if not os.path.isfile(f):
            return p
        if p not in cache:
            cache[p] = 'data:%s;base64,%s' % (MIME[m.group(1)], base64.b64encode(open(f, 'rb').read()).decode())
        used[p] = used.get(p, 0) + 1
        return cache[p]

    html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()

    def script(m):
        src = m.group(1)
        code = open(os.path.join(ROOT, src), encoding='utf-8').read()
        code = ASSET.sub(data_uri, code).replace('</script', '<\\/script')
        return (NOTE if src == 'js/main.js' else '') + '<script>/* %s */\n%s\n</script>' % (src, code)

    html = re.sub(r'<script src="([^"]+)"></script>', script, html)
    html = ASSET.sub(data_uri, html)
    html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + SHIM, 1)
    open(out, 'w', encoding='utf-8').write(html)
    print('zapisano %s: %.1f MB, %d obrazków/czcionek (%d odwołań)' % (out, os.path.getsize(out) / 1e6, len(cache), sum(used.values())))
    missing = sorted(set(ASSET.findall(html)))
    if missing:
        print('UWAGA: zostały ścieżki do plików:', missing[:10])


if __name__ == '__main__':
    main()
