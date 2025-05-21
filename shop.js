// === script.js ===

document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const dropToggles = document.querySelectorAll('.drop-toggle');
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const closeButtons = document.querySelectorAll('.close-btn');
  const disabilityToggle = document.getElementById('disabilityToggle');

  // Toggle nav menu (mobile)
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('show');
  });

  // Toggle dropdowns
  dropToggles.forEach(toggle => {
    toggle.addEventListener('click', function () {
      const menu = document.getElementById(this.getAttribute('aria-controls'));
      const expanded = this.getAttribute('aria-expanded') === 'true';

      // Hide all dropdowns first
      document.querySelectorAll('.dropdown-menu').forEach(drop => drop.hidden = true);
      document.querySelectorAll('.drop-toggle').forEach(btn => btn.setAttribute('aria-expanded', 'false'));

      // Toggle the current
      this.setAttribute('aria-expanded', !expanded);
      menu.hidden = expanded;
    });
  });

  // Login modal
  loginBtn.addEventListener('click', () => {
    loginModal.hidden = false;
  });

  // Register modal
  registerBtn.addEventListener('click', () => {
    registerModal.hidden = false;
  });

  // Close buttons
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').hidden = true;
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      loginModal.hidden = true;
      registerModal.hidden = true;
    }
  });

  // Accessibility toggle (High contrast)
  disabilityToggle.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
    const isPressed = disabilityToggle.getAttribute('aria-pressed') === 'true';
    disabilityToggle.setAttribute('aria-pressed', !isPressed);
  });
});





  // donate.js

let slides = document.querySelectorAll(".slide");
let current = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

setInterval(nextSlide, 6000); // Change slide every 6 seconds







// donate.js
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");
  
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));
  
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
      });
    });
  });
  