// Roboto Studio LinkedIn carousel kit: draws the frame on every <section class="slide">.
// Decks contain content only. Knobs:
//   <body data-theme="dark|light" data-series="Field notes">   header meta text (optional)
//   <section class="slide" data-meta="Cover">                   overrides the header meta for one slide
//   <section class="slide" data-swipe="Keep going">              overrides the swipe label for one slide
//   <section class="slide" data-chrome="bare">                   rails only, no header or footer text
(() => {
  const chevron =
    '<svg class="chev" viewBox="0 0 9 15" aria-hidden="true">' +
    '<rect x="0" y="0" width="3" height="3"/><rect x="3" y="3" width="3" height="3"/>' +
    '<rect x="6" y="6" width="3" height="3"/><rect x="3" y="9" width="3" height="3"/>' +
    '<rect x="0" y="12" width="3" height="3"/></svg>';

  const pad = (n) => String(n).padStart(2, "0");
  const slides = [...document.querySelectorAll(".slide")];
  const series = document.body.dataset.series || "";

  slides.forEach((slide, i) => {
    const frame = document.createElement("div");
    frame.className = "frame";
    frame.innerHTML = '<div class="rule top"></div><div class="rule bottom"></div>';
    slide.prepend(frame);

    if (slide.dataset.chrome === "bare") return;

    const last = i === slides.length - 1;
    const meta = slide.dataset.meta ?? series;

    const head = document.createElement("div");
    head.className = "chrome-head";
    head.innerHTML = `<div class="logo" role="img" aria-label="Roboto Studio"></div><div class="meta">${meta}</div>`;

    const foot = document.createElement("div");
    foot.className = "chrome-foot";
    const swipe = last ? "" : `<div class="swipe">${slide.dataset.swipe || "Swipe"}${chevron}</div>`;
    foot.innerHTML = `<div class="counter">${pad(i + 1)} / ${pad(slides.length)}</div>${swipe}`;

    slide.append(head, foot);
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
