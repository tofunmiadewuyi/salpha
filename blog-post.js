const cover = document.querySelector(".blogpost-cover");

ScrollTrigger.create({
  trigger: "#scroll-container",
  start: "top top",
  end: "bottom bottom",
  pin: ".page-nav",
  pinSpacing: false,
  scrub: true,
});

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".blog-content",
      start: "top 25%",
      end: "bottom 80%",
      scrub: true,
    },
  })
  .to(".page-progress_bar", {
    width: "100%",
  });

const splitHeading = new SplitText(".blog-details > .h3-web", {
  type: "words",
});
console.log(splitHeading);
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".blog-content",
      start: "top 95%",
      end: "top 25%",
      scrub: true,
    },
  })
  .to(cover, {
    width: 256,
    height: 145,
    borderRadius: 25,
    ease: "none",
    duration: 5,
  })
  .to(splitHeading.words, {
    width: 0,
    stagger: 0.1,
    duration: 0.5,
    fontSize: 32,
    opacity: 0,
  })
  .to(".blog-details > .h3-web", {
    width: "22%",
    lineHeight: "32px",
    height: 64,
  })
  .to(splitHeading.words, {
    width: "unset",
    stagger: 0.1,
    duration: 0.5,
    fontSize: 32,
    opacity: 1,
  });
