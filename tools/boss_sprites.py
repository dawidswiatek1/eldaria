#!/usr/bin/env python3
"""Sprite'y wrogów z eksportów PixelLab (js/data/sprites-boss.js, BSPR – base64, bo gra czyta piksele).

1. Rzeczy do zniszczenia w walkach z bossami – tools/art/boss/<klucz>/:

  korzen   – Święty korzeń (Leszy: leczy go, dopóki stoi)
  sztandar – Sztandar zbójów (Herszt: odwaga i posiłki)
  urna     – Urna dusz (Nekromanta: bariera dusz)
  krysztal – Kryształ runiczny (Golem: kamienna skóra i regeneracja)
  iskra, odlamekG, kokon, kamienP – Akt II (Strażnik rdzenia, Łowczy Gwiazd, Zwiastun, Arcykapłan)

  Animacja bezczynności (wszystkie klatki, pętla; kierunek z ukosa south-west, inaczej pierwszy) albo,
  gdy jej nie ma, widok z przodu (rotations/south.png). Bez folderu – zapasowy rysunek z kodu poniżej.

2. Wrogowie i bossowie – tools/art/enemies/<klucz>/ (klucz = klucz w ENEMIES, js/data/enemies.js).
  Eksport postaci w kierunku west (patrzy w lewo, na drużynę). Stany w folderze:
    fighting_pose albo Idle – animacja bezczynności (Idle / idle_breathing),
    animacja z „Death” w nazwie – śmierć (np. Falling_Back_Death), inna – atak (np. Jump_Attack).
  Z nich pasek klatek w układzie gry (FRAME w js/gfx/sprites.js):
    0 stoi, 1 oddech, 2 zamach, 3 cios, 4 czar, 5 trafiony, 6 powalony,
  a za nimi cała pętla bezczynności (il klatek) i animacja śmierci (dn klatek) – gra je odtwarza
  (js/game/state.js sprDiv, css/battle.css.js). Bez animacji ataku/śmierci klatki 2–6 powstają
  z bezczynności (przechył, odrzut, osunięcie). Wybór klatek, gdy domyślny nie pasuje – OPT niżej.
  Klatki różnych animacji wyrównuje środek płótna (PixelLab trzyma postać w tym samym miejscu).

Wynik: pasek klatek jak u wrogów (n, fw, pl/pr/pt/cw/ch = ramka treści), face:'L' – patrzy w lewo.

    python3 tools/boss_sprites.py            # zapisuje dane
    python3 tools/boss_sprites.py --debug    # dodatkowo podgląd tools/out/boss.png i tools/out/enemies.png

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
    """klatki z eksportu PixelLab: animacja bezczynności (z ukosa south-west, inaczej pierwszy kierunek),
    bez niej widok z przodu"""
    an = sorted(glob.glob(os.path.join(d, 'Idle/animations/*/*')), key=lambda p: (os.path.basename(p) != 'south-west', p))
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


def png64(im):
    """PNG jako base64. Gra i tak bierze piksel albo w całości, albo wcale (alfa < 128 = pusto,
    js/gfx/sprites.js composeData), więc zapisujemy tak samo: przy ≤255 kolorach z paletą (kilka razy mniej danych)."""
    a = np.array(im.convert('RGBA'))
    on = a[..., 3] >= 128
    cols = np.unique(a[on][:, :3], axis=0)
    b = io.BytesIO()
    if len(cols) <= 255:
        key = (a[..., 0].astype(np.int32) << 16) | (a[..., 1].astype(np.int32) << 8) | a[..., 2]
        ck = (cols[:, 0].astype(np.int32) << 16) | (cols[:, 1].astype(np.int32) << 8) | cols[:, 2]
        p = Image.fromarray(np.where(on, np.searchsorted(ck, key) + 1, 0).astype(np.uint8), 'P')
        p.putpalette([0, 0, 0] + cols.flatten().tolist())
        p.save(b, 'PNG', optimize=True, transparency=0)
    else:
        a[~on] = 0
        a[on, 3] = 255
        Image.fromarray(a).save(b, 'PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode()


def row(key, im, n=1, fw=None):
    fw = fw or im.width
    meta = '"n":%d,"fw":%d,"pl":0,"pr":0,"pt":0,"cw":%d,"ch":%d,"face":"L",' % (n, fw, fw, im.height) if n > 1 else '"n":1,"face":"L",'
    return ' "%s":{"w":%d,"h":%d,%s"u":"data:image/png;base64,%s"}' % (key, im.width, im.height, meta, png64(im))


DRAWN = {'korzen': korzen, 'sztandar': sztandar, 'urna': urna, 'krysztal': krysztal}
# rzeczy do zniszczenia: z eksportu, a gdy go brak – rysunek z kodu (tylko pierwsze cztery)
OBJ = list(DRAWN) + ['iskra', 'odlamekG', 'kokon', 'kamienP']


# ---------- wrogowie i bossowie (tools/art/enemies/) ----------
EN = os.path.join(ROOT, 'tools/art/enemies')
IDLE = ('Idle', 'idle_breathing')
# wybór klatek, gdy domyślny nie pasuje:
#   hit – numer klatki animacji śmierci jako „trafiony” (domyślnie odrzut liczony z bezczynności;
#         u części postaci pierwsze klatki śmierci wyglądają inaczej niż poza bojowa),
#   die – ostatnia użyta klatka animacji śmierci (domyślnie ostatnia; u stworów zza szczeliny i pająka
#         końcówka animacji wstaje albo się przewraca dziwnie),
#   wind / strike – numery klatek animacji ataku (domyślnie 1 i klatka najbardziej wysunięta do przodu),
#   cien – kolor narysowanego cienia pod stopami w animacji śmierci (gra rysuje własny cień) – usuwany z dolnej części klatek
OPT = {
    'straznikR': {'hit': 1},
    'brat': {'hit': 1},
    'gwiezdnik': {'hit': 1},
    'pomiot': {'hit': 1, 'die': 2, 'cien': (103, 103, 103)},
    'pajakS': {'die': 5},
    'dzikS': {'strike': 5},      # skok w powietrzu (najdalej do przodu jest klatka z pochyloną głową)
    'zwiastun': {'die': 3},
}


def load_anims(d):
    """animacje w kierunku west: lista (stan, nazwa, [klatki RGBA])"""
    out = []
    for p in sorted(glob.glob(os.path.join(d, '*', 'animations', '*', 'west'))):
        parts = p.split(os.sep)
        fr = [np.array(Image.open(f).convert('RGBA')) for f in sorted(glob.glob(os.path.join(p, 'frame_*.png')))]
        if fr:
            out.append((parts[-4], parts[-2], fr))
    return out


def cut(a, dx=0):
    """klatka: obraz przycięty do treści + lewy górny róg względem środka płótna (przesunięty o dx)"""
    ys, xs = np.where(a[..., 3] > 0)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1], int(xs.min() - a.shape[1] // 2 + dx), int(ys.min() - a.shape[0] // 2)


def lean(f, d, dx=0):
    """przechył: górny wiersz przesunięty o d pikseli (d<0 – do przodu, czyli w lewo), stopy na miejscu"""
    a, ox, oy = f
    h, w = a.shape[:2]
    m = abs(d)
    o = np.zeros((h, w + m, 4), np.uint8)
    for y in range(h):
        x0 = int(round((1 - y / max(1, h - 1)) * d)) + (m if d < 0 else 0)
        o[y, x0:x0 + w] = a[y]
    return o, ox - (m if d < 0 else 0) + dx, oy


def slump(f):
    """powalony bez animacji śmierci: postać osunięta (spłaszczona do 55% wysokości, dół na miejscu)"""
    a, ox, oy = f
    h, w = a.shape[:2]
    nh = max(4, int(h * .55))
    return np.array(Image.fromarray(a).resize((w, nh), Image.NEAREST)), ox, oy + h - nh


def no_shadow(a, c):
    """usuwa piksele koloru c z dolnych 35% treści klatki (narysowany cień)"""
    a = a.copy()
    ys = np.where(a[..., 3] > 0)[0]
    y0 = int(ys.max() - (ys.max() - ys.min()) * .35)
    m = (a[..., 0] == c[0]) & (a[..., 1] == c[1]) & (a[..., 2] == c[2])
    m[:y0] = False
    a[m] = 0
    return a


def build_enemy(k, d):
    an = load_anims(d)
    o = OPT.get(k, {})
    if o.get('cien'):
        an = [(s, n, [no_shadow(a, o['cien']) for a in fr] if 'Death' in n else fr) for s, n, fr in an]
    # bezczynność: najpierw poza bojowa (fighting_pose), potem zwykła
    idle = sorted((x for x in an if x[1] in IDLE), key=lambda x: (x[0] != 'fighting_pose', x[0] != 'Idle'))
    loop = [cut(a) for a in idle[0][2]]
    death = next(([cut(a) for a in x[2]] for x in an if 'Death' in x[1]), None)
    atk = next(([cut(a) for a in x[2]] for x in an if x[1] not in IDLE and 'Death' not in x[1]), None)
    st, br = loop[0], loop[len(loop) // 2]
    if atk:
        wind = atk[o.get('wind', 1)]
        strike = atk[o.get('strike', min(range(len(atk)), key=lambda i: atk[i][1]))]
    else:
        wind = lean(st, 3, 2)        # zamach: odchylony do tyłu
        strike = lean(st, -4, -5)    # cios: wypad do przodu
    cast = lean(loop[len(loop) // 4], -2)                                            # czar: pochylony ku drużynie
    hit = death[o['hit']] if death and o.get('hit') is not None else lean(st, 2, 4)  # trafiony: odrzut
    dl = death[:o.get('die', len(death) - 1) + 1] if death else []
    frames = [st, br, wind, strike, cast, hit, dl[-1] if dl else slump(st)] + loop + dl
    # ramka treści = sylwetka w bezczynności (stopy = dół ramki); klatka mieści wszystkie klatki
    cx0 = min(f[1] for f in loop)
    cx1 = max(f[1] + f[0].shape[1] for f in loop)
    cy0 = min(f[2] for f in loop)
    cy1 = max(f[2] + f[0].shape[0] for f in loop)
    X0 = min(f[1] for f in frames) - 1
    X1 = max(f[1] + f[0].shape[1] for f in frames) + 1
    Y0 = min(f[2] for f in frames) - 1
    Y1 = max(cy1, max(f[2] + f[0].shape[0] for f in frames))
    fw = X1 - X0
    im = Image.new('RGBA', (fw * len(frames), Y1 - Y0))
    for i, (a, ox, oy) in enumerate(frames):
        im.alpha_composite(Image.fromarray(a), (i * fw + ox - X0, oy - Y0))
    return im, dict(n=len(frames), fw=fw, pl=cx0 - X0, pr=X1 - cx1, pt=cy0 - Y0, cw=cx1 - cx0, ch=cy1 - cy0,
                    il=len(loop), dn=len(dl))


def erow(key, im, m):
    meta = ''.join('"%s":%d,' % (k, v) for k, v in m.items())
    return ' "%s":{"w":%d,"h":%d,%s"face":"L","u":"data:image/png;base64,%s"}' % (key, im.width, im.height, meta, png64(im))


def main():
    items, rows, strips = [], [], []
    for k in OBJ:
        fr = pack_frames(os.path.join(ROOT, 'tools/art/boss', k))
        if fr:
            im, fw = strip(fr)
            rows.append(row(k, im, len(fr), fw))
            items.append((k, im.crop((0, 0, fw, im.height))))
            print(k, '– z eksportu:', len(fr), 'klatek', fw, 'x', im.height)
        elif k in DRAWN:
            im = DRAWN[k]()
            rows.append(row(k, im))
            items.append((k, im))
            print(k, '– rysunek z kodu')
        else:
            print(k, '– brak eksportu w tools/art/boss/' + k)
    for k in sorted(os.listdir(EN)) if os.path.isdir(EN) else []:
        d = os.path.join(EN, k)
        if not os.path.isdir(d):
            continue
        im, m = build_enemy(k, d)
        rows.append(erow(k, im, m))
        strips.append((k, im, m))
        print(k, '– postać:', m['n'], 'klatek', m['fw'], 'x', im.height, '(treść %dx%d, pętla %d, śmierć %d)' % (m['cw'], m['ch'], m['il'], m['dn']))
    src = ('/* ===== WROGOWIE Z EKSPORTÓW PIXELLAB: rzeczy do zniszczenia w walkach z bossami (pasek klatek animacji\n'
           '   albo jedna klatka) i postacie (pasek 7 klatek gry + pętla bezczynności il + śmierć dn) =====\n'
           '   Wygenerowane przez tools/boss_sprites.py – nie edytuj ręcznie. Base64, bo gra czyta piksele. */\n'
           'const BSPR={\n' + ',\n'.join(rows) + '};\n')
    out = os.path.join(ROOT, 'js/data/sprites-boss.js')
    open(out, 'w', encoding='utf-8').write(src)
    print('zapisano', out, len(src) // 1024, 'KB')
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
        # wrogowie: 7 klatek gry (zielona linia = dół ramki treści, czyli stopy)
        W = max(m['fw'] * 7 for _, _, m in strips)
        H = sum(im.height + 6 for _, im, _ in strips)
        sheet = Image.new('RGBA', (W, H), (70, 96, 60, 255))
        dr = ImageDraw.Draw(sheet)
        y = 0
        for _, im, m in strips:
            sheet.alpha_composite(im.crop((0, 0, m['fw'] * 7, im.height)), (0, y))
            dr.line([(0, y + m['pt'] + m['ch']), (W, y + m['pt'] + m['ch'])], fill=(120, 255, 120, 255))
            y += im.height + 6
        sheet.resize((W * 2, H * 2), Image.NEAREST).save(os.path.join(ROOT, 'tools/out/enemies.png'))


if __name__ == '__main__':
    main()
