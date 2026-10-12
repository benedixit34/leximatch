# German Express

A German-vocabulary matching game: travel across five cities (Vienna, Berlin, Munich,
Hamburg, Honolulu), flip cards or drag pictures onto their German words, hear the
pronunciation, and earn stars, coins and gems. Next.js (App Router) + TypeScript + Tailwind CSS.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm test         # gameplay tests (vitest + jsdom)
```

## Project structure

```
src/
  app/
    layout.tsx        fonts (Fredoka), viewport, metadata
    page.tsx          renders <Game />
    globals.css       Tailwind + card flip/shake/pop CSS + city background themes
  components/
    Game.tsx          shell: picks map/game screen + background theme, mounts modals
    MapScreen.tsx     travel map, city pins, mascot
    GameScreen.tsx    HUD, matched tray, card grid, drag & drop
    Card.tsx          one flippable card (word or picture)
    Modals.tsx        Pause, Trophy stats, Victory, Toast
  hooks/
    useGame.ts        ALL game state + rules (matching, timer, stars, unlocks, hints, music hooks)
  data/
    cities.ts         the 5 cities, their vocabulary pairs, map positions  <- edit to add content
  lib/
    types.ts, utils.ts
    audio/
      music.ts        procedural background music (one tune per screen, Web Audio)
      sfx.ts          flip / match / error / victory sounds
      speech.ts       German text-to-speech (Web Speech API)
      index.ts        lazy singleton + speak() that ducks the music
tests/                gameplay tests
```

## Adding a city or words

Add an entry to `src/data/cities.ts` (6 pairs, a `pin`/`mascot` position on the map, a `theme`).
For a new theme, add a `.bg-theme-<name>` rule in `globals.css` and a tune in
`MUSIC_THEMES` (`src/lib/audio/music.ts`), then extend `ThemeId` / `MusicMode`.

## Background art

The six background images are referenced as CSS variables (`--img-map`, `--img-vienna`, ...)
at the top of `src/app/globals.css`, currently pointing at their hosted URLs.
To serve them yourself, save the images to `public/assets/` and change each variable to
e.g. `url('/assets/bg-vienna.png')`.

## Notes

- Browsers block audio until the first tap, so music starts on the first pointer/key event.
- Audio engines are created lazily in the browser (`getAudio()`), never during server render.
- Fonts load via `<link>` in `layout.tsx`; swap to `next/font/google` if you prefer self-hosting.
