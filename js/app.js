/* ==========================================================================
   Pink Basket - Core Application Logic
   ========================================================================== */

// --- Global State ---
let cart = [];
let favorites = [];
let currentUser = null;
let currentTheme = 'light';
let userOrders = [];

// Current Active Filter State
let filterState = {
  searchQuery: '',
  category: 'All',
  priceRange: 'All',
  minRating: 'All',
  sortBy: 'featured'
};

// --- DOM Content Loaded Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
  initLocalStorage();
  initTheme();
  initUser();
  initEventListeners();
  startCountdownTimer();

  // Check Backend Connection (MongoDB API)
  if (typeof PinkAPI !== 'undefined') {
    await PinkAPI.checkBackendHealth();
    const dbProducts = await PinkAPI.getProducts();
    if (dbProducts && dbProducts.length > 0) {
      window.activeProducts = dbProducts;
    }
  }

  // Initial Data Render
  renderProducts();
  renderNewArrivals();
  updateCounters();
  renderCart();
  renderFavoritesModal();

  // Scroll to Top Listener
  window.addEventListener('scroll', handleScrollTopVisibility);
});

// --- LocalStorage Initialization ---
function initLocalStorage() {
  // Favorites Initial Setup
  const storedFavs = localStorage.getItem('pinkBasketFavs');
  if (storedFavs !== null) {
    favorites = JSON.parse(storedFavs);
  } else {
    // Default 3 sample favorites as requested in prompt
    favorites = [1, 3, 5];
    localStorage.setItem('pinkBasketFavs', JSON.stringify(favorites));
  }

  // Cart Initial Setup
  const storedCart = localStorage.getItem('pinkBasketCart');
  if (storedCart !== null) {
    cart = JSON.parse(storedCart);
  } else {
    // Default 2 sample cart items as requested in prompt
    cart = [
      { id: 1, quantity: 1 },
      { id: 3, quantity: 1 }
    ];
    localStorage.setItem('pinkBasketCart', JSON.stringify(cart));
  }

  // Theme Initial Setup
  const storedTheme = localStorage.getItem('pinkBasketTheme');
  if (storedTheme) {
    currentTheme = storedTheme;
  }

  // User Initial Setup
  const storedUser = localStorage.getItem('pinkBasketUser');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
  }

  // Orders Initial Setup
  const storedOrders = localStorage.getItem('pinkBasketOrders');
  if (storedOrders) {
    userOrders = JSON.parse(storedOrders);
  } else {
    // Demo Order History
    userOrders = [
      {
        id: 'PB202609250012',
        date: '25 Sep 2026',
        items: [
          { name: 'Rose Glow Velvet Lipstick', price: 799, qty: 1 },
          { name: 'Pure Silk Pink Sleep Eye Mask', price: 499, qty: 1 }
        ],
        total: 1347,
        status: 'Delivered'
      }
    ];
    localStorage.setItem('pinkBasketOrders', JSON.stringify(userOrders));
  }
}

// --- Theme Handler ---
function initTheme() {
  document.documentElement.setAttribute('data-bs-theme', currentTheme);
  updateThemeIcon();
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', currentTheme);
  localStorage.setItem('pinkBasketTheme', currentTheme);
  updateThemeIcon();
  showToast(currentTheme === 'dark' ? 'Switched to Dark Pink Mode 🌙' : 'Switched to Light Pink Mode ☀️');
}

function updateThemeIcon() {
  const icons = [document.getElementById('themeIcon'), document.querySelector('#themeToggleBtnMobile i')];
  icons.forEach(icon => {
    if (icon) {
      if (currentTheme === 'dark') {
        icon.className = 'bi bi-sun-fill text-warning';
      } else {
        icon.className = 'bi bi-moon-stars text-danger';
      }
    }
  });
}

// --- User Auth & State ---
function initUser() {
  renderUserAccountNav();
}

