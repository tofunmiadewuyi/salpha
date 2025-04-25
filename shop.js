// shop.js v.0

function initPage() {
  const tabs = document.querySelectorAll("[data-tab");
  tabs.forEach((tab) => {
    const name = tab.getAttribute("data-tab");
    tab.addEventListener("click", () => {
      setPage(name);
    });
  });

  handleTabs();
}

function handleTabs() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("page")) {
    showTabContent(urlParams.get("page"));
  } else {
    setPage("all");
  }
}

function setPage(page) {
  setParam("page", page);
  showTabContent(page);
}

document.addEventListener("DOMContentLoaded", () => {
  initPage();
});
