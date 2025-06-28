// Enums
export enum Role {
  user = "user",
  admin = "admin",
}

export enum OrderStatus {
  pending = "pending",
  completed = "completed",
  cancelled = "cancelled",
  processing = "processing",
  shipped = "shipped",
}

export enum ProductType {
  physical = "physical",
  digital = "digital",
}

// Base interfaces
export interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string | null;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
  orders?: Order[];
  contact?: Contact[];
  address?: Address[];
}

export interface Address {
  id: string;
  userId: string;
  name: string; // full name of the recipient
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
  order?: Order[];
}
export interface Book {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  genreId: string;
  author?: string | null;
  imageUrl?: string | null;
  buttonText?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  productType: ProductType;
  downloadUrl?: string | null;
  fileSize?: string | null;
  format?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  genre?: Genre;
  orderItems?: OrderItem[];
  isBundled?: boolean;
  bundleItems?: Book[];
  bundledInBooks?: Book[];
}

export type BookFormData = Omit<
  Book,
  "createdAt" | "updatedAt" | "bundleItems" | "bundledInBooks"
> & {
  bundleItems?: string[];
};

export interface Genre {
  id: string;
  name: string;
  displayOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
  books?: Book[];
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  author?: string;
  description?: string;
  productType?: "physical" | "digital";
  itemType?: "book" | "shop"; // New field to distinguish between books and shop products
  genreId?: string; // For books only
  genreName?: string; // Genre name for display
  isBundled?: boolean; // Whether this item is a bundle
  bundleItems?: Book[]; // Items included in bundle (if this is a bundle)
  bundleItemsCount?: number; // Number of items in bundle (for display)
  bundleType?: string; // Type of bundle (e.g., "Book Bundle", "Complete Series")
}

export interface Podcast {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  videoUrl: string;
  displayOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Contact {
  id: string;
  email: string;
  name: string;
  message: string;
  isRead: boolean;
  subject?: string | null;
  userId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  bookId: string;
  quantity: number;
  price: number;
  order?: Order;
  book?: Book;
}

export interface ShopOrderItem {
  id: string;
  orderId: string;
  storeProductId: string;
  quantity: number;
  price: number;
  order?: Order;
  storeProduct?: StoreProduct;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: OrderStatus;
  hasPhysicalItems: boolean;
  shippingAddressId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
  shippingAddress?: Address | null;
  orderItems?: OrderItem[];
  shopOrderItems?: ShopOrderItem[];
  payment?: Payment[] | null;
}

export interface Newsletter {
  id: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DashboardData {
  totalBooks: number;
  totalUsers: number;
  totalOrders: number;
  unreadMessages: number;
  totalGenres: number;
  totalPodcasts: number;
  totalStoreProducts: number;
  recentOrders: Order[];
  topSellingBooks: (Book & { salesCount: number })[];
  monthlyRevenue: { month: string; revenue: number }[];
  totalRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  ordersNeedingFulfillment: number;
  averageOrderValue: number;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: "succeeded" | "failed" | "pending";
  createdAt?: Date;
  updatedAt?: Date;
  order?: Order;
}

export interface CreateOrderData {
  bookItems?: {
    bookId: string;
    quantity: number;
    price: number;
  }[];
  shopItems?: {
    storeProductId: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  hasPhysicalItems: boolean;
  orderType?: "physical" | "digital";
  shippingAddress?: {
    id?: string;
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phone?: string;
  } | null;
}

export interface StoreProduct {
  id?: string;
  title: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  buttonText?: string | null;
  isAvailable: boolean;
  productType: ProductType;
  downloadUrl?: string | null;
  fileSize?: string | null;
  format?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  shopOrderItems?: ShopOrderItem[];
}

export interface HomeData {
  featuredBooks: Book[];
  bundleBooks: Book[];
  storeProducts: StoreProduct[];
  genres: GenresData;
  podcasts: Podcast[];
}

interface GenreItem {
  id: string;
  name: string;
  displayOrder?: number;
  booksCount: number;
}

export interface GenresData {
  items: GenreItem[];
  totalCount: number;
}

export interface AddressFormData {
  id?: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface StoreProductFormData {
  id?: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  buttonText?: string;
  isAvailable?: boolean;
  productType?: "physical" | "digital";
  downloadUrl?: string;
  fileSize?: string;
  format?: string;
}
