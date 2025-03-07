// v.1.5

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

const sunEl = document.querySelector(".c-sun");

const heroSection = document.querySelector('.section[section="hero"]');
const ctaSection = document.querySelector('.section[section="cta"]');

const sections = {
  hero: {
    el: heroSection,
    name: heroSection.getAttribute("section"),
    bounds: heroSection.getBoundingClientRect(),
  },
  cta: {
    el: ctaSection,
    name: ctaSection.getAttribute("section"),
    bounds: ctaSection.getBoundingClientRect(),
  },
};

lenis.stop();
introAnimation();

function introAnimation() {
  // intro animation (eclipse)
  gsap
    .timeline()
    .fromTo(
      sunEl,
      { marginBottom: "0px" },
      {
        marginBottom: "-375px",
        duration: 1.5,
        ease: "power2.inOut",
        delay: 1.5,
        onComplete: () => {
          lenis.start();
          initAnimation();
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
}

/**
 * to fix
 */

const sunHeroAnimation = gsap
  .timeline({
    paused: true,
    onUpdate: () => {
      // fade out the sun
      const progress = timelines.hero[0].progress(); // self-referencing, don't bother 😔
      if (progress >= 0.9) {
        const opacityProgress = 1 - (progress - 0.9) * 10;
        const blurAmount = Math.min(80, (1 - opacityProgress) * 30);

        gsap.set(sunEl, {
          opacity: Math.max(0, opacityProgress),
          filter: `blur(${blurAmount}px)`,
        });
      } else {
        gsap.set(sunEl, { opacity: 1, filter: "blur(0px)" }); // untouched until 90%
      }
    },
    onComplete: () => {
      gsap.set(sunEl, { marginBottom: "-375px", scale: 1 });
      gsap.set(".sun-el, .sun-glow", { backgroundColor: "#ffdd02" });
    },
  })
  .to(sunEl, {
    marginBottom: "125px",
    scale: 0.23,
    ease: "none",
  })
  .to(".sun-el, .sun-glow", { backgroundColor: "#FFBF5A" }, "<");

const sliderMaskAnimation = gsap
  .timeline({
    paused: true,
    onUpdate: () => {
      // remove the mask
      const progress = timelines.hero[1].progress(); // self-referencing, allow 🖐🏾
      if (progress >= 0.9) {
        const opacityProgress = 1 - (progress - 0.9) * 10;
        gsap.set(".slider-mask", {
          opacity: Math.max(0, opacityProgress),
        });
      } else {
        gsap.set(".slider-mask", { opacity: 1 }); // opacity at 1 until 90%
      }
    },
  })
  .to(".slider-mask", { backgroundPosition: "0 45%" });

const sunCtaAnimation = gsap
  .timeline({ paused: true })
  .to(sunEl, { opacity: 1 });

const timelines = {
  hero: [sunHeroAnimation, sliderMaskAnimation],
  cta: sunCtaAnimation,
};

const progressFactor = {
  hero: [0.21, 0.22],
  cta: 1,
};

let activeTimeline = null;

function initAnimation() {
  ScrollTrigger.create({
    trigger: ".page-wrapper",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    markers: true,
    onUpdate: (self) => {
      let currentSection = getActiveSection();
      if (currentSection && timelines[currentSection.name]) {
        if (activeTimeline !== timelines[currentSection.name]) {
          activeTimeline = timelines[currentSection.name];
        }

        const deltaY =
          lenis.scroll -
          Math.max(
            0,
            sections[currentSection.name].bounds.top - window.innerHeight
          ); // using orignal top position
        const pFactor = progressFactor[currentSection.name];

        let progress;
        if (Array.isArray(pFactor)) {
          progress = pFactor.map(
            (factor) => (deltaY / currentSection.bounds.height) * (1 / factor)
          );
        } else {
          progress = (deltaY / currentSection.bounds.height) * (1 / pFactor);
        }

        if (Array.isArray(activeTimeline)) {
          const tlp = Array.isArray(progress)
            ? progress
            : activeTimeline.map((_) => progress);
          activeTimeline.forEach((timeline, i) => {
            timeline.progress(tlp[i]);
          });
        } else {
          // console.log("activetimeline:", activeTimeline, "progress:", progress);
          activeTimeline.progress(progress);
        }
      }
    },
  });
}

const getActiveSection = () => {
  let active = null;
  Object.values(sections).forEach((section) => {
    const bounds = section.el.getBoundingClientRect();
    if (bounds.top < window.innerHeight) {
      active = { name: section.el.getAttribute("section"), bounds };
    }
  });
  return active;
};

function oldInitSun() {
  const sunHeroTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".home-slider > .content",
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
          gsap.set(sunEl, { opacity: 1, filter: "blur(0px)" }); // Keep opacity at 1 for the first 80%
        }
      },
      onLeave: () => {
        console.log("completed");
      },
      onEnterBack: () => {
        console.log("entering viewport again");
      },
    },
  });

  sunHeroTl
    .to(sunEl, {
      marginBottom: "125px",
      scale: 0.23,
      ease: "none",
    })
    .to(".sun-el, .sun-glow", { backgroundColor: "#FFBF5A" }, "<");

  gsap.to(
    ".slider-mask",
    {
      scrollTrigger: {
        trigger: ".home-slider",
        scrub: 1.5,
        start: "top bottom",
        id: "sliderMask",
      },
      backgroundPosition: "0 100%",
      ease: "power2.inOut",
    },
    "<"
  );
}
