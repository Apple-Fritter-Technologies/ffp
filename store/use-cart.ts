import { CartItem } from "@/types/interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItem: (id: string) => CartItem | undefined;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);

        if (existingItem) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, quantity: 1 }],
          }));
        }

        // Update computed values
        const newState = get();
        set({
          totalItems: newState.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
          totalPrice: newState.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));

        // Update computed values
        const newState = get();
        set({
          totalItems: newState.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
          totalPrice: newState.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));

        // Update computed values
        const newState = get();
        set({
          totalItems: newState.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
          totalPrice: newState.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      getItem: (id) => {
        return get().items.find((item) => item.id === id);
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
