// v.1.4

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
