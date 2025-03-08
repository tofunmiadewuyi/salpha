// v.1.6

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

const lenis = new Lenis({
  duration: 1.25,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on("scroll", ScrollTrigger.update);

const updateScroll = () => {
  ScrollTrigger.refresh(true);
  setTimeout(() => {
    lenis.resize();
  }, 1000);
};

window.addEventListener("resize", () => {
  updateScroll();
});

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

window.onbeforeunload = function () {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

class StickySection {
  constructor(opts) {
    this.section = this.getNode(opts.section);
    this.preceeding = this.getNode(opts.preceeding);

    gsap.set(this.section, { y: "-50vh" });
    this.init();
  }

  init() {
    ScrollTrigger.create({
      trigger: this.preceeding,
      start: `bottom bottom`,
      end: "bottom center",
      pin: this.section,
      pinSpacing: false,
    });
  }

  getNode(arg) {
    if (arg instanceof Node) return arg;
    else return document.querySelector(arg);
  }
}
