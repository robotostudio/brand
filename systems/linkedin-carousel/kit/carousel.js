// Roboto Studio LinkedIn carousel kit: draws the frame on every <section class="slide">.
// Decks contain content only. Knobs:
//   <body data-author="company|jono|…">                         posting account, from authors/authors.js (default company)
//   <body data-theme="dark|light" data-series="Field notes">   header meta text (company decks only)
//   <section class="slide" data-meta="Cover">                   overrides the header meta for one slide
//   <section class="slide" data-swipe="Keep going">              overrides the swipe label for one slide
//   <section class="slide" data-chrome="bare">                   rails only, no header or footer text
//   <div class="signature"></div>                               filled with the author's headshot, name, role and URL
(() => {
  const chevron =
    '<svg class="chev" viewBox="0 0 9 15" aria-hidden="true">' +
    '<rect x="0" y="0" width="3" height="3"/><rect x="3" y="3" width="3" height="3"/>' +
    '<rect x="6" y="6" width="3" height="3"/><rect x="3" y="9" width="3" height="3"/>' +
    '<rect x="0" y="12" width="3" height="3"/></svg>';

  const pad = (n) => String(n).padStart(2, "0");
  const slides = [...document.querySelectorAll(".slide")];
  const series = document.body.dataset.series || "";

  // Posting account. Person accounts put the author in the header and the wordmark on the right.
  const authors = window.ROBOTO_AUTHORS || {};
  const authorKey = document.body.dataset.author || "company";
  const author = authors[authorKey] || (authorKey === "company" ? { kind: "company" } : null);
  if (!author) document.documentElement.dataset.authorError = authorKey;
  const isPerson = author?.kind === "person";

  const registry = [...document.scripts].find((s) => /authors\/authors\.js(\?|$)/.test(s.src));
  const avatarUrl = (a) => (a.avatar && registry ? new URL(a.avatar, registry.src).href : "");
  const initials = (name) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
  const byline = (a, cls = "byline", role = a.role || "", withFace = true) => {
    const face = !withFace ? "" : avatarUrl(a)
      ? `<img class="face" src="${avatarUrl(a)}" alt="">`
      : `<span class="face initials">${initials(a.name)}</span>`;
    return `<div class="${cls}">${face}<div class="who"><span class="name">${a.name}</span><span class="role">${role}</span></div></div>`;
  };

  slides.forEach((slide, i) => {
    const frame = document.createElement("div");
    frame.className = "frame";
    frame.innerHTML = '<div class="rule top"></div><div class="rule bottom"></div>';
    slide.prepend(frame);

    if (slide.dataset.chrome === "bare") return;

    const last = i === slides.length - 1;
    const meta = slide.dataset.meta ?? series;
    const logo = '<div class="logo" role="img" aria-label="Roboto Studio"></div>';

    const head = document.createElement("div");
    head.className = "chrome-head";
    // A slide with its own large .cover-byline keeps the wordmark only, so the byline is not drawn twice.
    const ownByline = isPerson && slide.querySelector(".cover-byline");
    head.innerHTML = isPerson ? (ownByline ? `<span></span>${logo}` : `${byline(author)}${logo}`) : `${logo}<div class="meta">${meta}</div>`;

    const foot = document.createElement("div");
    foot.className = "chrome-foot";
    const swipe = last ? "" : `<div class="swipe">${slide.dataset.swipe || "Swipe"}${chevron}</div>`;
    foot.innerHTML = `<div class="counter">${pad(i + 1)} / ${pad(slides.length)}</div>${swipe}`;

    slide.append(head, foot);
  });

  // Large byline on the cover of a person's deck. Company decks drop the placeholder.
  document.querySelectorAll(".cover-byline").forEach((el) => {
    if (!isPerson) { el.remove(); return; }
    el.innerHTML = byline(author, "byline large", author.role ? `${author.role}, Roboto Studio` : "Roboto Studio");
  });

  // Signature card for the last slide of a person's deck
  document.querySelectorAll(".signature").forEach((el) => {
    if (!isPerson) return;
    const withFace = !el.classList.contains("no-face");
    el.innerHTML = `${byline(author, "byline large", author.role ? `${author.role}, Roboto Studio` : "Roboto Studio", withFace)}<span class="h3 url">robotostudio.com ${chevron}</span>`;
  });

  // Inline chevrons wherever a deck writes <i class="chev"></i>
  document.querySelectorAll("i.chev").forEach((el) => (el.outerHTML = chevron));

  // Screen preview: shrink slides to fit narrow windows. Never during render or print.
  if (!navigator.webdriver) {
    const fit = () => (document.body.style.zoom = Math.min(1, (innerWidth - 48) / 1080));
    fit();
    addEventListener("resize", fit);
    addEventListener("beforeprint", () => (document.body.style.zoom = 1));
    addEventListener("afterprint", fit);
  }

  document.documentElement.dataset.ready = "1";
})();
