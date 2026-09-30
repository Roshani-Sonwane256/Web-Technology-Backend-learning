"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Sun, Moon, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const { cart, setCartOpen, searchQuery, setSearchQuery, user } = useCartStore();
  const [isDark, setIsDark] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const isDarkClass = document.documentElement.classList.contains("dark");
    setIsDark(isDarkClass);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (pathname !== "/shop" && query.trim() !== "") {
      router.push("/shop");
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border glassmorphism transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 font-bold text-xl tracking-tight text-foreground">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span>Aura</span>
              <span className="text-primary">Shop</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link 
              href="/" 
              className={`hover:text-foreground transition-colors ${pathname === "/" ? "text-foreground font-semibold" : ""}`}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className={`hover:text-foreground transition-colors ${pathname === "/shop" ? "text-foreground font-semibold" : ""}`}
            >
              Shop All
            </Link>
            <Link 
              href="/shop?category=Audio" 
              className={`hover:text-foreground transition-colors ${pathname === "/shop" && searchQuery === "" ? "text-foreground" : ""}`}
            >
              Audio
            </Link>
            <Link 
              href="/shop?category=Wearables" 
              className={`hover:text-foreground transition-colors ${pathname === "/shop" && searchQuery === "" ? "text-foreground" : ""}`}
            >
              Wearables
            </Link>
          </nav>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search premium products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-9 rounded-full bg-secondary/80 border border-border pl-9 pr-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile search toggle */}
            <Link href="/shop" className="p-2 sm:hidden hover:bg-secondary rounded-full transition-colors">
              <Search className="h-5 w-5 text-foreground" />
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-full text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 hover:bg-secondary rounded-full text-foreground relative transition-colors"
              aria-label="Open cart drawer"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 hover:bg-secondary rounded-full text-foreground flex items-center justify-center transition-colors"
                aria-label="Open user menu"
              >
                <User className="h-5 w-5" />
              </button>

              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-card border border-border shadow-lg ring-1 ring-black/5 focus:outline-none z-40 p-1">
                    <div className="px-3 py-2 border-b border-border text-xs">
                      <p className="font-semibold text-foreground">{user?.name || "Guest Account"}</p>
                      <p className="text-muted-foreground truncate">{user?.email || "guest@example.com"}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/shop"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-3 py-1.5 text-sm text-foreground hover:bg-secondary rounded-md transition-colors"
                      >
                        Browse Shop
                      </Link>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          alert("Profile dashboard is a mock screen for this checkout demo.");
                        }}
                        className="w-full text-left block px-3 py-1.5 text-sm text-foreground hover:bg-secondary rounded-md transition-colors"
                      >
                        Account Settings
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
