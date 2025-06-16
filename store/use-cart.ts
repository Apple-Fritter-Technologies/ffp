import { CartItem } from "@/types/interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, itemType?: "book" | "shop") => void;
  updateQuantity: (
    id: string,
    quantity: number,
    itemType?: "book" | "shop"
  ) => void;
  clearCart: () => void;
  getItem: (id: string, itemType?: "book" | "shop") => CartItem | undefined;
  hasPhysicalItems: () => boolean;
  hasDigitalItems: () => boolean;
  getPhysicalItems: () => CartItem[];
  getDigitalItems: () => CartItem[];
  getBookItems: () => CartItem[];
  getShopItems: () => CartItem[];
  hasBookItems: () => boolean;
  hasShopItems: () => boolean;
  getItemCount: (id: string, itemType: "book" | "shop") => number;
  isInCart: (id: string, itemType: "book" | "shop") => boolean;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => {
      // Helper function defined outside the returned object
      const updateTotals = () => {
        const items = get().items;
        set({
          totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        });
      };

      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,

        addItem: (item) => {
          const items = get().items;
          const existingItem = items.find(
            (i) => i.id === item.id && i.itemType === item.itemType
          );

          if (existingItem) {
            set((state) => ({
              items: state.items.map((i) =>
                i.id === item.id && i.itemType === item.itemType
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }));
          } else {
            set((state) => ({
              items: [
                ...state.items,
                {
                  ...item,
                  quantity: 1,
                  // Ensure all CartItem properties are included with proper defaults
                  image: item.image || undefined,
                  author: item.author || undefined,
                  description: item.description || undefined,
                  productType: item.productType || "physical",
                  itemType: item.itemType || "book", // Default to book for backward compatibility
                  genreId: item.genreId || undefined,
                },
              ],
            }));
          }

          updateTotals();
        },

        removeItem: (id, itemType) => {
          set((state) => ({
            items: state.items.filter((item) => {
              // If itemType is provided, match both id and itemType
              // Otherwise, just match id (for backward compatibility)
              if (itemType) {
                return !(item.id === id && item.itemType === itemType);
              }
              return item.id !== id;
            }),
          }));

          updateTotals();
        },

        updateQuantity: (id, quantity, itemType) => {
          if (quantity <= 0) {
            get().removeItem(id, itemType);
            return;
          }

          set((state) => ({
            items: state.items.map((item) => {
              // If itemType is provided, match both id and itemType
              // Otherwise, just match id (for backward compatibility)
              if (itemType) {
                return item.id === id && item.itemType === itemType
                  ? { ...item, quantity }
                  : item;
              }
              return item.id === id ? { ...item, quantity } : item;
            }),
          }));

          updateTotals();
        },

        clearCart: () => {
          set({
            items: [],
            totalItems: 0,
            totalPrice: 0,
          });
        },

        getItem: (id, itemType) => {
          const items = get().items;
          if (itemType) {
            return items.find(
              (item) => item.id === id && item.itemType === itemType
            );
          }
          return items.find((item) => item.id === id);
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

        getBookItems: () => {
          return get().items.filter((item) => item.itemType === "book");
        },

        getShopItems: () => {
          return get().items.filter((item) => item.itemType === "shop");
        },

        hasBookItems: () => {
          return get().items.some((item) => item.itemType === "book");
        },

        hasShopItems: () => {
          return get().items.some((item) => item.itemType === "shop");
        },

        getItemCount: (id, itemType) => {
          const item = get().getItem(id, itemType);
          return item ? item.quantity : 0;
        },

        isInCart: (id, itemType) => {
          return get().getItem(id, itemType) !== undefined;
        },
      };
    },
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
      // Recompute totals on hydration
      onRehydrateStorage: () => (state) => {
        if (state && state.items) {
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
