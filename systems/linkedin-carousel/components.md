# Components

The kit lives in [templates/linkedin-carousel/](../../templates/linkedin-carousel/). The markup for every component below is in the [specimen deck](../../templates/linkedin-carousel/specimen/deck.html), and you can see it rendered in [`specimen/out/contact-sheet.png`](../../templates/linkedin-carousel/specimen/out/contact-sheet.png). Copy markup from the specimen; don't write it from memory.

Treat these as a vocabulary, not a set of fixed layouts. Combine them freely inside `.content`, as long as the result stays within [taste.md](taste.md).

## Canvas

- 1080 × 1350px per slide (4:5 portrait). The PDF is one page per slide.
- The frame is automatic (`carousel.js`): 64px rails, a 120px header with the wordmark and meta text, a 120px footer with the `03 / 10` counter and the frosted swipe pill. The swipe pill hides itself on the last slide.
- Everything goes inside `<div class="content">`, which fills the space between the rails and bands with 96px top/bottom and 56px side padding.
- LinkedIn shows the slide at about 36% on a phone. So 24px is the smallest text allowed, 40px is body, and a hairline is 2px.

## Deck and slide knobs

| Knob | Effect |
|---|---|
| `<body data-theme="dark">` / `"light"` | Deck theme. Dark is the default and the recommendation. |
| `<body data-series="Field notes">` | Header meta text on every slide (keep it 1-3 words, or empty). |
| `<section class="slide" data-meta="…">` | Header meta for one slide. |
| `data-swipe="Keep going"` | Swipe pill label for one slide (rarely needed). |
| `data-chrome="bare"` | Rails only, no header or footer. Avoid; the research favours a consistent frame. |
| `.slide.invert` | Flip to the opposite theme for this one slide. Once per deck at most. |
| `.content.center` / `.bottom` | Anchor content to the vertical centre / bottom. Default is top. |
| `.content.tight` | 64px top/bottom padding instead of 96px, for artefact-heavy slides. |
| `.content.flush` | No padding, for a full-bleed artefact inside the rails. |

## Type

| Class | Size | Use |
|---|---|---|
| `.display` | 132px | Cover line only. 2-6 words per line, max 3 lines. |
| `.h1` | 100px | The single statement on a statement slide. Max 4 lines. |
| `.h2` | 72px | Headline above a list, artefact or compare. Max 2 lines. |
| `.h3` | 52px | Items, cells, compare halves, flow steps. |
| `.lead` | 40px muted | One supporting line under a display or h1. |
| `.body` | 40px | Rare. Running text, 1-2 sentences max. |
| `.small` | 32px muted | Source lines, footnotes. |
| `.eyebrow` | 24px mono caps | Top-of-slide label. `<span class="idx">03</span><span>Topic</span>`. |
| `.label` | 24px mono caps muted | Any other metadata. |
| `.mega` | 340px | One figure of up to 4 characters. `.mega.long` (250px) for 5-6. `<span class="unit">%</span>` dims a unit. |
| `.dim` | colour | The second voice of a two-tone line. |
| `.pink` | colour | The one pink moment. |
| `.measure` / `.measure-s` | max-width 780 / 620px | Keep a lead or h3 from running the full width. |

Headline classes are independent of the HTML tag. Use `<h1>` for the cover and `<h2>` elsewhere, then apply whichever size class fits.

## Moves

Each move below has a job. Pick the move for the job, then write copy to fit it.

