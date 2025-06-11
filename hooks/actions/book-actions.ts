"use server";

import { getSessionToken } from "@/lib/server-utils";
import { ApiUrl } from "@/lib/utils";
import { Book } from "@/types/interface";
import axios from "axios";

export const getBooks = async () => {
  try {
    const res = await axios.get(`${ApiUrl}/api/books`);

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch books",
      };
    }
    return { error: "Failed to fetch books" };
  }
};

export const getBooksById = async (id: string) => {
  try {
    const res = await axios.get(`${ApiUrl}/api/books?id=${id}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch book",
      };
    }
    return { error: "Failed to fetch book" };
  }
};

export const addBook = async (book: Book) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.post(`${ApiUrl}/api/books`, book, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to add book",
      };
    }
    return { error: "Failed to add book" };
  }
};

export const updateBook = async (book: Book) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.put(`${ApiUrl}/api/books`, book, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update book",
      };
    }
    return { error: "Failed to update book" };
  }
};

export const deleteBook = async (id: string) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.delete(`${ApiUrl}/api/books?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to delete book",
      };
    }
    return { error: "Failed to delete book" };
  }
};
