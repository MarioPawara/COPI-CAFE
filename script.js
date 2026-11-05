// --- Products Data Array ---
const products = [
  {
    id: 1,
    title: "Iced Dirty Matcha",
    category: "specialty",
    price: 125,
    description: "Ceremonial grade Uji matcha topped with a fresh double shot of Chiang Rai espresso and creamy oat milk.",
    image: "images/product-01.png",
    fallback: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Chiang Rai Filter Coffee",
    category: "coffee",
    price: 110,
    description: "Single-origin hand-brewed V60 filter coffee featuring delicate tasting notes of wild honey, citrus, and jasmine.",
    image: "images/product-02.jpg",
    fallback: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Artisanal Avocado Toast",
    category: "bakery",
    price: 165,
    description: "Toasted sourdough, fresh mashed avocado, organic poached egg, chili flakes, radish slices, and extra virgin olive oil.",
    image: "images/product-03.jpg",
    fallback: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Citrus Tonic Cold Brew",
    category: "coffee",
    price: 120,
    description: "12-hour slow-steeped cold brew infused with fresh orange tonic and sparkling soda water for a crisp finish.",
    image: "images/product-04.jpeg",
    fallback: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "Artisan Butter Croissant",
    category: "bakery",
    price: 85,
    description: "Flaky, multi-layered French butter croissant laminated by hand and baked fresh every morning at 7:00 AM.",
    image: "images/product-05.jpeg",
    fallback: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "Uji Matcha Cheesecake",
    category: "bakery",
    price: 140,
    description: "Rich basque-style burnt cheesecake blended with authentic Japanese Uji matcha on a dark chocolate cookie base.",
    image: "images/product-06.jpg",
    fallback: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80"
  }
];

let cart = [];
let currentFilter = 'all';

// --- DOM Elements ---
const menuGrid = document.getElementById('menuGrid');
const tabButtons = document.querySelectorAll('.tab-btn');
const searchInput = document.getElementById('menuSearch');
const header = document.getElementById('header');

// Basket / Cart Elements
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartCountEl = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Modal Elements
const itemModal = document.getElementById('itemModal');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const modalAddBtn = document.getElementById('modalAddBtn');

// Toast & Mobile Menu
const toast = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  renderMenu(products);
  setupScrollHeader();
  setupEventListeners();
  
  // Default Date Picker to Tomorrow
  const datePicker = document.getElementById('date');
  if (datePicker) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    datePicker.value = tomorrow.toISOString().split('T')[0];
  }
});

// --- Render Menu Grid ---
function renderMenu(items) {
  menuGrid.innerHTML = '';

  if (items.length === 0) {
    menuGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--color-text-muted);">
        <i class="fa-solid fa-mug-hot" style="font-size: 2rem; margin-bottom: 12px; color: var(--color-terracotta);"></i>
        <p>No menu items match your search filter.</p>
      </div>
    `;
    return;
  }

  items.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img-wrapper" onclick="openProductModal(${product.id})">
        <span class="product-cat-tag">${product.category}</span>
        <img src="${product.image}" alt="${product.title}" onerror="this.src='${product.fallback}'">
      </div>
      <div class="product-details">
        <div class="product-header">
          <h3 class="product-title" onclick="openProductModal(${product.id})" style="cursor:pointer">${product.title}</h3>
          <span class="product-price">฿${product.price}</span>
        </div>
        <p class="product-desc">${product.description}</p>
        <div class="product-footer">
          <span style="font-size: 0.8rem; color: var(--color-text-muted);">Fresh Daily</span>
          <button class="btn-add-item" onclick="addToCart(${product.id})">
            <i class="fa-solid fa-plus"></i> Add to Order
          </button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

// --- Filter & Search Logic ---
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  const filtered = products.filter(product => {
    const matchesCategory = (currentFilter === 'all') || (product.category === currentFilter);
    const matchesSearch = product.title.toLowerCase().includes(searchTerm) || 
                          product.description.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  renderMenu(filtered);
}

// --- Cart & Pre-Order System ---
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  showToast(`Added ${product.title} to your order.`);
}

function updateQuantity(productId, delta) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  updateCartUI();
}

function updateCartUI() {
  // Update count badge
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalCount;

  // Update basket items
  cartItemsContainer.innerHTML = '';
  let subtotal = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div style="text-align: center; color: var(--color-text-muted); margin-top: 60px;">
        <i class="fa-solid fa-basket-shopping" style="font-size: 2.5rem; color: var(--color-border); margin-bottom: 12px;"></i>
        <p>Your pre-order basket is currently empty.</p>
      </div>
    `;
  } else {
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.title}" onerror="this.src='${item.fallback}'">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">฿${item.price} each</div>
          <div class="cart-qty-ctrl">
            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span style="font-size:0.85rem; font-weight:600;">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <div style="font-weight:700; color:var(--color-espresso);">฿${itemTotal}</div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  cartSubtotalEl.textContent = `฿${subtotal}`;
}

// --- Modal Logic ---
let activeModalProductId = null;
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  activeModalProductId = productId;
  modalImg.src = product.image;
  modalImg.onerror = () => { modalImg.src = product.fallback; };
  modalTitle.textContent = product.title;
  modalPrice.textContent = `฿${product.price}`;
  modalDesc.textContent = product.description;

  itemModal.classList.add('open');
}

function closeModal() {
  itemModal.classList.remove('open');
}

// --- Toast Notification ---
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// --- Scroll Header Handling ---
function setupScrollHeader() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  // Menu Category Tabs
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.getAttribute('data-category');
      filterProducts();
    });
  });

  // Search Bar Input
  searchInput.addEventListener('input', filterProducts);

  // Cart Open / Close
  openCartBtn.addEventListener('click', () => {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
  });

  const closeCartFunc = () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
  };

  closeCartBtn.addEventListener('click', closeCartFunc);
  cartOverlay.addEventListener('click', closeCartFunc);

  // Checkout Button Action
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast("Your basket is empty. Add items first!");
      return;
    }
    showToast("Pre-order submitted! Thank you.");
    cart = [];
    updateCartUI();
    closeCartFunc();
  });

  // Modal Events
  modalClose.addEventListener('click', closeModal);
  itemModal.addEventListener('click', (e) => {
    if (e.target === itemModal) closeModal();
  });

  modalAddBtn.addEventListener('click', () => {
    if (activeModalProductId) {
      addToCart(activeModalProductId);
      closeModal();
    }
  });

  // Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const subject = document.getElementById('subject').value;
    showToast(`Thank you, ${name}! Your ${subject} request was sent.`);
    contactForm.reset();
  });
}
