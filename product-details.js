// product-details.js v.0

// shop.js v.0

function initPage() {
  const productDescCycle = productDescriptions();
  const productDescAnims = productDescCycle.getAnimations();
  productDescAnims[0].start();
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

document.addEventListener("DOMContentLoaded", () => {
  initPage();
});
