#!/usr/bin/env python3
"""Obiekty w komnatach wyprawy i dekoracje (GFX.P) z eksportów PixelLab w tools/art/props/.

Każdy obiekt to tools/art/props/<klucz>.png albo – animowany – folder tools/art/props/<klucz>/ z klatkami
frame_*.png. Obrazek jest przycinany do zawartości i zapisywany jako assets/objects/<klucz>.webp
(animacja: poziomy pasek klatek). Lista trafia do js/data/props.js (GFX.P) razem z dawnymi obiektami
narysowanymi wcześniej (OLD – ich pliki już są w assets/objects/).

Rozmiar w GFX.P (w, h) jest „logiczny”: w pikselach postaci (bohater ma 46×90), czyli
wycięty obraz × skala k z tabeli niżej. Gra mnoży go przez skalę sceny (js/expedition/expedition.js).

    python3 tools/props.py

Wymaga: Python 3, Pillow.
"""
import glob, json, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'tools/art/props')

# dawne obiekty (pliki 3× większe niż rozmiar logiczny)
OLD = {
    'shrine': (42, 46), 'wanderer': (36, 44), 'trap': (26, 16), 'gate': (74, 72),
}
# klucz: skala k; ms – czas pętli animacji
K = {
    # skrzynie (drewniana, runiczna, omszała kamienna, żelazna) i te same otwarte (_o – po otwarciu)
    'skrz_drewno': .5, 'skrz_runy': .5, 'skrz_mech': .5, 'skrz_zelazo': .5,
    'skrz_drewno_o': .5, 'skrz_runy_o': .5, 'skrz_mech_o': .5, 'skrz_zelazo_o': .5,
    # studnie, obóz (animowany ogień), porzucony namiot
    'studnia1': .9, 'studnia2': .9, 'studnia3': .9, 'studnia4': .9, 'studnia5': .9,
    'oboz': 1.3, 'namiot': 1.2,
    # kurhan i grobowce (wydarzenia, wejście do krypty bossa, dekoracje Kurhanów)
    'kurhan': 1.3, 'grobowiec': 1.1, 'krypta': 1.2,
    'ruina': 1.1, 'mauzoleum': 1.1, 'kaplica': 1.15, 'sarkofag': 1.0, 'grobowiec2': 1.15,
    # drzewa (duże dekoracje)
    'drz_dab': 2.3, 'drz_swierk': 2.3, 'drz_pien': 1.3, 'drz_omszaly': 2.3, 'drz_brzoza': 2.2, 'drz_jesien': 2.2,
    'drz_wierzba': 2.2, 'drz_korzenie': 2.2, 'drz_bagienny': 2.2, 'drz_martwy': 2.2, 'drz_czar': 2.2,
    'drz_snieg': 2.2, 'drz_wisnia': 2.0,
    # Smocza Jama: żebra smoka, dymiące kominy lawy, obsydian, kryształy (duże), skały z lawą i złoto (małe)
    'jama_zebra1': 1.3, 'jama_zebra2': 1.3, 'jama_komin1': 1.2, 'jama_komin2': 1.2,
    'jama_obsydian1': 1.15, 'jama_obsydian2': 1.15, 'jama_obsydian3': 1.15,
    'jama_krysztal1': 1.0, 'jama_krysztal2': 1.0, 'jama_krysztal3': 1.0,
    'jama_lawa1': .85, 'jama_lawa2': .85, 'jama_lawa3': .85, 'jama_zloto1': .8, 'jama_zloto2': .8, 'jama_zloto3': .8,
}
# groby i krzaki (małe dekoracje; groby także na liście poległych)
for i in range(1, 17):
    K['grob%d' % i] = .85
for k in ['krz_gaszcz', 'krz_jarzebina', 'krz_placzacy', 'krz_suchy', 'krz_suchy2', 'krz_bukszpan', 'krz_biale',
          'krz_ciemny', 'krz_fiolet', 'krz_pomarancz', 'krz_paproc', 'krz_paproc2', 'krz_okragly', 'krz_jesien',
          'krz_pnacza', 'krz_trawa']:
    K[k] = .85
MS = {'oboz': 1100}
# obrazki przycinane wspólną ramką (skrzynia zamknięta i otwarta stoją w tym samym miejscu)
SAME = [('skrz_drewno', 'skrz_drewno_o'), ('skrz_runy', 'skrz_runy_o'), ('skrz_mech', 'skrz_mech_o'), ('skrz_zelazo', 'skrz_zelazo_o')]


def frames(k):
    d = os.path.join(SRC, k)
    if os.path.isdir(d):
        return [Image.open(p).convert('RGBA') for p in sorted(glob.glob(os.path.join(d, 'frame_*.png')))]
    return [Image.open(os.path.join(SRC, k + '.png')).convert('RGBA')]


def main():
    out = {k: {'w': w, 'h': h, 'u': 'assets/objects/%s.webp' % k} for k, (w, h) in OLD.items()}
    for k, sc in K.items():
        fr = frames(k)
        grp = next((g for g in SAME if k in g), (k,))
        bb = fr[0].getbbox()
        for f in fr[1:] + [f for g in grp if g != k for f in frames(g)]:
            b = f.getbbox()
            bb = (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
        fw, fh = bb[2] - bb[0], bb[3] - bb[1]
        im = Image.new('RGBA', (fw * len(fr), fh))
        for i, f in enumerate(fr):
            im.alpha_composite(f.crop(bb), (i * fw, 0))
        p = 'assets/objects/%s.webp' % k
        im.save(os.path.join(ROOT, p), 'WEBP', lossless=True, quality=100, method=6)
        e = {'w': round(fw * sc, 1), 'h': round(fh * sc, 1), 'u': p}
        if len(fr) > 1:
            e.update(n=len(fr), ms=MS.get(k, 900))
        out[k] = e
    src = ('/* ===== GFX.P – obiekty w komnatach wyprawy i dekoracje (js/expedition/expedition.js), groby poległych =====\n'
           '   Wygenerowane przez tools/props.py z tools/art/props/ – nie edytuj ręcznie.\n'
           '   w×h – rozmiar logiczny (piksele postaci), u – obrazek; animacja: n klatek w poziomym pasku, ms – czas pętli. */\n'
           'GFX.P={\n' + ',\n'.join(' %s:%s' % (json.dumps(k), json.dumps(v, separators=(',', ':'))) for k, v in out.items()) + '\n};\n')
    open(os.path.join(ROOT, 'js/data/props.js'), 'w', encoding='utf-8').write(src)
    print('zapisano js/data/props.js:', len(out), 'obiektów')


if __name__ == '__main__':
    main()
