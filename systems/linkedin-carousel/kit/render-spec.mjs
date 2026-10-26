#!/usr/bin/env node
// Spec in, slides out. Writes deck.html from spec.json, then renders it with the
// system's carousel.css, carousel.js and authors/ (fonts and logos stay in assets/shared).
//
//   node systems/linkedin-carousel/kit/render-spec.mjs [--strict] <spec.json> [--out <dir>]
//
// Default output is <spec-folder>/out/:
//   01.png, 02.png ...   each slide at 1080x1350
//   carousel.pdf         one 1080x1350 page per slide (the LinkedIn document upload)
//   preview.png          contact sheet at phone scale (390px wide). Look at this.
//   deck.html            generated source. Open over http via serve.py; do not commit it.
//
// Exit 1 on lint errors, or on warnings when --strict is set.
// Repo defaults (omit spec.rules): 9-12 slides, and a last slide that matches the account
// (company: Get in touch CTA; person: author signature card). Opt out in spec.rules.

import { chromium } from "playwright";
import hljs from "highlight.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const KIT = path.dirname(fileURLToPath(import.meta.url));
const SYSTEM = path.resolve(KIT, "..");
const ASSETS = {
  css: path.join(KIT, "carousel.css"),
  extra: path.join(KIT, "kit-extra.css"),
  js: path.join(KIT, "carousel.js"),
  authors: path.join(SYSTEM, "authors", "authors.js"),
};

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const outIdx = args.indexOf("--out");
const outArg = outIdx >= 0 ? args[outIdx + 1] : null;
const input = args.find((a, i) => !a.startsWith("--") && (outIdx < 0 || i !== outIdx + 1));
if (!input || (outIdx >= 0 && !outArg)) {
  console.error("Usage: node systems/linkedin-carousel/kit/render-spec.mjs [--strict] <spec.json> [--out <dir>]");
  process.exit(2);
}

const specPath = path.resolve(input);
const specDir = path.dirname(specPath);
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
if (!Array.isArray(spec.slides) || spec.slides.length === 0) {
  console.error("spec.slides must be a non-empty array.");
  process.exit(2);
}

const authorKey = spec.author || "company";
const rules = resolveRules(spec, authorKey);
const name = spec.name || path.basename(specPath, ".json").replace(/^spec$/, path.basename(specDir));
const outDir = path.resolve(outArg || path.join(specDir, "out"));
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) {
  if (/^\d+\.png$|^carousel\.pdf$|^preview\.png$|^deck\.html$|^\.preview\.html$/.test(f)) fs.rmSync(path.join(outDir, f));
}

// ---------- helpers ----------
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Inline markup: [[dim words]]  {{pink word}}  `mono`  \n = line break
const md = (s = "") => esc(s)
  .replace(/\[\[(.+?)\]\]/gs, '<span class="dim">$1</span>')
  .replace(/\{\{(.+?)\}\}/gs, '<span class="pink">$1</span>')
  .replace(/`(.+?)`/g, '<span class="mono">$1</span>')
  .replace(/\n/g, "<br>");
const relTo = (abs) => path.relative(outDir, abs).split(path.sep).join("/");
const img = (p) => path.relative(outDir, path.resolve(specDir, p)).split(path.sep).join("/");
const eyebrow = (s, i) => s.eyebrow === false ? "" :
  `<div class="eyebrow">${s.idx !== false ? `<span class="idx">${esc(s.idx ?? String(i).padStart(2, "0"))}</span>` : ""}<span>${esc(s.eyebrow || "")}</span></div>`;
const heading = (s, cls, tag = "h2") => s.title ? `<${tag} class="${cls}">${md(s.title)}${s.dim ? ` <span class="dim">${md(s.dim)}</span>` : ""}</${tag}>` : "";
const lead = (s) => s.lead ? `<p class="lead ${s.leadMeasure ?? "measure"}">${md(s.lead)}</p>` : "";
const body = (s) => s.body ? `<p class="body measure">${md(s.body)}</p>` : "";
const source = (s) => s.source ? `<p class="label${s.sourcePush ? " push" : ""}">${esc(s.source)}</p>` : "";
const tex = (t) => t ? `<div class="tex ${t}"></div>` : "";
// Inline an SVG (masks and external SVG images can't be recoloured from file://). Strip <title> so it isn't read as slide text.
const inlineSvg = (p) => fs.readFileSync(path.resolve(specDir, p), "utf8")
  .replace(/<\?xml[^>]*>/, "")
  .replace(/<title>.*?<\/title>/s, "")
  .replace(/>\s+</g, "><")
  .trim();
