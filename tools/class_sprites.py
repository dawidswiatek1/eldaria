#!/usr/bin/env python3
"""Sprite'y postaci z eksportów PixelLab: klasy bohaterów (tools/art/classes/: <klasa> = mężczyzna,
<klasa>_k = kobieta), unikalni towarzysze (tools/art/companions/, + portret w assets/portraits/)
i formy (tools/art/forms/, np. niedźwiedź druida – klatka 112 px).

Źródła: tools/art/classes/<klasa>/Idle/rotations/east.png (postać patrząca w prawo)
i Idle/animations/Walking/east/frame_00N.png (chód w prawo).
Z nich składamy pasek 7 klatek 80×100 w układzie gry (FRAME w js/gfx/sprites.js):
  0 stoi, 1 oddech, 2 zamach, 3 cios, 4 czar, 5 trafiony, 6 powalony.
Wynik: js/data/sprites-classes.js (CSPR, base64 – gra czyta piksele sprite'ów).

    python3 tools/class_sprites.py            # zapisuje dane
    python3 tools/class_sprites.py --debug    # dodatkowo podgląd tools/out/classes.png

Wymaga: Python 3, numpy, Pillow. Nowa klasa = nowy folder w tools/art/classes/ (np. lotr, lotr_k) i ponowne uruchomienie.
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


def place(strip, f, a, dx=0, fx=None, fw=FW):
    h, w = a.shape[:2]
    # bohater: stopy w punkcie fx; forma (szersza klatka): środek obrazka w środku klatki
    anchor = feet_x(a) if fw == FW else w / 2
    x0 = f * fw + int(round((fx if fx is not None else FOOT_X) - anchor)) + dx
    y0 = FOOT_Y + 1 - h
    for y in range(h):
        for x in range(w):
            if a[y, x, 3] == 0:
                continue
            X, Y = x0 + x, y0 + y
            if f * fw <= X < (f + 1) * fw and 0 <= Y < FH:
                strip[Y, X] = a[y, x]


def build(d, fw=FW):
    """d = folder eksportu; fw = szerokość klatki (80 bohater, 112 forma niedźwiedzia)"""
    d = os.path.join(d, 'Idle')
    east = crop(load(os.path.join(d, 'rotations/east.png')))
    walk = [crop(load(p)) for p in sorted(glob.glob(os.path.join(d, 'animations/Walking/east/frame_*.png')))]
    sp = sorted(range(len(walk)), key=lambda i: -spread(walk[i]))
    wide = sorted(sp[:2])                       # dwie klatki w rozkroku
    mid = sp[-1]                                 # klatka „w przejściu”
    if fw == FW:
        # stopy na FOOT_X, chyba że postać (kostur, peleryna) wystaje poza rdzeń 8..53 – wtedy całość przesuwamy
        l = FOOT_X - feet_x(east)
        lo, hi = l, l + east.shape[1] - 1
        fx = FOOT_X + (53 - hi if hi > 53 else 8 - lo if lo < 8 else 0)
    else:
        fx = fw // 2
    strip = np.zeros((FH, fw * N, 4), np.uint8)
    place(strip, 0, east, fx=fx, fw=fw)
    place(strip, 1, breathe(east), fx=fx, fw=fw)
    place(strip, 2, walk[wide[0]], -3, fx, fw)  # zamach: odchylony do tyłu
    place(strip, 3, walk[wide[1]], 5, fx, fw)   # cios: wypad do przodu
    place(strip, 4, walk[mid], 1, fx, fw)       # czar
    place(strip, 5, east, -4, fx, fw)           # trafiony: odrzut
    place(strip, 6, kneel(east), fx=fx, fw=fw)  # powalony
    return strip


def portrait(d):
    """portret do rozmów 66×74: głowa i ramiona z widoku z ukosa, powiększone ×2, na ciemnym tle"""
    a = crop(load(os.path.join(d, 'Idle/rotations/south-east.png')))
    h, w = a.shape[:2]
    top = a[:37]
    ys, xs = np.where(top[..., 3] > 0)
    cx = int((xs.min() + xs.max()) / 2) if len(xs) else w // 2
    out = np.zeros((37, 33, 4), np.uint8)
    for y in range(37):
        for x in range(33):
            X = cx - 16 + x
            if 0 <= X < w and y < h:
                out[y, x] = top[y, X]
    bg = np.zeros((74, 66, 3), np.uint8)
    yy = np.arange(74)[:, None]
    bg[...] = (np.array([18, 16, 17]) + (np.array([46, 34, 24]) * (yy / 73.0)[..., None])).astype(np.uint8)
    big = np.array(Image.fromarray(out).resize((66, 74), Image.NEAREST))
    al = big[..., 3:] / 255.0
    bg = (big[..., :3] * al + bg * (1 - al)).astype(np.uint8)
    return Image.fromarray(bg)


def strip_row(key, s, fw):
    b = io.BytesIO()
    Image.fromarray(s).save(b, 'PNG', optimize=True)
    return ' "%s":{"w":%d,"h":%d,"fw":%d,"u":"data:image/png;base64,%s"}' % (key, fw * N, FH, fw, base64.b64encode(b.getvalue()).decode())


def main():
    rows, prev, keys = [], [], []
    # klasy (80 px), unikalni towarzysze (80 px, + portret), formy (np. niedźwiedź druida, 112 px)
    for sub, fw in (('classes', FW), ('companions', FW), ('forms', 112)):
        base = os.path.join(ROOT, 'tools/art', sub)
        if not os.path.isdir(base):
            continue
        for c in sorted(os.listdir(base)):
            d = os.path.join(base, c)
            if not os.path.isdir(d):
                continue
            s = build(d, fw)
            rows.append(strip_row(c, s, fw))
            prev.append(s)
            keys.append(c)
            if sub == 'companions':
                portrait(d).save(os.path.join(ROOT, 'assets/portraits', c + '.png'), optimize=True)
    src = ('/* ===== SPRITE\'Y POSTACI: paski 7 klatek (fw×100) – stoi, oddech, zamach, cios, czar, trafiony, powalony =====\n'
           '   klasy: „klasa” = mężczyzna, „klasa_k” = kobieta; unikalni towarzysze (np. „karolina”); formy (np. „niedzwiedz”).\n'
           '   Wygenerowane przez tools/class_sprites.py z tools/art/ – nie edytuj ręcznie. Base64, bo gra czyta piksele. */\n'
           'const CSPR={\n' + ',\n'.join(rows) + '};\n')
    out = os.path.join(ROOT, 'js/data/sprites-classes.js')
    open(out, 'w', encoding='utf-8').write(src)
    print('zapisano', out, len(src) // 1024, 'KB:', ', '.join(keys))
    if '--debug' in sys.argv:
        os.makedirs(os.path.join(ROOT, 'tools/out'), exist_ok=True)
        W = max(s.shape[1] for s in prev)
        sheet = np.zeros((FH * len(prev), W, 4), np.uint8)
        sheet[...] = (58, 80, 58, 255)
        for i, s in enumerate(prev):
            a = s[..., 3:] / 255.0
            sl = sheet[i * FH:(i + 1) * FH, :s.shape[1], :3]
            sheet[i * FH:(i + 1) * FH, :s.shape[1], :3] = (s[..., :3] * a + sl * (1 - a)).astype(np.uint8)
        Image.fromarray(sheet).resize((W * 2, FH * len(prev) * 2), Image.NEAREST).save(os.path.join(ROOT, 'tools/out/classes.png'))


if __name__ == '__main__':
    main()
