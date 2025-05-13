document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('#nav-menu');
  
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navMenu.classList.toggle('show');
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
  



  