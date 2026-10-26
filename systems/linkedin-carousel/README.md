# LinkedIn carousels

How to make Roboto Studio LinkedIn carousels: PDF document posts, one 1080 × 1350 page per slide. The system is HTML and CSS rendered to PDF, so you design with a small set of components inside a fixed frame and can compose freely within it.

It builds on [design.md](../../design.md) and never contradicts it.

## Read in this order

1. [design.md](../../design.md): brand globals (logo, colour, type, surfaces).
2. [taste.md](taste.md): what good looks like. **The most important file here.**
3. [copy.md](copy.md): topics, formats, cover hooks, slide copy, facts, the caption.
4. [components.md](components.md): the kit's vocabulary and markup.
5. [critique.md](critique.md): the render-look-fix loop and handover.
6. [authors/](authors/): the profile for the account the deck posts from (`company.md`, `jono.md`, `sne.md`).

Background: [research.md](research.md), the October 2026 study of carousels in our niche that these rules come from.

## Workflow

1. **Brief.** Get the topic, the audience's pain, **which account will post it**, and any real material: screenshots, numbers, client names, code. Don't invent what's missing; mark it TBC. Read that account's profile in [authors/](authors/) before you write a word.
2. **Choose the format** from [copy.md](copy.md) §2.
3. **Write the deck as text**, one line per slide, in `caption.md` or a scratch note. Read it top to bottom. Cut until each line is one idea.
4. **Set up the folder:**
   ```bash
   cp -R systems/linkedin-carousel/starter carousels/2026-11-short-slug
   ```
5. **Build it.** Edit `deck.html`: one `<section class="slide">` per slide. Pick a move per slide from [components.md](components.md) and copy its markup from the [specimen](specimen/deck.html).
6. **Render:**
   ```bash
   node systems/linkedin-carousel/kit/render.mjs carousels/2026-11-short-slug/deck.html
   ```
   (First time only: `npm install --prefix systems/linkedin-carousel/kit && npx --prefix systems/linkedin-carousel/kit playwright install chromium`.)

   To watch the deck live while you edit, serve the repo and open the deck over http. Opening `deck.html` straight from disk can break its relative CSS, JS and logo paths, and you'll see unstyled text.
   ```bash
   python3 systems/linkedin-carousel/kit/serve.py
   ```
   Then open `http://localhost:4173/carousels/2026-11-short-slug/deck.html`. In the Claude desktop app, the `carousel-preview` entry in `.claude/launch.json` starts the same server. Slides shrink to fit the window on screen; the render is always full size. The rendered PNGs and contact sheet remain the source of truth.
7. **Critique and fix** following [critique.md](critique.md). Look at `out/contact-sheet.png` every pass.
8. **Write the caption** in `caption.md` and hand over.

Rendered output (`out/`) for decks in `carousels/` is git-ignored: commit `deck.html`, `caption.md` and `img/`, and anyone can rebuild the PDF with one command. Only the reference decks (the specimen, the cover studies and the example deck) keep their `out/` in git so you can see finished work without rendering.

## The non-negotiables

The lint in `render.mjs` enforces most of these.

- 4:5 portrait, 1080 × 1350. 9-12 slides.
- Dark theme by default (`#141414`, white type, zinc greys). One `.invert` slide at most.
- Geist 400 for everything, Geist Mono for labels and machine strings. Nothing bold. Sentence case.
- Black, white, zinc and pink only. Pink 0-1 times a slide, 2-4 times a deck.
- Sharp corners. 2px hairlines. The frosted swipe pill is the only rounded thing.
- The frame (wordmark, counter, swipe pill) is on every slide, drawn by `carousel.js`.
- Nothing smaller than 24px. One idea per slide. Under 25 words a slide where possible.
- Real screenshots and artefacts only: no stock, 3D or icons. The only illustration is the cover art in taste.md §6a.
- No invented figures, clients or quotes.
- No em dashes, emoji, exclamation marks or hashtags on slides.

## Files

```text
systems/linkedin-carousel/      everything needed to make a carousel (you are here)
├── README.md, taste.md, copy.md, components.md, critique.md, research.md
├── kit/
│   ├── carousel.css            the visual system
│   ├── carousel.js             draws the frame on every slide
│   ├── render.mjs              HTML → PDF + PNGs + contact sheet + lint
│   └── serve.py                local preview server (no caching)
├── authors/                    posting accounts: profiles, headshots, authors.js registry
├── starter/                    copy this to start a deck
├── specimen/                   every component, rendered
└── cover-studies/              one cover in all four art forms, plus type only
carousels/<yyyy-mm-slug>/       the decks: one folder each, output not committed
assets/shared/logo/             approved logo files, shared across formats
```

`carousels/2026-10-content-model/` is a finished example deck that shows the system in use.
