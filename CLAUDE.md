# Eldaria – notes for Claude

Polish-language pixel-art RPG for phones (landscape) and desktop. Plain HTML/CSS/JS, no build step,
no dependencies. Code comments and all in-game text are in Polish; keep it that way.
`README.md` has the full folder map.

## Hard rules

- **Must work opened straight from disk (`file://`).** No ES modules, no `fetch()` of local files,
  no reading pixels of image files. Everything is classic `<script src>` tags in `index.html`.
- **Script order in `index.html` matters.** All files share one global scope (like the old single file).
  Top-level code may only use what earlier files defined. `js/main.js` stays last; it starts the game.
- **Styles live in `css/*.css.js`** as plain CSS inside `` css`…` `` (see `css/_css.js` for why).
  They build one `<style id="eldaria-css">`, which `scaleMQ` in `js/core/viewport.js` rewrites
  on large screens. Order of these files = cascade order.
- **Sprite sheets stay base64** in `js/data/gfx-*.js` and `js/data/sprites-v19.js`: the game reads
  their pixels (tinting, layer composition), which browsers block for image files on `file://`.
  All other images are files in `assets/`, listed in `js/data/art.js`, `js/data/gfx-misc.js`
  and `css/assets.css.js`.
- **Saves:** `localStorage` key `kompania_smialkow_v1`, version `SAVE_VER` with `migrate()` in
  `js/game/state.js`. When the save shape changes, bump `SAVE_VER` and add a migration; never break old saves.
- Avoid `alert`/`confirm`/`prompt`: the game is also played inside a sandboxed frame where they don't work.

## Checking changes

Open `index.html` in Chromium (Playwright is available in Claude's cloud workspace) and play the
affected screens; watch the console for errors. Test at desktop size (e.g. 1920×1080, where the UI
zooms and `scaleMQ` rescales `@media` rules) and at phone landscape (e.g. 844×390 with touch).
