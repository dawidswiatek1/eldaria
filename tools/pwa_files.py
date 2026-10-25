#!/usr/bin/env python3
"""Service worker gry (sw.js): lista wszystkich plików do pobrania na telefon i wersja.

Wersja to skrót zawartości plików, więc po każdej zmianie gry telefon pobierze nową wersję.
Uruchamia się samo przy publikacji strony (.github/workflows/pages.yml); lokalnie:

    python3 tools/pwa_files.py
"""
import hashlib, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def files():
    out = ['index.html', 'manifest.webmanifest']
    out += re.findall(r'<script src="([^"]+)"', open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read())
    for d, _, fs in os.walk(os.path.join(ROOT, 'assets')):
        for f in fs:
            out.append(os.path.relpath(os.path.join(d, f), ROOT).replace(os.sep, '/'))
    seen = set()
    return [f for f in out if not (f in seen or seen.add(f))]


def main():
    fs = files()
    h = hashlib.sha1()
    for f in sorted(fs):
        h.update(f.encode())
        h.update(open(os.path.join(ROOT, f), 'rb').read())
    ver = h.hexdigest()[:10]
    lst = ',\n'.join('  "%s"' % f for f in ['./'] + fs)
    src = '''/* ===== ELDARIA – service worker: gra działa bez internetu po pierwszym uruchomieniu =====
   Wygenerowane przez tools/pwa_files.py (lista plików i wersja) – nie edytuj ręcznie. */
const VER='%s',CACHE='eldaria-'+VER;
const FILES=[
%s];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('eldaria-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* najpierw pamięć telefonu, potem sieć; strona otwarta bez internetu dostaje index.html z pamięci */
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res}).catch(()=>r.mode==='navigate'?caches.match('index.html'):Response.error())))});
''' % (ver, lst)
    open(os.path.join(ROOT, 'sw.js'), 'w', encoding='utf-8').write(src)
    print('sw.js: wersja', ver, '-', len(fs), 'plików')


if __name__ == '__main__':
    main()
