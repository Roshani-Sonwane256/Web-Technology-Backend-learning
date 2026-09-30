export interface ColorVariant {
  name: string;
  hex: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: ColorVariant[];
  rating: number;
  reviewCount: number;
  inventory: number;
  category: string;
  details: string[];
  specs: ProductSpec[];
  reviews: Review[];
  featured?: boolean;
  trending?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: ColorVariant;
  selectedSize: string;
}