// Texture as a flex child of a bottom-anchored .content: header rule to the eyebrow, rail to rail.
const texFill = (t) => t ? `<div class="tex-fill ${t.replace(/\b(top-half|bottom-half|full)\b/g, "").trim()}"></div>` : "";
// Optical size for a cover mark. Official SVGs don't share a visual weight, so a tile can scale the artwork inside its box.
const markScale = (l) => {
  const n = Number(l.scale);
  return Number.isFinite(n) && n > 0 ? ` style="transform:scale(${n})"` : "";
};

function resolveRules(spec, authorKey) {
  const r = spec.rules || {};
  const person = authorKey !== "company";
  const raw = r.closing ?? (person ? "signature" : "cta");
  const closing = raw === "author" ? "signature" : raw;
  if (!["cta", "signature", "none"].includes(closing)) {
    console.error(`rules.closing must be "cta", "signature", "author" or "none" (got "${raw}").`);
    process.exit(2);
  }
  const minSlides = Number(r.minSlides ?? 9);
  const maxSlides = Number(r.maxSlides ?? 12);
  if (!Number.isInteger(minSlides) || !Number.isInteger(maxSlides) || minSlides < 1 || maxSlides < minSlides) {
    console.error("rules.minSlides and rules.maxSlides must be integers, minSlides >= 1, maxSlides >= minSlides.");
    process.exit(2);
  }
  return { minSlides, maxSlides, closing };
}

function code(s) {
  const lang = s.lang && hljs.getLanguage(s.lang) ? s.lang : null;
  const src = String(s.code).replace(/\s+$/, "");
  let html = lang ? hljs.highlight(src, { language: lang }).value : hljs.highlightAuto(src).value;
  // Keep spans balanced per line so each line can be its own block.
  const lines = []; let open = [];
  for (const raw of html.split("\n")) {
    const pre = open.join("");
    const tags = raw.match(/<span[^>]*>|<\/span>/g) || [];
    for (const t of tags) t.startsWith("</") ? open.pop() : open.push(t);
    lines.push(pre + raw + "</span>".repeat(open.length));
  }
  const focus = new Set(s.focus || []);
  if (s.pink) lines.forEach((l, i) => (lines[i] = l.split(esc(s.pink)).join(`<span class="p">${esc(s.pink)}</span>`)));
  const cls = ["code", "grow", s.numbers !== false ? "numbered" : "", focus.size ? "has-focus" : ""].join(" ");
  return `<pre class="${cls}">${lines.map((l, i) => `<span class="ln${focus.has(i + 1) ? " focus" : ""}">${l || " "}</span>`).join("")}</pre>`;
}

