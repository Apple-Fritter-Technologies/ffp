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
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
  genre?: Genre;
  orderItems?: OrderItem[];
}

export interface Genre {
  id: string;
  name: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
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
}

export interface Podcast {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  videoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  email: string;
  name: string;
  message: string;
  isRead: boolean;
  subject?: string | null;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User | null;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: OrderStatus;
  hasPhysicalItems: boolean;
  shippingAddressId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  shippingAddress?: Address | null;
  orderItems?: OrderItem[];
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

export interface Newsletter {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardData {
  totalBooks: number;
  totalUsers: number;
  totalOrders: number;
  unreadMessages: number;
  totalGenres: number;
  totalPodcasts: number;
  recentOrders: Order[];
  topSellingBooks: (Book & { salesCount: number })[];
  monthlyRevenue: { month: string; revenue: number }[];
  totalRevenue: number;
}
