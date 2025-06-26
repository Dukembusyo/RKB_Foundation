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





// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {

  // Elements
  const tabs = document.querySelectorAll('.tab');
  const searchInput = document.getElementById('productSearch');
  const productGrid = document.getElementById('products');
  const products = productGrid.querySelectorAll('.product-card');

  const cartSidebar = document.getElementById('cartSidebar');
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const proceedPayBtn = document.getElementById('proceedPayBtn');
  const cartItemsList = document.getElementById('cartItems');
  const cartTotalDisplay = document.getElementById('cartTotal');
  const cartCountDisplay = document.getElementById('cartCount');

  // Cart data: key=productName, value={price, quantity}
  const cart = {};

  // --- FUNCTIONS ---

  // Filter products by category and search term
  function filterProducts() {
    const activeTab = document.querySelector('.tab.active');
    const category = activeTab ? activeTab.dataset.category : 'all';
    const searchTerm = searchInput.value.trim().toLowerCase();

    products.forEach(product => {
      const productCategory = product.dataset.category.toLowerCase();
      const productName = product.dataset.name.toLowerCase();

      const categoryMatch = (category === 'all' || productCategory === category);
      const searchMatch = productName.includes(searchTerm);

      if (categoryMatch && searchMatch) {
        product.style.display = '';
      } else {
        product.style.display = 'none';
      }
    });
  }

  // Update cart UI and total
  function updateCartUI() {
    cartItemsList.innerHTML = '';

    let total = 0;
    let itemCount = 0;

    for (const [name, item] of Object.entries(cart)) {
      const li = document.createElement('li');

      li.textContent = `${name} `;
      const qtySpan = document.createElement('span');
      qtySpan.classList.add('quantity');
      qtySpan.textContent = `x${item.quantity}`;

      // Add remove button for each item
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✕';
      removeBtn.setAttribute('aria-label', `Remove ${name} from cart`);
      removeBtn.style.marginLeft = '10px';
      removeBtn.style.cursor = 'pointer';
      removeBtn.style.background = 'none';
      removeBtn.style.border = 'none';
      removeBtn.style.color = '#e65b4f';
      removeBtn.style.fontWeight = '700';
      removeBtn.style.fontSize = '1.1rem';
      removeBtn.title = 'Remove item';

      removeBtn.addEventListener('click', () => {
        removeFromCart(name);
      });

      li.appendChild(qtySpan);
      li.appendChild(removeBtn);

      cartItemsList.appendChild(li);

      total += item.price * item.quantity;
      itemCount += item.quantity;
    }

    cartTotalDisplay.textContent = total.toLocaleString();
    cartCountDisplay.textContent = itemCount;
  }

  // Add item to cart
  function addToCart(name, price) {
    if (cart[name]) {
      cart[name].quantity += 1;
    } else {
      cart[name] = { price: price, quantity: 1 };
    }
    updateCartUI();
  }

  // Remove item completely from cart
  function removeFromCart(name) {
    if (cart[name]) {
      delete cart[name];
      updateCartUI();
    }
  }

  // Clear entire cart
  function clearCart() {
    for (const key in cart) {
      delete cart[key];
    }
    updateCartUI();
  }

  // Proceed to pay button handler (simple alert for demo)
  function proceedToPay() {
    if (Object.keys(cart).length === 0) {
      alert('Your cart is empty! Add some products before proceeding to pay.');
      return;
    }

    // This is a placeholder, integrate with payment gateway or checkout page
    alert(`Thank you for your purchase! Total: Ksh ${cartTotalDisplay.textContent}`);
    clearCart();
    cartSidebar.classList.remove('active');
  }

  // Open cart sidebar
  function openCart() {
    cartSidebar.classList.add('active');
  }

  // Close cart sidebar
  function closeCart() {
    cartSidebar.classList.remove('active');
  }

  // --- EVENT LISTENERS ---

  // Filter tab click
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      tabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked tab
      tab.classList.add('active');
      // Filter products accordingly
      filterProducts();
    });
  });

  // Search input live filter
  searchInput.addEventListener('input', () => {
    filterProducts();
  });

  // Add to cart buttons
  productGrid.addEventListener('click', e => {
    if (e.target.classList.contains('cart-btn')) {
      const card = e.target.closest('.product-card');
      const name = card.dataset.name;
      const price = Number(e.target.dataset.price);

      addToCart(name, price);
      openCart();
    }
  });

  // Cart buttons
  openCartBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  clearCartBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the cart?')) {
      clearCart();
    }
  });
  proceedPayBtn.addEventListener('click', proceedToPay);

  // Initial setup: show all products
  filterProducts();
  updateCartUI();

});






 // Accessibility section
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
  