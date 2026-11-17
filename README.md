# Strands Box slides

Five slides introducing native isolation and semantic policy in Strands Box.
Edit `slides.md`; `---` separates slides. HTML inside the Markdown controls diagrams
and layouts. Presenter notes are the HTML comments at the end of each slide.

## Run

Requires Node.js 22.22 or newer.

```sh
npm ci
npm run dev
```

Open the local address printed by Slidev. Use the arrow keys to change slides,
`f` for fullscreen, and `p` for presenter mode.

## Build

```sh
npm run build
```

The compiled HTML presentation is in `dist/`. Serve that folder through an HTTP
server; opening `dist/index.html` directly as a file is not supported.

```sh
npm run preview
```

## Export PDF

Install Chromium once, then export:

```sh
npx playwright install chromium
npm run export
```

The output is `strands-box.pdf`.

## Style and sources

`style.css` defines the black background, green (`#00cc60`) headings, white body
copy, and purple (`#a78bfa`) accents. Figtree, the website's font, is bundled under
`public/fonts/` with its license, so viewing the deck does not require Google Fonts.
`global-top.vue` defines the footer.

See `SOURCES.md` and the presenter notes for source references and technical scope.
