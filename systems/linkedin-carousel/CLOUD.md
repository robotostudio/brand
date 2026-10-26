# Cloud agents: build a LinkedIn carousel

Read [design.md](../../design.md), then this system's [README.md](README.md), [taste.md](taste.md) and [copy.md](copy.md), and the posting account in [authors/](authors/). The spec format is [kit/README.md](kit/README.md).

Do not commit the deck. `carousels/_work/` is git-ignored, including the spec, its images, the generated `deck.html` and the render (`out/`, numbered PNGs, `carousel.pdf`, `preview.png`). Leave the tracked reference deck `carousels/2026-10-content-model/` alone.

## 1. Brief

Use the brief you were given. If it is a file, it follows [carousels/BRIEF.md](../../carousels/BRIEF.md). If the account is not stated, use `company` and read that profile before writing. Missing facts are `TBC`. Words in Jono's or Sne's voice are a draft until they approve them.

## 2. Working folder

```bash
mkdir -p carousels/_work/<yyyy-mm-slug>/img
```

Write `spec.json` and `caption.md` there. `caption.md` follows [starter/caption.md](starter/caption.md): slide plan, caption, "Needs confirming", alt text. Put real screenshots in `img/`. Paths in the spec are relative to `spec.json`.

Write the deck as one line per slide first. Cut until each line is one idea. Then pick a layout per slide from [kit/README.md](kit/README.md).

## 3. Defaults

Omit `rules` to keep the repo defaults:

- 9 to 12 slides.
- Company account: the last slide is layout `cta` ("Get in touch").
- Person account: the last slide is layout `closing` with `"signature": true` (the author card). A cover may set `"byline": true`.

A shorter deck, or a close with no CTA, is allowed. Set it in the spec and say so in the handover. Do not change the kit defaults.

```json
"rules": { "minSlides": 6, "maxSlides": 8, "closing": "none" }
```

`closing` is `cta`, `signature` (alias `author`), or `none`.

## 4. Render

```bash
node systems/linkedin-carousel/kit/render-spec.mjs --strict carousels/_work/<yyyy-mm-slug>/spec.json
```

Output lands in `carousels/_work/<yyyy-mm-slug>/out/`. Fix until the command exits 0. Then open `out/preview.png` and run the checks in [critique.md](critique.md). `preview.png` is the spec kit's contact sheet. Four passes at most.

First time on a machine: `bash scripts/setup.sh` from the repo root.

## 5. Return artifacts

Copy the deliverables to `/opt/cursor/artifacts/<yyyy-mm-slug>/`:

- `out/01.png` … `out/NN.png` (each 1080 × 1350)
- `out/carousel.pdf`
- `out/preview.png`
- `caption.md`

Reply with the slide count, any `rules` you set, the "Needs confirming" list, and a note when the copy is a person's draft.

When the request asks for a Dropbox delivery, upload the PDF, the preview and `caption.md` to the folder it names, or to `/Roboto Studio/Brand output/linkedin-carousel/<yyyy-mm-slug>/`. See the root [AGENTS.md](../../AGENTS.md).

Do not commit `_work`, `out/`, the PNGs, the PDF, `preview.png` or the generated `deck.html`.
