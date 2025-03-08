// v.1.6

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

const sunEl = document.querySelector(".c-sun");
const heroSection = document.querySelector('.section[section="hero"]');
const ctaSection = document.querySelector('.section[section="cta"]');

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
          heroAnimation();
          ctaAnimations();
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

function heroAnimation() {
  const hero = {
    el: heroSection,
    name: heroSection.getAttribute("section"),
    bounds: heroSection.getBoundingClientRect(),
  };

  ScrollTrigger.create({
    trigger: heroSection,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: () => {
      const deltaY = lenis.scroll * 1.25;

      let progress;
      if (Array.isArray(hero.pf)) {
        progress = hero.pf.map(
          (factor) => (deltaY / hero.bounds.height) * (1 / factor)
        );
      } else {
        progress = (deltaY / hero.bounds.height) * (1 / hero.pf);
      }

      if (Array.isArray(hero.timelines)) {
        const tlp = Array.isArray(progress)
          ? progress
          : hero.timelines.map((_) => progress);
        hero.timelines.forEach((timeline, i) => {
          timeline.progress(tlp[i]);
        });
      } else {
        hero.timelines.progress(progress);
      }
    },
  });

  const sunHeroAnimation = gsap
    .timeline({
      paused: true,
      onUpdate: () => {
        // fade out the sun
        const progress = hero.timelines[0].progress();
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
        const progress = hero.timelines[1].progress();
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

  // add to the hero section object
  hero.timelines = [sunHeroAnimation, sliderMaskAnimation];
  hero.pf = [0.26, 0.28]; // pf = progress factor for respective anims. 🧙🏾

  // clouds
  const clouds = document.querySelectorAll(".c-cloud");
  gsap.set(clouds, { yPercent: 20, opacity: 0, filter: "blur(8px)" });
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ctaSection,
        start: "top bottom",
        end: `+=200`,
        scrub: true,
      },
    })
    .to(clouds, { yPercent: 0, opacity: 1, filter: "blur(0px)" });
}

function ctaAnimations() {
  new SplitText(".cta-content > h1", { type: "lines" });
  new SplitText(".cta-content > .cta-content_body > p", { type: "lines" });

  //show sun
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ctaSection,
        start: "top center",
        end: `+=${window.innerHeight / 3}`,
        scrub: true,
      },
    })
    .to(sunEl, { marginBottom: "-375px", opacity: 1, scale: 1.25 });

  const ctaContent = document.querySelectorAll(".cta-content");

  // show content 1
  gsap.fromTo(
    ctaContent[0].querySelectorAll("*"),
    { opacity: 0, yPercent: (i) => i * 20 },
    {
      scrollTrigger: {
        trigger: ctaContent[0],
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
      opacity: 1,
      yPercent: 0,
      stagger: 0.12,
      ease: "power2.out",
    }
  );

  // move up
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ctaContent[0],
        start: "bottom 60%",
        end: "bottom+=200 top",
        scrub: true,
      },
    })
    .to(sunEl, {
      marginBottom: "250px",
      scale: 0.19,
      filter: "blur(0px)",
    });

  // show content 2
  gsap.fromTo(
    ctaContent[1].querySelectorAll("*"),
    { opacity: 0, yPercent: (i) => i * 20 },
    {
      scrollTrigger: {
        trigger: ctaContent[1],
        start: "top+=20 bottom",
        end: "bottom bottom",
        scrub: true,
      },
      opacity: 1,
      yPercent: 0,
      stagger: 0.12,
      ease: "power2.out",
    }
  );

  //move down between words
  const ctaSplitGroup = new SplitText(".cta-split_group", { type: "words" });
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ctaContent[1],
        start: "top center",
        scrub: true,
        end: "center center",
      },
    })
    .to(sunEl, {
      marginBottom: "0px",
      ease: "none",
    })
    .to(".sun-el", { scale: 0.6 }, "<")
    .to(".sun-glow", { opacity: 0.6, filter: "blur(120px)" }, "<")
    .to(ctaSplitGroup.words[0], { xPercent: -45, ease: "none" }, "<")
    .to(ctaSplitGroup.words[1], { xPercent: 45, ease: "none" }, "<");

  //follow content
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ctaContent[1],
        start: "center center",
        end: "bottom top",
        scrub: true,
      },
    })
    .to(sunEl, {
      marginBottom: "510px",
      ease: "none",
      duration: 2.5,
    })
    .to(sunEl, { opacity: 0 });
}

// discover cards
const discoverCards = document.querySelectorAll(".dg-card");

function flip(e) {
  const card = e.target;

  const innerEl = card.querySelector(".dg-card_inner");

  if (innerEl) {
    innerEl.classList.toggle("cc-flipped");
  }
}

discoverCards.forEach((el) => el.addEventListener("mouseenter", flip));
discoverCards.forEach((el) => el.addEventListener("mouseleave", flip));

// sticky sections
document.addEventListener("DOMContentLoaded", () => {
  new StickySection({
    section: ".s-limitless",
    preceeding: '.section[section="numbers"]',
  });

  new StickySection({
    section: ".s-ahead",
    preceeding: ".s-limitless",
  });
});