function renderUserAccountNav() {
  const container = document.getElementById('userAccountContainer');
  if (!container) return;

  if (currentUser) {
    container.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-pink btn-sm rounded-pill dropdown-toggle d-flex align-items-center gap-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-person-heart text-danger"></i> Hi, ${escapeHtml(currentUser.name.split(' ')[0])}
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 mt-2">
          <li><a class="dropdown-item py-2" href="#" onclick="alert('Profile details for ${escapeHtml(currentUser.name)}')"><i class="bi bi-person-fill text-danger me-2"></i> My Profile</a></li>
          <li><a class="dropdown-item py-2" href="#" onclick="openMyOrdersModal()"><i class="bi bi-box-seam-fill text-danger me-2"></i> My Orders</a></li>
          <li><a class="dropdown-item py-2" href="#" data-bs-toggle="modal" data-bs-target="#favoritesModal"><i class="bi bi-heart-fill text-danger me-2"></i> Favorites (${favorites.length})</a></li>
          <li><a class="dropdown-item py-2" href="#" data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas"><i class="bi bi-bag-heart-fill text-danger me-2"></i> My Cart (${getCartTotalCount()})</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item py-2 text-danger fw-bold" href="#" onclick="handleLogout()"><i class="bi bi-box-arrow-right me-2"></i> Logout</a></li>
        </ul>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button class="btn btn-outline-pink btn-sm rounded-pill" data-bs-toggle="modal" data-bs-target="#loginModal">
        <i class="bi bi-person-circle me-1"></i> Account
      </button>
    `;
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const name = email.split('@')[0];
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  currentUser = { name: formattedName, email: email };
  localStorage.setItem('pinkBasketUser', JSON.stringify(currentUser));

  renderUserAccountNav();
  bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
  showToast(`Welcome back, ${formattedName}! 🌸`);
}

function handleSignupSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;

  currentUser = { name: name, email: email };
  localStorage.setItem('pinkBasketUser', JSON.stringify(currentUser));

  renderUserAccountNav();
  bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
  showToast(`Account created! Welcome, ${name} 💗`);
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('pinkBasketUser');
  renderUserAccountNav();
  showToast('Logged out successfully');
}

// --- Event Listeners Setup ---
function initEventListeners() {
  // Theme Toggle buttons
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);
  document.getElementById('themeToggleBtnMobile')?.addEventListener('click', toggleTheme);

  // Search input listeners (Navbar desktop & mobile)
  const navSearchInput = document.getElementById('navbarSearchInput');
  const navSearchInputMobile = document.getElementById('navbarSearchInputMobile');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  if (navSearchInput) {
    navSearchInput.addEventListener('input', (e) => {
      filterState.searchQuery = e.target.value.toLowerCase().trim();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('d-none', filterState.searchQuery === '');
      }
      handleFilterChange();
    });
  }

  if (navSearchInputMobile) {
    navSearchInputMobile.addEventListener('input', (e) => {
      filterState.searchQuery = e.target.value.toLowerCase().trim();
      handleFilterChange();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (navSearchInput) navSearchInput.value = '';
      if (navSearchInputMobile) navSearchInputMobile.value = '';
      filterState.searchQuery = '';
      clearSearchBtn.classList.add('d-none');
      handleFilterChange();
    });
  }
}

// --- Products Filtering & Rendering ---
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  // Filter products data
  let filtered = productsData.filter(p => {
    // Search filter
    if (filterState.searchQuery) {
      const q = filterState.searchQuery;
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchDesc) return false;
    }

    // Category filter
    if (filterState.category !== 'All' && p.category !== filterState.category) {
      return false;
    }

    // Price Range filter
    if (filterState.priceRange === 'under-500' && p.price >= 500) return false;
    if (filterState.priceRange === '500-1000' && (p.price < 500 || p.price > 1000)) return false;
    if (filterState.priceRange === '1000-2000' && (p.price < 1000 || p.price > 2000)) return false;
    if (filterState.priceRange === 'above-2000' && p.price <= 2000) return false;

    // Rating filter
    if (filterState.minRating !== 'All') {
      const minR = parseFloat(filterState.minRating);
      if (p.rating < minR) return false;
    }

    return true;
  });

  // Sorting Logic
  if (filterState.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filterState.sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (filterState.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (filterState.sortBy === 'newest') {
    filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  // Update Status Header
  const countSpan = document.getElementById('productResultsCount');
  const infoDiv = document.getElementById('productResultsInfo');
  const resetBtn = document.getElementById('resetFiltersBtn');

  if (countSpan) countSpan.textContent = filtered.length;

  const isFiltered = filterState.searchQuery || filterState.category !== 'All' || filterState.priceRange !== 'All' || filterState.minRating !== 'All';
  if (resetBtn) resetBtn.classList.toggle('d-none', !isFiltered);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="fs-1 text-danger mb-3">😔</div>
        <h4 class="fw-bold">No products found</h4>
        <p class="text-muted">Try clearing your search term or adjusting filters.</p>
        <button class="btn btn-pink mt-2" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  // Render product cards html
  grid.innerHTML = filtered.map(product => buildProductCardHTML(product)).join('');
}

function buildProductCardHTML(product) {
  const isFav = favorites.includes(product.id);
  const discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="product-card">
        <div class="product-img-wrapper">
          <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy">
          ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ''}
          <button class="product-fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${product.id})" title="${isFav ? 'Remove from Favorites' : 'Add to Favorites'}">
            <i class="bi ${isFav ? 'bi-heart-fill' : 'bi-heart'}"></i>
          </button>
        </div>

        <div class="product-body">
          <span class="product-category">${escapeHtml(product.category)}</span>
          <h5 class="product-title" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h5>

          <div class="product-rating">
            <i class="bi bi-star-fill"></i>
            <span class="fw-bold">${product.rating}</span>
            <span class="reviews-count">(${product.reviews})</span>
          </div>

          <div class="product-price-row">
            <span class="price-current">₹${product.price.toLocaleString()}</span>
            <span class="price-old">₹${product.oldPrice.toLocaleString()}</span>
            <span class="discount-tag">${discountPercent}% OFF</span>
          </div>

          <div class="product-actions mt-2">
            <button class="btn btn-pink btn-sm w-100 fw-bold" id="addBtn-${product.id}" onclick="addToCart(${product.id})">
              <i class="bi bi-cart-plus me-1"></i> Add to Cart
            </button>
            <button class="btn btn-outline-pink btn-sm" onclick="openProductDetails(${product.id})" title="View Details">
              <i class="bi bi-eye"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- Render New Arrivals Section ---
function renderNewArrivals() {
  const grid = document.getElementById('newArrivalsGrid');
  if (!grid) return;

  const newItems = productsData.filter(p => p.isNew || p.badge === 'NEW' || p.rating >= 4.8).slice(0, 4);

  grid.innerHTML = newItems.map(product => buildProductCardHTML(product)).join('');
}

// --- Filter Change Handlers ---
function handleFilterChange() {
  filterState.category = document.getElementById('filterCategorySelect')?.value || 'All';
  filterState.priceRange = document.getElementById('filterPriceSelect')?.value || 'All';
  filterState.minRating = document.getElementById('filterRatingSelect')?.value || 'All';
  filterState.sortBy = document.getElementById('sortSelect')?.value || 'featured';

  renderProducts();
}

function filterByCategory(categoryName) {
  filterState.category = categoryName;
  const categorySelect = document.getElementById('filterCategorySelect');
  if (categorySelect) categorySelect.value = categoryName;

  // Scroll to shop section
  const shopElem = document.getElementById('shop');
  if (shopElem) shopElem.scrollIntoView({ behavior: 'smooth' });

  renderProducts();
  showToast(`Filtered by ${categoryName} 🌸`);
}

function resetAllFilters() {
  filterState = {
    searchQuery: '',
    category: 'All',
    priceRange: 'All',
    minRating: 'All',
    sortBy: 'featured'
  };

  const navSearchInput = document.getElementById('navbarSearchInput');
  const navSearchInputMobile = document.getElementById('navbarSearchInputMobile');
  if (navSearchInput) navSearchInput.value = '';
  if (navSearchInputMobile) navSearchInputMobile.value = '';

  document.getElementById('filterCategorySelect').value = 'All';
  document.getElementById('filterPriceSelect').value = 'All';
  document.getElementById('filterRatingSelect').value = 'All';
  document.getElementById('sortSelect').value = 'featured';

  renderProducts();
  showToast('All filters reset ✨');
}

// --- Favorites System ---
function toggleFavorite(productId) {
  const index = favorites.indexOf(productId);
  let isAdded = false;

  if (index > -1) {
    favorites.splice(index, 1);
    showToast('Removed from Favorites');
  } else {
    favorites.push(productId);
    isAdded = true;
    showToast('Added to Favorites ❤️');
  }

  localStorage.setItem('pinkBasketFavs', JSON.stringify(favorites));

  updateCounters();
  renderProducts();
  renderNewArrivals();
  renderFavoritesModal();
  renderUserAccountNav();
}

function renderFavoritesModal() {
  const modalBody = document.getElementById('favoritesModalBody');
  const countSpan = document.getElementById('favModalCount');
  if (!modalBody) return;

  if (countSpan) countSpan.textContent = favorites.length;

  if (favorites.length === 0) {
    modalBody.innerHTML = `
      <div class="text-center py-5">
        <div class="fs-1 text-danger mb-3">❤️</div>
        <h4 class="fw-bold">Your wishlist is empty.</h4>
        <p class="text-muted">Save your favorite cute products here to shop later!</p>
        <button class="btn btn-pink mt-2" data-bs-dismiss="modal" onclick="document.getElementById('shop').scrollIntoView({behavior: 'smooth'})">Start Shopping</button>
      </div>
    `;
    return;
  }

  const favProducts = productsData.filter(p => favorites.includes(p.id));

  modalBody.innerHTML = `
    <div class="row g-3">
      ${favProducts.map(p => `
        <div class="col-12 col-md-6">
          <div class="d-flex align-items-center gap-3 p-3 border rounded-4 bg-body-tertiary">
            <img src="${p.image}" alt="${escapeHtml(p.name)}" class="rounded-3" style="width: 70px; height: 70px; object-fit: cover;">
            <div class="flex-grow-1 overflow-hidden">
              <h6 class="mb-1 text-truncate fw-bold">${escapeHtml(p.name)}</h6>
              <div class="text-danger fw-bold">₹${p.price.toLocaleString()}</div>
            </div>
            <div class="d-flex flex-column gap-1">
              <button class="btn btn-pink btn-sm" onclick="addToCart(${p.id})"><i class="bi bi-cart-plus"></i></button>
              <button class="btn btn-outline-danger btn-sm" onclick="toggleFavorite(${p.id})"><i class="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// --- Cart System ---
function addToCart(productId, qty = 1) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.push({ id: productId, quantity: qty });
  }

  localStorage.setItem('pinkBasketCart', JSON.stringify(cart));

  updateCounters();
  renderCart();

  // Temporary Button State Feedback
  const btn = document.getElementById(`addBtn-${productId}`);
  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="bi bi-check-lg me-1"></i> ✓ Added`;
    btn.classList.replace('btn-pink', 'btn-success');
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.replace('btn-success', 'btn-pink');
    }, 1500);
  }

  const product = productsData.find(p => p.id === productId);
  showToast(`Added ${product ? product.name : 'product'} to Cart 🛒`);
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  localStorage.setItem('pinkBasketCart', JSON.stringify(cart));
  updateCounters();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('pinkBasketCart', JSON.stringify(cart));

  updateCounters();
  renderCart();
  showToast('Product removed from cart');
}

function getCartTotalCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function calculateCartTotals() {
  let subtotal = 0;
  cart.forEach(item => {
    const product = productsData.find(p => p.id === item.id);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  const discount = subtotal > 1500 ? 200 : (subtotal > 800 ? 100 : 0);
  const delivery = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const total = Math.max(0, subtotal - discount + delivery);

  return { subtotal, discount, delivery, total };
}

function renderCart() {
  const cartBody = document.getElementById('cartBody');
  const cartCountTitle = document.getElementById('cartCountTitle');
  if (!cartBody) return;

  const totalCount = getCartTotalCount();
  if (cartCountTitle) cartCountTitle.textContent = totalCount;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="text-center my-auto py-5">
        <div class="fs-1 text-danger mb-3">🛒</div>
        <h5 class="fw-bold">Your cart is empty.</h5>
        <p class="text-muted small">Looks like you haven't added any pink goodies yet!</p>
        <button class="btn btn-pink btn-sm mt-2" data-bs-dismiss="offcanvas">Start Shopping</button>
      </div>
    `;
    updateCartTotalsDOM(0, 0, 0, 0);
    document.getElementById('proceedCheckoutBtn')?.setAttribute('disabled', 'true');
    return;
  }

  document.getElementById('proceedCheckoutBtn')?.removeAttribute('disabled');

  cartBody.innerHTML = cart.map(item => {
    const product = productsData.find(p => p.id === item.id);
    if (!product) return '';

    return `
      <div class="cart-item-card">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" class="cart-item-img">
        <div class="flex-grow-1 overflow-hidden">
          <h6 class="mb-0 fw-bold text-truncate" style="font-size: 0.9rem;">${escapeHtml(product.name)}</h6>
          <div class="text-danger fw-bold small">₹${product.price.toLocaleString()}</div>
        </div>

        <div class="qty-control me-2">
          <button class="qty-btn" onclick="updateCartQty(${product.id}, -1)">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQty(${product.id}, 1)">+</button>
        </div>

        <button class="btn btn-link text-muted p-0 border-0" onclick="removeFromCart(${product.id})" title="Remove item">
          <i class="bi bi-trash text-danger"></i>
        </button>
      </div>
    `;
  }).join('');

  const { subtotal, discount, delivery, total } = calculateCartTotals();
  updateCartTotalsDOM(subtotal, discount, delivery, total);
}

function updateCartTotalsDOM(subtotal, discount, delivery, total) {
  document.getElementById('cartSubtotal').textContent = `₹${subtotal.toLocaleString()}`;
  document.getElementById('cartDiscount').textContent = `-₹${discount.toLocaleString()}`;
  document.getElementById('cartDelivery').textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
  document.getElementById('cartTotal').textContent = `₹${total.toLocaleString()}`;
}

// --- Dynamic Counter Badges Update ---
function updateCounters() {
  const favCount = favorites.length;
  const cartCount = getCartTotalCount();

  const favDesktop = document.getElementById('favCounterDesktop');
  const favMobile = document.getElementById('favCounterMobile');
  const cartDesktop = document.getElementById('cartCounterDesktop');
  const cartMobile = document.getElementById('cartCounterMobile');

  if (favDesktop) favDesktop.textContent = favCount;
  if (favMobile) favMobile.textContent = favCount;
  if (cartDesktop) cartDesktop.textContent = cartCount;
  if (cartMobile) cartMobile.textContent = cartCount;
}

// --- Product Details Modal ---
function openProductDetails(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const isFav = favorites.includes(product.id);
  const discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  document.getElementById('detailProductName').textContent = product.name;

  const content = document.getElementById('detailModalContent');
  if (content) {
    content.innerHTML = `
      <div class="col-md-6 text-center">
        <div class="position-relative rounded-4 overflow-hidden shadow-sm">
          <img src="${product.image}" alt="${escapeHtml(product.name)}" class="img-fluid w-100">
          ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ''}
        </div>
      </div>
      <div class="col-md-6 d-flex flex-column">
        <span class="product-category mb-1">${escapeHtml(product.category)}</span>
        <h4 class="fw-bold mb-2">${escapeHtml(product.name)}</h4>

        <div class="d-flex align-items-center gap-2 mb-3">
          <div class="product-rating m-0">
            <i class="bi bi-star-fill"></i>
            <span class="fw-bold">${product.rating}</span>
            <span class="reviews-count">(${product.reviews} reviews)</span>
          </div>
          <span class="badge bg-success-subtle text-success ms-auto"><i class="bi bi-check-circle me-1"></i> In Stock (${product.stockCount})</span>
        </div>

        <p class="text-muted small mb-3">${escapeHtml(product.description)}</p>

        <div class="product-price-row mb-4">
          <span class="display-6 fw-extrabold text-danger">₹${product.price.toLocaleString()}</span>
          <span class="price-old fs-5">₹${product.oldPrice.toLocaleString()}</span>
          <span class="discount-tag fs-6">${discountPercent}% OFF</span>
        </div>

        <div class="d-flex align-items-center gap-3 mt-auto">
          <div class="d-flex align-items-center border rounded-pill p-1">
            <button class="btn btn-sm text-danger" onclick="changeDetailModalQty(-1)">-</button>
            <span class="px-3 fw-bold" id="modalQtyVal">1</span>
            <button class="btn btn-sm text-danger" onclick="changeDetailModalQty(1)">+</button>
          </div>
          <button class="btn btn-pink flex-grow-1 py-2 fw-bold" onclick="addFromDetailModal(${product.id})">
            <i class="bi bi-cart-plus me-1"></i> Add to Cart
          </button>
          <button class="btn btn-outline-pink ${isFav ? 'active' : ''}" onclick="toggleFavorite(${product.id})">
            <i class="bi ${isFav ? 'bi-heart-fill' : 'bi-heart'}"></i>
          </button>
        </div>
      </div>

      <div class="col-12 mt-4 pt-3 border-top">
        <h6 class="fw-bold mb-3">You May Also Like ✨</h6>
        <div class="row g-3">
          ${productsData.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3).map(rel => `
            <div class="col-4">
              <div class="card h-100 border-0 bg-body-tertiary p-2 text-center rounded-3 cursor-pointer" onclick="openProductDetails(${rel.id})">
                <img src="${rel.image}" class="img-fluid rounded-2 mb-2" style="height: 80px; object-fit: cover;">
                <div class="small fw-bold text-truncate">${escapeHtml(rel.name)}</div>
                <div class="text-danger small fw-bold">₹${rel.price.toLocaleString()}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  const modalElem = new bootstrap.Modal(document.getElementById('productDetailsModal'));
  modalElem.show();
}

function changeDetailModalQty(delta) {
  const elem = document.getElementById('modalQtyVal');
  if (!elem) return;
  let val = parseInt(elem.textContent) + delta;
  if (val < 1) val = 1;
  elem.textContent = val;
}

function addFromDetailModal(productId) {
  const qty = parseInt(document.getElementById('modalQtyVal')?.textContent || '1');
  addToCart(productId, qty);
  bootstrap.Modal.getInstance(document.getElementById('productDetailsModal'))?.hide();
}

// --- Checkout Flow ---
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }

  // Pre-fill user details if logged in
  if (currentUser) {
    document.getElementById('checkoutName').value = currentUser.name;
  }

  // Hide cart offcanvas if open
  const offcanvasElem = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
  if (offcanvasElem) offcanvasElem.hide();

  // Populate Order Summary inside Checkout
  const itemsContainer = document.getElementById('checkoutItemsList');
  if (itemsContainer) {
    itemsContainer.innerHTML = cart.map(item => {
      const p = productsData.find(prod => prod.id === item.id);
      if (!p) return '';
      return `
        <div class="d-flex justify-content-between align-items-center mb-2 small">
          <span class="text-truncate" style="max-width: 180px;">${escapeHtml(p.name)} (x${item.quantity})</span>
          <span class="fw-bold">₹${(p.price * item.quantity).toLocaleString()}</span>
        </div>
      `;
    }).join('');
  }

  const { subtotal, discount, delivery, total } = calculateCartTotals();
  document.getElementById('coSubtotal').textContent = `₹${subtotal.toLocaleString()}`;
  document.getElementById('coDiscount').textContent = `-₹${discount.toLocaleString()}`;
  document.getElementById('coDelivery').textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
  document.getElementById('coTotal').textContent = `₹${total.toLocaleString()}`;

  const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
  modal.show();
}

function handlePlaceOrder(e) {
  e.preventDefault();

  const name = document.getElementById('checkoutName').value;
  const phone = document.getElementById('checkoutPhone').value;
  const address = document.getElementById('checkoutAddress').value;
  const city = document.getElementById('checkoutCity').value;
  const { total } = calculateCartTotals();

  // Generate Demo Order ID
  const orderId = 'PB' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + Math.floor(1000 + Math.random() * 9000);

  const newOrder = {
    orderId: orderId,
    id: orderId,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    items: cart.map(item => {
      const p = productsData.find(prod => prod.id === item.id);
      return { name: p ? p.name : 'Product', price: p ? p.price : 0, qty: item.quantity };
    }),
    total: total,
    status: 'Processing',
    customer: { name, phone, address, city }
  };

  userOrders.unshift(newOrder);
  localStorage.setItem('pinkBasketOrders', JSON.stringify(userOrders));

  // Sync order to MongoDB database if server is online
  if (typeof PinkAPI !== 'undefined') {
    PinkAPI.createOrder(newOrder);
  }

  // Clear Cart
  cart = [];
  localStorage.setItem('pinkBasketCart', JSON.stringify([]));
  updateCounters();
  renderCart();

  // Close Checkout Modal
  bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();

  // Show Success Modal
  document.getElementById('successOrderID').textContent = orderId;
  document.getElementById('successTotal').textContent = `₹${total.toLocaleString()}`;

  const successModal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
  successModal.show();
  showToast('Order placed successfully 🎉');
}

// --- My Orders Modal ---
async function openMyOrdersModal() {
  if (typeof PinkAPI !== 'undefined') {
    const dbOrders = await PinkAPI.getOrders();
    if (dbOrders && Array.isArray(dbOrders) && dbOrders.length > 0) {
      userOrders = dbOrders.map(o => ({
        id: o.orderId || o.id || 'PB-ORDER',
        orderId: o.orderId || o.id || 'PB-ORDER',
        date: o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN')),
        items: o.items || [],
        total: o.total || 0,
        status: o.status || 'Processing'
      }));
    }
  }
  renderMyOrdersList();
  const modalElem = document.getElementById('myOrdersModal');
  if (modalElem) {
    const modal = bootstrap.Modal.getInstance(modalElem) || new bootstrap.Modal(modalElem);
    modal.show();
  }
}

function openMyOrdersFromSuccess() {
  bootstrap.Modal.getInstance(document.getElementById('orderSuccessModal'))?.hide();
  openMyOrdersModal();
}

function renderMyOrdersList() {
  const container = document.getElementById('myOrdersModalBody');
  if (!container) return;

  if (!userOrders || userOrders.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <div class="fs-1 text-danger mb-3">📦</div>
        <h5 class="fw-bold">No orders placed yet.</h5>
        <p class="text-muted">Start shopping to see your orders here!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = userOrders.map(order => {
    let statusBadgeClass = 'bg-warning text-dark';
    if (order.status === 'Delivered') statusBadgeClass = 'bg-success text-white';
    if (order.status === 'Shipped') statusBadgeClass = 'bg-info text-white';

    const orderIdDisp = order.orderId || order.id || 'PB-ORDER';
    const orderDateDisp = order.date || 'Recent';

    return `
      <div class="card border-0 shadow-sm rounded-4 mb-3 p-3 bg-body-tertiary">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
          <div>
            <span class="fw-bold text-danger me-2">${escapeHtml(orderIdDisp)}</span>
            <small class="text-muted">${escapeHtml(orderDateDisp)}</small>
          </div>
          <span class="badge ${statusBadgeClass} rounded-pill px-3 py-1">${escapeHtml(order.status || 'Processing')}</span>
        </div>
        <div class="mb-2">
          ${(order.items || []).map(item => `
            <div class="d-flex justify-content-between small text-muted mb-1">
              <span>${escapeHtml(item.name || 'Product')} (x${item.qty || 1})</span>
              <span>₹${((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
        <div class="d-flex justify-content-between align-items-center pt-2 border-top fw-bold">
          <span>Total Amount:</span>
          <span class="text-danger fs-6">₹${(order.total || 0).toLocaleString()}</span>
        </div>
      </div>
    `;
  }).join('');
}

// --- Countdown Timer ---
function startCountdownTimer() {
  let seconds = 2 * 86400 + 15 * 3600 + 45 * 60 + 32;

  setInterval(() => {
    if (seconds <= 0) return;
    seconds--;

    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    document.getElementById('cdDays').textContent = String(d).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(h).padStart(2, '0');
    document.getElementById('cdMins').textContent = String(m).padStart(2, '0');
    document.getElementById('cdSecs').textContent = String(s).padStart(2, '0');
  }, 1000);
}

// --- Newsletter Handler ---
function handleSubscribe(e) {
  e.preventDefault();
  const input = document.getElementById('newsletterEmail');
  if (input && input.value) {
    showToast('Thank you for subscribing! 💗');
    input.value = '';
  }
}

// --- Scroll Top Helper ---
function handleScrollTopVisibility() {
  const btn = document.getElementById('scrollTopBtn');
  if (btn) {
    btn.classList.toggle('show', window.scrollY > 300);
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Utility Toast System ---
function showToast(message, icon = '💗') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toastId = 'toast-' + Date.now();
  const toastHTML = `
    <div id="${toastId}" class="toast custom-toast align-items-center border-0 show fade mb-2" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex align-items-center">
        <div class="toast-body fw-bold">
          <span class="me-2">${icon}</span> ${escapeHtml(message)}
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', toastHTML);

  const toastElem = document.getElementById(toastId);
  setTimeout(() => {
    if (toastElem) {
      toastElem.classList.remove('show');
      setTimeout(() => toastElem.remove(), 400);
    }
  }, 3000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
