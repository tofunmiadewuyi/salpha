// support v.1.11

function faqsPage() {
  const page = document.querySelector('[data-page="faqs"]');
  const faqBtns = page.querySelectorAll(".c-expandable");

  function toggle() {
    //const faq = btn.closest('.c-expandable')
    this.classList.toggle("cc-open");
  }

  faqBtns.forEach((btn) => {
    btn.addEventListener("click", toggle);
  });
}

function contactPage() {
  const page = document.querySelector('[data-page="contact-us"]');
  const faqBtns = page.querySelectorAll(".exp-btn");

  function toggle() {
    const faq = this.closest(".c-expandable");
    faq.classList.toggle("cc-open");
  }

  faqBtns.forEach((btn) => {
    btn.addEventListener("click", toggle);
  });
}

function locatePage() {
  const page = document.querySelector('[data-page="locate-us"]');
}

function initPage() {
  faqsPage();
  contactPage();
  locatePage();

  const container = document.querySelector(
    ".c-container:has(.supportpage-body)"
  );

  const containerParent = container.parentNode;

  const containerClone = container.cloneNode();

  Object.assign(containerClone.style, {
    minHeight: "100vh",
    overflow: "hidden",
  });

  const pages = Array.from(container.children);
  const wrappers = [];
  pages.forEach((p) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("support-wrapper");
    Object.assign(wrapper.style, {
      height: "100%",
      width: "100%",
      flex: "0 0 100%",
    });

    //transfer attr
    const pageName = p.getAttribute("data-page");
    p.removeAttribute("data-page");
    wrapper.setAttribute("data-page", pageName);

    gsap.set(wrapper, { autoAlpha: 0 });
    wrapper.appendChild(p);
    wrappers.push(wrapper);
  });

  const scrollContainer = document.createElement("div");
  scrollContainer.classList.add("scroll-container");
  Object.assign(scrollContainer.style, {
    display: "flex",
  });

  window.scrollContainer = scrollContainer;

  wrappers.forEach((wrapper) => scrollContainer.appendChild(wrapper));

  containerClone.appendChild(scrollContainer);

  containerParent.replaceChild(containerClone, container);

  const tabs = document.querySelectorAll("[data-tab");
  tabs.forEach((tab) => {
    const name = tab.getAttribute("data-tab");
    tab.addEventListener("click", () => {
      setPage(name);
    });
  });

  setContainerStart(containerClone);
  handleTabs();

  const resize = () => {
    setContainerStart(containerClone);
    handleTabs();
  };

  const debouncedResize = debounce(resize, 200);

  window.addEventListener("resize", debouncedResize);
}

function setContainerStart(container) {
  const containerRect = container.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(container);

  window.containerStart =
    containerRect.left +
    parseFloat(computedStyle.paddingLeft) +
    parseFloat(computedStyle.borderLeftWidth);
}

function handleTabs() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("page")) {
    showPage(urlParams.get("page"));
  } else {
    setPage("faqs");
  }
}

function setParam(k, v) {
  const url = new URL(window.location.href);
  url.searchParams.set(k, v);
  const newUrl = url.toString();
  window.history.pushState({}, "", newUrl);
}

function showPage(page) {
  const bg = window.tabBg || (window.tabBg = document.querySelector(".tab-bg"));
  const tab = document.querySelector(`[data-tab="${page}"]`);

  let tabWidth = tab.offsetWidth,
    tabLeft = tab.offsetLeft;

  gsap.set("[data-tab]", { className: "tab" });
  const tl = gsap
    .timeline()
    .to(`[data-tab="${page}"]`, { className: "tab cc-active" });

  page = document.querySelector(`[data-page="${page}"]`);
  const { left: pageLeft } = page.getBoundingClientRect();

  const scrollLast = window.scrollLast || 0;
  const dist = window.containerStart - pageLeft + scrollLast;

  tl.to(window.currentPage, { autoAlpha: 0 }, "<")
    .to(page, { autoAlpha: 1 }, "<")
    .to(window.scrollContainer, { x: dist }, "<")
    .to(bg, { width: tabWidth, left: tabLeft }, "<");

  window.scrollLast = dist;
  window.currentPage = page;
}

function setPage(page) {
  setParam("page", page);
  showPage(page);
}

initPage();
