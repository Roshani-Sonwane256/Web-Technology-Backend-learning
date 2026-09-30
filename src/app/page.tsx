"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Headphones, Keyboard, ShieldAlert, Watch, ArrowUpRight } from "lucide-react";
import { mockProducts } from "@/data/mockData";
import ProductCarousel from "@/components/product-carousel";

export default function Home() {
  // Get trending & featured products
  const featuredProducts = mockProducts.filter((p) => p.featured);
  const trendingProducts = mockProducts.filter((p) => p.trending);

  const categories = [
    {
      name: "Audio",
      description: "Acoustic purity & active noise isolation",
      icon: Headphones,
      color: "from-blue-500/10 to-indigo-500/10",
      iconColor: "text-blue-500",
      href: "/shop?category=Audio",
    },
    {
      name: "Accessories",
      description: "Machined mechanical decks & desktop utilities",
      icon: Keyboard,
      color: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-500",
      href: "/shop?category=Accessories",
    },
    {
      name: "Gear",
      description: "Weatherproof urban packs & tactical slings",
      icon: ShieldAlert, // Wait, let's use a backpack or luggage icon. Lucide has "Luggage" or "Briefcase". Let's use Briefcase
      color: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-500",
      href: "/shop?category=Gear",
    },
    {
      name: "Wearables",
      description: "Sapphire smartwatches & fitness loops",
      icon: Watch,
      color: "from-amber-500/10 to-orange-500/10",
      iconColor: "text-amber-500",
      href: "/shop?category=Wearables",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-card to-secondary/30 border border-border/80 px-6 py-12 sm:px-12 md:py-20 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Background glow effects */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Text Area */}
        <div className="flex-1 max-w-xl space-y-6 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Introducing the Spring Collection</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight sm:leading-none">
            Precision Built.<br className="hidden sm:inline" />
            <span className="text-primary bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Minimalist</span> Design.
          </h1>
          
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
            AuraShop curates high-performance hardware, keyboards, and watches designed for the modern desktop workspace. Zero filler, total capability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/shop"
              className="w-full sm:w-auto h-12 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>Shop New Arrivals</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
            
            <a
              href="#categories"
              className="w-full sm:w-auto h-12 px-6 bg-secondary text-foreground hover:bg-border/60 font-semibold rounded-lg flex items-center justify-center gap-2 border border-border transition-all"
            >
              <span>Explore Collections</span>
            </a>
          </div>
        </div>

        {/* Interactive Float Image */}
        <div className="flex-1 flex justify-center items-center relative w-full max-w-md lg:max-w-none">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 aspect-square p-8 rounded-full bg-secondary/35 border border-border/60 flex items-center justify-center z-10 animate-pulse-slow">
            {/* Custom Floating/Breathe class */}
            <img
              src="/images/headphones.png"
              alt="Featured Headphones"
              className="w-4/5 h-4/5 object-contain filter drop-shadow-2xl animate-float"
            />
            {/* Absolute accent spec card */}
            <div className="absolute bottom-4 left-0 sm:left-4 bg-card border border-border p-3.5 rounded-xl shadow-lg flex items-center gap-3 glassmorphism max-w-[200px] text-left">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">AeroSound Max</p>
                <p className="text-[10px] text-muted-foreground">Active Isolation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section id="categories" className="space-y-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Shop by Collection
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Curated categories tailored specifically to complement your productive ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative flex flex-col justify-between p-6 bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                {/* Visual Gradient Background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`p-3 w-fit rounded-xl bg-secondary border border-border/80 ${cat.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                      <span>{cat.name}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0 duration-300 text-primary" />
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS CAROUSEL */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Trending Now
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Our highest rated products, selected by creators and developers worldwide.
            </p>
          </div>
          
          <Link
            href="/shop"
            className="text-sm font-semibold text-primary hover:text-primary/90 flex items-center gap-1 transition-colors"
          >
            <span>View all products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ProductCarousel products={trendingProducts} />
      </section>

      {/* 4. BRAND PROMISE SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border pt-12">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary rounded-xl text-primary flex-shrink-0">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Premium Quality Assurance</h4>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Every item in our store is custom machined, tested, and shipped in double-walled secure boxes with verified certificates.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary rounded-xl text-primary flex-shrink-0">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Expedited Express Shipping</h4>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Unlock free standard shipping on orders over $150. Fast tracking links delivered to your inbox immediately upon dispatch.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary rounded-xl text-primary flex-shrink-0">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.28 15H18" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Hassle-Free 30-Day Returns</h4>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Not completely satisfied? Initiate a fast self-service exchange or return through our automated portal in under 5 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Keyframes styles for hero float and animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(1.5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

    </div>
  );
}
