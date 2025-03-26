// home v.1.9

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

const sunEl = document.querySelector(".c-sun");
sunEl.style.opacity = "1";
lenis.stop();

document.addEventListener("DOMContentLoaded", () => {
  introAnimation();
});

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
          gsap.set(sunEl, { marginBottom: 0, yPercent: 50 });
          lenis.start();
          heroAnimation();
          ctaAnimations();
          homeMask();
          dgCards();
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
      yPercent: -16,
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
        trigger: '.section[section="cta"]',
        start: "top center",
        end: "top top",
        // end: `+=${window.innerHeight / 2}`,
        scrub: true,
      },
    })
    .to(sunEl, { yPercent: 50, opacity: 1, scale: 1.25 });

  const ctaContent = document.querySelectorAll(".cta-content");

  const content1 = Array.from(ctaContent[0].querySelectorAll("*")).filter(
    (el) => {
      return (
        el.classList.contains("c-button") || !(el.closest(".c-button") !== null)
      );
    }
  );

  // show content 1
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ctaContent[0],
        start: "top 70%",
        end: "bottom top",
        scrub: 1,
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
    .to(sunEl, {
      yPercent: -35,
      scale: 0.19,
      filter: "blur(0px)",
      duration: 2,
    });

  // show content 2
  const ctaSplitGroup = new SplitText(".cta-split_group", { type: "words" });

  const tl = gsap
    .timeline({
      scrollTrigger: {
        trigger: ctaContent[1].querySelector("h1"),
        start: "top bottom",
        end: "bottom 60%",
        scrub: true,
      },
    })
    .fromTo(
      ctaContent[1].querySelectorAll("*"),
      { opacity: 0, yPercent: (i) => i * 20 },
      { opacity: 1, yPercent: 0, ease: "none", duration: 1 }
    )
    .to(ctaSplitGroup.words[0], { xPercent: -45, ease: "none", duration: 1 })
    .to(
      ctaSplitGroup.words[1],
      { xPercent: 45, ease: "none", duration: 1 },
      "<"
    )
    .to(sunEl, { yPercent: 6, y: 0, ease: "none", duration: 1 }, "<")
    .to(".sun-el", { scale: 0.6, duration: 1 }, "<")
    .to(
      ".sun-glow",
      { opacity: 0.6, filter: "blur(120px)", ease: "none" },
      "<"
    );

  // follow content
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ctaContent[1].querySelector("h1"),
        start: "bottom 58.5%",
        end: "bottom top",
        scrub: true,
      },
    })
    .to(sunEl, { yPercent: -60, ease: "none" });
}

// discover cards
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
