#!/usr/bin/env python3
"""Sprite'y elementów walk z bossami (rzeczy do zniszczenia na polu bitwy):

  korzen   – Święty korzeń (Leszy: leczy go, dopóki stoi)
  sztandar – Sztandar zbójów (Herszt: odwaga i posiłki)
  urna     – Urna dusz (Nekromanta: bariera dusz)
  krysztal – Kryształ runiczny (Golem: kamienna skóra i regeneracja)

Źródło: eksport PixelLab w tools/art/boss/<klucz>/ – animacja „Idle” (wszystkie klatki, pętla) albo,
gdy jej nie ma, widok z przodu (rotations/south.png). Bez folderu – zapasowy rysunek z kodu poniżej.
Wynik: js/data/sprites-boss.js (BSPR, base64 – gra czyta piksele, jak u innych wrogów):
pasek klatek jak u wrogów (n, fw, pl/pr/pt/cw/ch = ramka treści), face:'L' – patrzy w lewo (na drużynę).

    python3 tools/boss_sprites.py            # zapisuje dane
    python3 tools/boss_sprites.py --debug    # dodatkowo podgląd tools/out/boss.png (pierwsze klatki)

Wymaga: Python 3, numpy, Pillow.
"""
import base64, glob, io, os, sys
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTLINE = (26, 16, 20, 255)


def rgb(h, a=255):
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def outline(im):
    """czarna obwódka 1 px wokół nieprzezroczystych pikseli (jak w pozostałych sprite'ach)"""
    a = np.array(im)
    m = a[..., 3] > 0
    o = np.zeros_like(m)
    o[1:, :] |= m[:-1, :]
    o[:-1, :] |= m[1:, :]
    o[:, 1:] |= m[:, :-1]
    o[:, :-1] |= m[:, 1:]
    o &= ~m
    a[o] = OUTLINE
    return Image.fromarray(a)


def px(d, pts, c):
    for p in pts:
        d.point(p, fill=c)


def stones(d, x0, x1, y, h=6):
    """kamienie u podstawy"""
    cols = [rgb('#4a4448'), rgb('#6a6266'), rgb('#857c7e')]
    x = x0
    i = 0
    while x < x1:
        w = 5 + (i * 3) % 5
        d.ellipse([x, y - h + (i % 2), x + w, y + 1], fill=cols[i % 2])
        d.line([x + 1, y - h + 1 + (i % 2), x + w - 2, y - h + 1 + (i % 2)], fill=cols[2])
        x += w - 1
        i += 1


def krysztal():
    W, H = 52, 64
    im = Image.new('RGBA', (W, H))
    d = ImageDraw.Draw(im)
    stones(d, 6, 46, 62, 7)
    dk, md, lt, hl = rgb('#2c2370'), rgb('#4b46c8'), rgb('#7f9cff'), rgb('#dff0ff')

    def prism(cx, top, bot, w, tilt=0):
        # sześciokątny słup ze szpicem: lewa ściana jasna, prawa ciemna, grzbiet podświetlony
        L = [(cx - w + tilt, bot), (cx - w + tilt * .6, top + w), (cx + tilt * .3, top), (cx + tilt * .3, bot)]
        R = [(cx + tilt * .3, top), (cx + w + tilt * .6, top + w), (cx + w + tilt, bot), (cx + tilt * .3, bot)]
        d.polygon(L, fill=md)
        d.polygon(R, fill=dk)
        d.line([(cx + tilt * .3, top + 1), (cx + tilt * .3 + (tilt > 0), bot - 1)], fill=lt)
        d.line([(cx - w + tilt * .6 + 1, top + w), (cx - w + tilt + 1, bot - 2)], fill=lt)

    prism(14, 26, 58, 5, -4)
    prism(39, 30, 58, 4, 4)
    prism(26, 6, 59, 8, 0)
    # runa na głównym krysztale
    rune = rgb('#9ffcff')
    px(d, [(25, 30), (25, 31), (25, 32), (25, 33), (25, 34), (24, 31), (26, 31), (23, 32), (27, 32), (24, 35), (26, 35)], rune)
    px(d, [(25, 29), (22, 33), (28, 33)], hl)
    # blaski
    px(d, [(21, 14), (21, 15), (22, 13), (10, 34), (36, 37)], hl)
    im = outline(im)
    return im


