# Eldaria – project structure

The game used to be one 9 MB `index.html`. It is now split into code, styles and image files.
It plays exactly the same as before.

## How to run

- **On a computer:** double-click `index.html`. It works straight from disk, no server needed.
- **Android app:** every merge into `main` builds `Eldaria.apk` (`.github/workflows/android.yml`) and attaches it
  to a new GitHub Release. Download it on the phone and open it to install; a new version installs over the old
  one and keeps the save. The app (`android/`) is a full-screen WebView that loads the game files from inside the
  APK – the same way as opening `index.html` from disk. The back button acts like Esc.
  `android/eldaria.keystore` (password `eldaria`) signs these sideloaded builds so updates keep working; a Google
  Play release would need a new, secret key.
- **Web app (PWA):** every merge into `main` also publishes the game to GitHub Pages (`.github/workflows/pages.yml`,
  needs Settings → Pages → Source: GitHub Actions). There it can be installed from the browser ("Install app" /
  "Add to Home Screen") and plays offline: `js/core/pwa.js` adds `manifest.webmanifest` and the service worker
  `sw.js` (file list and version written by `tools/pwa_files.py` at publish time). Opened from disk it does nothing.
  App icons: `tools/make_icons.py`.
- **On a phone or to share it:** upload the whole folder to any static web host
  (GitHub Pages, Netlify, itch.io as an HTML5 zip, …) and open the link.
  Keep the folder structure as it is.

## What is where

```
index.html            page skeleton + the list of files to load (the ORDER matters)
css/                  styles – plain CSS inside css`…` (see "Styles" below)
js/
  core/               screen scaling, mouse/keyboard, small helpers, settings
  data/               game data: classes, enemies, items, skills, image lists, sprite sheets
  gfx/sprites.js      building hero/enemy sprites from layers, icons
  game/               game state & saving, hero fate (injuries, death), button actions
  ui/                 camp, formation, hero screen, armory, touch/click handling
  battle/             battle logic and battle screen layout
  expedition/         expeditions (branching map with fog, rooms, events)
  town/               town, buildings and services (phase 1 and 2)
  world/              world map, Velesia map, towns, travel, new beasts
  story/              reputation, quests (incl. the Act I campaign), dialogs, journal, unique companions
  audio/sound.js      sound effects and music
  main.js             starts the game – must stay LAST
tools/
  velesia_map.py      draws the Velesia map (assets/maps/velesia-big.png) – see "Velesia map" below
assets/
  fonts/              Pixelify Sans (SIL Open Font License 1.1)
  ui/                 frames, buttons, textures, emblem
  backgrounds/        battle backgrounds (far / mid / ground layers)
  maps/               world map, Velesia map (velesia-big.png, generated), regions map
  towns/              town panoramas and town scenes
  buildings/          building pictures shown at the top of each town service
  portraits/          NPC portraits
  objects/            chests, camp, shrine… shown in expedition rooms
  events/             event illustrations
```

## Class sprites

Heroes use hand-made sprites, one per class and gender (PixelLab exports in `tools/art/classes/<class>/`
for men and `tools/art/classes/<class>_k/` for women).
`tools/class_sprites.py` (Python 3 with numpy and Pillow) turns each export – the east-facing pose
and the 8-frame east walk – into the game's 7-frame battle strip (stand, breathe, wind-up, strike,
cast, hit, down) and writes `js/data/sprites-classes.js` (`CSPR`). `heroAnim` in `js/gfx/sprites.js`
uses it for every hero without a unique look (`heroSkin` in `js/game/state.js`: only unique companions
keep their own sprite); a class without a folder would fall back to the old layered sprites. To add or replace a class: put its export in
`tools/art/classes/<class>/` and run `python3 tools/class_sprites.py` (`--debug` for a preview in `tools/out/`).

Unique companions recruited through personal quests (Ignacy, Tymek, Nela, Karolina) live in
`tools/art/companions/` – the tool also writes their dialog portraits to `assets/portraits/` – and the druid's
bear form in `tools/art/forms/niedzwiedz/` (112 px frames; shown in battle while the `bear` status lasts).

