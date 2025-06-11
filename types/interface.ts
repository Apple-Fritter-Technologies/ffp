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
}
