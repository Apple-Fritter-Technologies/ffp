"use server";

import { ApiUrl } from "@/lib/utils";
import axios from "axios";

export const getNewsletters = async () => {
  try {
    const res = await axios.get(`${ApiUrl}/api/newsletter`);

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch newsletters",
      };
    }
    return { error: "Failed to fetch newsletters" };
  }
};

export const subscribeToNewsletter = async (email: string) => {
  try {
    const res = await axios.post(`${ApiUrl}/api/newsletter`, { email });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.error || "Failed to subscribe to newsletter",
      };
    }
    return { error: "Failed to subscribe to newsletter" };
  }
};
