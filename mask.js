// home-mask v.1.10

function homeMask() {
  const sNumbers = document.querySelector(".numbers-content");
  const sNumbersTexts = sNumbers.querySelectorAll(".heading-1 > div");
  const svg = document.querySelector(".numbers-inner svg");
  const mask = document.querySelector("#numbers-mask");
  const lines = document.querySelectorAll(".numbers-divider");
  const maskContainer = document.querySelector(".mask-container");

  document.querySelector(
    ".section:has(.mask-container)"
  ).style.backgroundColor = "#333333";

  sNumbers.style.opacity = "0";
  maskContainer.style.opacity = "1";

  const sNumberBounds = sNumbers.getBoundingClientRect();

  const splitTexts = Array.from(sNumbersTexts).flatMap((text) => {
    const split = new SplitText(text, { type: "lines" });
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

    mask.appendChild(clone);
  });

  lines.forEach((line) => {
    const { top, left, right, bottom, height } = line.getBoundingClientRect();

    const clone = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    clone.setAttribute("x1", left);
    clone.setAttribute("y1", top);
    clone.setAttribute("x2", right);
    clone.setAttribute("y2", bottom);
    clone.setAttribute("stroke", "white");
    clone.setAttribute("stroke-width", 5);
    clone.setAttribute("stroke-linecap", "round");

    mask.appendChild(clone);
  });

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
    const { top, bottom } = sNumbers.getBoundingClientRect();

    let half = minisunSpread.offsetHeight / 2;
    y = y < top + half ? top + half : y > bottom - half ? bottom - half : y;

    cursor.style.transform = `translate(${x - cursor.offsetWidth / 2}px, ${
      y - cursor.offsetHeight / 2
    }px)`;

    glow.style.transform = `translate(${x - glow.offsetWidth / 2}px, ${
      y - glow.offsetHeight / 2
    }px)`;
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
    onComplete: () => {
      lenis.resize();
    },
  });
}
