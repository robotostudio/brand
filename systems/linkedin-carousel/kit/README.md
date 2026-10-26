# Spec kit

`spec.json` in, slides out. One command writes a `deck.html`, numbered 1080 × 1350 PNGs, `carousel.pdf` (one page per slide, the LinkedIn document upload) and a phone-scale `preview.png` contact sheet.

This sits on the LinkedIn carousel system. It does not keep its own fonts, logos or author headshots.

| What the spec deck needs | Where it comes from |
|---|---|
| Geist, Geist Mono | [assets/shared/fonts/](../../../assets/shared/fonts/) via [carousel.css](carousel.css) |
| Wordmark and R mark | [assets/shared/logo/](../../../assets/shared/logo/) via the `--logo` and `--mark` tokens |
| Colour, type, frame | [carousel.css](carousel.css) and [carousel.js](carousel.js) |
| Author names and headshots | [authors/](../authors/) (`authors.js`, `img/jono.jpg`, `img/sne.jpg`) |
| Extra layouts and the texture fix | [kit-extra.css](kit-extra.css), loaded after `carousel.css` |

[render.mjs](render.mjs) is unchanged: it still renders a hand-written `deck.html`. [render-spec.mjs](render-spec.mjs) is the spec path. The starter, the specimen and the cover studies do not load `kit-extra.css`.

## Usage

```bash
# First time on a machine, from the repo root
bash scripts/setup.sh

node systems/linkedin-carousel/kit/render-spec.mjs carousels/_work/<yyyy-mm-slug>/spec.json
node systems/linkedin-carousel/kit/render-spec.mjs path/to/spec.json --out /some/dir --strict
```

`--strict` makes warnings fail the process. Cloud agents use it.

Default output is next to the spec, in `out/`: `01.png` … `NN.png`, `carousel.pdf`, `preview.png`, `deck.html`. Passing a `.json` path to `render.mjs` prints this command and exits.

To watch a generated deck, serve the repo and open the `deck.html` inside `out/` over http. Opening it from disk can break the relative paths.

```bash
python3 systems/linkedin-carousel/kit/serve.py
```

## Where a deck lives

A deck built from a spec goes in `carousels/_work/<yyyy-mm-slug>/`:

```text
carousels/_work/2026-11-short-slug/
├── spec.json
├── caption.md
├── img/                  screenshots, relative to spec.json
└── out/                  render. Git-ignored with the rest of _work/
```

