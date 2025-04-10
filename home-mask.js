// home-mask v.1.11

function homeMask() {
  const sNumbers = document.querySelector(".numbers-content");
  const sNumbersTexts = sNumbers.querySelectorAll(".heading-1 > div");
  const mask = document.querySelector("#numbers-mask");
  const lines = document.querySelectorAll(".numbers-divider");
  const maskContainer = document.querySelector(".mask-container");

  document.querySelector(
    ".section:has(.mask-container)"
  ).style.backgroundColor = "#333333";

  sNumbers.style.opacity = "0";
  maskContainer.style.opacity = "1";

  let sNumberBounds = sNumbers.getBoundingClientRect();

  let appendedChildren = [];

  const textStyles = [
    "letterSpacing",
    "marginTop",
    "marginBottom",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "lineHeight",
  ];

  let textSplits = [];
  const createTextClones = () => {
    const splitTexts = Array.from(sNumbersTexts).flatMap((text) => {
      const split = new SplitText(text, { type: "lines" });
      textSplits.push(split);
      return split.lines;
    });

    splitTexts.forEach((text, i) => {
      const { top } = text.getBoundingClientRect();

      const clone = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      clone.textContent = text.textContent;
      clone.setAttribute("x", "50%");
      clone.setAttribute("text-anchor", "middle");
      clone.setAttribute("dominant-baseline", "text-before-edge");
      clone.setAttribute("y", `${top - sNumberBounds.top}px`);
      const computedStyles = window.getComputedStyle(text);
      textStyles.forEach((style) => {
        clone.style[style] = computedStyles[style];
      });
      mask.appendChild(clone);
      appendedChildren.push(clone);
    });
  };

  const createLineClones = () => {
    lines.forEach((line) => {
      const { top, height } = line.getBoundingClientRect();

      const svgTop = top - sNumberBounds.top;

      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );

      rect.setAttribute("x", "0");
      rect.setAttribute("y", svgTop);
      rect.setAttribute("width", "100%");
      rect.setAttribute("height", height);
      // rect.setAttribute("fill", "white");

      mask.appendChild(rect);
      appendedChildren.push(rect);
    });
  };

  const glow = document.querySelector(".c-glow");
  const cursor = document.querySelector(".c-minisun");

  let cursorX = 0,
    cursorY = 0;

  document.addEventListener("mousemove", function (e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
    updatePosition(cursorX, cursorY);
  });

  const minisunSpread = document.querySelector(".minisun-spread");
  const glowSpread = document.querySelector(".glow-spread");
  function updatePosition(x, y) {
    let { top, bottom, height } = sNumbers.getBoundingClientRect();

    let half = minisunSpread.offsetHeight / 2;
    bottom = isMobile ? bottom : bottom - 60;
    updateMSSpread(y, top, bottom, half);

    // y = y < top + half ? top + half : y > bottom - half ? bottom - half : y;
    // y = y < top + half ? top : y > bottom - half ? bottom : y;
    y = y < top ? top : y > bottom ? bottom : y;

    cursor.style.transform = `translate(${x - cursor.offsetWidth / 2}px, ${
      y - cursor.offsetHeight / 2
    }px)`;

    glow.style.transform = `translate(${x - glow.offsetWidth / 2}px, ${
      y - glow.offsetHeight / 2
    }px)`;
  }

  function updateMSSpread(y, top, bottom, msHalf) {
    let ms, op;
    const msFull = msHalf * 2;
    if (y < top) {
      ms = 50;
      op = 0;
    } else if (y > top && y < top + msHalf) {
      ms = 50 + (-50 * (y - top)) / msHalf;
      op = (1 - ms / 50) * 0.4;
    } else if (y > top + msHalf && y < bottom - msHalf) {
      ms = 0;
      op = 0.4;
    } else if (y < bottom && y > bottom - msFull) {
      ms = -50 + (50 * (bottom - y)) / msFull;
      op = (1 - ms / -50) * 0.4;
    } else if (y > bottom) {
      ms = -50;
      op = 0;
    }
    gsap.to(minisunSpread, {
      yPercent: ms,
      opacity: op,
      overwrite: "auto",
    });
    gsap.to(glowSpread, { opacity: op, overwrite: "auto" });
  }

  const maskScroll = () => {
    updatePosition(cursorX, cursorY);
  };
  lenisCallbacks.push(maskScroll);

  ScrollTrigger.create({
    trigger: ".numbers-inner",
    start: "top 80%",
    end: "bottom 20%",
    scrub: 1,

    onEnter: () => {
      gsap.set([glow, cursor], { opacity: 1 });
    },
    onEnterBack: () => {
      gsap.set([glow, cursor], { opacity: 1 });
    },
    onLeave: () => {
      gsap.set([glow, cursor], { opacity: 0 });
    },
    onLeaveBack: () => {
      gsap.set([glow, cursor], { opacity: 0 });
    },
  });

  const removeAppendedChildren = () => {
    appendedChildren.forEach((child) => {
      mask.removeChild(child);
    });
    appendedChildren = [];
    textSplits.forEach((split) => {
      split.revert();
    });
    textSplits = [];
  };

  // init
  createTextClones();
  createLineClones();

  setTimeout(() => {
    lenis.resize();
    console.log("lenis resize");
  }, 3000);

  window.addEventListener("resize", () => {
    removeAppendedChildren();
    sNumberBounds = sNumbers.getBoundingClientRect();
    createTextClones();
    createLineClones();
    setTimeout(() => lenis.resize(), 1000);
  });
}
