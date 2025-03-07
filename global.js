// v.1.5

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

const stickyHeaders = document.querySelectorAll(".sticky-header");
stickyHeaders.forEach((header) => {
  ScrollTrigger.create({
    trigger: header,
    start: `top-=${header.offsetHeight} bottom`,
    end: "bottom bottom",
    pin: header,
    pinSpacing: false,
    onUpdate: (self) => {
      if (self.progress < 0.1)
        gsap.set(header, { yPercent: -105 * self.progress });
      else gsap.set(header, { yPercent: -105 });
    },
    onComplete: () => {
      gsap.set(header, { yPercent: 0 });
    },
  });
});
