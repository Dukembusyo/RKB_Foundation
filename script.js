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
  



  // Auto-carousel slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) slide.classList.add('active');
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Start auto-sliding every 5 seconds
setInterval(nextSlide, 5000);





document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll('.impact-number');
    let started = false;
  
    const countUp = (counter) => {
      const target = +counter.getAttribute('data-target');
      const speed = 30;
  
      const updateCount = () => {
        const current = +counter.innerText;
        const increment = Math.ceil(target / speed);
  
        if (current < target) {
          counter.innerText = current + increment;
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = target;
        }
      };
  
      updateCount();
    };
  
    const handleScroll = () => {
      const impactSection = document.querySelector('.impact-section');
      const sectionTop = impactSection.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
  
      if (sectionTop < screenPosition && !started) {
        counters.forEach(countUp);
        started = true;
      }
    };
  
    window.addEventListener('scroll', handleScroll);
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

  
  




  function makeDraggable(element) {
    let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
  
    element.onmousedown = dragMouseDown;
  
    function dragMouseDown(e) {
      e.preventDefault();
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e.preventDefault();
      posX = mouseX - e.clientX;
      posY = mouseY - e.clientY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      element.style.top = (element.offsetTop - posY) + "px";
      element.style.left = (element.offsetLeft - posX) + "px";
    }
  
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  
  // Initialize dragging for both toolbar and button
  window.onload = () => {
    makeDraggable(document.getElementById("accessibility-button"));
    makeDraggable(document.getElementById("accessibility-toolbar"));
  };
  