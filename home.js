console.log("salpha home");

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

const sunEl = document.querySelector(".c-sun");
gsap.fromTo(
  sunEl,
  {
    marginBottom: "0px",
    scale: 1,
  },
  {
    marginBottom: "-375px",
    duration: 1.5,
    ease: "power2.inOut",
    delay: 1.5,
    onComplete: () => {
      initSun();
    },
  }
);

function initSun() {
  const sunTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".home-slider",
      //   pin: ".c-sun",
      //   pinSpacing: false,
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
      //   opacity: 0,
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

  gsap
    .to(
      ".slider-mask",
      {
        scrollTrigger: {
          trigger: ".home-slider",
          markers: true,
          scrub: 1,
          start: "top bottom",
        },
        //   yPercent: -100,
        // opacity: 0,
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
