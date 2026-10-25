#!/usr/bin/env python3
"""Sprite'y klas bohaterów (wersje męskie) z eksportów PixelLab.

Źródła: tools/art/classes/<klasa>/Idle/rotations/east.png (postać patrząca w prawo)
i Idle/animations/Walking/east/frame_00N.png (chód w prawo).
Z nich składamy pasek 7 klatek 80×100 w układzie gry (FRAME w js/gfx/sprites.js):
  0 stoi, 1 oddech, 2 zamach, 3 cios, 4 czar, 5 trafiony, 6 powalony.
Wynik: js/data/sprites-classes.js (CSPR, base64 – gra czyta piksele sprite'ów).

    python3 tools/class_sprites.py            # zapisuje dane
    python3 tools/class_sprites.py --debug    # dodatkowo podgląd tools/out/classes.png

Wymaga: Python 3, numpy, Pillow. Nowa klasa = nowy folder w tools/art/classes/ i ponowne uruchomienie.
"""
import base64, glob, io, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'tools/art/classes')
FW, FH, N = 80, 100, 7
FOOT_Y = 95      # ostatni wiersz stóp (jak u pozostałych bohaterów)
FOOT_X = 31      # środek stóp w klatce (rdzeń postaci: x 8..54)


def load(p):
    return np.array(Image.open(p).convert('RGBA'))


def crop(a):
    ys, xs = np.where(a[..., 3] > 0)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def feet_x(a):
    """środek stóp: średnia kolumn z pikselami w najniższych wierszach"""
    h = a.shape[0]
    rows = a[max(0, h - 6):, :, 3] > 0
    xs = np.where(rows.any(0))[0]
    return (xs.min() + xs.max()) / 2 if len(xs) else a.shape[1] / 2


def spread(a):
    rows = a[max(0, a.shape[0] - 5):, :, 3] > 0
    xs = np.where(rows.any(0))[0]
    return xs.max() - xs.min() if len(xs) else 0


def breathe(a):
    """oddech: górna część ciała o piksel niżej (stopy na miejscu)"""
    h = a.shape[0]
    cut = int(h * .5)
    b = a.copy()
    b[1:cut + 1] = a[0:cut]
    b[0] = 0
    return b


def kneel(a):
    """powalony: nogi ściśnięte (klęczy), tułów i głowa bez zmian, lekki przechył"""
    h, w = a.shape[:2]
    hip = int(h * .56)
    top, legs = a[:hip], a[hip:]
    lh = max(4, int(legs.shape[0] * .42))
    legs = np.array(Image.fromarray(legs).resize((w, lh), Image.NEAREST))
    out = np.concatenate([top, legs], 0)
    # przechył do przodu: wiersze u góry przesunięte w prawo
    o = np.zeros((out.shape[0], w + 6, 4), np.uint8)
    for y in range(out.shape[0]):
        dx = int(round((1 - y / out.shape[0]) * 5))
        o[y, dx:dx + w] = out[y]
    return o


def place(strip, f, a, dx=0, fx=None):
    h, w = a.shape[:2]
    x0 = f * FW + int(round((fx if fx is not None else FOOT_X) - feet_x(a))) + dx
    y0 = FOOT_Y + 1 - h
    for y in range(h):
        for x in range(w):
            if a[y, x, 3] == 0:
                continue
            X, Y = x0 + x, y0 + y
            if f * FW <= X < (f + 1) * FW and 0 <= Y < FH:
                strip[Y, X] = a[y, x]


def build(cls):
    d = os.path.join(SRC, cls, 'Idle')
    east = crop(load(os.path.join(d, 'rotations/east.png')))
    walk = [crop(load(p)) for p in sorted(glob.glob(os.path.join(d, 'animations/Walking/east/frame_*.png')))]
    sp = sorted(range(len(walk)), key=lambda i: -spread(walk[i]))
    wide = sorted(sp[:2])                       # dwie klatki w rozkroku
    mid = sp[-1]                                 # klatka „w przejściu”
    # stopy na FOOT_X, chyba że postać (kostur, peleryna) wystaje poza rdzeń 8..53 – wtedy całość przesuwamy
    l = FOOT_X - feet_x(east)
    lo, hi = l, l + east.shape[1] - 1
    fx = FOOT_X + (53 - hi if hi > 53 else 8 - lo if lo < 8 else 0)
    strip = np.zeros((FH, FW * N, 4), np.uint8)
    place(strip, 0, east, fx=fx)
    place(strip, 1, breathe(east), fx=fx)
    place(strip, 2, walk[wide[0]], -3, fx)      # zamach: odchylony do tyłu
    place(strip, 3, walk[wide[1]], 5, fx)       # cios: wypad do przodu
    place(strip, 4, walk[mid], 1, fx)           # czar
    place(strip, 5, east, -4, fx)               # trafiony: odrzut
    place(strip, 6, kneel(east), fx=fx)         # powalony
    return strip


def main():
    classes = sorted(c for c in os.listdir(SRC) if os.path.isdir(os.path.join(SRC, c)))
    rows, prev = [], []
    for c in classes:
        s = build(c)
        b = io.BytesIO()
        Image.fromarray(s).save(b, 'PNG', optimize=True)
        rows.append(' "%s":{"w":%d,"h":%d,"u":"data:image/png;base64,%s"}' % (c, FW * N, FH, base64.b64encode(b.getvalue()).decode()))
        prev.append(s)
    src = ('/* ===== SPRITE\'Y KLAS (wersje męskie): paski 7 klatek 80×100 – stoi, oddech, zamach, cios, czar, trafiony, powalony =====\n'
           '   Wygenerowane przez tools/class_sprites.py z tools/art/classes/ – nie edytuj ręcznie. Base64, bo gra czyta piksele. */\n'
           'const CSPR={\n' + ',\n'.join(rows) + '};\n')
    out = os.path.join(ROOT, 'js/data/sprites-classes.js')
    open(out, 'w', encoding='utf-8').write(src)
    print('zapisano', out, len(src) // 1024, 'KB:', ', '.join(classes))
    if '--debug' in sys.argv:
        os.makedirs(os.path.join(ROOT, 'tools/out'), exist_ok=True)
        sheet = np.zeros((FH * len(prev), FW * N, 4), np.uint8)
        sheet[...] = (58, 80, 58, 255)
        for i, s in enumerate(prev):
            a = s[..., 3:] / 255.0
            sheet[i * FH:(i + 1) * FH, :, :3] = (s[..., :3] * a + sheet[i * FH:(i + 1) * FH, :, :3] * (1 - a)).astype(np.uint8)
        Image.fromarray(sheet).resize((FW * N * 3, FH * len(prev) * 3), Image.NEAREST).save(os.path.join(ROOT, 'tools/out/classes.png'))


if __name__ == '__main__':
    main()
