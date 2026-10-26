# Agent guide: Roboto Studio brand repo

This repo holds everything needed to make on-brand Roboto Studio assets. Read [design.md](design.md) first, every time. Then find the system for the job, read its README and follow it. You're trusted to make the design and writing decisions inside those rules.

## Systems

| Job | Go to |
|---|---|
| LinkedIn carousel (PDF document post) | [systems/linkedin-carousel/](systems/linkedin-carousel/) |
| Voice, motion | Placeholders for now; use design.md and robotostudio.com/design |

When a new system lands, add a row here.

## How every system works

- **Entry point:** each system has a `README.md` (read it in full) and may have an `AGENTS.md` with agent-specific steps.
- **Tooling lives inside the system** (for example `systems/linkedin-carousel/kit/`). Shared logos and fonts live in [assets/shared/](assets/shared/).
- **Work goes in a top-level folder for that output** (for example `carousels/<yyyy-mm-slug>/`). Commit the source (HTML, copy, images). Rendered output (`out/`) is git-ignored and never committed.
- **Everything renders offline.** Fonts, logos and images come from the repo. Don't add remote assets.

## Delivering work

1. Render on your machine.
2. Upload the deliverables to **Dropbox** with the Dropbox connector. Use the folder the request names. If none is named, use `/Roboto Studio/Brand output/<system>/<yyyy-mm-slug>/`.
3. Commit the source to a new branch named `<system>/<slug>` and push it. Never commit to `main`.
4. Reply with the Dropbox link, the branch, and anything that needs a human: unconfirmed facts, client names, approvals from the person posting.

## Rules that apply everywhere

- Never invent figures, clients, quotes or results. Write `TBC` and list it in the handover.
- Words in a real person's mouth (Jono, Sne) are a draft until they approve them. Say so in the handover.
- British English, sentence case, no em dashes. The writing rules in each system build on [design.md](design.md).

## Cursor Cloud specific instructions

- Setup runs from [.cursor/environment.json](.cursor/environment.json): it installs each system's tooling and a headless Chromium. If a render fails with a missing browser, run the `install` command from that file yourself.
- No dev server is needed to render. The `serve.py` preview in each kit is only for watching a deck in a browser.
