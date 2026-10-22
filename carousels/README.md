# Carousels

One folder per LinkedIn carousel, named `yyyy-mm-short-slug`. Each holds `deck.html`, `caption.md` and `img/`. Rendering creates `out/` (PDF, slide PNGs, contact sheet), which is git-ignored; rebuild it with `node systems/linkedin-carousel/kit/render.mjs carousels/<slug>/deck.html`.

Start a deck by copying `systems/linkedin-carousel/starter/` here, then follow [systems/linkedin-carousel](../systems/linkedin-carousel/).

`2026-10-content-model/` is the reference example and the one deck whose `out/` is committed.
