#!/usr/bin/env python3
"""Generator mapy Velesii w pixel-arcie.

Rysuje assets/maps/velesia-big.png (1024×640 pikseli, w grze skalowane bez wygładzania).
Położenia miejsc i drogi czyta z js/world/world-map.js (NODES, EDGES), więc po dodaniu
miejsca wystarczy dopisać mu rysunek (LANDMARK niżej) i uruchomić ponownie:

    python3 tools/velesia_map.py            # zapisuje mapę
    python3 tools/velesia_map.py --debug    # dodatkowo podgląd z siatką i nazwami (tools/out/)

Wymaga: Python 3, numpy, scipy, Pillow. Gra sama z tego narzędzia nie korzysta.
"""
import math, os, random, re, sys, zlib
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1024, 640
SEED = 1977
rng = np.random.default_rng(SEED)
R = random.Random(SEED)


def P(x, y):
    """procenty mapy -> piksele"""
    return (x * W / 100.0, y * H / 100.0)


# ---------------------------------------------------------------- dane z gry
def read_world():
    src = open(os.path.join(ROOT, 'js/world/world-map.js'), encoding='utf-8').read()
    body = src[src.index('const NODES={'):src.index('const EDGES=')]
    nodes = {}
    for m in re.finditer(r"\n (\w+):\{n:'([^']*)',t:'[^']*',ty:'(\w+)'(.*)", body):
        k, n, ty, rest = m.groups()
        x = float(re.search(r'\bx:([\d.]+)', rest).group(1))
        y = float(re.search(r'\by:([\d.]+)', rest).group(1))
        nodes[k] = dict(n=n, ty=ty, x=x, y=y, vil='vil:1' in rest)
    eb = src[src.index('const EDGES='):]
    eb = eb[:eb.index('];') + 2]
    edges = re.findall(r"\['(\w+)','(\w+)'\]", eb)
    vsrc = open(os.path.join(ROOT, 'js/world/velesia-map.js'), encoding='utf-8').read()
    secret = re.findall(r"'(\w+)'", re.search(r'const SECRET=\[([^\]]*)\]', vsrc).group(1))
    return nodes, edges, secret


NODES, EDGES, SECRET = read_world()


def NP(k):
    return P(NODES[k]['x'], NODES[k]['y'])


