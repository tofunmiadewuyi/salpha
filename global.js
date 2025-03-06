// v.1.3

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
lenis.on("scroll", ScrollTrigger.refresh);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
