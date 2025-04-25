// product.js v.1.0

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
      .to(
        productDescs[i],
        { autoAlpha: 1, yPercent: 0, duration: 0.2 },
        "-=0.2"
      )
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

  productDescs.forEach((desc, index) => {
    const items = desc.querySelectorAll(".product-desc_item");
    const suns = [];
    const progresses = [];

    items.forEach((item, i) => {
      item.classList.remove("cc-active");
      suns.push(item.querySelector(".product-desc_active"));
      progresses.push(item.querySelector(".product-desc_progress"));
      item.addEventListener("click", () => {
        const anim = animations[index];
        if (anim.playing) {
          anim.stop();
        }
        anim.startFromIndex(i);
      });
    });

    const animation = {
      timeline: null,
      playing: false,
      currentIndex: 0,

      start() {
        if (this.playing) return;
        this.playing = true;
        this.timeline = gsap.timeline({ repeat: -1 });

        for (let i = 0; i < items.length; i++) {
          const idx = (i + this.currentIndex) % items.length;
          const item = items[idx];
          const sun = item.querySelector(".product-desc_active");
          const progress = item.querySelector(".product-desc_progress");

          this.timeline.set(suns, { opacity: 0 });
          this.timeline.set(progresses, { width: "100%" });
          this.timeline.to(item, {
            onStart: () => {
              items.forEach((i) => i.classList.remove("cc-active"));
              item.classList.add("cc-active");
            },
            duration: 0.1,
          });
          this.timeline.to(sun, { opacity: 1, duration: 6 }); // hold for 6 seconds
          this.timeline.to(progress, { width: 0, duration: 6 }, "<"); // hold for (same) 6 seconds
        }

        return this;
      },

      startFromIndex(index) {
        this.stop();
        this.currentIndex = index;
        this.start();
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
  const page = document.querySelector(".page-wrapper");
  const galleries = document.querySelectorAll(".product-gallery");
  const thumbnails = document.querySelectorAll(".product-thumbnails");
  galleries.forEach((gallery, i) => {
    thumbnails[i].addEventListener("click", () => {
      gallery.classList.add("cc-active");
      lenis.stop();
    });

    const btns = gallery.querySelectorAll(".product-gallery_btn");
    const prev = btns[0];
    const next = btns[1];

    const outside = gallery.querySelector(".product-gallery_bg");
    outside.addEventListener("click", (e) => {
      gallery.classList.remove("cc-active");
      lenis.start();
    });

    new Swiper(gallery, {
      cssMode: true,
      navigation: { nextEl: next, prevEl: prev },
    });

    const wrapper = gallery.closest(".product-wrapper");
    wrapper.removeChild(gallery);
    page.appendChild(gallery);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  productHero();
  galleries();
});
