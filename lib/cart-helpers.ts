import { Book, StoreProduct } from "@/types/interface";
import { useCart } from "@/store/use-cart";

// Helper function to add a book to cart
export const addBookToCart = (book: Book) => {
  const { addItem } = useCart.getState();

  addItem({
    id: book.id,
    title: book.title,
    price: book.price,
    image: book.imageUrl || undefined,
    author: book.author || undefined,
    description: book.description || undefined,
    productType: book.productType,
    itemType: "book",
    genreId: book.genreId,
  });
};

// Helper function to add a shop product to cart
export const addShopProductToCart = (product: StoreProduct) => {
  const { addItem } = useCart.getState();

  addItem({
    id: product.id!,
    title: product.title,
    price: product.price,
    image: product.imageUrl || undefined,
    description: product.description || undefined,
    productType: product.productType,
    itemType: "shop",
  });
};

// Helper function to remove book from cart
export const removeBookFromCart = (bookId: string) => {
  const { removeItem } = useCart.getState();
  removeItem(bookId, "book");
};

// Helper function to remove shop product from cart
export const removeShopProductFromCart = (productId: string) => {
  const { removeItem } = useCart.getState();
  removeItem(productId, "shop");
};

// Helper function to update book quantity in cart
export const updateBookQuantityInCart = (bookId: string, quantity: number) => {
  const { updateQuantity } = useCart.getState();
  updateQuantity(bookId, quantity, "book");
};

// Helper function to update shop product quantity in cart
export const updateShopProductQuantityInCart = (
  productId: string,
  quantity: number
) => {
  const { updateQuantity } = useCart.getState();
  updateQuantity(productId, quantity, "shop");
};

// Helper function to check if book is in cart
export const isBookInCart = (bookId: string): boolean => {
  const { isInCart } = useCart.getState();
  return isInCart(bookId, "book");
};

// Helper function to check if shop product is in cart
export const isShopProductInCart = (productId: string): boolean => {
  const { isInCart } = useCart.getState();
  return isInCart(productId, "shop");
};

// Helper function to get book quantity in cart
export const getBookQuantityInCart = (bookId: string): number => {
  const { getItemCount } = useCart.getState();
  return getItemCount(bookId, "book");
};

// Helper function to get shop product quantity in cart
export const getShopProductQuantityInCart = (productId: string): number => {
  const { getItemCount } = useCart.getState();
  return getItemCount(productId, "shop");
};

// Helper function to get cart item display info
export const getCartItemDisplayInfo = (item: any) => {
  const isBook = item.itemType === "book";
  const isShop = item.itemType === "shop";

  return {
    isBook,
    isShop,
    showAuthor: isBook && item.author,
    showGenre: isBook && item.genreId,
    badgeText: isBook ? "Book" : "Product",
    badgeVariant: isBook ? "secondary" : ("default" as const),
    icon: isBook ? "📚" : "🛍️",
  };
};

// Helper function to format cart summary
export const getCartSummary = () => {
  const {
    items,
    totalItems,
    totalPrice,
    getBookItems,
    getShopItems,
    hasPhysicalItems,
    hasDigitalItems,
  } = useCart.getState();

  const bookItems = getBookItems();
  const shopItems = getShopItems();

  return {
    totalItems,
    totalPrice,
    itemCount: items.length,
    bookCount: bookItems.length,
    shopCount: shopItems.length,
    hasBooks: bookItems.length > 0,
    hasShopProducts: shopItems.length > 0,
    hasPhysicalItems: hasPhysicalItems(),
    hasDigitalItems: hasDigitalItems(),
    needsShipping: hasPhysicalItems(),
  };
};
