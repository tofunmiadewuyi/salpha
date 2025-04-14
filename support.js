// support v.1.11.3

function faqsPage() {
  const page = document.querySelector('[tab-content="faqs"]');
  const faqBtns = page.querySelectorAll(".c-expandable");

  function toggle() {
    this.classList.toggle("cc-open");
    setTimeout(() => {
      const { height: pageHeight } = window.currentTab.getBoundingClientRect();
      gsap.to(window.scrollContainer, { height: pageHeight });
    }, 300);
  }

  faqBtns.forEach((btn) => {
    btn.addEventListener("click", toggle);
  });
}

function contactPage() {
  const page = document.querySelector('[tab-content="contact-us"]');
  const faqBtns = page.querySelectorAll(".c-expandable");

  function toggle() {
    this.classList.toggle("cc-open");

    // add 100vh if the form is expanding, until the actual size is calculated
    if (this.classList.contains("cc-open")) {
      const { height: pageHeight } = window.currentTab.getBoundingClientRect();
      gsap.to(window.scrollContainer, {
        height: pageHeight + window.innerHeight,
      });
    }

    setTimeout(() => {
      const { height: pageHeight } = window.currentTab.getBoundingClientRect();
      gsap.to(window.scrollContainer, {
        height: pageHeight,
        overwrite: true,
        duration: 0.3,
      });
    }, 300);
  }

  faqBtns.forEach((btn) => {
    btn.addEventListener("click", toggle);
  });
}

function locatePage() {
  const page = document.querySelector('[tab-content="locate-us"]');
}

function initPage() {
  faqsPage();
  contactPage();
  locatePage();

  const container = document.querySelector(
    ".c-container:has(.supportpage-body)"
  );

  const containerParent = container.parentNode;

  // clone the container, it would replace the original container with the new structure.
  const containerClone = container.cloneNode();

  Object.assign(containerClone.style, {
    overflow: "hidden",
  });

  const pages = Array.from(container.children);
  const wrappers = [];
  pages.forEach((p) => {
    // create a wrapper for each page-content thats full-width and would be inside the scroll-container
    const wrapper = document.createElement("div");
    wrapper.classList.add("support-wrapper");
    Object.assign(wrapper.style, {
      height: "max-content",
      width: "100%",
      flex: "0 0 100%",
    });

    //transfer attr
    const pageName = p.getAttribute("tab-content");
    p.removeAttribute("tab-content");
    wrapper.setAttribute("tab-content", pageName);

    gsap.set(wrapper, { autoAlpha: 0 });
    wrapper.appendChild(p);
    wrappers.push(wrapper);
  });

  // create a scroll-container that would go inside the main container(clone)
  const scrollContainer = document.createElement("div");
  scrollContainer.classList.add("scroll-container");
  Object.assign(scrollContainer.style, {
    display: "flex",
  });

  // add wrappers to scroll-container
  wrappers.forEach((wrapper) => scrollContainer.appendChild(wrapper));
  // add scroll-container to container(clone)
  containerClone.appendChild(scrollContainer);

  window.scrollContainer = scrollContainer;
  // replace container with clone
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

  const debouncedResize = debounce(resize, 100);

  window.addEventListener("resize", debouncedResize);
}

function handleTabs() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("page")) {
    showTabContent(urlParams.get("page"));
  } else {
    setPage("faqs");
  }
}

function setPage(page) {
  setParam("page", page);
  showTabContent(page);
}

initPage();
