"use server";

import { ApiUrl } from "@/lib/utils";
import { Book, Genre, StoreProduct } from "@/types/interface";
import axios from "axios";

export interface SearchResults {
  books: Book[];
  genres: Genre[];
  products: StoreProduct[];
  total: number;
}

export const searchAll = async (
  query: string
): Promise<SearchResults | { error: string }> => {
  if (!query || query.trim().length === 0) {
    return {
      books: [],
      genres: [],
      products: [],
      total: 0,
    };
  }

  try {
    const [booksRes, genresRes, productsRes] = await Promise.all([
      searchBooks(query),
      searchGenres(query),
      searchProducts(query),
    ]);

    // Handle potential errors in responses
    const books = "error" in booksRes ? [] : booksRes;
    const genres = "error" in genresRes ? [] : genresRes;
    const products = "error" in productsRes ? [] : productsRes;

    return {
      books,
      genres,
      products,
      total: books.length + genres.length + products.length,
    };
  } catch (error) {
    console.error("Search error:", error);
    return { error: "Failed to perform search" };
  }
};

export const searchBooks = async (
  query: string
): Promise<Book[] | { error: string }> => {
  try {
    const res = await axios.get(
      `${ApiUrl}/api/books?search=${encodeURIComponent(query)}`
    );
    return res.data || [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to search books",
      };
    }
    return { error: "Failed to search books" };
  }
};

export const searchGenres = async (
  query: string
): Promise<Genre[] | { error: string }> => {
  try {
    const res = await axios.get(
      `${ApiUrl}/api/genres?search=${encodeURIComponent(query)}`
    );
    return res.data || [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to search genres",
      };
    }
    return { error: "Failed to search genres" };
  }
};

export const searchProducts = async (
  query: string
): Promise<StoreProduct[] | { error: string }> => {
  try {
    const res = await axios.get(
      `${ApiUrl}/api/shop?search=${encodeURIComponent(query)}`
    );
    return res.data || [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to search products",
      };
    }
    return { error: "Failed to search products" };
  }
};