def korzen():
    W, H = 56, 60
    im = Image.new('RGBA', (W, H))
    d = ImageDraw.Draw(im)
    bark, bark2, bark3, moss, glow = rgb('#4a2e1a'), rgb('#6e4426'), rgb('#94643a'), rgb('#4f7a2a'), rgb('#86ff7a')
    # rozłożyste korzenie przy ziemi
    for (x0, y0, x1, y1) in [(28, 50, 4, 58), (28, 50, 52, 58), (26, 52, 12, 59), (30, 52, 44, 59), (28, 50, 28, 59)]:
        d.line([(x0, y0), (x1, y1)], fill=bark, width=4)
        d.line([(x0, y0 - 1), (x1, y1 - 1)], fill=bark2, width=1)
    # pień – skręcony pniak
    d.polygon([(16, 54), (14, 30), (18, 16), (24, 10), (32, 8), (38, 14), (42, 28), (40, 54)], fill=bark)
    d.polygon([(18, 52), (17, 30), (21, 18), (27, 12), (31, 12), (30, 30), (26, 52)], fill=bark2)
    for y in range(16, 52, 5):
        d.line([(19, y), (24, y + 3)], fill=bark3)
    d.line([(36, 18), (38, 40)], fill=bark2)
    # odrosty i liście
    d.line([(24, 10), (18, 2)], fill=bark2, width=2)
    d.line([(33, 9), (40, 1)], fill=bark2, width=2)
    for (x, y) in [(16, 1), (19, 4), (41, 0), (38, 3), (44, 4), (14, 5)]:
        d.ellipse([x - 2, y - 1, x + 2, y + 2], fill=moss)
    # mech
    for (x, y, w) in [(14, 30, 6), (36, 34, 6), (20, 46, 10), (30, 20, 5)]:
        d.ellipse([x, y, x + w, y + 3], fill=moss)
    # świecące oko-runa w pniu
    d.ellipse([24, 27, 34, 35], fill=rgb('#1b3a14'))
    d.ellipse([26, 29, 32, 33], fill=glow)
    px(d, [(29, 30), (28, 31)], rgb('#f0fff0'))
    px(d, [(29, 24), (29, 25), (29, 38), (29, 39), (21, 31), (37, 31)], glow)
    im = outline(im)
    return im


def sztandar():
    W, H = 44, 74
    im = Image.new('RGBA', (W, H))
    d = ImageDraw.Draw(im)
    wood, wood2 = rgb('#5a3820'), rgb('#8a5a32')
    stones(d, 6, 30, 73, 6)
    # drzewce i poprzeczka
    d.rectangle([16, 6, 18, 70], fill=wood)
    d.line([(17, 6), (17, 70)], fill=wood2)
    d.rectangle([8, 10, 40, 12], fill=wood)
    d.line([(8, 10), (40, 10)], fill=wood2)
    # grot
    d.polygon([(17, 0), (14, 6), (20, 6)], fill=rgb('#b8b0a8'))
    px(d, [(17, 1), (16, 4)], rgb('#e8e0d8'))
    # płachta z poszarpanym dołem
    red, red2, red3 = rgb('#8a1414'), rgb('#b42a1c'), rgb('#5e0c10')
    d.polygon([(10, 13), (38, 13), (38, 46), (35, 42), (32, 48), (28, 43), (24, 49), (20, 44), (16, 50), (13, 44), (10, 47)], fill=red)
    d.polygon([(10, 13), (16, 13), (16, 48), (13, 44), (10, 47)], fill=red3)
    d.line([(36, 14), (36, 44)], fill=red2)
    # czaszka na płachcie
    bone, bone2 = rgb('#e8e0c8'), rgb('#a89c84')
    d.ellipse([20, 20, 32, 31], fill=bone)
    d.rectangle([23, 30, 29, 34], fill=bone)
    px(d, [(23, 25), (24, 25), (23, 26), (24, 26), (28, 25), (29, 25), (28, 26), (29, 26)], red3)
    px(d, [(26, 28), (24, 33), (26, 33), (28, 33)], bone2)
    # skrzyżowane topory pod czaszką
    d.line([(19, 40), (33, 34)], fill=bone2)
    d.line([(19, 34), (33, 40)], fill=bone2)
    # sznury
    d.line([(9, 12), (6, 22)], fill=rgb('#c8a060'))
    d.line([(39, 12), (41, 20)], fill=rgb('#c8a060'))
    im = outline(im)
    return im


