// product.js v.0

function productHero() {
  // intro animation
  gsap.fromTo(
    ".product-hero > *",
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.35,
      duration: 0.5,
      delay: 0.3,
      ease: "power2.out",
    }
  );

  const masks = document.querySelectorAll(".product-mask");
  masks.forEach((mask) => {
    mask.classList.add("cc-active");
  });

  const productWrappers = document.querySelectorAll(".product-wrapper");
  const productBgNames = document.querySelectorAll(".product-bg_name");

  const productDescs = document.querySelectorAll(".product-description");
  gsap.set(productDescs, { autoAlpha: 0, yPercent: 10 });

  const productSections = document.querySelectorAll(".section[data-product]");

  const productDescCycle = productDescriptions();
  const productDescAnims = productDescCycle.getAnimations();

  productSections.forEach((section, i) => {
    const { height } = section.getBoundingClientRect();
    const maskText = masks[i].querySelector("text");
    const mask = masks[i];
    const productWrapper = productWrappers[i];
    const bgName = productBgNames[i];
    const productBg = productWrapper.querySelectorAll(
      '.product-image[data-img="bg"]'
    );
    const productRock = productWrapper.querySelectorAll(
      '.product-image[data-img="rock"]'
    );

    const productImage = section.querySelector(
      ".product-image:not([data-img])"
    );

    const id = i === 1 ? { id: `product-${i}` } : {};

    const nameColor = section.dataset.theme === "dark" ? "#000" : "#fff";

    const st = gsap
      .timeline({
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          pin: productWrappers[i],
          end: `+=${height * 3}`,
          scrub: 0.5,
          ...id,
          onUpdate: ({ progress }) => {
            if (progress > 0.9) {
              productDescAnims[i].start();
            } else {
              productDescAnims[i].stop();
            }
          },
        },
      })
      .to(mask, { yPercent: -100, ease: "none" })
      .fromTo(
        maskText,
        { fontSize: 240, ease: "none" },
        { fontSize: "40vw", y: height, ease: "none" },
        "<"
      )
      .fromTo(
        bgName,
        { fontSize: 240, ease: "none" },
        { fontSize: "40vw", ease: "none" },
        "<"
      )
      .from(productImage, { yPercent: 120 }, "<")
      //   .to(productImage, { yPercent: 0, duration: 0.2 })
      .to(productBg, { yPercent: -100, autoAlpha: 0 })
      .to(productRock, { autoAlpha: 0 }, "<")
      .to(bgName, { scale: 0.2, yPercent: -70, color: nameColor }, "<")
      .to(productDescs[i], { autoAlpha: 1, yPercent: 0, duration: 0.2 })
      .from(productWrapper.querySelector(".product-info_top"), {
        y: 20,
        stagger: 0.2,
        autoAlpha: 0,
        duration: 0.1,
      });
  });
}

function productDescriptions() {
  const productDescs = document.querySelectorAll(".product-description");

  let animations = [];

  productDescs.forEach((desc) => {
    const items = desc.querySelectorAll(".product-desc_item");
    const suns = [];
    // const progress = [];
    items.forEach((item) => {
      item.classList.remove("cc-active");
      suns.push(item.querySelector(".product-desc_active"));
      //   progress.push(item.querySelector(".product-desc_progress"));
    });

    const animation = {
      timeline: null,
      playing: false,
      start() {
        if (this.playing) return;
        this.playing = true;
        this.timeline = gsap.timeline({ repeat: -1 });

        items.forEach((item, i) => {
          const sun = item.querySelector(".product-desc_active");
          const progress = item.querySelector(".product-desc_progress");
          this.timeline.to(suns, { opacity: 0 });
          this.timeline.to(item, {
            onStart: () => {
              items.forEach((i) => i.classList.remove("cc-active"));
              item.classList.add("cc-active");
            },
            duration: 0.1,
          });
          this.timeline.to(sun, { opacity: 1, duration: 6 }); // hold for 6 seconds
          this.timeline.to(progress, { width: 0, duration: 6 }, "<"); // hold for (same) 6 seconds
        });

        return this;
      },
      stop() {
        if (!this.playing) return;
        this.playing = false;
        if (this.timeline) {
          this.timeline.kill();
          this.timeline = null;
        }
        return this;
      },
    };
    animations.push(animation);
  });

  return {
    startAll() {
      animations.forEach((anim) => anim.start());
      return this;
    },
    stopAll() {
      animations.forEach((anim) => anim.stop());
      return this;
    },

    start(i) {
      if (animations[i]) {
        animations[i].start();
      }
      return this;
    },
    stop(i) {
      if (animations[i]) {
        animations[i].stop();
      }
      return this;
    },
    getAnimations() {
      return animations;
    },
  };
}

function galleries() {
  const galleries = document.querySelectorAll(".product-gallery");
  const thumbnails = document.querySelectorAll(".product-thumbnails");
  thumbnails.forEach((thumbnail, i) => {
    thumbnail.addEventListener("click", () => {
      galleries[i].classList.add("cc-active");
    });

    const btns = galleries[i].querySelectorAll(".product-gallery_btn");
    const prev = btns[0];
    const next = btns[1];

    const outside = galleries[i].querySelector(".product-gallery_bg");
    outside.addEventListener("click", (e) => {
      galleries[i].classList.remove("cc-active");
    });

    new Swiper(galleries[i], {
      cssMode: true,
      navigation: { nextEl: next, prevEl: prev },
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  productHero();
  galleries();
});
