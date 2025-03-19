// about.js

lenis.stop();

function createHero() {
  const floater = document.querySelector(".color-ball");
  const container = floater.parentElement;

  const colorArray = [
    "#fd0", // #fd0
    "#39FF14", // #39FF14
    "#2CE6FF", // #2CE6FF
    "#F838CF", // #F838CF
    "#FF4500", // #FF4500
    "#F57134", // #F57134
    "#0736EE", // #0736EE
  ];

  function createMask() {
    const text = document.querySelector(".about-h-inner .h2-web");
    const mask = document.querySelector("#about-hero-mask");
    const maskContainer = document.querySelector(".mask-container");

    text.style.opacity = "0";

    const { top } = text.getBoundingClientRect();
    const section = document
      .querySelector(".about-h-inner")
      .getBoundingClientRect();

    const clone = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    clone.textContent = text.textContent;
    clone.setAttribute("x", "50%");
    clone.setAttribute("text-anchor", "middle");
    clone.setAttribute("dominant-baseline", "text-before-edge");
    clone.setAttribute("y", `${top - section.top}px`);

    mask.appendChild(clone);
    maskContainer.style.opacity = "1";
  }

  function createFloatingBalls() {
    const floaterNum = colorArray.length;

    for (let i = 0; i < floaterNum; i++) {
      const floaterClone = floater.cloneNode(true);
      floaterClone.classList.add("clone");

      const size = Math.random() * 20 + 10 + "vw";
      const ballStyle = {
        width: size,
        height: size,
        backgroundColor: colorArray[i],
        animationDelay: Math.random() * i + "s",
        animationDuration: Math.random() * 10 + Math.sqrt(36 * i) + 5 + "s",
        animationName: i % 2 === 0 ? "float" : "float2",
      };

      Object.assign(floaterClone.style, ballStyle);
      container.appendChild(floaterClone);
    }
  }

  let mouseX = 0;
  let mouseY = 0;
  let animationFrameId;

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(() => {
        updateBallPosition(mouseX, mouseY);
      });
    }
  }

  const ballRect = floater.getBoundingClientRect();
  const ballX = ballRect.left + ballRect.width / 2;
  const ballY = ballRect.top + ballRect.height / 2;
  function updateBallPosition(x, y) {
    const distX = x - ballX;
    const distY = y - ballY;

    floater.style.transform = `translate3d(${distX}px, ${distY}px, 0)`;

    animationFrameId = null;
  }

  createMask();
  createFloatingBalls();

  container.addEventListener("mousemove", handleMouseMove);
  // window.addEventListener("resize", createFloatingBalls);
}

function aboutHeroAnim() {
  createHero();

  setTimeout(() => {
    lenis.start();
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".about-hero",
          start: "top top",
          end: "bottom center",
          scrub: true,
        },
      })
      .fromTo(
        ".about-h-inner svg",
        { scale: 0.5, yPercent: 0 },
        { scale: 2, yPercent: 30 }
      )
      .fromTo(
        ".colors",
        { scale: 0.2, autoAlpha: 0.5, yPercent: 0 },
        { scale: 1, autoAlpha: 1, yPercent: 30 },
        "<"
      );
  }, 1000);
}

function aboutAnim() {
  const aboutMsg = document.querySelector(".about-msg .h3-web");
  const aboutMsgClone = aboutMsg.cloneNode(true);
  aboutMsgClone.classList.add("clone");
  Object.assign(aboutMsgClone.style, {
    position: "absolute",
    inset: "0px",
    color: "white",
  });
  aboutMsg.parentElement.appendChild(aboutMsgClone);

  const aboutMsgSplit = new SplitText(aboutMsgClone, {
    type: "lines, wordss",
    linesClass: "line",
    position: "absolute",
  });

  gsap.set(aboutMsgSplit.lines, {
    width: "0%",
    textWrapMode: "nowrap",
    overflow: "hidden",
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".about-msg_wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(".about-msg_wrapper .h-screen", {
            yPercent: 100 * progress,
          });
        },
      },
    })
    .to(
      aboutMsgSplit.lines,
      // { color: "white", stagger: 0.5, ease: "Expo.easeOut" },
      { width: "100%", stagger: 0.5, ease: "none" },

      "<"
    );

  const panelGrid = document.querySelector(".panel-grid");
  gsap.set(panelGrid, { opacity: 0 });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".panel-msg",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          gsap.set([".panel-msg .h-screen", ".solar-grid"], {
            yPercent: 100 * self.progress,
          });
        },
      },
    })
    .to(panelGrid, {
      height: window.innerHeight + "px",
      opacity: 0.4,
      transform: "translate(0vw) scale(0.9)",
    })
    .to(".panel-msg h2", { scale: 2, color: "white" }, "<");

  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".panel-img",
        start: "top bottom",
        end: "top center",
        scrub: true,
        onUpdate: (self) => {
          gsap.set([".panel-msg .h-screen"], {
            yPercent: 100 + 50 * self.progress,
          });
          gsap.set([".solar-grid"], {
            yPercent: 100 + 40 * self.progress,
          });
        },
        onLeave: () => {
          gsap.to(panelGrid, {
            opacity: 0,
          });
        },
      },
    })
    .to(panelGrid, {
      transform: "translate(0vw) scale(0.75) rotate3d(1, 0, 0, 95deg)",
      opacity: 0.2,
    });

  const panelImg = document.querySelector(".panel-img img");
  gsap.set(panelImg, {
    scale: 2,
    transformOrigin: "top center",
    opacity: 0,
    zIndex: -1,
    position: "relative",
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".panel-img",
        start: "top 80%",
        end: "top 30%",
        scrub: true,
      },
    })
    .to(panelImg, { opacity: 1, scale: 1 }, "<");
}

