// global v.1.9

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

const lenis = new Lenis({
  duration: 1.25,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const lenisCallbacks = [ScrollTrigger.update];
lenis.on("scroll", lenisScroll);
function lenisScroll(e) {
  lenisCallbacks.forEach((cb) => {
    Promise.resolve().then(() => cb(e));
  });
}

const updateScroll = () => {
  ScrollTrigger.refresh(true);
  setTimeout(() => {
    lenis.resize();
  }, 1000);
};

window.addEventListener("resize", () => {
  updateScroll();
});

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

window.onbeforeunload = function () {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

function clamp(val, min, max) {
  return val <= min ? min : val >= max ? max : val;
}

/**********************************************************************
 * page transitions
 ***********************************************************************/
const supportPages = typeof pageFunctions !== "undefined" ? pageFunctions : {};
barba.init({
  transitions: [
    {
      name: "opacity-transition",
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
        });
      },
      enter(data) {
        return gsap.from(data.next.container, {
          opacity: 0,
        });
      },
    },
    {
      // uses data & fns defined in the support file
      name: "support-transition",
      from: { namespace: Object.keys(supportPages) },
      to: { namespace: Object.keys(supportPages) },

      beforeLeave(data) {
        return supportPages[data.current.namespace](false);
      },

      leave(data) {
        return gsap.to(
          data.current.container.querySelector(".supportpage-body"),
          { opacity: 0, scale: 0.3, y: 100 }
        );
      },

      enter(data) {
        return gsap.from(
          data.next.container.querySelector(".supportpage-body"),
          { opacity: 0, scale: 0.3, y: 100 }
        );
      },

      afterEnter(data) {
        return supportPages[data.next.namespace](true);
      },
    },
  ],
});

/**********************************************************************
 * nav
 ***********************************************************************/
const navWrapper = document.querySelector(".c-nav");
const nav = document.querySelector(".nav");
const navDropdowns = Array.from(
  document.querySelectorAll(".nav-item[dropdown]")
);

const closeNavDropdown = (item) => {
  item.classList.remove("cc-active");
  const dropdown = item.querySelector(".nav-dropdown");
  if (dropdown) dropdown.classList.remove("cc-active");
};

navDropdowns.forEach((item) => {
  item.addEventListener("click", () => {
    navDropdowns
      .filter((dd) => dd !== item)
      .forEach((dd) => closeNavDropdown(dd));
    item.classList.toggle("cc-active");
    const dropdown = item.querySelector(".nav-dropdown");
    if (dropdown) dropdown.classList.toggle("cc-active");
  });
});

navWrapper.addEventListener("mouseleave", () => {
  navDropdowns.forEach((item) => {
    closeNavDropdown(item);
  });
  nav.classList.remove("cc-active");
});

const menuSafezone = document.querySelector(".control-safezone.cc-menu");
menuSafezone.addEventListener("mouseenter", () => {
  nav.classList.add("cc-active");
});
menuSafezone.addEventListener("mouseleave", () => {
  nav.classList.remove("cc-active");
});

const navMenuIcon = document.querySelector(".nav-btn:has(.nav-menu_icon)");
navMenuIcon.addEventListener("click", () => {
  nav.classList.add("cc-active");
});

/**********************************************************************
 * masks
 ***********************************************************************/
class TextMask {
  constructor(opts) {
    this.floater = opts.floater;
    this.container = opts.floater.parentElement;
    this.text = opts.text;
    this.textClone = null;
    this.textBounds = this.text.getBoundingClientRect();
    this.mask = opts.mask;
    this.maskContainer = opts.maskContainer;
    this.section = opts.section;
    this.sectionBounds = this.section.getBoundingClientRect();
    this.size = Math.random() * 20 + 10 + "vw";
    this.colorArray = opts.colorArray || [
      "#fd0", // #fd0
      "#39FF14", // #39FF14
      "#2CE6FF", // #2CE6FF
      "#F838CF", // #F838CF
      "#FF4500", // #FF4500
      "#F57134", // #F57134
      "#0736EE", // #0736EE
    ];
    this.textStyles = [
      "letterSpacing",
      "marginTop",
      "marginBottom",
      "fontFamily",
      "fontSize",
      "fontWeight",
      "lineHeight",
    ];
    this.mouseX = 0;
    this.mouseY = 0;
    this.ballRect = this.floater.getBoundingClientRect();
    this.ballX = this.ballRect.left + this.ballRect.width / 2;
    this.ballY = this.ballRect.top + this.ballRect.height / 2;

    this.setupResize = this.setupResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.resize = this.debounce(this.setupResize, 500);

    this.init();
  }

  init() {
    this.createMask();
    this.createFloatingBalls();
    this.container.style.opacity = 1;
    this.container.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("resize", this.resize);
  }

  createMask() {
    this.text.style.opacity = "0";
    this.text.style.pointerEvents = "none";

    this.textClone = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    this.textClone.textContent = this.text.textContent;
    this.textClone.setAttribute("x", "50%");
    this.textClone.setAttribute("text-anchor", "middle");
    this.textClone.setAttribute("dominant-baseline", "text-before-edge");
    this.textClone.setAttribute(
      "y",
      `${this.textBounds.top - this.sectionBounds.top}px`
    );
    const computedStyles = window.getComputedStyle(this.text);
    this.textStyles.forEach((style) => {
      this.textClone.style[style] = computedStyles[style];
    });

    this.mask.appendChild(this.textClone);
    this.maskContainer.style.opacity = "1";
  }

  createFloatingBalls() {
    this.floaterNum = this.colorArray.length;

    for (let i = 0; i < this.floaterNum; i++) {
      const floaterClone = this.floater.cloneNode(true);
      floaterClone.classList.add("clone");

      Object.assign(floaterClone.style, {
        width: this.size,
        height: this.size,
        backgroundColor: this.colorArray[i],
        animationDelay: Math.random() * i + "s",
        animationDuration: Math.random() * 10 + Math.sqrt(36 * i) + 5 + "s",
        animationName: i % 2 === 0 ? "float" : "float2",
      });

      this.container.appendChild(floaterClone);
    }
  }

  setupResize() {
    this.mask.removeChild(this.textClone);

    console.log("resize ran");

    const containerChildren = Array.from(this.container.children);
    containerChildren.forEach((child) => {
      if (child !== this.floater) {
        this.container.removeChild(child);
      }
    });

    this.sectionBounds = this.section.getBoundingClientRect();
    this.textBounds = this.text.getBoundingClientRect();

    this.init();
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  handleMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(() => {
        this.updateBallPosition(this.mouseX, this.mouseY);
      });
    }
  }

  updateBallPosition(x, y) {
    const distX = x - this.ballX;
    const distY = y - this.ballY;

    this.floater.style.transform = `translate3d(${distX}px, ${distY}px, 0)`;

    this.animationFrameId = null;
  }

  destroy() {
    this.container.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("resize", this.resize);
  }
}
