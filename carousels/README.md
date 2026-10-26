# Carousels

One folder per LinkedIn carousel, named `yyyy-mm-short-slug`. A hand-built deck holds `deck.html`, `caption.md` and `img/`. Rendering creates `out/` (PDF, slide PNGs, contact sheet), which is git-ignored; rebuild it with `node systems/linkedin-carousel/kit/render.mjs carousels/<slug>/deck.html`.

A deck built from a spec lives in `_work/<yyyy-mm-slug>/` (`spec.json`, `caption.md`, `img/`, and `out/` with numbered PNGs, `carousel.pdf`, `preview.png` and a generated `deck.html`). That whole folder is git-ignored except `_work/README.md`. Cloud agents follow [systems/linkedin-carousel/CLOUD.md](../systems/linkedin-carousel/CLOUD.md).

Briefs go in `briefs/`, from the [BRIEF.md](BRIEF.md) template. Start a deck by copying `systems/linkedin-carousel/starter/` here, then follow [systems/linkedin-carousel](../systems/linkedin-carousel/).

`2026-10-content-model/` is the reference example and the one deck whose `out/` is committed.