# ---------------------------------------------------------------- szum
def vnoise(scale, seed):
    g = np.random.default_rng(seed).random((H // scale + 4, W // scale + 4))
    return ndimage.zoom(g, scale, order=3)[:H, :W]


def fbm(seed, scales=(160, 80, 40, 20, 10), weights=(.4, .25, .17, .11, .07)):
    n = sum(w * vnoise(s, seed + i * 31) for i, (s, w) in enumerate(zip(scales, weights)))
    n -= n.min()
    return n / n.max()


BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0
BAY = np.tile(BAYER, (H // 4 + 1, W // 4 + 1))[:H, :W]
YY, XX = np.mgrid[0:H, 0:W]


def tone(n, k, spread=.45):
    """szum 0..1 -> indeks odcienia 0..k-1, z ditheringiem Bayera"""
    return np.clip(((n + (BAY - .5) * spread / k) * k).astype(int), 0, k - 1)


def hexc(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def pal(*hs):
    return np.array([hexc(h) for h in hs], np.uint8)


# ---------------------------------------------------------------- kształty
def poly_mask(pts):
    im = Image.new('L', (W, H), 0)
    ImageDraw.Draw(im).polygon([P(*p) for p in pts], fill=255)
    return np.array(im) > 0


def sdf(mask):
    return ndimage.distance_transform_edt(~mask) - ndimage.distance_transform_edt(mask)


def blob(pts, amp=12, seed=1):
    d = sdf(poly_mask(pts)) + (fbm(seed, (60, 30, 15), (.5, .3, .2)) - .5) * 2 * amp
    return d < 0


def disc(x, y, r):
    cx, cy = P(x, y)
    return (XX - cx) ** 2 + ((YY - cy) * 1.25) ** 2 < r * r


def catmull(pts, n=24):
    """gładka krzywa przez punkty (piksele)"""
    pts = [pts[0]] + list(pts) + [pts[-1]]
    out = []
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = map(np.array, pts[i - 1:i + 3])
        for t in np.linspace(0, 1, n, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(np.array(pts[-2]))
    return out


def stroke(pts, widths, wobble=0, seed=0):
    """maska grubej linii po krzywej; widths: (początek, koniec) w pikselach"""
    im = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(im)
    cs = catmull([P(*p) for p in pts], 30)
    r2 = random.Random(seed)
    for i, (x, y) in enumerate(cs):
        t = i / max(1, len(cs) - 1)
        w = (widths[0] * (1 - t) + widths[1] * t) / 2 + (r2.random() - .5) * wobble
        d.ellipse([x - w, y - w, x + w, y + w], fill=255)
    return np.array(im) > 0



# ================================================================ GEOGRAFIA
# (procenty mapy; układ według pergaminowej mapy Velesii)
RIVER_MAIN = [(50.5, -3), (49.6, 5), (48.4, 11), (49.2, 18), (52, 24), (52.5, 30), (51, 36), (50, 42), (50.5, 48)]
RIVER_WEST = [(48, 52), (43, 54), (38, 55.5), (34.5, 58.5), (32.5, 64), (31.5, 71), (32.5, 78), (35.5, 85), (39.5, 91), (42.5, 95), (43.5, 103)]
RIVER_EAST = [(61.5, 55.5), (61.8, 62), (60.5, 69), (58.5, 76), (55, 83), (50, 88.5), (45.5, 92.5), (43, 95)]
RIVER_TRIB = [(14, 35), (18.5, 39), (23, 42), (27, 45.5), (31.5, 50), (33.5, 54), (35.5, 57)]
LAKE = [(46.5, 50), (49, 47.6), (53, 48.2), (58, 48.6), (62, 47.6), (66, 48.4), (68.5, 50.8), (67, 53.8), (63, 55.6), (59, 56.2), (55, 55.4), (50.5, 54.6), (47, 53.4)]

PLAINS = [(56, 62), (64, 58), (74, 61), (86, 70), (100, 72), (100, 100), (47, 100), (51, 93), (57, 85), (61, 74)]
DEAD = [(84, 100), (88, 88), (93, 79), (100, 74), (100, 100)]
MOUNTAINS = [(77, 30), (80, 25), (82, 18), (83, 8), (86, -2), (100, -2), (100, 70), (96, 69), (91, 65), (86, 63), (81, 60.5), (78.5, 56), (80, 50), (81.5, 45), (80.5, 39), (77.5, 35)]
FOREST_W = [(-2, -2), (47, -2), (46, 4), (43, 8), (44, 14), (41, 20), (37, 26), (34, 30), (31, 39), (28, 47), (26, 54), (25, 64), (27, 73), (30, 82), (33, 92), (35, 102), (-2, 102)]
FOREST_NE = [(56, -2), (85, -2), (82, 9), (79, 17), (75, 21), (71, 22), (66, 20), (60, 16), (57, 9)]
GROVES = [[(38, 26), (44, 24), (46, 30), (42, 37), (37, 36)], [(58, 36), (63, 34), (66, 38), (61, 41)], [(68, 40), (73, 38), (74, 46), (70, 49)],
          [(22, 52), (26, 50), (27, 56), (23, 58)], [(52, 62), (57, 61), (58, 66), (53, 67)], [(64, 64), (69, 63), (70, 68), (65, 69)]]
SWAMP = [(-2, 76), (6, 73), (14, 78), (23, 84), (26, 92), (23, 102), (-2, 102)]
MIST = [(15, 2), (28, -2), (46, 0), (47, 16), (40, 20), (30, 19), (18, 17), (11, 9)]
BARROWS = [(36, 72), (41, 67), (51, 68), (56, 74), (52, 83), (45, 90), (38, 87), (35, 79)]
# polany w lasach wokół miejsc (żeby budynki i znaczniki były widoczne)
CLEAR = {'dabrowa': 44, 'kregoszew': 36, 'mokradla': 30, 'kapliczka': 18, 'krag': 22, 'polana': 24, 'wyrab': 20, 'ustronie': 34, 'kaplica': 18,
         'jagna': 18, 'mlyn': 20, 'brzezina': 28, 'rozlewiska': 24, 'chata': 20, 'trakt': 14, 'puszcza': 10, 'jary': 14, 'doliny': 16, 'czarnybor': 16}
# pola uprawne: (miejsce, przesunięcie x, y w px, promień x, y w px)
FARMS = [('olszynow', 0, 14, 62, 30), ('olszynow', -40, -6, 26, 18), ('pola', 0, 2, 50, 18), ('weleszow', 34, 24, 34, 18), ('brzezina', 18, 16, 26, 14),
         ('sanow', 40, -18, 40, 14), ('kurhan', -18, 6, 24, 12), ('wschodnia', -26, 10, 22, 12), ('kurhanow', -26, -2, 22, 11), ('dabrowa', 26, 16, 22, 12),
         ('kregoszew', 22, 10, 18, 12), ('mokradla', 26, -10, 14, 9), ('ustronie', 20, 8, 16, 9)]
# główne trakty (szersze)
MAIN_ROADS = {('weleszow', 'sanow'), ('weleszow', 'dabrowa'), ('sanow', 'wschodnia'), ('kregoszew', 'kapliczka'), ('dabrowa', 'kapliczka'), ('sanow', 'pola'), ('pola', 'kurhanow')}


def node_area(scale=1.0, skip=()):
    m = np.zeros((H, W), bool)
    for k, nd in NODES.items():
        if k in skip:
            continue
        x, y = P(nd['x'], nd['y'])
        m |= ((XX - x) / (24 * scale)) ** 2 + ((YY - y + 9) / (19 * scale)) ** 2 < 1
    return m


def build_masks():
    m = {}
    water = stroke(RIVER_MAIN, (5, 8), 1, 1) | stroke(RIVER_WEST, (8, 9), 1, 2) | stroke(RIVER_EAST, (7, 8), 1, 3) | stroke(RIVER_TRIB, (3, 6), .8, 4)
    water |= blob(LAKE, 7, 5)
    if 'rozlewiska' in NODES:  # zalane łąki: sadzawki wokół miejsca
        x, y = NP('rozlewiska')
        for i, (dx, dy, rx, ry) in enumerate([(-26, -4, 9, 4), (-14, 9, 7, 3), (18, 10, 8, 3.5), (-30, 12, 6, 3), (10, -16, 7, 3)]):
            water |= (((XX - x - dx) / rx) ** 2 + ((YY - y - dy) / ry) ** 2) < 1 + (fbm(60 + i, (6, 3), (.6, .4)) - .5) * .8
    m['water'] = water
    m['plains'] = blob(PLAINS, 26, 11)
    m['dead'] = blob(DEAD, 16, 12)
    mount = blob(MOUNTAINS, 14, 13)
    for k, nd in NODES.items():
        if nd['ty'] in ('town', 'poi'):
            x, y = P(nd['x'], nd['y'])
            mount &= ((XX - x) / 36) ** 2 + ((YY - y + 14) / 34) ** 2 > 1  # wyżej, bo rysunki (wieża) sięgają w górę
    m['mount'] = mount
    forest = blob(FOREST_W, 22, 14) | blob(FOREST_NE, 16, 15)
    for i, g in enumerate(GROVES):
        forest |= blob(g, 9, 40 + i)
    cn = fbm(19, (30, 15, 8), (.5, .3, .2))
    for k, r in CLEAR.items():
        if k in NODES:
            x, y = P(NODES[k]['x'], NODES[k]['y'])
            d = np.sqrt((XX - x) ** 2 + ((YY - y + 6) * 1.3) ** 2) - r + (cn - .5) * r * .9
            forest &= d > 0
    m['swamp'] = blob(SWAMP, 16, 16)
    m['forest'] = forest & ~m['mount'] & ~(m['swamp'] & (fbm(21, (20, 10), (.6, .4)) > .45))
    m['mist'] = blob(MIST, 24, 17)
    m['barrows'] = blob(BARROWS, 8, 18)
    return m


# ================================================================ RYSOWANIE
img = np.zeros((H, W, 3), np.uint8)
N1 = fbm(101)
N2 = fbm(202, (40, 20, 10, 5), (.4, .3, .2, .1))
N3 = fbm(303, (12, 6, 3), (.5, .3, .2))

GRASS = pal('#3d6a28', '#48782c', '#558632', '#639438', '#72a23e', '#84b048')
MEADOW = pal('#5a8c34', '#6a9a3a', '#7aa842', '#8cb64c', '#a0c45a')
FLOOR = pal('#1f3a1e', '#264524', '#2e5229')
PLAIN = pal('#94803e', '#a8924a', '#bba456', '#cab464', '#d8c476', '#e4d288')
DEADC = pal('#33271f', '#41332a', '#4f4034', '#5e4d3e', '#6c5a48')
SWMP = pal('#253427', '#2d3f2e', '#364a34', '#41563c', '#4c6244')
ROCKG = pal('#4a4146', '#564c50', '#62575a', '#706466')
MISTC = np.array(hexc('#e2e9ee'), float)


def dith_blend(dst_sel_alpha, src):
    """nałóż src tam, gdzie alfa > próg Bayera (miękkie przejście w pixel-arcie)"""
    sel = dst_sel_alpha > BAY * .999
    img[sel] = src[sel]


def paint_ground(M):
    img[:] = GRASS[tone(N1 * .55 + N2 * .45, 6, .7)]
    dw = ndimage.distance_transform_edt(~M['water'])
    a = np.clip((7 + N3 * 9 - dw) / 6, 0, 1)
    dith_blend(a, MEADOW[tone(N2 * .5 + N3 * .5, 5, .7)])
    dith_blend(np.clip(.5 - sdf(M['plains']) / 26, 0, 1), PLAIN[tone(N1 * .45 + N2 * .55, 6, .7)])
    dith_blend(np.clip(.5 - sdf(M['dead']) / 12, 0, 1), DEADC[tone(N2 * .6 + N3 * .4, 5, .7)])
    dith_blend(np.clip(.5 - sdf(M['mount']) / 8, 0, 1), ROCKG[tone(N2, 4, .7)])
    dith_blend(np.clip(.5 - sdf(M['swamp']) / 10, 0, 1) * (~M['forest']), SWMP[tone(N2 * .5 + N3 * .5, 5, .7)])
    f = M['forest']
    img[f] = FLOOR[tone(N3, 3)][f]


def paint_cracks(M):
    from scipy.spatial import cKDTree
    pts = rng.random((900, 2)) * [W, H]
    d, _ = cKDTree(pts).query(np.stack([XX.ravel(), YY.ravel()], 1), k=2)
    edge = (np.abs(d[:, 1] - d[:, 0]) < 1.0).reshape(H, W)
    inner = sdf(M['dead']) < -2
    sel = edge & inner & (N3 > .25)
    img[sel] = hexc('#1c140e')
    img[np.roll(sel, 1, 0) & inner & ~sel] = hexc('#7a6650')


# ---------------------------------------------------------------- pola uprawne (szachownica)
FIELD = {
    'zboze': pal('#b8862c', '#d09c36', '#e2b448', '#f0ca62'),
    'zyto': pal('#a89a3a', '#beae46', '#d0c056', '#ded06a'),
    'zielone': pal('#4e7a2c', '#5e8c34', '#70a03c', '#84b248'),
    'orka': pal('#5e4026', '#73502e', '#875f36', '#9a7040'),
    'len': pal('#5a7a6a', '#6a8c7c', '#8aa6a0', '#a4bcc0'),
}


def bsp(x0, y0, x1, y1, r2, out, depth=0):
    w, h = x1 - x0, y1 - y0
    if (w < 30 and h < 18 and r2.random() < .7) or w < 14 or h < 9 or depth > 7:
        out.append((x0, y0, x1, y1))
        return
    if w / 1.7 > h:
        c = int(x0 + w * r2.uniform(.35, .65))
        bsp(x0, y0, c, y1, r2, out, depth + 1)
        bsp(c, y0, x1, y1, r2, out, depth + 1)
    else:
        c = int(y0 + h * r2.uniform(.35, .65))
        bsp(x0, y0, x1, c, r2, out, depth + 1)
        bsp(x0, c, x1, y1, r2, out, depth + 1)


def paint_farms(M, busy):
    bad = ndimage.binary_dilation(M['water'] | M['mount'] | M['swamp'] | M['dead'], iterations=2) | M['forest'] | node_area(.9)
    for i, (k, dx, dy, rx, ry) in enumerate(FARMS):
        if k not in NODES:
            continue
        cx, cy = NP(k)
        cx, cy = cx + dx, cy + dy
        r2 = random.Random(500 + i)
        ell = ((XX - cx) / rx) ** 2 + ((YY - cy) / ry) ** 2 < 1 + (N2 - .5) * .6
        rects = []
        bsp(int(cx - rx), int(cy - ry), int(cx + rx), int(cy + ry), r2, rects)
        for (x0, y0, x1, y1) in rects:
            x0, y0, x1, y1 = max(2, x0), max(2, y0), min(W - 2, x1), min(H - 2, y1)
            if x1 - x0 < 6 or y1 - y0 < 5:
                continue
            reg = (slice(y0, y1), slice(x0, x1))
            if ell[reg].mean() < .75 or bad[reg].mean() > .12 or busy[reg].mean() > .3:
                continue
            kind = r2.choice(['zboze', 'zboze', 'zboze', 'zyto', 'zielone', 'zielone', 'orka'])
            okm = ~bad[reg] & ~busy[reg]
            before = img[reg].copy()
            c = FIELD[kind]
            vert = r2.random() < .5
            for yy in range(y0 + 1, y1 - 1):
                for xx in range(x0 + 1, x1 - 1):
                    s = ((xx if vert else yy) + (1 if kind == 'orka' else 0)) % (2 if kind == 'orka' else 3)
                    col = c[3] if s == 0 else c[2] if s == 1 else c[1]
                    if kind != 'orka' and (N3[yy, xx] > .78) and BAY[yy, xx] < .3:
                        col = c[0]
                    img[yy, xx] = col
            # miedze: ciemne z dołu/prawej, jasne z góry/lewej
            img[y1 - 1, x0:x1] = hexc('#3e6024')
            img[y0:y1, x1 - 1] = hexc('#3e6024')
            img[y0, x0:x1 - 1] = c[0] if kind == 'orka' else hexc('#6e9a3c')
            img[y0:y1 - 1, x0] = hexc('#6e9a3c')
            after = img[reg]
            after[~okm] = before[~okm]
            busy[reg] |= okm
            # kopki siana na niektórych polach
            if kind in ('zboze', 'zyto') and r2.random() < .35:
                for _ in range(r2.randint(1, 3)):
                    hx, hy = r2.randint(x0 + 3, x1 - 4), r2.randint(y0 + 3, y1 - 3)
                    add(hy, lambda hx=hx, hy=hy: blit(HAY, hx, hy))


# ---------------------------------------------------------------- woda
WPAL = pal('#1d4682', '#25569a', '#2f68b0', '#3c7cc4', '#5394d4')


def paint_water(M):
    wm = M['water']
    din = ndimage.distance_transform_edt(wm)
    idx = np.clip((din / 2.4).astype(int), 0, 3)
    n = N3 * .6 + N2 * .4
    idx = np.clip(idx + (n > .68) - (n < .3), 0, 3)
    col = WPAL[3 - idx]
    col[din <= 1.01] = WPAL[4]
    img[wm] = col[wm]
    # połyski (krótkie poziome kreski)
    sp = wm & (din > 2.2) & (N3 > .7) & (BAY < .1)
    sp = sp | (np.roll(sp, 1, 1) & wm & (din > 2.2))
    img[sp] = hexc('#b6dcf4')
    shore = ndimage.binary_dilation(wm) & ~wm
    img[shore] = hexc('#34542a')
    img[shore & np.roll(wm, -1, 0) & ~M['forest']] = hexc('#b8a674')
    img[shore & np.roll(wm, 1, 0)] = hexc('#26401e')


# ---------------------------------------------------------------- szczegóły trawy
def paint_details(M, busy):
    free = ~(M['water'] | M['forest'] | M['mount'] | busy | ndimage.binary_dilation(M['water'], iterations=2))
    grass = free & ~M['plains'] & ~M['dead'] & ~M['swamp']
    dk = hexc('#35602a')
    lt = hexc('#9cc65a')
    for (x, y) in scatter(grass & (N3 > .35), 5, .95, 70):
        x, y = int(x), int(y)
        if R.random() < .55:
            img[y, x] = dk
            if x > 0:
                img[y + 1 if y + 1 < H else y, x - 1] = dk
            if x + 1 < W:
                img[y + 1 if y + 1 < H else y, x + 1] = dk
            if y > 0:
                img[y - 1, x] = lt
        elif R.random() < .18:
            c = R.choice(['#f0e878', '#f4f0e6', '#e07a6a', '#c49ae6', '#f0c050'])
            img[y, x] = hexc(c)
            if y + 1 < H:
                img[y + 1, x] = dk
    dry = free & M['plains'] & ~M['dead']
    for (x, y) in scatter(dry, 9, .95, 71):
        x, y = int(x), int(y)
        r = R.random()
        if r < .35:
            img[y, x] = hexc('#8e7a3c')
            if x + 1 < W:
                img[y, x + 1] = hexc('#e8d898')
        elif r < .44:
            add(y, lambda x=x, y=y: blit(BUSH_DRY, x, y))
        elif r < .45:
            add(y, lambda x=x, y=y: blit(STONE_S, x, y))
    for (x, y) in scatter(free & M['dead'] & (sdf(M['dead']) < -3), 14, .95, 72):
        r = R.random()
        spr = BONES if r < .25 else STONE_S if r < .7 else DEADTREE
        add(y, lambda s=spr, x=x, y=y: blit(s, x, y))
    # krzaki na łąkach
    for (x, y) in scatter(grass & (N1 > .5) & (N3 > .6), 13, .95, 73):
        add(y, lambda x=x, y=y: blit(BUSH, x, y))


# ---------------------------------------------------------------- sprite'y
def blit(spr, x, y):
    """spr: RGBA (h,w,4); (x,y) = środek podstawy"""
    h, w = spr.shape[:2]
    x0, y0 = int(round(x - w / 2)), int(round(y - h))
    xs0, ys0 = max(0, -x0), max(0, -y0)
    xs1, ys1 = min(w, W - x0), min(h, H - y0)
    if xs1 <= xs0 or ys1 <= ys0:
        return
    sub = spr[ys0:ys1, xs0:xs1]
    a = sub[..., 3]
    tgt = img[y0 + ys0:y0 + ys1, x0 + xs0:x0 + xs1]
    full = a == 255
    tgt[full] = sub[..., :3][full]
    half = (a > 0) & (a < 255)
    if half.any():  # cień: przyciemnij
        tgt[half] = (tgt[half] * (1 - a[half, None] / 255.0 * .5)).astype(np.uint8)


def shaded(mask, cols, light=(-.7, -.7), noise=.25, outline=True, seed=0):
    """maska kształtu -> RGBA z cieniowaniem (światło z lewej-góry) i obrysem"""
    h, w = mask.shape
    m = np.pad(mask, 1)
    H2, W2 = m.shape
    yy, xx = np.mgrid[0:H2, 0:W2]
    cy, cx = np.argwhere(m).mean(0)
    ry, rx = max(1, h / 2), max(1, w / 2)
    lv = -((xx - cx) / rx * light[0] + (yy - cy) / ry * light[1]) * .5 + .5
    lv += (~np.roll(m, 1, 1)) * .16 + (~np.roll(m, 1, 0)) * .2 - (~np.roll(m, -1, 1)) * .18 - (~np.roll(m, -1, 0)) * .22
    lv += (np.random.default_rng(seed).random(m.shape) - .5) * noise
    k = len(cols) - 1
    idx = np.clip((lv * (k - .2) + .6).astype(int), 1, k)
    out = np.zeros((H2, W2, 4), np.uint8)
    out[m, :3] = cols[idx[m]]
    out[m, 3] = 255
    if outline:
        ol = ndimage.binary_dilation(m) & ~m
        out[ol, :3] = cols[0]
        out[ol, 3] = 255
    return out


def with_shadow(spr, rx=None, dy=0):
    """dodaj miękki cień pod sprite'em (półprzezroczysty, przesunięty w prawo-dół)"""
    h, w = spr.shape[:2]
    rx = rx or max(2, w * .42)
    out = np.zeros((h + 2, w + 3, 4), np.uint8)
    yy, xx = np.mgrid[0:h + 2, 0:w + 3]
    sh = ((xx - (w / 2 + 1.5)) / rx) ** 2 + ((yy - (h - 0.5 + dy)) / max(1.2, rx * .35)) ** 2 < 1
    out[sh, 3] = 150
    o = out[0:h, 0:w]
    a = spr[..., 3] > 0
    o[a] = spr[a]
    return out


TREE_C = [pal('#12241a', '#1b3a22', '#25502a', '#306634', '#3e7c3e', '#52934a'),
          pal('#10201c', '#173328', '#204632', '#2a5a3e', '#36704a', '#478658')]
LEAF_C = [pal('#1a2a12', '#2a4618', '#3a5e20', '#4e782a', '#649434', '#7eae42'),
          pal('#1e2c14', '#34501e', '#4a6a26', '#62862e', '#7ca238', '#98bc48'),
          pal('#2a2010', '#4a3c16', '#6a581e', '#8a7428', '#a89032', '#c4ac40')]
BIRCH_C = pal('#26361a', '#44602a', '#5e7e34', '#7a9a40', '#98b650', '#b8d06a')
TRUNK = hexc('#3a2616')


def conifer(size, var=0, seed=0):
    hgt = [10, 13, 16, 20][size]
    wid = [7, 9, 11, 13][size]
    m = np.zeros((hgt, wid), bool)
    cx = (wid - 1) / 2
    tiers = 2 + size
    for y in range(hgt - 2):
        t = (y + 1) / (hgt - 2)
        tt = (t * tiers) % 1
        half = (.35 + .65 * t) * (.55 + .45 * tt) * (wid / 2)
        m[y, max(0, int(round(cx - half))):int(round(cx + half)) + 1] = True
    m[0, :] = False
    m[0, int(cx)] = True
    spr = shaded(m, TREE_C[var], noise=.3, seed=seed)
    th, tw = spr.shape[:2]
    spr[th - 3:th - 1, tw // 2, :3] = TRUNK
    spr[th - 3:th - 1, tw // 2, 3] = 255
    return with_shadow(spr)


def leafy(size, var=0, seed=0, birch=False):
    r = [3.4, 4.4, 5.6, 6.8][size]
    w = int(r * 2 + 2)
    h = int(r * 1.9 + 3)
    m = np.zeros((h, w), bool)
    yy, xx = np.mgrid[0:h, 0:w]
    rr = np.random.default_rng(seed)
    for _ in range(5 + size):
        bx, by = r + .5 + rr.normal(0, r * .3), r * .95 + rr.normal(0, r * .28)
        br = r * (.5 + rr.random() * .35)
        m |= (xx - bx) ** 2 + ((yy - by) * 1.08) ** 2 < br * br
    m[h - 3:, :] = False
    spr = shaded(m, BIRCH_C if birch else LEAF_C[var], noise=.5, seed=seed)
    th, tw = spr.shape[:2]
    cx = tw // 2
    spr[th - 4:th - 1, cx, :3] = hexc('#e6e2d4') if birch else TRUNK
    spr[th - 4:th - 1, cx, 3] = 255
    if birch:
        spr[th - 3, cx, :3] = hexc('#26201c')
    return with_shadow(spr)


SPR_CACHE = {}


def tree_sprite(kind, size, var):
    key = (kind, size, var, R.randint(0, 4))
    if key not in SPR_CACHE:
        s = (zlib.crc32(repr(key).encode()) & 0xffff) + SEED
        SPR_CACHE[key] = conifer(size, var, s) if kind == 'c' else leafy(size, var, s, kind == 'b')
    return SPR_CACHE[key]


def scatter(mask, spacing, jitter=.9, seed=0):
    r2 = random.Random(seed)
    pts = []
    for gy in range(0, H, spacing):
        for gx in range(0, W, spacing):
            x = gx + r2.random() * spacing * jitter + (spacing * (1 - jitter)) / 2
            y = gy + r2.random() * spacing * jitter + (spacing * (1 - jitter)) / 2
            xi, yi = int(x), int(y)
            if 0 <= xi < W and 0 <= yi < H and mask[yi, xi]:
                pts.append((x, y))
    return pts


OBJS = []


def add(y, fn):
    OBJS.append((y, len(OBJS), fn))


def plant_trees(M, keep):
    f = M['forest'] & ~keep
    fd = -sdf(M['forest'])
    conif = (XX < W * .26) | (YY < H * .2) | ((N1 > .6) & (XX < W * .5))
    for (x, y) in scatter(f, 6, .95, 1):
        xi, yi = int(x), int(y)
        d = fd[yi, xi]
        size = 0 if d < 3 else (1 if d < 8 else R.choice([1, 2, 2, 3]))
        c = conif[yi, xi] or R.random() < .2
        kind = 'c' if c else 'd'
        var = (1 if N2[yi, xi] > .55 else 0) if c else (2 if N3[yi, xi] > .86 else (1 if N2[yi, xi] > .5 else 0))
        spr = tree_sprite(kind, size, var)
        add(y, lambda s=spr, x=x, y=y: blit(s, x, y))
    # pojedyncze drzewa na łąkach
    open_ = ~M['forest'] & ~M['water'] & ~M['mount'] & ~keep & ~M['dead'] & ~M['plains'] & ~M['swamp'] & ~ndimage.binary_dilation(M['barrows'], iterations=6)
    bx, by = NP('brzezina')
    for (x, y) in scatter(open_ & (N1 > .5) & (N3 > .5), 11, .95, 2):
        kind = 'b' if abs(x - bx) < 60 and abs(y - by) < 40 else ('d' if R.random() < .8 else 'c')
        spr = tree_sprite(kind, R.choice([0, 1, 1, 2]), R.randint(0, 1))
        add(y, lambda s=spr, x=x, y=y: blit(s, x, y))
    for (x, y) in scatter(M['plains'] & ~M['dead'] & ~keep & ~M['water'] & (N3 > .74), 24, .9, 3):
        spr = tree_sprite('d', R.choice([0, 1]), 2 if R.random() < .5 else 1)
        add(y, lambda s=spr, x=x, y=y: blit(s, x, y))


# ---------------------------------------------------------------- góry
MNT = pal('#211c22', '#352e34', '#4a4146', '#62575a', '#7c7070', '#988a86', '#b4a69e')
SNOW = pal('#6c7894', '#a4b0c8', '#d2dcea', '#f2f6fc')


MNT_PALS = [pal('#1f1a1e', '#332b30', '#463c40', '#5a4f50', '#726664', '#8c7f7a', '#a89a92', '#c4b7ac'),   # ciepła szarość
            pal('#1a1c22', '#2a2e38', '#3c414c', '#515662', '#686d78', '#82878f', '#9ea2a8', '#bcc0c4'),   # chłodna
            pal('#211b16', '#352c24', '#4a3e32', '#605142', '#786754', '#927f6a', '#ac9a84', '#c6b6a0')]   # brązowa
SNOWP = pal('#5c6880', '#8492ac', '#aebad0', '#d4dde9', '#f4f7fc')
GRN = pal('#16260e', '#223a14', '#30501a', '#406822', '#54802a', '#6c9a36', '#88b446', '#a4c858')


def _ridged(rows, cols, seed, cell):
    g = np.random.default_rng(seed).random((rows // cell + 3, cols // cell + 3))
    n = ndimage.zoom(g, cell, order=3)[:rows, :cols]
    n = (n - n.min()) / max(1e-6, n.max() - n.min())
    return 1 - np.abs(2 * n - 1)


def mountain(w, h, snow=0.0, seed=0, green=False):
    """góra jako mała mapa wysokości oglądana z ukosa: grzbiety, żleby, światło z lewej-góry,
    śnieg na szczytach (snow = jaka część wysokości), zielone podnóże (green)"""
    rr = np.random.default_rng(seed)
    D = max(8, int(w * .5))
    vs = .45                                   # o ile piksel w głąb przesuwa się na ekranie
    U, V = np.meshgrid(np.arange(w, dtype=float), np.arange(D, dtype=float))
    peaks = [(w / 2 + rr.normal(0, w * .07), D * rr.uniform(.4, .55), h, w * .5)]
    for _ in range((w > 36) + (w > 60) + (rr.random() < .5)):
        side = rr.choice([-1, 1])
        peaks.append((w / 2 + side * rr.uniform(w * .15, w * .32), D * rr.uniform(.45, .85), h * rr.uniform(.45, .72), w * rr.uniform(.22, .34)))
    z = np.zeros((D, w))
    for (pu, pv, ph, pr) in peaks:
        d = np.sqrt((U - pu) ** 2 + ((V - pv) * 1.7) ** 2) / pr
        z = np.maximum(z, ph * np.clip(1 - d, 0, 1) ** 1.15)
    rid = .6 * _ridged(D, w, seed, 5) + .4 * _ridged(D, w, seed + 1, 3)
    z = np.where(z > 0, z * (.78 + .38 * rid), 0)
    # normalne i światło (u w prawo, v do widza, z w górę)
    gz_v, gz_u = np.gradient(z)
    nrm = np.sqrt(gz_u ** 2 + gz_v ** 2 + 1)
    lam = (-gz_u * -.62 + -gz_v * .38 + .72) / nrm
    P = MNT_PALS[int(rr.integers(0, len(MNT_PALS)))]
    tex = np.random.default_rng(seed + 7).random((D, w))
    Hs = int(np.ceil(z.max() + D * vs)) + 3
    off = int(np.ceil(z.max())) + 1
    col = np.zeros((Hs, w, 3), np.uint8)
    fill = np.zeros((Hs, w), bool)
    dep = np.full((Hs, w), -1)
    snow_z = z.max() * (1 - snow) if snow > 0 else 1e9
    for u in range(w):
        ybuf = Hs
        for v in range(D - 1, -1, -1):
            zz = z[v, u]
            if zz < max(.8, h * .07):  # bez płaskiej „spódnicy” u podstawy
                continue
            yt = int(round(off + v * vs - zz))
            yb = min(ybuf, int(round(off + v * vs)) + 1)  # do podstawy w tym rzędzie, nie do dołu obrazka
            if yt >= yb:
                continue
            l = lam[v, u] + (tex[v, u] - .5) * .18
            slope = math.hypot(gz_u[v, u], gz_v[v, u])
            if zz > snow_z + (tex[v, u] - .5) * h * .1 and slope < 3.6:
                c = SNOWP[cl(int(l * 5.2 - .4), 0, 4)]
            elif green and zz < h * .22 + tex[v, u] * h * .08:
                c = GRN[cl(int(l * 7 - .6), 1, 7)]
            else:
                li = l * 8.2 - 1.6
                if (v + int(zz)) % 5 == 0 and l > .55 and tex[v, u] > .55:
                    li -= 1  # warstwy skalne
                c = P[cl(int(li), 1, 7)]
            col[max(0, yt):yb, u] = c
            fill[max(0, yt):yb, u] = True
            dep[max(0, yt):yb, u] = v
            ybuf = min(ybuf, max(0, yt))
    # linie przesłaniania: tam, gdzie bliższy grzbiet zasłania dalszy
    jump = np.zeros_like(fill)
    jump[:-1] |= fill[:-1] & fill[1:] & (dep[1:] - dep[:-1] > 3)
    jump[:, 1:] |= fill[:, 1:] & fill[:, :-1] & (dep[:, :-1] - dep[:, 1:] > 4)
    jump[:, :-1] |= fill[:, :-1] & fill[:, 1:] & (dep[:, 1:] - dep[:, :-1] > 4)
    col[jump] = (col[jump] * .55).astype(np.uint8)
    out = np.zeros((Hs + 2, w + 2, 4), np.uint8)
    out[1:-1, 1:-1, :3] = col
    out[1:-1, 1:-1, 3] = fill * 255
    fp = np.pad(fill, 1)
    # obrys z góry i z boków; od dołu góra wtapia się w teren
    ol = ~fp & (np.roll(fp, -1, 0) | np.roll(fp, 1, 1) | np.roll(fp, -1, 1))
    ol &= ~(np.roll(fp, 1, 0) & ~np.roll(fp, -1, 0) & ~np.roll(fp, 1, 1) & ~np.roll(fp, -1, 1))
    out[ol, :3] = P[0]
    out[ol, 3] = 255
    return out


def raise_mountains(M, keep):
    mm = M['mount']
    d = -sdf(mm)
    pts = [(x, y, d[int(y), int(x)]) for (x, y) in scatter(mm, 22, .85, 5)]
    for (x, y, di) in pts:
        if di < 2 or keep[int(y), int(x)]:
            continue
        s = min(1.0, di / 55)
        w = int(34 + s * 52 + R.random() * 14)
        h = int(w * (.58 + R.random() * .2))
        snow = 0.0
        if (di > 36 and R.random() < .75) or (y < H * .2 and di > 16):
            snow = R.uniform(.13, .22) + (.05 if y < H * .2 else 0)
        spr = mountain(w, h, snow, R.randint(0, 99999), green=di < 14)
        add(y + 6, lambda s=spr, x=x, y=y: blit(s, x, y + 6))
    # pogórze
    for (x, y) in scatter((d > -16) & (d < 4) & ~M['water'] & ~M['forest'] & ~keep, 12, .9, 6):
        w = R.randint(10, 18)
        spr = mountain(w, int(w * .55), 0, R.randint(0, 99999), green=True)
        add(y, lambda s=spr, x=x, y=y: blit(s, x, y))
    # świerki na zboczach
    for (x, y) in scatter(mm & (d < 22) & ~keep & (N3 > .5), 9, .95, 7):
        spr = tree_sprite('c', R.choice([0, 1]), 1)
        add(y + 1, lambda s=spr, x=x, y=y: blit(s, x, y + 1))


# ---------------------------------------------------------------- bagno, mgła, kurhany
def paint_swamp(M, busy):
    sw = M['swamp'] & ~M['forest'] & ~busy
    pools = sw & (fbm(55, (16, 8, 4), (.5, .3, .2)) > .58) & (sdf(M['swamp']) < -4)
    din = ndimage.distance_transform_edt(pools)
    c = pal('#1b2a22', '#22362a', '#2b4432', '#5e7e6a')
    col = c[np.clip((din / 1.6).astype(int), 0, 2)]
    img[pools] = col[pools]
    hl = pools & (din > 1.5) & (N3 > .75) & (BAY < .15)
    img[hl] = c[3]
    rim = ndimage.binary_dilation(pools) & ~pools
    img[rim] = hexc('#4a4a2a')
    for (x, y) in scatter(sw & ~pools, 6, .95, 80):
        r = R.random()
        if r < .4:
            add(y, lambda x=x, y=y: blit(REED, x, y))
        elif r < .5:
            add(y, lambda x=x, y=y: blit(DEADTREE, x, y))


def paint_mist(M):
    nb = fbm(77, (70, 35, 18, 9), (.4, .3, .2, .1))
    a = np.clip(.5 - sdf(M['mist']) / 40, 0, 1) * np.clip((nb - .32) * 2.4, 0, 1)
    img_f = img.astype(float)
    l1 = a > BAY
    img_f[l1] = img_f[l1] * .62 + MISTC * .38
    l2 = (a > .72 + BAY * .28)
    img_f[l2] = img_f[l2] * .6 + MISTC * .4
    img[:] = img_f.astype(np.uint8)


def hill(w, cols, seed):
    h = max(6, int(w * .42))
    yy, xx = np.mgrid[0:h, 0:w]
    m = ((xx - (w - 1) / 2) / (w / 2)) ** 2 + ((yy - (h - 1)) / h) ** 2 < 1
    return shaded(m, cols, noise=.3, seed=seed, outline=False)


HILL_G = pal('#3a6026', '#4a742c', '#5a8632', '#6a9838', '#7caa42', '#90bc4e')
HILL_P = pal('#7e6a32', '#94803e', '#a8924a', '#bba456', '#ccb666', '#dcc878')


def place_hills(M, keep):
    free = ~(M['forest'] | M['water'] | M['mount'] | M['swamp'] | M['dead'] | keep | ndimage.binary_dilation(M['water'], iterations=5) | M['barrows'])
    for (x, y) in scatter(free & (N1 > .45), 34, .9, 95):
        pl = M['plains'][int(y), int(x)]
        spr = hill(R.randint(18, 34), HILL_P if pl else HILL_G, R.randint(0, 999))
        # pagórek rysujemy pod obiektami (na ziemi)
        blit(spr, x, y)
    for (x, y) in scatter(free & ~M['plains'] & (N2 > .55), 10, .95, 96):
        if R.random() < .5:
            spr = tree_sprite('d', R.choice([0, 1, 2]), R.randint(0, 1))
            add(y, lambda s=spr, x=x, y=y: blit(s, x, y))
    for (x, y) in scatter(free & M['plains'] & (N2 > .5), 26, .9, 97):
        r = R.random()
        if r < .4:
            spr = tree_sprite('d', R.choice([0, 1]), 2)
        elif r < .7:
            spr = STONE_S
        else:
            spr = BUSH_DRY
        add(y, lambda s=spr, x=x, y=y: blit(s, x, y))


def place_barrows(M, keep):
    for (x, y) in scatter(M['barrows'] & ~M['water'] & ~keep, 17, .85, 90):
        if R.random() < .15:
            continue
        spr = barrow(R.randint(10, 17), R.random() < .4, R.randint(0, 9999))
        add(y, lambda s=spr, x=x, y=y: blit(s, x, y))


def barrow(w, stone, seed):
    h = max(5, int(w * .5))
    m = np.zeros((h, w), bool)
    yy, xx = np.mgrid[0:h, 0:w]
    m = ((xx - (w - 1) / 2) / (w / 2)) ** 2 + ((yy - (h - 1)) / h) ** 2 < 1
    spr = shaded(m, pal('#2a3a16', '#45581e', '#5c7026', '#74882e', '#8ea03a', '#a8b84c'), noise=.35, seed=seed)
    if stone:
        th, tw = spr.shape[:2]
        cx = tw // 2
        for yy2 in range(3):
            spr[yy2, cx, :3] = hexc('#9a9488') if yy2 else hexc('#c4beb0')
            spr[yy2, cx, 3] = 255
        spr[0:3, cx + 1, :3] = hexc('#3a3632')
        spr[0:3, cx + 1, 3] = 255
    return with_shadow(spr)


# ---------------------------------------------------------------- małe sprite'y (ASCII)
def ascii_spr(rows, cmap):
    h, w = len(rows), max(len(r) for r in rows)
    out = np.zeros((h, w, 4), np.uint8)
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch in cmap:
                out[y, x, :3] = hexc(cmap[ch])
                out[y, x, 3] = 255
            elif ch == ':':
                out[y, x, 3] = 140
    return out


HAY = ascii_spr([' oo ', 'oyyo', 'yYyd', 'oddo'], {'o': '#5a4418', 'y': '#e8c860', 'Y': '#f6e098', 'd': '#b08a30'})
BUSH = ascii_spr(['  oo  ', ' oLlo ', 'oLlgdo', 'olgdgo', ' oddo:', '  ::  '], {'o': '#1c3014', 'L': '#7aa844', 'l': '#5e8c34', 'g': '#4a7428', 'd': '#365a20'})
BUSH_DRY = ascii_spr([' oo ', 'oLlo', 'olgo', ' oo:'], {'o': '#4a3a1c', 'L': '#a89a4a', 'l': '#8a7c3a', 'g': '#6e602c'})
STONE_S = ascii_spr([' oo ', 'oLgo', 'ogdo', ' oo:'], {'o': '#2a2622', 'L': '#a8a296', 'g': '#7e786c', 'd': '#5a5448'})
BONES = ascii_spr(['w  w', ' ww ', 'w  w'], {'w': '#d8d0bc'})
DEADTREE = ascii_spr(['o   o', ' o o ', '  o o', ' oo  ', '  o  ', '  o  ', ' :o: '], {'o': '#3a2e26'})
REED = ascii_spr(['l l', 'lgl', ' g '], {'l': '#8a9a46', 'g': '#4e6028'})


# ================================================================ DROGI
ROAD_VIA = {('weleszow', 'sanow'): [(54.5, 26), (55.5, 36)], ('sanow', 'wschodnia'): [(64, 45), (70, 44)], ('kregoszew', 'kurhanow'): [(27, 66), (36, 70)],
            ('weleszow', 'doliny'): [(45, 15)], ('olszynow', 'wschodnia'): [(71, 36)], ('wschodnia', 'jama'): [(80.5, 39), (84, 36.5), (82.5, 31), (86.5, 27), (85, 21.5), (89, 18)],
            ('wschodnia', 'grzbiet'): [(80.5, 41), (83.5, 40), (85, 36.5)], ('wschodnia', 'straznica'): [(80, 54), (83, 61)], ('ruiny', 'poludnie'): [(66, 86)],
            ('straznica', 'martwe'): [(91, 76)], ('kurhanow', 'ruiny'): [(52, 77)], ('sanow', 'pola'): [(51.5, 46.5), (47.5, 47.8), (45.2, 51.5), (46, 56)],
            ('brzezina', 'most'): [(46, 40)], ('wschodnia', 'kuznia'): [(74, 47)], ('mlyn', 'rozlewiska'): [(29.5, 57)]}


def road_pts(a, b):
    key = (a, b) if (a, b) in ROAD_VIA else (b, a) if (b, a) in ROAD_VIA else None
    via = ROAD_VIA.get(key, [])
    if key and key != (a, b):
        via = via[::-1]
    pts = [NP(a)] + [P(*v) for v in via] + [NP(b)]
    r2 = random.Random(zlib.crc32((a + '|' + b).encode()))
    # lekkie wygięcia
    out = [pts[0]]
    for p0, p1 in zip(pts, pts[1:]):
        dx, dy = p1[0] - p0[0], p1[1] - p0[1]
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        for t in (.33, .66):
            off = r2.uniform(-.06, .06) * L
            out.append((p0[0] + dx * t + nx * off, p0[1] + dy * t + ny * off))
        out.append(p1)
    return catmull(out, 14)


ROAD_CURVES = {}


def paint_roads(M):
    road = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(road)
    for a, b in EDGES:
        if a not in NODES or b not in NODES:
            continue
        cs = road_pts(a, b)
        ROAD_CURVES[(a, b)] = cs
        if a in SECRET or b in SECRET:  # sekretnych ścieżek nie rysujemy – gra pokaże je po odkryciu
            continue
        wd = 3 if (a, b) in MAIN_ROADS or (b, a) in MAIN_ROADS else 2
        d.line([tuple(p) for p in cs], fill=255, width=wd, joint='curve')
    rm = np.array(road) > 0
    edge = ndimage.binary_dilation(rm) & ~rm
    land = ~M['water']
    rc = pal('#7e6238', '#9c7c48', '#b49456', '#c8aa6a')[tone(N3, 4, .9)]
    sel = rm & land
    img[sel] = rc[sel]
    e = edge & land & ~M['water']
    img[e] = (img[e] * .72).astype(np.uint8)
    # mosty
    br = ndimage.binary_dilation(rm, iterations=1) & ndimage.binary_dilation(M['water'], iterations=1)
    br &= ndimage.binary_dilation(M['water'], iterations=1)
    bc = np.where(((XX + YY) % 3) == 0, 1, 0)
    plank = pal('#6a4a28', '#8e6a3c')[bc]
    img[br] = plank[br]
    rail = ndimage.binary_dilation(br) & ~br & M['water']
    img[rail] = hexc('#3a2614')
    return rm


def resample(cs, step):
    out = [cs[0]]
    acc = 0.0
    for p0, p1 in zip(cs, cs[1:]):
        seg = math.hypot(p1[0] - p0[0], p1[1] - p0[1])
        while acc + seg >= step and seg > 0:
            t = (step - acc) / seg
            p0 = (p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t)
            out.append(p0)
            seg = math.hypot(p1[0] - p0[0], p1[1] - p0[1])
            acc = 0.0
        acc += seg
    if math.hypot(out[-1][0] - cs[-1][0], out[-1][1] - cs[-1][1]) > step * .4:
        out.append(cs[-1])
    else:
        out[-1] = cs[-1]
    return out


def write_roads():
    """js/data/velesia-roads.js: kształt każdej drogi w procentach mapy – po nim idzie kompania"""
    rows = []
    for (a, b), cs in ROAD_CURVES.items():
        pts = resample([tuple(p) for p in cs], 5)
        rows.append(' "%s|%s":[%s]' % (a, b, ','.join('[%s,%s]' % (('%.1f' % (x * 100 / W)).rstrip('0').rstrip('.'), ('%.1f' % (y * 100 / H)).rstrip('0').rstrip('.')) for x, y in pts)))
    src = ('/* ===== DROGI VELESII: kształt dróg z mapy, punkty w procentach mapy (x, y) =====\n'
           '   Wygenerowane przez tools/velesia_map.py – nie edytuj ręcznie, tylko uruchom skrypt ponownie. */\n'
           'const ROADS={\n' + ',\n'.join(rows) + '};\n')
    out = os.path.join(ROOT, 'js/data/velesia-roads.js')
    open(out, 'w', encoding='utf-8').write(src)
    print('zapisano', out, len(src) // 1024, 'KB')


# ================================================================ BUDYNKI
class Cv:
    """płótno sprite'a: rysujemy piksele, na końcu obrys i cień"""

    def __init__(s, w, h):
        s.w, s.h = w, h
        s.a = np.zeros((h, w, 4), np.uint8)
        s.post = []  # piksele bez obrysu (dym), nakładane na końcu
        s.gr = np.zeros((h, w, 4), np.uint8)  # warstwa ziemi (plac, ogródki) – pod spodem, bez obrysu

    def g(s, x, y, c):
        x, y = int(round(x)), int(round(y))
        if 0 <= x < s.w and 0 <= y < s.h:
            s.gr[y, x, :3] = hexc(c) if isinstance(c, str) else c
            s.gr[y, x, 3] = 255

    def p(s, x, y, c):
        x, y = int(round(x)), int(round(y))
        if 0 <= x < s.w and 0 <= y < s.h:
            s.a[y, x, :3] = hexc(c) if isinstance(c, str) else c
            s.a[y, x, 3] = 255

    def r(s, x, y, w, h, c):
        for yy in range(int(y), int(y + h)):
            for xx in range(int(x), int(x + w)):
                s.p(xx, yy, c)

    def has(s, x, y):
        return 0 <= x < s.w and 0 <= y < s.h and s.a[y, x, 3] == 255

    def done(s, ol='#1e1410', shadow=True):
        m = s.a[..., 3] == 255
        out = np.zeros((s.h + 2, s.w + 2, 4), np.uint8)
        out[1:-1, 1:-1] = s.a
        mp = np.pad(m, 1)
        o = ndimage.binary_dilation(mp) & ~mp
        out[o, :3] = hexc(ol)
        out[o, 3] = 255
        gm = (s.gr[..., 3] == 255) & ~m & ~o[1:-1, 1:-1]
        out[1:-1, 1:-1][gm] = s.gr[gm]
        for (x, y, col) in s.post:
            if 0 <= x < s.w and 0 <= y < s.h and not m[y, x]:
                out[y + 1, x + 1, :3] = hexc(col)
                out[y + 1, x + 1, 3] = 255
        return with_shadow(out, rx=(s.w + 2) * .5) if shadow else out


def cl(v, a, b):
    return max(a, min(b, v))


# kamień: 0 obrys … 6 światło
STN = ['#231d19', '#433e37', '#5f584d', '#7f7768', '#a09886', '#c2baa6', '#e0d9c6']
# dachy: 0 obrys … 5 światło
RF = {'red': ['#3a140c', '#662616', '#8a3820', '#ae4c2c', '#cc663c', '#e6885a'],
      'slate': ['#161c2a', '#283448', '#3a4a66', '#4e6284', '#667ca0', '#879ebe'],
      'thatch': ['#36260c', '#644a1e', '#8a682c', '#ae8a3c', '#cea854', '#e6c874'],
      'wood': ['#26180c', '#432c18', '#614226', '#805834', '#9e7046', '#bc8c5c'],
      'grey': ['#1c1c1e', '#363638', '#4e4c4a', '#666460', '#7e7a74', '#9a968e'],
      'turf': ['#16260e', '#2a4218', '#3c5a20', '#527428', '#6a9032', '#86ac42']}
# tynk: 0 cień … 4 światło
PLS = ['#6a5842', '#9c8c6c', '#c0b08c', '#dacca8', '#efe4c6']
PLS_W = ['#3e2c1a', '#5a4028', '#765634', '#8e6a42', '#a8804e']  # drewniane ściany
PLS_S = ['#3e3a34', '#5e584e', '#7a7468', '#958e80', '#aea698']  # kamienne ściany
PLS_G = ['#3a3836', '#55524e', '#6c6862', '#827d76', '#98928a']  # szare (Ustronie)
TMB = '#4a2e18'


def wall_cols(walls):
    if walls is None:
        return PLS
    if len(walls) == 4:  # stary format [cień, środek, jasny, światło]
        return [walls[0], walls[0], walls[1], walls[2], walls[3]]
    return walls


def house(c, x, y, w, roof='red', walls=None, door=True, rh=None, chimney=None, frame=None, lit=True):
    """dom w widoku 3/4: dach dwuspadowy (kalenica równoległa do frontu) i ściana frontowa.
    (x, y) = lewy górny róg dachu; zwraca y dolnej krawędzi"""
    R = RF[roof]
    P = wall_cols(walls)
    rh = rh or max(4, int(w * .62))
    frame = (roof != 'thatch' and walls is None) if frame is None else frame
    # dach czterospadowy: u góry węższy, na dole z okapem
    for r in range(rh):
        ins = int(round((1 - r / max(1, rh - 1)) * min(2.4, w / 3.5)))
        ov = 0 if r < 2 else 1
        x0, x1 = x - ov + ins, x + w + ov - ins
        for xx in range(x0, x1):
            t = r / max(1, rh - 1)
            v = 5 if r == 0 else 4 if t < .34 else 3 if t < .7 else 2
            if roof in ('red', 'slate', 'grey', 'wood') and r > 0 and r % 2 == 0:
                v -= 1  # rzędy dachówek
                if (xx + r // 2 * 2) % 3 == 0:
                    v += 1
            if roof == 'thatch' and (xx * 7 + r * 3) % 5 == 0:
                v -= 1  # źdźbła strzechy
            if roof == 'turf' and (xx * 5 + r * 3) % 4 == 0:
                v += 1
            if xx == x0 and r > 0:
                v += 1
            if xx == x1 - 1:
                v -= 1
            if r == rh - 1:
                v = min(v, 2) - (0 if roof == 'thatch' else 1)
            c.p(xx, y + r, R[cl(v, 1, 5)])
    # komin z dymem
    if chimney is not None:
        cx = x + chimney
        for yy in range(y - 2, y + 2):
            c.p(cx, yy, STN[4] if yy < y else STN[3])
            c.p(cx + 1, yy, STN[2])
        c.p(cx, y - 2, STN[5])
    wy = y + rh
    wh = 4
    for r in range(wh):
        for xx in range(x, x + w):
            v = 3 if r > 0 else 1
            if xx == x:
                v += 1
            if xx == x + w - 1:
                v -= 1
            c.p(xx, wy + r, P[cl(v, 0, 4)])
    if frame:  # mur pruski
        for xx in [x, x + w - 1] + ([x + w // 2] if w >= 9 else []):
            for r in range(1, wh):
                c.p(xx, wy + r, TMB)
        for xx in range(x, x + w):
            c.p(xx, wy + 1, TMB if (xx - x) % 4 != 2 else P[3])
    # okna (świecą ciepło) i drzwi – niesymetrycznie, żeby dom nie miał „twarzy”
    big = w >= 10
    dx = x + w // 2 - 1 if big else x + w - 3
    wins = [x + 2, x + w - 3] if big else [x + 1 + (1 if frame else 0)]
    for wx in wins:
        for k in range(2 if big else 1):
            c.p(wx + k - (1 if big and wx > dx else 0), wy + 2, '#ffd870' if lit else '#2a2228')
        c.p(wx, wy + 1, '#3a2a20')
    if door:
        for xx in range(dx, dx + (2 if big else 1)):
            c.p(xx, wy + 1, '#3e2410')
            c.p(xx, wy + 2, '#6a4220')
            c.p(xx, wy + 3, '#4a2c14')
    # podmurówka
    for xx in range(x, x + w):
        c.p(xx, wy + wh - 1, P[1] if (xx % 3) else P[0])
    return wy + wh


def smoke(c, x, y):
    """dym z komina: kłębki coraz wyżej i bledsze, znoszone w prawo"""
    for i, (dx, dy, w) in enumerate([(0, 0, 1), (1, -2, 2), (2, -4, 2), (4, -6, 1)]):
        for k in range(w):
            c.post.append((x + dx + k, y + dy, '#eceae4' if i < 2 else '#c8c6c0'))


def tower(c, x, y, w, h, roof='red', crenel=False, slits=True):
    """okrągła wieża: cieniowanie walca, cegły, strzelnice; dach stożkowy albo blanki"""
    cols = [STN[6], STN[5], STN[4], STN[4], STN[3], STN[3], STN[2]]
    for yy in range(y, y + h):
        for xx in range(x, x + w):
            t = (xx - x + .5) / w
            v = cols[cl(int(t * len(cols)), 0, len(cols) - 1)]
            vi = STN.index(v)
            if (yy - y) % 3 == 2 and ((xx + (yy // 3) * 2) % 4 != 0):
                vi -= 1  # spoiny
            if yy == y + h - 1:
                vi -= 1
            c.p(xx, yy, STN[cl(vi, 1, 6)])
    if slits:
        for sy in range(y + 3, y + h - 3, 6):
            sx = x + w // 2 - (1 if w > 6 else 0)
            c.p(sx, sy, '#1a1410')
            c.p(sx, sy + 1, '#1a1410')
    if crenel:
        for xx in range(x - 1, x + w + 1):
            t = (xx - x + 1) / (w + 2)
            c.p(xx, y, STN[5] if t < .4 else STN[4] if t < .7 else STN[2])
            c.p(xx, y + 1, STN[2])
            if (xx - x) % 2 == 0:
                c.p(xx, y - 1, STN[6] if t < .5 else STN[3])
                c.p(xx, y - 2, STN[5] if t < .5 else STN[3])
    elif roof:
        R = RF[roof]
        rh = int(w * 1.35) + 2
        cx = x + (w - 1) / 2
        for r in range(rh):
            half = (r + 1) / rh * (w / 2 + 1.2)
            for xx in range(int(math.floor(cx - half + .5)), int(math.ceil(cx + half - .5)) + 1):
                t = (xx - (cx - half)) / max(1, 2 * half)
                v = 5 if t < .25 else 4 if t < .5 else 3 if t < .75 else 2
                if r % 3 == 2:
                    v -= 1
                if r == rh - 1:
                    v = 1
                c.p(xx, y - rh + r + 1, R[cl(v, 1, 5)])
        c.p(cx, y - rh, STN[1])


def keep(c, x, y, w, h, side=3, roof='red'):
    """kwadratowa wieża/donżon w 3/4: front, ciemniejszy bok, blanki i dach namiotowy"""
    for yy in range(y, y + h):
        for xx in range(x, x + w + side):
            if xx < x + w:
                v = 5 if xx == x else 4
            else:
                v = 2 if xx < x + w + side - 1 else 1
            if (yy - y) % 3 == 2 and ((xx + (yy // 3) * 2) % 4 != 0):
                v -= 1
            c.p(xx, yy, STN[cl(v, 1, 6)])
    # okna: rzędy
    for wy in range(y + 4, y + h - 4, 6):
        for wx in range(x + 2, x + w - 1, 3):
            c.p(wx, wy, '#ffd870' if (wx + wy) % 5 == 0 else '#1a1410')
            c.p(wx, wy + 1, '#1a1410')
    # blanki
    for xx in range(x - 1, x + w + side + 1):
        c.p(xx, y - 1, STN[3] if xx < x + w else STN[2])
        if (xx - x) % 2 == 0:
            c.p(xx, y - 2, STN[6] if xx < x + w else STN[3])
    if roof:
        R = RF[roof]
        tw = w + side
        rh = tw // 2 + 2
        for r in range(rh):
            inset = int(r * .0)
            x0 = x + (tw // 2) - (r + 1) * tw // (2 * rh) - 0
            x1 = x + (tw // 2) + (r + 1) * tw // (2 * rh)
            for xx in range(x0, x1 + 1):
                t = (xx - x0) / max(1, x1 - x0)
                v = 5 if t < .3 else 4 if t < .55 else 2
                if r % 3 == 2:
                    v -= 1
                c.p(xx, y - 2 - rh + r, R[cl(v, 1, 5)])


def wall(c, x, y, w, h=4):
    """mur kurtynowy: lico z cegłami, chodnik i blanki"""
    for yy in range(y, y + h):
        for xx in range(x, x + w):
            v = 4 if yy == y else 3
            if yy == y + h - 1:
                v = 2
            if yy > y and (yy - y) % 3 == 0 and (xx + (yy // 3) * 2) % 4 != 0:
                v -= 1
            c.p(xx, yy, STN[cl(v, 1, 6)])
    for xx in range(x, x + w):
        if (xx - x) % 2 == 0:
            c.p(xx, y - 1, STN[5])
            c.p(xx, y - 2, STN[6])
        else:
            c.p(xx, y - 1, STN[3])


def gatehouse(c, x, y, w=12, h=14, roof='red'):
    """brama: dwie wieżyczki i łukowe przejście z kratą"""
    tower(c, x, y, 4, h, roof)
    tower(c, x + w - 4, y, 4, h, roof)
    for yy in range(y + 3, y + h):
        for xx in range(x + 4, x + w - 4):
            c.p(xx, yy, STN[4] if yy > y + 3 else STN[5])
    gx0, gx1, gy = x + 5, x + w - 5, y + h - 6
    for yy in range(gy, y + h):
        for xx in range(gx0, gx1):
            arch = yy == gy and (xx == gx0 or xx == gx1 - 1)
            if arch:
                continue
            c.p(xx, yy, '#120c08' if (xx - gx0) % 2 or yy == gy else '#3a2a1a')


def palisade(c, x, y, w, h=4):
    for xx in range(x, x + w):
        top = y - (1 if xx % 2 == 0 else 0)
        for yy in range(top, y + h):
            c.p(xx, yy, '#9a6e38' if xx % 2 == 0 else '#6e4c26')
        c.p(xx, top, '#c49a5a' if xx % 2 == 0 else '#8a6232')
        c.p(xx, y + 1, '#4a3018')  # wiązanie


def castle_hill(c, cx, top, rx, depth, seed=0, path=None, grass=True):
    """wzgórze pod grodem: płaski wierzch, trawiaste stoki rozszerzające się ku dołowi,
    skalne urwisko od frontu z pionowymi rysami, ścieżka do bramy"""
    rr = random.Random(seed)
    G = [hexc(h) for h in ('#2e4a1c', '#3e6024', '#4e762c', '#5e8a34', '#72a03e')]
    Rk = [hexc(h) for h in ('#2e2924', '#46403a', '#615a50', '#7d7568', '#9a9282')]
    if not grass:
        G = [hexc(h) for h in ('#3a3436', '#544c4e', '#6e6466', '#8a7f7e', '#a89c98')]
    base = top + depth
    streak = {}
    for xx in range(int(cx - rx), int(cx + rx) + 1):
        dx = (xx - cx) / rx
        if abs(dx) > 1:
            continue
        surf = top + depth * max(0, (abs(dx) - .55) / .45) ** 1.4 * .9  # płaski szczyt, stoki
        cliff0 = surf + 2
        cliff1 = base - 3 - (1 if rr.random() < .4 else 0)
        st = streak.setdefault(xx // 2, rr.uniform(-.9, .9))
        for yy in range(int(surf), int(base) + 1):
            on_cliff = abs(dx) < .72 and cliff0 <= yy <= cliff1
            if on_cliff:
                f = (yy - cliff0) / max(1, cliff1 - cliff0)
                v = 3.3 - dx * 1.3 - f * 1.4 + st
                c.p(xx, yy, Rk[cl(int(v), 0, 4)])
            else:
                lv = 3.2 - dx * 1.4 - (.8 if yy > cliff1 else 0) + rr.uniform(-.5, .5)
                if yy == int(surf):
                    lv += 1
                c.p(xx, yy, G[cl(int(lv), 0, 4)])
    if path:  # ścieżka do bramy
        (px0, py0), (px1, py1) = path
        n = int(max(abs(px1 - px0), abs(py1 - py0))) + 1
        for i in range(n):
            t = i / max(1, n - 1)
            px = px0 + (px1 - px0) * t + math.sin(t * 6) * 2
            py = py0 + (py1 - py0) * t
            c.p(px, py, '#c8aa6a')
            c.p(px + 1, py, '#9c7c48')


def flag(c, x, y, col='#c8282a', col2='#f0e8d8', h=6):
    for yy in range(y, y + h):
        c.p(x, yy, '#3a2a1a')
    for xx in range(1, 5):
        c.p(x + xx, y, col)
        c.p(x + xx, y + 1, col if xx != 2 else col2)
        if xx < 4:
            c.p(x + xx, y + 2, col)


def well(c, x, y):
    for xx in range(x, x + 4):
        c.p(xx, y, STN[4] if xx < x + 2 else STN[3])
        c.p(xx, y + 1, STN[3] if xx < x + 2 else STN[2])
    c.p(x + 1, y, '#1a2a3a')
    c.p(x + 2, y, '#1a2a3a')
    c.p(x, y - 1, TMB)
    c.p(x + 3, y - 1, TMB)
    for xx in range(x, x + 4):
        c.p(xx, y - 2, RF['wood'][4])


def haystack(c, x, y):
    for (dx, dy, v) in [(1, 0, 5), (2, 0, 4), (0, 1, 5), (1, 1, 4), (2, 1, 4), (3, 1, 3), (0, 2, 4), (1, 2, 3), (2, 2, 3), (3, 2, 2)]:
        c.p(x + dx, y + dy, RF['thatch'][v])


def fence(c, x, y, w):
    for xx in range(x, x + w):
        c.p(xx, y, '#8a6232')
        if (xx - x) % 3 == 0:
            c.p(xx, y - 1, '#a87c44')
            c.p(xx, y + 1, '#4a3018')


def garden(c, x, y, w, h):
    for yy in range(y, y + h):
        for xx in range(x, x + w):
            c.g(xx, yy, '#6a4a28' if yy % 2 else ('#5e9a34' if (xx + yy) % 3 else '#8ac04a'))


def windmill(c, x, y):
    """wiatrak: drewniana wieża i cztery skrzydła"""
    for yy in range(y + 8, y + 20):
        hw = 2 + (yy - y - 8) // 4
        for xx in range(x - hw, x + hw + 1):
            c.p(xx, yy, RF['wood'][4] if xx < x else RF['wood'][3] if xx == x else RF['wood'][2])
    for xx in range(x - 3, x + 4):
        c.p(xx, y + 7, RF['thatch'][3])
    hx, hy = x, y + 8
    for (dx, dy) in [(1, -1), (-1, -1), (1, 1), (-1, 1)]:
        for i in range(1, 8):
            c.p(hx + dx * i, hy + dy * i, '#e8dcc0' if i % 2 else '#7a5a34')
            c.p(hx + dx * i + (1 if dx > 0 else -1), hy + dy * i, '#c8bca0')
    c.p(hx, hy, '#3a2614')


def tree_c(c, x, y, r, cols=None, trunk=True, seed=0):
    """liściaste drzewo wprost na płótnie (do kompozycji osad)"""
    rr = random.Random(seed)
    L = cols or [hexc(h) for h in ('#2a4618', '#3a5e20', '#4e782a', '#649434', '#7eae42')]
    for yy in range(int(y - r), int(y + r) + 1):
        for xx in range(int(x - r), int(x + r) + 1):
            d = ((xx - x) / r) ** 2 + ((yy - y) / (r * .9)) ** 2
            if d < 1 - rr.random() * .15:
                v = 2.6 - (xx - x) / r * 1.2 - (yy - y) / r * 1.3 + rr.uniform(-.7, .7)
                c.p(xx, yy, L[cl(int(v), 0, 4)])
    if trunk:
        for yy in range(int(y + r * .7), int(y + r + 3)):
            c.p(x, yy, '#4a3018')


def village_ground(c, x, y, w, h, col='#a08454'):
    """ubita ziemia placu wiejskiego (rozmyta krawędź)"""
    rr = random.Random(int(x * 7 + y))
    for yy in range(y, y + h):
        for xx in range(x, x + w):
            dx, dy = (xx - x - w / 2) / (w / 2), (yy - y - h / 2) / (h / 2)
            if dx * dx + dy * dy < 1 - rr.random() * .25:
                c.g(xx, yy, col if rr.random() < .85 else '#8a6e44')


# ---------------------------------------------------------------- miasta i gród
def lm_castle():
    """Weleszów: zamek królewski na skalistym wzgórzu nad Veleską, podgrodzie u stóp"""
    c = Cv(96, 82)
    castle_hill(c, 48, 50, 46, 26, 1, path=((45, 60), (34, 79)))
    # zabudowa wewnątrz murów (za murem)
    house(c, 14, 30, 11, 'slate', rh=5, walls=PLS_S)          # kaplica
    tower(c, 16, 22, 5, 12, 'slate')                             # dzwonnica
    keep(c, 34, 14, 20, 30, side=4, roof='red')                 # donżon
    tower(c, 58, 6, 8, 38, 'red')                                # wysoka wieża
    flag(c, 61, -2 + 0, '#c8282a', '#f0e8d8', 7)
    house(c, 69, 32, 12, 'red', rh=5)                            # sala
    flag(c, 44, 0, '#c8282a', '#f0e8d8', 5)
    # mury z wieżami
    wall(c, 8, 44, 80, 10)
    for tx, th in [(4, 22), (24, 16), (64, 16), (86, 22)]:
        tower(c, tx, 54 - th, 7 if th > 18 else 6, th, 'red')
    gatehouse(c, 41, 40, 14, 15, 'red')
    # podgrodzie u stóp wzgórza
    house(c, 1, 64, 8, 'red', chimney=5)
    house(c, 82, 66, 9, 'red', chimney=2)
    house(c, 12, 70, 7, 'thatch')
    house(c, 71, 72, 8, 'thatch', chimney=4)
    smoke(c, 6, 61)
    smoke(c, 85, 63)
    return c.done()


def lm_sanow():
    """Sanów: miasto kupców nad jeziorem – mury od wody, rzędy kamienic, kościół, rynek, spichlerz"""
    rr = random.Random(4)
    c = Cv(86, 52)
    village_ground(c, 30, 24, 28, 10, '#b8a888')
    for ry in (1, 11, 21):
        x = 1 + (ry // 8) % 2 * 3
        while x < 80:
            w = rr.randint(7, 9)
            if ry < 18 and 31 <= x + w and x <= 52:
                x = 53
                continue
            if x + w > 84:
                break
            ch = rr.randint(1, w - 2) if rr.random() < .35 else None
            house(c, x, ry, w, 'red' if rr.random() < .75 else rr.choice(['thatch', 'wood', 'slate']), chimney=ch)
            if ch is not None and rr.random() < .6:
                smoke(c, x + ch, ry - 3)
            x += w + rr.randint(1, 3)
    tower(c, 40, 8, 6, 16, 'slate')                               # kościół
    house(c, 33, 15, 18, 'slate', rh=5, walls=PLS_S)
    house(c, 56, 23, 16, 'wood', rh=4, walls=PLS_W, frame=False)  # spichlerz
    wall(c, 1, 40, 84, 8)
    for tx in (0, 27, 54, 79):
        tower(c, tx, 28, 7, 20, 'red')
    gatehouse(c, 36, 35, 14, 13, 'red')
    return c.done()


def lm_kregoszew():
    """Kręgoszew: kamienna strażnica na skale, palisada, chaty u stóp"""
    c = Cv(60, 58)
    castle_hill(c, 30, 32, 28, 20, 7, path=((27, 41), (20, 57)))
    keep(c, 20, 8, 14, 26, side=4, roof='slate')
    tower(c, 10, 18, 6, 16, 'slate')
    tower(c, 40, 16, 6, 18, 'slate')
    flag(c, 27, -2, '#3a5aa8', '#f0e8d8', 6)
    wall(c, 8, 32, 44, 6)
    gatehouse(c, 23, 28, 12, 11, 'slate')
    palisade(c, 1, 47, 14, 5)
    palisade(c, 45, 47, 14, 5)
    house(c, 2, 39, 8, 'wood', walls=PLS_W, chimney=2)
    house(c, 49, 40, 8, 'thatch')
    smoke(c, 4, 36)
    return c.done()


def lm_dabrowa():
    """Dąbrowa: osada przy Świętym Dębie, palisada, chaty, ogródki zielarzy"""
    c = Cv(64, 44)
    village_ground(c, 20, 20, 40, 14)
    # Święty Dąb
    oak = [hexc(h) for h in ('#1e3612', '#2e4e1a', '#406a24', '#56862e', '#70a23a')]
    for (x, y, r) in [(13, 13, 10), (6, 16, 7), (20, 15, 7), (13, 6, 7), (8, 9, 5), (18, 8, 5)]:
        tree_c(c, x, y, r, oak, trunk=False, seed=x * 3 + y)
    for yy in range(20, 31):
        c.p(12, yy, '#5a3a1c')
        c.p(13, yy, '#4a2e14')
        c.p(14, yy, '#3a2410')
    for (dx, dy) in [(-2, 0), (-1, 0), (3, 0), (4, 0)]:
        c.p(13 + dx, 30 + dy, '#4a2e14')
    for (x, y) in [(7, 30), (19, 31)]:  # kamienie ofiarne
        c.p(x, y, STN[5])
        c.p(x, y - 1, STN[4])
    house(c, 26, 8, 9, 'thatch', walls=PLS_W, chimney=6)
    house(c, 39, 6, 10, 'thatch', walls=PLS_W)
    house(c, 51, 11, 8, 'wood', walls=PLS_W, chimney=2)
    house(c, 30, 19, 8, 'thatch', walls=PLS_W)
    house(c, 44, 19, 9, 'wood', walls=PLS_W)
    garden(c, 22, 30, 7, 4)
    garden(c, 55, 26, 6, 4)
    well(c, 40, 32)
    smoke(c, 32, 5)
    smoke(c, 53, 8)
    palisade(c, 1, 37, 26, 5)
    palisade(c, 37, 37, 26, 5)
    for xx in (27, 36):  # wieżyczki bramy
        for yy in range(31, 42):
            c.p(xx, yy, '#8a6232')
            c.p(xx + 1, yy, '#6a4824')
        for x2 in range(xx - 1, xx + 3):
            c.p(x2, 30, RF['thatch'][4])
            c.p(x2, 31, RF['thatch'][2])
    return c.done()


def lm_kurhanow():
    """Kurhanów: drewniane chaty z darniowymi dachami, menhiry, płot"""
    c = Cv(54, 34)
    village_ground(c, 6, 14, 42, 12, '#9a8456')
    for (x, y, w, rf) in [(4, 8, 9, 'turf'), (18, 4, 10, 'thatch'), (33, 7, 9, 'turf'), (12, 16, 8, 'wood'), (40, 15, 8, 'thatch')]:
        house(c, x, y, w, rf, walls=PLS_W, chimney=3 if rf == 'thatch' else None)
    for (x, h) in [(2, 5), (50, 6), (30, 4)]:  # menhiry
        for yy in range(30 - h, 30):
            c.p(x, yy, STN[5] if yy < 30 - h + 2 else STN[4])
            c.p(x + 1, yy, STN[2])
    fence(c, 6, 31, 40)
    smoke(c, 22, 1)
    smoke(c, 43, 12)
    return c.done()


def lm_village(seed, n=4, roof='thatch', walls=None, extra=None, props=('hay', 'well', 'garden'), lit=True, smoky=True):
    """wieś: chaty wokół placu, studnia, stogi, ogródki, płotki, dym z kominów"""
    rr = random.Random(seed)
    c = Cv(48, 30)
    village_ground(c, 6, 12, 34, 12)
    spots = [(3, 8), (16, 3), (29, 7), (10, 15), (36, 1), (24, 16)][:n]
    for (x, y) in sorted(spots, key=lambda s: s[1]):
        w = rr.randint(7, 9)
        ch = rr.randint(1, w - 2) if rr.random() < .6 else None
        house(c, x, y, w, roof if rr.random() < .8 or not lit else 'wood', walls, chimney=ch, lit=lit)
        if smoky and ch is not None and rr.random() < .7:
            smoke(c, x + ch, y - 3)
    if 'well' in props:
        well(c, 22, 24)
    if 'hay' in props:
        haystack(c, 40, 22)
        haystack(c, 44, 24)
    if 'garden' in props:
        garden(c, 1, 24, 7, 4)
    fence(c, 0, 28, 14)
    fence(c, 32, 28, 16)
    if extra:
        extra(c)
    return c.done()


def lm_mill():
    c = Cv(26, 22)
    house(c, 2, 4, 10, 'thatch', rh=5)
    # koło wodne
    cx, cy, r = 18, 13, 6
    for yy in range(cy - r, cy + r + 1):
        for xx in range(cx - r, cx + r + 1):
            d = math.hypot(xx - cx, yy - cy)
            if r - 1.2 <= d <= r or (d < r and (abs(xx - cx) < .6 or abs(yy - cy) < .6 or abs((xx - cx) - (yy - cy)) < .7 or abs((xx - cx) + (yy - cy)) < .7)):
                c.p(xx, yy, '#7a5228' if d > r - 1.2 else '#5a3a1c')
    c.p(cx, cy, '#2a1a0e')
    return c.done()


def lm_shrine():
    c = Cv(12, 16)
    for yy in range(6, 15):
        c.p(5, yy, '#6a4624')
        c.p(6, yy, '#4a3018')
    house(c, 3, 2, 6, 'wood', door=False, rh=3)
    c.p(5, 6, '#e8d070')
    for (x, col) in [(2, '#e07a6a'), (9, '#f0e878'), (3, '#f4f0e6'), (8, '#c49ae6')]:
        c.p(x, 14, col)
    return c.done()


def lm_circle(n=9, rx=11, ry=5, rune=False):
    c = Cv(int(rx * 2 + 6), int(ry * 2 + 10))
    pts = sorted([(rx + 3 + rx * math.cos(a), ry + 6 + ry * math.sin(a)) for a in np.linspace(0, math.tau, n, endpoint=False)], key=lambda p: p[1])
    for (x, y) in pts:
        hgt = 4 if y > ry + 5 else 3
        for yy in range(int(y) - hgt, int(y) + 1):
            c.p(x, yy, STN[6] if yy == int(y) - hgt else STN[5])
            c.p(x + 1, yy, STN[2])
        if rune:
            c.p(x, int(y) - 2, '#7ae0ff')
    if rune:
        c.p(rx + 3, ry + 6, '#bff4ff')
        c.p(rx + 4, ry + 6, '#7ae0ff')
    return c.done(shadow=False)


def lm_watchtower():
    c = Cv(20, 36)
    tower(c, 6, 9, 8, 25, None, crenel=True)
    for xx in range(5, 15):
        c.p(xx, 7, '#6a4624')
        c.p(xx, 8, '#8a5e30')
    flag(c, 9, 0, '#c8282a')
    wall(c, 0, 30, 6, 4)
    wall(c, 14, 30, 6, 4)
    return c.done()


def lm_ruins():
    c = Cv(36, 24)
    dark = ['#2a2a32', '#3c3c46', '#50505c', '#66667a', '#7c7c90']
    for (x, h) in [(3, 12), (9, 7), (24, 10), (31, 5)]:
        for yy in range(22 - h, 22):
            c.p(x, yy, dark[3])
            c.p(x + 1, yy, dark[2])
            c.p(x + 2, yy, dark[1])
        c.p(x + 1, 22 - h + 3, '#6ae4ff')
    # łuk
    for a in np.linspace(math.pi, 0, 30):
        x, y = 18 + 6 * math.cos(a), 12 - 7 * math.sin(a)
        c.p(x, y, dark[3])
        c.p(x, y + 1, dark[2])
    for yy in range(12, 22):
        c.p(12, yy, dark[3])
        c.p(13, yy, dark[2])
        c.p(23, yy, dark[2])
        c.p(24, yy, dark[1])
    c.p(18, 6, '#aef4ff')
    for (x, y) in [(6, 21), (20, 21), (28, 20)]:
        c.p(x, y, dark[2])
        c.p(x + 1, y, dark[1])
    return c.done()


def lm_camp():
    c = Cv(30, 18)
    for (x, y) in [(3, 13), (9, 15), (22, 14), (26, 10), (5, 8)]:
        c.p(x, y, '#c8a070')
        c.p(x + 1, y, '#a87c48')
        c.p(x, y + 1, '#6a4624')
        c.p(x + 1, y + 1, '#5a3a1c')
    for i in range(4):
        for xx in range(12, 20):
            c.p(xx, 13 - i * 2 + (1 if i % 2 else 0), '#8a5e30' if xx % 3 else '#c8a070')
    # namiot
    for r in range(6):
        for xx in range(20 - r, 21 + r):
            c.p(xx + 2, 2 + r, '#a8a090' if xx < 20 else '#7e786c')
    c.p(22, 7, '#2a2018')
    c.p(14, 4, '#9a9a9a')
    return c.done()


def lm_chapel():
    c = Cv(26, 26)
    tower(c, 3, 6, 6, 18, 'grey')
    house(c, 9, 9, 14, 'grey', walls=['#5a5650', '#7a746a', '#948d80', '#aaa294'], rh=6)
    # dziury w dachu
    c.p(15, 10, '#1e1a16')
    c.p(16, 11, '#1e1a16')
    c.p(19, 12, '#1e1a16')
    return c.done()


def lm_hut(skulls=False, leg=False):
    c = Cv(28, 26)
    y0 = 4 if leg else 10
    house(c, 9, y0, 9, 'thatch', walls=['#5a4630', '#7a6040', '#927452', '#a88a62'])
    if leg:
        for yy in range(y0 + 8, 24):
            c.p(13, yy, '#c89a3a')
            c.p(14, yy, '#a87a2a')
        for xx in (11, 12, 15, 16):
            c.p(xx, 24, '#c89a3a')
    for xx in range(1, 27, 3):
        c.p(xx, 22, '#6a4624')
        c.p(xx, 21, '#6a4624')
        if skulls:
            c.p(xx, 20, '#e8e0cc')
    if not skulls:
        for (x, col) in [(3, '#c49ae6'), (5, '#f0e878'), (22, '#e07a6a'), (24, '#7ad0a0'), (20, '#f0e878')]:
            c.p(x, 18, col)
            c.p(x, 19, '#3e6024')
    return c.done()


def lm_cave():
    c = Cv(26, 18)
    castle_hill(c, 13, 3, 13, 14, 3, grass=False)
    for yy in range(6, 17):
        for xx in range(6, 21):
            d = ((xx - 13) / 7) ** 2 + ((yy - 17) / 10) ** 2
            if d < 1:
                c.p(xx, yy, '#120808' if d < .55 else '#3a1210')
    for (x, y) in [(12, 14), (13, 15), (14, 14), (13, 13)]:
        c.p(x, y, '#ff6a28')
    c.p(13, 14, '#ffd040')
    return c.done()


def lm_wagon():
    c = Cv(18, 10)
    for xx in range(2, 15):
        c.p(xx, 4, '#8a5e30')
        c.p(xx, 5, '#6a4624')
    for r in range(3):
        for xx in range(3 + r, 14 - r):
            c.p(xx, 3 - r, '#c8bea8' if xx < 9 else '#a89e88')
    for (x, y) in [(4, 7), (12, 7)]:
        c.p(x, y, '#3a2614')
        c.p(x + 1, y, '#3a2614')
        c.p(x, y - 1, '#5a3c20')
    return c.done()


def lm_sign(txt_col='#c8a070'):
    c = Cv(12, 14)
    for yy in range(3, 13):
        c.p(5, yy, '#6a4624')
    for xx in range(1, 11):
        c.p(xx, 3, txt_col)
        c.p(xx, 4, '#8a5e30')
    c.p(11, 3, txt_col)
    c.p(11, 4, '#8a5e30')
    return c.done()


def lm_scarecrow():
    c = Cv(9, 12)
    for yy in range(3, 11):
        c.p(4, yy, '#6a4624')
    for xx in range(1, 8):
        c.p(xx, 5, '#8a5e30')
    c.p(4, 2, '#e8c860')
    c.p(3, 2, '#c49a3a')
    c.p(5, 2, '#c49a3a')
    c.p(4, 1, '#5a3c20')
    c.p(4, 6, '#a84030')
    c.p(4, 7, '#a84030')
    return c.done()


def lm_big_barrow(door=True):
    spr = barrow(26, True, 9)
    if door:
        h, w = spr.shape[:2]
        for yy in range(h - 7, h - 2):
            for xx in range(w // 2 - 2, w // 2 + 2):
                spr[yy, xx, :3] = hexc('#120c08') if yy > h - 6 else hexc('#7e786c')
                spr[yy, xx, 3] = 255
    return spr


def lm_stilts():
    c = Cv(42, 26)
    for (x, y, w) in [(3, 4, 7), (16, 2, 8), (29, 5, 7), (10, 11, 7)]:
        house(c, x, y, w, 'thatch', walls=['#5a4630', '#7a6040', '#927452', '#a88a62'])
        for yy in range(y + 8, y + 12):
            c.p(x + 1, yy, '#4a3018')
            c.p(x + w - 2, yy, '#4a3018')
    for xx in range(0, 42):
        c.p(xx, 24, '#8a6a3a' if xx % 3 else '#6a4a28')
    return c.done()


def lm_ancient_oak():
    c = Cv(26, 26)
    for (x, y, r) in [(13, 9, 9), (6, 12, 6), (20, 12, 6)]:
        for yy in range(y - r, y + r):
            for xx in range(x - r, x + r):
                if (xx - x) ** 2 + ((yy - y) * 1.15) ** 2 < r * r:
                    lv = 3 - (xx - x) / r - (yy - y) / r + R.uniform(-.7, .7)
                    c.p(xx, yy, TREE_C[1][int(max(1, min(5, lv)))])
    for yy in range(17, 25):
        c.p(12, yy, '#3a2410')
        c.p(13, yy, '#2a1a0c')
    c.p(11, 24, '#3a2410')
    c.p(14, 24, '#2a1a0c')
    return c.done()


def lm_gorge():
    """wąwóz: ciemna szczelina z jasną krawędzią od góry"""
    def f(x, y):
        for i in range(140):
            t = i / 139
            gx, gy = x - 34 + t * 60, y - 14 + math.sin(t * 6) * 5 + t * 10
            wd = 2.5 + math.sin(t * math.pi) * 3
            for k in range(-6, 7):
                xx, yy = int(gx), int(gy + k)
                if not (0 <= xx < W and 0 <= yy < H):
                    continue
                if abs(k) <= wd - 1.5:
                    img[yy, xx] = hexc('#140f0c') if abs(k) < wd - 2.5 else hexc('#3a2c22')
                elif abs(k) <= wd:
                    img[yy, xx] = hexc('#8a7a64') if k < 0 else hexc('#4a3c30')
    return f


def lm_altar():
    """ołtarz Pustej Gwiazdy w Czarnym Borze"""
    c = Cv(30, 22)
    dark = ['#1e1c22', '#2e2a34', '#403a48', '#544c5e', '#6a6076']
    for (x, h) in [(3, 12), (25, 10)]:
        for yy in range(20 - h, 20):
            c.p(x, yy, dark[3])
            c.p(x + 1, yy, dark[2])
            c.p(x + 2, yy, dark[1])
    for yy in range(13, 19):
        for xx in range(8, 22):
            c.p(xx, yy, dark[3] if yy == 13 else dark[2] if xx < 18 else dark[1])
    # znak: pusty krąg z ośmioma promieniami
    cx, cy = 15, 7
    for a in np.linspace(0, math.tau, 24, endpoint=False):
        c.p(cx + 3 * math.cos(a), cy + 3 * math.sin(a), '#b070f0')
    for a in np.linspace(0, math.tau, 8, endpoint=False):
        c.p(cx + 5 * math.cos(a), cy + 5 * math.sin(a), '#7a40c0')
    for (x, y) in [(6, 20), (23, 20), (12, 20)]:
        c.p(x, y, '#d8d0bc')
        c.p(x + 1, y, '#d8d0bc')
    return c.done()


def lm_forge():
    """zatopiona kuźnia: kamienne ściany bez dachu, komin, kowadło, woda u stóp"""
    c = Cv(30, 24)
    for (x, h) in [(3, 9), (24, 7)]:
        for yy in range(20 - h, 20):
            for xx in range(x, x + 4):
                c.p(xx, yy, STN[4] if xx == x else STN[3] if xx < x + 3 else STN[2])
    for xx in range(3, 28):
        for yy in range(16, 20):
            c.p(xx, yy, STN[3] if yy == 16 else STN[2])
    for yy in range(4, 16):  # komin
        c.p(13, yy, STN[4])
        c.p(14, yy, STN[3])
        c.p(15, yy, STN[2])
    c.p(13, 3, STN[5])
    c.p(15, 3, STN[1])
    for (dx, dy) in [(0, 0), (1, 0), (2, 0), (3, 0), (1, 1), (2, 1)]:  # kowadło
        c.p(19 + dx, 14 + dy, '#3a3a40' if dy else '#6a6a74')
    for xx in range(0, 30):  # woda
        for yy in range(20, 24):
            if (xx + yy) % 5 or yy > 21:
                c.p(xx, yy, '#2f68b0' if yy > 21 else '#4a8cd0')
    return c.done(shadow=False)


def boats():
    c = Cv(9, 5)
    for xx in range(1, 8):
        c.p(xx, 3, '#6a4624')
    for xx in range(2, 7):
        c.p(xx, 4, '#4a3018')
    c.p(4, 0, '#e8e0cc')
    c.p(4, 1, '#e8e0cc')
    c.p(5, 1, '#c8c0ac')
    c.p(4, 2, '#5a3c20')
    return c.done(shadow=False)


def wisps(x, y):
    for (dx, dy) in [(-8, -6), (6, -10), (12, -2), (-3, -14)]:
        xx, yy = int(x + dx), int(y + dy)
        img[yy, xx] = hexc('#bff4ff')
        img[yy, xx + 1] = hexc('#5ac8e8')


def landmarks():
    L = {}
    L['weleszow'] = (lm_castle(), -4, 8)  # (sprite, przesunięcie w pionie, w poziomie)
    L['sanow'] = (lm_sanow(), -4)
    L['dabrowa'] = (lm_dabrowa(), -5)
    L['kregoszew'] = (lm_kregoszew(), -4)
    L['kurhanow'] = (lm_kurhanow(), -6)
    birch = [hexc(h) for h in ('#3e5a24', '#567a2e', '#6e9638', '#88b046', '#a4c858')]
    L['brzezina'] = (lm_village(11, 4, 'thatch', extra=lambda c: [tree_c(c, x, y, 4, birch, seed=x) for (x, y) in ((44, 8), (2, 3))]), -6)
    L['olszynow'] = (lm_village(12, 4, 'thatch', props=('hay', 'well'), extra=lambda c: windmill(c, 43, 0)), -6)
    L['wschodnia'] = (lm_village(13, 4, 'slate', PLS_S, extra=lambda c: tower(c, 41, 6, 6, 18, None, crenel=True), props=('well', 'garden')), -6)
    L['ustronie'] = (lm_village(14, 4, 'grey', PLS_G, props=('garden',), lit=False, smoky=False), -6)
    L['mokradla'] = (lm_stilts(), -5)
    L['mlyn'] = (lm_mill(), -6)
    L['kapliczka'] = (lm_shrine(), -6)
    L['krag'] = (lm_circle(8, 9, 4), -7)
    L['polana'] = (lm_circle(10, 12, 5, True), -7)
    L['straznica'] = (lm_watchtower(), -6)
    L['ruiny'] = (lm_ruins(), -6)
    L['wyrab'] = (lm_camp(), -6)
    L['kaplica'] = (lm_chapel(), -6)
    L['jagna'] = (lm_hut(), -5)
    L['chata'] = (lm_hut(True, True), -5)
    L['puszcza'] = (lm_ancient_oak(), -6)
    L['czarnybor'] = (lm_altar(), -6)
    L['kuznia'] = (lm_forge(), -4)
    L['trakt'] = (lm_wagon(), -6)
    L['kurhany'] = (lm_big_barrow(), -6)
    L['kurhan'] = (lm_big_barrow(False), -6)
    L['jama'] = (lm_cave(), -6)
    L['poludnie'] = (lm_sign(), -6)
    L['pola'] = (lm_scarecrow(), -6)
    L['martwe'] = (BONES, -6)
    return L


# ================================================================ main
def main():
    import time
    t0 = time.time()
    debug = '--debug' in sys.argv
    M = build_masks()
    paint_ground(M)
    paint_cracks(M)
    paint_water(M)
    busy = np.zeros((H, W), bool)
    keep = node_area()
    rm = paint_roads(M)
    roadk = ndimage.binary_dilation(rm, iterations=2)
    busy |= roadk
    paint_farms(M, busy)
    paint_swamp(M, busy | keep)
    place_hills(M, keep | busy)
    paint_details(M, busy | keep)
    rw = ndimage.binary_dilation(rm, structure=np.ones((1, 9), bool))
    band = rw.copy()
    for dy in range(-2, 19):
        band |= np.roll(rw, dy, axis=0)
    L = landmarks()
    lmk = np.zeros((H, W), bool)  # prostokąty rysunków miejsc (+ zasięg koron drzew pod nimi)
    for k, v in L.items():
        if k in NODES:
            spr, dy, dx = (v + (0,))[:3]
            x, y = NP(k)
            sh, sw = spr.shape[:2]
            x0, x1 = int(x + dx - sw / 2) - 3, int(x + dx + sw / 2) + 3
            y0, y1 = int(y + dy - sh * .8), int(y + dy + 18)
            lmk[max(0, y0):max(0, y1), max(0, x0):max(0, x1)] = True
    nofor = keep | M['water'] | busy | band | lmk
    # tam, gdzie w lesie nie wyrosną drzewa (przy drogach i miejscach), zamiast gołej ściółki – trawiasta przesieka
    fr = M['forest'] & (band | keep | lmk) & ~rm & ~M['water']
    gr = GRASS[np.clip(tone(N2 * .6 + N3 * .4, 6, .7) - 2, 0, 3)]
    img[fr] = gr[fr]
    plant_trees(M, nofor)
    in_mnt = [k for k, nd in NODES.items() if nd['ty'] == 'site' and M['mount'][int(NP(k)[1]), int(NP(k)[0])]]
    lmk_m = np.zeros((H, W), bool)  # góry nie zasłaniają rysunków miejsc u podnóża (wieża, wieś, kaplica)
    for k, v in L.items():
        if k in NODES and k not in in_mnt:
            spr, dy, dx = (v + (0,))[:3]
            x, y = NP(k)
            sh, sw = spr.shape[:2]
            lmk_m[max(0, int(y + dy - sh)):int(y + dy + 6), max(0, int(x + dx - sw / 2 - 2)):int(x + dx + sw / 2 + 2)] = True
    raise_mountains(M, node_area(skip=in_mnt) | ndimage.binary_dilation(rm, iterations=2) | lmk_m)  # drogi górskie i tak rysujemy na wierzchu
    place_barrows(M, keep | busy)
    for k, v in L.items():
        if k in NODES:
            spr, dy, dx = (v + (0,))[:3]
            x, y = NP(k)
            top = 1000 if M['mount'][int(y), int(x)] else 0  # w górach: nad szczytami
            add(y + dy + 1 + top, lambda s=spr, x=x + dx, y=y + dy: blit(s, x, y))
    if 'jary' in NODES:
        x, y = NP('jary')
        lm_gorge()(x, y - 4)
    for (bx, by) in [(60, 51), (64, 52.5), (52, 51.5)]:
        x, y = P(bx, by)
        add(y, lambda x=x, y=y: blit(boats(), x, y))
    print('obiekty', len(OBJS), round(time.time() - t0, 1), 's')
    for _, _, fn in sorted(OBJS, key=lambda o: (o[0], o[1])):
        fn()
    # drogi przez góry: na wierzchu skał (ścieżka wije się po zboczach)
    mz = rm & ndimage.binary_dilation(M['mount'], iterations=6) & ~M['water']
    rc = pal('#7e6238', '#9c7c48', '#b49456', '#c8aa6a')[tone(N3, 4, .9)]
    me = ndimage.binary_dilation(mz) & ~mz & ndimage.binary_dilation(M['mount'], iterations=6)
    img[me] = (img[me] * .6).astype(np.uint8)
    img[mz] = rc[mz]
    if 'bagno' in NODES:
        wisps(*NP('bagno'))
    paint_mist(M)
    out = os.path.join(ROOT, 'assets/maps/velesia-big.png')
    Image.fromarray(img).quantize(256, method=Image.Quantize.MAXCOVERAGE, dither=Image.Dither.NONE).save(out, optimize=True)
    print('zapisano', out, os.path.getsize(out) // 1024, 'KB', round(time.time() - t0, 1), 's')
    write_roads()
    if debug:
        os.makedirs(os.path.join(ROOT, 'tools/out'), exist_ok=True)
        big = Image.fromarray(img).resize((W * 2, H * 2), Image.NEAREST)
        d = ImageDraw.Draw(big)
        for k, nd in NODES.items():
            x, y = P(nd['x'], nd['y'])
            d.ellipse([x * 2 - 4, y * 2 - 4, x * 2 + 4, y * 2 + 4], outline=(255, 0, 0), width=2)
            d.text((x * 2 + 6, y * 2 - 6), k, fill=(255, 255, 255))
        big.save(os.path.join(ROOT, 'tools/out/velesia-debug.png'))


if __name__ == '__main__':
    main()
