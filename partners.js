// partners.js v.1.11.3

function portal() {
  const canvas = document.getElementById("portal");
  const context = canvas.getContext("2d");

  canvas.width = 1158;
  canvas.height = 770;

  const frameCount = 147;
  const currentFrame = (index) =>
    `/portal/Speed${index.toString().padStart(2, "0")}.jpg`;

  const images = [];
  const airpods = {
    frame: 0,
  };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  gsap.to(airpods, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      scrub: 0.5,
    },
    onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
  });

  images[0].onload = render;

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[airpods.frame], 0, 0);
  }
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

document.addEventListener("DOMContentLoaded", () => {
  partnersHero();
  partnersTabs();
});
