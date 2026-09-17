// ============================================================
// Riverbend Yoga Studio — shared script
// Runs on every page; each section checks for its own elements
// before doing anything, so it's safe to include everywhere.
// ============================================================

const yogaClasses = {
  restorative: { title: "Restorative Flow", description: "Deep relaxation and gentle stretching to ground your energy." },
  vinyasa: { title: "Vinyasa Grounding", description: "Synchronized breath and movement to build internal heat and focus." },
  hatha: { title: "Hatha Alignment", description: "Classic postures focused on structural integrity, balance, and poise." }
};

function selectClassStyle(styleKey) {
  const selectedClass = yogaClasses[styleKey];
  const displayArea = document.getElementById("selected-preference-display");

  if (selectedClass && displayArea) {
    displayArea.innerHTML = `
      <h3>Your Selected Path: ${selectedClass.title}</h3>
      <p>${selectedClass.description}</p>
    `;
    localStorage.setItem("preferredYogaStyle", styleKey);
  }
}

function validateContactForm(event) {
  event.preventDefault();

  const emailInput = document.getElementById("user-email");
  const nameInput = document.getElementById("user-name");
  const emailError = document.getElementById("email-error");
  const nameError = document.getElementById("name-error");
  const formStatus = document.getElementById("form-status");

  let isValid = true;

  emailError.textContent = "";
  nameError.textContent = "";
  nameInput.classList.remove("input-error");
  emailInput.classList.remove("input-error");
  if (formStatus) {
    formStatus.classList.remove("visible", "error", "success");
  }

  if (nameInput.value.trim() === "") {
    nameError.textContent = "Please enter your name to proceed.";
    nameInput.classList.add("input-error");
    isValid = false;
  }

  const emailValue = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailValue === "") {
    emailError.textContent = "Please enter your email address.";
    emailInput.classList.add("input-error");
    isValid = false;
  } else if (!emailPattern.test(emailValue)) {
    emailError.textContent = "Please enter a valid email address (e.g. name@example.com).";
    emailInput.classList.add("input-error");
    isValid = false;
  }

  if (!isValid) {
    if (formStatus) {
      formStatus.textContent = "Please fix the highlighted fields before submitting.";
      formStatus.classList.add("visible", "error");
    }
    if (nameInput.classList.contains("input-error")) {
      nameInput.focus();
    } else {
      emailInput.focus();
    }
    return;
  }

  if (formStatus) {
    formStatus.textContent = "Thanks, " + nameInput.value.trim() + "! You're registered — we'll email you the details shortly.";
    formStatus.classList.add("visible", "success");
  }
  event.target.reset();
}

function initServiceFilter() {
  const filterBtn = document.getElementById("filter-btn");
  const categorySelect = document.getElementById("category-select");
  if (!filterBtn || !categorySelect) return;

  const cards = document.querySelectorAll(".class-card");
  const noResults = document.getElementById("no-results");
  const resultNote = document.getElementById("filter-result-note");

  // Restore whatever category the visitor last picked, so a refresh
  // keeps their filter instead of resetting to "All Classes".
  const savedCategory = localStorage.getItem("selectedServiceCategory");

  // A link from the nav dropdown (services.html?category=kids) is a
  // deliberate choice and takes priority over the remembered one.
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category") || savedCategory;
  if (initialCategory && [...categorySelect.options].some((opt) => opt.value === initialCategory)) {
    categorySelect.value = initialCategory;
  }

  function filterClasses() {
    const selected = categorySelect.value;
    let visibleCount = 0;

    // Remember this choice for next time.
    localStorage.setItem("selectedServiceCategory", selected);

    cards.forEach((card) => {
      const category = card.getAttribute("data-category");
      const matches = selected === "all" || category === selected;
      card.classList.toggle("is-hidden", !matches);
      if (matches) visibleCount++;
    });

    if (noResults) {
      noResults.classList.toggle("visible", visibleCount === 0);
    }

    if (resultNote) {
      const label = categorySelect.options[categorySelect.selectedIndex].text;
      resultNote.textContent = selected === "all"
        ? `Showing all ${visibleCount} classes.`
        : `Showing ${visibleCount} class${visibleCount === 1 ? "" : "es"} in "${label}".`;
    }
  }

  filterBtn.addEventListener("click", filterClasses);
  categorySelect.addEventListener("change", filterClasses);
  filterClasses();
}

function initNavDropdown() {
  const dropdownItem = document.querySelector("nav li.has-dropdown");
  if (!dropdownItem) return;
  const trigger = dropdownItem.querySelector("a");

  trigger.addEventListener("click", (event) => {
    if (window.innerWidth < 768) {
      event.preventDefault();
      dropdownItem.classList.toggle("open");
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const savedStyle = localStorage.getItem("preferredYogaStyle");
  if (savedStyle && yogaClasses[savedStyle]) {
    selectClassStyle(savedStyle);
  }

  const registrationForm = document.getElementById("registration-form");
  if (registrationForm) {
    registrationForm.addEventListener("submit", validateContactForm);
  }

  initServiceFilter();
  initNavDropdown();
});
