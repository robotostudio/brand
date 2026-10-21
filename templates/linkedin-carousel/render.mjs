#!/usr/bin/env node
// Render a carousel deck to the LinkedIn PDF, per-slide PNGs and a phone-scale contact sheet,
// then lint it against the system's rules.
//
//   node templates/linkedin-carousel/render.mjs carousels/<slug>/deck.html
//
// Writes beside the deck:
//   out/<slug>.pdf          the file you upload to LinkedIn (one 1080x1350 page per slide)
//   out/slides/NN.png       each slide at full size
//   out/contact-sheet.png   every slide at roughly phone size (390px wide). Look at this.
// Exit code 1 when the lint finds errors. Warnings are judgement calls; read them anyway.

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node templates/linkedin-carousel/render.mjs <path/to/deck.html>");
  process.exit(2);
}

const deckPath = path.resolve(input);
const deckDir = path.dirname(deckPath);
const slug = path.basename(deckDir);
const outDir = path.join(deckDir, "out");
const slidesDir = path.join(outDir, "slides");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(slidesDir, { recursive: true });

const W = 1080;
const H = 1350;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(deckPath).href, { waitUntil: "networkidle" });
await page.waitForFunction(() => document.documentElement.dataset.ready === "1", null, { timeout: 10000 }).catch(() => {});
await page.evaluate(() => document.fonts.ready);

// ---------- Lint ----------

