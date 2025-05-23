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




 // accessibility bar



  function toggleToolbar() {
    const toolbar = document.getElementById('accessibility-toolbar');
    toolbar.style.display = toolbar.style.display === 'block' ? 'none' : 'block';
  }
  
  function toggleKeyboardNavigation() {
    alert("Keyboard navigation enabled. Use Tab and Enter to navigate.");
  }
  
  function toggleAnimations() {
    document.body.classList.toggle('no-animations');
  }
  
  function toggleContrast() {
    document.body.classList.toggle('gentle-contrast');
    preserveImageStyles();
  }
  
  function increaseText() {
    adjustTextSize(1);
  }
  
  function decreaseText() {
    adjustTextSize(-1);
  }
  
  function adjustTextSize(delta) {
    const elements = document.querySelectorAll('body *:not(img):not(#accessibility-toolbar):not(#accessibility-toolbar *)');
    elements.forEach(el => {
      const currentSize = window.getComputedStyle(el).fontSize;
      const newSize = (parseFloat(currentSize) + delta) + 'px';
      el.style.fontSize = newSize;
    });
  }
  
  function toggleReadableFont() {
    document.body.classList.toggle('readable-font');
    preserveImageStyles();
  }
  
  function markTitles() {
    document.body.classList.toggle('marked-titles');
  }
  
  function highlightLinks() {
    document.body.classList.toggle('highlight-links');
  }
  
  function preserveImageStyles() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.style.filter = 'none';
    });
  } 
  
  // Prevent style changes on images directly by reinforcing image integrity
  const observer = new MutationObserver(() => preserveImageStyles());
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true
  });

  
  
  

  