// ---------- layouts ----------
const L = {
  cover: (s) => s.logos
    ? `<div class="content cover-visual">
    <div class="logo-row">${s.logos.map((l) => l.sep ? `<span class="logo-sep">${esc(l.sep)}</span>` :
      `<figure class="logo-tile${l.out ? " out" : ""}${l.wide ? " wide" : ""}"><div class="box"><span class="crop"></span>${l.out ? '<span class="strike"></span>' : ""}<div class="mark" role="img" aria-label="${esc(l.label)} logo"${markScale(l)}>${inlineSvg(l.image)}</div></div><figcaption class="label">${esc(l.label)}</figcaption></figure>`).join("")}</div>
    <div class="stack push">${eyebrow({ ...s, idx: s.idx ?? s.series ?? false }, 0)}${heading(s, s.size || "display", "h1")}${lead({ leadMeasure: "measure-s", ...s })}${s.byline ? '<div class="cover-byline"></div>' : ""}</div></div>`
    : `<div class="content bottom">${texFill(s.texture ?? "tex-dots fade-lb")}${eyebrow({ ...s, idx: s.idx ?? s.series ?? false }, 0)}${heading(s, s.size || "display", "h1")}${lead({ leadMeasure: "measure-s", ...s })}${s.byline ? '<div class="cover-byline"></div>' : ""}</div>`,

  text: (s, i) => `${tex(s.texture)}
  <div class="content ${s.anchor || "center"}">${eyebrow(s, i)}${heading(s, s.size || "h1")}${lead(s)}${body(s)}${source({ sourcePush: s.anchor !== "center" && !!s.source, ...s })}</div>`,

  list: (s, i) => `<div class="content">${eyebrow(s, i)}${heading(s, s.size || "h2")}
    <ol class="list push${s.compact ? " compact" : ""}">${s.items.map((it, n) => `<li${s.done ? ' class="done"' : ""}><span class="n">${String(n + 1).padStart(2, "0")}</span><span>${md(it)}</span></li>`).join("")}</ol></div>`,

  stat: (s, i) => `${tex(s.texture)}<div class="content">${eyebrow(s, i)}<p class="mega${String(s.value).length > 4 ? " long" : ""}">${md(s.value)}</p>${heading(s, "h3 push")}${source(s)}</div>`,

  code: (s, i) => `<div class="content tight">${eyebrow(s, i)}${heading(s, s.size || "h2")}
    ${s.file ? `<div class="code-file"><span class="label">${esc(s.file)}</span><span class="label">${esc(s.lang || "")}</span></div>` : ""}${code(s)}${source(s)}</div>`,

  image: (s, i) => `<div class="content tight">${eyebrow(s, i)}${heading(s, s.size || "h2")}
    <div class="shot grow${s.url ? " browser" : ""}${s.fit ? " fit" : ""}"><span class="crop"></span>${s.url ? `<div class="bar">${esc(s.url)}</div><div class="view">` : ""}<img src="${img(s.image)}" alt="${esc(s.alt || "")}" style="object-position:${esc(s.position || "top left")}">${s.url ? "</div>" : ""}</div>${source(s)}</div>`,

  gallery: (s, i) => `<div class="content tight">${eyebrow(s, i)}${heading(s, s.size || "h2")}
    <div class="gallery" style="--cols:${s.cols || 2}">${s.items.map((it) => `<figure class="${it.wide ? "wide" : ""}"><img src="${img(it.image)}" alt="${esc(it.alt || it.label || "")}" style="object-position:${esc(it.position || "top left")}"><figcaption>${esc(it.label || "")}</figcaption></figure>`).join("")}</div>${source(s)}</div>`,

  beforeafter: (s, i) => `<div class="content tight">${eyebrow(s, i)}${heading(s, s.size || "h2")}
    <div class="ba">${[["is-bad", s.before], ["is-good", s.after]].map(([c, it]) => `<figure class="${c}"><figcaption><span class="t">${esc(it.label)}</span><span>${esc(it.meta || "")}</span></figcaption><img src="${img(it.image)}" alt="${esc(it.alt || it.label)}" style="object-position:${esc(it.position || "center")}"></figure>`).join("")}</div>${source(s)}</div>`,

  compare: (s, i) => `<div class="content tight">${eyebrow(s, i)}${heading(s, s.size || "h2")}
    <div class="compare"><div class="is-bad"><div class="label">${esc(s.before.label)}</div><p class="h3">${md(s.before.text)}</p></div>
    <div class="is-good"><div class="label">${esc(s.after.label)}</div><p class="h3">${md(s.after.text)}</p></div></div></div>`,

  diagram: (s, i) => `<div class="content${s.anchor ? " " + s.anchor : ""}">${eyebrow(s, i)}${heading(s, s.size || "h2")}
    <div class="diagram${s.grow ? " grow" : " push"}${s.loop ? " loop" : ""}">${s.steps.map((st, n) => `${n ? `<div class="wire">${st.via ? `<span class="label">${esc(st.via)}</span>` : ""}</div>` : ""}<div class="node${st.on ? " on" : ""}">${st.label ? `<span class="label">${esc(st.label)}</span>` : ""}<span class="h3">${md(st.text)}</span></div>`).join("")}${s.loop ? `<div class="loopback"><span class="tick top"></span><span class="tick bot"></span><span class="label">${esc(s.loop)}</span></div>` : ""}</div>${source(s)}</div>`,

  prompt: (s, i) => {
    const lbl = (n, t) => `<span class="label"><span class="n">${n}</span><span>${esc(t)}</span></span>`;
    let text = esc(s.prompt.text);
    if (s.prompt.typo) text = text.split(esc(s.prompt.typo)).join(`<span class="typo">${esc(s.prompt.typo)}</span>`);
    return `<div class="content tight">${eyebrow(s, i)}${heading(s, s.size || "h2")}
    <div class="pflow push">
      <div class="pstep">${lbl("01", s.link.label)}<div class="linkchip"><span class="url">${esc(s.link.text)}</span>${s.link.key ? `<span class="key">${esc(s.link.key)}</span>` : ""}</div></div>
      <div class="pwire"></div>
      <div class="pstep">${lbl("02", s.prompt.label)}<div class="bubble"><span class="caret">›</span><span class="text">${text}</span></div></div>
      <div class="pwire">${s.via ? `<span class="label">${esc(s.via)}</span>` : ""}</div>
      <div class="pstep">${lbl("03", s.result.label)}<div class="thumbs">
        <figure class="is-bad"><img src="${img(s.result.before)}" alt="${esc(s.result.beforeAlt || "Before")}"><figcaption>Before</figcaption></figure>
        <span class="to">→</span>
        <figure class="is-good"><img src="${img(s.result.after)}" alt="${esc(s.result.afterAlt || "After")}"><figcaption>After</figcaption></figure></div></div>
    </div>${source(s)}</div>`;
  },

  steps: (s, i) => {
    const lbl = (n, t) => `<span class="label"><span class="n">${n}</span><span>${esc(t)}</span></span>`;
    return `<div class="content tight">${eyebrow(s, i)}${heading(s, s.size || "h2")}
    <div class="pflow fill">${s.steps.map((st, n) => `${n ? `<div class="pwire">${st.via ? `<span class="label">${esc(st.via)}</span>` : ""}</div>` : ""}<div class="pstep shot-step">${lbl(String(n + 1).padStart(2, "0"), st.label)}<div class="shotbox"><img src="${img(st.image)}" alt="${esc(st.alt || st.label)}" style="object-position:${esc(st.position || "top left")}"></div></div>`).join("")}</div>${source(s)}</div>`;
  },

  flow: (s, i) => `<div class="content">${eyebrow(s, i)}${heading(s, s.size || "h2")}
    <ol class="flow push">${s.steps.map((st) => `<li${st.on ? ' class="on"' : ""}><span class="label">${esc(st.label || "")}</span><span class="h3">${md(st.text)}</span></li>`).join("")}</ol></div>`,

  // Repo default close for the company page. Opt out with rules.closing "none" or "signature".
  cta: (s, i) => `<div class="content ${s.anchor || ""}">${eyebrow(s, i)}${heading(s, s.size || "h2")}${lead(s)}
    <div class="cta-box push"><span class="label">${esc(s.url || "robotostudio.com")}</span><span class="h3">${md(s.cta || "Get in touch")} <i class="chev"></i></span></div></div>`,

  closing: (s, i) => `${(s.anchor || "bottom") === "bottom" ? "" : tex(s.texture)}<div class="content ${s.anchor || "bottom"}">${(s.anchor || "bottom") === "bottom" ? texFill(s.texture) : ""}${eyebrow(s, i)}${heading(s, s.size || "h1")}${lead(s)}
    ${s.signature ? `<div class="signature${s.face === false ? " no-face" : ""}"></div>` : `<div class="endline${s.anchor === "bottom" || !s.anchor ? "" : " push"}"><span class="label">${esc(s.sign ?? "robotostudio.com")}</span><div class="mark-tile" role="img" aria-label="Roboto Studio"></div></div>`}</div>`,
};

