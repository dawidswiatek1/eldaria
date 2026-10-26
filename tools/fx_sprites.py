#!/usr/bin/env python3
"""Efekty wielkich ciosów bossów (js/battle/bosses.js) z eksportów PixelLab w tools/art/fx/<klucz>/.

Każdy efekt: klatki animacji (pierwsza animacja w Idle/animations/, np. Idle/south albo Running/west,
albo – eksport obiektu PixelLab – w animations/<nazwa>/unknown/), klatki ułożone wprost w folderze (frame_000.png, frame_001.png… – np. kilka pojedynczych obrazków PixelLab),
a gdy ich nie ma – widok z przodu (rotations/south.png), który gra „wyrasta z ziemi” (CSS).
Klatki są przycinane do wspólnej ramki i sklejane w poziomy pasek: assets/fx/<klucz>.png.
Lista: js/data/fx-boss.js (BFX: plik, rozmiar klatki, liczba klatek, kotwica, skala, czas).
Efekty to zwykłe obrazki (gra nie czyta ich pikseli), więc są plikami w assets/, nie base64.

    python3 tools/fx_sprites.py

Wymaga: Python 3, numpy, Pillow.
"""
import glob, json, os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# klucz: źródło (folder w tools/art), kotwica (f – stopy celu, c – środek celu), skala względem postaci, czas w ms
FX = {
    'gniew':     {'src': 'boss/korzen',  'a': 'f', 's': .9,  'ms': 760},   # Leszy – Gniew Puszczy (korzenie z ziemi)
    'egzekucja': {'src': 'fx/egzekucja', 'a': 'c', 's': 1.1, 'ms': 560},   # Herszt – Egzekucja
    'zniwo':     {'src': 'fx/zniwo',     'a': 'c', 's': 1.0, 'ms': 640},   # Nekromanta – Żniwo dusz
    'lawina':    {'src': 'fx/lawina',    'a': 'f', 's': 1.1, 'ms': 640},   # Golem – Lawina, Troll – Wyrwane drzewo
    'oddech':    {'src': 'fx/oddech',    'a': 'c', 's': .85, 'ms': 640},   # Żmij – Ognisty oddech
    'topiel':    {'src': 'fx/topiel',    'a': 'f', 's': 1.0, 'ms': 720},   # Utopiec Starszy – Topiel
    'zenit':     {'src': 'fx/zenit',     'a': 'f', 's': 1.0, 'ms': 720},   # Królowa Południc – Zenit
    'klatwa':    {'src': 'fx/klatwa',    'a': 'f', 's': 1.0, 'ms': 720},   # Baba Jaga – Klątwa chaty
    'pelnia':    {'src': 'fx/pelnia',    'a': 'c', 's': 1.0, 'ms': 480},   # Wilkołak Alfa – Krwawa pełnia
    'drzewo':    {'src': 'fx/drzewo',    'a': 'c', 's': 1.1, 'ms': 560},   # Troll – Wyrwane drzewo, Miażdżący cios
    # Akt II
    'wyladowanie': {'src': 'fx/wyladowanie', 'a': 'f', 's': 1.15, 'ms': 640},  # Strażnik rdzenia – Wyładowanie
    'deszcz':    {'src': 'fx/deszcz',    'a': 'f', 's': 1.0, 'ms': 720},   # Łowczy Gwiazd – Deszcz gwiazd
    'krzyk':     {'src': 'fx/krzyk',     'a': 'c', 's': 1.0, 'ms': 640},   # Zwiastun z otchłani – Krzyk otchłani
    'gwiezdny':  {'src': 'fx/gwiezdny',  'a': 'f', 's': .95, 'ms': 760},   # Arcykapłan – Gwiezdny ogień
}


def frames(d):
    own = sorted(glob.glob(os.path.join(d, 'frame_*.png')))
    if own:
        return [Image.open(p).convert('RGBA') for p in own]
    an = sorted(glob.glob(os.path.join(d, 'Idle/animations/*/*'))) or sorted(glob.glob(os.path.join(d, 'animations/*/*')))
    if an:
        return [Image.open(p).convert('RGBA') for p in sorted(glob.glob(os.path.join(an[0], 'frame_*.png')))]
    return [Image.open(os.path.join(d, 'Idle/rotations/south.png')).convert('RGBA')]


def main():
    out = {}
    os.makedirs(os.path.join(ROOT, 'assets/fx'), exist_ok=True)
    for k, c in FX.items():
        d = os.path.join(ROOT, 'tools/art', c['src'])
        if not os.path.isdir(d):
            print(k, '– brak', d)
            continue
        fr = [np.array(f) for f in frames(d)]
        m = np.zeros(fr[0].shape[:2], bool)
        for a in fr:
            m |= a[..., 3] > 0
        ys, xs = np.where(m)
        x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        fw, fh = int(x1 - x0), int(y1 - y0)
        im = Image.new('RGBA', (fw * len(fr), fh))
        for i, a in enumerate(fr):
            im.alpha_composite(Image.fromarray(a[y0:y1, x0:x1]), (i * fw, 0))
        p = 'assets/fx/%s.png' % k
        im.save(os.path.join(ROOT, p), optimize=True)
        out[k] = {'u': p, 'fw': fw, 'fh': fh, 'n': len(fr), 'a': c['a'], 's': c['s'], 'ms': c['ms']}
        print(k, len(fr), 'klatek', fw, 'x', fh)
    src = ('/* ===== EFEKTY WIELKICH CIOSÓW BOSSÓW (bfx w js/battle/bosses.js) =====\n'
           '   Wygenerowane przez tools/fx_sprites.py z tools/art/fx/ – nie edytuj ręcznie.\n'
           '   u – pasek klatek, fw×fh – klatka, n – klatki, a – kotwica (f: stopy celu, c: środek), s – skala, ms – czas. */\n'
           'const BFX={\n' + ',\n'.join(' %s:%s' % (k, json.dumps(v, separators=(',', ':'))) for k, v in out.items()) + '};\n')
    open(os.path.join(ROOT, 'js/data/fx-boss.js'), 'w', encoding='utf-8').write(src)
    print('zapisano js/data/fx-boss.js:', ', '.join(out))


if __name__ == '__main__':
    main()
