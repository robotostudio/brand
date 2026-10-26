# Roboto Studio brand-monorepo

The central home for Roboto Studio's brand and design: shared rules, guidance for applying them across digital formats, approved assets and reusable templates.

**Status:** Shared brand rules imported from [robotostudio.com/design.md](https://robotostudio.com/design.md). The LinkedIn carousel system is in place; voice and motion are still placeholders.

## Repository map

```text
brand-monorepo/
├── design.md               # Shared brand rules
├── README.md               # Repository map and getting started
├── AGENTS.md               # How agents (Cursor cloud, Grok Bot) find and run a system
├── scripts/setup.sh        # Installs every system's kit; also run by .cursor/environment.json
├── systems/                # Specialised execution guidance
│   ├── linkedin-carousel/  # LinkedIn PDF carousels: rules, kit, starter, specimen
│   ├── voice/
│   └── motion/
├── assets/                 # Approved files ready to use
│   ├── shared/             # logo/ (approved SVGs) and fonts/ (Geist, local)
│   └── motion/
├── templates/              # Reusable starting points
└── carousels/              # LinkedIn carousel decks and briefs (content, not system)
```

## Start here

1. Read [design.md](design.md) for the shared brand foundation. Agents start at [AGENTS.md](AGENTS.md).
2. Follow the relevant [system](systems/). For LinkedIn carousels, start at [systems/linkedin-carousel](systems/linkedin-carousel/).
3. Use [approved assets](assets/) and [templates](templates/) as they become available.

## Where things belong

| Content | Home |
| --- | --- |
| A rule that applies across the brand | [design.md](design.md) |
| Instructions for a discipline, channel or format | [systems/](systems/) |
| An approved file someone can use in production | [assets/](assets/) |
| A reusable starting point someone can copy and adapt | [templates/](templates/) |
| A hand-built LinkedIn carousel (source and caption; the PDF is rebuilt, not committed) | [carousels/](carousels/) |
| A spec-built carousel from a cloud agent (never committed; render returned as artifacts) | [carousels/_work/](carousels/_work/) |

A system that ships its own tooling keeps it inside its folder (for example `systems/linkedin-carousel/kit/`), so rules and code change together. Systems and templates build on `design.md`. Link to shared rules instead of duplicating them. Document format-specific adaptations in the relevant system and resolve conflicts with the shared guidance.
