"use server";

import { getSessionToken } from "@/lib/server-utils";
import { ApiUrl } from "@/lib/utils";
import { Genre } from "@/types/interface";
import axios from "axios";

export const getGenres = async () => {
  try {
    const res = await axios.get(`${ApiUrl}/api/genres`);

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch genres",
      };
    }
    return { error: "Failed to fetch genres" };
  }
};

export const getGenreById = async (id: string) => {
  try {
    const res = await axios.get(`${ApiUrl}/api/genres?id=${id}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch genre",
      };
    }
    return { error: "Failed to fetch genre" };
  }
};

export const addGenre = async (genre: Genre) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.post(`${ApiUrl}/api/genres`, genre, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to add genre",
      };
    }
    return { error: "Failed to add genre" };
  }
};

export const updateGenre = async (genre: Genre) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.put(`${ApiUrl}/api/genres?id=${genre.id}`, genre, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update genre",
      };
    }
    return { error: "Failed to update genre" };
  }
};

export const reorderGenres = async (orderedIds: string[]) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.patch(
      `${ApiUrl}/api/genres`,
      { orderedIds },
      { headers: { Authorization: `Bearer ${sessionToken}` } }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to reorder genres",
      };
    }
    return { error: "Failed to reorder genres" };
  }
};

export const deleteGenre = async (id: string) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.delete(`${ApiUrl}/api/genres?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to delete genre",
      };
    }
    return { error: "Failed to delete genre" };
  }
};
