import { create } from "zustand";
import { CartItem, Product, ColorVariant } from "@/types";

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  searchQuery: string;
  user: { name: string; email: string } | null;
  addToCart: (product: Product, quantity: number, color: ColorVariant, size: string) => void;
  removeFromCart: (productId: string, colorName: string, size: string) => void;
  updateQuantity: (productId: string, colorName: string, size: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  setUser: (user: { name: string; email: string } | null) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  isCartOpen: false,
  searchQuery: "",
  user: { name: "Alex Mercer", email: "alex.mercer@gmail.com" }, // Default logged-in mock user
  
  addToCart: (product, quantity, color, size) =>
    set((state) => {
      // Find if item with same ID, color, and size already exists in the cart
      const existingItemIndex = state.cart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.name === color.name &&
          item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        // Increment quantity of existing item
        const newCart = [...state.cart];
        const newQty = newCart[existingItemIndex].quantity + quantity;
        
        // Enforce inventory limit
        const maxQty = Math.min(newQty, product.inventory);
        newCart[existingItemIndex].quantity = maxQty;
        return { cart: newCart, isCartOpen: true };
      }

      // Add new item, enforcing inventory bounds
      const initialQty = Math.min(quantity, product.inventory);
      return {
        cart: [...state.cart, { product, quantity: initialQty, selectedColor: color, selectedSize: size }],
        isCartOpen: true // Open the drawer immediately on addition for premium feedback
      };
    }),

  removeFromCart: (productId, colorName, size) =>
    set((state) => ({
      cart: state.cart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor.name === colorName &&
            item.selectedSize === size
          )
      )
    })),

  updateQuantity: (productId, colorName, size, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor.name === colorName &&
          item.selectedSize === size
        ) {
          // Enforce inventory bounds
          const cleanQty = Math.max(1, Math.min(quantity, item.product.inventory));
          return { ...item, quantity: cleanQty };
        }
        return item;
      })
    })),

  clearCart: () => set({ cart: [] }),
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setUser: (user) => set({ user })
}));
