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
  hasPhysicalItems: () => boolean;
  hasDigitalItems: () => boolean;
  getPhysicalItems: () => CartItem[];
  getDigitalItems: () => CartItem[];
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
            items: [
              ...state.items,
              {
                ...item,
                quantity: 1,
                // Ensure all CartItem properties are included
                image: item.image || undefined,
                author: item.author || undefined,
                description: item.description || undefined,
                productType: item.productType || "physical",
              },
            ],
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

      hasPhysicalItems: () => {
        return get().items.some((item) => item.productType === "physical");
      },

      hasDigitalItems: () => {
        return get().items.some((item) => item.productType === "digital");
      },

      getPhysicalItems: () => {
        return get().items.filter((item) => item.productType === "physical");
      },

      getDigitalItems: () => {
        return get().items.filter((item) => item.productType === "digital");
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
      // Recompute totals on hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          const totalItems = state.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const totalPrice = state.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          state.totalItems = totalItems;
          state.totalPrice = totalPrice;
        }
      },
    }
  )
);
