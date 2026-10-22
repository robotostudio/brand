# Taste

The rules in [design.md](../../design.md) say what is allowed. This file says what is good. Read it before you design, and again before you critique.

## The picture to hold in your head

**robotostudio.com, held up on a phone.** Near-black page, white type, zinc greys, hairline rails, one big sentence per slide, a mono label above it. It looks engineered and quiet, and it is confident enough to leave most of the slide empty. Think of a technical drawing or a well-set billboard. A pitch deck or an infographic is the wrong picture.

If a slide would look at home on Canva's template page, it is wrong.

## Ten principles

### 1. One slide, one idea
A slide is a billboard. Someone swiping in the feed spends about a second on it. If you need "and" to describe what the slide says, it is two slides. If two slides say the same thing, cut one.

### 2. Size is the hierarchy
Nothing is bold (weight 400, strong is 500). Hierarchy comes from size and colour only. Most slides have **two levels**: one big statement and one small mono label. Add a third level (a lead line, a list, an artefact) only when the idea needs it. Four levels is a document.

The gap between levels should be dramatic. A 100px headline over a 40px lead reads as designed. A 56px headline over a 44px lead looks like a mistake.

### 3. Two-tone, not highlight
The brand's emphasis device is a sentence that starts bright and finishes dim:

> **Google ranks URLs.** <span style="color:#71717A">Change one and its ranking starts from zero.</span>

- The bright part is the claim, usually the first 2 to 6 words. The dim part is the context or consequence.
- Read the bright words alone. If they make sense alone, the split is right.
- Never dim the important word. Never brighten a single word in the middle of a dim sentence (that is a highlighter, and it looks like one).
- Use two-tone on headlines. Inside a list, use it on half the items at most, or the device stops meaning anything.

### 4. Pink is seasoning
`#FF00A8` appears **0 or 1 times on a slide and 2 to 4 times in a deck**. It marks the single thing to notice: the one value in a code block, the pink R tile, one word on the cover or the final question. It never fills a surface, never colours body text, never decorates. If you can't say why that exact element is pink, make it white.

### 5. Empty space is the design
Leave roughly 40% of the content area empty. Anchor content to the top (under the eyebrow) or to the bottom (with `.push` or `.content.bottom`). A block floating in the middle looks unplaced. Centre vertically only for a single statement or quote, where the emptiness is the point.

When a slide feels empty, the fix is almost never to add something. Make the one thing bigger.

### 6. Real artefacts beat illustration
The two best-performing carousels in our research showed real work: a real workflow, a real client rebuild. Show real things:

- screenshots of live sites and Sanity Studio, in `.shot.browser`
- real code, config, schemas, terminal output and redirect maps, in `.receipt`
- real tool names, in `.chip`
- real numbers, with a source

Never use stock photos, 3D renders, isometric illustrations, icon grids, illustrated people, AI-generated imagery or device mockups at an angle. The textures (`.tex-dots`, `.tex-lines`, `.tex-hlines`) are decoration, and a slide gets one at most.

