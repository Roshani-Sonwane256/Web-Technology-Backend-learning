/* ==========================================================================
   Pink Basket - API Integration Client (MongoDB Backend & Local Fallback)
   ========================================================================== */

let API_BASE_URL = 'http://127.0.0.1:5000/api';

const PinkAPI = {
  isBackendAvailable: false,

  // Check backend server status
  async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      const data = await res.json();
      if (data && data.status === 'online') {
        this.isBackendAvailable = true;
        console.log('🌸 Connected to Pink Basket MongoDB Backend Server!');
        this.updateBadgeUI(true);
        return true;
      }
    } catch (e) {
      this.isBackendAvailable = false;
      console.warn('⚠️ Backend server offline. Running in Local Mode with LocalStorage persistence.');
      this.updateBadgeUI(false);
    }
    return false;
  },

  updateBadgeUI(isOnline) {
    let badge = document.getElementById('backendStatusBadge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'backendStatusBadge';
      badge.className = 'position-fixed bottom-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm small fw-bold z-3';
      document.body.appendChild(badge);
    }
    if (isOnline) {
      badge.className = 'position-fixed bottom-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm small fw-bold z-3 bg-success text-white';
      badge.innerHTML = '🟢 MongoDB Connected';
    } else {
      badge.className = 'position-fixed bottom-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm small fw-bold z-3 bg-warning text-dark';
      badge.innerHTML = '🟡 Local Mode (No Server)';
    }
  },

  // Fetch Products from MongoDB or Local Data
  async getProducts() {
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          return json.data;
        }
      } catch (err) {
        console.error('Failed fetching products from MongoDB, using fallback:', err);
      }
    }
    return productsData;
  },

  // User Auth Login via MongoDB
  async loginUser(email, password) {
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const json = await res.json();
        if (json.success) {
          return json.user;
        }
      } catch (err) {
        console.error('MongoDB login error:', err);
      }
    }
    const name = email.split('@')[0];
    return { name: name.charAt(0).toUpperCase() + name.slice(1), email };
  },

  // Place Order in MongoDB
  async createOrder(orderData) {
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        const json = await res.json();
        if (json.success) {
          console.log('Order saved to MongoDB Compass database:', json.data);
          return json.data;
        }
      } catch (err) {
        console.error('Failed saving order to MongoDB:', err);
      }
    }
    return orderData;
  },

  // Fetch Orders from MongoDB
  async getOrders() {
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`);
        const json = await res.json();
        if (json.success) {
          return json.data;
        }
      } catch (err) {
        console.error('Failed fetching orders from MongoDB:', err);
      }
    }
    return JSON.parse(localStorage.getItem('pinkBasketOrders') || '[]');
  }
};
