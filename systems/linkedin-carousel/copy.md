# Copy: story, slides and caption

Writing comes before layout. Write the whole deck as plain text first (one line per slide), read it top to bottom, cut, and only then build it.

The voice is Roboto's: British, dry, understated, half the words you think you need. Posts usually go out from Jono's profile, so captions are first person and blunt. The writing rules in [reports.md](https://robotostudio.com/design/reports.md) apply in full; the ones that bite most here are repeated below.

## 1. Pick the topic: real work over advice

What our research found (details in [research.md](research.md)):

- The top posts in our niche showed **real work**: "here's my actual workflow" (872 reactions) and "here's a client site we rebuilt" (136). Advice decks did worse.
- Pure CMS comparison decks did worst (best one: 32 reactions). Don't lead with jargon.
- **Buyer pain** works: losing traffic in a redesign, the site breaking when it's handed to the content team, AI-built sites that all look the same.

So ask, in this order:
1. Do we have real work to show (a rebuild, a workflow, a Studio, a before/after, a number from a real project)? Use it.
2. If not, what costs a buyer money or sleep, and what do we know about it that they don't?
3. Only then, an opinion or a framework.

## 2. Pick a format

Each format is an arc, not a template. The slide counts are guides; the total should land at **9 to 12**.

| Format | When | Arc |
|---|---|---|
| **Workflow** | We have a process worth copying | Cover (the outcome) · the old way and its cost · step 1…N, one per slide, each with a real artefact · the result · recap · question |
| **Rebuild** (case study) | A client project with screenshots | Cover (client + outcome) · who they are, one line · the problem, 1-2 slides · what we changed, 3-4 slides with real screens · the result (`.mega`) · what we'd tell you · question |
| **Bad vs good** | A common, costly mistake area | Cover · why it matters · 5-8 identical `.compare` slides · recap · question |
| **Numbered rules / mistakes** | A checklist people will save | Cover with the count · 6-9 identical rule slides (eyebrow index, two-tone rule, one line or artefact) · recap · question |
| **One argument** | A reframe we believe in | Cover (the claim) · the common belief · why it fails, 2-3 slides · the alternative, 2-3 slides · proof · question |
| **Teardown** | A public site or pattern worth dissecting | Cover · the screenshot whole · 4-6 crops, one observation each · the fix · question |

X vs Y tool comparisons only work framed as buyer pain ("Your website doesn't need the best CMS"), never as a feature table.

## 3. The cover

The cover decides everything. It is the only slide most people see.

- **3 to 10 words** in the display line, split two-tone. Optional lead line under it, 4 to 10 words.
- It must contain one of: a number, a pain, an outcome, or a claim someone could disagree with.
- An eyebrow above it sets the context (series name, topic).
- It's the boldest, emptiest slide in the deck.

Hook patterns that fit the voice:

| Pattern | Example |
|---|---|
| Consequence | "Your redesign <dim>will lose traffic.</dim>" |
| Real work | "How we rebuilt <dim>[client] in six weeks.</dim>" |
| Count + promise | "Nine checks <dim>before you switch DNS.</dim>" |
| Reframe | "Your CMS is fine. <dim>Your content model isn't.</dim>" (only if the next slide proves it) |
| Before/after number | "3 weeks <dim>to 20 seconds.</dim>" (only with a confirmed figure) |

Avoid: questions on the cover ("Is your website losing traffic?"), "Ultimate guide", years ("in 2026"), and anything that needs the caption to make sense.

## 4. Slide copy

**Word budgets** (the lint enforces the hard limits):

| Slide | Budget |
|---|---|
| Cover | 3-10 words |
| Statement | 6-20 words |
| List | heading 2-6 words, items 2-6 words each, 3-5 items |
| Compare | 6-16 words per half |
| Artefact (screenshot, receipt) | heading 2-8 words; the artefact does the talking |
| Any slide | aim for under 25, warn at 32, hard stop at 50 |

Rules:
- **Lead with the claim or the number.** Context after, only if it earns its place.
- **Concrete nouns.** "301 redirects", "Sanity Studio", "the pricing page", not "solutions", "experiences", "the platform".
- **Sentence case** everywhere. Full stops on statements; none on labels or list items.
- **No em dashes.** Use a comma, colon, full stop, parentheses or a hyphen.
- **No negative parallelism.** Avoid "It's not X, it's Y" and "X, not Y". Say the true thing directly: "Google ranks URLs", not "Google ranks URLs, not designs".
- **No filler.** Cut: robust, seamless, comprehensive, elevate, unlock, empower, leverage, game-changer, cutting-edge, supercharge, "in today's digital landscape".
- **No exclamation marks, emoji or hashtags** on slides.
- **Labels** (eyebrows) are 1-4 words. They name the slide; they don't repeat the headline.
- **Don't summarise what you just said**, except on the one recap slide.

## 5. Facts

- **Never invent a number, client, quote or result.** If the brief doesn't give you a figure, write the slide without one or write `TBC` and list it in `caption.md` under "Needs confirming".
- Every number on a slide needs a source and date range, in the caption or a small `.label` on the slide.
- Claims marked TBC in [research.md](research.md) (for example "3 weeks to about 20 seconds") stay TBC until Clark or Jono confirms them.
- Client names and screenshots need permission. Flag them for confirmation.

## 6. The last two slides

1. **Recap** (optional but recommended for list formats): a `.list.compact` of the 3-5 takeaways, `.done` squares. This is the slide people save.
2. **Question + CTA**: one question people can answer from their own experience, in two-tone, then the `.cta-box` with `robotostudio.com` and "Get in touch". The frame hides the swipe pill on the last slide.

Good questions: "What broke in <dim>your last migration?</dim>", "Which of these <dim>did you learn the hard way?</dim>"
Bad questions: "Thoughts?", "Agree?", "What do you think about headless CMS?"

## 7. The caption

The caption is posted with the PDF and written to `caption.md` beside the deck. About 80-200 words.

Structure:
1. **Line 1**: a blunt first-person claim or a credibility line. It must work alone, because LinkedIn truncates after about 210 characters. (for example "We've moved [n] sites to Sanity. The redesign is never what loses the traffic.", with [n] a confirmed figure)
2. **Line 2**: a short reframe or the stakes.
3. **The list**: the deck's points, one line each, prefixed with `→` or numbers. Mirror the slides; don't add new material.
4. **One proof line** if we have one (a real number, a client, "forked 40 times").
5. **One question** to close, the same as or close to the last slide.

Rules: no hashtags (the top post had none), no emoji in the body (`→` is fine), no "♻️ Repost", no "Follow for more", short paragraphs of 1-2 lines, and the same writing rules as the slides.

`caption.md` template:

```markdown
# <deck title>

## Caption

<line 1>
<line 2>

→ <point>
→ <point>
→ <point>

<proof line>

<question>

## Needs confirming
- <every TBC figure, client name, screenshot permission; "None" if none>

## Alt text
<one sentence describing the carousel for the document's accessibility text>
```
