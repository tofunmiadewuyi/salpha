// from v.1.6

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

let activeTimeline = null;

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
      gsap.set(sunEl, { marginBottom: "65px" });
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

const timelines = {
  hero: [sunHeroAnimation, sliderMaskAnimation],
  cta: [],
};

const progressFactor = {
  hero: [0.26, 0.28],
  cta: 1, // can take single value or array
};

function heroAnimation() {
  // extendable to control other sections
  ScrollTrigger.create({
    trigger: ".page-wrapper",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: () => {
      let currentSection = getActiveSection();
      if (currentSection && timelines[currentSection.name]) {
        if (activeTimeline !== timelines[currentSection.name]) {
          activeTimeline = timelines[currentSection.name];
        }

        const isFirstSection =
          sections[currentSection.name].bounds.top - window.innerHeight < 0;
        const deltaY = isFirstSection
          ? lenis.scroll * 1.25 // accounting for first-view (100vh)
          : lenis.scroll -
            sections[currentSection.name].bounds.top + // using original top position & starting from "top bottom"
            window.innerHeight;
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
          activeTimeline.progress(progress);
        }
      }
    },
  });

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
}