const slidesHtml = spec.slides.map((s, i) => {
  const fn = L[s.layout];
  if (!fn) throw new Error(`Slide ${i + 1}: unknown layout "${s.layout}". Use one of: ${Object.keys(L).join(", ")}`);
  const attrs = [s.meta != null ? `data-meta="${esc(s.meta)}"` : "", s.swipe ? `data-swipe="${esc(s.swipe)}"` : ""].filter(Boolean).join(" ");
  return `<section class="slide${s.invert ? " invert" : ""}"${attrs ? ` ${attrs}` : ""}>\n  ${fn(s, i)}\n</section>`;
}).join("\n\n");

const deck = `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><title>${esc(spec.title || name)}</title>
<link rel="stylesheet" href="${relTo(ASSETS.css)}">
<link rel="stylesheet" href="${relTo(ASSETS.extra)}">
</head>
<body data-author="${esc(authorKey)}" data-theme="${esc(spec.theme || "dark")}" data-series="${esc(spec.series || "")}">
${slidesHtml}
<script src="${relTo(ASSETS.authors)}"></script>
<script src="${relTo(ASSETS.js)}"></script>
</body></html>`;
const deckPath = path.join(outDir, "deck.html");
fs.writeFileSync(deckPath, deck);

// ---------- render ----------
const W = 1080, H = 1350;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const remote = new Set();
const pageErrors = [];
page.on("request", (r) => { if (!/^(file|data):/.test(r.url())) remote.add(r.url()); });
page.on("pageerror", (err) => pageErrors.push(err.message));
await page.goto(pathToFileURL(deckPath).href, { waitUntil: "networkidle" });
await page.waitForFunction(() => document.documentElement.dataset.ready === "1", null, { timeout: 10000 }).catch(() => {});
await page.evaluate(() => document.fonts.ready);

