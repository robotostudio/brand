# Agent steps: LinkedIn carousel

The rules are in [README.md](README.md) and the files it lists. Read them in the order given; this file adds only the agent's run order.

## Cloud agents

Build from a brief with the spec kit. Do not commit the deck. Follow [CLOUD.md](CLOUD.md).

## Hand-built HTML decks

Use this when maintaining the starter, the specimen, the cover studies, or a deck that already lives in git as `deck.html`.

1. **Brief.** Use the brief you were given. If it's a file, it follows [carousels/BRIEF.md](../../carousels/BRIEF.md). If the account isn't stated, use `company`. Read that account's profile in [authors/](authors/).
2. **Plan.** Pick a format ([copy.md](copy.md) §2) and write the deck as one line per slide in `caption.md`. Cut until each line is one idea.
3. **Build.** `cp -R systems/linkedin-carousel/starter carousels/<yyyy-mm-slug>`, set `data-author`, then compose slides from [components.md](components.md) and the [specimen](specimen/deck.html).
4. **Render and fix:**
   ```bash
   node systems/linkedin-carousel/kit/render.mjs --strict carousels/<slug>/deck.html
   ```
   Fix until it exits 0. Then open `out/contact-sheet.png` and run the checks in [critique.md](critique.md). Four passes at most.
5. **Caption.** Finish `caption.md`: the caption in the account's voice, "Needs confirming" and alt text.
6. **Deliver** as described in the root [AGENTS.md](../../AGENTS.md#delivering-work). Upload to Dropbox:
   - `out/<slug>.pdf`: the file to post
   - `out/contact-sheet.png`: for review
   - `caption.md`: the post text

   Then reply with the Dropbox link, the branch, the slide count, your critique scores and the "Needs confirming" list.
