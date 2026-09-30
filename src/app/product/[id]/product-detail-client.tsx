"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, ShoppingCart, Plus, Minus, Check, MessageSquare, ShieldCheck, Sparkles, Send } from "lucide-react";
import { Product, ColorVariant, Review } from "@/types";
import { useCartStore } from "@/store/cartStore";
import ProductCard from "@/components/product-card";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addToCart } = useCartStore();

  // Selection States
  const [selectedColor, setSelectedColor] = useState<ColorVariant>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "Standard");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "reviews">("details");
  
  // Gallery states
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  // Review states (allow adding to mock review list dynamically for demo)
  const [localReviews, setLocalReviews] = useState<Review[]>(product.reviews);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewContent, setNewReviewContent] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Simulate multiple views using styling offsets on the main image
  const galleryViews = [
    { title: "Primary Angle", style: "object-contain p-4 scale-100 transition-transform" },
    { title: "Macro Close-up", style: "object-contain scale-[1.5] origin-center -translate-y-3 transition-transform" },
    { title: "Offset Angle", style: "object-contain p-4 rotate-12 transition-transform" }
  ];

  // Cart click
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  // Review Submit
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewAuthor.trim() === "" || newReviewContent.trim() === "") return;

    const newReview: Review = {
      id: `rev-local-${Date.now()}`,
      author: newReviewAuthor,
      rating: newReviewRating,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      content: newReviewContent,
      verified: true
    };

    setLocalReviews([newReview, ...localReviews]);
    setNewReviewAuthor("");
    setNewReviewContent("");
    setNewReviewRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 5000);
  };

  const isLowStock = product.inventory < 5;

  return (
    <div className="space-y-16 pb-16">
      
      {/* Back Button Link */}
      <div className="flex items-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Product Detail Header & Controls */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* MEDIA GALLERY */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-secondary/35 border border-border/80 overflow-hidden flex items-center justify-center relative">
            <img
              src={product.images[0]}
              alt={product.title}
              className={`h-4/5 w-4/5 max-h-[400px] ${galleryViews[activeGalleryIndex].style}`}
            />
            
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-card/85 text-[10px] font-bold text-foreground border border-border rounded-full glassmorphism">
              {galleryViews[activeGalleryIndex].title}
            </div>
          </div>

          {/* Thumbnail Track */}
          <div className="grid grid-cols-3 gap-4">
            {galleryViews.map((view, index) => (
              <button
                key={index}
                onClick={() => setActiveGalleryIndex(index)}
                className={`aspect-square rounded-xl bg-secondary/25 border overflow-hidden flex items-center justify-center p-2 relative hover:bg-secondary/40 transition-all ${
                  activeGalleryIndex === index
                    ? "border-primary ring-1 ring-primary"
                    : "border-border/60"
                }`}
                aria-label={`View image thumbnail ${index + 1}`}
              >
                <img
                  src={product.images[0]}
                  alt={`${product.title} view ${index + 1}`}
                  className={`h-4/5 w-4/5 ${view.style}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS & Variant Selectors */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">{product.category}</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1">
                <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-foreground">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-muted-foreground">•</span>
              <button 
                onClick={() => setActiveTab("reviews")}
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline decoration-dotted font-medium"
              >
                {localReviews.length} Verified Buyer Reviews
              </button>
            </div>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="text-2xl font-extrabold text-foreground py-2 border-y border-border/40">
            ${product.price.toFixed(2)}
          </div>

          {/* Configuration Form */}
          <div className="space-y-5">
            {/* Color Config */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Color: <span className="font-semibold text-muted-foreground">{selectedColor.name}</span>
              </span>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all ${
                      selectedColor.name === color.name
                        ? "ring-2 ring-primary border-transparent scale-105"
                        : "border-border hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor.name === color.name && (
                      <Check className={`h-4 w-4 ${color.hex === "#ffffff" ? "text-black" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Config */}
            {product.sizes.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Select Size
                </span>
                <div className="flex items-center gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-xs font-semibold rounded-md transition-all ${
                        selectedSize === size
                          ? "bg-foreground text-background border-foreground shadow-xs"
                          : "border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Config & Stock Indicator */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Quantity
                </span>
                {/* Stock Indicator */}
                {product.inventory === 0 ? (
                  <span className="text-xs font-bold text-destructive">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="text-xs font-bold text-amber-500 animate-pulse">
                    Only {product.inventory} left in stock - Order Soon!
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                    In Stock (Ready to Ship)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Counter */}
                <div className="flex items-center border border-border rounded-lg bg-secondary h-11 px-1.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={product.inventory === 0}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-border rounded-md transition-colors disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-sm font-semibold text-foreground min-w-[28px] text-center">
                    {product.inventory === 0 ? 0 : quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.inventory, q + 1))}
                    disabled={product.inventory === 0 || quantity >= product.inventory}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-border rounded-md transition-colors disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.inventory === 0}
                  className="flex-1 h-11 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 flex items-center justify-center gap-2 group transition-colors shadow-xs disabled:bg-secondary disabled:text-muted-foreground"
                >
                  <ShoppingCart className="h-4.5 w-4.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* DETAIL TABS SECTION */}
      <section className="border border-border/80 rounded-2xl overflow-hidden bg-card">
        {/* Tab Headers */}
        <div className="flex border-b border-border/80 bg-secondary/15">
          {(["details", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-initial px-6 py-4 text-xs sm:text-sm font-semibold text-center border-b-2 capitalize transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary bg-card"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20"
              }`}
            >
              {tab === "reviews" ? `Reviews (${localReviews.length})` : tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 min-h-[220px]">
          {activeTab === "details" && (
            <ul className="space-y-4">
              {product.details.map((detail, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-muted-foreground leading-relaxed items-start">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "specs" && (
            <div className="max-w-xl border border-border/60 rounded-xl overflow-hidden divide-y divide-border/60">
              {product.specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-2 text-sm py-3 px-4 hover:bg-secondary/20 transition-colors">
                  <span className="font-semibold text-foreground">{spec.label}</span>
                  <span className="text-muted-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Review Feed */}
              <div className="lg:col-span-2 space-y-6 max-h-[400px] overflow-y-auto pr-2">
                {localReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No reviews yet. Be the first to review this product!</p>
                ) : (
                  localReviews.map((review) => (
                    <div key={review.id} className="space-y-2 border-b border-border/40 pb-5 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center text-xs">
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <span>{review.author}</span>
                          {review.verified && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md font-bold text-[9px] uppercase tracking-wide">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <span className="text-muted-foreground">{review.date}</span>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-3.5 w-3.5 ${
                              idx < review.rating ? "fill-amber-400 text-amber-400" : "text-border"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Form */}
              <div className="border border-border/60 rounded-xl p-5 bg-secondary/10 self-start">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <MessageSquare className="h-4.5 w-4.5 text-primary" />
                  <span>Write a review</span>
                </h3>

                <form onSubmit={handleAddReview} className="space-y-4">
                  {/* Name input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>

                  {/* Rating selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-0.5 focus:outline-none hover:scale-110 transition-transform"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= newReviewRating ? "fill-amber-400 text-amber-400" : "text-border"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Comments</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience..."
                      value={newReviewContent}
                      onChange={(e) => setNewReviewContent(e.target.value)}
                      className="w-full p-3 text-xs bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                    />
                  </div>

                  {/* Button */}
                  <button
                    type="submit"
                    className="w-full h-9 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:bg-primary/95 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="h-3 w-3" />
                    <span>Submit Review</span>
                  </button>

                  {reviewSubmitted && (
                    <p className="text-[11px] text-emerald-500 font-medium text-center animate-pulse">
                      ✓ Review submitted successfully!
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Complete the Setup
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
