import { CartItem, CreateOrderData } from "@/types/interface";

export const prepareOrderDataFromCart = (
  cartItems: CartItem[]
): CreateOrderData => {
  const bookItems = cartItems
    .filter((item) => item.itemType === "book")
    .map((item) => ({
      bookId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

  const shopItems = cartItems
    .filter((item) => item.itemType === "shop")
    .map((item) => ({
      storeProductId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const hasPhysicalItems = cartItems.some(
    (item) => item.productType === "physical"
  );

  return {
    bookItems: bookItems.length > 0 ? bookItems : undefined,
    shopItems: shopItems.length > 0 ? shopItems : undefined,
    totalPrice,
    hasPhysicalItems,
  };
};

export const validateCartForCheckout = (
  cartItems: CartItem[]
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (cartItems.length === 0) {
    errors.push("Cart is empty");
  }

  const hasInvalidItems = cartItems.some(
    (item) => !item.id || !item.title || item.price <= 0 || item.quantity <= 0
  );

  if (hasInvalidItems) {
    errors.push("Cart contains invalid items");
  }

  // Check for missing item types
  const hasItemsWithoutType = cartItems.some((item) => !item.itemType);
  if (hasItemsWithoutType) {
    errors.push("Cart contains items without proper type classification");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getOrderSummary = (cartItems: CartItem[]) => {
  const bookItems = cartItems.filter((item) => item.itemType === "book");
  const shopItems = cartItems.filter((item) => item.itemType === "shop");

  const physicalItems = cartItems.filter(
    (item) => item.productType === "physical"
  );
  const digitalItems = cartItems.filter(
    (item) => item.productType === "digital"
  );

  return {
    bookCount: bookItems.length,
    shopCount: shopItems.length,
    totalItems: cartItems.length,
    physicalItemsCount: physicalItems.length,
    digitalItemsCount: digitalItems.length,
    hasBooks: bookItems.length > 0,
    hasShopProducts: shopItems.length > 0,
    hasPhysicalItems: physicalItems.length > 0,
    hasDigitalItems: digitalItems.length > 0,
    needsShipping: physicalItems.length > 0,
    totalValue: cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    categories: {
      books: {
        count: bookItems.length,
        value: bookItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      },
      shop: {
        count: shopItems.length,
        value: shopItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      },
    },
  };
};

// Helper to separate cart items by type for display
export const categorizeCartItems = (cartItems: CartItem[]) => {
  return {
    books: cartItems.filter((item) => item.itemType === "book"),
    shopProducts: cartItems.filter((item) => item.itemType === "shop"),
    physicalItems: cartItems.filter((item) => item.productType === "physical"),
    digitalItems: cartItems.filter((item) => item.productType === "digital"),
  };
};
