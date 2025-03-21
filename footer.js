// footer.js

function createLogo() {
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

createLogo();
