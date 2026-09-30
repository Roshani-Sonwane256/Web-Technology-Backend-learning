"use client";

import React from "react";
import Link from "next/link";
import { Star, ShoppingCart, Info } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const defaultColor = product.colors[0];
    const defaultSize = product.sizes[0] || "Standard";
    addToCart(product, 1, defaultColor, defaultSize);
  };

  const isLowStock = product.inventory < 5;

  return (
    <div className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">
      
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-secondary/35 p-6 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
              Featured
            </span>
          )}
          {isLowStock && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 rounded-full">
              Only {product.inventory} left
            </span>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>{product.category}</span>
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
              <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-1 hover:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Description Snippet */}
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
          <span className="text-base font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5">
            <Link 
              href={`/product/${product.id}`}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
              title="View details"
            >
              <Info className="h-4.5 w-4.5" />
            </Link>
            <button
              onClick={handleQuickAdd}
              disabled={product.inventory === 0}
              className="h-8 px-3 bg-primary hover:bg-primary/95 text-primary-foreground rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:bg-secondary disabled:text-muted-foreground"
              title="Quick add to cart"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
