// partners.js v.1.11.6.0
function partnersImgSeq() {
  const canvas = document.getElementById("portal");
  const context = canvas.getContext("2d");

  window.pageWrapper = document.querySelector(".page-wrapper");

  const frameCount = 49;
  const currentFrame = (index) =>
    `/images/portal/Speed${index.toString().padStart(2, "0")}.png`;

  const preloadImages = () => {
    for (let i = 1; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
    }
  };

  const img = new Image();
  img.src = currentFrame(0);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const drawImage = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  img.onload = function () {
    drawImage();
  };

  const updateImage = (index) => {
    img.src = currentFrame(index);
  };

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawImage();
  });

  let isAutoScrolling = true;
  let autoScrollSpeed = 6;
  let startAutoScrollTime = null;
  let idleTimeout = null;
  let idleTimeoutDelay = 1500;

  const startAutoScroll = () => {
    isAutoScrolling = true;

    // Adjust start time to match current scroll position
    const currentScroll = window.lenis.scroll;
    const timeElapsedForCurrentScroll =
      (currentScroll / (autoScrollSpeed * 60)) * 1000;
    startAutoScrollTime = performance.now() - timeElapsedForCurrentScroll;

    const autoScrollAnimation = () => {
      if (!isAutoScrolling) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
        return;
      }

      const currentTime = performance.now();
      const timePassed = currentTime - startAutoScrollTime;
      const scrollAmountPerSecond = autoScrollSpeed * 60;
      const scrollPosition = (timePassed / 1000) * scrollAmountPerSecond;

      window.lenis.scrollTo(scrollPosition, {
        immediate: true,
      });

      animationFrame = requestAnimationFrame(autoScrollAnimation);
    };

    autoScrollAnimation();
  };

  const stopAutoScroll = () => {
    isAutoScrolling = false;
    if (idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      // Reset the timer and restart auto-scroll
      startAutoScrollTime = performance.now();
      startAutoScroll();
    }, idleTimeoutDelay);
  };

  const permanentlyStopAutoScroll = () => {
    isAutoScrolling = false;
    if (idleTimeout) clearTimeout(idleTimeout);
  };

  setTimeout(() => {
    startAutoScroll();
  }, 500);

  // Detect user interaction to stop auto-scroll
  const userScrollHandler = () => {
    stopAutoScroll();
    document.removeEventListener("wheel", userScrollHandler);
    document.removeEventListener("touchstart", userScrollHandler);
  };

  window.addEventListener("wheel", userScrollHandler, { passive: false });
  window.addEventListener("touchmove", userScrollHandler, { passive: false });

  const portalScroll = ({ scroll }) => {
    const portalElement = document.querySelector("#portal").parentElement;
    const portalTop = portalElement.offsetTop;
    const portalHeight = window.innerHeight;

    const relativeScroll = scroll - portalTop;

    // If we're within the portal section
    if (relativeScroll >= 0 && relativeScroll <= portalHeight) {
      const scrollFraction = relativeScroll / portalHeight;
      const frameIndex = Math.min(
        frameCount - 1,
        Math.ceil(scrollFraction * frameCount)
      );

      requestAnimationFrame(() => updateImage(frameIndex + 1));
    }
  };

  window.portalScrollIndex = lenisBind(portalScroll);
  preloadImages();

  gsap.set(".partners-h-content", { autoAlpha: 0 });
  gsap.set(".skew", { autoAlpha: 0, scale: 0 });

  ScrollTrigger.create({
    trigger: "#portal",
    start: "top top",
    end: () => window.innerHeight * 1,
    onLeave: () => {
      permanentlyStopAutoScroll();

      gsap
        .timeline()
        .to("#portal", { autoAlpha: 0, duration: 1 })
        .to(
          ".skew",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1,
            onComplete: () => {
              window.startHero();
            },
          },
          "<"
        );
    },
    pin: true,
    pinSpacing: false,
  });
}

function partnersHero() {
  const transforms = [
    { y: 60, x: -35 },
    { y: 0, x: -45 },
    { y: -60, x: -35 },
    { y: 70, x: 0 },
    { y: -70, x: 0 },
    { y: 60, x: 35 },
    { y: 0, x: 45 },
    { y: -60, x: 35 },
  ];
  const section = document.querySelector('[section="partner-hero"]');
  const skewCards = document.querySelectorAll(".skew-card");
  const transformCards = document.querySelectorAll(".skew-transform");
  const { clientWidth: width, clientHeight: height } = section;

  const skewContents = document.querySelectorAll(".skew-content");

  const skewCardsData = [];
  const transformCardsData = [];

  skewCards.forEach((card, i) => {
    const style = window.getComputedStyle(card);
    const tStyle = window.getComputedStyle(transformCards[i]);
    skewCardsData.push(style.transform);
    transformCardsData.push(tStyle.transform);

    card.style.transform = "none";
    transformCards[i].style.transform = "none";
  });

  const heroSplit = new SplitText(".partners-h-content .h1-web", {
    type: "lines",
  });
  const spreadCards = () => {
    skewCards.forEach((card, i) => {
      gsap
        .timeline()
        .to(card, {
          css: { transform: skewCardsData[i] },
          duration: 2 + i * 0.5,
          ease: "Expo.easeOut",
        })
        .to(
          transformCards[i],
          {
            css: { transform: transformCardsData[i] },
            duration: 2,
            ease: "Expo.easeOut",
          },
          "<"
        );
    });
    gsap.set(".partners-h-content", { autoAlpha: 1 });
    gsap
      .timeline({
        onComplete: () => {
          startInteraction();
        },
      })
      .from(heroSplit.lines, {
        y: 24,
        rotate: 1,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 1,
        ease: "power2.out",
      })
      .from(".partenrs-h-cta > *", {
        y: 12,
        autoAlpha: 0,
        stagger: 0.2,
        duration: 0.4,
        ease: "power2.out",
      });
  };

  window.startHero = () => {
    spreadCards();
  };

  const startInteraction = () => {
    skewContents.forEach((content) => {
      content.addEventListener("mouseenter", () => {
        skewContents.forEach((c) => {
          if (c !== content) {
            c.classList.add("cc-dimmed");
          }
        });
      });

      content.addEventListener("mouseleave", () => {
        skewContents.forEach((c) => c.classList.remove("cc-dimmed"));
      });
    });

    section.addEventListener("mousemove", (e) => {
      const x = e.pageX;
      const y = e.pageY;

      let xPercent;
      let yPercent;
      xPercent = (2 * x - width) / width;
      yPercent = (2 * y - height) / height;

      skewCards.forEach((card, i) => {
        gsap.to(card, {
          css: {
            transform: `rotateY(${
              transforms[i].y + xPercent * 16 // x- movement
            }deg) translateZ(0px)`,
          },
          ease: "Expo.easeOut",
          duration: 2.5,
          overwrite: "all",
        });

        gsap.to(transformCards[i], {
          css: {
            transform: `rotateX(${
              transforms[i].x + yPercent * -12
            }deg) translateZ(0px)`,
          },
          ease: "Expo.easeOut",
          duration: 2.5,
          overwrite: "all",
        });
      });
    });
  };
}

