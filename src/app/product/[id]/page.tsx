import React from "react";
import { notFound } from "next/navigation";
import { mockProducts } from "@/data/mockData";
import ProductDetailClient from "./product-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = mockProducts.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  // Get related products from same category, excluding the current product
  const relatedProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailClient 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}
