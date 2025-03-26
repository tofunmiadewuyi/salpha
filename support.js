// support v.1.9

function faqsPage(enter) {
  const faqBtns = document.querySelectorAll(".c-expandable");

  function toggle() {
    //const faq = btn.closest('.c-expandable')
    this.classList.toggle("cc-open");
  }

  if (enter) {
    faqBtns.forEach((btn) => {
      btn.addEventListener("click", toggle);
    });
  } else {
    faqBtns.forEach((btn) => {
      btn.removeEventListener("click", toggle);
    });
  }
}

function contactPage(enter) {
  const faqBtns = document.querySelectorAll(".exp-btn");

  function toggle() {
    const faq = this.closest(".c-expandable");
    faq.classList.toggle("cc-open");
  }

  if (enter) {
    faqBtns.forEach((btn) => {
      btn.addEventListener("click", toggle);
    });
  } else {
    faqBtns.forEach((btn) => {
      btn.removeEventListener("click", toggle);
    });
  }
}

function locatePage(enter) {}

Object.assign(supportPages, {
  faqs: faqsPage,
  "contact-us": contactPage,
  "locate-us": locatePage,
});

const namespace = document.querySelector('[data-barba="container"').dataset
  .barbaNamespace;

supportPages[namespace](true);