def urna():
    W, H = 46, 64
    im = Image.new('RGBA', (W, H))
    d = ImageDraw.Draw(im)
    # kamienny cokół
    st1, st2, st3 = rgb('#4a4650'), rgb('#6e6a76'), rgb('#8e8a96')
    d.rectangle([7, 52, 39, 63], fill=st1)
    d.rectangle([9, 48, 37, 53], fill=st2)
    d.line([(9, 48), (37, 48)], fill=st3)
    d.line([(7, 56), (39, 56)], fill=st2)
    # urna z brązu
    br, br2, br3 = rgb('#3e3424'), rgb('#6a5634'), rgb('#9c844e')
    d.polygon([(15, 47), (11, 38), (12, 28), (16, 23), (30, 23), (34, 28), (35, 38), (31, 47)], fill=br2)
    d.polygon([(26, 23), (30, 23), (34, 28), (35, 38), (31, 47), (27, 47)], fill=br)
    d.line([(14, 30), (14, 40)], fill=br3)
    d.rectangle([17, 18, 29, 23], fill=br2)
    d.rectangle([15, 16, 31, 18], fill=br3)
    # czaszka
    bone = rgb('#e0d8c0')
    d.ellipse([18, 29, 28, 38], fill=bone)
    d.rectangle([20, 37, 26, 40], fill=bone)
    px(d, [(20, 33), (21, 33), (25, 33), (26, 33), (23, 36)], rgb('#3a1a4a'))
    # fioletowe dusze nad urną
    v1, v2, v3 = rgb('#7a3ad0'), rgb('#b46cff'), rgb('#f4e0ff')
    d.polygon([(17, 16), (14, 9), (17, 3), (19, 8), (22, 0), (25, 7), (28, 2), (30, 9), (32, 6), (31, 16)], fill=v1)
    d.polygon([(19, 16), (18, 10), (21, 6), (23, 11), (26, 6), (28, 12), (27, 16)], fill=v2)
    px(d, [(22, 12), (23, 13), (24, 12), (23, 9), (25, 14)], v3)
    px(d, [(12, 4), (35, 10), (9, 14)], v2)
    im = outline(im)
    return im


def pack_frames(d):
    """klatki z eksportu PixelLab: animacja Idle (dowolny kierunek), inaczej widok z przodu"""
    an = sorted(glob.glob(os.path.join(d, 'Idle/animations/Idle/*')))
    if an:
        return [Image.open(p).convert('RGBA') for p in sorted(glob.glob(os.path.join(an[0], 'frame_*.png')))]
    for r in ('south', 'south-west'):
        p = os.path.join(d, 'Idle/rotations', r + '.png')
        if os.path.exists(p):
            return [Image.open(p).convert('RGBA')]
    return []


def strip(frames):
    """pasek klatek przycięty do wspólnej ramki treści (stopy = dół ramki)"""
    a = [np.array(f) for f in frames]
    m = np.zeros(a[0].shape[:2], bool)
    for x in a:
        m |= x[..., 3] > 0
    ys, xs = np.where(m)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    pad = 2
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(a[0].shape[1], x1 + pad), y1
    fw, fh = x1 - x0, y1 - y0
    out = Image.new('RGBA', (fw * len(a), fh))
    for i, x in enumerate(a):
        out.alpha_composite(Image.fromarray(x[y0:y1, x0:x1]), (i * fw, 0))
    return out, fw


def row(key, im, n=1, fw=None):
    b = io.BytesIO()
    im.save(b, 'PNG', optimize=True)
    fw = fw or im.width
    meta = '"n":%d,"fw":%d,"pl":0,"pr":0,"pt":0,"cw":%d,"ch":%d,"face":"L",' % (n, fw, fw, im.height) if n > 1 else '"n":1,"face":"L",'
    return ' "%s":{"w":%d,"h":%d,%s"u":"data:image/png;base64,%s"}' % (key, im.width, im.height, meta, base64.b64encode(b.getvalue()).decode())


DRAWN = {'korzen': korzen, 'sztandar': sztandar, 'urna': urna, 'krysztal': krysztal}


def main():
    items, rows = [], []
    for k, draw in DRAWN.items():
        fr = pack_frames(os.path.join(ROOT, 'tools/art/boss', k))
        if fr:
            im, fw = strip(fr)
            rows.append(row(k, im, len(fr), fw))
            items.append((k, im.crop((0, 0, fw, im.height))))
            print(k, '– z eksportu:', len(fr), 'klatek', fw, 'x', im.height)
        else:
            im = draw()
            rows.append(row(k, im))
            items.append((k, im))
            print(k, '– rysunek z kodu')
    src = ('/* ===== ELEMENTY WALK Z BOSSAMI: rzeczy do zniszczenia (pasek klatek animacji albo jedna klatka) =====\n'
           '   Wygenerowane przez tools/boss_sprites.py – nie edytuj ręcznie. Base64, bo gra czyta piksele. */\n'
           'const BSPR={\n' + ',\n'.join(rows) + '};\n')
    out = os.path.join(ROOT, 'js/data/sprites-boss.js')
    open(out, 'w', encoding='utf-8').write(src)
    print('zapisano', out, len(src) // 1024, 'KB:', ', '.join(k for k, _ in items))
    if '--debug' in sys.argv:
        os.makedirs(os.path.join(ROOT, 'tools/out'), exist_ok=True)
        W = sum(im.width + 8 for _, im in items)
        H = max(im.height for _, im in items)
        sheet = Image.new('RGBA', (W, H), (70, 96, 60, 255))
        x = 0
        for _, im in items:
            sheet.alpha_composite(im, (x, H - im.height))
            x += im.width + 8
        sheet.resize((W * 4, H * 4), Image.NEAREST).save(os.path.join(ROOT, 'tools/out/boss.png'))


if __name__ == '__main__':
    main()
