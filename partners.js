// partners.js

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

function partnersHero() {
  const section = document.querySelector('[section="partner-hero"]');
  const skewCards = document.querySelectorAll(".skew-card");
  const transformCards = document.querySelectorAll(".skew-transform");
  const { clientWidth: width, clientHeight: height } = section;

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
            transforms[i].y + yPercent * 20
          }deg) translateZ(0px)`,
        },
        ease: "Expo.easeOut",
        duration: 10,
        overwrite: "all",
      });

      gsap.to(transformCards[i], {
        css: {
          transform: `rotateX(${
            transforms[i].x + xPercent * 20
          }deg) translateZ(0px)`,
        },
        ease: "Expo.easeOut",
        duration: 10,
        overwrite: "all",
      });
    });
  });
}

function partnersTabs() {
  const hiddenStyle = {
    visibility: "hidden",
    display: "none",
  };
  const visibleStyle = {
    visibility: "visible",
    display: "block",
  };
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const tabContents = document.querySelectorAll(".partners-content");
  Object.assign(tabContents[1].style, hiddenStyle);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const content = document.querySelector(
        `[tab-content="${tab.getAttribute("tab")}"]`
      );

      tabs.forEach((otherTab) => {
        otherTab.classList.remove("cc-active");
      });
      tab.classList.toggle("cc-active");

      Object.assign(content.style, visibleStyle);

      const otherContent = document.querySelectorAll(
        `.partners-content:not([tab-content="${tab.getAttribute("tab")}"])`
      );
      otherContent.forEach((content) =>
        Object.assign(content.style, hiddenStyle)
      );
    });
  });

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