const report = await page.evaluate(() => {
  const PINK = "rgb(255, 0, 168)";
  const BANNED = ["robust", "seamless", "comprehensive", "elevate", "unlock", "empower", "leverage",
    "game-changer", "game changer", "cutting-edge", "next-level", "supercharge", "revolutionise",
    "revolutionize", "in today's digital landscape", "delve", "synergy", "best-in-class"];
  const slides = [...document.querySelectorAll(".slide")];
  const deck = { errors: [], warnings: [] };
  const per = [];
  let pinkTotal = 0;

  if (!document.fonts.check("40px Geist")) deck.errors.push("Geist did not load. Check the network and the @import in carousel.css.");
  if (slides.length < 8) deck.warnings.push(`${slides.length} slides. 9-12 performs best; fewer than 8 reads as thin.`);
  if (slides.length > 14) deck.warnings.push(`${slides.length} slides. Past 14, cut or split into two posts.`);

  const ownText = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();

  slides.forEach((slide, i) => {
    const errors = [];
    const warnings = [];
    const content = slide.querySelector(".content");
    if (!content) { errors.push("No .content element."); per.push({ errors, warnings, words: 0 }); return; }
    const box = content.getBoundingClientRect();
    const cs0 = getComputedStyle(content);
    const inner = { left: box.left + parseFloat(cs0.paddingLeft), right: box.right - parseFloat(cs0.paddingRight) };

    // Overflow past the frame
    if (content.scrollHeight > content.clientHeight + 2) errors.push(`Content is ${content.scrollHeight - content.clientHeight}px taller than the slide allows. Cut copy or shrink a block.`);
    content.querySelectorAll("*").forEach((el) => {
      if (el.closest(".tex")) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const out = r.left < box.left - 20 || r.right > box.right + 20 || r.top < box.top - 20 || r.bottom > box.bottom + 20;
      if (out && ownText(el)) errors.push(`"${ownText(el).slice(0, 40)}" runs outside the frame.`);
      else if (ownText(el) && (r.left < inner.left - 8 || r.right > inner.right + 8) && !el.closest(".shot, .compare, .cells, .receipt, .cta-box")) {
        warnings.push(`"${ownText(el).slice(0, 40)}" crowds the rail. Size it down (.mega.long, a smaller heading class) or shorten it.`);
      }
      const cs = getComputedStyle(el);
      if ((cs.overflow === "hidden" || cs.overflowX === "hidden") && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2) && el.textContent.trim()) {
        errors.push(`Text is clipped inside .${[...el.classList].join(".") || el.tagName.toLowerCase()}. Shorten lines or give it more room.`);
      }
    });

    // Per-element type checks
    let pink = 0;
    slide.querySelectorAll("*").forEach((el) => {
      const t = ownText(el);
      if (!t) return;
      const cs = getComputedStyle(el);
      if (parseFloat(cs.fontSize) < 24) errors.push(`"${t.slice(0, 30)}" is ${cs.fontSize}. Nothing under 24px; it is unreadable on a phone.`);
      if (parseInt(cs.fontWeight, 10) > 500) errors.push(`"${t.slice(0, 30)}" is weight ${cs.fontWeight}. Nothing is bold; strong is 500.`);
      if (cs.color === PINK) pink++;
    });
    pinkTotal += pink;
    if (pink > 1) warnings.push(`${pink} pink elements. One pink moment per slide at most.`);

    // Images
    slide.querySelectorAll("img").forEach((img) => { if (!img.complete || !img.naturalWidth) errors.push(`Image did not load: ${img.getAttribute("src")}`); });

    // Copy checks
    const text = content.innerText;
    if (text.includes("—")) errors.push("Em dash found. Use a comma, colon, parentheses or a hyphen.");
    if (/\s–\s/.test(text)) warnings.push("Spaced en dash found. Prefer a comma, colon or hyphen.");
    if (text.includes("!")) warnings.push("Exclamation mark. The voice is dry; remove it.");
    if (/\p{Extended_Pictographic}/u.test(text)) warnings.push("Emoji on a slide. Keep emoji out of slides.");
    if (/(^|\s)#\w/.test(text)) warnings.push("Hashtag on a slide.");
    BANNED.forEach((w) => { if (text.toLowerCase().includes(w)) warnings.push(`Filler word "${w}".`); });

    content.querySelectorAll(".display, .h1, .h2, .h3, .list > li > span:not(.n), .quote").forEach((h) => {
      const words = h.innerText.split(/\s+/).filter((w) => /^[A-Za-z]{4,}/.test(w));
      if (words.length >= 3 && words.every((w) => /^[A-Z]/.test(w))) warnings.push(`"${h.innerText.slice(0, 40)}" looks like title case. Use sentence case.`);
    });

    // Word budget (machine strings in receipts, chips, labels and browser bars do not count)
    const clone = content.cloneNode(true);
    clone.querySelectorAll(".receipt, .chip, .label, .eyebrow, .bar, .caption, [data-lint-ignore]").forEach((n) => n.remove());
    const words = (clone.textContent.match(/[\p{L}\p{N}][\p{L}\p{N}'’.%-]*/gu) || []).length;
    if (i === 0 && words > 12) warnings.push(`Cover has ${words} words. Aim for 3-10.`);
    if (i > 0 && words > 50) errors.push(`${words} words. Over 50 is a document page, not a slide. Split it.`);
    else if (i > 0 && words > 32) warnings.push(`${words} words. Most slides should land under 25.`);

    per.push({ errors, warnings, words });
  });

  if (pinkTotal > 5) deck.warnings.push(`${pinkTotal} pink moments across the deck. Pink is rare; aim for 2-4.`);
  return { deck, per, count: slides.length };
});

// ---------- Render ----------

const handles = await page.$$(".slide");
for (let i = 0; i < handles.length; i++) {
  await handles[i].screenshot({ path: path.join(slidesDir, `${String(i + 1).padStart(2, "0")}.png`) });
}

const pdfPath = path.join(outDir, `${slug}.pdf`);
await page.emulateMedia({ media: "print" });
await page.pdf({ path: pdfPath, width: `${W}px`, height: `${H}px`, printBackground: true, preferCSSPageSize: true });

// Contact sheet at phone scale: if it reads here, it reads in the feed.
const thumbs = fs.readdirSync(slidesDir).filter((f) => f.endsWith(".png")).sort();
const cols = Math.min(5, thumbs.length);
const sheet = `<!doctype html><html><body style="margin:0;background:#2a2a2e;padding:24px;display:grid;grid-template-columns:repeat(${cols},390px);gap:20px;font:12px ui-monospace,monospace;color:#aaa">
${thumbs.map((f) => `<figure style="margin:0"><img src="${pathToFileURL(path.join(slidesDir, f)).href}" style="width:390px;height:487.5px;display:block"><figcaption style="padding-top:6px">${f.replace(".png", "")}</figcaption></figure>`).join("")}
</body></html>`;
const sheetPage = await browser.newPage({ viewport: { width: cols * 410 + 28, height: 600 }, deviceScaleFactor: 1 });
const sheetHtml = path.join(outDir, ".contact-sheet.html");
fs.writeFileSync(sheetHtml, sheet);
await sheetPage.goto(pathToFileURL(sheetHtml).href, { waitUntil: "load" });
await sheetPage.screenshot({ path: path.join(outDir, "contact-sheet.png"), fullPage: true });
fs.rmSync(sheetHtml);

await browser.close();

// ---------- Report ----------

const rel = (p) => path.relative(process.cwd(), p);
let errorCount = report.deck.errors.length;
console.log(`\n${slug}: ${report.count} slides`);
report.deck.errors.forEach((e) => console.log(`  ERROR  deck: ${e}`));
report.deck.warnings.forEach((w) => console.log(`  warn   deck: ${w}`));
report.per.forEach((s, i) => {
  const n = String(i + 1).padStart(2, "0");
  [...new Set(s.errors)].forEach((e) => { errorCount++; console.log(`  ERROR  ${n}: ${e}`); });
  [...new Set(s.warnings)].forEach((w) => console.log(`  warn   ${n}: ${w}`));
});
console.log(`  words per slide: ${report.per.map((s) => s.words).join(" · ")}`);
console.log(`\n  PDF            ${rel(pdfPath)}`);
console.log(`  Contact sheet  ${rel(path.join(outDir, "contact-sheet.png"))}`);
console.log(`  Slides         ${rel(slidesDir)}/\n`);
if (errorCount) {
  console.log(`  ${errorCount} error(s). Fix them and render again.\n`);
  process.exit(1);
}
