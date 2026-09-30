const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Demo products data for automatic seeding
const initialProducts = [
  {
    id: 1,
    name: "Rose Glow Velvet Lipstick",
    category: "Beauty",
    price: 799,
    oldPrice: 1199,
    rating: 4.8,
    reviews: 142,
    badge: "BEST SELLER",
    isNew: false,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
    description: "Hydrating matte rose lipstick enriched with vitamin E and jojoba oil. Delivers an intense, long-lasting velvety pink flush for up to 12 hours.",
    inStock: true,
    stockCount: 18
  },
  {
    id: 2,
    name: "Blush Luxe Beauty Kit",
    category: "Beauty",
    price: 1899,
    oldPrice: 2499,
    rating: 4.9,
    reviews: 89,
    badge: "FEATURED",
    isNew: false,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    description: "Complete 5-piece makeup collection including blush palette, highlight stick, glossy lip balm, rose eyeshadow, and a velvet makeup pouch.",
    inStock: true,
    stockCount: 12
  },
  {
    id: 3,
    name: "Pastel Pink Leather Handbag",
    category: "Accessories",
    price: 2499,
    oldPrice: 3499,
    rating: 4.7,
    reviews: 210,
    badge: "TRENDING",
    isNew: false,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    description: "Handcrafted vegan leather handbag featuring golden metallic accents, dual straps, soft micro-suede inner lining, and spacious compartments.",
    inStock: true,
    stockCount: 8
  },
  {
    id: 4,
    name: "Romantic Floral Wrap Dress",
    category: "Fashion",
    price: 1799,
    oldPrice: 2299,
    rating: 4.6,
    reviews: 95,
    badge: "POPULAR",
    isNew: true,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
    description: "Lightweight chiffon floral print wrap dress with ruffled hem and adjustable waist tie. Perfect for sunny day outings and brunch parties.",
    inStock: true,
    stockCount: 15
  },
  {
    id: 5,
    name: "Freshwater Pearl & Gold Bracelet",
    category: "Accessories",
    price: 999,
    oldPrice: 1499,
    rating: 4.9,
    reviews: 74,
    badge: "NEW",
    isNew: true,
    image: "https://images.unsplash.com/photo-1611591475777-233cd7a7c771?auto=format&fit=crop&w=600&q=80",
    description: "Elegantly strung natural freshwater pearls paired with 18k gold-plated pink crystal charm. Tarnish-free and hypoallergenic.",
    inStock: true,
    stockCount: 22
  },
  {
    id: 6,
    name: "Pink Blossom Smart Fitness Watch",
    category: "Electronics",
    price: 2999,
    oldPrice: 4299,
    rating: 4.8,
    reviews: 310,
    badge: "TOP RATED",
    isNew: true,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
    description: "Ultra-sleek smart watch featuring a crisp AMOLED display, heart rate monitor, sleep tracking, 50+ workout modes, and 7-day battery life.",
    inStock: true,
    stockCount: 9
  },
  {
    id: 7,
    name: "Cute Mushroom LED Desk Lamp",
    category: "Home",
    price: 899,
    oldPrice: 1299,
    rating: 4.5,
    reviews: 67,
    badge: "CUTE PICK",
    isNew: false,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    description: "Rechargeable dimmable LED lamp with 3 color temperatures (warm, natural, cool pink glow). Touch sensor brightness adjustment.",
    inStock: true,
    stockCount: 25
  },
  {
    id: 8,
    name: "Blossom Bloom Eau De Parfum 100ml",
    category: "Beauty",
    price: 2199,
    oldPrice: 2999,
    rating: 4.9,
    reviews: 188,
    badge: "LUXURY",
    isNew: false,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    description: "Enchanting floral fragrance featuring notes of wild peony, white jasmine, pink pepper, and sweet vanilla musk in a crystal bottle.",
    inStock: true,
    stockCount: 11
  },
  {
    id: 9,
    name: "360° Acrylic Pink Makeup Organizer",
    category: "Home",
    price: 1199,
    oldPrice: 1699,
    rating: 4.7,
    reviews: 156,
    badge: "BEST SELLER",
    isNew: false,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    description: "Smooth rotating 3-tier acrylic storage tower with adjustable shelves for lipsticks, brushes, creams, and perfume bottles.",
    inStock: true,
    stockCount: 14
  },
  {
    id: 10,
    name: "Blush Pods ANC Wireless Earbuds",
    category: "Electronics",
    price: 2299,
    oldPrice: 3199,
    rating: 4.8,
    reviews: 240,
    badge: "HOT",
    isNew: true,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    description: "Active Noise Cancelling TWS earbuds with custom 10mm drivers, touch controls, IPX5 water resistance, and 30-hour total playback with charging case.",
    inStock: true,
    stockCount: 16
  },
  {
    id: 11,
    name: "Matte Pink Insulated Water Bottle 750ml",
    category: "Home",
    price: 699,
    oldPrice: 999,
    rating: 4.6,
    reviews: 112,
    badge: "ESSENTIAL",
    isNew: false,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
    description: "Double-wall stainless steel vacuum bottle keeping drinks cold for 24 hours or hot for 12 hours. BPA-free leakproof lid.",
    inStock: true,
    stockCount: 30
  },
  {
    id: 12,
    name: "Pink Celebration Deluxe Gift Box",
    category: "Gifts",
    price: 1599,
    oldPrice: 2199,
    rating: 4.9,
    reviews: 98,
    badge: "GIFT FAV",
    isNew: true,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    description: "Curated gift set featuring a scented soy candle, satin scrunchie, ceramic mug, rose body lotion, and personalized greeting card in a luxury pink box.",
    inStock: true,
    stockCount: 10
  },
  {
    id: 13,
    name: "Pure Silk Pink Sleep Eye Mask",
    category: "Beauty",
    price: 499,
    oldPrice: 799,
    rating: 4.7,
    reviews: 84,
    badge: "UNDER ₹500",
    isNew: false,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
    description: "100% Mulberry silk sleep mask blocking light completely while preventing skin creases and retaining delicate eye area moisture.",
    inStock: true,
    stockCount: 40
  },
  {
    id: 14,
    name: "Retro Pink Wireless Mechanical Keyboard",
    category: "Electronics",
    price: 3499,
    oldPrice: 4999,
    rating: 4.9,
    reviews: 175,
    badge: "PREMIUM",
    isNew: true,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    description: "Typewriter-style mechanical keyboard with soft tactile switches, pastel pink keycaps, RGB backlighting, and Bluetooth 5.0 multi-device pairing.",
    inStock: true,
    stockCount: 7
  },
  {
    id: 15,
    name: "Velvet Rose Cushion Cover Set (Pack of 2)",
    category: "Home",
    price: 599,
    oldPrice: 899,
    rating: 4.5,
    reviews: 63,
    badge: "DECOR",
    isNew: false,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
    description: "Ultra-soft plush velvet 16x16 inch pillow covers with hidden zip closure. Adds a warm luxury accent to couches and bedrooms.",
    inStock: true,
    stockCount: 20
  }
];

// GET /api/products
router.get('/', async (req, res) => {
  try {
    let products = await Product.find({});
    
    // Auto seed if empty database
    if (products.length === 0) {
      console.log("🌱 Auto-seeding initial products into MongoDB database...");
      products = await Product.insertMany(initialProducts);
    }
    
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products/seed
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const seeded = await Product.insertMany(initialProducts);
    res.json({ success: true, message: 'Database seeded successfully!', count: seeded.length, data: seeded });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
