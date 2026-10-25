#!/usr/bin/env python3
"""Ikony aplikacji (strona instalowana na telefonie i aplikacja na Androida).

Herb Velesii (assets/ui/emblem.png) powiększony bez wygładzania na tle nieba z ekranu tytułowego.
Wynik: assets/icons/icon-{192,512}.png, icon-maskable-512.png (z marginesem bezpieczeństwa),
apple-touch-icon.png (180) i ikony Androida w android/app/src/main/res/mipmap-*/.

    python3 tools/make_icons.py
"""
import os
from PIL import Image, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EMB = Image.open(os.path.join(ROOT, 'assets/ui/emblem.png')).convert('RGBA')
SKY = Image.open(os.path.join(ROOT, 'assets/backgrounds/title-far.webp')).convert('RGB')


def icon(size, emb_frac=.72):
    """kwadrat: tło + herb o wysokości emb_frac rozmiaru (całkowita skala pikseli)"""
    w, h = SKY.size
    side = min(w, h)
    bg = SKY.crop(((w - side) // 2, 0, (w - side) // 2 + side, side)).resize((size, size), Image.LANCZOS)
    bg = ImageEnhance.Brightness(bg).enhance(.55)
    k = max(1, int(size * emb_frac / EMB.height))
    e = EMB.resize((EMB.width * k, EMB.height * k), Image.NEAREST)
    # cień pod herbem
    sh = Image.new('RGBA', e.size, (0, 0, 0, 0))
    sh.paste((0, 0, 0, 150), (0, 0), e)
    out = bg.convert('RGBA')
    x, y = (size - e.width) // 2, (size - e.height) // 2
    out.alpha_composite(sh, (x + max(1, k // 2), y + k))
    out.alpha_composite(e, (x, y))
    return out.convert('RGB')


def main():
    d = os.path.join(ROOT, 'assets/icons')
    os.makedirs(d, exist_ok=True)
    icon(192).save(os.path.join(d, 'icon-192.png'), optimize=True)
    icon(512).save(os.path.join(d, 'icon-512.png'), optimize=True)
    icon(512, .5).save(os.path.join(d, 'icon-maskable-512.png'), optimize=True)   # Android przycina do koła
    icon(180).save(os.path.join(d, 'apple-touch-icon.png'), optimize=True)
    res = os.path.join(ROOT, 'android/app/src/main/res')
    for name, s in (('mdpi', 48), ('hdpi', 72), ('xhdpi', 96), ('xxhdpi', 144), ('xxxhdpi', 192)):
        p = os.path.join(res, 'mipmap-' + name)
        os.makedirs(p, exist_ok=True)
        icon(s, .62).save(os.path.join(p, 'ic_launcher.png'), optimize=True)
    print('zapisano ikony w assets/icons/ i android/app/src/main/res/')


if __name__ == '__main__':
    main()
