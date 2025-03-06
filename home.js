// v.1.3

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

const sunEl = document.querySelector(".c-sun");

lenis.stop();
gsap
  .timeline()
  .fromTo(
    sunEl,
    {
      marginBottom: "0px",
    },
    {
      marginBottom: "-375px",
      duration: 1.5,
      ease: "power2.inOut",
      delay: 1.5,
      onComplete: () => {
        lenis.start();
        initSun();
      },
    }
  )
  .to(".sun-eclipse", { yPercent: 20 }, "<")
  .from(".sun-glow, .sun-el", { scale: 0.7, y: 15 }, "<")
  .to(".sun-eclipse", { scale: 0 }, "<+=0.2")
  .fromTo(
    ".hero-content > *",
    {
      translateZ: "90px",
      rotateX: "60deg",
      scale: 1.2,
      opacity: 0,
      yPercent: 10,
    },
    {
      opacity: 1,
      translateZ: "0px",
      rotateX: "5deg",
      scale: 1,
      stagger: 0.15,
      yPercent: 0,
      ease: "power2.out",
    },
    "<+=1"
  );

function initSun() {
  const sunTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".home-slider",
      start: "top bottom",
      end: `bottom bottom`,

      scrub: 1.5,
      id: "sunScroll",
      onUpdate: (self) => {
        // fade out the sun
        if (self.progress >= 0.9) {
          const opacityProgress = 1 - (self.progress - 0.9) * 10;
          const blurAmount = Math.min(80, (1 - opacityProgress) * 80);

          gsap.set(sunEl, {
            opacity: Math.max(0, opacityProgress),
            filter: `blur(${blurAmount}px)`,
          });
        } else {
          // Keep opacity at 1 for the first 80%
          gsap.set(sunEl, { opacity: 1, filter: "blur(0px)" });
        }
      },
    },
  });

  sunTl
    .to(sunEl, {
      marginBottom: "125px",
      scale: 0.23,
      ease: "none",
    })
    .to(
      ".sun-el, .sun-glow",
      {
        backgroundColor: "#FFBF5A",
      },
      "<"
    );

  gsap.to(
    ".slider-mask",
    {
      scrollTrigger: {
        trigger: ".home-slider",
        // markers: true,
        scrub: 1,
        start: "top bottom",
      },
      backgroundPosition: "0 100%",
      ease: "power2.inOut",
    },
    "<"
  );

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    if (sliderST) sliderST.kill();
  });
}

const stickyHeaders = document.querySelectorAll(".sticky-header");
stickyHeaders.forEach((header) => {
  ScrollTrigger.create({
    trigger: header,
    start: `top-=${header.offsetHeight} bottom`,
    end: (self) => self.start + header.offsetHeight * 2,
    pin: header,
    pinSpacing: false,
    onUpdate: () => {
      gsap.set(header, { yPercent: -105 });
    },
    onComplete: () => {
      gsap.set(header, { yPercent: 0 });
      lenis.resize();
    },
  });
});
