"use server";

import { getSessionToken } from "@/lib/server-utils";
import { ApiUrl } from "@/lib/utils";
import { Podcast } from "@/types/interface";
import axios from "axios";

export const getPodcasts = async () => {
  try {
    const res = await axios.get(`${ApiUrl}/api/podcasts`);

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch podcasts",
      };
    }
    return { error: "Failed to fetch podcasts" };
  }
};

export const getPodcastById = async (id: string) => {
  try {
    const res = await axios.get(`${ApiUrl}/api/podcasts?id=${id}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch podcast",
      };
    }
    return { error: "Failed to fetch podcast" };
  }
};

export const addPodcast = async (podcast: Podcast) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.post(`${ApiUrl}/api/podcasts`, podcast, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to add podcast",
      };
    }
    return { error: "Failed to add podcast" };
  }
};

export const updatePodcast = async (podcast: Podcast) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.put(
      `${ApiUrl}/api/podcasts?id=${podcast.id}`,
      podcast,
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update podcast",
      };
    }
    return { error: "Failed to update podcast" };
  }
};

export const deletePodcast = async (id: string) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.delete(`${ApiUrl}/api/podcasts?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to delete podcast",
      };
    }
    return { error: "Failed to delete podcast" };
  }
};
