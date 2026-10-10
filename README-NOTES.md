# Sigamos intro: notes for the game developer

`intro.html` is a **visual mock only**. It has no game logic. Reseña and Examen open placeholder screens. Your job is to move this look and timing into the real game. Do not redesign it.

## Files
- `intro.html`: all CSS and JS for the mock (single file, no build step). It is named `intro.html` so it never overwrites the game's `index.html`.
- `assets/intro-audio/`: the sounds the owner chose.
- `assets/intro-images/`: photo cards (Interior, Cluster, Car Body) and the two hand sprites.

Extract everything next to the game's `index.html` and open `intro.html` with Live Server. Keep the folder structure.

## Look
- Page background is the game's exact hearts wallpaper (`body` CSS copied as-is).
- Colours, ink and shadow come from the game's `style.css` (`--pink`, `--hot`, `--ink`, `--shadow`, red/yellow/blue cards).
- The logo copies the game's `.fan-title` look (white, red outline, stacked shadow) but sized in `em`, so it scales cleanly when it shrinks.
- Hand sprites (`hand-click.webp`, `hand-swipe.webp`) are the owner's icons8 GIFs redrawn smooth (10x upscale, transparent, white fill, `--ink` outline). Animated WebP, same frame timing as the GIFs.
- **There is no cabinet or shelf.** The owner removed it.

## Sequence (ms after the first tap)
| When | What | Sound |
|---|---|---|
| 0 | Dark pink screen stays. Sigamos logo and the 3 cards (blue, yellow, red) fade in. | `sparkle-intro.wav` (3.0s) |
| sparkle ends (fallback 3400) | Logo fades out. 40 hearts and stars burst from the centre. | `bg-nahuhulog.mp3` starts, loop, **volume 0.2 for the rest of the session** |
| +0 to +2400 | Uno-style swirl: the cards orbit and spin, then shrink into a small fan in the middle. Pink darkness lifts at +1500. | |
| +2400 | Logo fades back in on top of the cards. Hold 1400. | |
| +3800 | Logo slides up and shrinks into the header spot (1100). At the same time the 3 colour cards are flicked down off the screen, red, yellow, blue, 150 apart. | riffle (random carousel sound) |
| +4600 | Photo cards slide in from the right, order right, middle, left, 460 apart. | `card-place-1.wav` or `card-place-2.mp3`, random per card |
| after last card | Middle card grows. "Desliza" hint appears (swipe hand sprite). | |
| first swipe or tap on a card | Hint hides. The page moves up 8dvh. Reseña and Examen fade in. | swipe: random carousel sound |
| tap the centre card | Small bounce. | `bell-service.wav` |
| Reseña or Examen tapped | Everything slides down and the screen swaps. | carousel sound `carousel-pick-3` |
| ← Inicio | Screen fades and everything slides back up. | carousel sound `carousel-pick-2` |

## Carousel sounds (3, random)
`carousel-pick.mp3`, `carousel-pick-2.mp3` (owner's new freesound card sound), `carousel-pick-3.mp3`. Each swipe picks one at random, never the same one twice in a row, with a small random speed change. `GAIN` in the JS evens out their loudness.
`carousel-pick-3.mp3` is a **synthesized card-riffle placeholder** made for this mock. Swap in any real recording with the same name.

## Rules that matter
- **Browsers block sound until a tap.** The dark pink "Toca para empezar" button is the required first tap. `unlock()` also plays every other sound muted once during that tap so iOS Safari allows them later. Keep both.
- The pick colour (blue, yellow, red) follows the centre card through the CSS variable `--pick`. Buttons and borders use it.
- Card order is fixed: Interior (blue), Cluster (yellow), Car Body (red). Swiping loops. Arrow keys also work.
- Car Body has **no game content yet**. Its card is a placeholder.
- `prefers-reduced-motion` is respected (no burst, no swirl, no flick, plain fades). The animated WebP hands cannot be paused by CSS.
- Motion and timings are set inline in the JS (`start()`, `swirl()`, `burst()`, `dockLogo()`, `flick()`) and in the `transition` values in the CSS.

## Integrating
- Replace the home screen (photo plus Interior/Cluster buttons) with this intro.
- The carousel's centre card (`idx`) replaces the old `state.section`. The Reseña and Examen buttons should call the existing start-review and start-exam functions with that section.
- Replace the placeholder screens in the `.mode` click handler with the real game screens. Reuse the slide-down transition.
- Keep the game's existing sounds. If the game and the intro both play `Nahuhulog`, keep one instance only.

## Assumptions to confirm with the owner
- The tap-a-card bell is `bell-service.wav` (from the existing sounds.js). `bell-happy.wav` is included as an alternative.
- The card subtitles ("Adentro del carro", "Tablero de instrumentos", "Por fuera del carro") are placeholders.
- Baloo 2 loads from Google Fonts. Offline it falls back to the system font.

## Ajustes (inside intro.html, no separate page)
- Red **Ajustes** cards sit at both ends of the carousel. Tap the centred one, or the "Ajustes" button that replaces Reseña/Examen, to open the screen. "← Inicio" closes it.
- The screen has a record player (vinyl spins while music plays, tonearm moves in, the cover art is the record label), play/pause, previous/next, seek bar, a **Biblioteca** dropdown, and separate Música / Efectos volume sliders (saved in localStorage).
- The "..." (more) button is there but disabled for now.
- **Add music:** drop the file in `assets/music/`. `loadMusicFolder()` in `intro.html` reads the folder listing from the server (Live Server etc.), or `assets/music/playlist.json` (made by `update-music.js`/`.bat`/`.command`) when the host gives no listing, and appends every audio file to `TRACKS` after the built-in Nahuhulog. `Artist - Title.mp3` sets artist/title; a same-named image is the cover. With 2+ tracks it plays the next one automatically. Default cover: `assets/intro-images/cover-default.svg`.
- The roulette shows only its top 30% at the bottom of the screen (see `layout()`).

## v7: Dirección connected + Eye transitions (Interior and Señales only)
- `games/direccion/` is the Listening Exam (its own tutorial and 3-2-1-GO, untouched) wired to the Dirección card with `games/direccion/bridge.js` (exit, Música universal, Win all / Lose all). The only change in `intro.html` is `game:'games/direccion/index.html'` on the Dirección card.
- `games/shared/sigamos-eye.js` = the Eye (two lids, door-slide on open, door-close on shut) + the pink "how it works" card (intro-overlay.txt). Loaded in `<head>` by Interior and Señales.
- Interior / Señales `bridge.js` do the wiring: page start = eye opens; Examen = eye shuts, pink dim, eye opens, 3-2-1-GO; Reseña = eye shuts, pink dim, eye opens, how-it-works card, Listo?; Inicio = eye shuts, then back to Sigamos.
- In each bridge: `SHOW_TUTORIAL` (false = no card) and `SHOW_ONCE` (true = card only the first time).
- Eye speed/shape: top of `sigamos-eye.js` (`OPEN_MS`, `SHUT_MS`, `LID_H`, `RISE`).

## v8: Cluster and Car Body connected
- `games/cluster/` (Instrument Cluster) and `games/carbody/` (Car Body) each have a `bridge.js` (exit to Sigamos, ?mode=review|quiz, Win all / Lose all). Their own eye, Reseña overlay and 3-2-1-GO are untouched.
- `intro.html`: only `game:'games/cluster/index.html'` and `game:'games/carbody/index.html'` were added to the two cards.
