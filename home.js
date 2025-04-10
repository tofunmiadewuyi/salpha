// home v.1.11

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.stopLenisOnInit = true;

const sunEl = document.querySelector("#hero-sun");
const ctaSunEl = document.querySelector("#cta-sun");

gsap.set(sunEl, { opacity: 1 });

document.addEventListener("DOMContentLoaded", () => {
  introAnimation();
});

function introAnimation() {
  // intro animation (eclipse)
  gsap
    .timeline()
    .fromTo(
      sunEl,
      { y: 0 },
      {
        y: window.innerHeight * 0.55,
        duration: 1.5,
        ease: "power2.inOut",
        delay: 1.5,
        onComplete: () => {
          window.lenis.start();
          initPage();
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
        gsap.set(".sun-el, .sun-glow", { backgroundColor: "#ffdd02" });
      },
    })
    .to(sunEl, {
      y: window.innerHeight * 0.95,
      scale: 0.23,
      ease: "none",
    })
    .to(
      "#hero-sun .sun-el, #hero-sun .sun-glow",
      { backgroundColor: "#FFBF5A" },
      "<"
    );
}

function ctaAnimations() {
  new SplitText(".cta-content > h1", { type: "lines" });
  new SplitText(".cta-content > .cta-content_body > p", { type: "lines" });

  const tl = gsap.timeline();
  const ctaContent = document.querySelectorAll(".cta-content");

  const content1 = Array.from(ctaContent[0].querySelectorAll("*")).filter(
    (el) => {
      return (
        el.classList.contains("c-button") || !(el.closest(".c-button") !== null)
      );
    }
  );

  const { width: sunWidth } = ctaSunEl.getBoundingClientRect();

  // show content 1
  const content1Anim = gsap
    .timeline({
      scrollTrigger: {
        trigger: ctaContent[0],
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
    .fromTo(
      content1,
      { opacity: 0, yPercent: (i) => i * 20 },
      {
        opacity: 1,
        yPercent: 0,
        stagger: 0.12,
        ease: "power2.out",
      }
    )
    .fromTo(
      ctaSunEl,
      {
        yPercent: -200,
        opacity: 0,
        filter: "blur(80px)",
        width: sunWidth * 0.1,
        height: sunWidth * 0.1,
      },
      {
        yPercent: -50,
        opacity: 1,
        width: sunWidth * 1.25,
        height: sunWidth * 1.25,
      },
      "<"
    )
    .to(ctaSunEl, {
      yPercent: 0,
      width: sunWidth * 0.4,
      height: sunWidth * 0.4,
      filter: "blur(0px)",
      duration: 2,
    })
    .to("#cta-sun .sun-el", { scale: 0.6 }, "<");

  tl.add(content1Anim);

  const ctaSplitGroup = new SplitText(".cta-split_group", { type: "words" });
  const { bottom: sectionBottom } = document
    .querySelector(".cta-spacing")
    .getBoundingClientRect();
  const { top: splitTop, height: splitHeight } =
    ctaSplitGroup.words[0].getBoundingClientRect();
  const dist =
    splitTop + splitHeight * 0.35 - sectionBottom + sunWidth * 0.25 * 0.5;

  // show content 2
  const content2Anim = gsap
    .timeline({
      scrollTrigger: {
        trigger: ctaContent[1].querySelector(".heading-1 > div"),
        start: "top bottom",
        end: "bottom 60%",
        scrub: true,
      },
    })
    .fromTo(
      ctaContent[1].querySelectorAll("*"),
      { opacity: 0, yPercent: (i) => i * 20 },
      { opacity: 1, yPercent: 0 }
    )
    .to(ctaSplitGroup.words[0], { xPercent: -45, ease: "none", duration: 1 })
    .to(ctaSplitGroup.words[1], { xPercent: 45, duration: 1 }, "<")
    .to("#cta-sun  .sun-glow", { opacity: 0.6, filter: "blur(120px)" }, "<")
    .to(
      ctaSunEl,
      {
        width: sunWidth * 0.25,
        height: sunWidth * 0.25,
        y: dist,
        ease: "none",
        duration: 1,
      },
      "<"
    );

  tl.add(content2Anim);
}

function dgCards() {
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
}

function footerSun() {
  gsap.fromTo(
    ".footer-sun",
    { yPercent: 0 },
    {
      yPercent: 75,
      scrollTrigger: {
        trigger: ".s-ahead",
        start: "top center",
        end: "bottom bottom",
        scrub: 2,
      },
    }
  );
}

function initPage() {
  heroAnimation();
  ctaAnimations();
  homeMask();
  dgCards();
  footerSun();
}
