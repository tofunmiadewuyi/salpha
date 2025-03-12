// v.1.7

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

const sunEl = document.querySelector(".c-sun");
const heroSection = document.querySelector('.section[section="hero"]');
const ctaSection = document.querySelector('.section[section="cta"]');

sunEl.style.opacity = "1";
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
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".hero-inner",
        start: "top top",
        end: `bottom+=${window.innerHeight * 0.47} 47%`,
        scrub: true,
        onUpdate: (self) => {
          // fade out the sun
          const progress = self.progress;
          if (progress >= 0.9) {
            const opacityProgress = 1 - (progress - 0.9) * 10;
            const blurAmount = Math.min(80, (1 - opacityProgress) * 30);

            gsap.set(sunEl, {
              opacity: Math.max(0, opacityProgress),
              filter: `blur(${blurAmount}px)`,
            });
          } else {
            gsap.set(sunEl, { opacity: 1, filter: "blur(0px)" });
          }
        },
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
        end: `+=${window.innerHeight / 2}`,
        scrub: 1,
      },
    })
    .to(sunEl, { marginBottom: "-375px", opacity: 1, scale: 1.25 });

  const ctaContent = document.querySelectorAll(".cta-content");

  const content1 = Array.from(ctaContent[0].querySelectorAll("*")).filter(
    (el) => {
      return (
        el.classList.contains("c-button") || !(el.closest(".c-button") !== null)
      );
    }
  );

  // show content 1
  gsap.fromTo(
    content1,
    { opacity: 0, yPercent: (i) => i * 20 },
    {
      scrollTrigger: {
        trigger: ctaContent[0],
        start: "top center",
        end: "bottom center",
        scrub: 1,
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
        scrub: 1,
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
  const target = e.target;

  const card = target.closest(".dg-card");

  if (card) {
    card.classList.toggle("cc-flip");
  }
}

discoverCards.forEach((el) => el.addEventListener("mouseenter", flip));
discoverCards.forEach((el) => el.addEventListener("mouseleave", flip));

//sticky sections
const sections = document.querySelectorAll(
  '.page-wrapper > *:not([section="hero"]):not([section="cta"]):not(.c-nav):not(.c-footer)'
);

sections.forEach((section, i) => {
  section.style.zIndex = sections.length - i;
});

const allChildren = Array.from(
  document.querySelectorAll(".page-wrapper > *:not(.c-nav)")
);
const selectedChildren = new Set(sections);
const excludedChildren = allChildren.filter(
  (child) => !selectedChildren.has(child)
);

excludedChildren.forEach((child) => {
  child.style.zIndex = sections.length;
});
