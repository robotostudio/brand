# Critique

A deck isn't finished when it renders. It's finished after you've looked at it and fixed what's wrong. Budget at least two render-and-fix passes and at most four.

## The loop

1. Render. HTML: `node systems/linkedin-carousel/kit/render.mjs --strict carousels/<slug>/deck.html`. Spec: `node systems/linkedin-carousel/kit/render-spec.mjs --strict carousels/_work/<slug>/spec.json`.
2. Fix every `ERROR` in the lint output. Read every `warn` and either fix it or decide, for a reason you could state, to keep it.
3. **Open the contact sheet and look at it.** HTML renders write `out/contact-sheet.png`. Spec renders write `out/preview.png`. Same job: the phone view. Run the checks below.
4. Open the full-size slide for any slide that failed a check (`out/slides/NN.png` for an HTML deck, `out/NN.png` for a spec), and fix it.
5. Render again. Repeat until a pass changes nothing.

The lint catches mechanical failures. It can't tell whether a slide is good. That part is your job.

## Contact sheet checks (the whole deck)

- [ ] **The cover wins.** It's the boldest, simplest slide, and you can read it from across a room.
- [ ] **Cover art is specific.** If there's art, it shows this deck's idea and would make no sense on another carousel (taste.md §6a).
- [ ] **One family.** Same frame, theme and type, with at most one inverted slide.
- [ ] **Rhythm.** Dense and sparse slides alternate. No three near-identical slides in a row, unless it's a deliberate series and the series is exact.
- [ ] **Story.** Read only the headlines, in order. They should tell the whole argument on their own.
- [ ] **Pink count.** 2-4 pink moments in the deck, each one deliberate.
- [ ] **Count.** 9-12 slides. If a slide is filler, cut it, even if that takes you to 8. A spec may set `rules.minSlides` and `rules.maxSlides` when the brief calls for another length. Say so in the handover. The default stays 9 to 12.

## Slide checks (each slide)

- [ ] **One idea.** You can say what it says in one short sentence without "and".
- [ ] **One focal point.** Squint: one thing pulls the eye first.
- [ ] **Two levels.** A big statement and a small label. A third only if the idea needs it.
- [ ] **Two-tone done right.** The bright words make sense on their own, and the important word isn't dim.
- [ ] **Anchored.** Content sits at the top or the bottom, or deliberately centred. Nothing floats.
- [ ] **Room.** About 40% of the content area is empty. Nothing crowds the rails.
- [ ] **Real.** Every image is a real screenshot or artefact. Every number has a source.
- [ ] **Readable at phone size.** Every word on the contact sheet can be read without zooming.
- [ ] **Voice.** Sentence case, no em dashes, no filler, no exclamation marks, nothing that sounds like an ad.
- [ ] **Account.** It sounds like the person in the header. Read a slide aloud: would they say it? Nothing claims experience their profile doesn't support.

## Scoring

Before handing over, score the deck 1-5 on each line. Anything under 4 gets another pass.

| | 1 | 5 |
|---|---|---|
| **Hook** | The cover is generic or needs the caption | The cover makes a specific promise you'd swipe for |
| **Substance** | Advice anyone could write | Real work, real numbers, or a view only we could hold |
| **Clarity** | Slides need reading | Every slide lands in a second |
| **Craft** | Crowded, uneven, template-y | Looks like robotostudio.com: quiet, exact, confident |
| **Truth** | Invented or unsourced claims | Everything sourced or flagged TBC in `caption.md` |

## Common fixes

| Symptom | Fix |
|---|---|
| A slide feels empty | Make the one thing bigger (h2 → h1, or a `.mega`). Don't add things. |
| A slide feels busy | Split it into two slides, or delete the weakest element. |
| A headline wraps to 5+ lines | Cut it to its claim, or move the context into a `.lead`. |
| Everything is the same size | Raise the statement a step and drop the rest to a label. |
| The deck feels monotonous | Swap one text slide for a real artefact, or bottom-anchor every other slide. |
| A widow (one word alone on the last line) | Rephrase. `text-wrap: balance` helps but can't fix everything. |
| A screenshot is unreadable | Crop tighter to the part the slide is about. One region per slide. |
| Overflow error | Cut words. Don't shrink type. |
| "Crowds the rail" warning | Use the next size down (`.mega.long`, h1 → h2) or shorten the line. |

## Handover

The deck folder `carousels/<slug>/` should contain:

- `deck.html`, the source
- `caption.md`, with caption, needs confirming and alt text (see [copy.md](copy.md))
- `img/`, any images used
- `out/<slug>.pdf`, the upload
- `out/contact-sheet.png` and `out/slides/`, the previews

In your final message, give the PDF path, the contact sheet path, the slide count, your scores, and the "Needs confirming" list.