| Move | Markup | Job | Watch out |
|---|---|---|---|
| **Statement** | `.eyebrow` + `.h1` with `.dim`, in `.content.center` | Land one idea hard | Max ~20 words. No other elements. |
| **Cover** | `.eyebrow` + `.display` + optional `.lead`, `.content.bottom`, one texture at the top | Stop the scroll | Boldest, emptiest slide. |
| **One number** | `.eyebrow` + `.mega` + `.h3.push` | Make a figure unforgettable | Real figure, sourced. The eyebrow says what it measures. |
| **List** | `.h2` + `ol.list` of `li > .n + span` | Enumerate 3-5 short things | Items 2-6 words. `.list.compact` for 5+. |
| **Recap** | `ol.list.compact` with `li.done` | The save-worthy summary | Second-to-last or last slide only. |
| **Compare** | `.compare` with `.is-bad` + `.is-good` halves (`.compare.cols` for side by side) | Bad vs good, before vs after, old vs new | Stacked by default; side by side only for 2-4 word halves. Identical across a series. |
| **Real work** | `.shot.browser.grow` with `.bar` (URL) + `.view > img` | Proof: live sites, Sanity Studio, Figma | Put `<span class="crop"></span>` first for all four crop marks. Real screenshots only, 2x resolution, cropped to the interesting part. |
| **Artefact** | `.shot.grow > img` (no browser bar) | Non-web screenshots: Studio panes, terminals, diagrams | Same rules as real work. |
| **Receipt** | `pre.receipt` with `.c` (comment), `.k` (key), `.p` (the one pink token) | Real code, config, schema, redirect maps, file trees | Max ~8 lines of 40 characters. Real strings, not pseudo-code. |
| **Flow** | `ol.flow` of `li` (`.on` = filled node) with `.label` + `.h3` | Steps, timelines, a workflow on one slide | 3-6 steps. Fill nodes to show progress through a series. |
| **Cells** | `.cells` with `style="--cols: 2"` | 4-6 parallel items with equal weight | Labels + 1-3 word `.h3`s. Never icons. |
| **Quote** | `p.quote` + `.label` attribution | A real line from a client or the team | Real and attributed. Pairs well with `.invert`. |
| **Stack** | `.chips` of `.chip`, optional `.tile` with one mark | Name the tools without logo soup | Text chips over logos. One `.tile` max. |
| **CTA** | `.cta-box` with `.label` URL + `.h3` "Get in touch <i class="chev"></i>" | Close | Last slide only. |

## Cover art

Markup for all four forms is in [cover-studies/deck.html](../../templates/linkedin-carousel/cover-studies/deck.html), rendered in `cover-studies/out/contact-sheet.png`. When and why to use each one is in [taste.md](taste.md) §6a.

```html
<section class="slide">
  <div class="art"> … one form … </div>          <!-- sibling before .content -->
  <div class="content bottom">
    <div class="eyebrow">…</div>
    <h1 class="h1">Claim <span class="dim">continuation.</span></h1>   <!-- .h1, not .display -->
    <p class="lead measure-s">…</p>
  </div>
</section>
```

| Form | Markup | Notes |
|---|---|---|
| Blueprint | `.art.pad > .blueprint > span.crop + .tex-dots + svg` with a hatch `<pattern>` filling a `<text>` glyph | Give each pattern a unique `id`. 1-3 characters only. |
| Scene | `.art > .scene + .window(s) + svg.cursor`; windows hold `.titlebar` (`.lights`) and `.card` of `.field` (`.k` key, `.v` value) | Position windows with inline `left/top/width/height`. `.field.tide` marks the one thing that matters. A window may crop at the art's edge, but never through the highlighted field. |
| Schematic | `.art > svg.schematic` with `.node` groups (`rect` + `text`, `.on` for the focus), `.wire` paths (H/V segments only) and `.joint` squares | 952 × 620 viewBox. 5-9 nodes. Real names from the deck. One `.pinkdot` at most. |
| Artefact | `.art.bleed.pad > .giant` (130px mono) with `.k` for the bright line and `.p` for a pink caret | 2-4 lines. Only dim lines may run off the page; the bright line stays whole (about 13 characters max). |

`.art` is 620px tall (`.art.tall` 740px if the headline is one line). It isn't linted for overflow, so check it on the contact sheet.

## Textures

One per slide at most, never behind running text, always faded. Treat them as atmosphere, never as content.

```html
<div class="tex top-half tex-dots fade-l"></div>     <!-- place before .content -->
```

- Position: `.full`, `.top-half`, `.bottom-half`
- Pattern: `.tex-dots` (dot grid, as on the design page), `.tex-lines` (vertical rules, as in the site hero), `.tex-hlines` (horizontal rules)
- Fade: `.fade-l`, `.fade-r`, `.fade-t`, `.fade-b`

Use them on covers, statement slides and number slides, the sparse ones. Dense slides don't need them.

## Helpers

`.stack`, `.stack-s`, `.stack-l` (vertical groups), `.row` (horizontal), `.push` (push this and everything after it to the bottom), `.grow` (fill remaining height), `.rule-h` (a hairline), `.mono`.

## Images

- Put images in the deck's `img/` folder and reference them as `img/name.png`.
- Screenshots: capture at 2x, crop to what matters, and show real content (no lorem ipsum and no empty states). For a website, the hero or the one section the slide talks about.
- Logo files are in [assets/shared/logo/](../../assets/shared/logo/). The frame already places the wordmark; don't add another.

## Extending the kit

If a deck needs something the kit lacks, add it to `carousel.css` (and to the specimen) rather than inline styles, so the next deck gets it. Inline `style` is allowed only for `--cols` and one-off `max-width`. A new component must pass [taste.md](taste.md): sharp corners, zinc plus pink, 2px hairlines, 400 weight.
