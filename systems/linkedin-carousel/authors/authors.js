// Posting accounts the frame knows about. One entry per authors/<key>.md profile.
// Decks pick one with <body data-author="key">. Avatar paths are relative to this folder.
// role is the job title alone: the header shows it next to the wordmark, the signature adds ", Roboto Studio".
// Load this file before kit/carousel.js.
window.ROBOTO_AUTHORS = {
  company: {
    kind: "company",
    name: "Roboto Studio",
  },
  jono: {
    kind: "person",
    name: "Jono Alford",
    role: "Founder",
    avatar: "img/jono.jpg",
  },
  sne: {
    kind: "person",
    name: "Sne Tripathi",
    role: "Account Executive",
    avatar: "img/sne.jpg",
  },
};
