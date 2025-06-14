"use server";

import { getSessionToken } from "@/lib/server-utils";
import { ApiUrl } from "@/lib/utils";
import { User } from "@/types/interface";

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

export const addUser = async (user: Partial<User>) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.post(`${ApiUrl}/api/users`, user, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to add user",
      };
    }
    return { error: "Failed to add user" };
  }
};

export const updateUser = async (user: Partial<User> & { id: string }) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.put(`${ApiUrl}/api/users?id=${user.id}`, user, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update user",
      };
    }
    return { error: "Failed to update user" };
  }
};

export const deleteUser = async (id: string) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.delete(`${ApiUrl}/api/users?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to delete user",
      };
    }
    return { error: "Failed to delete user" };
  }
};
