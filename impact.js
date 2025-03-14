// v.1.0

const slides = Array.from(document.querySelectorAll(".impact-slide"));

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".impact-slider",
      scrub: true,
      start: "top 60%",
      end: "top top",
      id: "mask",
    },
  })
  .to(".impact-intro_content", { opacity: 1 });

const title = new SplitText(".blog-cover_content > .h3-web", { type: "lines" });
const body = new SplitText(".blog-cover_content > .p-tiny", { type: "lines" });
const introContent = [...title.lines, ...body.lines];
gsap.set(introContent, {
  yPercent: 50,
  opacity: 0,
});

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".impact-slider",
      scrub: 1,
      start: "top 20%",
      end: "top top",
    },
  })
  .to(".impact-slider", { borderRadius: 0 })
  .to(
    introContent,
    {
      yPercent: 0,
      opacity: 1,
      stagger: 0.2,
    },
    "<"
  );

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".impact-slider",
      scrub: true,
      pin: ".scroll-directive",
      start: "top top",
      end: "bottom bottom",
    },
  })
  .to(".cover-img", { yPercent: 100 * (slides.length - 1), ease: "none" }, "<");

const imgContainer = document.querySelector(".impact-slide_clip");
const containerStyle = {
  position: "relative",
  overflow: "hidden",
};
Object.assign(imgContainer.style, containerStyle);
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

ScrollTrigger.create({
  trigger: ".impact-slider_imgs",
  scrub: true,
  pin: true,
  start: "top top",
  end: `bottom+=${window.innerHeight * (slides.length - 2)} bottom`,
  onUpdate: (self) => {
    updateImageHeights(imgs, self.progress);
  },
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

// gsap.set(".greener-content .section-title", { opacity: 0.5 });
gsap.set(".greener-content .section-title", { color: "#333" });

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".greener-inner",
      start: "top 40%",
      end: "top+=20% top",
      scrub: 0.5,
    },
  })
  .to(".greener-mask:not(.cc-end)", { yPercent: -90, ease: "none" }, 0.8)
  .to(
    ".greener-content .section-title",
    { opacity: 1, scale: 1.1, ease: "none" },
    "<"
  )
  .to(".greener-content .section-title", {
    scale: 1.2,
    color: "black",
    ease: "none",
  });

gsap.set(".greener-mask.cc-end", { yPercent: 100 });
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".greener-inner",
      start: "top top",
      end: "bottom+=20% bottom",
      pin: true,
      scrub: true,
    },
  })
  .to(".greener-mask.cc-end", { yPercent: 0 });

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".beyond-solar_inner",
      start: "top 20%",
      end: "bottom bottom",
      scrub: true,
    },
  })
  .to(".b-s_img", { scale: 1.4, yPercent: 40, ease: "none" })
  .to(".b-s_content .section-title", { yPercent: 400, ease: "none" }, "<");
