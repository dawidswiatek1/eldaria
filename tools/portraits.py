#!/usr/bin/env python3
"""Portrety do rozmów (assets/portraits/<klucz>.png, 66×74) z arkuszy twarzy PixelLab w tools/art/portraits/.

Arkusz PixelLab to siatka wariantów (np. 4×4 twarze 64×64 na jednolitym tle). W tabeli POR wybieramy jedną twarz
(ramka w pikselach arkusza). Tło arkusza zastępujemy ciemnym gradientem jak w pozostałych portretach:
tło = piksele w kolorach z górnej krawędzi i górnej części boków ramki, połączone z krawędzią (wypełnianie –
nie przechodzi przez czarny kontur postaci, więc szary płaszcz zostaje). Twarz stoi na dole kadru 66×74.
Obrazek trafia do VART w js/data/art.js jako n_<klucz> (rozmowy: DLG[..].p w js/story/quests.js).

    python3 tools/portraits.py

Wymaga: Python 3, numpy, Pillow.
"""
import os
from collections import Counter, deque
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'tools/art/portraits')
W, H = 66, 74
# klucz: (arkusz, ramka x0, y0, x1, y1)
POR = {
    'swiatomir': ('swiatomir.png', (0, 193, 63, 256)),    # 13. twarz: blade oczy, fioletowa poświata od dołu
    'wawrzyniec': ('wawrzyniec.png', (0, 64, 64, 128)),   # 5. twarz: uśmiech, kreda na palcu, znaczek gwiazdy
}


def background(t):
    """maska tła ramki t (RGB int)"""
    h, w = t.shape[:2]
    edge = np.concatenate([t[0], t[:int(h * .4), 0], t[:int(h * .4), w - 1]])
    cnt = Counter(map(tuple, edge.tolist()))
    pal = [c for c, n in cnt.items() if n >= 2 and c[0] * .299 + c[1] * .587 + c[2] * .114 >= 50]
    ok = np.zeros((h, w), bool)
    for c in pal:
        ok |= (t == c).all(-1)
    m = np.zeros((h, w), bool)
    q = deque([(0, x) for x in range(w)] + [(y, x) for y in range(h) for x in (0, w - 1)])
    while q:
        y, x = q.popleft()
        if m[y, x] or not ok[y, x]:
            continue
        m[y, x] = True
        for Y, X in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= Y < h and 0 <= X < w and not m[Y, X] and ok[Y, X]:
                q.append((Y, X))
    return m


def portrait(sheet, box):
    a = np.array(Image.open(os.path.join(SRC, sheet)).convert('RGB')).astype(int)
    x0, y0, x1, y1 = box
    t = a[y0:y1, x0:x1]
    m = background(t)
    h, w = t.shape[:2]
    yy = np.arange(H)[:, None, None]
    out = (np.array([18, 16, 17]) + np.array([46, 34, 24]) * (yy / (H - 1.0))).repeat(W, 1).astype(np.uint8)
    ox, oy = (W - w) // 2, H - h
    sub = out[oy:oy + h, ox:ox + w]
    sub[~m] = t[~m]
    return Image.fromarray(out)


def main():
    for k, (sheet, box) in POR.items():
        portrait(sheet, box).save(os.path.join(ROOT, 'assets/portraits', k + '.png'), optimize=True)
        print('zapisano assets/portraits/%s.png' % k)


if __name__ == '__main__':
    main()