## Rules for editing

1. **Script order matters.** All `js/` files share one global scope, just like the old single file.
   A file can only use, at load time, what was defined in files above it in `index.html`.
   A new file gets its own `<script>` line in the right place in `index.html`, before `js/main.js`.
2. **Every function and data table is defined in one place.** To change behaviour, edit the original
   definition. Don't add a later file that replaces or wraps it (`const _f=f; f=function(){…}`) or
   `Object.assign`s into another file's data: that is how the old single file grew hard to follow.
   The one exception is `js/audio/sound.js`, which hooks sound effects onto a few game functions
   so that all sound stays in one file.
3. **The game starts in `js/main.js`.** It waits until every file, sprite, the font and all images are loaded,
   then shows the first screen.
4. **Styles.** Each `css/*.css.js` file is normal CSS wrapped in `` css`…` ``. Edit it like any CSS.
   They are not plain `.css` files on purpose: on large monitors the game rescales its `@media`
   rules by rewriting the style text (`scaleMQ` in `js/core/viewport.js`), and browsers don't let
   scripts read separate `.css` files when the game is opened from disk. The order of these files
   in `index.html` is the CSS cascade order.
5. **Images.** To change a picture, replace the file in `assets/` and keep its name.
   Image lists live in `js/data/art.js` (maps, panoramas, portraits), `js/data/gfx-misc.js`
   (buildings, room objects) and `css/assets.css.js` (frames, textures, battle backgrounds).
6. **Sprite sheets stay inside JS.** Hero layers, enemies, icons, battle effects, unique heroes and
   class sprites (`js/data/gfx-heroes.js`, `gfx-enemies.js`, `gfx-misc.js`, `sprites-v19.js`,
   `sprites-classes.js`) are still stored
   as base64 text. The game reads their pixels to tint and combine layers, and browsers block that
   for separate image files opened from disk. These files are generated data: replace whole entries
   rather than editing them by hand.

## Velesia map

`assets/maps/velesia-big.png` is pixel art drawn by code: `tools/velesia_map.py` (Python 3 with numpy,
scipy and Pillow – only needed to redraw the map, not to play). It reads place positions and roads from
`NODES`/`EDGES` in `js/world/world-map.js` and the secret places from `SECRET` in `js/world/velesia-map.js`,
so towns, roads and pins always line up. The landscape (rivers, forests, mountains, fields) and the
drawing of each place (`landmarks()`) are in the script.

It also writes `js/data/velesia-roads.js` (`ROADS`): the shape of every road, which the company walks
along when travelling and which the dashed lines to secret places follow.

To add a place: add it to `NODES` (and roads to `EDGES`), give it a drawing in `landmarks()` if it needs
one, then run `python3 tools/velesia_map.py` (add `--debug` for a labelled preview in `tools/out/`).
The map is 1024×640; the game shows it scaled without smoothing, 2 screen pixels per map pixel by default.

## History

**Cleanup (October 2026).** Over many versions, later code had been patching earlier code:
functions replaced or wrapped from other files, data tables overwritten after they were defined.
All of that was merged into the original definitions, and code that could never run (the old town
map and its animation, the old camp town view, unused building pictures) was removed.
Behaviour is unchanged: checked side by side against the previous version with repeatable
randomness (game data, each merged function, forced battles and a long playthrough).

**Split from the single file.** Every line of game code was copied unchanged. The only differences:

- Embedded images and the font are now real files in `assets/` (same bytes, same pictures).
  Older portrait versions that the game always overwrote were not kept.
- `loadGfx().then(render)` became `const GAME_BOOT=loadGfx()` in `js/ui/input.js`;
  the first `render()` now happens in `js/main.js`, after every file is loaded.
- A stray `'use strict'` from the middle of the old script was removed. It did nothing there,
  but at the top of a separate file it would have switched that file to strict mode.
- `scaleMQ` (in `js/core/viewport.js`) now finds the game's styles by id (`eldaria-css`) instead of
  taking the first `<style>` on the page, so it still works when the game is embedded in another page.
- Saves use the same keys and format as before.