const report = await page.evaluate((rules) => {
  const errs = [], warns = [];
  if (!document.fonts.check("40px Geist")) errs.push("deck: Geist did not load.");
  const slides = [...document.querySelectorAll(".slide")];
  if (slides.length < rules.minSlides || slides.length > rules.maxSlides) {
    warns.push(`deck: ${slides.length} slides. The repo default is ${rules.minSlides}-${rules.maxSlides}. Set rules.minSlides and rules.maxSlides to use another length, and say so in the handover.`);
  }
  const last = slides[slides.length - 1];
  if (rules.closing === "cta" && last && !last.querySelector(".cta-box")) {
    warns.push('deck: no Get in touch CTA on the last slide. Company decks use layout "cta" unless rules.closing is "none" or "signature".');
  }
  if (rules.closing === "signature") {
    const key = document.body.dataset.author || "company";
    const person = !!(window.ROBOTO_AUTHORS && window.ROBOTO_AUTHORS[key] && window.ROBOTO_AUTHORS[key].kind === "person");
    if (!person) warns.push('deck: an author signature card is for a person account (jono, sne). Company decks use rules.closing "cta" or "none".');
    else if (last && !last.querySelector(".signature")) warns.push('deck: rules.closing is "signature" but the last slide has no signature card. Set "signature": true on the closing slide.');
  }
  slides.forEach((slide, i) => {
    const n = String(i + 1).padStart(2, "0");
    const c = slide.querySelector(".content");
    if (!c) { errs.push(`${n}: no .content element.`); return; }
    if (c.scrollHeight > c.clientHeight + 2) errs.push(`${n}: content overflows by ${c.scrollHeight - c.clientHeight}px. Cut copy or shrink a block.`);
    const box = c.getBoundingClientRect();
    slide.querySelectorAll("*").forEach((el) => {
      const own = [...el.childNodes].filter((x) => x.nodeType === 3).map((x) => x.textContent).join("").trim();
      if (!own) return;
      const cs = getComputedStyle(el);
      if (parseFloat(cs.fontSize) < 24) errs.push(`${n}: "${own.slice(0, 30)}" is ${cs.fontSize}; 24px minimum for phone legibility.`);
      if (parseInt(cs.fontWeight, 10) > 500) errs.push(`${n}: "${own.slice(0, 30)}" is bold; max weight 500.`);
      const r = el.getBoundingClientRect();
      if (c.contains(el) && !el.closest("pre.code") && r.width && (r.right > box.right + 4 || r.left < box.left - 4)) errs.push(`${n}: "${own.slice(0, 30)}" runs outside the frame.`);
    });
    slide.querySelectorAll("pre.code").forEach((p) => {
      if (p.scrollWidth > p.clientWidth + 2) errs.push(`${n}: a code line is wider than the block. Keep lines under about 40 characters.`);
      if (p.scrollHeight > p.clientHeight + 2) errs.push(`${n}: code is taller than the block. Keep it to about 12 lines.`);
    });
    slide.querySelectorAll("img").forEach((im) => { if (!im.complete || !im.naturalWidth) errs.push(`${n}: image did not load: ${im.getAttribute("src")}`); });
    const text = c.innerText;
    if (text.includes("\u2014")) errs.push(`${n}: em dash found. Use a comma, colon, parentheses or a hyphen.`);
    if (text.includes("!")) warns.push(`${n}: exclamation mark.`);
    if (/(^|\s)#\w/.test(text)) warns.push(`${n}: hashtag on a slide.`);
    if (/(^|\s)@\w/.test(text)) warns.push(`${n}: @mention on a slide.`);
    const clone = c.cloneNode(true);
    clone.querySelectorAll(".label, .eyebrow, pre, figcaption").forEach((x) => x.remove());
    const words = (clone.textContent.match(/[\p{L}\p{N}][\p{L}\p{N}'’.%-]*/gu) || []).length;
    if (words > 32) warns.push(`${n}: ${words} words. Aim for under 25.`);
  });
  return { errs, warns, count: slides.length };
}, rules);

pageErrors.forEach((e) => report.errs.push(`deck: page error: ${e}`));

const handles = await page.$$(".slide");
for (let i = 0; i < handles.length; i++) await handles[i].screenshot({ path: path.join(outDir, `${String(i + 1).padStart(2, "0")}.png`) });
await page.emulateMedia({ media: "print" });
await page.pdf({ path: path.join(outDir, "carousel.pdf"), width: `${W}px`, height: `${H}px`, printBackground: true, preferCSSPageSize: true });

const thumbs = fs.readdirSync(outDir).filter((f) => /^\d+\.png$/.test(f)).sort();
const cols = Math.min(4, thumbs.length) || 1;
const sheetHtml = path.join(outDir, ".preview.html");
fs.writeFileSync(sheetHtml, `<!doctype html><body style="margin:0;background:#2a2a2e;padding:24px;display:grid;grid-template-columns:repeat(${cols},390px);gap:20px;font:14px ui-monospace,monospace;color:#aaa">${thumbs.map((f) => `<figure style="margin:0"><img src="${f}" style="width:390px;height:487.5px;display:block"><figcaption style="padding-top:6px">${f.replace(".png", "")}</figcaption></figure>`).join("")}</body>`);
const sp = await browser.newPage({ viewport: { width: cols * 410 + 28, height: 600 } });
await sp.goto(pathToFileURL(sheetHtml).href, { waitUntil: "load" });
await sp.screenshot({ path: path.join(outDir, "preview.png"), fullPage: true });
fs.rmSync(sheetHtml);
await browser.close();

if (remote.size) report.warns.push(`deck: loaded ${remote.size} remote file(s), e.g. ${[...remote][0]}. Keep fonts, logos and images in the repo.`);
const rel = (p) => path.relative(process.cwd(), p);
const errs = [...new Set(report.errs)];
const warns = [...new Set(report.warns)];
console.log(`\n${name}: ${report.count} slides -> ${rel(outDir)}`);
console.log(`  rules    ${rules.minSlides}-${rules.maxSlides} slides, closing ${rules.closing}`);
errs.forEach((e) => console.log(`  ERROR  ${e}`));
warns.forEach((w) => console.log(`  warn   ${w}`));
console.log(`  PNGs     ${thumbs.join(", ")}`);
console.log(`  PDF      ${rel(path.join(outDir, "carousel.pdf"))}`);
console.log(`  Preview  ${rel(path.join(outDir, "preview.png"))}`);
console.log(`  checks   ${errs.length} error(s), ${warns.length} warning(s)\n`);
if (errs.length || (strict && warns.length)) process.exit(1);