### 6a. Cover art: drawn, never decorated
A cover may carry **one** illustration, in one of four forms taken from the site (see [components.md](components.md#cover-art) and the [cover studies](cover-studies/deck.html)):

| Form | Looks like | Best when |
|---|---|---|
| **Blueprint** | One hatched outline glyph in a crop-marked tile, as on the service pages | The topic has a single symbol: `{ }`, `/`, `301`, `R`, a tool's initial |
| **Scene** | Product UI in glass windows on a grainy grey ground, as in the site's Scenes | The story happens inside a tool: Sanity Studio, a browser, a chat |
| **Schematic** | Hairline boxes, orthogonal wires, mono labels | The idea is a structure: a content model, a migration path, an architecture |
| **Artefact** | The real string set huge, with the dim lines running off the page | One machine string *is* the joke or the tell |

What makes these look made rather than mass-produced is that **each one is specific to this deck**. The schematic shows *this* content model; the artefact is *the* field name from slide 3. Ask yourself whether the art would make sense on someone else's carousel. If it would, it's decoration: redo it or drop it.

- Type only (no art) is always valid and often best for a blunt claim. Pick art when it explains the idea faster than the words.
- The art takes the top ~45% of the slide; the headline drops to `.h1`, two lines at most, anchored at the bottom.
- Art uses the slide's colours only. A Scene may use its own Tide accent (`#9FDCCF`) once; then that slide has no pink.
- One form per deck. A slide inside the deck may reuse the cover's form (the full schematic, the Scene's next state), which ties the deck together.

### 7. Rhythm across the deck
Swiping should feel like a beat: loud, quiet, loud, artefact, quiet. Alternate:

- dense slides (a list, a receipt) with sparse ones (a statement, a number)
- top-anchored with bottom-anchored
- text slides with artefact slides

Don't put three structurally identical slides in a row, **unless repetition is the format** (numbered rules, bad vs good). Then make the repetition exact: same layout, same positions, only the content changes. A deliberate series looks designed. A near-miss series looks sloppy.

### 8. Fixed frame, varied content
The frame never changes: rails, header with the wordmark, counter, swipe pill. The deck has one theme (dark by default). One slide may invert (`.invert`) to mark the turn of the story or the payoff, and only one.

### 9. Rewrite copy to fit the layout
If text doesn't fit, cut words. Don't reduce the type size, add a line or squeeze the leading. The type scale is fixed for legibility on a phone. The words can change; the sizes can't.

### 10. Every slide earns the next swipe
Each slide should leave a small open loop: a number that needs explaining, a "bad" that needs its "good", step 2 of 5. The cover makes a promise. The last slide pays it off and asks a question.

## Choices when unsure

| If you're torn between | Choose |
|---|---|
| More words or fewer | Fewer |
| Bigger type or more content | Bigger type |
| An illustration or a real screenshot | The screenshot (or no image at all) |
| A new slide or merging two | A new slide, if it holds one idea; otherwise cut |
| Centred or left-aligned | Left-aligned |
| Adding pink or not | Not |
| Light deck or dark deck | Dark, unless the content is mostly light screenshots |
| A clever line or a plain one | The plain one with a number in it |
| Keeping a weak slide for count | Cut it. 9 strong slides beat 12 with filler |

## Never

These are the marks of a generic, AI-made carousel. Each one is a reason to redo a slide.

- Bold text, all-caps headlines, title case
- Gradients, glows, drop shadows, glassmorphism (the swipe pill is the one sanctioned frosted element and the frame draws it)
- Rounded cards or rounded images (everything is sharp)
- Emoji on slides, icon rows, ticks and crosses as decoration
- Colours outside black, white, zinc and pink. No "brand blue", no green/red unless it's a real pass/fail or delta
- Centred paragraphs, justified text, text over busy images
- Three bullets of equal weight where one sentence would do
- "Tips", "hacks", "secrets", "ultimate guide", "game-changer"
- Arrows pointing at things that are already obvious
- A logo larger than the header wordmark, or a second logo lockup on a slide
- Tool logos at random sizes (use `.chip` text or a single `.tile`)
- "Follow for more" or "Like and repost" on a slide

## Good and bad, side by side

`<dim>…</dim>` marks the dim half of a two-tone line (`<span class="dim">` in the deck).

**Cover**
- Bad: "5 Tips For A Successful Website Migration In 2026 🚀" (title case, emoji, generic)
- Good: "Your redesign <dim>will lose traffic.</dim>" with lead "Unless you map every URL first."

**Statement slide**
- Bad: a 56px headline, three bullets and a stock photo
- Good: one 100px two-tone sentence, an eyebrow, and empty space

**Data slide**
- Bad: a bar chart with five colours, a legend and a caption paragraph
- Good: `.mega` "87%" with an eyebrow saying what it measures and one line of context with its source

**Proof slide**
- Bad: "We deliver high-performance websites for ambitious brands"
- Good: a crop-marked screenshot of the live site and "Same URLs. <dim>New site.</dim>"

**Last slide**
- Bad: "Thanks for reading! Follow us for more tips 👇"
- Good: a three-line recap list, then "What broke in <dim>your last migration?</dim>", then the CTA box

## The phone test

The contact sheet that `render.mjs` produces shows every slide at about the size of a phone feed. Look at it before you look at the full-size slides. At that size:

- Can you read every headline without zooming? If not, it's too long or too small.
- Squint. Does each slide have one obvious focal point? If two things compete, demote one.
- Do the slides look like one deck? If one jumps out for the wrong reason, bring it back into line.
- Does the cover beat the other eleven? It should be the boldest, simplest slide in the set.