function partnersTabs() {
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const tabContents = Array.from(
    document.querySelectorAll(".partners-content")
  );

  const contentWrapper = tabContents[0].parentElement;
  Object.assign(contentWrapper.style, {
    height: tabContents[0].offsetHeight,
    overflow: "hidden",
    position: "relative",
  });

  const scrollContainer = document.createElement("div");
  scrollContainer.classList.add("scroll-container");
  Object.assign(scrollContainer.style, {
    position: "relative",
  });

  contentWrapper.appendChild(scrollContainer);

  window.scrollContainer = scrollContainer;

  tabContents.forEach((content) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("content-wrapper");
    Object.assign(wrapper.style, {
      height: "max-content",
      width: "100%",
      position: "absolute",
      inset: 0,
      // flex: "0 0 100%",
    });

    //transfer attr
    const pageName = content.getAttribute("tab-content");
    content.removeAttribute("tab-content");
    wrapper.setAttribute("tab-content", pageName);

    wrapper.appendChild(content);
    scrollContainer.appendChild(wrapper);
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const name = tab.getAttribute("data-tab");
      showTabContent(name, "pop");
    });
  });

  setContainerStart(contentWrapper);
  const resize = () => {
    setContainerStart(contentWrapper);
  };
  const debouncedResize = debounce(resize, 100);
  window.addEventListener("resize", debouncedResize);

  tabs[0].click();

  const tabBtns = document.querySelectorAll(".pt-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".partner-tab");
      if (item.classList.contains("cc-open")) return;

      item.classList.toggle("cc-open");

      const sibling = item.nextElementSibling || item.previousElementSibling;
      sibling.classList.toggle("cc-open");
    });
  });
}
function partnersVideo() {
  gsap.set(".partners-h-content", { autoAlpha: 0 });
  gsap.set(".skew", { autoAlpha: 0, scale: 0 });
  gsap.set(".skew-wrapper", { yPercent: -15 });

  // what happens after thte portal animation is done, scrubbed or otherwise
  const completePortal = () => {
    window.lenis.scrollTo(0, {
      immediate: true,
    });
    gsap
      .timeline()
      .to('[data-section="portal"]', { autoAlpha: 0, duration: 1 })
      .to(".skew-wrapper", { yPercent: 0, duration: 3 }, "<")
      .to(
        ".skew",
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1,
          overwrite: true,
          onComplete: () => {
            window.startHero();
          },
        },
        "<"
      );

    setTimeout(() => {
      if (window.portalST) {
        window.portalST.kill();
      }
    }, 500);
  };

  const video = document.querySelector("#portal-video");
  let isScrolling = false;
  let scrollTimeout;
  let hasScrolled = false;
  const SCROLL_TIMEOUT = 200;

  video.addEventListener("loadedmetadata", function () {
    video.playbackRate = 0.5;
    scrollTimeout = setTimeout(function () {
      isScrolling = false;
      video.play();
    }, SCROLL_TIMEOUT);
  });

  video.addEventListener("ended", function () {
    completePortal();
  });

  const scrollFn = ({ scroll }) => {
    hasScrolled = true;

    if (!isScrolling) {
      isScrolling = true;
      video.pause();
    }

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(function () {
      isScrolling = false;
      video.play();
    }, SCROLL_TIMEOUT);

    const portalSection = document.querySelector('[data-section="portal"]');
    const scrollPercentage = scroll / portalSection.offsetHeight;
    const videoTime = video.duration * scrollPercentage;

    if (!isNaN(videoTime)) {
      video.currentTime = videoTime;
    }
  };
  lenisBind(scrollFn);

  window.portalST = ScrollTrigger.create({
    trigger: '[data-section="portal"]',
    start: "top top",
    end: () => 0,
    pinSpacing: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const internal = progress - 0.8;
      if (internal >= 0) {
        gsap.set(".skew", { autoAlpha: internal, scale: internal });
      }
    },
    onLeave: () => {
      completePortal();
    },
    scrub: true,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  partnersVideo();
  partnersHero();
  partnersTabs();
});
