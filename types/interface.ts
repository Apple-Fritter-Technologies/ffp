export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  author?: string;
}

export interface Book {
  id: string;
  title: string;
  description?: string;
  price: number;
  genreId: string;
  author?: string;
  imageUrl?: string;
  buttonText?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  genre: {
    id: string;
    name: string;
  };
}

export interface Genre {
  id: string;
  name: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  books?: Book[];
}

export interface Podcast {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contact {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead?: boolean;
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
  recentOrders: Order[];
}

export interface Order {
  id: string;
  createdAt: string;
  // Add other order properties as needed
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  orders?: Order[];
  Contact?: Contact[];
}
