"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, RotateCcw, X, Star } from "lucide-react";
import { mockProducts } from "@/data/mockData";
import { useCartStore } from "@/store/cartStore";
import ProductCard from "@/components/product-card";

// Main Shop content component that reads search params
function ShopContent() {
  const searchParams = useSearchParams();
  const { searchQuery, setSearchQuery } = useCartStore();

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(400);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync category from URL query param if present
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [searchParams]);

  // Categories list
  const categoriesList = ["Audio", "Accessories", "Gear", "Wearables"];

  // Toggle Category
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(400);
    setMinRating(0);
    setSortBy("featured");
    setSearchQuery("");
  };

  // Filtering Logic
  const filteredProducts = mockProducts.filter((product) => {
    // 1. Category Filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    // 2. Price Filter
    if (product.price > maxPrice) {
      return false;
    }
    // 3. Rating Filter
    if (product.rating < minRating) {
      return false;
    }
    // 4. Navbar Search Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchesTitle = product.title.toLowerCase().includes(query);
      const matchesDesc = product.description.toLowerCase().includes(query);
      const matchesCat = product.category.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc && !matchesCat) {
        return false;
      }
    }
    return true;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price;
    }
    if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    if (sortBy === "rating-desc") {
      return b.rating - a.rating;
    }
    // Default or "featured"
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Catalog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Showing {sortedProducts.length} of {mockProducts.length} premium creations.
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Button */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="md:hidden flex h-10 px-4 bg-secondary text-foreground border border-border items-center gap-2 text-sm font-semibold rounded-lg hover:bg-border/60 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 bg-secondary text-foreground text-sm font-medium border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="hidden md:block space-y-6 p-5 border border-border rounded-2xl bg-card">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h2 className="text-sm font-bold tracking-wide uppercase text-foreground">Filters</h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors font-medium"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Categories</h3>
            <div className="space-y-2">
              {categoriesList.map((cat) => (
                <label key={cat} className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 border-t border-border/40 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Max Price</h3>
              <span className="text-xs font-bold text-primary">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="80"
              max="400"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>$80</span>
              <span>$400</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3 border-t border-border/40 pt-4">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Minimum Rating</h3>
            <div className="space-y-2">
              {[0, 4.5, 4.7, 4.9].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`w-full flex items-center gap-2 text-sm text-left px-2 py-1.5 rounded-md transition-colors ${
                    minRating === rating
                      ? "bg-secondary text-primary font-semibold border border-primary/20"
                      : "text-muted-foreground hover:bg-secondary/40"
                  }`}
                >
                  <Star className={`h-4.5 w-4.5 ${rating > 0 ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                  <span>{rating === 0 ? "All Ratings" : `${rating.toFixed(1)} Stars & Up`}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID SECTION */}
        <div className="md:col-span-3 space-y-6">
          {/* Active search banner */}
          {searchQuery.trim() !== "" && (
            <div className="flex items-center justify-between px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground">
              <span>
                Search results for: <span className="font-semibold text-primary">"{searchQuery}"</span>
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 hover:bg-border rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {sortedProducts.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-20 bg-card border border-border rounded-2xl p-6">
              <RotateCcw className="h-10 w-10 text-muted-foreground/35 mb-4 animate-spin-reverse" />
              <h3 className="text-base font-bold text-foreground">No matches found</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed">
                We couldn't find any products matching your current filters. Try relaxing your parameters or resetting them.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md text-xs hover:bg-primary/95 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Catalog Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* MOBILE FILTERS DRAWER */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Overlay */}
          <div
            onClick={() => setIsMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-xs bg-card border-l border-border h-full flex flex-col p-6 shadow-2xl z-10 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
              <h2 className="text-base font-bold text-foreground">Filters</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Category */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Categories</h3>
                <div className="space-y-2">
                  {categoriesList.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="h-4.5 w-4.5 rounded border-border text-primary"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-3 border-t border-border/40 pt-5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Max Price</h3>
                  <span className="text-sm font-bold text-primary">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="400"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Rating */}
              <div className="space-y-3 border-t border-border/40 pt-5">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Minimum Rating</h3>
                <div className="space-y-2">
                  {[0, 4.5, 4.7, 4.9].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        setMinRating(rating);
                        setIsMobileFiltersOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 text-sm text-left px-2 py-2 rounded-md ${
                        minRating === rating ? "bg-secondary text-primary font-semibold" : "text-muted-foreground"
                      }`}
                    >
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{rating === 0 ? "All Ratings" : `${rating.toFixed(1)} Stars & Up`}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border/40 flex gap-3">
                <button
                  onClick={() => {
                    handleResetFilters();
                    setIsMobileFiltersOpen(false);
                  }}
                  className="flex-1 h-10 border border-border hover:bg-secondary rounded-lg text-sm font-medium text-foreground transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-1 h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg text-sm transition-colors"
                >
                  Apply
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Wrapper component to provide Suspense context for useSearchParams
export default function Shop() {
  return (
    <Suspense fallback={
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
