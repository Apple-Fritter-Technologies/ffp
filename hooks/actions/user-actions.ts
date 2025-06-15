"use server";

import { getSessionToken } from "@/lib/server-utils";
import { ApiUrl } from "@/lib/utils";

import axios from "axios";

export const getUsers = async () => {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return { error: "Unauthorized" };
    }

    const res = await axios.get(`${ApiUrl}/api/users`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch users",
      };
    }
    return { error: "Failed to fetch users" };
  }
};

export const getUserById = async (id: string) => {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return { error: "Unauthorized" };
    }

    const res = await axios.get(`${ApiUrl}/api/users?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch user",
      };
    }
    return { error: "Failed to fetch user" };
  }
};