`carousels/_work/` is git-ignored (the folder's README is the exception). Do not commit a working deck, its images, or a render. `carousels/2026-10-content-model/` is the tracked reference deck and is not part of this ignore.

The layout specimen is the one spec that lives in git: [examples/layouts/spec.json](examples/layouts/spec.json). It reuses [specimen/img/robotostudio-home.png](../specimen/img/robotostudio-home.png). Its `out/` is git-ignored.

## Spec

```json
{
  "name": "2026-11-short-slug",
  "title": "Deck title",
  "author": "company",
  "theme": "dark",
  "series": "Field notes",
  "rules": { "minSlides": 9, "maxSlides": 12, "closing": "cta" },
  "slides": [ { "layout": "cover" } ]
}
```

`author` is `company`, `jono` or `sne` (default `company`). `theme` is `dark` (default) or `light`. `series` is the header meta, 1 to 3 words, company decks only.

Inline markup in any text field: `[[dim words]]`, `{{pink}}` (the one pink moment), `` `mono` ``, `\n` for a line break.

Common slide fields: `eyebrow`, `idx` (override the number, or `false`), `title`, `dim`, `lead`, `source`, `invert` (one per deck at most), `meta`, `swipe`.

### Rules (defaults match the system, opt out in the spec)

Omit `rules` and the renderer checks the repo defaults.

| Field | Default | What it checks |
|---|---|---|
| `minSlides` | 9 | Warning under this. The written target is 9 to 12. Critique allows 8 when a slide was filler; set `minSlides` to 8 and say so. |
| `maxSlides` | 12 | Warning over this. |
| `closing` | `cta` for `company`, `signature` for a person | `cta`: last slide has a Get in touch `.cta-box` (layout `cta`). `signature` (alias `author`): last slide has the author card (`"signature": true` on layout `closing`). `none`: no CTA and no signature required (the R mark close, or a shorter end). |

A shorter deck, or one that ends with no CTA, sets `rules` and says so in the handover. The defaults are not changed to suit one author's posts. The HTML linter in `render.mjs` is separate and unchanged (it warns under 8 slides and over 14, and it warns when a person deck has no signature).

[examples/layouts/spec.json](examples/layouts/spec.json) is a six-slide layout specimen. It sets `minSlides` 1, `maxSlides` 6 and `closing` `none` because it is not a post.

### Layouts

| Layout | Fields | Use |
|---|---|---|
| `cover` | `title`, `dim`, `lead`, `texture`, `byline`, `logos` | Hook. 3 to 10 words. `byline: true` on a person deck draws the large cover byline and keeps the header to the wordmark. `logos` is a row of real marks: `{ "image", "label", "wide", "out", "sep", "scale" }`. `scale` sizes the artwork inside the tile (1 is the default) so marks with different viewBoxes can share an optical size. `image` is an SVG next to the spec, inlined at build time. |
| `text` | `title`, `dim`, `lead`, `body`, `size` (`h1`/`h2`), `anchor` (`center`/`bottom`/`""`) | One idea. |
| `list` | `title`, `items[]`, `compact`, `done` | 3 to 5 short items. |
| `stat` | `value`, `title`, `source` | One sourced number. |
| `code` | `code`, `lang`, `file`, `focus` (line numbers), `pink` (one token), `numbers` | Real code, highlighted at build time by highlight.js in zinc. About 12 lines of 40 characters. |
| `image` | `image`, `url` (adds a browser bar), `position`, `fit`, `alt` | One screenshot or still. Path relative to the spec. |
| `beforeafter` | `before` / `after`: `{label, meta, image, alt, position}` | Two stills, stacked. |
| `gallery` | `items[]`: `{label, image, wide, position, alt}`, `cols` | Several labelled screenshots. |
| `compare` | `before` / `after`: `{label, text}` | Text only, bad against good. |
| `diagram` | `steps[]`: `{label, text, via, on}`, `grow`, `loop` | Boxes joined by wires, top to bottom. `grow` makes the boxes fill the frame under the line. `loop` is the label on a return rail back to the first box. |
| `flow` | `steps[]`: `{label, text, on}` | Vertical timeline. |
| `prompt` | `link`: `{label, text, key}`, `prompt`: `{label, text, typo}`, `via`, `result`: `{label, before, after}` | Link, plain-English prompt, before and after stills. |
| `steps` | `steps[]`: `{label, image, alt, position, via}` | Numbered steps, each with a screenshot. |
| `cta` | `title`, `lead`, `url`, `cta` (button label, default "Get in touch") | Company close. This is the default last slide. |
| `closing` | `title`, `dim`, `lead`, `sign`, `signature` | End with the R mark (`sign` defaults to robotostudio.com). `"signature": true` fills the author card instead. Use with `rules.closing` `none` or `signature`. |

Images are paths relative to the spec file. Use real screenshots or video stills only. Do not invent figures, clients or quotes: write TBC and list it in `caption.md`.

## Textures

On a spec deck, `.tex-dots`, `.tex-lines` and `.tex-hlines` are retuned in `kit-extra.css`. Stripes and dots run from rail to rail in even gaps. On a bottom-anchored cover or close, the texture is a flex child that fades out fully before the type, so it never sits behind a headline or stops on a hard edge. HTML decks keep the textures in `carousel.css`.

## Checks

The renderer fails on overflow, type under 24px, weight above 500, an em dash, a broken image, or a page error. It warns on an exclamation mark, a hashtag, an @mention, more than 32 words, a remote request, a slide count outside `rules`, and a last slide that does not match `rules.closing`. `--strict` turns warnings into a failed run.

## Brand

Dark `#141414`, white `#FAFAFA`, Tailwind zinc, hot pink `#FF00A8` as a rare accent. Geist 400 for everything, Geist Mono for labels and code, nothing bold (500 is strong). Sentence case. No em dashes. Sharp corners. 2px hairlines. The frosted swipe pill is the only rounded element.
