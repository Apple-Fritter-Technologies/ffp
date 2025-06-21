"use server";

import { getSessionToken } from "@/lib/server-utils";
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
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.post(
      `${ApiUrl}/api/newsletter`,
      { email },
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    );

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
