import { Product } from "@/types";

export const mockProducts: Product[] = [
  {
    id: "aerosound-studio-max",
    title: "AeroSound Studio Max",
    description: "Experience acoustic perfection with ultra-premium active noise cancelling over-ear headphones. Engineered for audiophiles seeking raw purity in sound. Designed with a custom acoustic cavity and custom dynamic drivers to produce detailed mids, crisp highs, and thunderous, distortion-free bass.",
    price: 299,
    images: ["/images/headphones.png"],
    sizes: ["Standard"],
    colors: [
      { name: "Matte Charcoal", hex: "#1e293b" },
      { name: "Platinum Silver", hex: "#cbd5e1" },
      { name: "Indigo Slate", hex: "#312e81" }
    ],
    rating: 4.8,
    reviewCount: 128,
    inventory: 8,
    category: "Audio",
    details: [
      "Custom active noise cancellation (ANC) blocks out external sounds.",
      "High-fidelity custom acoustic architecture with ultra-low distortion.",
      "Up to 40 hours of continuous playback on a single charge.",
      "Luxury memory foam earcups covered in breathable, premium knit mesh.",
      "Strobe charging: 10 minutes provides 5 hours of listening time."
    ],
    specs: [
      { label: "Driver Size", value: "40mm Dynamic" },
      { label: "Connectivity", value: "Bluetooth 5.3 & 3.5mm Wired" },
      { label: "Battery Life", value: "Up to 40 hours (ANC On)" },
      { label: "Weight", value: "320g" },
      { label: "Charging Port", value: "USB-C Fast Charge" }
    ],
    reviews: [
      {
        id: "rev-1",
        author: "Marcus Vance",
        rating: 5,
        date: "May 12, 2026",
        content: "Absolute masterclass in acoustics. The active noise cancelling is eerily quiet, and the soundstage is wider than any closed-back headphones I have ever used. Stunning design.",
        verified: true
      },
      {
        id: "rev-2",
        author: "Sarah Lin",
        rating: 4,
        date: "May 20, 2026",
        content: "Beautiful minimalist styling that looks sleek in the office. Very comfortable for long hours, though they are slightly heavier than my previous pair. The charging speed is phenomenal.",
        verified: true
      }
    ],
    featured: true,
    trending: true
  },
  {
    id: "keyforge-mechanical-pro",
    title: "KeyForge Mechanical Pro",
    description: "Crafted for precision, this high-end mechanical keyboard features a CNC-milled anodized aluminum chassis, hot-swappable tactile switches, and doubleshot PBT keycaps. Its layout optimizes space without sacrificing essential workspace commands, backed by a pre-lubricated internal sound-dampening system for a crisp, quiet keystroke sound.",
    price: 189,
    images: ["/images/keyboard.png"],
    sizes: ["Tenkeyless", "Full Size"],
    colors: [
      { name: "Anodized Gray", hex: "#475569" },
      { name: "Midnight Black", hex: "#0f172a" }
    ],
    rating: 4.7,
    reviewCount: 85,
    inventory: 4,
    category: "Accessories",
    details: [
      "Solid CNC-anodized aluminum frame with magnetic elevation feet.",
      "Hot-swappable sockets compatible with 3-pin and 5-pin switches.",
      "Pre-lubed linear cream switches for an ultra-smooth typing experience.",
      "Double-shot PBT keycaps resist shine and wear over long-term use.",
      "Sleek customizable white backlighting with multiple micro-animations."
    ],
    specs: [
      { label: "Switch Type", value: "Linear Cream (Pre-lubricated)" },
      { label: "Keycap Material", value: "Double-shot PBT" },
      { label: "Interface", value: "Detachable USB-C" },
      { label: "Dimensions", value: "355 x 135 x 38 mm" },
      { label: "OS Compatibility", value: "macOS, Windows, Linux" }
    ],
    reviews: [
      {
        id: "rev-3",
        author: "Aiden Croft",
        rating: 5,
        date: "April 28, 2026",
        content: "The heavy aluminum deck doesn't budge an inch. Key strokes sound like raindrops on slate. Best keyboard I have owned by far.",
        verified: true
      },
      {
        id: "rev-4",
        author: "Elena Rostov",
        rating: 4,
        date: "May 15, 2026",
        content: "Wonderful out-of-the-box experience. No modding required. Swapped the switches on the arrow keys with clicky ones in seconds. Subtracting one star only because I wish it came with a dust cover.",
        verified: false
      }
    ],
    featured: true
  },
  {
    id: "nomad-urban-backpack",
    title: "Nomad Urban Backpack",
    description: "An ultra-durable, weather-resistant commuter pack built for modern professionals. Designed to carry your workstation safely with a dedicated padded laptop cradle, organized internal dividers, and hidden magnetic quick-access pockets. Crafted from recycled ballistic nylon, it stands upright on its own and holds its premium shape empty or full.",
    price: 145,
    images: ["/images/backpack.png"],
    sizes: ["20L", "24L"],
    colors: [
      { name: "Obsidian Black", hex: "#020617" },
      { name: "Slate Gray", hex: "#334155" },
      { name: "Desert Sand", hex: "#d97706" }
    ],
    rating: 4.9,
    reviewCount: 210,
    inventory: 12,
    category: "Gear",
    details: [
      "Waterproof exterior zippers and 1680D ballistic nylon shield.",
      "Suspended laptop pocket holds devices up to 16 inches securely.",
      "Luggage pass-through handle sleeve for seamless airport travel.",
      "Magnetic sternum strap snap and ergonomic mesh shoulder pads.",
      "Concealed passport pocket and quick-access top tray."
    ],
    specs: [
      { label: "Material", value: "1680D Cordura Ballistic Nylon" },
      { label: "Volume Capacity", value: "20 Liters / 24 Liters" },
      { label: "Laptop Sleeve", value: "Fits up to 16\" MacBook Pro" },
      { label: "Weight", value: "1.1 kg" },
      { label: "Water Resistance", value: "IPX4 Spray Proof" }
    ],
    reviews: [
      {
        id: "rev-5",
        author: "James K.",
        rating: 5,
        date: "May 02, 2026",
        content: "Extremely clean profile. Keeps my iPad, laptop, chargers, and notebooks organized. Even in heavy rain, my electronics stayed completely bone-dry. Zero complaints.",
        verified: true
      }
    ],
    featured: true,
    trending: true
  },
  {
    id: "horizon-smartwatch-slate",
    title: "Horizon Smartwatch Slate",
    description: "Track your vitals, answer notifications, and command your day with a minimalist OLED smartwatch. Features a high-resolution ambient display under sapphire glass, a custom lightweight watch head, and long-range sensors. The optimized power system ensures charging is only required once a week.",
    price: 349,
    images: ["/images/watch.png"],
    sizes: ["40mm", "44mm"],
    colors: [
      { name: "Onyx Black", hex: "#090d16" },
      { name: "Cognac Amber", hex: "#b45309" }
    ],
    rating: 4.6,
    reviewCount: 64,
    inventory: 3,
    category: "Wearables",
    details: [
      "Always-on Retina OLED display with sapphire scratch-resistant crystal.",
      "Heart rate monitor, blood oxygen tracker, and ECG sensor modules.",
      "Water resistant up to 50 meters (5 ATM) with automated water ejection.",
      "Up to 7 days of normal battery life, 20 days in Power Saver.",
      "Haptic crown scroll provides physical feedback for screen scrolling."
    ],
    specs: [
      { label: "Display", value: "1.78\" Always-On OLED (Sapphire)" },
      { label: "Water Resistance", value: "5 ATM (50 Meters)" },
      { label: "Battery Life", value: "Up to 7 Days (Always-On Off)" },
      { label: "Sensors", value: "ECG, SpO2, Heart Rate, Gyroscope" },
      { label: "Band Material", value: "Premium Italian Calf Leather" }
    ],
    reviews: [
      {
        id: "rev-6",
        author: "Devin Moore",
        rating: 4,
        date: "May 10, 2026",
        content: "Love the custom typography and clean interfaces. It tracks sleep patterns very accurately. I swapped the leather band for a silicone one during workouts. Best screen on the market.",
        verified: true
      }
    ],
    trending: true
  },
  {
    id: "aerosound-pocket-buds",
    title: "AeroSound Pocket Buds",
    description: "Compact wireless earbuds delivering astonishingly rich acoustics. With a custom charging capsule that slides open like a matchbox, these buds fit flush in your ear and provide high-fidelity audio with seamless ambient switching controls.",
    price: 129,
    images: ["/images/headphones.png"],
    sizes: ["Standard"],
    colors: [
      { name: "Carbon Black", hex: "#1e293b" },
      { name: "Polar White", hex: "#ffffff" }
    ],
    rating: 4.5,
    reviewCount: 412,
    inventory: 20,
    category: "Audio",
    details: [
      "Pocket-sized slide-open anodized aluminum charging capsule.",
      "IPX4 sweat and splash resistance for sports and runs.",
      "Intelligent touch controls on earbud surfaces.",
      "8 hours of listening time, total 28 hours with the case.",
      "Dual beam-forming microphones for crystal-clear calls."
    ],
    specs: [
      { label: "Driver Size", value: "10mm Dynamic Graphene" },
      { label: "Water Resistance", value: "IPX4 Splash Proof" },
      { label: "Battery Life", value: "8 Hours (28 Hours Total with Case)" },
      { label: "Weight", value: "5.5g per earbud" },
      { label: "Charge Type", value: "USB-C & Wireless Qi Charging" }
    ],
    reviews: [
      {
        id: "rev-7",
        author: "Kaitlyn Ross",
        rating: 5,
        date: "April 11, 2026",
        content: "The sliding mechanism of the case is addictive. Earbuds are tiny and don't hurt my ears even after hours of work calls. Bass is punchy for such a small driver.",
        verified: true
      }
    ]
  },
  {
    id: "keyforge-tactile-lite",
    title: "KeyForge Tactile Lite",
    description: "A compact 60% mechanical keyboard designed to liberate desk real estate. Features premium tactile brown switches for satisfying feedback without loud clicking noises, encased in a low-profile aluminum top case.",
    price: 119,
    images: ["/images/keyboard.png"],
    sizes: ["60% Compact"],
    colors: [
      { name: "Chalk White", hex: "#f8fafc" },
      { name: "Graphite Gray", hex: "#1e293b" }
    ],
    rating: 4.4,
    reviewCount: 94,
    inventory: 15,
    category: "Accessories",
    details: [
      "Ultra-compact 60% layout maximizes desk mouse movement space.",
      "Tactile brown switches with a distinct, quiet actuation bump.",
      "Bluetooth multi-pairing connects up to 3 devices simultaneously.",
      "Long-lasting internal rechargeable battery (up to 3 months without lights).",
      "Dynamic key mapping using browser-based web config tools."
    ],
    specs: [
      { label: "Layout", value: "60% ANSI Layout" },
      { label: "Switch Type", value: "Tactile Brown" },
      { label: "Wireless Life", value: "Up to 120 Hours (No Backlight)" },
      { label: "Weight", value: "580g" },
      { label: "Connection", value: "Bluetooth 5.1 & Wired USB-C" }
    ],
    reviews: [
      {
        id: "rev-8",
        author: "Thomas H.",
        rating: 4,
        date: "May 22, 2026",
        content: "Perfect for typing codes on the go. Fits right in my backpack with my laptop. Tactile switches feel crisp and aren't loud enough to annoy coworkers.",
        verified: true
      }
    ]
  },
  {
    id: "nomad-tech-sling",
    title: "Nomad Tech Sling",
    description: "For minimal days, this compact sling bag organizes your daily essentials—iPad Mini, phone, wallet, keys, and charger. Featuring a cut-proof strap and magnetic buckle release for fast wear adjustment.",
    price: 89,
    images: ["/images/backpack.png"],
    sizes: ["8L"],
    colors: [
      { name: "Charcoal Black", hex: "#0f172a" },
      { name: "Slate Navy", hex: "#1e3a8a" }
    ],
    rating: 4.8,
    reviewCount: 56,
    inventory: 2,
    category: "Gear",
    details: [
      "Fidlock® magnetic buckle for rapid strap release and secure lock.",
      "Structured padding prevents pressure points against your ribs.",
      "Soft micro-fiber lined compartment protects phones and sunglasses.",
      "Concealed zipper compartments keep travel documents secure.",
      "Semi-rigid front plate protects internal items from blunt impacts."
    ],
    specs: [
      { label: "Capacity", value: "8 Liters" },
      { label: "Dimensions", value: "310 x 200 x 90 mm" },
      { label: "Tablet Pocket", value: "Fits up to 11\" iPad Pro" },
      { label: "Strap Length", value: "Adjustable 75cm to 135cm" },
      { label: "Weight", value: "480g" }
    ],
    reviews: [
      {
        id: "rev-9",
        author: "Oliver G.",
        rating: 5,
        date: "May 19, 2026",
        content: "Awesome sling. The magnetic buckle snaps together like magic. Fits my Kindle, water bottle, and battery pack easily.",
        verified: true
      }
    ]
  },
  {
    id: "horizon-active-fit",
    title: "Horizon Active Fit",
    description: "Designed for high-intensity activity, this smartwatch houses active sensors in an ultra-lightweight polymer shell. Built with a breathable sport loop, GPS route mapping, and direct sync capabilities with major fitness tracking databases.",
    price: 249,
    images: ["/images/watch.png"],
    sizes: ["42mm"],
    colors: [
      { name: "Sport Black", hex: "#020617" },
      { name: "Neon Green", hex: "#22c55e" },
      { name: "Cobalt Blue", hex: "#2563eb" }
    ],
    rating: 4.3,
    reviewCount: 110,
    inventory: 18,
    category: "Wearables",
    details: [
      "Ultra-durable, fiber-reinforced composite frame weighing only 28g.",
      "Dynamic GPS tracks runs and swims without needing your phone.",
      "Optimized optical heart-rate tracker and hydration reminder alerts.",
      "Breathable nylon sport loop with high-grip Velcro micro-adjustments.",
      "Up to 14 days of run-tracking battery life between charges."
    ],
    specs: [
      { label: "Display", value: "1.4\" Transflective MIP (Sunlight Readable)" },
      { label: "GPS Module", value: "Multi-satellite GLONASS/Galileo" },
      { label: "Waterproofing", value: "10 ATM (100 Meters)" },
      { label: "Battery Life", value: "Up to 14 Days (Smartwatch Mode)" },
      { label: "Weight", value: "38g (with loop)" }
    ],
    reviews: [
      {
        id: "rev-10",
        author: "Clara West",
        rating: 4,
        date: "May 05, 2026",
        content: "This watch is virtually weightless. The screen is extremely readable in bright direct sunlight, which is ideal for runs. Highly recommend for runners.",
        verified: true
      }
    ]
  }
];
