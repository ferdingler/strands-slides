# Strands slides

Markdown slide decks built with Slidev. Each deck lives in `decks/<name>/`, with
shared dependencies and commands at the repository root.

| Deck | Purpose |
| --- | --- |
| [intro-strands-box](decks/intro-strands-box/slides.md) | Five-slide introduction for a Strands Box demo: native isolation, semantic policy, and getting started. |

## Layout

```text
decks/
  intro-strands-box/
    slides.md         # Slide content and presenter notes
    style.css         # Typography, colors, and layouts
    global-top.vue    # Footer
    SOURCES.md        # References and claim scope
    public/fonts/     # Bundled fonts and licenses
    vite.config.ts    # Local server configuration
scripts/
  slidev.mjs          # Deck selection and commands
package.json
package-lock.json
```

## Use a deck

Requires Node.js 22.22 or newer. Run commands from the repository root:

```sh
npm ci
npm run decks
npm run dev -- intro-strands-box
```

Edit the deck's `slides.md` while the development server runs. `---` separates
slides; HTML comments at the end of a slide hold presenter notes. Arrow keys change
slides, `f` opens fullscreen, and `p` opens presenter mode.

The commands default to `intro-strands-box` when you omit the deck name.

## Build and preview

```sh
npm run build -- intro-strands-box
npm run preview -- intro-strands-box
```

The build writes `dist/intro-strands-box/`. Preview serves that deck on
`http://127.0.0.1:3032`, with support for slide URLs such as `/3`.
Build each deck separately; its output directory is named after it.

## Export PDF

Install Chromium once, then export the selected deck:

```sh
npx playwright install chromium
npm run export -- intro-strands-box
```

The output is `exports/intro-strands-box.pdf`. Generated builds and PDFs are ignored
by Git.

## Add a deck

Copy an existing deck, then edit its content, footer labels, and sources:

```sh
cp -R decks/intro-strands-box decks/my-next-deck
npm run dev -- my-next-deck
```

The commands discover any directory under `decks/` that contains `slides.md`.
No package changes are needed. The footer calculates its page count from the deck.
Each deck owns its styling and assets, so edits to one deck leave the others intact.

The introductory deck matches the website's fonts: JetBrains Mono for headings
and code, and Space Grotesk for body text. Its fonts and licenses are bundled in
the deck's `public/fonts/` directory.
