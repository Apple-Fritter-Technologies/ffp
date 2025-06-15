"use server";

import { ApiUrl } from "@/lib/utils";
import axios from "axios";

export const getHomeData = async () => {
  try {
    const res = await axios.get(`${ApiUrl}/api/home`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch home page data",
      };
    }
    return { error: "Failed to fetch home page data" };
  }
};
