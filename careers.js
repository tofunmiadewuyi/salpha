// careers.js

function initPage() {
  const carouselContent = document.querySelector(".carousel-content");

  const carouselContentClone = carouselContent.cloneNode(true);
  carouselContentClone.classList.add("clone");
  const carouselWrapper = carouselContent.parentNode;
  carouselWrapper.appendChild(carouselContentClone);
  carouselWrapper.style.overflow = "hidden";

  // infinite scroll
  const scrollTl = gsap.timeline();
  scrollTl.to(carouselContent, {
    xPercent: -100,
    repeat: -1,
    duration: 50,
    ease: "linear",
  });
  scrollTl.to(
    carouselContentClone,
    {
      xPercent: -100,
      repeat: -1,
      duration: 50,
      ease: "linear",
    },
    "<"
  );

  carouselWrapper.addEventListener("mouseover", () => {
    scrollTl.pause();
  });
  carouselWrapper.addEventListener("mouseout", () => {
    scrollTl.resume();
  });

  handleOpenings();
}

function handleOpenings() {
  const noOpenings = document.querySelector(".no-openings");
  noOpenings.style.display = "none";
}

initPage();
