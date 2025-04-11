// global v.1.11.2
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

window.lenisCallbacks = [];

document.addEventListener("DOMContentLoaded", globalPageInit);

function globalPageInit() {
  initLenis();
  initNavigation();
  initFooter();

  window.onbeforeunload = function () {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    if (window.lenis) {
      window.lenis.destroy();
      window.lenis = null;
    }
  };

  setTimeout(() => {
    if (window.lenis) {
      window.lenis.resize();
    }
  }, 1000);
}

/**********************************************************************
 * lenis
 ***********************************************************************/
function initLenis() {
  if (typeof Lenis === "undefined") {
    console.error(
      "Lenis library not loaded. Make sure it's included before this script."
    );
    return;
  }

  if (window.lenis) {
    console.log("Lenis already initialized");
    return window.lenis;
  }

  window.lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  if (window.stopLenisOnInit === true) {
    window.lenis.stop();
    window.stopLenisOnInit = false;
  }

  window.lenisCallbacks.push(ScrollTrigger.update);

  function lenisScroll(e) {
    if (window.lenisCallbacks && window.lenisCallbacks.length) {
      window.lenisCallbacks.forEach((cb) => {
        if (typeof cb === "function") {
          Promise.resolve().then(() => cb(e));
        }
      });
    }
  }

  window.lenis.off("scroll", lenisScroll);
  window.lenis.on("scroll", lenisScroll);

  gsap.ticker.add((time) => {
    window.lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  window.updateScroll = () => {
    ScrollTrigger.refresh(true);
    checkIsMobile();
    setTimeout(() => {
      lenis.resize();
    }, 1000);
  };

  window.removeEventListener("resize", window.updateScroll);
  window.addEventListener("resize", window.updateScroll);

  return window.lenis;
}

/**********************************************************************
 * nav
 ***********************************************************************/
function initNavigation() {
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

  let currentProductIndex = 0;
  const productsNavItem = document.querySelector("[products]");
  const productItems = Array.from(
    productsNavItem.querySelectorAll(".nav-dd_item")
  );
  const productImgs = Array.from(
    productsNavItem.querySelectorAll(".nav-dd_img")
  );
  productItems.forEach((item, i) => {
    if (i > 0) {
      gsap.set(productImgs[i], { autoAlpha: 0, pointerEvents: "none" });
    }
    item.addEventListener("mouseenter", () => {
      gsap.to(productImgs[i], {
        autoAlpha: 1,
        pointerEvents: "auto",
      });
    });
    item.addEventListener("mouseleave", () => {
      if (currentProductIndex === i) {
        return;
      }
      gsap.to(productImgs[i], { autoAlpha: 0, pointerEvents: "none" });
    });
  });
}

/**********************************************************************
 * footer
 ***********************************************************************/

function initFooter() {
  const colors = document.querySelector("#footer-colors");
  colors.style.backgroundColor = "black";
  colors.style.bottom = "10px";

  new TextMask({
    floater: document.querySelector("#footer-ball"),
    text: document.querySelector("#salpha-logo"),
    mask: document.querySelector("#footer-mask"),
    maskContainer: document.querySelector(".footer-logo .mask-container"),
    section: document.querySelector("#footer-logo-section"),
  });
}

/**********************************************************************
 * helpers
 ***********************************************************************/

function clamp(val, min, max) {
  return val <= min ? min : val >= max ? max : val;
}

window.isMobile = false;
function checkIsMobile() {
  if (window.innerWidth < 767) {
    window.isMobile = true;
  } else {
    window.isMobile = false;
  }
}

function debounce(func, wait) {
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

/**********************************************************************
 * masks
 ***********************************************************************/
class TextMask {
  constructor(opts) {
    this.floater = opts.floater;
    this.container = opts.container || opts.floater.parentElement;
    this.text = opts.text;
    this.textClone = null;
    this.textBounds = this.text.getBoundingClientRect();
    this.mask = opts.mask;
    this.maskContainer = opts.maskContainer;
    this.section = opts.section;
    this.sectionBounds = this.section.getBoundingClientRect();
    this.size = Math.random() * 20 + 15 + "vw";
    this.colorArray = opts.colorArray || [
      "#FFDD00", // #FFDD00
      "#F57134", // #F57134
      "#FFBF5A", // #FFBF5A
      "#FF9400", // #FF9400
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

    const textClones = this.mask.querySelectorAll("text");
    if (textClones) {
      textClones.forEach((textClone) => {
        this.mask.removeChild(textClone);
      });
    }

    this.textClone = null;
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
      floaterClone.id = "floater-" + i;

      Object.assign(floaterClone.style, {
        pointerEvents: "none",
        width: this.size,
        height: this.size,
        backgroundColor: this.colorArray[i],
        animationDelay: Math.random() * i + "s",
        animationDuration: Math.random() * 10 + Math.sqrt(36 * i) + 3 + "s",
        animationName: i % 2 === 0 ? "float" : "float2",
      });

      this.container.appendChild(floaterClone);
    }
  }

  setupResize() {
    this.textClone = null;

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
        this.updateBallPosition();
      });
    }
  }

  updateBallPosition() {
    const floaterRect = this.floater.getBoundingClientRect();

    this.ballY = this.ballRect.top + floaterRect.height / 2;

    const distX = this.mouseX - floaterRect.width / 2;
    const distY = this.mouseY - floaterRect.height / 2;

    this.floater.style.transform = `translate3d(${distX}px, ${distY}px, 0)`;

    this.animationFrameId = null;
  }

  destroy() {
    this.container.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("resize", this.resize);
  }
}