function stickySlide() {
  const imgContainer = document.querySelector(".impact-slide_clip");
  Object.assign(imgContainer.style, {
    position: "relative",
    overflow: "hidden",
  });
  const imgs = Array.from(document.querySelectorAll(".impact-slide_img"));
  const imgStyle = {
    position: "absolute",
    bottom: "0px",
    width: "100%",
  };
  imgs.forEach((img, i) => {
    Object.assign(img.style, imgStyle);
    if (i > 0) {
      img.style.height = "0%";
    }
  });

  function updateImageHeights(imgs, progress) {
    const len = imgs.length;
    const gap = 0.15;

    progress += 0.5 / len; // little headstart

    progress = Math.min(progress, 0.9999);

    imgs[0].style.height = "100%";

    const totalGapSpace = gap * (len - 1);
    const activeSpace = 1 - totalGapSpace;
    const segment = activeSpace / len;

    // Find which segment we're in, accounting for gaps
    let currentSegmentStart = 0;
    let currentIndex = 0;

    for (let i = 0; i < len; i++) {
      const nextSegmentStart =
        currentSegmentStart + segment + (i < len - 1 ? gap : 0);

      if (progress >= currentSegmentStart && progress < nextSegmentStart) {
        currentIndex = i;
        break;
      }

      // For last segment, make sure we capture exactly 1.0 progress
      if (i === len - 1 && progress >= currentSegmentStart) {
        currentIndex = i;
        break;
      }

      currentSegmentStart = nextSegmentStart;
    }

    for (let i = 1; i < len; i++) {
      if (i < currentIndex) {
        imgs[i].style.height = "100%";
      } else if (i > currentIndex) {
        imgs[i].style.height = "0%";
      }
    }

    if (currentIndex === 0) return;

    // Calculate how far we are in the current segment, ignoring gaps
    const segmentProgress = Math.min(
      1,
      (progress - currentSegmentStart) / segment
    );

    // Only apply height if we're in an active segment, not a gap
    if (segmentProgress <= 1) {
      imgs[currentIndex].style.height = `${segmentProgress * 100}%`;
    }
  }

  ScrollTrigger.create({
    trigger: ".about-stickyimages",
    scrub: true,
    pin: ".impact-slide_clip",
    start: "top top",
    end: `bottom+=${window.innerHeight * 2.4} bottom`,
    onUpdate: (self) => {
      updateImageHeights(imgs, self.progress);
    },
  });

  const stickySliderContent = gsap.utils.toArray(".about-ss_content > *");
  stickySliderContent.forEach((item, i) => {
    gsap.set(item, { yPercent: 100 * (i + 3) });
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".sticky-slide",
        start: "top top",
        pin: true,
        end: `bottom+=${window.innerHeight * 2.5} bottom`,
        scrub: true,
      },
    })
    .to(stickySliderContent, {
      // autoAlpha: 1,
      yPercent: 0,
      stagger: 0.5,
      ease: "none",
    });
}

function stickySun() {
  const splitLines = new SplitText(".bright-inner .h1-web", {
    type: "lines,words",
  });
  console.log("splitLines", splitLines);
  const splitPhrase = splitLines.lines[1].children;

  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".bright-inner .h-screen:first-child",
        start: "top top",
        end: `bottom+=${window.innerHeight} bottom+=30`,
        pin: true,
        pinSpacing: false,
        scrub: true,
      },
    })
    .to(".sun-img_container", { yPercent: 5, ease: "none" })
    .to(splitPhrase[0], { xPercent: -35, ease: "none" }, 0.7)
    .to(splitPhrase[1], { xPercent: -35, ease: "none" }, "<")
    .to(splitPhrase[2], { xPercent: 15, ease: "none" }, "<");
}

function discoverAnim() {
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
}

document.addEventListener("DOMContentLoaded", () => {
  aboutHeroAnim();
  aboutAnim();
  stickySlide();
  stickySun();
  discoverAnim();
});
