import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartState, Product } from "@/types/ecommerce";

interface CartStore extends CartState {
  addItem: (product: Product, size: number, quantity?: number) => void;
  removeItem: (productId: string, size: number) => void;
  updateQuantity: (productId: string, size: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearLastAdded: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string, size: number) => boolean;
  getItemQuantity: (productId: string, size: number) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAdded: null,

      addItem: (product: Product, size: number, quantity = 1) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) => item.product.id === product.id && item.size === size,
        );

        if (existingItemIndex > -1) {
          const newItems = [...items];
          newItems[existingItemIndex].quantity += quantity;
          set({
            items: newItems,
            lastAdded: newItems[existingItemIndex],
            isOpen: true,
          });
        } else {
          const newItem: CartItem = {
            product,
            quantity,
            size,
            addedAt: Date.now(),
          };
          set({
            items: [...items, newItem],
            lastAdded: newItem,
            isOpen: true,
          });
        }
      },

      removeItem: (productId: string, size: number) => {
        const { items } = get();
        set({
          items: items.filter(
            (item) => !(item.product.id === productId && item.size === size),
          ),
        });
      },

      updateQuantity: (productId: string, size: number, quantity: number) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: items.map((item) =>
            item.product.id === productId && item.size === size
              ? { ...item, quantity }
              : item,
          ),
        });
      },

      clearCart: () => set({ items: [], lastAdded: null }),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      clearLastAdded: () => set({ lastAdded: null }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0,
        );
      },

      isInCart: (productId: string, size: number) => {
        return get().items.some(
          (item) => item.product.id === productId && item.size === size,
        );
      },

      getItemQuantity: (productId: string, size: number) => {
        const item = get().items.find(
          (item) => item.product.id === productId && item.size === size,
        );
        return item?.quantity || 0;
      },
    }),
    {
      name: "drk-cart-storage",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
